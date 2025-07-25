import axios from "axios";

const apiInstance = axios.create({
  baseURL: import.meta.env.JSON_SERVER || "http://localhost:3003",
  withCredentials: true,
  timeout: 5000,
});

apiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error("네트워크 에러 또는 서버 응답 없음");
      alert("서버와 연결할 수 없습니다. 인터넷을 확인해주세요.");
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    switch (status) {
      case 400:
        console.warn(
          "잘못된 요청:",
          data.message || "입력값을 다시 확인해주세요."
        );
        break;
      case 401:
        alert("로그인이 필요합니다.");
        break;
      case 403:
        alert("접근 권한이 없습니다.");
        break;
      case 404:
        alert("요청한 정보를 찾을 수 없습니다.");
        break;
      case 500:
        alert("서버 오류입니다. 잠시 후 다시 시도해주세요.");
        break;
      default:
        alert(data?.message || "알 수 없는 오류가 발생했습니다.");
        break;
    }

    return Promise.reject(error);
  }
);

export default apiInstance;
