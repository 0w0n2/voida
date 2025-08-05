// apis/chatService.ts
import { client } from './stompClient';

export const connectStompChat = async () => {
  const roomId = 'main-room'; // 실제 roomId 필요
  const chatHistory = await fetch(`/api/chat/history/${roomId}`).then(res => res.json());
  
  // 전역 store에 초기 채팅 세팅
  // chatStore.set(chatHistory)

  client.subscribe(`/topic/chat/${roomId}`, (message) => {
    const data = JSON.parse(message.body);
    // chatStore.add(data)
  });
};
