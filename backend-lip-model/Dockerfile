# =============================================
# 1. Builder Stage: 의존성 설치 및 빌드
# =============================================
FROM python:3.9-slim-bullseye as builder

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port $PORT"]