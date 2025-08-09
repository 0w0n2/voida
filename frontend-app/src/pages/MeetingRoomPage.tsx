/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MemberPanel from '@/components/meeting-room/members/MemberPanel';
import ChatPanel from '@/components/meeting-room/chat/ChatPanel';
import { getRoomInfo, getRoomMembers, getRoomChatHistory } from '@/apis/meeting-room/meetingRoomApi';
import { useMeetingRoomStore } from '@/stores/meetingRoomStore';

const MeetingRoomPage = () => {
  const { meetingRoomId } = useParams<{ meetingRoomId: string }>();
  const { setRoomInfo, setParticipants, setChatMessages } = useMeetingRoomStore();

  useEffect(() => {
    if (!meetingRoomId) return;
    const fetchData = async () => {
      try {
        const room = await getRoomInfo(meetingRoomId);
        const members = await getRoomMembers(meetingRoomId);
        // const chat = await getRoomChatHistory(meetingRoomId);

        setRoomInfo({
          ...room,
          meetingRoomId, 
        });
        setParticipants(members);
        // const chatList = chat?.chatHistory?.content ?? [];
        // setChatMessages(chatList);
      } catch (err) {
        console.error('초기 데이터 로딩 실패:', err);
      }
    };

    fetchData();
  }, [meetingRoomId, setRoomInfo, setParticipants, setChatMessages]);


  return (
    <div css={container}>
      <MemberPanel />
      <ChatPanel meetingRoomId={meetingRoomId!} />
    </div>
  );
};

export default MeetingRoomPage;

const container = css`
  display: flex;
  height: 100vh;
`;
