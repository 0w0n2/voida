/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import MainForm from '@/components/main/MainForm';
import NoRoomMainForm from '@/components/main/NoRoomMainForm';
import { getRooms, type MeetingRoom } from '@/apis/meeting-room/meetingRoomApi';

const MainPage = () => {
  const [meetingRooms, setMeetingRooms] = useState<MeetingRoom[]>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await getRooms();
        setMeetingRooms(res ?? []);
      } catch (error) {
        console.error('참여 중인 방 조회 실패:', error);
        setMeetingRooms([]); 
      }
    };

    fetchRooms();
  }, []);

  return (
    <div css={wrapper}>
      <Header />
      {meetingRooms.length > 0 ? (
        <MainForm rooms={meetingRooms} />
      ) : (
        <NoRoomMainForm />
      )}
    </div>
  );
};

export default MainPage;

const wrapper = css`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
    background: linear-gradient(
    135deg,
    #fff8ffff 0%,
    #f0eaffff 50%,
    #e0efffff 100%
  );
`;
