import { useEffect, useRef, useState } from 'react';

interface UseMicVolumeOptions {
  barsCount?: number;   
  sensitivity?: number;    
  maxHeight?: number;     
}

export const useMicVolume = (
  active: boolean,
  { barsCount = 40, sensitivity = 1, maxHeight = 30 }: UseMicVolumeOptions = {}
) => {
  const [bars, setBars] = useState<number[]>(Array(barsCount).fill(0));

  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) {
      setBars(Array(barsCount).fill(0));

      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }

    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
      return;
    }

    let mounted = true;
    let analyser: AnalyserNode;
    let bufferLength: number;
    let dataArray: Uint8Array = new Uint8Array(0);

    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        const audioCtx = new AudioContext();
        const source = audioCtx.createMediaStreamSource(stream);

        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 1024; 
        source.connect(analyser);

        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);   

        audioContextRef.current = audioCtx;
        analyserRef.current = analyser;

        const update = () => {
          if (!mounted) return;

          analyser.getByteTimeDomainData(dataArray);

          const step = Math.floor(bufferLength / barsCount);
          const newBars = Array.from({ length: barsCount }, (_, i) => {
            let sum = 0;
            for (let j = 0; j < step; j++) {
              const value = dataArray[i * step + j] - 128; // 파형 중앙(128) 기준
              sum += value * value;
            }
            const rms = Math.sqrt(sum / step); // RMS 계산
            return Math.min(maxHeight, (rms / 128) * maxHeight * sensitivity);
          });

          setBars(newBars);
          rafRef.current = requestAnimationFrame(update);
        };

        update();
      } catch (err) {
        console.error('마이크 접근 오류:', err);
      }
    };

    start();

    return () => {
      mounted = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      audioContextRef.current?.close();
    };
  }, [active, barsCount, sensitivity, maxHeight]);

  return bars;
};
