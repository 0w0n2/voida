// hooks/useAudioRecorder.ts
import { useCallback, useEffect, useRef, useState } from 'react';

interface UseAudioRecorderOptions {
  mimeType?: string;
  maxDurationMs?: number;
  onProgress?: (percent: number) => void;
  onStop?: (result: { blob: Blob; mimeType: string; durationMs: number }) => void;
}

export function useAudioRecorder({
  mimeType = 'audio/webm;codecs=opus',
  maxDurationMs,
  onProgress,
  onStop,
}: UseAudioRecorderOptions) {
  const [hasPermission, setHasPermission] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const mrRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const startTimeRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 권한 요청
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((s) => {
        setStream(s);
        setHasPermission(true);
      })
      .catch((err) => {
        console.error('Audio permission denied:', err);
        setHasPermission(false);
      });

    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [stream]);

  const start = useCallback(() => {
    if (!stream || isRecording) return;

    let type = mimeType;
    if (!MediaRecorder.isTypeSupported(type)) type = '';

    const mr = new MediaRecorder(stream, type ? { mimeType: type } : undefined);
    mrRef.current = mr;
    chunksRef.current = [];
    startTimeRef.current = Date.now();

    mr.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    mr.onstop = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      const durationMs = Date.now() - startTimeRef.current;
      const finalType = mr.mimeType || 'audio/webm';
      const blob = new Blob(chunksRef.current, { type: finalType });
      chunksRef.current = [];
      onProgress?.(0);
      onStop?.({ blob, mimeType: finalType, durationMs });
    };

    if (maxDurationMs && onProgress) {
      timerRef.current = setTimeout(() => stop(), maxDurationMs);
    }

    mr.start();
    setIsRecording(true);
  }, [stream, isRecording, mimeType, maxDurationMs, onProgress, onStop]);

  const stop = useCallback(() => {
    if (!isRecording) return;
    setIsRecording(false);
    mrRef.current?.stop();
  }, [isRecording]);

  return { hasPermission, isRecording, start, stop };
}
