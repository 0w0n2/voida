/** @jsxImportSource @emotion/react */
import { useEffect } from 'react';
import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import tutorial from '@/assets/icon/tutorialButton.png';
import home from '@/assets/icon/homeButton.png';
import congratu from '@/assets/icon/congratu.png';

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

  // 컨페티 효과 함수
  const triggerConfetti = () => {
    // 중앙에서 발사
    confetti({
      particleCount: 200,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#3182f6', '#23ad6f', '#f4d248', '#f14452'],
      gravity: 0.8,
      ticks: 200,
      startVelocity: 30,
      zIndex: 1500, // 모달(1000)보다 높고, 적당한 여유
    });

    // 왼쪽에서 발사
    setTimeout(() => {
      confetti({
        particleCount: 100,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#3182f6', '#23ad6f', '#f4d248'],
        gravity: 0.9,
        ticks: 150,
        zIndex: 1500,
      });
    }, 100);

    // 오른쪽에서 발사
    setTimeout(() => {
      confetti({
        particleCount: 100,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#f14452', '#f4d248', '#f14452'],
        gravity: 0.9,
        ticks: 150,
        zIndex: 1500,
      });
    }, 200);
  };

  // 모달이 열릴 때 컨페티 실행
  useEffect(() => {
    if (isOpen) {
      setTimeout(triggerConfetti, 300);
    }
  }, [isOpen]);

  const goToTutorial = () => {
    onClose();
    navigate('/tutorial');
  };

  const goToMain = () => {
    onClose();
    navigate('/rooms');
  };

  // 조건부 모달 렌더링
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
          <h3 css={titleStyle}>
            <div css={nameStyle}>{nickname}님</div>
            <div css={messageStyle}>
              <img src={congratu} alt="축1" css={congratuIconStyle} />
              회원가입을 축하합니다!
            </div>
          </h3>
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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  word-break: keep-all;
  line-height: 1.1;
`;

const nameStyle = css`
  font-size: 28px;
  font-family: 'NanumSquareEB', sans-serif;
  font-weight: 800;
  color: var(--color-text);
  letter-spacing: -0.5px;
`;

const messageStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 28px;
  font-family: 'NanumSquareEB', sans-serif;
  font-weight: 800;
  color: var(--color-text);
  letter-spacing: -0.5px;
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
  flex-direction: row;
  gap: 40px;
  justify-content: center;
  margin-top: 20px;
`;

const buttonStyle = css`
  background: var(--color-primary);
  color: var(--color-text-white);
  border: none;
  border-radius: 12px;
  padding: 12px 26px;
  font-size: 14px;
  font-family: 'NanumSquareB', sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background: var(--color-primary-dark);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(49, 130, 246, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const grayButtonStyle = css`
  background: var(--color-gray-500);
  color: var(--color-text-white);
  border: none;
  border-radius: 12px;
  padding: 12px 26px;
  font-size: 14px;
  font-family: 'NanumSquareB', sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background: var(--color-gray-600);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(147, 147, 147, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const buttonIconStyle = css`
  width: 18px;
  height: 18px;
`;
