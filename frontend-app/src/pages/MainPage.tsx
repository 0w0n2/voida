/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import Header from '@/components/Header';
import { useEffect } from 'react';
import MainForm from '@/components/main/MainForm';
import NoRoomMainForm from '@/components/main/NoRoomMainForm';
import { useRoomStore } from '@/store/roomStore';
import { getRooms } from '@/apis/meetingRoomApi';

const MainPage = () => {
  const meetingRooms = useRoomStore((state) => state.meetingRooms);
  const setMeetingRooms = useRoomStore((state) => state.setMeetingRooms);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await getRooms(1, 10);
        setMeetingRooms(res);
      } catch (error) {
        console.error('참여 중인 방 조회 실패:', error);
      }
    };

    fetchRooms();
  }, [setMeetingRooms]);

  return (
    <div css={wrapperStyle}>
      <Header />
      {meetingRooms.length > 0 ? <MainForm /> : <NoRoomMainForm />}
    </div>
  );
};

export default MainPage;

const wrapperStyle = css`
  min-height: 100vh;
  // background: linear-gradient(135deg, #f8fbff 0%, #eaeeff 50%, #e0efff 100%);
`;
