import apiInstance from '@/apis/apiInstance';

// 로그인
export const login = (email: string, password: string) => {
  return apiInstance.post('/v1/auth/sign-in', { email, password },
    { withCredentials: false }
  );
};

// 회원가입
// api/auth.ts
export const register = (
  email: string,
  password: string,
  nickname: string,
  isSocial: boolean,
  providerName?: string,
  profileImage?: File | null,
) => {
  const formData = new FormData();
  const requestDto = {
    email,
    password,
    nickname,
    isSocial,
    providerName: providerName || null,
  };
  formData.append(
    'requestDto',
    new Blob([JSON.stringify(requestDto)], { type: 'application/json' }),
  );
  if (isSocial && providerName) {
    formData.append('providerName', providerName);
  }

  if (profileImage) {
    formData.append('profileImage', profileImage);
  } else {
    // default 이미지 사용하지 않을 경우 필수
    // default 이미지 사용 시 null 값 보내 줌
    formData.append('profileImage', 'null');
  }

  return apiInstance.post('/v1/auth/sign-up', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// 이메일 중복 확인
export const checkEmailDuplicate = (email: string) => {
  return apiInstance.post(
    '/v1/auth/check-email',
    { email },
    { withCredentials: false },
  );
};

// 닉네임 중복 확인
export const checkNicknameDuplicate = (nickname: string) => {
  return apiInstance.post(
    '/v1/auth/check-nickname',
    { nickname },
    { withCredentials: false },
  );
};

// 이메일 인증 코드 발송
export const sendEmailVerification = (email: string) => {
  return apiInstance.post(
    '/v1/auth/email-code',
    { email: email.trim() },
    { withCredentials: false },
  );
};

// 이메일 인증 코드 확인
export const verifyEmailCode = (email: string, code: string) => {
  return apiInstance.post(
    '/v1/auth/verify-email',
    { email, code },
    { withCredentials: false },
  );
};

// 회원가입 닉네임 랜덤 생성
export const getRandomNickname = () => {
  return apiInstance.get('/v1/auth/random-nickname');
};
