import apiInstance from '@/apis/core/apiInstance';

export const postUserType = (type: 'general' | 'lip-reading') => {
  return apiInstance.post('/user/type', { type });
};

// 유저 정보 조회
export const getUser = () => {
  return apiInstance.get('/v1/members/me/profile');
};

// 유저 setting 조회
export const getUserSettings = () => {
  return apiInstance.get('/v1/members/me/setting');
};

// 유저 quickslots 조회
export const getUserQuickSlots = () => {
  return apiInstance.get('/v1/members/me/quick-slots');
};

// 유저 소셜 계정 조회
export const getUserSocialAccounts = () => {
  return apiInstance.get('/v1/members/me/social-accounts');
};

// 유저 소셜 계정 연동
// GET,POST 결정 안 됨
export const linksocialAccount = () => {
  return apiInstance.post('/v1/members/me/social-accounts/link');
};

// 현재 비밀번호 일치 확인
export const checkCurrentPassword = (password: string) => {
  return apiInstance.post('/v1/members/me/verify-password', { password });
};

// 유저 정보 수정
export const updateUser = (nickname: string, profileImage?: File | null) => {
  const formData = new FormData();
  const requestDto = {
    nickname,
  };

  formData.append('requestDto', new Blob([JSON.stringify(requestDto)]));

  if (profileImage) {
    formData.append('profileImage', profileImage);
  } else {
    formData.append('profileImage', 'null');
  }

  return apiInstance.put('/v1/members/me/profile', formData, {});
};

// 비밀번호 수정
export const updatePassword = (
  currentPassword: string,
  newPassword: string,
) => {
  return apiInstance.put('/v1/members/me/password', {
    currentPassword,
    newPassword,
  });
};

// 구화 모드 수정
export const updateGuideMode = (useLipTalkMode: boolean) => {
  return apiInstance.put('/v1/members/me/lip-talk-mode', { useLipTalkMode });
};

// 오버레이 수정
export const updateOverlay = (
  overlayPosition: string,
  overlayTransparency: number,
  liveFontSize: number,
) => {
  return apiInstance.put(
    '/v1/members/me/overlay',
    { overlayPosition, overlayTransparency, liveFontSize },
  );
};

// 단축키 수정
type QuickSlot = {
  quickSlotId: number;
  message: string;
  hotkey: string;
};

export const updateQuickslots = (quickSlots: QuickSlot[]) => {
  return apiInstance.put('/v1/members/me/quick-slots', { quickSlots });
};

// 회원탈퇴
export const deleteUser = () => {
  return apiInstance.delete('/v1/members/me', {});
};