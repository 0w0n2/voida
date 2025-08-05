import axios from 'axios';

const apiInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  timeout: 5000,
});

apiInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    const excludedUrls = [
      '/v1/auth/email-code',
      '/v1/auth/verify-email',
      '/v1/auth/check-nickname',
      '/v1/auth/check-email',
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

apiInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      console.error('네트워크 에러 또는 서버 응답 없음');
      alert('서버와 연결할 수 없습니다. 인터넷을 확인해주세요.');
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    switch (status) {
      case 400:
        console.warn(
          '잘못된 요청:',
          data.message || '입력값을 다시 확인해주세요.',
        );
        break;
      case 401:
        if (!originalRequest._retry) {
          originalRequest._retry = true;
          // 에러 처리 넣어야 할지 ?
          try {
            // const refreshToken = localStorage.getItem('refreshToken');
            // const response = await apiInstance.post('/v1/auth/reissue', {
            //   refreshToken,
            // });
            const response = await apiInstance.post('/v1/auth/reissue');
            localStorage.setItem('accessToken', response.data.accessToken);
            originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
            return apiInstance(originalRequest);
          } catch (refreshError) {
            console.error('토큰 갱신 실패:', refreshError);
            return Promise.reject(refreshError);
          }
        }
        break;
      case 403:
        alert('접근 권한이 없습니다.');
        break;
      case 404:
        alert('요청한 정보를 찾을 수 없습니다.');
        break;
      case 500:
        alert('서버 오류입니다. 잠시 후 다시 시도해주세요.');
        break;
      default:
        alert(data?.message || '알 수 없는 오류가 발생했습니다.');
        break;
    }

    return Promise.reject(error);
  },
);

export default apiInstance;
