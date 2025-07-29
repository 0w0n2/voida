import apiInstance from '@/apis/apiInstance';

// [메인] 참여 중인 방 조회
export const getRooms = (pageNo: number, pageSize: number) => {
  return apiInstance.get('/v1/members/meeting-rooms', {
    params: { pageNo, pageSize },
  });
};

// [메인] 참여 중인 방 제목기반 검색
export const getRoomsByTitle = (title: string) => {
  return apiInstance.get('/v1/members/meeting-rooms/search', {
    params: { title },
  });
};

// [대기실 생성] 방 생성
export const createRoom = (
  title: string,
  category: string,
  thumbnailImageUrl: string,
) => {
  return apiInstance.post('/v1/meeting-rooms', {
    params: { title, category, thumbnailImageUrl },
  });
};

// [대기실 참여] 초대 코드 검증
export const verifyInviteCode = (invitecode: string, meetingRoomId: number) => {
  return apiInstance.post(
    '/v1/meeting-rooms/{meetingRoomId}/verify-invite-code',
    {
      params: { invitecode, meetingRoomId },
    },
  );
};
