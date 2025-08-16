import { useEffect, useRef } from 'react';
import type { MutableRefObject } from 'react';

export const useQuickSlot = (
  hotkeyMapRef: MutableRefObject<Map<string, string>>,
  ttsUrlMapRef: MutableRefObject<Map<string, string>>,
  audioRef: MutableRefObject<HTMLAudioElement | null>,
  onSend?: (text: string) => void,
) => {
  const backtickDownRef = useRef(false);

  useEffect(() => {
    const onKeyDown = async (e: KeyboardEvent) => {
      if (e.repeat) return; 

      if (e.key === '`') {
        backtickDownRef.current = true;
        return;
      }
      if (!backtickDownRef.current) return;

      const key = e.key.toLowerCase();
      const msg = hotkeyMapRef.current.get(key);
      const url = ttsUrlMapRef.current.get(key);

      if (!msg) return;

      e.preventDefault();
      onSend?.(msg);
      console.log(`단축키 ${key} 실행: ${msg}`);

      if (url && audioRef.current) {
        try {
          const el = audioRef.current;
          el.pause(); 
          el.src = import.meta.env.VITE_CDN_URL
            ? `${import.meta.env.VITE_CDN_URL}/${url}`
            : url;
          await el.play();
        } catch (err) {
          console.error('오디오 재생 실패:', err);
        }
      }

      backtickDownRef.current = false;
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === '`') {
        backtickDownRef.current = false;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [hotkeyMapRef, ttsUrlMapRef, audioRef, onSend]);
};
