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

interface ChatPanelProps { meetingRoomId: string; }

const ChatPanel = ({ meetingRoomId }: ChatPanelProps) => {
  const { chatMessages, setChatMessages, addChatMessage, clearChatMessages } = useMeetingRoomStore();
  const roomMessages = chatMessages[meetingRoomId] || [];
  const [input, setInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiAreaRef = useRef<HTMLDivElement>(null); // 버튼+피커 래퍼
  const [loading, setLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const lastMessageId = useRef<string | null>(null);
  const [page, setPage] = useState(0);
  const { user, setUser, clearUser } = useAuthStore();
  const accessToken = localStorage.getItem('accessToken');

  // 외부 클릭/ESC 시 이모지 피커 닫기
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (emojiAreaRef.current && !emojiAreaRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowEmojiPicker(false);
    };
    if (showEmojiPicker) {
      document.addEventListener('mousedown', onDocClick);
      document.addEventListener('keydown', onKey);
    }
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [showEmojiPicker]);

  useEffect(() => {
    const run = async () => {
      if (accessToken && !user) {
        try {
          const res = await getUser();
          const data = res.data.result.member;
          setUser({
            email: data.email,
            nickname: data.nickname,
            profileImage: data.profileImageUrl || '',
            memberUuid: data.memberUuid,
          });
        } catch (err) {
          console.error('유저 정보 로드 실패', err);
          clearUser();
        }
      }
      connectStomp(meetingRoomId, (msg) => {
        const myUuid = useAuthStore.getState().user?.memberUuid;
        const isMine = msg.isMine ?? (msg.senderUuid === myUuid);
        addChatMessage(meetingRoomId, { ...msg, isMine });
      });
    };
    run();
    return () => { disconnectStomp(); clearChatMessages(meetingRoomId); };
  }, [meetingRoomId, accessToken, user, setUser, clearUser, addChatMessage, clearChatMessages]);

  useEffect(() => {
    const loadInitial = async () => {
      try {
        const res = await getRoomChatHistory(meetingRoomId, 0, 20);
        const myUuid = useAuthStore.getState().user?.memberUuid;
        const pageItems = [...res.content].map(m => ({ ...m, isMine: m.isMine ?? (m.senderUuid === myUuid) })).reverse();
        setChatMessages(meetingRoomId, pageItems, true);
        setPage(res.number);
        requestAnimationFrame(() => {
          chatBoxRef.current && (chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight);
        });
      } catch (error) {
        console.error('채팅 기록 초기 로딩 실패:', error);
        setChatMessages(meetingRoomId, [], true);
      }
    };
    loadInitial();
  }, [meetingRoomId, setChatMessages]);

  const fetchOldMessages = useCallback(async () => {
    if (loading || !chatBoxRef.current) return;
    setLoading(true);
    const el = chatBoxRef.current;
    const prevScrollHeight = el.scrollHeight;
    try {
      const nextPage = page + 1;
      const res = await getRoomChatHistory(meetingRoomId, nextPage, 20);
      const myUuid = useAuthStore.getState().user?.memberUuid;
      const pageItems = [...res.content].map(m => ({ ...m, isMine: m.isMine ?? (m.senderUuid === myUuid) })).reverse();
      setChatMessages(meetingRoomId, [...pageItems, ...roomMessages], true);
      setPage(nextPage);
      requestAnimationFrame(() => {
        if (chatBoxRef.current) {
          chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight - prevScrollHeight;
        }
      });
    } catch (error) {
      console.error('이전 메시지 로딩 실패:', error);
    }
    setLoading(false);
  }, [loading, meetingRoomId, page, roomMessages, setChatMessages]);

  const handleScroll = () => {
    const el = chatBoxRef.current;
    if (!el || loading) return;
    if (el.scrollTop === 0) fetchOldMessages();
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50;
    setShowScrollButton(!nearBottom);
  };

  useEffect(() => {
    if (loading || !chatBoxRef.current) return;
    const el = chatBoxRef.current;
    const lastMessage = roomMessages[roomMessages.length - 1];
    if (!lastMessage || lastMessage.sendedAt === lastMessageId.current) return;
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    if (lastMessage.isMine || isNearBottom) el.scrollTop = el.scrollHeight;
    lastMessageId.current = lastMessage.sendedAt;
  }, [roomMessages, loading]);

  const handleEmojiClick = (emojiData: any) => setInput(prev => prev + emojiData.emoji);
  const handleSend = () => { if (!input.trim()) return; publishMessage(meetingRoomId, input); setInput(''); };

  return (
    <div css={panel}>
      <ChatHeader isLive />
      <div css={chatBox} ref={chatBoxRef} onScroll={handleScroll}>
        {roomMessages.map((m, index) => (
          <div key={index} css={[chatItem, m.isMine && myItem]}>
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
          <button
            css={scrollButton}
            onClick={() => {
              chatBoxRef.current && (chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight);
              setShowScrollButton(false);
            }}
          >
            <img src={ScrollDown} alt="아래로 스크롤" css={scroll} />
          </button>
        )}
      </div>

      <div css={inputRow}>
        <div css={inputWrapper}>
          {/* 이모지 버튼 + 피커 (입력창 안쪽 왼쪽) */}
          <div ref={emojiAreaRef} css={emojiArea}>
            <button
              aria-label="이모지 선택"
              onClick={() => setShowEmojiPicker(prev => !prev)}
              css={emojiBtn}
              type="button"
            >
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

          <button css={sendIconBtn} onClick={handleSend} aria-label="메시지 전송" type="button">
            <img src={SendIcon} alt="send" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;

const panel = css`
  flex: 1; display: flex; flex-direction: column; height: 100%;
  background: linear-gradient(135deg, #fff8ffff 0%, #f0eaffff 50%, #e0efffff 100%);
`;
const chatBox = css`
  position: relative; flex: 1; padding: 2.5rem; overflow-y: auto; display: flex; flex-direction: column; gap: 8px;
  @media (max-width: 1400px){ padding:2rem; } @media (max-width:1200px){ padding:1.5rem; }
  @media (max-width: 900px){ padding:1rem; } @media (max-width:600px){ padding:0.5rem; }
`;
const scrollButton = css`
  position: fixed; bottom: 150px; align-self: center; transform: translateX(-50%);
  background: rgba(0,0,0,0.5); padding: 10px; border-radius: 50%; border: none; cursor: pointer; z-index: 1000;
  &:hover { background: rgba(0,0,0,0.7); }
`;
const scroll = css` padding-top:5px; width:30px; height:30px; background:transparent; `;
const chatItem = css` display:flex; align-items:flex-start; gap:20px; margin-bottom:10px; `;
const myItem = css` justify-content:flex-end; `;
const avatar = css`
  width:44px; height:44px; border-radius:50%; object-fit:cover;
  @media (max-width:1400px){ width:40px; height:40px; }
  @media (max-width:1200px){ width:36px; height:36px; }
  @media (max-width:900px){ width:32px; height:32px; }
  @media (max-width:600px){ width:28px; height:28px; }
`;
const contentBox = css` display:flex; flex-direction:column; max-width:70%; `;
const metaRow = css` display:flex; align-items:center; gap:10px; margin-bottom:6px; `;
const nickname = css` font-size:16px; font-family:'NanumSquareB'; color:var(--color-text); `;
const time = css` font-size:12px; color:var(--color-gray-600); `;
const bubble = css` display:inline-block; max-width:100%; padding:12px 16px; border-radius:12px; word-break:break-word; font-size:15px; line-height:1.4; `;
const mine = css` align-self:flex-end; background:var(--color-primary); color:#fff; `;
const other = css` align-self:flex-start; background:var(--color-bg-white); color:var(--color-text); `;

const inputRow = css`
  display:flex; box-sizing:border-box; padding:1.5rem 2.5rem; background:#fff; height:120px; flex-shrink:0;
  @media (max-width:1400px){ height:100px; padding:12px 40px; }
  @media (max-width:1200px){ height:90px; padding:10px 30px; }
  @media (max-width:900px){ height:80px; padding:8px 20px; }
  @media (max-width:600px){ height:70px; padding:6px 12px; }
`;
const inputWrapper = css`
  position:relative; flex:1; display:flex; align-items:center; margin:0 50px;
  &:hover input { border-color: var(--color-primary); background:#f0f7ff; }
`;

const inputStyle = css`
  width:100%; border:2px solid #ccc; border-radius:999px;
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
  background:transparent; border:none; cursor:pointer; padding:0; line-height:0;
`;
const emojiIconStyle = css`
  width:24px; height:24px; color:#666; transition:color .2s ease;
  &:hover{ color:var(--color-primary); }
  @media (max-width:900px){ width:22px; height:22px; }
  @media (max-width:600px){ width:20px; height:20px; }
`;

const emojiPickerWrapper = css`
  position:absolute; bottom:46px; left:-6px; z-index:1000;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12); border-radius:12px; overflow:hidden;
`;

const sendIconBtn = css`
  position:absolute; right:16px; top:50%; transform:translateY(-50%);
  border:none; background:transparent; cursor:pointer; display:flex; align-items:center; justify-content:center;
  margin-right:20px; width:40px; height:40px; border-radius:50%; transition:background-color .2s ease;
  &:hover{ background:#e0edff; }
  img{ width:24px; height:24px; object-fit:contain; }
  @media (max-width:900px){ width:36px; height:36px; margin-right:16px; }
  @media (max-width:600px){ width:32px; height:32px; margin-right:10px; }
`;
