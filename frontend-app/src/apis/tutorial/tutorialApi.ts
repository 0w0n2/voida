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

export const uploadTutorialAudio = async (file: Blob) => {
  const formData = new FormData();
  formData.append('file', file, buildFileName(file, 'record', 'webm'));

  const res = await apiInstanceSpring.post('/tutorial/audio', formData);
  return res.data.result;
};

export const uploadLipTestVideo = async (file: Blob) => {
  console.log(file);
  const formData = new FormData();
  formData.append('file', file, buildFileName(file, 'lip-test', 'webm'));

  const res = await apiInstanceFast.post('/upload/lip-test', formData);
  return res.data.result;
};
