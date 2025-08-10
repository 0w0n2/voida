// openvidu 연결 중 녹음/녹화 업로드
// FastApI 통신

import apiInstance from '@/apis/core/apiInstance';

export const uploadLipTestVideo = async (file: Blob) => {
  const formData = new FormData();
  formData.append('file', file, 'lip-test.webm');

  const res = await apiInstance.post('/upload/lip-test', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data;
};

export const uploadTutorialAudio = async (file: Blob) => {
  const formData = new FormData();
  formData.append('file', file, 'record.wav');

  const res = await apiInstance.post('/tutorial/audio', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data;
};
