import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import MainForm from '@/components/main/MainForm';
import NoRoomMainForm from '@/components/main/NoRoomMainForm';
import { getRooms, type MeetingRoom } from '@/apis/meetingRoomApi';

const MainPage = () => {
  const [meetingRooms, setMeetingRooms] = useState<MeetingRoom[]>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await getRooms(1, 10);
        setMeetingRooms(res ?? []);
      } catch (error) {
        console.error('참여 중인 방 조회 실패:', error);
        setMeetingRooms([]); 
      }
    };

    fetchRooms();
  }, []);

  return (
    <div>
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
