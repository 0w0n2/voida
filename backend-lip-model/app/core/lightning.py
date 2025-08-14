import torch
import torchaudio
from app.core.cosine import WarmupCosineScheduler
from .datamodule.transforms import TextTransform

from .espnet.nets.pytorch_backend.e2e_asr_conformer import E2E
from .espnet.nets.pytorch_backend.nets_utils import get_beam_search_decoder
from pytorch_lightning import LightningModule


def compute_word_level_distance(seq1, seq2):
    seq1, seq2 = seq1.lower().split(), seq2.lower().split()
    return torchaudio.functional.edit_distance(seq1, seq2)


class ModelModule(LightningModule):
    def __init__(self, args):
        super().__init__()
        self.args = args
        self.save_hyperparameters(args)

        self.modality = args.modality
        self.text_transform = TextTransform()
        self.token_list = self.text_transform.token_list

        self.model = E2E(
            len(self.token_list),
            self.modality,
            ctc_weight=getattr(args, "ctc_weight", 0.1),
        )

        # -- initialise
        if getattr(args, "pretrained_model_path", None):
            ckpt = torch.load(
                args.pretrained_model_path, map_location=lambda storage, loc: storage
            )
            if getattr(args, "transfer_frontend", False):
                tmp_ckpt = {
                    k: v
                    for k, v in ckpt["model_state_dict"].items()
                    if k.startswith("trunk.") or k.startswith("frontend3D.")
                }
                self.model.frontend.load_state_dict(tmp_ckpt)
                # info-level 로깅으로 변경 (운영 시 print 제거)
                # logging.getLogger(__name__).info("Frontend pretrained weights loaded")
            elif getattr(args, "transfer_encoder", False):
                tmp_ckpt = {
                    k.replace("frontend.", ""): v
                    for k, v in ckpt.items()
                    if k.startswith("frontend.")
                }
                self.model.frontend.load_state_dict(tmp_ckpt)
                tmp_ckpt = {
                    k.replace("proj_encoder.", ""): v
                    for k, v in ckpt.items()
                    if k.startswith("proj_encoder.")
                }
                self.model.proj_encoder.load_state_dict(tmp_ckpt)
                tmp_ckpt = {
                    k.replace("encoder.", ""): v
                    for k, v in ckpt.items()
                    if k.startswith("encoder.")
                }
                self.model.encoder.load_state_dict(tmp_ckpt)
                # logging.getLogger(__name__).info("Frontend/Proj_Encoder/Encoder pretrained weights loaded")
            else:
                self.model.load_state_dict(ckpt)
                # logging.getLogger(__name__).info("Full model pretrained weights loaded")

    def configure_optimizers(self):
        optimizer = torch.optim.AdamW(
            self.model.parameters(),
            lr=self.args.lr,
            weight_decay=self.args.weight_decay,
            betas=(0.9, 0.98),
        )
        scheduler = WarmupCosineScheduler(
            optimizer,
            self.args.warmup_epochs,
            self.args.max_epochs,
            len(self.trainer.datamodule.train_dataloader())
            / self.trainer.num_devices
            / self.trainer.num_nodes,
        )
        scheduler = {"scheduler": scheduler, "interval": "step"}
        return [optimizer], [scheduler]

    def forward(self, sample):
        # This forward is now only used if the service is run without OpenVINO.
        # The main hybrid inference logic is in vsr_service.py.
        x = self.model.frontend(sample.unsqueeze(0))
        x = self.model.proj_encoder(x)
        enc_feat, _ = self.model.encoder(x, None)
        predicted = self.model.decode(enc_feat)
        return predicted

    def validation_step(self, batch, batch_idx):
        return self._step(batch, batch_idx, step_type="val")

    def test_step(self, sample, sample_idx):
        x = self.model.frontend(sample["input"].unsqueeze(0))
        x = self.model.proj_encoder(x)
        enc_feat, _ = self.model.encoder(x, None)
        enc_feat = enc_feat.squeeze(0)
        nbest_hyps = self.beam_search(enc_feat)
        nbest_hyps = [h.asdict() for h in nbest_hyps[: min(len(nbest_hyps), 1)]]
        predicted_token_id = torch.tensor(list(map(int, nbest_hyps[0]["yseq"][1:])))
        predicted = self.text_transform.post_process(predicted_token_id).replace(
            "<eos>", ""
        )

        actual_token_id = sample["target"]
        actual = self.text_transform.post_process(actual_token_id)

        self.total_edit_distance += compute_word_level_distance(actual, predicted)
        self.total_length += len(actual.split())
        return

    def training_step(self, batch, batch_idx):
        loss = self._step(batch, batch_idx, "train")
        batch_size = batch["inputs"].size(0)
        batch_sizes = self.all_gather(batch_size)
        loss *= batch_sizes.size(0) / batch_sizes.sum()  # world size / batch size

        self.log("monitoring_step", torch.tensor(self.global_step, dtype=torch.float32))

        return loss

    def _step(self, batch, batch_idx, step_type):
        loss, loss_ctc, loss_att, acc = self.model(
            batch["inputs"], batch["input_lengths"], batch["targets"]
        )
        batch_size = len(batch["inputs"])

        if step_type == "train":
            self.log("loss", loss, on_step=True, on_epoch=True, batch_size=batch_size)
            self.log(
                "loss_ctc",
                loss_ctc,
                on_step=False,
                on_epoch=True,
                batch_size=batch_size,
                sync_dist=True,
            )
            self.log(
                "loss_att",
                loss_att,
                on_step=False,
                on_epoch=True,
                batch_size=batch_size,
                sync_dist=True,
            )
            self.log(
                "decoder_acc",
                acc,
                on_step=True,
                on_epoch=True,
                batch_size=batch_size,
                sync_dist=True,
            )
        else:
            self.log("loss_val", loss, batch_size=batch_size, sync_dist=True)
            self.log("loss_ctc_val", loss_ctc, batch_size=batch_size, sync_dist=True)
            self.log("loss_att_val", loss_att, batch_size=batch_size, sync_dist=True)
            self.log("decoder_acc_val", acc, batch_size=batch_size, sync_dist=True)

        if step_type == "train":
            self.log(
                "monitoring_step", torch.tensor(self.global_step, dtype=torch.float32)
            )

        return loss

    def on_test_epoch_start(self):
        self.total_length = 0
        self.total_edit_distance = 0
        self.text_transform = TextTransform()
        self.beam_search = get_beam_search_decoder(
            self.model, self.token_list, ctc_weight=0.1
        )

    def on_test_epoch_end(self):
        self.log("wer", self.total_edit_distance / self.total_length)
