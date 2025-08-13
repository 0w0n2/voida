/** @jsxImportSource @emotion/react */
import { css, keyframes } from '@emotion/react';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import MemberPanel from '@/components/meeting-room/members/MemberPanel';
import ChatPanel from '@/components/meeting-room/chat/ChatPanel';
import { getRoomInfo, getRoomMembers } from '@/apis/meeting-room/meetingRoomApi';
import { getRoomChatHistory } from '@/apis/stomp/meetingRoomStomp';
import { useMeetingRoomStore } from '@/stores/useMeetingRoomStore';

const MeetingRoomPage = () => {
  const { meetingRoomId } = useParams<{ meetingRoomId: string }>();
  const { setRoomInfo, setParticipants, setChatMessages } = useMeetingRoomStore();
  const [isReady, setIsReady] = useState(false);
  const [showMembers, setShowMembers] = useState(true);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!meetingRoomId) return;

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Fetches and sets the meeting room information, participants, and chat history.
 * 
 * This function performs the following asynchronous operations:
 * 1. Retrieves the room information using `getRoomInfo` and updates the store.
 * 2. Fetches the list of participants via `getRoomMembers` and updates the store.
 * 3. Loads the chat history using `getRoomChatHistory` and updates the store.
 * 
 * If any of these operations fail, an error message is logged to the console.
 * Once all data is fetched successfully, it sets the `isReady` state to true.
 */

/*******  efd4a416-cb2d-4192-86d9-1bc53d9eed8a  *******/
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
  width: ${open ? `400px` : '0px'};
  transition: width 0.25s ease;
  border-right: ${open ? '1px solid #eef1f5' : 'none'};
  background: #ffffff;
  overflow: hidden;

  @media (max-width: 1400px) {
    flex: none;
    width: 400px;
  }
  @media (max-width: 1200px) {
    flex: none;
    width: 350px;
  }
  @media (max-width: 900px) {
    flex: none;
    width: 300px;
  }
`;

const sidebarInner = (open: boolean) => css`
  flex: 1;
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
  left: ${open ? `394px` : '0px'};
  top: 50%;
  transform: translateY(-50%);
  width: 16px;        
  height: 160px;    
  display: flex;
  align-items: center;
  justify-content: ${open ? 'flex-end' : 'flex-start'};
  z-index: 10;

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

  /* 라벨 스타일 */
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

  /* 반응형 */
  @media (max-width: 1200px) {
    width: 26px;
    height: 64px;
    gap: 5px;
    .label {
      font-size: 11px;
      left: 30px;
    }
  }
  @media (max-width: 900px) {
    width: 24px;
    height: 58px;
    gap: 4px;
    .label {
      font-size: 10px;
      left: 28px;
    }
  }
  @media (max-width: 600px) {
    width: 22px;
    height: 52px;
    gap: 3px;
    .label {
      font-size: 9px;
      left: 26px;
    }
  }
`;
