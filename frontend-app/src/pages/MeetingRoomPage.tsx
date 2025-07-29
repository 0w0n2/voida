/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';
import ParticipantsPanel from '@/components/meeting-room/ParticipantsPanel';
import ChatPanel from '@/components/meeting-room/ChatPanel';

const MeetingRoomPage = () => {
  const [meetingRoomId] = useState('dummy-room-id'); // 추후 실제 ID로 변경

  return (
    <div css={container}>
      <ParticipantsPanel meetingRoomId={meetingRoomId} />
      <div css={chatContainer}>
        <ChatPanel meetingRoomId={meetingRoomId} />
      </div>
    </div>
  );
};

export default MeetingRoomPage;

const container = css`
  display: flex;
  height: 100vh;
`;

const chatContainer = css`
  flex: 1;
  display: flex;
  flex-direction: column;
`;
