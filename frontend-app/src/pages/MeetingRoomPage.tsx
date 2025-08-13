/** @jsxImportSource @emotion/react */
import { css, keyframes } from '@emotion/react';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import MemberPanel from '@/components/meeting-room/members/MemberPanel';
import ChatPanel from '@/components/meeting-room/chat/ChatPanel';
import { getRoomInfo, getRoomMembers } from '@/apis/meeting-room/meetingRoomApi';
import { getRoomChatHistory } from '@/apis/stomp/meetingRoomStomp';
import { useMeetingRoomStore } from '@/stores/useMeetingRoomStore';

const SIDEBAR_WIDTH = 400; // 필요 시 조절

const MeetingRoomPage = () => {
  const { meetingRoomId } = useParams<{ meetingRoomId: string }>();
  const { setRoomInfo, setParticipants, setChatMessages } = useMeetingRoomStore();
  const [isReady, setIsReady] = useState(false);
  const [showMembers, setShowMembers] = useState(true);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!meetingRoomId) return;

    const fetchData = async () => {
      try {
        const roomData = await getRoomInfo(meetingRoomId);
        setRoomInfo({ ...roomData, meetingRoomId });
      } catch (err) {
        console.error('방 정보 로딩 실패:', err);
      }

      try {
        const membersData = await getRoomMembers(meetingRoomId);
        setParticipants(membersData ?? []);
      } catch (err) {
        console.error('참여자 목록 로딩 실패:', err);
      }

      try {
        const chatData = await getRoomChatHistory(meetingRoomId);
        const chatList = chatData?.chatHistory?.content ?? [];
        setChatMessages(chatList);
      } catch (err) {
        console.error('채팅 기록 로딩 실패:', err);
      }

      setIsReady(true);
    };

    fetchData();
  }, [meetingRoomId, setRoomInfo, setParticipants, setChatMessages]);

  const handleMouseEnter = () => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => {}, 120);
  };

  const handleMouseLeave = () => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
  };

  return (
    <div css={container}>
      <aside css={sidebar(showMembers)}>
        <div css={sidebarInner(showMembers)}>
          {showMembers && <MemberPanel />}
        </div>
      </aside>

      <div
        css={edgeHitbox(showMembers)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button
          css={edgeHandle}
          aria-label={showMembers ? '참여자 패널 닫기' : '참여자 패널 열기'}
          onClick={() => setShowMembers(v => !v)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setShowMembers(v => !v);
            }
          }}
        >
          <span className="label">{showMembers ? '닫기' : '열기'}</span>
        </button>
      </div>
      <div css={chatArea}>
        {isReady && <ChatPanel meetingRoomId={meetingRoomId!} />}
      </div>
    </div>
  );
};

export default MeetingRoomPage;

const container = css`
  position: relative;
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: #fff;
  position: relative; 
`;

const sidebar = (open: boolean) => css`
  width: ${open ? `${SIDEBAR_WIDTH}px` : '0px'};
  transition: width 0.25s ease;
  border-right: ${open ? '1px solid #eef1f5' : 'none'};
  background: #ffffff;
  overflow: hidden;
`;

const sidebarInner = (open: boolean) => css`
  width: ${SIDEBAR_WIDTH}px; /* 내부 폭은 고정 */
  height: 100%;
  opacity: ${open ? 1 : 0};
  transition: opacity 0.2s ease;
`;

const chatArea = css`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: linear-gradient(180deg, #fafbff 0%, #ffffff 60%);
`;

const floatIn = keyframes`
  from { transform: translateX(-6px); opacity: 0; }
  to   { transform: translateX(0);    opacity: 1; }
`;

const edgeHitbox = (open: boolean) => css`
  position: absolute;
  left: ${open ? `${SIDEBAR_WIDTH - 6}px` : '0px'};
  top: 50%;
  transform: translateY(-50%);
  width: 16px;        
  height: 160px;    
  display: flex;
  align-items: center;
  justify-content: ${open ? 'flex-end' : 'flex-start'};
  z-index: 9999;

  @media (max-width: 900px) {
    width: 22px;
    height: 200px;
  }
`;

const edgeHandle = css`
  border: none;
  background: linear-gradient(135deg, #6e8efb, #a777e3); 
  width: 28px;
  height: 72px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  opacity: 0.85;
  transition: opacity 0.15s ease, transform 0.15s ease, background 0.15s ease;
  animation: ${floatIn} 0.18s ease both;
  outline: none;
  cursor: pointer;

  &:hover,
  &:focus-visible {
    opacity: 1;
    transform: scale(1.05);
    background: linear-gradient(135deg, #5a7de0, #9466d6);
  }

  .label {
    position: absolute;
    left: 34px;
    white-space: nowrap;
    font-size: 12px;
    padding: 2px 6px;
    border-radius: 6px;
    background: rgba(17, 24, 39, 0.9);
    color: #fff;
    opacity: 0;
    transition: opacity 0.12s ease;
    pointer-events: none;
  }

  &:hover .label,
  &:focus-visible .label {
    opacity: 0.9;
  }
`;
