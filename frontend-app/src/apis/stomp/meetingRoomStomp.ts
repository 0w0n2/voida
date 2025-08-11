import apiInstanceSpring from '@/apis/core/apiInstanceSpring';

export interface ChatMessage {
  senderUuid: string;
  senderNickname: string;
  profileImageUrl?: string;
  content: string;
  sendedAt: string;
  mine?: boolean;
}

export interface PageableChatHistory {
  content: ChatMessage[];
  number: number;
  size: number; 
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
}

export const getRoomChatHistory = async (
  meetingRoomId: string,
  page = 0,
  size = 20
): Promise<PageableChatHistory> => {
  const res = await apiInstanceSpring.get(`/v1/meeting-rooms/${meetingRoomId}/chats`, {
    params: { page, size },
  });
  return res.data.result as PageableChatHistory;
};
