/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect } from 'react';
import MemberPanel from '@/components/meeting-room/members/MemberPanel';
import ChatPanel from '@/components/meeting-room/chat/ChatPanel';
import {
  getRoomInfo,
  getRoomMembers,
  getRoomChatHistory,
} from '@/apis/meetingRoomApi';
import { useMeetingRoomStore } from '@/store/meetingRoomStore';

const MeetingRoomPage = ({ meetingRoomId }: { meetingRoomId: string }) => {
  const { setRoomInfo, setParticipants, setChatMessages } =
    useMeetingRoomStore();

  useEffect(() => {
    const fetchData = async () => {
      const room = await getRoomInfo(meetingRoomId);
      const members = await getRoomMembers(meetingRoomId);
      const chat = await getRoomChatHistory(meetingRoomId);

      setRoomInfo(room);
      // getRoomMembers API 응답이 배열이면 첫 번째 값 사용
      setParticipants(Array.isArray(members) ? members[0] : members);
      setChatMessages(chat.chatHistory.content);
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
