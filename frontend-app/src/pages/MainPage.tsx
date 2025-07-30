/** @jsxImportSource @emotion/react */
import MainForm from '@/components/MainForm';
import NoRoomMainForm from '@/components/NoRoomMainForm';
import { css } from '@emotion/react';
import { useRoomStore } from '@/store/store';
import { useEffect } from 'react';
import { getRooms } from '@/apis/roomApi';

const MainPage = () => {
  const meetingRooms = useRoomStore((state) => state.meetingRooms);
  const setMeetingRooms = useRoomStore((state) => state.setMeetingRooms);

  useEffect(() => {
    getRooms(1, 10).then((res) => {
      setMeetingRooms(res.data.meetingRooms);
    });
  }, []);

  return (
    <div css={wrapperStyle}>
      {meetingRooms.length > 0 ? <MainForm /> : <NoRoomMainForm />}
    </div>
  );
};

export default MainPage;

const wrapperStyle = css`
  background-color: linear-gradient(
    135deg,
    #f8fbff 0%,
    #eaeeffff 50%,
    #e0efffff 100%
  );
`;