import apiInstance from './apiInstance';

export const uploadLipTestVideo = (file: Blob) => {
  const formData = new FormData();
  formData.append('file', file, 'lip-test.webm');

  return apiInstance.post('/upload/lip-test', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const uploadTutorialAudio = (file: Blob) => {
  const formData = new FormData();
  formData.append('file', file, 'record.wav');

  return apiInstance.post('/tutorial/audio', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
