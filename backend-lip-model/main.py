from fastapi import FastAPI
from fastapi.responses import JSONResponse

# FastAPI 애플리케이션 인스턴스 생성
app = FastAPI(
    title="Bbusyeo - Backend Lip Model API",
    description="API for the Bbusyeo lip model backend service",
)


# 루트 경로 ("/")로 GET 요청이 올 때 처리할 함수
@app.get("/")
def read_root():
    """
    서버의 루트 URL에 접속했을 때 간단한 환영 메시지를 반환합니다.
    """
    return {"message": "Hello, FastAPI!"}


@app.get("/health-check", tags=["Health"])
def health_check():
    return JSONResponse(content={"status": "ok"})
