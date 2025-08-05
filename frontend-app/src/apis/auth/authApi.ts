import apiInstance from '@/apis/core/apiInstance';

// 로그인
export const login = (email: string, password: string) => {
  return apiInstance.post('/v1/auth/sign-in', { email, password });
};
// 회원가입
// api/auth.ts
export const register = (
  email: string,
  password: string,
  nickname: string,
  isSocial: boolean,
  profileImage?: File | null,
  providerName?: string
) => {
  const formData = new FormData();

  formData.append('email', email);
  formData.append('password', password);
  formData.append('nickname', nickname);
  formData.append('isSocial', String(isSocial));

  if (isSocial && providerName) {
    formData.append('providerName', providerName);
  }

  if (profileImage) {
    formData.append('profileImage', profileImage);
  } else {
    // 명세상 null을 보내야 하므로 빈 Blob 또는 그냥 null 가능
    // null 쓰면 백에서 파싱필요해서 빈 Blob으로 보냄
    formData.append('profileImage', new Blob([], { type: 'application/octet-stream' }));
  }

  return apiInstance.post('/v1/auth/sign-up', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
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
  const data = { email };

  console.log('[이메일 인증 요청] POST /v1/auth/email-code');
  console.log('전송 데이터:', data);

  return apiInstance.post('/v1/auth/email-code', { email }
  );
};


// 이메일 인증 코드 확인
export const verifyEmailCode = (email: string, code: string) => {
  return apiInstance.post('/v1/auth/verify-email', { email, code },
    { withCredentials: false }
  );
};

// 회원가입 닉네임 랜덤 생성
export const getRandomNickname = () => {
  return apiInstance.get('/v1/auth/random-nickname');
};
