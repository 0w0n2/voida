import apiInstance from '@/apis/core/apiInstance';

export interface ChatMessage {
  senderUuid: string;
  senderNickname: string;
  profileImageUrl?: string;
  content: string;
  sendedAt: string;
  mine: boolean;
}

export interface ChatHistory {
  content: ChatMessage[];
  cursorId?: string;
  hasNext: boolean;
}

export interface ChatHistoryResponse {
  chatHistory: ChatHistory;
}

// 대기실 채팅 히스토리 조회 (스크롤 페이징)
export const getRoomChatHistory = async (
  meetingRoomId: string,
  page?: number,
  size?: number
): Promise<ChatHistoryResponse> => {
  const res = await apiInstance.get(`/v1/meeting-rooms/${meetingRoomId}/chats`, {
    params: {
      page: page ?? 0,
      size: size ?? 20,
    },
  });
  return res.data.result;
};

// 대기실 채팅 메시지 저장
export const postChatMessage = async (meetingRoomId: string, content: string): Promise<void> => {
  await apiInstance.post(`/v1/meeting-rooms/${meetingRoomId}/chats`, { content });
};