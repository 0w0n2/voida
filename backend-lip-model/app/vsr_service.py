"""
VSRService with FULL OpenVINO Acceleration for both Encoder and Decoder.
This is the final, optimized version.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import torch
import os
import argparse
import io
import av
import numpy as np
import openvino as ov
from openvino import properties as ov_properties
import logging  # 표준 로깅 모듈 사용
from typing import List, Dict, Any

# 로거 설정
logger = logging.getLogger(__name__)

from core.lightning import ModelModule
from core.datamodule.transforms import VideoTransform, TextTransform
from core.preparation.detectors.mediapipe.detector import LandmarksDetector
from core.preparation.detectors.mediapipe.video_process import VideoProcess
from .config import settings

# --- Beam Search Components ---
from core.espnet.nets.beam_search import BeamSearch
from core.espnet.nets.scorer_interface import ScorerInterface
from core.espnet.nets.scorers.ctc import CTCPrefixScorer
from core.espnet.nets.scorers.length_bonus import LengthBonus
from core.espnet.nets.pytorch_backend.transformer.mask import subsequent_mask


# --- Model Paths ---
MODEL_DIR = "models"
PYTORCH_MODEL_PATH = os.path.join(MODEL_DIR, "vsr_trlrs2lrs3vox2avsp_base.pth")
OV_ENCODER_PATH = os.path.join(MODEL_DIR, "encoder_int8.xml")
OV_DECODER_PATH = os.path.join(MODEL_DIR, "decoder_int8.xml")


class OpenVINOBeamSearchScorer(ScorerInterface):
    """A custom scorer that uses an OpenVINO-accelerated decoder."""

    def __init__(self, compiled_decoder, pytorch_decoder_config):
        self.compiled_decoder = compiled_decoder
        self.pytorch_decoder = pytorch_decoder_config
        self.infer_request = self.compiled_decoder.create_infer_request()
        self.num_layers = len(self.pytorch_decoder.decoders)

    def score(self, ys, state, x):
        """Wraps batch_score for single hypothesis processing."""
        ys_batch = ys.unsqueeze(0)
        xs_batch = x.unsqueeze(0)
        states_batch = [state]
        logp_batch, new_states_batch = self.batch_score(
            ys_batch, states_batch, xs_batch
        )
        return logp_batch.squeeze(0), new_states_batch[0]

    def batch_score(
        self, ys: torch.Tensor, states: List[Any], xs: torch.Tensor
    ) -> (torch.Tensor, List[Any]):
        """Scores a batch of hypotheses using the OpenVINO model."""
        n_batch = ys.shape[0]

        if states[0] is None:
            batch_state = [
                torch.zeros(
                    (n_batch, 0, self.pytorch_decoder.decoders[0].size),
                    dtype=torch.float32,
                )
                for _ in range(self.num_layers)
            ]
        else:
            batch_state = [
                torch.stack([states[b][l] for b in range(n_batch)])
                for l in range(self.num_layers)
            ]

        # This is the CRITICAL FIX: Ensure tgt_mask has the correct 3D shape.
        tgt_mask = subsequent_mask(ys.shape[-1], device=ys.device).unsqueeze(0).numpy()

        inputs = {"tgt": ys.numpy(), "tgt_mask": tgt_mask, "memory": xs.numpy()}
        for i, state in enumerate(batch_state):
            inputs[f"cache_in_{i}"] = state.numpy()

        results = self.infer_request.infer(inputs)

        logp = torch.from_numpy(results[self.compiled_decoder.output("output_logp")])
        new_states = [
            torch.from_numpy(results[self.compiled_decoder.output(f"cache_out_{i}")])
            for i in range(self.num_layers)
        ]

        state_list = [
            [new_states[l][b] for l in range(self.num_layers)] for b in range(n_batch)
        ]
        return logp, state_list


class VSRService:
    def __init__(self, detector="mediapipe"):
        logger.info("Initializing VSR Service with FULL INT8 OpenVINO backend...")
        self.device = torch.device("cpu")

        core = ov.Core()

        encoder_model = core.read_model(OV_ENCODER_PATH)
        config = {
            ov_properties.hint.performance_mode(): ov_properties.hint.PerformanceMode.LATENCY,
            ov_properties.inference_num_threads(): 1,
        }
        self.compiled_encoder = core.compile_model(encoder_model, "CPU", config)

        decoder_model = core.read_model(OV_DECODER_PATH)
        self.compiled_decoder = core.compile_model(decoder_model, "CPU", config)

        self.modelmodule = self._load_pytorch_model()
        self.modelmodule.to(self.device)
        self.modelmodule.eval()

        self.pytorch_model = self.modelmodule.model
        self.text_transform = TextTransform()

        self.video_process = VideoProcess(convert_gray=False)
        self.video_transform = VideoTransform(subset="test")

    def _load_pytorch_model(self):
        hparams = argparse.Namespace(modality="video")
        modelmodule = ModelModule(hparams)
        checkpoint = torch.load(PYTORCH_MODEL_PATH, map_location="cpu")
        modelmodule.model.load_state_dict(
            checkpoint.get("state_dict", checkpoint), strict=False
        )
        return modelmodule

    def _load_video_from_memory(self, video_content: bytes):
        frames = []
        with io.BytesIO(video_content) as video_buffer, av.open(
            video_buffer, mode="r"
        ) as container:
            for frame in container.decode(video=0):
                frames.append(frame.to_rgb().to_ndarray())
        if not frames:
            raise ValueError("Could not decode any frames.")
        return np.stack(frames)

    def predict(self, video_content: bytes) -> str:
        try:
            # --- 1. Pre-processing ---
            video = self._load_video_from_memory(video_content)
            landmarks_detector = LandmarksDetector()
            landmarks = landmarks_detector(video)
            video = self.video_process(video, landmarks)

            if video is None:
                return ""

            video_tensor = torch.from_numpy(np.array(video)).permute(0, 3, 1, 2)
            video_tensor = self.video_transform(video_tensor).unsqueeze(0)

            # --- 2. PyTorch Frontend ---
            with torch.no_grad():
                encoder_input = self.pytorch_model.proj_encoder(
                    self.pytorch_model.frontend(video_tensor)
                )

            # --- 3. OpenVINO Encoder ---
            encoder_infer_request = self.compiled_encoder.create_infer_request()
            encoder_output = encoder_infer_request.infer(encoder_input)[
                self.compiled_encoder.output(0)
            ]
            hs_pad = torch.from_numpy(encoder_output)

            # --- 4. OpenVINO Decoder (Beam Search) ---
            scorers = {
                "decoder": OpenVINOBeamSearchScorer(
                    self.compiled_decoder, self.pytorch_model.decoder
                ),
                "ctc": CTCPrefixScorer(self.pytorch_model.ctc, self.pytorch_model.eos),
                "length_bonus": LengthBonus(len(self.text_transform.token_list)),
            }
            beam_search = BeamSearch(
                beam_size=10,
                vocab_size=len(self.text_transform.token_list),
                weights={"decoder": 1.0, "ctc": 0.5, "length_bonus": 0.5},
                scorers=scorers,
                sos=self.pytorch_model.sos,
                eos=self.pytorch_model.eos,
                token_list=self.text_transform.token_list,
            )
            with torch.no_grad():
                nbest_hyps = beam_search(hs_pad.squeeze(0))

            if not nbest_hyps:
                transcript = ""
            else:
                nbest_hyps = [h.asdict() for h in nbest_hyps[:1]]
                token_id = torch.tensor(list(map(int, nbest_hyps[0]["yseq"][1:])))
                transcript = self.text_transform.post_process(token_id).replace(
                    "<eos>", ""
                )

            return transcript

        except Exception:
            # 모든 예외를 간단히 처리 - 빈 문자열 반환
            return ""
