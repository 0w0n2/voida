import apiInstance from '@/apis/apiInstance';

export const postUserType = (type: 'general' | 'lip-reading') => {
  return apiInstance.post('/user/type', { type });
};

// 유저 정보 조회
export const getUser = (accessToken: string) => {
  return apiInstance.get('/v1/members/me/profile', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

// 유저 setting 조회
export const getUserSettings = (accessToken: string) => {
  return apiInstance.get('/v1/members/me/setting', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
// 유저 quickslots 조회
export const getUserQuickSlots = (accessToken: string) => {
  return apiInstance.get('/v1/members/me/quick-slots', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

// 유저 소셜 계정 조회
export const getUserSocialAccounts = (accessToken: string) => {
  return apiInstance.get('/v1/members/me/social-accounts', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

// 현재 비밀번호 일치 확인
export const checkCurrentPassword = (accessToken: string, password: string) => {
  return apiInstance.post(
    '/v1/members/me/verify-password',
    { password },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};
// 유저 정보 수정
export const updateUser = (
  accessToken: string,
  nickname: string,
  profileImage?: File | null,
) => {
  const formData = new FormData();
  formData.append('nickname', nickname);

  if (profileImage) {
    formData.append('profileImage', profileImage);
  }

  return apiInstance.put('/v1/members/me/profile', formData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'multipart/form-data',
    },
  });
};

// 비밀번호 수정
export const updatePassword = (
  accessToken: string,
  currentPassword: string,
  newPassword: string,
) => {
  return apiInstance.put(
    '/v1/members/me/password',
    { currentPassword, newPassword },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};

// 구화 모드 수정
export const updateGuideMode = (
  accessToken: string,
  useLipTalkMode: boolean,
) => {
  return apiInstance.put(
    '/v1/members/me/lip-talk-mode',
    { useLipTalkMode },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};

// 오버레이 수정
export const updateOverlay = (
  accessToken: string,
  overlayPosition: string,
  overlayTransparency: number,
  liveFontSize: number,
) => {
  return apiInstance.put(
    '/v1/members/me/overlay',
    { overlayPosition, overlayTransparency, liveFontSize },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};

// 단축키 수정
type QuickSlot = {
  quickSlotId: number;
  message: string;
  hotkey: string;
};

export const updateQuickslots = (
  accessToken: string,
  quickSlots: QuickSlot[],
) => {
  return apiInstance.put(
    '/v1/members/me/quick-slots',
    { quickSlots },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};

// 회원탈퇴
export const deleteUser = (accessToken: string) => {
  return apiInstance.delete('/v1/members/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
