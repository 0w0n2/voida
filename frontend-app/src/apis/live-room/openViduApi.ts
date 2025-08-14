// OpenVidu API 호출 & 연결 로직
import { OpenVidu } from 'openvidu-browser';
import apiInstanceSpring from '@/apis/core/apiInstanceSpring';

let OV: OpenVidu;
let session: any;

// 라이브방 상태 조회
export const getRoomStatus = async (meetingRoomId: string) => {
  const res = await apiInstanceSpring.get(`/v1/rooms/${meetingRoomId}`);
  return res.data; // { status, ovSessionId, participants }
};

// 세션 생성 요청
export const startLiveSession = async (meetingRoomId: string) => {
  const res = await apiInstanceSpring.post(
    `/v1/rooms/${meetingRoomId}/live/start`,
  );
  return res.data; // { ovSessionId }
};

// OpenVidu 토큰 발급
export const getLiveToken = async (meetingRoomId: string) => {
  const res = await apiInstanceSpring.post(
    `/v1/rooms/${meetingRoomId}/live/token`,
  );
  return res.data.token; // { token }
};

// OpenVidu 연결 (음성 + Signal 채팅)
export const connectOpenVidu = async (
  token: string,
  onSignalMessage: (data: string) => void,
) => {
  OV = new OpenVidu();
  session = OV.initSession();

  // 구독 스트림
  session.on('streamCreated', (event) => {
    session.subscribe(event.stream, undefined);
  });

  // Signal 채팅 수신
  session.on('signal:chat', (event) => {
    onSignalMessage(event.data);
  });

  // 세션 연결
  await session.connect(token, { clientData: 'nickname' });

  // 마이크 퍼블리셔
  const publisher = await OV.initPublisherAsync(undefined, {
    audioSource: undefined,
    videoSource: false,
    publishAudio: true,
    publishVideo: false,
  });

  await session.publish(publisher);
};

// 세션 나가기
export const disconnectOpenVidu = () => {
  if (session) session.disconnect();
  OV = null as any;
  session = null;
};
