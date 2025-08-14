/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useRef, useEffect, useState, useCallback } from 'react';
import ChatHeader from './ChatHeader';
import SendIcon from '@/assets/icons/send.png';
import ScrollDown from '@/assets/icons/scroll-down.png';
import { SmilePlus } from 'lucide-react';
import Picker from 'emoji-picker-react';
import { useAuthStore } from '@/stores/authStore';
import { useMeetingRoomStore } from '@/stores/useMeetingRoomStore';
import { getRoomChatHistory } from '@/apis/stomp/meetingRoomStomp';
import { getUser } from '@/apis/auth/userApi';
import { connectStomp, disconnectStomp, publishMessage } from '@/apis/stomp/stompClient';
import { useAlertStore } from '@/stores/useAlertStore';

interface ChatPanelProps {
  meetingRoomId: string;
}

export default function ChatPanel({ meetingRoomId }: ChatPanelProps) {
  const { chatMessages, setChatMessages, addChatMessage, clearChatMessages } = useMeetingRoomStore();
  const roomMessages = chatMessages[meetingRoomId] || [];
  const [input, setInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const chatBoxRef = useRef<HTMLDivElement>(null);
  const lastMessageId = useRef<string | null>(null);
  const emojiAreaRef = useRef<HTMLDivElement>(null);

  const { setUser, clearUser } = useAuthStore();
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (!emojiAreaRef.current?.contains(e.target as Node)) setShowEmojiPicker(false);
    };
    if (showEmojiPicker) document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [showEmojiPicker]);

  useEffect(() => {
    (async () => {
      if (accessToken) {
        try {
          const { data } = await getUser();
          const m = data.result.member;
          setUser({
            email: m.email,
            nickname: m.nickname,
            profileImage: m.profileImageUrl || '',
            memberUuid: m.memberUuid,
          });
        } catch {
          clearUser();
        }
      }
      connectStomp(meetingRoomId, (msg) => {
        const myUuid = useAuthStore.getState().user?.memberUuid;
        addChatMessage(meetingRoomId, { ...msg, isMine: msg.senderUuid === myUuid });
      });
    })();
    return () => {
      disconnectStomp();
      clearChatMessages(meetingRoomId);
    };
  }, [meetingRoomId]);

  useEffect(() => {
    (async () => {
      try {
        const res = await getRoomChatHistory(meetingRoomId, 0, 20);
        const myUuid = useAuthStore.getState().user?.memberUuid;
        const msgs = res.content.map((m) => ({ ...m, isMine: m.senderUuid === myUuid })).reverse();
        setChatMessages(meetingRoomId, msgs, true);
        setPage(res.number);
        chatBoxRef.current!.scrollTop = chatBoxRef.current!.scrollHeight;
      } catch {
        setChatMessages(meetingRoomId, [], true);
      }
    })();
  }, [meetingRoomId]);

  const fetchOldMessages = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const prevScrollHeight = chatBoxRef.current!.scrollHeight;

    try {
      const nextPage = page + 1;
      const res = await getRoomChatHistory(meetingRoomId, nextPage, 20);
      if (!res.content.length) {
        setHasMore(false);
        useAlertStore.getState().showAlert('모든 채팅 기록을 불러왔습니다.', 'top');
        return;
      }
      const myUuid = useAuthStore.getState().user?.memberUuid;
      const msgs = res.content.map((m) => ({ ...m, isMine: m.senderUuid === myUuid })).reverse();
      setChatMessages(meetingRoomId, [...msgs, ...roomMessages], true);
      setPage(nextPage);
      chatBoxRef.current!.scrollTop = chatBoxRef.current!.scrollHeight - prevScrollHeight;
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, roomMessages]);

  const handleScroll = () => {
    const el = chatBoxRef.current;
    if (!el) return;
    if (el.scrollTop === 0) fetchOldMessages();
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50;
    setShowScrollButton(!nearBottom);
  };

  useEffect(() => {
    const el = chatBoxRef.current;
    const lastMessage = roomMessages.at(-1);
    if (!lastMessage || lastMessage.sendedAt === lastMessageId.current) return;
    const nearBottom = el!.scrollHeight - el!.scrollTop - el!.clientHeight < 100;
    if (lastMessage.isMine || nearBottom) el!.scrollTop = el!.scrollHeight;
    lastMessageId.current = lastMessage.sendedAt;
  }, [roomMessages]);

  const handleEmojiClick = (emojiData: any) => setInput((prev) => prev + emojiData.emoji);
  const handleSend = () => {
    if (!input.trim()) return;
    publishMessage(meetingRoomId, input);
    setInput('');
  };

  return (
    <div css={panel}>
      <ChatHeader isLive />
      <div css={chatBox} ref={chatBoxRef} onScroll={handleScroll}>
        {roomMessages.map((m, idx) => (
          <div key={idx} css={[chatItem, m.isMine && myItem]}>
            {!m.isMine && m.profileImageUrl && (
              <img src={`${import.meta.env.VITE_CDN_URL}/${m.profileImageUrl}`} alt={m.senderNickname} css={avatar} />
            )}
            <div css={contentBox}>
              {!m.isMine && (
                <div css={metaRow}>
                  <span css={nickname}>{m.senderNickname}</span>
                  <span css={time}>
                    {new Date(m.sendedAt).toLocaleString('ko-KR', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              )}
              <div css={[bubble, m.isMine ? mine : other]}>{m.content}</div>
            </div>
          </div>
        ))}
        {showScrollButton && (
          <button css={scrollButton} onClick={() => (chatBoxRef.current!.scrollTop = chatBoxRef.current!.scrollHeight)}>
            <img src={ScrollDown} alt="아래로 스크롤" css={scroll} />
          </button>
        )}
      </div>

      <div css={inputRow}>
        <div css={inputWrapper}>
          <div ref={emojiAreaRef} css={emojiArea}>
            <button onClick={() => setShowEmojiPicker((p) => !p)} css={emojiBtn} type="button">
              <SmilePlus css={emojiIconStyle} />
            </button>
            {showEmojiPicker && (
              <div css={emojiPickerWrapper}>
                <Picker onEmojiClick={handleEmojiClick} />
              </div>
            )}
          </div>

          <input
            css={inputStyle}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="메시지를 입력해주세요."
          />

          <button css={sendIconBtn} onClick={handleSend} type="button">
            <img src={SendIcon} alt="send" />
          </button>
        </div>
      </div>
    </div>
  );
}

const panel = css`
  flex: 1; 
  display: flex; 
  flex-direction: column; 
  height: 100%;
  background: linear-gradient(135deg, #fff8ffff 0%, #f0eaffff 50%, #e0efffff 100%);
`;

const chatBox = css`
  position: relative; 
  flex: 1; 
  padding: 2.5rem; 
  overflow-y: auto; 
  display: flex; 
  flex-direction: column; 
  gap: 8px;
  @media (max-width: 1400px){ padding:2rem; } @media (max-width:1200px){ padding:1.5rem; }
  @media (max-width: 900px){ padding:1rem; } @media (max-width:600px){ padding:0.5rem; }
`;

const scrollButton = css`
  position: fixed; 
  bottom: 150px; 
  align-self: center; 
  transform: translateX(-50%);
  background: rgba(0,0,0,0.5); 
  padding: 10px; 
  border-radius: 50%; 
  border: none; 
  cursor: pointer; 
  z-index: 1000;
  &:hover { background: rgba(0,0,0,0.7); }
`;

const scroll = css` 
  padding-top:5px; 
  width:30px; 
  height:30px; 
  background:transparent; 
`;

const chatItem = css` 
  display:flex; 
  align-items:flex-start; 
  gap:20px; 
  margin-bottom:10px; 
`;

const myItem = css` 
  justify-content:flex-end; 
`;

const avatar = css`
  width:44px; 
  height:44px; 
  border-radius:50%; 
  object-fit:cover;
  @media (max-width:1400px){ width:40px; height:40px; }
  @media (max-width:1200px){ width:36px; height:36px; }
  @media (max-width:900px){ width:32px; height:32px; }
  @media (max-width:600px){ width:28px; height:28px; }
`;

const contentBox = css` 
  display:flex; 
  flex-direction:column; 
  max-width:70%; 
`;

const metaRow = css` 
  display:flex; 
  align-items:center; 
  gap:10px; 
  margin-bottom:6px; 
`;

const nickname = css` 
  font-size:16px; 
  font-family:'NanumSquareB'; 
  color:var(--color-text); 
`;

const time = css` 
  font-size:12px; 
  color:var(--color-gray-600); 
`;

const bubble = css` 
  display:inline-block; 
  max-width:100%; 
  padding:12px 16px; 
  border-radius:12px; 
  word-break:break-word; 
  font-size:15px; 
  line-height:1.4; 
`;

const mine = css` 
  align-self:flex-end; 
  background:var(--color-primary); 
  color:#fff; 
`;

const other = css` 
  align-self:flex-start; 
  background:var(--color-bg-white); 
  color:var(--color-text); 
`;

const inputRow = css`
  display:flex; 
  box-sizing:border-box; 
  padding:1.5rem 2.5rem; 
  background:#fff; 
  height:120px; 
  flex-shrink:0;
  @media (max-width:1400px){ height:100px; padding:12px 40px; }
  @media (max-width:1200px){ height:90px; padding:10px 30px; }
  @media (max-width:900px){ height:80px; padding:8px 20px; }
  @media (max-width:600px){ height:70px; padding:6px 12px; }
`;

const inputWrapper = css`
  position:relative; 
  flex:1; 
  display:flex; 
  align-items:center; 
  margin:0 50px;
  min-width: 150px;
  caret-color: black;
  &:hover input { border-color: var(--color-primary); background:#f0f7ff; }
`;

const inputStyle = css`
  width:100%; 
  border:2px solid #ccc; 
  border-radius:999px;
  padding: 14px 80px 14px 80px; 
  font-size:16px; outline:none; height:70%; background:#fff; transition:all .2s ease;
  @media (max-width:1400px){ font-size:15px; padding:12px 52px 12px 52px; }
  @media (max-width:1200px){ font-size:14px; padding:12px 48px 12px 48px; }
  @media (max-width:900px){ font-size:13px; padding:10px 44px 10px 44px; }
  @media (max-width:600px){ font-size:12px; padding:8px 40px 8px 40px; }
`;

const emojiArea = css`
  position:absolute; 
  left:14px; 
  top:50%; 
  transform:translateY(-50%);
  display:flex; 
  align-items:center; 
  justify-content:center;
  margin-left: 20px;
`;

const emojiBtn = css`
  background:transparent; 
  border:none; 
  cursor:pointer; 
  padding:0; 
  line-height:0;
`;

const emojiIconStyle = css`
  width:24px; 
  height:24px; 
  color:#666; 
  transition:color .2s ease;
  &:hover{ color:var(--color-primary); }
  @media (max-width:900px){ width:22px; height:22px; }
  @media (max-width:600px){ width:20px; height:20px; }
`;

const emojiPickerWrapper = css`
  position:absolute; 
  bottom:46px; 
  left:-6px; 
  z-index:1000;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12); 
  border-radius:12px; 
  overflow:hidden;
`;

const sendIconBtn = css`
  position:absolute; 
  right:16px; 
  top:50%; 
  transform:translateY(-50%);
  border:none; 
  background:transparent; 
  cursor:pointer; 
  display:flex; 
  align-items:center; 
  justify-content:center;
  margin-right:20px; 
  width:40px; 
  height:40px; 
  border-radius:50%; 
  transition:background-color .2s ease;
  &:hover{ background:#e0edff; }
  img{ width:24px; height:24px; object-fit:contain; }
  @media (max-width:900px){ width:36px; height:36px; margin-right:16px; }
  @media (max-width:600px){ width:32px; height:32px; margin-right:10px; }
`;
