/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useEffect } from 'react';
import { Wifi } from 'lucide-react';
import { useMeetingRoomStore } from '@/stores/useMeetingRoomStore';
import { getUserOverview, getSession } from '@/apis/live-room/openViduApi';

const ChatHeader = () => {
  const roomInfo = useMeetingRoomStore((state) => state.roomInfo);
  const meetingRoomId = roomInfo?.meetingRoomId ?? '';
  const [isLive, setIsLive] = useState<boolean | null>(null);

  useEffect(() => {
    if (!meetingRoomId) return;

    const fetchSessionStatus = async () => {
      try {
        const sessionInfo = await getSession(meetingRoomId);
        const isLive = sessionInfo.participantCount > 0;
        setIsLive(isLive);
      } catch (err) {
        console.error('라이브 상태 확인 실패', err);
        setIsLive(false);
      }
    };

    fetchSessionStatus();
  }, [meetingRoomId]);

  const handleJoinLive = async () => {
    if (!meetingRoomId) {
      console.warn('roomId가 없습니다.');
      return;
    }

    try {
      const overview = await getUserOverview(); 
      const overlayPosition = overview?.setting?.overlayPosition ?? 'TOPRIGHT';
      const overlayTransparency = overview?.setting?.overlayTransparency ?? 40;

      window.electronAPI?.openOverlay?.({
        roomId: meetingRoomId,
        overlayPosition,
        overlayTransparency,
      });
    } catch (err) {
      console.error('라이브 참여 실패', err);
    }
  };

  return (
    <div css={header}>
      <button 
        css={joinBtn(isLive)} 
        onClick={handleJoinLive}
        disabled={!meetingRoomId || isLive === null}
      >
        <Wifi css={liveIcon} />
        <span>
          {isLive === null ? "확인 중..." : isLive ? "라이브 들어가기" : "라이브 만들기"}
        </span>
      </button>
    </div>
  );
};

export default ChatHeader;

const header = css`
  display: flex;
  justify-content: end;
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

// 버튼 스타일 (isLive 상태에 맞는 색상 적용)
const joinBtn = (isLive: boolean | null) => css`
  padding: 12px 20px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  color: white;
  background: ${isLive === null 
    ? 'linear-gradient(90deg, #6e8efb, #a777e3)' 
    : isLive 
    ? 'linear-gradient(90deg, #ff4e50, #f9a8d4)' 
    : 'linear-gradient(90deg, #6e8efb, #a777e3)'};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 0 20px 4px 
    ${isLive === null 
      ? '#6e8ffb5e'  
      : isLive 
      ? '#ff4e516e' 
      : '#6e8ffb93'}; 
    transform: translateY(-3px);   
  }

  &:disabled {
    background: #d3d3d3;
    cursor: not-allowed;
  }

  @media (max-width: 900px) {
    font-size: 14px;
    padding: 10px 18px;
  }

  @media (max-width: 600px) {
    font-size: 13px;
    padding: 8px 16px;
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
