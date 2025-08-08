import apiInstance from '@/apis/core/apiInstance';

export type RoomInfo = {
  meetingRoomId: string;
  title: string;
  category: string;
  thumbnailImageUrl: Blob;
};

export type RoomParticipant = {
  memberCount: number;
  participants: Participant[];
};

export type Participant = {
  memberId: number;
  nickname: string;
  profileImageUrl?: Blob;
  state: 'HOST' | 'PARTICIPANT';
  lipTalkMode: boolean;
  mine: boolean;
};

export type ChatMessage = {
  senderId: string;
  writerNickname: string;
  profileImageUrl: Blob;
  content: string;
  createdAt: string;
  mine: boolean;
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

export interface CreateRoomRequest {
  meetingRoomId: string;
  title: string;
  category: string;
  thumbnailImageUrl: Blob | File | null;
}

// 방 정보 조회
export const getRoomInfo = async (meetingRoomId: string): Promise<RoomInfo> => {
  const res = await apiInstance.get(`/v1/meeting-rooms/${meetingRoomId}`);
  return res.data.result;
};

// 방 참여자 조회
export const getRoomMembers = async (meetingRoomId: string): Promise<RoomParticipant> => {
  const res = await apiInstance.get(`/v1/meeting-rooms/${meetingRoomId}/members`);
  console.log(res);
  return res.data.result;
};

// 방 정보 수정 (방장만)
export const updateRoomInfo = async (
  meetingRoomId: string,
  data: Partial<RoomInfo>,
): Promise<RoomInfo> => {
  const formData = new FormData();
  const { title, category, thumbnailImageUrl } = data;
  const requestDto = { title, category };
  const jsonBlob = new Blob([JSON.stringify(requestDto)], { type: 'application/json' });
  formData.append('requestDto', jsonBlob);
  if (thumbnailImageUrl && thumbnailImageUrl instanceof File) {
    formData.append('thumbnailImage', thumbnailImageUrl);
  }

  const res = await apiInstance.put(`/v1/meeting-rooms/${meetingRoomId}/settings`, formData);
  return res.data.result;
};

// 방 삭제 (방장만)
export const deleteRoom = async (meetingRoomId: string): Promise<void> => {
  await apiInstance.delete(`/v1/meeting-rooms/${meetingRoomId}`);
};

// 방 탈퇴하기 (일반 사용자만)
export const leaveRoom = async (meetingRoomId: string): Promise<void> => {
  console.log('meetingRoomId', meetingRoomId);
  await apiInstance.delete(`/v1/meeting-rooms/${meetingRoomId}/participants`);
};

// 방장 위임 (방장만)
export const delegateHost = async (
  meetingRoomId: string,
  memberUuid: string,
): Promise<void> => {
  console.log('memberUuid', memberUuid);
  console.log('meetingRoomId', meetingRoomId);
  // await apiInstance.put(`/v1/meeting-rooms/${meetingRoomId}/host`, {
  //   memberUuid,
  // });
};

// 참여자 강퇴 (방장만)
export const kickMember = async (
  meetingRoomId: string,
  kickMemberUuid: string,
): Promise<void> => {
  await apiInstance.delete(`/v1/meeting-rooms/${meetingRoomId}/kick`, {
    kickMemberUuid,
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
// export const getRooms = async (): Promise<MeetingRoom[]> => {
//   const res = await apiInstance.get('/v1/meeting-rooms');
//   return res.data.result;
// };
export const getRooms = async (): Promise<MeetingRoom[]> => {
  // 하드코딩된 테스트 데이터
  return [
    {
      meetingRoomId: '23',
      title: '테스트 회의방',
      category: 'game',
      memberCount: 3,
      thumbnailImageUrl: '',
    },
    {
      meetingRoomId: '2',
      title: 'React 스터디',
      category: 'game',
      memberCount: 5,
      thumbnailImageUrl: '',
    },
    {
      meetingRoomId: '3',
      title: 'React 스터디',
      category: 'game',
      memberCount: 5,
      thumbnailImageUrl: '',
    },
    {
      meetingRoomId: '4',
      title: 'React 스터디',
      category: 'game',
      memberCount: 5,
      thumbnailImageUrl: '',
    },
    {
      meetingRoomId: '5',
      title: 'React 스터디',
      category: 'game',
      memberCount: 5,
      thumbnailImageUrl: '',
    },
    {
      meetingRoomId: '6',
      title: 'React 스터디',
      category: 'game',
      memberCount: 5,
      thumbnailImageUrl: '',
    },
  ];
};


// 방 생성
export const createRoom = async (
  title: string,
  category: string,
  thumbnailImageUrl: Blob | null,
): Promise<CreateRoomRequest> => {
  const formData = new FormData();
  const requestDto = { title, category };
  const jsonBlob = new Blob([JSON.stringify(requestDto)], { type: 'application/json' });
  formData.append('requestDto', jsonBlob);
  if (thumbnailImageUrl && thumbnailImageUrl instanceof File) {
    formData.append("thumbnailImageUrl", thumbnailImageUrl);
  }
  const res = await apiInstance.post('/v1/meeting-rooms', formData);
  console.log(res.data);
  return res.data.result;
};

// 초대 코드 조회
export const getInviteCode = async (
  meetingRoomId: string,
): Promise<{ inviteCode: string }> => {
  const res = await apiInstance.get(
    `/v1/meeting-rooms/${meetingRoomId}/invite-code`,
  );
  return res.data.result;
};

// 초대 코드 생성
export const postInviteCode = async (
  meetingRoomId: string,
): Promise<{ inviteCode: string }> => {
  const res = await apiInstance.post(
    `/v1/meeting-rooms/${meetingRoomId}/invite-code`,
  );
  return res.data.result;
};

// 초대 코드 검증
export const verifyInviteCode = async (
  inviteCode: string,
): Promise<{ isSuccess: boolean }> => {
  const res = await apiInstance.post(
    `/v1/meeting-rooms/verify-invite-code`,
    { inviteCode },
  );
  console.log(res.data);
  return res.data;
};
