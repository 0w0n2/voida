// openvidu 토큰 발급
// 연결/해제
import { OpenVidu } from 'openvidu-browser';

let OV: OpenVidu;
let session: any;

export const startVoiceSession = async () => {
  OV = new OpenVidu();
  session = OV.initSession();

  session.on('streamCreated', event => {
    session.subscribe(event.stream, undefined); // 수신
  });

  const token = await fetch(`/api/sessions/token`).then(res => res.text());
  await session.connect(token);

  const publisher = await OV.initPublisherAsync(undefined, {
    audioSource: undefined,
    videoSource: false,
    publishAudio: true,
    publishVideo: false,
  });

  await session.publish(publisher);
};
