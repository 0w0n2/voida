import uvicorn
from fastapi import (
    FastAPI,
    UploadFile,
    File,
    HTTPException,
    Depends,
    Form,
    APIRouter,
    Response,
)
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.concurrency import run_in_threadpool
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import time
import jwt
import io
import av
import logging
import base64
import json
import struct
from openai import OpenAI

# 로거 설정
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler(),
    ],
)
logger = logging.getLogger(__name__)

from .config import (
    JWT_SECRET_KEY,
    MAX_VIDEO_DURATION,
    ALLOWED_ORIGINS,
    OPENAI_API_KEY,
    OPENAI_BASE_URL,
)
from .argos_runtime import get_en2ko_translator, translate_en_to_ko

# JWT 보안 설정
security = HTTPBearer()

# 허용된 JWT 알고리즘 목록 (보안상 제한)
ALLOWED_ALGORITHMS = ["HS256", "HS384", "HS512", "RS256", "RS384", "RS512"]

# 전역 서비스 객체 저장소
services = {}


def get_jwt_algorithm_from_token(token: str) -> str:
    """JWT 토큰 헤더에서 알고리즘 추출"""
    try:
        # PyJWT의 내장 함수로 헤더 추출 (서명 검증 없이)
        header = jwt.get_unverified_header(token)
        algorithm = header.get("alg")

        if not algorithm or algorithm not in ALLOWED_ALGORITHMS:
            return "HS256"  # 기본값

        return algorithm
    except Exception:
        return "HS256"  # 기본값


def verify_jwt_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """JWT 토큰을 검증하는 의존성 함수"""
    try:
        token = credentials.credentials

        # 토큰이 비어있는지 확인
        if not token or token.strip() == "":
            raise HTTPException(
                status_code=401,
                detail={"error": "EMPTY_TOKEN", "message": "토큰이 비어있습니다."},
            )

        # JWT 헤더에서 알고리즘 동적 추출
        algorithm = get_jwt_algorithm_from_token(token)

        # SpringBoot와 호환을 위해 Base64 디코딩된 키 사용
        try:
            decoded_key = base64.b64decode(JWT_SECRET_KEY)
        except:
            # Base64 디코딩 실패 시 원본 키 사용
            decoded_key = JWT_SECRET_KEY.encode("utf-8")

        # JWT 토큰 디코딩 및 검증
        payload = jwt.decode(
            token,
            decoded_key,
            algorithms=[algorithm],
            options={"verify_exp": True},
        )

        # 필수 클레임 확인
        if "sub" not in payload:
            raise HTTPException(
                status_code=401,
                detail={
                    "error": "MISSING_SUB_CLAIM",
                    "message": "토큰에 사용자 정보가 없습니다.",
                },
            )

        return payload

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=401,
            detail={"error": "TOKEN_EXPIRED", "message": "토큰이 만료되었습니다."},
        )
    except jwt.InvalidSignatureError:
        raise HTTPException(
            status_code=401,
            detail={
                "error": "INVALID_SIGNATURE",
                "message": "토큰 서명이 유효하지 않습니다.",
            },
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=401,
            detail={"error": "INVALID_TOKEN", "message": "유효하지 않은 토큰입니다."},
        )
    except HTTPException:
        # 이미 처리된 HTTP 예외는 다시 발생
        raise
    except Exception as e:
        logger.error(f"Token verification error: {e}")
        raise HTTPException(
            status_code=401,
            detail={
                "error": "VERIFICATION_ERROR",
                "message": "토큰 검증 중 오류가 발생했습니다.",
            },
        )


def get_video_duration_fast(video_content: bytes) -> float:
    """
    PyAV를 사용하여 동영상 길이를 빠르게 확인
    디스크 I/O 없이 메모리에서 직접 처리
    """
    try:
        with io.BytesIO(video_content) as video_buffer, av.open(
            video_buffer, mode="r"
        ) as container:
            # 메타데이터에서 길이 정보 추출 (실제 프레임 디코딩 없음)
            duration = (
                float(container.duration) / av.time_base if container.duration else 0
            )

            # duration이 없으면 프레임 수와 fps로 계산
            if duration == 0:
                video_stream = container.streams.video[0]
                if video_stream.frames > 0:
                    fps = float(video_stream.average_rate)
                    duration = video_stream.frames / fps if fps > 0 else 0

            return duration
    except Exception:
        # 동영상 파일이 손상되었거나 읽을 수 없는 경우
        return 0.0  # 길이를 알 수 없으면 0 반환


@asynccontextmanager
async def lifespan(app: FastAPI):
    # VSR 서비스 초기화
    from .vsr_service import VSRService

    services["vsr_pipeline"] = VSRService(detector="mediapipe")
    # Argos 번역기 초기화 (실패 시 무시하고 서비스 계속)
    try:
        translator = get_en2ko_translator()
        services["argos_translator"] = translator
        logger.info("Argos en→ko translator initialized")
    except Exception as e:
        logger.warning(f"Argos translator not initialized: {e}")
    # OpenAI TTS 클라이언트 초기화 (CPU 환경: 재사용 가능하도록 lifespan에 보관)
    try:
        if OPENAI_API_KEY:
            client = OpenAI(api_key=OPENAI_API_KEY, base_url=OPENAI_BASE_URL or None)
            services["openai_client"] = client
            logger.info("OpenAI TTS client initialized")
        else:
            logger.warning("OPENAI_API_KEY is empty; TTS will be skipped")
    except Exception as e:
        logger.warning(f"OpenAI client init failed: {e}")
    yield
    # 서비스 정리
    services.clear()


