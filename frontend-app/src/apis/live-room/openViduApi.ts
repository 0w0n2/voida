import { OpenVidu, Session, Publisher, StreamEvent, SignalOptions } from 'openvidu-browser';
import apiInstanceSpring from '@/apis/core/apiInstanceSpring';

// 타입 정의
export interface LiveRoomParticipant {
  nickname: string;
  profileImageUrl: string;
  state?: string;
  lipTalkMode: boolean;
  memberUuid: string;
}

export interface LiveRoomSessionInfo {
  ovSessionId: string;
  participantCount: number;
  participants: LiveRoomParticipant[];
}

export interface UserOverview {
  member: {
    nickname: string;
    profileImageUrl: string;
    email: string;
    memberUuid: string;
  };
  setting: {
    lipTalkMode: boolean;
    overlayPosition: 'TOPLEFT' | 'TOPRIGHT' | 'BOTTOMLEFT' | 'BOTTOMRIGHT';
    liveFontSize: number;
    overlayTransparency: number;
  };
  quickSlots: {
    quickSlotId: number;
    message: string;
    hotkey: string;
    url: string;
  }[] | null;
}

// 전역 상태
let OV: OpenVidu | null = null;
let session: Session | null = null;
let publisher: Publisher | null = null;

export const isConnected = (): boolean => Boolean(session && (session as any).connection);
export const getSessionInstance = (): Session | null => session;
export const getOVInstance = (): OpenVidu | null => OV;

// Spring REST API
export const getUserOverview = async (): Promise<UserOverview> => {
  const res = await apiInstanceSpring.get('/v1/members/me/overview');
  return res.data.result;
};

export const getSession = async (meetingRoomId: string): Promise<LiveRoomSessionInfo> => {
  const res = await apiInstanceSpring.post(`/v1/live-rooms/${meetingRoomId}/sessions`);
  return res.data.result;
};

export const getLiveToken = async (meetingRoomId: string): Promise<string> => {
  const res = await apiInstanceSpring.post(`/v1/live-rooms/${meetingRoomId}/tokens`);
  return res.data.result.token;
};

// Connect 옵션 타입
type SignalCallback = (data: string) => void;

export interface ConnectOptions {
  onSignalMessage: SignalCallback;
  clientData?: Record<string, any>;
  audioSource?: MediaTrackConstraints | boolean;
  videoSource?: MediaTrackConstraints | boolean;
  publishAudio?: boolean;
  publishVideo?: boolean;
}

// OpenVidu 연결
export const connectOpenVidu = async (
  token: string,
  {
    onSignalMessage,
    clientData,
    audioSource = true,
    videoSource = false,
    publishAudio = true,
    publishVideo = false,
  }: ConnectOptions
): Promise<void> => {
  if (session) {
    console.warn('[OpenVidu] 이미 세션이 연결되어 있음. connect 건너뜀.');
    return;
  }

  console.log('[OpenVidu] ====== 연결 시작 ======');
  console.log('[OpenVidu] 전달받은 token:', token);

  try {
    if (!OV) {
      console.log('[OpenVidu] OpenVidu 인스턴스 생성');
      OV = new OpenVidu();
    }

    console.log('[OpenVidu] 세션 초기화');
    session = OV.initSession();

    // 이벤트 핸들러 등록
    session.on('streamCreated', (event: StreamEvent) => {
      console.log('[OpenVidu] streamCreated:', event.stream.streamId);
      try {
        session!.subscribe(event.stream, undefined);
      } catch (e) {
        console.error('[OpenVidu] subscribe error:', e);
      }
    });

    session.on('streamDestroyed', (event: StreamEvent) => {
      console.log('[OpenVidu] streamDestroyed:', event.stream.streamId);
    });

    session.on('signal:chat', (event: any) => {
      console.log('[OpenVidu] signal:chat 수신:', event.data);
      try {
        onSignalMessage?.(event.data);
      } catch (e) {
        console.error('[OpenVidu] onSignalMessage handler error:', e);
      }
    });

    session.on('exception', (e: any) => {
      console.error('[OpenVidu] exception 이벤트:', e);
    });

    session.on('sessionDisconnected', (e: any) => {
      console.warn('[OpenVidu] 세션 끊김:', e?.reason);
    });

    // Connect
    const metadata = clientData ? JSON.stringify(clientData) : '';
    console.log('[OpenVidu] session.connect() 실행');
    await session.connect(token, metadata);
    console.log('[OpenVidu] 세션 연결 완료');

    // Publisher 초기화
    console.log('[OpenVidu] Publisher 초기화');
    publisher = await OV.initPublisherAsync(undefined, {
      audioSource,
      videoSource,
      publishAudio,
      publishVideo,
      mirror: false,
    });

    console.log('[OpenVidu] Publisher 세션에 등록');
    await session.publish(publisher);
    console.log('[OpenVidu] ====== 연결 완료 ======');

  } catch (err) {
    console.error('[OpenVidu] 연결 중 오류 발생:', err);
    cleanupOpenVidu();
    throw err;
  }
};

// 채팅 전송
export const sendChatSignal = async (payload: unknown): Promise<void> => {
  if (!session) return;
  const options: SignalOptions = {
    type: 'chat',
    data: typeof payload === 'string' ? payload : JSON.stringify(payload ?? {}),
  };
  await session.signal(options);
};

// 커스텀 시그널 전송
export const sendSignal = async (type: string, payload?: unknown): Promise<void> => {
  if (!session) return;
  const options: SignalOptions = {
    type,
    data: payload == null ? '' : typeof payload === 'string' ? payload : JSON.stringify(payload),
  };
  await session.signal(options);
};

// 연결 해제
export const disconnectOpenVidu = async (): Promise<void> => {
  cleanupOpenVidu();
};

// 내부 정리 함수
const cleanupOpenVidu = () => {
  try {
    if (publisher) {
      try {
        publisher.stream.disposeWebRtcPeer?.();
      } catch {}
      publisher = null;
    }
    if (session) {
      try {
        session.disconnect();
      } catch {}
      session = null;
    }
  } finally {
    OV = null;
  }
};
