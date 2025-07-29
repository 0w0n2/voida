/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
// import { getMessages, sendMessage } from '@/apis/meetingRoomApi';
// import { postMessage } from '@/utils/stompClient'; // STOMP publish 함수

const dummyMessages = [
  { writerNickname: '민희', content: '안녕하세요!', isMine: false },
  { writerNickname: '나', content: '안녕하세요~', isMine: true },
  { writerNickname: '준호', content: '회의 준비되셨나요?', isMine: false },
];

const ChatPanel = ({ meetingRoomId }: { meetingRoomId: string }) => {
  const [messages, setMessages] = useState(dummyMessages);
  const [input, setInput] = useState('');

  // 나중에 REST API로 초기 채팅 기록을 불러오는 부분
  useEffect(() => {
    // getMessages(meetingRoomId).then((res) => setMessages(res.data));
  }, [meetingRoomId]);

  const handleSend = () => {
    if (!input.trim()) return;

    // UI에 바로 반영
    const newMsg = { writerNickname: '나', content: input, isMine: true };
    setMessages((prev) => [...prev, newMsg]);

    // API 전송 또는 STOMP publish (백엔드 연동 시 활성화)
    // sendMessage(meetingRoomId, input);
    // postMessage(meetingRoomId, input);

    setInput('');
  };

  return (
    <div css={panel}>
      <div css={chatBox}>
        {messages.map((m, i) => (
          <div key={i} css={[bubble, m.isMine ? mine : other]}>
            {!m.isMine && <div css={nickname}>{m.writerNickname}</div>}
            <div>{m.content}</div>
          </div>
        ))}
      </div>
      <div css={inputRow}>
        <input
          css={inputStyle}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지를 입력하세요..."
        />
        <button css={sendBtn} onClick={handleSend}>
          전송
        </button>
      </div>
    </div>
  );
};

export default ChatPanel;

const panel = css`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fafafa;
`;

const chatBox = css`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const bubble = css`
  max-width: 60%;
  padding: 8px 12px;
  border-radius: 12px;
  word-break: break-word;
`;

const mine = css`
  align-self: flex-end;
  background: #3182f6;
  color: white;
`;

const other = css`
  align-self: flex-start;
  background: white;
  border: 1px solid #ddd;
`;

const nickname = css`
  font-size: 12px;
  color: #555;
  margin-bottom: 4px;
`;

const inputRow = css`
  display: flex;
  border-top: 1px solid #ddd;
  padding: 8px;
  background: white;
`;

const inputStyle = css`
  flex: 1;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 6px 8px;
  outline: none;
`;

const sendBtn = css`
  margin-left: 8px;
  padding: 6px 12px;
  background: #3182f6;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;
