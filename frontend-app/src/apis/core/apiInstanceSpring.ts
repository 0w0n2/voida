import axios from 'axios';
import { reissueToken } from '@/apis/auth/authApi';
import { useAlertStore } from '@/stores/useAlertStore';

const apiInstanceSpring = axios.create({
  baseURL: import.meta.env.VITE_SPRING_API_URL,
  withCredentials: true,
  timeout: 5000,
});

apiInstanceSpring.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    const excludedUrls = [
      '/v1/auth/email-code',
      '/v1/auth/verify-email',
      '/v1/auth/check-nickname',
      '/v1/auth/check-email',
      '/v1/auth/reissue',
    ];
    if (token && !excludedUrls.includes(config.url || '')) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiInstanceSpring.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      console.error('네트워크 에러 또는 서버 응답 없음');
      useAlertStore
        .getState()
        .showAlert('서버와 연결할 수 없습니다. 인터넷을 확인해주세요..', 'top');
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    switch (status) {
      case 400:
        useAlertStore.getState().showAlert(data.message || '입력값을 다시 확인해주세요.', 'top');
        break;
      case 401:
        const response = await reissueToken();
        console.log('토큰 재발급 성공:', response.data);
        if (!originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const response = await reissueToken();
            console.log(response);
            localStorage.setItem('accessToken', response.headers.authorization);
            originalRequest.headers.Authorization = `Bearer ${response.headers.authorization}`;
            return apiInstanceSpring(originalRequest);
          } catch (refreshError) {
            useAlertStore.getState().showAlert('로그인이 필요합니다.', 'top');
            
            setTimeout(() => {
              window.location.href = '#/login';
            }, 3000);

            return Promise.reject(refreshError);
          }
        }
        break;
      case 403:
        useAlertStore.getState().showAlert('접근 권한이 없습니다.', 'top');
        break;
      case 404:
        useAlertStore
          .getState()
          .showAlert('요청한 정보를 찾을 수 없습니다.', 'top');
        break;
      case 500:
        useAlertStore
          .getState()
          .showAlert('서버 오류입니다. 잠시 후 다시 시도해주세요.', 'top');
        break;
      default:
        useAlertStore
          .getState()
          .showAlert(data?.message || '알 수 없는 오류가 발생했습니다.', 'top');
        break;
    }
    return Promise.reject(error);
  },
);

export default apiInstanceSpring;
