import { Client } from '@stomp/stompjs';
import type { IMessage, StompSubscription } from '@stomp/stompjs'
import SockJS from 'sockjs-client';

export interface ChatMessage {
  senderUuid: string;
  writerNickname: string;
  profileImageUrl?: string;
  content: string;
  createdAt: string;
  mine: boolean;
}

type OnMessage = (msg: ChatMessage) => void;

let client: Client | null = null;
let subscription: StompSubscription | null = null;
let currentRoomId: string | null = null;
let onMessageRef: OnMessage | null = null;

const WS_ENDPOINT = `${import.meta.env.VITE_SPRING_API_URL}/ws`;
const TOPIC_PREFIX = `/sub/chat/meetingRoom/`;
const SEND_PREFIX = `/pub/chat/message/`;

export function isConnected() {
  return !!client && client.connected;
}

export async function connectStomp(meetingRoomId: string, onMessage: OnMessage) {
  if (client && client.connected && currentRoomId === meetingRoomId) {
    onMessageRef = onMessage;
    return;
  }

  // 기존 구독 해제
  if (subscription) {
    try {
      subscription.unsubscribe();
    } catch (err) {
      console.error('STOMP 구독 해제 실패:', err);
    }
    subscription = null;
  }

  // 클라이언트 생성/재연결
  if (!client) {
    const accessToken = localStorage.getItem('accessToken');
    // console.log(WS_ENDPOINT);
    client = new Client({
      webSocketFactory: () => new SockJS(WS_ENDPOINT),
      connectHeaders: {
        Authorization: `${accessToken ?? ''}`
      },
      reconnectDelay: 2000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      // debug: (str) => console.log('[STOMP DEBUG]', str),
      onStompError: (frame) => {
        console.error('[STOMP ERROR]', frame.headers['message'], frame.body);
      },
      onWebSocketClose: (ev) => {
        console.warn('[STOMP CLOSE]', ev.reason);
      },
    });
  }

  await new Promise<void>((resolve) => {
    if (client!.connected) return resolve();
    client!.onConnect = () => resolve();
    client!.activate();
  });

  // 구독 시작
  const topic = `${TOPIC_PREFIX}${meetingRoomId}`;
  // console.log('구독 시작', topic);
  onMessageRef = onMessage;
  subscription = client.subscribe(topic, (message: IMessage) => {
    try {
      const payload = JSON.parse(message.body) as ChatMessage;
      onMessageRef?.(payload);
    } catch (e) {
      console.error('메시지 파싱 실패:', e);
    }
  });

  currentRoomId = meetingRoomId;
}

export function publishMessage(meetingRoomId: string, text: string) {
  if (!client || !client.connected) {
    console.warn('STOMP 미연결 상태에서 publish 요청');
    return;
  }
  const dest = `${SEND_PREFIX}${meetingRoomId}`;
  const body = JSON.stringify({
    content: text,
  });
  client.publish({ destination: dest, body });
}

export async function disconnectStomp() {
  if (subscription) {
    try {
      subscription.unsubscribe();
    } catch (err) {
      console.error('구독 해제 실패:', err);
    }
    subscription = null;
  }
  currentRoomId = null;
  onMessageRef = null;

  if (client) {
    const c = client;
    client = null;
    try {
      await c.deactivate();
    } catch (err) {
      console.error('STOMP 클라이언트 비활성화 실패:', err);
    }
  }
}