app = FastAPI(
    title="Bbusyeo - Backend AI API",
    description="Voida AI Test Server API Docs",
    lifespan=lifespan,
)

router = APIRouter()

origins = ALLOWED_ORIGINS.split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # credentials=True면 '*' 금지
    allow_credentials=True,  # 쿠키/Authorization 쓰면 True
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"],  # 필요할 때만
    max_age=86400,
)


@app.post("/v1/lip", tags=["AI"])
async def run_inference(
    videoFile: UploadFile = File(
        ..., description="A video file (e.g., webm, mov, avi)"
    ),
    sessionNumber: str = Form(..., description="A unique session identifier"),
    token_payload: dict = Depends(verify_jwt_token),
):
    """
    비디오 파일과 세션 번호를 업로드하여 음성 인식을 수행합니다.
    JWT 토큰 인증이 필요합니다.
    """
    # JWT의 sub에서 사용자 UUID 추출 (대소문자 혼용 대비)
    member_uuid = token_payload.get("sub") or token_payload.get("SUB")

    def build_envelope(meta: dict, audio_bytes: bytes) -> Response:
        json_bytes = json.dumps(meta, ensure_ascii=False).encode("utf-8")
        prefix = struct.pack(">I", len(json_bytes))
        body = prefix + json_bytes + (audio_bytes or b"")
        return Response(content=body, media_type="application/octet-stream")

    if not videoFile.content_type.startswith("video/"):
        meta = {
            "videoResult": False,
            "sessionNumber": sessionNumber,
            "memberUuid": member_uuid,
            "transText": "",
            "error": {
                "code": "INVALID_FILE_TYPE",
                "message": "동영상 파일만 업로드 가능합니다.",
            },
        }
        return build_envelope(meta, b"")

    try:
        # 1. 메모리로 비디오 콘텐츠 읽기
        video_content = await videoFile.read()

        # 2. 빠른 동영상 길이 검증
        duration = get_video_duration_fast(video_content)
        if duration > MAX_VIDEO_DURATION:
            meta = {
                "videoResult": False,
                "sessionNumber": sessionNumber,
                "memberUuid": member_uuid,
                "transText": "",
                "error": {
                    "code": "VIDEO_TOO_LONG",
                    "message": f"동영상 길이({duration:.1f}초)가 최대 허용 시간({MAX_VIDEO_DURATION}초)을 초과합니다.",
                },
            }
            return build_envelope(meta, b"")

        # 3. VSR 처리
        vsr_pipeline = services["vsr_pipeline"]
        transcript = await run_in_threadpool(vsr_pipeline.predict, video_content)

        # 빈 문자열이면 실패로 처리
        if transcript == "":
            meta = {
                "videoResult": False,
                "sessionNumber": sessionNumber,
                "memberUuid": member_uuid,
                "transText": "",
            }
            return build_envelope(meta, b"")
        else:
            # 번역은 경량이지만, 안정적 동시성을 위해 스레드풀에서 수행
            ko_transcript = await run_in_threadpool(translate_en_to_ko, transcript)

            # OpenAI TTS 생성 (비동기 이벤트 루프 차단 방지 위해 스레드풀에서 실행)
            audio_bytes = b""
            try:
                openai_client = services.get("openai_client")
                if openai_client and ko_transcript:

                    def _tts_create():
                        return openai_client.audio.speech.create(
                            model="gpt-4o-mini-tts",
                            voice="alloy",
                            input=ko_transcript,
                            response_format="mp3",
                        )

                    tts_response = await run_in_threadpool(_tts_create)
                    audio_bytes = getattr(tts_response, "content", None)
                    if audio_bytes is None:
                        # 일부 SDK 버전 호환 처리
                        try:
                            audio_bytes = tts_response.read()  # type: ignore[attr-defined]
                        except Exception:
                            audio_bytes = b""
            except Exception as e:
                logger.warning(f"TTS synthesis failed: {e}")
                audio_bytes = b""

            meta = {
                "videoResult": True,
                "sessionNumber": sessionNumber,
                "memberUuid": member_uuid,
                # 한글 번역 텍스트만 반환
                "transText": ko_transcript,
                # 클라이언트가 Blob MIME을 알 수 있도록 메타 포함
                "audioMime": "audio/mpeg" if audio_bytes else None,
            }
            return build_envelope(meta, audio_bytes)

    except Exception as e:
        meta = {
            "videoResult": False,
            "sessionNumber": sessionNumber,
            "memberUuid": member_uuid,
            "transText": "",
            "error": {"code": "INTERNAL_ERROR", "message": str(e)},
        }
        return build_envelope(meta, b"")


@app.get("/health", tags=["Check"])
def health_check():
    """
    서비스 상태를 확인합니다.
    """
    try:
        # VSR 서비스가 정상적으로 로드되어 있는지 확인
        if "vsr_pipeline" not in services:
            return {"status": "unhealthy", "reason": "VSR service not loaded"}

        return {"status": "healthy", "timestamp": time.time()}
    except Exception as e:
        return {"status": "unhealthy", "reason": str(e)}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
