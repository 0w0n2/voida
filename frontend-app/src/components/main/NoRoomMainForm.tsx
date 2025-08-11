/** @jsxImportSource @emotion/react */
import { css,  keyframes } from '@emotion/react';
import { useState } from 'react';
import { Plus, ArrowRight } from 'lucide-react';
import mainHome from '@/assets/icons/main-home.png';
import CreateRoomModal from '@/components/main/modal/CreateRoom';
import JoinRoomModal from '@/components/main/modal/JoinRoom';

const NoRoomMainForm = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);

  return (
    <div css={mainWrapper}>
      <div css={iconWrapperStyle}>
        <div css={iconContainerStyle}>
          <img src={mainHome} alt="mainHome" css={iconStyle} />
        </div>
        <h1 css={NoRoomTextStyle}>현재 참여 중인 방이 없습니다.</h1>
        <span css={GuideTextStyle}>
          새로운 방을 만들어보거나, 코드를 입력해 입장해보세요.
        </span>
      </div>

      <div css={buttonWrapperStyle}>
        <div css={buttonContainerStyle}>
          <h3>새로운</h3>
          <button css={roomCreateButtonStyle} onClick={() => setIsCreateOpen(true)}>
            <Plus /> 방 생성하기
          </button>
        </div>
        <div css={buttonContainerStyle}>
          <h3>코드로</h3>
          <button css={roomButtonStyle} onClick={() => setIsJoinOpen(true)}>
            <ArrowRight /> 방 들어가기
          </button>
        </div>
      </div>

      <div css={blurBg1} />
      <div css={blurBg2} /> 
      <div css={blurBg3} />

      {isCreateOpen && (
        <CreateRoomModal onClose={() => setIsCreateOpen(false)} />
      )}
      {isJoinOpen && <JoinRoomModal onClose={() => setIsJoinOpen(false)} />}
    </div>
  );
};

export default NoRoomMainForm;

const glassStyle = css`
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.25) 0%,
    rgba(255, 255, 255, 0.05) 100%
  );
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.15),
    inset 0 1px 1px rgba(255, 255, 255, 0.4),
    inset 0 -1px 1px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow:
      0 12px 32px rgba(0, 0, 0, 0.2),
      inset 0 1px 1px rgba(255, 255, 255, 0.4),
      inset 0 -1px 1px rgba(0, 0, 0, 0.05);
  }
`;

const mainWrapper = css`
  position: relative;
  width: 100%;
  min-height: 85vh;
  z-index: 1;
  overflow: hidden;
`;

const iconWrapperStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  padding: 2rem;
`;

const iconContainerStyle = css`
  ${glassStyle};
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
`;

const iconStyle = css`
  width: 60px;
  height: 60px;
  object-fit: contain;
`;

const NoRoomTextStyle = css`
  font-size: 2rem;
  color: var(--color-text);
  margin-bottom: 1rem;
  text-align: center;
  font-family: 'NanumSquareEB';
`;

const GuideTextStyle = css`
  font-size: 1.125rem;
  color: var(--color-gray-500);
  text-align: center;
  margin-bottom: 1rem;
  font-family: 'NanumSquareR';
`;

const buttonWrapperStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6rem;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

const buttonContainerStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  h3 {
    font-size: 1.5rem;
    color: var(--color-text);
    font-family: 'NanumSquareEB';
  }
`;

const roomCreateButtonStyle = css`
  ${glassStyle};
  background: linear-gradient(90deg, #6e8efb, #a777e3);
  color: white;
  padding: 1.3rem 2.5rem;
  font-size: 1.5rem;
  font-family: 'NanumSquareB';
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.2rem;
  min-width: 200px;
  border-radius: 18px;
  letter-spacing: -0.3px;
  transition: all 0.25s ease;

  svg {
    width: 30px;
    height: 30px;
    margin-top: 5px;
  }

  &:hover {
    box-shadow:
      0 8px 24px rgba(52, 152, 219, 0.35),
      inset 0 1px 1px rgba(255, 255, 255, 0.4);
  }

  &:active {
    transform: scale(0.97);
  }
`;

const roomButtonStyle = css`
  ${glassStyle};
  padding: 1.3rem 2.5rem;
  font-size: 1.5rem;
  font-family: 'NanumSquareB';
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.2rem;
  min-width: 200px;
  color: var(--color-text);
  border-radius: 18px;
  letter-spacing: -0.3px;
  transition: all 0.25s ease;

  svg {
    width: 30px;
    height: 30px;
    margin-top: 5px;
  }

  &:hover {
    background: linear-gradient(90deg, #6e8efb, #a777e3);
    color: white;
    box-shadow:
      0 8px 24px rgba(52, 152, 219, 0.35),
      inset 0 1px 1px rgba(255, 255, 255, 0.4);
  }

  &:active {
    transform: scale(0.97);
  }
`;

const float1 = keyframes`
  0%   { transform: translateY(0px) translateX(0px); }
  50%  { transform: translateY(-50px) translateX(200px); }
  100% { transform: translateY(0px) translateX(0px); }
`;

const float2 = keyframes`
  0%   { transform: translateY(0px) translateX(0px); }
  50%  { transform: translateY(50px) translateX(-200px); }
  100% { transform: translateY(0px) translateX(0px); }
`;

const blurBg1 = css`
  position: absolute;
  top: 15%;
  left: 3%;
  width: 280px;
  height: 280px;
  background: radial-gradient(circle, #b69cff, transparent 70%);
  filter: blur(80px);
  z-index: -1;
  animation: ${float1} 30s ease-in-out infinite;
`;

const blurBg2 = css`
  position: absolute;
  bottom: 10%;
  right: 10%;
  width: 380px;
  height: 380px;
  background: radial-gradient(circle, #82e9ff, transparent 70%);
  filter: blur(100px);
  z-index: -1;
  animation: ${float2} 28s ease-in-out infinite;
`;

const blurBg3 = css`
  position: absolute;
  top: 45%;
  left: 25%;
  width: 260px;
  height: 260px;
  background: radial-gradient(circle, #ff8fa3, transparent 70%);
  filter: blur(90px);
  z-index: -1;
  animation: ${float1} 24s ease-in-out infinite;
`;
