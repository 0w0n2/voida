import apiInstance from '@/apis/apiInstance';

// 로그인
export const login = (email: string, password: string) => {
  return apiInstance.post('/v1/auth/sign-in', { email, password });
};
// 회원가입
export const register = (email: string, password: string) => {
  return apiInstance.post('/v1/auth/sign-up', { email, password });
};

// 이메일 중복 확인
export const checkEmailDuplicate = (email: string) => {
  return apiInstance.post('/v1/auth/check-email', { email });
};

// 닉네임 중복 확인
export const checkNicknameDuplicate = (nickname: string) => {
  return apiInstance.post('/v1/auth/check-nickname', { nickname });
};

// 이메일 인증 코드 발송
export const sendEmailVerification = (email: string) => {
  return apiInstance.post('/v1/auth/email-code', { email });
};

// 이메일 인증 코드 확인
export const verifyEmailCode = (email: string, code: string) => {
  return apiInstance.post('/v1/auth/verify-email', { email, code });
};
