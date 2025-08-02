/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import VoidaLogo from '@/assets/logo/voida-logo.png';
import { Wifi, WifiOff } from 'lucide-react';

interface ChatHeaderProps {
  isLive?: boolean;
}

const ChatHeader = ({ isLive = false }: ChatHeaderProps) => {
  return (
    <div css={header}>
      <img src={VoidaLogo} alt="VOIDA 로고" css={logo} />
      <button css={joinBtn}>
        {isLive ? <Wifi css={liveIcon} /> : <WifiOff css={liveIcon} />}
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
  background: var(--color-green);
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
    background: var(--color-green-dark);
  }
`;

const liveIcon = css`
  width: 22px;
  height: 22px;
  object-fit: contain;
`;
