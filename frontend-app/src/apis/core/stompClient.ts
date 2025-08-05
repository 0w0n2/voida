import { Client } from '@stomp/stompjs';

let stompClient: Client | null = null;

// STOMP 연결
export const connectStomp = (
  meetingRoomId: string,
  onMessage: (msg: any) => void,
) => {
  stompClient = new Client({
    brokerURL: 'ws://localhost:8080/ws',
    reconnectDelay: 5000,
    onConnect: () => {
      console.log('STOMP connected');
      stompClient?.subscribe(`/topic/meeting-room/${meetingRoomId}`, (msg) => {
        onMessage(JSON.parse(msg.body));
      });
    },
  });

  stompClient.activate();
};

// STOMP로 실시간 페이지 발생 (저장용 POST는 별도 API에서 처리)
export const publishMessage = (meetingRoomId: string, content: string) => {
  if (!stompClient || !stompClient.connected) return;
  stompClient.publish({
    destination: `/app/meeting-room/${meetingRoomId}`,
    body: JSON.stringify({ content }),
  });
};

// STOMP 연결 해제
export const disconnectStomp = () => {
  stompClient?.deactivate();
};
