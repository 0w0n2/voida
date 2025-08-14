import { OpenVidu, Session, Publisher, SignalEvent } from 'openvidu-browser';

let OV: OpenVidu | null = null;
let session: Session | null = null;
let publisher: Publisher | null = null;

// 화면에 채팅 전달할 핸들러
type ChatHandler = (msg: { from: string; text: string; at: number }) => void;
let chatHandler: ChatHandler | null = null;
export const setChatHandler = (cb: ChatHandler | null) => (chatHandler = cb);

export const isConnected = () => !!session;

/** OpenVidu 연결: 기본 청취 전용 (말하기 필요하면 publish:true) */
export async function startVoiceSession(opts: {
  sessionId: string;
  nickname: string;
  publish?: boolean;
}) {
  if (session) return session;

  OV = new OpenVidu();
  session = OV.initSession();

  // 상대 오디오 구독
  session.on('streamCreated', (ev) => {
    session!.subscribe(ev.stream, undefined);
  });

  // 채팅 수신
  session.on('signal:chat', (ev: SignalEvent) => {
    chatHandler?.({
      from: ev.from?.connectionId ?? 'unknown',
      text: ev.data ?? '',
      at: Date.now(),
    });
  });

  // 백엔드에서 토큰 발급 (권장)  ex) POST /api/ov/token -> { token }
  const token = await fetch('/api/ov/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId: opts.sessionId }),
  }).then((r) => r.json()).then((j) => j.token as string);

  await session.connect(token, {
    clientData: JSON.stringify({ nickname: opts.nickname }),
  });

  if (opts.publish) {
    publisher = await OV.initPublisherAsync(undefined, {
      audioSource: undefined,
      videoSource: false,
      publishAudio: true,
      publishVideo: false,
      mirror: false,
    });
    await session.publish(publisher);
  }

  return session;
}

/** 채팅 보내기 */
export function sendChatMessage(text: string) {
  if (!session) return Promise.resolve();
  return session.signal({ type: 'chat', data: text });
}

/** 마이크 on/off (선택) */
export function setMicOn(on: boolean) {
  publisher?.publishAudio(on);
}

/** 종료 */
export function leaveVoiceSession() {
  try { session?.disconnect(); } finally {
    OV = null; session = null; publisher = null; chatHandler = null;
  }
}
