import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseVideoRecorderOptions {
  mimeType?: string;              // 기본: 'video/webm;codecs=vp9,opus'
  maxDurationMs?: number;
  onProgress?: (percent: number) => void;
  onStop?: (r: { blob: Blob; mimeType: string; durationMs: number }) => void;
  audioConstraints?: MediaStreamConstraints['audio']; // 마이크 선택
  videoConstraints?: MediaStreamConstraints['video']; // 카메라/해상도 선택
}

export function useVideoRecorder(opts: UseVideoRecorderOptions = {}) {
  const {
    mimeType = 'video/webm;codecs=vp9,opus',
    maxDurationMs,
    onProgress,
    onStop,
    audioConstraints = true,
    videoConstraints = true,
  } = opts;

  const [hasPermission, setHasPermission] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const mrRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({
          audio: audioConstraints ?? true,
          video: videoConstraints ?? true,
        });
        if (!mounted) return;
        setStream(s);
        setHasPermission(true);
      } catch (e) {
        console.error('Video gUM error:', e);
        setHasPermission(false);
      }
    })();
    return () => {
      mounted = false;
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(audioConstraints), JSON.stringify(videoConstraints)]);

  const start = useCallback(() => {
    if (!stream || isRecording) return;

    let type = mimeType;
    if (type && !MediaRecorder.isTypeSupported(type)) {
      console.warn('mimeType not supported, fallback to browser default:', type);
      type = undefined;
    }

    const mr = new MediaRecorder(stream, type ? { mimeType: type } : undefined);
    mrRef.current = mr;
    chunksRef.current = [];
    startTimeRef.current = Date.now();

    mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    mr.onstop = () => {
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
      const durationMs = Date.now() - startTimeRef.current;
      const finalType = mr.mimeType || 'video/webm';
      const blob = new Blob(chunksRef.current, { type: finalType });
      chunksRef.current = [];
      onProgress?.(0);
      onStop?.({ blob, mimeType: finalType, durationMs });
    };

    if (maxDurationMs && onProgress) {
      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        const ratio = Math.min(elapsed / maxDurationMs, 1);
        onProgress(Math.round(ratio * 100));
       if (elapsed >= maxDurationMs) {
            mrRef.current?.stop(); 
        }
      }, 100);
    }

    mr.start();
    setIsRecording(true);
  }, [stream, isRecording, mimeType, maxDurationMs, onProgress, onStop]);

  const stop = useCallback(() => {
    if (!isRecording) return;
    setIsRecording(false);
    mrRef.current?.stop();
  }, [isRecording]);

  const pause = useCallback(() => { mrRef.current?.pause(); }, []);
  const resume = useCallback(() => { mrRef.current?.resume(); }, []);

  return { hasPermission, isRecording, stream, start, stop, pause, resume };
}
