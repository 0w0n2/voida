import { useEffect, useRef, useState } from 'react';

export const useMicVolume = (active: boolean, barsCount = 40) => {
  const [bars, setBars] = useState<number[]>(Array(barsCount).fill(0));

  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) {
      setBars(Array(barsCount).fill(0));
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      return;
    }

    let mounted = true;
    let analyser: AnalyserNode;
    let dataArray: Uint8Array;
    let bufferLength: number;

    let lastLog = 0; 

    const start = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaStreamSource(stream);

      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);

      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;

      const update = () => {
        if (!mounted) return;

        analyser.getByteFrequencyData(dataArray);

        const step = Math.floor(bufferLength / barsCount);
        const newBars = Array.from({ length: barsCount }, (_, i) => {
          const v = dataArray[i * step] || 0;
          return Math.min(30, (v / 256) * 30); 
        });

        // const avg = newBars.reduce((a, b) => a + b, 0) / newBars.length;

        const now = Date.now();
        if (now - lastLog > 700) {
          // console.log('vol avg:', avg.toFixed(2));
          lastLog = now;
        }

        setBars(newBars);
        rafRef.current = requestAnimationFrame(update);
      };

      update();
    };

    start();

    return () => {
      mounted = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      audioContextRef.current?.close();
    };
  }, [active, barsCount]);

  return bars;
};
