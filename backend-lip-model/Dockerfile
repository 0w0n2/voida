# =============================================
# 1. Builder Stage: 의존성 설치 및 빌드
# =============================================
FROM python:3.9-slim-bullseye as builder

# 시스템 패키지 업데이트 및 필수 라이브러리 설치
# requirements.txt에 명시된 시스템 의존성을 설치합니다.
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    ffmpeg \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# 파이썬 가상환경 생성 및 경로 설정
ENV VIRTUAL_ENV=/opt/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# requirements.txt 파일을 먼저 복사하고 의존성을 설치합니다.
# 이렇게 하면 소스 코드가 변경되어도 pip install을 다시 실행하지 않아 캐시를 효율적으로 사용할 수 있습니다.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# =============================================
# 2. Final Stage: 실제 운영 환경
# =============================================
FROM python:3.9-slim

# 시스템 필수 라이브러리 설치 (빌드 도구 제외)
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    libgl1 \
    libglib2.0-0 \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# 작업 디렉토리 설정
WORKDIR /app

# Builder 스테이지에서 생성된 가상환경 복사
COPY --from=builder /opt/venv /opt/venv

# 가상환경 경로 설정
ENV VIRTUAL_ENV=/opt/venv
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# 애플리케이션 코드와 모델 파일 복사
# .dockerignore 파일에 의해 불필요한 파일은 제외됩니다.
COPY ./app ./app
COPY ./models ./models
COPY .env .

# Gunicorn 실행
ENV PORT=8000 WORKERS=2 TIMEOUT=120

CMD ["sh", "-c", "gunicorn app.main:app --workers ${WORKERS} --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:${PORT} --timeout ${TIMEOUT}"]
