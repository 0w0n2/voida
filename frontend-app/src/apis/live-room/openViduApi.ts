import { OpenVidu, Session, Publisher, StreamEvent, SignalOptions } from 'openvidu-browser';
import apiInstanceSpring from '@/apis/core/apiInstanceSpring';

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

// OpenVidu Singleton State   
let OV: OpenVidu | null = null;
let session: Session | null = null;
let publisher: Publisher | null = null;

export const isConnected = (): boolean => Boolean(session && (session as any).connection);
export const getSessionInstance = (): Session | null => session;
export const getOVInstance = (): OpenVidu | null => OV;

//Spring REST API
export const getUserOverview = async (): Promise<UserOverview> => {
  const res = await apiInstanceSpring.get('/v1/users/overview');
  return res.data.result as UserOverview;
};

export const getSession = async (meetingRoomId: string): Promise<LiveRoomSessionInfo> => {
  const res = await apiInstanceSpring.post(`/v1/live-rooms/${meetingRoomId}/sessions`);
  return res.data.result as LiveRoomSessionInfo;
};

export const getLiveToken = async (meetingRoomId: string): Promise<string> => {
  const res = await apiInstanceSpring.post(`/v1/rooms/${meetingRoomId}/tokens`);
  return res.data.token as string;
};

//,OpenVidu Connect   
type SignalCallback = (data: string) => void;

export interface ConnectOptions {
  /**
   * onSignalMessage: 서버/참가자가 보낸 signal:chat payload 콜백
   * data는 문자열(JSON 직렬화된 메시지)로 들어옵니다.
   */
  onSignalMessage: SignalCallback;

  /**
   * clientData: 나의 메타정보(닉네임/아바타/lipTalkMode 등)를 세션에 문자열로 저장
   * Session.connect(token, data) 의 data는 문자열이어야 하므로 내부에서 JSON.stringify 합니다.
   */
  clientData?: Record<string, any>;

  /**
   * 마이크/캠 설정 (기본: 오디오만 퍼블리시)
   */
  audioSource?: MediaTrackConstraints | boolean | undefined;
  videoSource?: MediaTrackConstraints | boolean | undefined;
  publishAudio?: boolean;
  publishVideo?: boolean;
}

/**
 * OpenVidu 연결
 * - PUBLICURL/WSS 관련 주소는 **서버 설정(OPENVIDU_PUBLICURL)** 에 따라 자동 결정됩니다.
 * - 프론트는 토큰만 알고 있으면 됩니다.
 */
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
  // 이미 연결되어 있다면 무시
  if (session) {
    return;
  }

  try {
    if (!OV) OV = new OpenVidu();
    session = OV.initSession();

    /* ---------- Session Event Handlers ---------- */

    // 구독 스트림 생성 => 자동 구독
    session.on('streamCreated', (event: StreamEvent) => {
      try {
        session!.subscribe(event.stream, undefined);
      } catch (e) {
        console.error('[OpenVidu] subscribe error:', e);
      }
    });

    // 구독 스트림 소멸
    session.on('streamDestroyed', (event: StreamEvent) => {
      // 필요 시 UI/스토어 갱신
      // console.log('[OpenVidu] streamDestroyed:', event.stream.connection?.connectionId);
    });

    // 채팅 Signal 수신
    session.on('signal:chat', (event: any) => {
      try {
        onSignalMessage?.(event.data);
      } catch (e) {
        console.error('[OpenVidu] onSignalMessage handler error:', e);
      }
    });

    // 일반 Signal 수신 (필요 시)
    // session.on('signal', (event: any) => { ... });

    // 세션 에러
    session.on('exception', (e: any) => {
      console.error('[OpenVidu] exception:', e);
    });

    // 세션 끊김
    session.on('sessionDisconnected', (e: any) => {
      console.warn('[OpenVidu] sessionDisconnected:', e?.reason);
      // 여기서 자동 재연결 로직을 붙이고 싶다면 토큰 재발급 후 connect 재호출 로직 구현
      // (이번 리팩토링에선 명시적으로 재연결을 호출하는 쪽을 권장)
    });

    /* ---------- Session Connect ---------- */

    // 두 번째 인자는 문자열이어야 하며, Connection.data 에 저장됩니다.
    const metadata = clientData ? JSON.stringify(clientData) : '';
    await session.connect(token, metadata);

    /* ---------- Publisher (내 오디오/비디오) ---------- */

    publisher = await OV.initPublisherAsync(undefined, {
      audioSource, // ex) true | deviceId | MediaTrackConstraints
      videoSource, // ex) false(비디오X) | deviceId | MediaTrackConstraints
      publishAudio,
      publishVideo,
      mirror: false,
    });

    await session.publish(publisher);
  } catch (err) {
    // 실패 시 상태 롤백
    try {
      publisher?.stream?.disposeWebRtcPeer?.();
    } catch {}
    publisher = null;

    try {
      session?.disconnect?.();
    } catch {}
    session = null;

    OV = null;
    throw err;
  }
};

/* ============================== *
 *            Signals             *
 * ============================== */

/** 채팅 전송 (type='chat') */
export const sendChatSignal = async (payload: unknown): Promise<void> => {
  if (!session) return;

  const options: SignalOptions = {
    type: 'chat',
    data: typeof payload === 'string' ? payload : JSON.stringify(payload ?? {}),
  };

  await session.signal(options);
};

/** 커스텀 시그널 전송 (type 지정) */
export const sendSignal = async (type: string, payload?: unknown): Promise<void> => {
  if (!session) return;
  const options: SignalOptions = {
    type,
    data: payload == null ? '' : typeof payload === 'string' ? payload : JSON.stringify(payload),
  };
  await session.signal(options);
};

/* ============================== *
 *           Disconnect           *
 * ============================== */

export const disconnectOpenVidu = async (): Promise<void> => {
  try {
    if (publisher) {
      try {
        // 최신 OV는 내부 정리를 잘 하지만, 수동 종료로 확실히
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
