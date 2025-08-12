/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MemberPanel from '@/components/meeting-room/members/MemberPanel';
import ChatPanel from '@/components/meeting-room/chat/ChatPanel';
import { getRoomInfo, getRoomMembers } from '@/apis/meeting-room/meetingRoomApi';
import { getRoomChatHistory } from '@/apis/stomp/meetingRoomStomp';
import { useMeetingRoomStore } from '@/stores/useMeetingRoomStore';

const MeetingRoomPage = () => {
  const { meetingRoomId } = useParams<{ meetingRoomId: string }>();
  const { setRoomInfo, setParticipants, setChatMessages } = useMeetingRoomStore();
  const [isReady, setIsReady] = useState(false);

useEffect(() => {
  if (!meetingRoomId) return;

  const fetchData = async () => {
    let roomData = null;
    let membersData = null;
    let chatData = null;

    try {
      roomData = await getRoomInfo(meetingRoomId);
      setRoomInfo({ ...roomData, meetingRoomId });
    } catch (err) {
      console.error('방 정보 로딩 실패:', err);
    }

    try {
      membersData = await getRoomMembers(meetingRoomId);
      setParticipants(membersData ?? []);
    } catch (err) {
      console.error('참여자 목록 로딩 실패:', err);
    }

    try {
      console.log(meetingRoomId);
      chatData = await getRoomChatHistory(meetingRoomId);
      const chatList = chatData?.chatHistory?.content ?? [];
      console.log(chatData);
      setChatMessages(chatList);
    } catch (err) {
      console.error('채팅 기록 로딩 실패:', err);
    }

    setIsReady(true);
  };

  fetchData();
}, [meetingRoomId, setRoomInfo, setParticipants, setChatMessages]);


  return (
    <div css={container}>
      <MemberPanel />
      {isReady && <ChatPanel meetingRoomId={meetingRoomId!} />}
    </div>
  );
};

export default MeetingRoomPage;

const container = css`
  display: flex;
  height: 100vh;
`;
