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
  padding: 2.5rem;
  padding-bottom: 1rem;
  background: transparent;

  @media (max-width: 1400px) {
    padding: 2rem;
  }

  @media (max-width: 1200px) {
    padding: 1.5rem;
  }

  @media (max-width: 900px) {
    flex-direction: column;
    gap: 1rem;
    padding: 1.2rem;
  }

  @media (max-width: 600px) {
    padding: 1rem;
  }
`;

const logo = css`
  height: 40px;

  @media (max-width: 1400px) {
    height: 36px;
  }

  @media (max-width: 1200px) {
    height: 32px;
  }

  @media (max-width: 900px) {
    height: 28px;
  }

  @media (max-width: 600px) {
    height: 24px;
  }
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

  @media (max-width: 1400px) {
    padding: 9px 14px;
    font-size: 15px;
  }

  @media (max-width: 1200px) {
    padding: 8px 12px;
    font-size: 14px;
  }

  @media (max-width: 900px) {
    padding: 8px 12px;
    font-size: 14px;
    width: 80%;
    justify-content: center;
  }

  @media (max-width: 600px) {
    padding: 8px 10px;
    font-size: 13px;
  }
`;

const liveIcon = css`
  width: 22px;
  height: 22px;

  @media (max-width: 1400px) {
    width: 20px;
    height: 20px;
  }

  @media (max-width: 1200px) {
    width: 18px;
    height: 18px;
  }

  @media (max-width: 900px) {
    width: 18px;
    height: 18px;
  }

  @media (max-width: 600px) {
    width: 16px;
    height: 16px;
  }
`;
