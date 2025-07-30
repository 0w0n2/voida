import apiInstance from '@/apis/apiInstance';

export const postUserType = (type: 'general' | 'lip-reading') => {
  return apiInstance.post('/user/type', { type });
};

export const getUser = (accessToken: string) => {
  return apiInstance.get('/v1/members/me/profile', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};