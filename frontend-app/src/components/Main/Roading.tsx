/** @jsxImportSource @emotion/react */
import { css, keyframes } from '@emotion/react';
import { FiX } from 'react-icons/fi';

interface RoadingProps {
  isOpen: boolean;
  onClose?: () => void;
}

const Roading = ({ isOpen, onClose }: RoadingProps) => {
  if (!isOpen) return null;

  return (
    <div css={modalOverlay}>
      <div css={modalContainer}>
        <button css={closeButton} onClick={onClose}>
          <FiX />
        </button>

        <div css={spinnerContainer}>
          <div css={spinner}></div>
        </div>

        <div css={textContainer}>
          <p css={loadingText}>초대코드 로딩 중 입니다.</p>
        </div>
      </div>
    </div>
  );
};

export default Roading;

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const modalOverlay = css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;

const modalContainer = css`
  background: var(--color-bg-white);
  border-radius: 16px;
  padding: 40px;
  width: 90%;
  height: 300px;
  max-width: 400px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
`;

const closeButton = css`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text);
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--color-gray-100);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const spinnerContainer = css`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 32px;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const spinner = css`
  width: 80px;
  height: 80px;
  border: 5px solid var(--color-gray-200);
  border-top: 5px solid var(--color-primary);
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const textContainer = css`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`;

const loadingText = css`
  font-size: 18px;
  font-weight: 500;
  color: var(--color-text);
  margin: 0;
  text-align: center;
`;
