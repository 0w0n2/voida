/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import VoidaLogo from '@/assets/logo/voida-logo.png';
import { Wifi } from 'lucide-react';
import { getRoomStatus, startLiveSession, getLiveToken, connectOpenVidu } from '@/apis/live-room/openViduApi';
import { useOpenViduChat } from '@/hooks/useOpenViduChat';
import { useMeetingRoomStore } from '@/stores/useMeetingRoomStore';

const ChatHeader = () => {
  const roomInfo = useMeetingRoomStore((state) => state.roomInfo);
  const meetingRoomId = roomInfo?.meetingRoomId ?? '';

  const { handleSignalMessage } = useOpenViduChat();

  const handleJoinLive = async () => {
    if (!meetingRoomId) {
      console.warn('roomId가 없습니다.');
      return;
    }
    try {
      const statusRes = await getRoomStatus(meetingRoomId);

      if (statusRes.status === 'IDLE') {
        await startLiveSession(meetingRoomId);
      }

      const token = await getLiveToken(meetingRoomId);
      await connectOpenVidu(token, handleSignalMessage);
      
      window.electronAPI?.openOverlay?.();
    } catch (err) {
      console.error('라이브 참여 실패', err);
    }
  };

  return (
    <div css={header}>
      <img src={VoidaLogo} alt="VOIDA 로고" css={logo} />
      <button css={joinBtn} onClick={handleJoinLive} disabled={!meetingRoomId}>
        <Wifi css={liveIcon} />
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

const baseBtn = css`
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: background 0.2s ease, opacity 0.2s ease;
  cursor: pointer;

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

const joinBtn = css`
  ${baseBtn};
  background: var(--color-green);
  color: white;

  &:hover {
    background: var(--color-green-dark);
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
