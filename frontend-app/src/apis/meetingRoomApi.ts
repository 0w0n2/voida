import apiInstance from './apiInstance';

export interface RoomInfoResponse {
  title: string;
  category: string;
  thumbnailImageUrl: string;
  memberCount: number;
  participants: RoomParticipant[];
}

export interface RoomParticipant {
  memberId: number;
  nickname: string;
  profileImageUrl: string;
  state: 'HOST' | 'PARTICIPANT';
  lipTalkMode: boolean;
}

export interface ChatMessage {
  senderId: string;
  writerNickname: string;
  profileImageUrl: string;
  content: string;
  createdAt: string;
  isMine: boolean;
}

export interface ChatHistoryResponse {
  chatHistory: {
    content: ChatMessage[];
    cursorId?: string;
    hasNext: boolean;
  };
}

// 대기실 기본 정보 조회
export const getRoomInfo = async (
  meetingRoomId: string,
): Promise<RoomInfoResponse> => {
  const res = await apiInstance.get(`/v1/meeting-rooms/${meetingRoomId}`);
  return res.data;
};

// 대기실 참여자 목록 조회
export const getRoomMembers = async (
  meetingRoomId: string,
): Promise<RoomInfoResponse> => {
  const res = await apiInstance.get(
    `/v1/meeting-rooms/${meetingRoomId}/members`,
  );
  return res.data;
};

// 대기실 채팅 히스토리 조회 (스크롤 페이징)
export const getRoomChatHistory = async (
  meetingRoomId: string,
  cursorId?: string,
): Promise<ChatHistoryResponse> => {
  const params = cursorId ? { cursorId } : {};
  const res = await apiInstance.get(
    `/v1/meeting-rooms/${meetingRoomId}/chat-info`,
    { params },
  );
  return res.data;
};

// 대기실 채팅 히스토리 저장
export const postChatMessage = async (
  meetingRoomId: string,
  content: string,
) => {
  return apiInstance.post(`/v1/meeting-rooms/${meetingRoomId}/chats`, {
    content,
  });
};
