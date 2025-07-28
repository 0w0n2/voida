import apiInstance from '@/apis/apiInstance';

export const postUserType = (type: 'general' | 'lip-reading') => {
  return apiInstance.post('/user/type', { type });
};
