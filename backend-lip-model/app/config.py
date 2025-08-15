import argparse
import os
from pathlib import Path
from dotenv import load_dotenv

# 프로젝트의 기본 경로를 설정합니다.
BASE_DIR = Path(__file__).resolve().parent.parent

# 기본 경로 기준 .evn 파일 로드
load_dotenv(BASE_DIR / ".env")

# 모델 파일 경로
MODEL_PATH = BASE_DIR / "models/vsr_trlrs2lrs3vox2avsp_base.pth"
TOKENIZER_PATH = BASE_DIR / "models/unigram5000.model"

# JWT 설정 - .env 파일에서 로드
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "")
# CORS 설정
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "")

# 서비스 제한 설정 (고정값)
MAX_VIDEO_DURATION = 7.0

# OpenAI
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_BASE_URL = os.getenv("OPENAI_BASE_URL", "")


def create_model_config():
    args = argparse.Namespace()

    # 모델 관련 설정
    args.modality = "video"
    args.ctc_weight = 0.1
    args.pretrained_model_path = None
    args.transfer_frontend = False
    args.transfer_encoder = False

    # 훈련 관련 설정 (configure_optimizers에서 사용)
    args.lr = 0.001
    args.weight_decay = 0.01
    args.warmup_epochs = 10
    args.max_epochs = 100

    return args


settings = create_model_config()
