import apiInstanceSpring from '@/apis/core/apiInstanceSpring';
import apiInstanceFast from '@/apis/core/apiInstanceFast';

const MIME_EXT: Record<string, string> = {
  'audio/webm': 'webm',
  'video/webm': 'webm',
  'audio/ogg': 'ogg',
  'video/ogg': 'ogv',
  'audio/wav': 'wav',
  'audio/mpeg': 'mp3',
  'video/mp4': 'mp4',
  'audio/mp4': 'm4a',
};

function inferExt(type?: string, fallback = 'webm') {
  if (!type) return fallback;
  return MIME_EXT[type] ?? type.split('/')[1] ?? fallback;
}

function buildFileName(file: Blob, base: string, fallbackExt = 'webm') {
  const ext = inferExt(file.type, fallbackExt);
  return `${base}.${ext}`;
}

export const uploadTutorialAudio = async (file: File, sessionNumber: string) => {
  const formData = new FormData();
  formData.append('soundFile', file);
  formData.append('sessionId', sessionNumber);

  const res = await apiInstanceSpring.post('/v1/lives/stt', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const uploadLipTestVideo = async (file: File, sessionNumber: string) => {
  console.log(file);
  console.log(sessionNumber);

  const formData = new FormData();

  formData.append('videoFile', file);
  formData.append('sessionNumber', sessionNumber);

  const res = await apiInstanceFast.post('/v1/lip', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  console.log(res);
  return res.data; 
};
