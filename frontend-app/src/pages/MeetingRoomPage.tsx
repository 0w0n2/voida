/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect } from 'react';
import MemberPanel from '@/components/meeting-room/members/MemberPanel';
import ChatPanel from '@/components/meeting-room/chat/ChatPanel';
import {
  getRoomInfo,
  getRoomMembers,
  getRoomChatHistory,
} from '@/apis/meeting-room/meetingRoomApi';
import { useMeetingRoomStore } from '@/store/meetingRoomStore';

const MeetingRoomPage = ({ meetingRoomId }: { meetingRoomId: string }) => {
  const { setRoomInfo, setParticipants, setChatMessages } =
    useMeetingRoomStore();

useEffect(() => {
  const fetchData = async () => {
    try {
      const room = await getRoomInfo(meetingRoomId);
      const members = await getRoomMembers(meetingRoomId);
      const chat = await getRoomChatHistory(meetingRoomId);

      setRoomInfo(room);
      setParticipants(Array.isArray(members) ? members[0] : members);
      const chatList = chat?.chatHistory?.content ?? [];
      setChatMessages(chatList);
    } catch (err) {
      console.error('초기 데이터 로딩 실패:', err);
    }
  };

  fetchData();
}, [meetingRoomId, setRoomInfo, setParticipants, setChatMessages]);


  return (
    <div css={container}>
      <MemberPanel meetingRoomId={meetingRoomId} />
      <ChatPanel meetingRoomId={meetingRoomId} />
    </div>
  );
};

export default MeetingRoomPage;

const container = css`
  display: flex;
  height: 100vh;
`;
