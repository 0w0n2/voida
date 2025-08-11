/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect } from 'react';
import { useAlertStore } from '@/stores/useAlertStore';

export default function GlobalAlert() {
  const {
    message,
    position,
    visible,
    duration,
    isConfirm,
    resolve,
    hideAlert,
  } = useAlertStore();

  useEffect(() => {
    if (visible && isConfirm) {
      const timer = setTimeout(() => {
        resolve?.(false);
        hideAlert();
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [visible, isConfirm, resolve, hideAlert]);

  if (!visible) return null;

  return (
    <div css={alertWrapper(position, duration, isConfirm)}>
      <p css={alertMessage}>{message}</p>

      {isConfirm && (
        <div css={buttonGroup}>
          <button
            css={confirmBtn}
            onClick={() => {
              resolve?.(true);
              hideAlert();
            }}
          >
            확인
          </button>
          <button
            css={cancelBtn}
            onClick={() => {
              resolve?.(false);
              hideAlert();
            }}
          >
            취소
          </button>
        </div>
      )}
    </div>
  );
}

const alertWrapper = (
  position: 'top' | 'bottom',
  duration: number,
  isConfirm: boolean
) => css`
  position: fixed;
  ${position === 'top' ? 'top: 60px;' : 'bottom: 60px;'}
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.85);
  color: white;
  font-size: 15px;
  padding: ${isConfirm ? '16px 20px 12px' : '10px 20px'};
  border-radius: 8px;
  z-index: 5000;
  min-width: 200px;
  text-align: center;

  ${!isConfirm &&
  css`
    animation: ${position === 'top' ? 'slideDownFade' : 'slideUpFade'}
      ${duration}ms forwards;
  `}

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

const alertMessage = css`
  margin: 0;
  line-height: 1.4;
`;

const buttonGroup = css`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 12px;
`;

const confirmBtn = css`
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  background: var(--color-primary);
  color: white;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    background: var(--color-primary-dark);
  }
`;

const cancelBtn = css`
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  background: #f1f1f1;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    background: #e6e6e6;
  }
`;
