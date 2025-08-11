/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import exit from '@/assets/icons/exitIcon.png';
import user from '@/assets/icons/user.png';

const LiveOverlay = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const dummy = [
    {
      messageId: 'msg-001',
      user: {
        userId: 'user-abc',
        userNickname: '이진모',
        userImageUrl: 'https://i.pravatar.cc/40?u=user-abc',
      },
      content: '안녕하세요! 여기로 와주세요.',
      timestamp: '2025-08-11T10:58:01Z',
    },
    {
      messageId: 'msg-002',
      user: {
        userId: 'user-abc',
        userNickname: '이혜원',
        userImageUrl: 'https://i.pravatar.cc/40?u=user-abc',
      },
      content: '안녕하세요! 여기로 와주세요.',
      timestamp: '2025-08-11T10:58:02Z',
    },
    {
      messageId: 'msg-003',
      user: {
        userId: 'user-def',
        userNickname: '전사123',
        userImageUrl: 'https://i.pravatar.cc/40?u=user-def',
      },
      content: '네, 지금 바로 가겠습니다!',
      timestamp: '2025-08-11T10:58:15Z',
    },
    {
      messageId: 'msg-004',
      user: {
        userId: 'user-ghi',
        userNickname: '김규찬',
        userImageUrl: 'https://i.pravatar.cc/40?u=user-ghi',
      },
      content: '저도 퀘스트 같이 해도 될까요?',
      timestamp: '2025-08-11T10:58:25Z',
    },
    {
      messageId: 'msg-005',
      user: {
        userId: 'user-abc',
        userNickname: '이민희',
        userImageUrl: 'https://i.pravatar.cc/40?u=user-abc',
      },
      content: '네 그럼요! 같이 해요 ㅎㅎ',
      timestamp: '2025-08-11T10:58:31Z',
    },
    {
      messageId: 'msg-006',
      user: {
        userId: 'user-def',
        userNickname: '이석재',
        userImageUrl: 'https://i.pravatar.cc/40?u=user-def',
      },
      content: 'ㅋㅋㅋ 좋아요!',
      timestamp: '2025-08-11T10:58:40Z',
    },
    {
      messageId: 'msg-007',
      user: {
        userId: 'gm-01',
        userNickname: '김수민',
        userImageUrl: 'https://i.pravatar.cc/40?u=gm-01',
      },
      content: '잠시 후 11시부터 10분간 긴급 서버 점검이 있을 예정입니다.',
      timestamp: '2025-08-11T10:59:00Z',
    },
    {
      messageId: 'msg-008',
      user: {
        userId: 'user-ghi',
        userNickname: '법사GOD',
        userImageUrl: 'https://i.pravatar.cc/40?u=user-ghi',
      },
      content: '헐... 점검이래요. 빨리 잡아야겠네요!',
      timestamp: '2025-08-11T10:59:12Z',
    },
  ];

  const exitLive = () => {
    window.electronAPI.closeOverlay();
  };

  return (
    <div css={overlayContainer}>
      <div css={[overlayContent, isExpanded ? expanded : collapsed]}>
        <div css={header}>
          <div css={headerLeft}>
            {Array.from(
              new Map(dummy.map((msg) => [msg.user.userId, msg.user])).values(),
            ).map((user) => (
              <img
                key={user.userId}
                src={user.userImageUrl}
                alt={user.userNickname}
                title={user.userNickname}
                css={profile}
              />
            ))}
          </div>
          <div css={headerRight}>
            <img src={user} alt="User" css={userBtn} />
            <p>{dummy.length}</p>
            <img
              src={exit}
              alt="Exit"
              css={outBtn}
              onClick={() => exitLive()}
            />
          </div>
        </div>

        {isExpanded && (
          <div css={body}>
            <div css={messagesWrap}>
              {dummy.slice(-6).map((msg) => (
                <div key={msg.messageId} css={messageRow}>
                  <img
                    src={msg.user.userImageUrl}
                    alt={msg.user.userNickname}
                    css={profile}
                  />
                  <p>
                    {msg.user.userNickname}: {msg.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
        <div>{/* 영상 노출 부분 */}</div>
        <button onClick={() => setIsExpanded(!isExpanded)} css={toggleBtn}>
          {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </button>
      </div>
    </div>
  );
};

export default LiveOverlay;

const overlayContainer = css`
  width: 100vw;
  height: 100vh;
  background: transparent;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  padding: 16px;
`;

const overlayContent = css`
  background: rgba(0, 0, 0, 0.4);
  color: white;
  border-radius: 24px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  overflow: hidden;
`;

const expanded = css`
  width: 300px;
  height: 460px;
`;

const collapsed = css`
  width: 320px;
  height: 60px;
`;

const header = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

const headerLeft = css`
  font-size: 14px;
  font-weight: bold;
`;

const headerRight = css`
  display: flex;
  align-items: center;
`;

const userBtn = css`
  width: 20px;
  height: 20px;
  cursor: pointer;
  margin-left: 10px;
  &:hover {
    color: #f87171;
  }
`;

const outBtn = css`
  width: 25px;
  height: 25px;
  cursor: pointer;
  margin-left: 10px;
  &:hover {
    color: #f87171;
  }
`;

const body = css`
  flex: 1;
  padding: 8px 4px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const toggleBtn = css`
  position: absolute;
  bottom: 6px;
  right: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 9999px;
  padding: 4px;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const profile = css`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
`;

const messageRow = css`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const messagesWrap = css`
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 8px;
`;
