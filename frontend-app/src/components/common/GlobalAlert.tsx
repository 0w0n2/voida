/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useAlertStore } from '@/stores/useAlertStore';

export default function GlobalAlert() {
  const { message, position, visible, duration } = useAlertStore();

  if (!visible) return null;

  return <div css={alertStyle(position, duration)}>{message}</div>;
}

const alertStyle = (position: 'top' | 'bottom', duration: number) => css`
  position: fixed;
  ${position === 'top' ? 'top: 60px;' : 'bottom: 60px;'}
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.85);
  color: white;
  font-size: 15px;
  padding: 10px 20px;
  border-radius: 8px;
  z-index: 5000;
  animation: ${position === 'top' ? 'slideDownFade' : 'slideUpFade'} ${duration}ms forwards;

  @keyframes slideUpFade {
    0% {
      opacity: 0;
      transform: translate(-50%, 20px);
    }
    15% {
      opacity: 1;
      transform: translate(-50%, 0);
    }
    85% {
      opacity: 1;
      transform: translate(-50%, 0);
    }
    100% {
      opacity: 0;
      transform: translate(-50%, 20px);
    }
  }

  @keyframes slideDownFade {
    0% {
      opacity: 0;
      transform: translate(-50%, -20px);
    }
    15% {
      opacity: 1;
      transform: translate(-50%, 0);
    }
    85% {
      opacity: 1;
      transform: translate(-50%, 0);
    }
    100% {
      opacity: 0;
      transform: translate(-50%, -20px);
    }
  }
`;