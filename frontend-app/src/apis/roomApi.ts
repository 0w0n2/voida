import apiInstance from '@/apis/apiInstance';

export interface MeetingRoom {
  meetingRoomId: string;
  title: string;
  category: string;
  memberCount: number;
  thumbnailImageUrl: string;
}

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

// 참여 중인 방 제목 기반 검색
export const getRoomsByTitle = async (
  title: string,
): Promise<MeetingRoom[]> => {
  const res = await apiInstance.get('/v1/members/meeting-rooms/search', {
    params: { title },
  });
  return res.data.meetingRooms;
};

// 방 생성
export const createRoom = async (
  title: string,
  category: string,
  thumbnailImageUrl: string,
): Promise<MeetingRoom> => {
  const res = await apiInstance.post('/v1/meeting-rooms', {
    title,
    category,
    thumbnailImageUrl,
  });
  return res.data;
};

// [대기실 참여] 초대 코드 검증
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
