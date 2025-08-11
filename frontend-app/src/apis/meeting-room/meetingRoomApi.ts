import apiInstanceSpring from '@/apis/core/apiInstanceSpring';

export interface RoomInfo {
  meetingRoomId: string;
  title: string;
  category: string;
  thumbnailImageUrl: Blob | File | null;
}

export interface Participant {
  memberUuid: number;
  nickname: string;
  profileImageUrl?: string;
  state: 'HOST' | 'PARTICIPANT';
  lipTalkMode: boolean;
  mine: boolean;
}

export interface RoomParticipant {
  memberCount: number;
  participants: Participant[];
}

export interface MeetingRoom {
  meetingRoomId: string;
  title: string;
  categoryName: string;
  memberCount: number;
  thumbnailImageUrl: string;
}

export interface CreateRoomRequest {
  title: string;
  category: string;
  thumbnailImageUrl: Blob | File | null;
}

// 참여 중인 방 조회
export const getRooms = async (): Promise<MeetingRoom[]> => {
  const res = await apiInstanceSpring.get('/v1/meeting-rooms');
  return res.data.result;
};

// 방 정보 조회
export const getRoomInfo = async (meetingRoomId: string): Promise<RoomInfo> => {
  const res = await apiInstanceSpring.get(`/v1/meeting-rooms/${meetingRoomId}`);
  return res.data.result;
};

// 방 참여자 조회
export const getRoomMembers = async (meetingRoomId: string): Promise<RoomParticipant> => {
  const res = await apiInstanceSpring.get(`/v1/meeting-rooms/${meetingRoomId}/members`);
  return res.data.result;
};

// 방 정보 수정 (방장만)
export const updateRoomInfo = async (
  meetingRoomId: string,
  data: Partial<CreateRoomRequest>,
): Promise<RoomInfo> => {
  const formData = new FormData();
  const { title, category, thumbnailImageUrl } = data;

  formData.append(
    'requestDto',
    new Blob([JSON.stringify({ title, category })], { type: 'application/json' })
  );

  if (thumbnailImageUrl instanceof File || thumbnailImageUrl instanceof Blob) {
    formData.append('thumbnailImage', thumbnailImageUrl);
  }

  const res = await apiInstanceSpring.put(`/v1/meeting-rooms/${meetingRoomId}/settings`, formData);
  return res.data.result;
};

// 방 삭제 (방장만)
export const deleteRoom = async (meetingRoomId: string): Promise<void> => {
  await apiInstanceSpring.delete(`/v1/meeting-rooms/${meetingRoomId}`);
};

// 방 탈퇴하기 (일반 사용자만)
export const leaveRoom = async (meetingRoomId: string): Promise<void> => {
  await apiInstanceSpring.delete(`/v1/meeting-rooms/${meetingRoomId}/participants`);
};

// 방장 위임 (방장만)
export const delegateHost = async (meetingRoomId: string, memberUuid: string): Promise<void> => {
  await apiInstanceSpring.put(`/v1/meeting-rooms/${meetingRoomId}/host`, { memberUuid });
};

// 참여자 강퇴 (방장만)
export const kickMember = async (meetingRoomId: string, kickMemberUuid: string): Promise<void> => {
  await apiInstanceSpring.delete(`/v1/meeting-rooms/${meetingRoomId}/members`, {
    data: { kickMemberUuid },
  });
};

// 방 생성
export const createRoom = async (
  title: string,
  category: string,
  thumbnailImageUrl: Blob | File | null,
): Promise<RoomInfo> => {
  const formData = new FormData();
  formData.append('requestDto', new Blob([JSON.stringify({ title, category })], { type: 'application/json' }));

  if (thumbnailImageUrl instanceof File || thumbnailImageUrl instanceof Blob) {
    formData.append('thumbnailImage', thumbnailImageUrl);
  }

  const res = await apiInstanceSpring.post('/v1/meeting-rooms', formData);
  return res.data.result;
};

// 초대 코드 조회
export const getInviteCode = async (meetingRoomId: string): Promise<{ inviteCode: string }> => {
  const res = await apiInstanceSpring.get(`/v1/meeting-rooms/${meetingRoomId}/invite-code`);
  return res.data.result;
};

// 초대 코드 생성
export const postInviteCode = async (meetingRoomId: string): Promise<{ inviteCode: string }> => {
  const res = await apiInstanceSpring.post(`/v1/meeting-rooms/${meetingRoomId}/invite-code`);
  return res.data.result;
};

// 초대 코드 검증
export const verifyInviteCode = async (inviteCode: string): Promise<{ isSuccess: boolean }> => {
  const res = await apiInstanceSpring.post(`/v1/meeting-rooms/verify-invite-code`, { inviteCode });
  return res.data.result;
};
