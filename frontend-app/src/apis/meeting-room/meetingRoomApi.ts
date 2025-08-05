import apiInstance from '@/apis/core/apiInstance';

export type RoomInfo = {
  title: string;
  category: string;
  thumbnailImageUrl: string;
};

export type RoomParticipant = {
  memberCount: number;
  participants: Participant[];
};

export type Participant = {
  memberId: number;
  nickname: string;
  profileImageUrl?: string;
  state: 'HOST' | 'PARTICIPANT';
  lipTalkMode: boolean;
  isMine: boolean;
};

export type ChatMessage = {
  senderId: string;
  writerNickname: string;
  profileImageUrl: string;
  content: string;
  createdAt: string;
  isMine: boolean;
};

export type ChatHistoryResponse = {
  chatHistory: {
    content: ChatMessage[];
    cursorId?: string;
    hasNext: boolean;
  };
};

export interface MeetingRoom {
  meetingRoomId: string;
  title: string;
  category: string;
  memberCount: number;
  thumbnailImageUrl: string;
}

// 방 정보 조회
export const getRoomInfo = async (meetingRoomId: string): Promise<RoomInfo> => {
  const res = await apiInstance.get(`/v1/meeting-rooms/${meetingRoomId}`);
  return res.data;
};

// 방 참여자 조회
export const getRoomMembers = async (
  meetingRoomId: string,
): Promise<RoomParticipant[]> => {
  const res = await apiInstance.get(
    `/v1/meeting-rooms/${meetingRoomId}/members`,
  );
  return res.data;
};

// 방 정보 수정 (방장만)
export const updateRoomInfo = async (
  meetingRoomId: string,
  data: Partial<RoomInfo>,
): Promise<void> => {
  await apiInstance.put(`/v1/meeting-rooms/${meetingRoomId}/settings`, data);
};

// 방 삭제 (방장만)
export const deleteRoom = async (meetingRoomId: string): Promise<void> => {
  await apiInstance.delete(`/v1/meeting-rooms/${meetingRoomId}`);
};

// 방 탈퇴하기 (일반 사용자만)
export const leaveRoom = async (meetingRoomId: string, memberuuid:string): Promise<void> => {
  await apiInstance.delete(`/v1/meeting-rooms/${meetingRoomId}/leave`);
};

// 방장 위임 (방장만)
export const delegateHost = async (
  meetingRoomId: string,
  targetId: string,
): Promise<void> => {
  await apiInstance.put(`/v1/meeting-rooms/${meetingRoomId}/host`, {
    targetId,
  });
};

// 참여자 강퇴 (방장만)
export const kickMember = async (
  meetingRoomId: string,
  targetId: string,
): Promise<void> => {
  await apiInstance.post(`/v1/meeting-rooms/${meetingRoomId}/kick`, {
    targetId,
  });
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

// 대기실 채팅 메시지 저장
export const postChatMessage = async (
  meetingRoomId: string,
  content: string,
) => {
  return apiInstance.post(`/v1/meeting-rooms/${meetingRoomId}/chats`, {
    content,
  });
};

// 참여 중인 방 조회
export const getRooms = async (
  pageNo: number,
  pageSize: number,
): Promise<MeetingRoom[]> => {
  const res = await apiInstance.get('/v1/members/meeting-rooms', {
    params: { pageNo, pageSize },
  });
  return res.data.meetingRooms;
};

// 방 생성
export const createRoom = async (
  title: string,
  category: string,
  thumbnailImageUrl: Blob,
): Promise<MeetingRoom> => {
  const formData = new FormData();
  const requestDto = { title, category };
  const jsonBlob = new Blob([JSON.stringify(requestDto)], { type: 'application/json' });
  formData.append('requestDto', jsonBlob);
  if (thumbnailImageUrl && thumbnailImageUrl instanceof File) {
    formData.append("thumbnailImageUrl", thumbnailImageUrl);
  }
  const res = await apiInstance.post('/v1/meeting-rooms', formData);
  return res.data.result;
};

// 초대 코드 요청
export const getInviteCode = async (
  meetingRoomId: string,
): Promise<{ inviteCode: string }> => {
  console.log('meetingRoomId', meetingRoomId);
  const res = await apiInstance.get(
    `/v1/meeting-rooms/${meetingRoomId}/invite-code`,
  );
  console.log('inviteCode', res.data.result);
  return res.data.result;
};

// 초대 코드 검증
export const verifyInviteCode = async (
  invitecode: string,
  meetingRoomId: number,
): Promise<{ valid: boolean }> => {
  const res = await apiInstance.post(
    `/v1/meeting-rooms/${meetingRoomId}/verify-invite-code`,
    { invitecode },
  );
  return res.data;
};
