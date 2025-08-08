import { Client } from '@stomp/stompjs';

let stompClient: Client | null = null;

export const connectStomp = (
  meetingRoomId: string,
  onMessage: (msg: any) => void,
) => {
  if (stompClient && stompClient.connected) return;


  // 요청 보낼 때 헤더에 accessToken 넣어서 보내야함
  stompClient = new Client({
    brokerURL: 'ws://localhost:8080/ws', // 백엔드 서버 포트 들어가야 함
    reconnectDelay: 5000,
    debug: (str) => console.log('[STOMP DEBUG]', str),
    onConnect: () => {
      console.log('STOMP 연결 완료');
      stompClient?.subscribe(`/topic/meeting-room/${meetingRoomId}`, (msg) => {
        try {
          const parsed = JSON.parse(msg.body);
          onMessage(parsed);
        } catch (err) {
          console.error('❌ 메시지 파싱 실패:', err);
        }
      });
    },
    onStompError: (frame) => {
      console.error('STOMP 오류:', frame.headers['message']);
      console.error('상세:', frame.body);
    },
  });

  stompClient.activate();
};

export const publishMessage = (meetingRoomId: string, content: string) => {
  if (!stompClient || !stompClient.connected) {
    console.warn('STOMP 미연결 상태에서 메시지 발행 시도됨');
    return;
  }

  stompClient.publish({
    destination: `/app/meeting-room/${meetingRoomId}`, // 백에서 히스토리 저장도 같이 처리 예정
    body: JSON.stringify({ content }),
  });
};

export const disconnectStomp = () => {
  if (stompClient) {
    stompClient.deactivate();
    console.log('STOMP 연결 해제');
  }
};
