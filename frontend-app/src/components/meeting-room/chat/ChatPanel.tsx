/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useRef, useEffect, useState } from 'react';
import ChatHeader from './ChatHeader';
import SendIcon from '@/assets/icons/send.png';
import ScrollDown from '@/assets/icons/scroll-down.png';
import { useMeetingRoomStore } from '@/store/meetingRoomStore';
import { getRoomChatHistory, postChatMessage } from '@/apis/meetingRoomApi';

const ChatPanel = ({ meetingRoomId }: { meetingRoomId: string }) => {
  const { chatMessages, setChatMessages, addChatMessage } =
    useMeetingRoomStore();

  const [input, setInput] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const lastMessageId = useRef<string | null>(null);
  const cursorIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    const loadInitial = async () => {
      const res = await getRoomChatHistory(meetingRoomId);
      setChatMessages(res.chatHistory.content);
      cursorIdRef.current = res.chatHistory.cursorId;
      setHasMore(res.chatHistory.hasNext);
    };
    loadInitial();
  }, [meetingRoomId, setChatMessages]);

  const fetchOldMessages = async () => {
    if (loading || !hasMore || !chatBoxRef.current) return;
    setLoading(true);

    const el = chatBoxRef.current;
    const prevScrollHeight = el.scrollHeight;
    const res = await getRoomChatHistory(meetingRoomId, cursorIdRef.current);

    if (res.chatHistory.content.length === 0) {
      setHasMore(false);
    } else {
      setChatMessages(
        [...res.chatHistory.content, ...chatMessages],
        true, // reset X, prepend
      );
      cursorIdRef.current = res.chatHistory.cursorId;
      setHasMore(res.chatHistory.hasNext);

      requestAnimationFrame(() => {
        if (chatBoxRef.current) {
          const newScrollHeight = chatBoxRef.current.scrollHeight;
          chatBoxRef.current.scrollTop = newScrollHeight - prevScrollHeight;
        }
      });
    }

    setLoading(false);
  };

  const handleScroll = () => {
    const el = chatBoxRef.current;
    if (!el || loading) return;

    if (el.scrollTop === 0) {
      fetchOldMessages();
    }

    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50;
    setShowScrollButton(!nearBottom);
  };

  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      setShowScrollButton(false);
    }
  };

  // 새 메시지가 도착하면 스크롤 처리
  useEffect(() => {
    if (loading || !chatBoxRef.current) return;

    const lastMessage = chatMessages[chatMessages.length - 1];
    if (lastMessage && lastMessage.createdAt !== lastMessageId.current) {
      if (lastMessage.isMine) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      }
    }
    lastMessageId.current = lastMessage?.createdAt ?? null;
  }, [chatMessages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    await postChatMessage(meetingRoomId, input);
    addChatMessage({
      senderId: 'me',
      writerNickname: '나',
      profileImageUrl: '',
      content: input,
      createdAt: new Date().toISOString(),
      isMine: true,
    });
    setInput('');
  };

  return (
    <div css={panel}>
      <ChatHeader isLive={true} />
      <div css={chatBox} ref={chatBoxRef} onScroll={handleScroll}>
        {chatMessages.map((m, index) => (
          <div key={index} css={[chatItem, m.isMine && myItem]}>
            {!m.isMine && m.profileImageUrl && (
              <img
                src={m.profileImageUrl}
                alt={m.writerNickname}
                css={avatar}
              />
            )}
            <div css={contentBox}>
              {!m.isMine && (
                <div css={metaRow}>
                  <span css={nickname}>{m.writerNickname}</span>
                  <span css={time}>
                    {new Date(m.createdAt).toLocaleString('ko-KR', {
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              )}
              <div css={[bubble, m.isMine ? mine : other]}>{m.content}</div>
            </div>
          </div>
        ))}
        {showScrollButton && (
          <button css={scrollButton} onClick={scrollToBottom}>
            <img src={ScrollDown} alt="아래로 스크롤" css={scroll} />
          </button>
        )}
      </div>
      <div css={inputRow}>
        <div css={inputWrapper}>
          <input
            css={inputStyle}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="메시지를 입력해주세요."
          />
          <button css={sendIconBtn} onClick={handleSend}>
            <img src={SendIcon} alt="send" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;

const panel = css`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: linear-gradient(
    135deg,
    #fff8ffff 0%,
    #f0eaffff 50%,
    #e0efffff 100%
  );
`;

const chatBox = css`
  position: relative;
  flex: 1;
  padding: 2.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const scrollButton = css`
  position: fixed;
  bottom: 150px;
  align-self: center;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.5);
  padding: 10px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  z-index: 1000;
  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
`;

const scroll = css`
  width: 30px;
  height: 30px;
  background: transparent;
`;

const chatItem = css`
  display: flex;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 10px;
`;

const myItem = css`
  justify-content: flex-end;
`;

const avatar = css`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
`;

const contentBox = css`
  display: flex;
  flex-direction: column;
  max-width: 70%;
`;

const metaRow = css`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
`;

const nickname = css`
  font-size: 16px;
  font-family: 'NanumSquareB';
  color: var(--color-text);
`;

const time = css`
  font-size: 12px;
  color: var(--color-gray-600);
`;

const bubble = css`
  display: inline-block;
  max-width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  word-break: break-word;
  font-size: 15px;
  line-height: 1.4;
`;

const mine = css`
  align-self: flex-end;
  background: var(--color-primary);
  color: white;
`;

const other = css`
  align-self: flex-start;
  background: var(--color-bg-white);
  color: var(--color-text);
`;

const inputRow = css`
  display: flex;
  padding: 15px;
  background: white;
  height: 120px;
`;

const inputWrapper = css`
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  margin: 0 50px;
  &:hover input {
    border-color: var(--color-primary);
    background: #f0f7ff;
  }
`;

const inputStyle = css`
  width: 100%;
  border: 2px solid #ccc;
  border-radius: 999px;
  padding: 14px 48px 14px 50px;
  font-size: 16px;
  outline: none;
  height: 70%;
  background: white;
  transition: all 0.2s ease;
`;

const sendIconBtn = css`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: background-color 0.2s ease;
  &:hover {
    background: #e0edff;
  }
  img {
    width: 24px;
    height: 24px;
    object-fit: contain;
  }
`;
