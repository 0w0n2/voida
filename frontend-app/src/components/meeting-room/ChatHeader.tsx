/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import VoidaLogo from '@/assets/logo/voida-logo.png';
import Live from '@/assets/icons/live.png';
import LiveSlash from '@/assets/icons/live-slash.png';

interface ChatHeaderProps {
  isLive?: boolean;
}

const ChatHeader = ({ isLive = false }: ChatHeaderProps) => {
  return (
    <div css={header}>
      <img src={VoidaLogo} alt="VOIDA 로고" css={logo} />
      <button css={joinBtn}>
        <img
          src={isLive ? Live : LiveSlash}
          alt="라이브 참여하기"
          css={liveIcon}
        />
        <span>라이브 참여하기</span>
      </button>
    </div>
  );
};

export default ChatHeader;

const header = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: transparent; 
  padding: 2.5rem;
  padding-bottom: 1rem;
`;

const logo = css`
  height: 40px;
`;

const joinBtn = css`
  background: #22c55e;
  color: white;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;

  &:hover {
    background: #16a34a;
  }
`;

const liveIcon = css`
  width: 20px;
  height: 20px;
  object-fit: contain;
`;
