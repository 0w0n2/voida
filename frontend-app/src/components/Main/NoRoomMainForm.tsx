/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';
import { Plus, ArrowRight } from 'lucide-react';
import mainHome from '@/assets/icons/main-home.png';
import CreateRoomModal from '@/components/main/modal/CreateRoom';
import JoinRoomModal from '@/components/main/modal/JoinRoom';

const NoRoomMainForm = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);

  return (
    <div>
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
          <button css={roomButtonStyle} onClick={() => setIsCreateOpen(true)}>
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

      {isCreateOpen && (
        <CreateRoomModal onClose={() => setIsCreateOpen(false)} />
      )}
      {isJoinOpen && <JoinRoomModal onClose={() => setIsJoinOpen(false)} />}
    </div>
  );
};

export default NoRoomMainForm;

const iconWrapperStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  padding: 2rem;
`;

const iconContainerStyle = css`
  width: 120px;
  height: 120px;
  background-color: var(--color-gray-100);
  border-radius: 16px;
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
  gap: 4rem;
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

const roomButtonStyle = css`
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-size: 1.3rem;
  font-family: 'NanumSquareB';
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  min-width: 160px;
  background-color: var(--color-gray-100);
  color: var(--color-text);

  &:hover {
    background-color: var(--color-primary);
    color: var(--color-text-white);
  }

  &:active {
    transform: translateY(1px);
  }
`;
