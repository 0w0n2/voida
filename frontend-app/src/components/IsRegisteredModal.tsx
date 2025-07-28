/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import tutorial from '@/assets/icon/tutorialButton.png';
import home from '@/assets/icon/homeButton.png';
import congratu from '@/assets/icon/congratu.png';
import congratuReverse from '@/assets/icon/congratu-1.png';

interface IsRegisteredModalProps {
  isOpen: boolean;
  onClose: () => void;
  nickname: string;
}

const IsRegisteredModal = ({
  isOpen,
  onClose,
  nickname,
}: IsRegisteredModalProps) => {
  const navigate = useNavigate();

  const goToTutorial = () => {
    onClose();
    navigate('/tutorial');
  };

  const goToMain = () => {
    onClose();
    navigate('/rooms');
  };

  if (!isOpen) return null;

  return (
    <div css={overlayStyle}>
      <div css={modalStyle}>
        <button
          type="button"
          onClick={onClose}
          css={closeButtonStyle}
          aria-label="닫기"
        >
          ✕
        </button>

        <div css={contentStyle}>
          <h2 css={titleStyle}>
            <img src={congratu} alt="축1" css={congratuIconStyle} />
            {nickname}님 회원가입을 축하합니다!
            <img src={congratuReverse} alt="축2" css={congratuIconStyle} />
          </h2>
          <p css={instructionStyle}>Voida에서 많은 사람들과 소통해보세요!</p>
        </div>

        <div css={buttonContainerStyle}>
          <button css={buttonStyle} onClick={goToTutorial}>
            <img src={tutorial} alt="튜토리얼 보기" css={buttonIconStyle} />
            튜토리얼 보기
          </button>
          <button css={grayButtonStyle} onClick={goToMain}>
            <img src={home} alt="메인으로 가기" css={buttonIconStyle} />
            메인으로 가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default IsRegisteredModal;

const overlayStyle = css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
`;

const modalStyle = css`
  background: white;
  border-radius: 20px;
  padding: 50px 40px;
  width: 500px;
  max-width: 90vw;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
`;

const closeButtonStyle = css`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  background: var(--color-gray-100);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  color: var(--color-gray-500);
  font-weight: bold;
  transition: all 0.2s ease;
  z-index: 10;

  &:hover {
    background: var(--color-gray-200);
    color: var(--color-text);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const contentStyle = css`
  text-align: center;
  margin-bottom: 32px;
`;

const titleStyle = css`
  font-size: 28px;
  font-family: 'NanumSquareEB', sans-serif;
  font-weight: 800;
  text-align: center;
  margin: 0 0 12px 0;
  color: var(--color-text);
  letter-spacing: -0.5px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const congratuIconStyle = css`
  width: 24px;
  height: 24px;
`;

const instructionStyle = css`
  text-align: center;
  color: var(--color-gray-500);
  margin: 0;
  font-size: 15px;
  line-height: 1.6;
  font-family: 'NanumSquareR', sans-serif;
  font-weight: 400;
`;

const buttonContainerStyle = css`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const buttonStyle = css`
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 16px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background: #1565c0;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const grayButtonStyle = css`
  background: #6c757d;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 16px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background: #5a6268;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const buttonIconStyle = css`
  width: 18px;
  height: 18px;
`;
