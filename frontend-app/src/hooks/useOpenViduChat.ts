import { useState } from 'react';

export const useOpenViduChat = () => {
  const [messages, setMessages] = useState<any[]>([]);

  // OpenVidu Signal 이벤트에서 호출
  const handleSignalMessage = (raw: string) => {
    try {
      const parsed = JSON.parse(raw); // { userId, userNickname, userImageUrl, content }
      setMessages((prev) => [...prev, parsed]);
    } catch (e) {
      console.warn('채팅 파싱 실패', raw);
    }
  };

  return { messages, handleSignalMessage };
};
