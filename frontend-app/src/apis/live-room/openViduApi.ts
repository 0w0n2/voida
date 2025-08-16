import { OpenVidu, Session, Publisher, Subscriber } from 'openvidu-browser';
import type { SignalOptions } from 'openvidu-browser';
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

/* ===============================
   전역 상태 (싱글톤)
================================ */
let OV: OpenVidu | null = null;
let session: Session | null = null;
let publisher: Publisher | null = null;
let subscribers: Subscriber[] = [];

/* ===============================
   유틸 Getter
================================ */
export const isConnected = (): boolean => Boolean(session && session.sessionId); 
export const getSessionInstance = (): Session | null => session;
export const getOVInstance = (): OpenVidu | null => OV;
export const getSubscribers = (): Subscriber[] => subscribers.slice();

/* ===============================
   Spring REST API
================================ */
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

/* ===============================
   OpenVidu 연결 (단순 음성 + 채팅)
================================ */
export interface ConnectOptions {
  nickname?: string;
  onChatMessage?: (data: string) => void;
  onParticipantJoin?: (participant: {
    profileImageUrl?: string;
    nickname?: string;
    lipTalkMode: boolean;
  }) => void;
  onParticipantLeave?: (connectionId: string) => void;
}

export const connectOpenVidu = async (token: string, options?: ConnectOptions) => {
  try {
    if (!token || typeof token !== 'string') {
      throw new Error(`유효하지 않은 토큰: ${token}`);
    }

    if (!OV) {
      OV = new OpenVidu();
    }

    session = OV.initSession();

    console.log('연결할 토큰', token);

    // 이벤트: 연결 완료 후 readyState 체크
    session.on('sessionConnected', () => {
      const ws = (session as any).openvidu?.rpc?.ws;
      if (ws) {
        console.log('[WS readyState after connect]', ws.readyState);
      } else {
        console.warn('WS object is still not available after connect');
      }
    });

    // 이벤트: 다른 참가자 스트림 수신
    session.on('streamCreated', (event) => {
      const sub = session!.subscribe(event.stream, undefined, {
        subscribeToAudio: true,
        subscribeToVideo: false,
      });
      subscribers.push(sub);

      const audio = document.createElement('video');
      audio.autoplay = true;
      audio.playsInline = true;
      audio.style.display = 'none';
      audio.setAttribute('data-connection-id', event.stream.connection.connectionId);
      sub.addVideoElement(audio);

      document.body.appendChild(audio);

      try {
        const dataStr = event.stream.connection.data;
        const parsed = JSON.parse(dataStr || '{}');
        const participant = {
          profileImageUrl: parsed.profileImageUrl || undefined,
          nickname: parsed.nickname || undefined,
          lipTalkMode: parsed.lipTalkMode || false,
        };
        options?.onParticipantJoin?.(participant);
      } catch (e) {
        console.warn('참가자 메타데이터 파싱 실패:', e);
      }
    });

    // 이벤트: 참가자 퇴장
    session.on('streamDestroyed', (event) => {
      subscribers = subscribers.filter(
        (s) => s.stream.connection.connectionId !== event.stream.connection.connectionId
      );

      const audioEl = document.querySelector<HTMLAudioElement>(
        `audio[data-connection-id="${event.stream.connection.connectionId}"]`
      );
      audioEl?.remove();

      options?.onParticipantLeave?.(event.stream.connection.connectionId);
    });

    // 이벤트: 채팅 시그널 수신
    if (options?.onChatMessage) {
      session.on('signal:chat', (event) => {
        if (event.data) options.onChatMessage!(event.data);
      });
    }

    console.log('[OpenVidu] session.connect 실행');
    await session.connect(token);

    // 퍼블리셔 생성 (오디오만)
    publisher = await OV.initPublisherAsync(undefined, {
      audioSource: undefined, // 기본 마이크
      videoSource: false,     // 영상 사용 안함
      publishAudio: true,
      publishVideo: false,
    });

    // 퍼블리시 시작
    await session.publish(publisher);

    console.log('[OpenVidu] 연결 완료 (음성 전용)');
  } catch (err) {
    console.error('[OpenVidu] 연결 중 오류 발생:', err);
    throw err;
  }
};

/* ===============================
   시그널 전송 (채팅)
================================ */
export const sendChatSignal = async (payload: string): Promise<void> => {
  if (!session) return;
  const options: SignalOptions = {
    type: 'chat',
    data: payload,
  };
  await session.signal(options);
};

/* ===============================
   연결 해제 / 정리
================================ */
export const disconnectOpenVidu = async (): Promise<void> => {
  try {
    if (publisher) {
      try {
        ((publisher as unknown as { stream?: { disposeWebRtcPeer?: () => void } })
          .stream?.disposeWebRtcPeer?.());
      } catch (err) {
        console.warn('[OpenVidu] publisher webrtc dispose 실패:', err);
      }

      try {
        (publisher as unknown as { dispose?: () => void }).dispose?.();
      } catch (err) {
        console.warn('[OpenVidu] publisher dispose 실패:', err);
      }

      publisher = null;
    }

    subscribers.forEach((s) => {
      try {
        (s as unknown as { dispose?: () => void }).dispose?.();
      } catch (err) {
        console.warn('[OpenVidu] subscriber dispose 실패:', err);
      }
    });
    subscribers = [];

    if (session) {
      try {
        session.disconnect();
      } catch (err) {
        console.warn('[OpenVidu] session.disconnect 실패:', err);
      }
      session = null;
    }
  } finally {
    OV = null;
    console.log('[OpenVidu] 연결 종료 및 정리 완료');
  }
};
