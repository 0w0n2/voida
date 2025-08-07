import { useRef, useState } from 'react';
import { OpenVidu, Session, Subscriber } from 'openvidu-browser';
import axios from 'axios';

const VoiceRoom = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [joined, setJoined] = useState(false);
  const [volumes, setVolumes] = useState<Record<string, number>>({});
  const [showVolume, setShowVolume] = useState(true);
  const nicknameRef = useRef<HTMLInputElement>(null);

  const OPENVIDU_SECRET = import.meta.env.VITE_OPENVIDU_SECRET;

  const createSession = async (sessionId: string): Promise<string> => {
    try {
      const res = await axios.post(
        '/openvidu/api/sessions',
        { customSessionId: sessionId },
        {
          auth: { username: 'OPENVIDUAPP', password: OPENVIDU_SECRET },
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      return res.data.id;
    } catch (err: any) {
      if (err?.response?.status === 409) return sessionId;
      console.error('세션 생성 실패:', err);
      throw err;
    }
  };

  const createToken = async (sessionId: string): Promise<string> => {
    const res = await axios.post(
      `/openvidu/api/sessions/${sessionId}/connection`,
      {},
      {
        auth: { username: 'OPENVIDUAPP', password: OPENVIDU_SECRET },
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      }
    );
    return res.data.token;
  };

  const joinSession = async () => {
    const nickname = nicknameRef.current?.value || 'user';
    const sessionId = 'voice-room';
    const OV = new OpenVidu();
    const mySession = OV.initSession();

    mySession.on('streamCreated', (event) => {
      const subscriber = mySession.subscribe(event.stream, undefined);
      const connId = event.stream.connection.connectionId;
      setSubscribers((prev) => [...prev, subscriber]);

      // 닉네임 디코드
      try {
        const data = JSON.parse(subscriber.stream.connection.data);
        const nick = JSON.parse(data.clientData)?.nickname;
        console.log(`👤 입장: ${nick || '알 수 없음'}`);
      } catch {
        console.log('👤 입장 (닉네임 파싱 실패)');
      }

      // 실시간 볼륨 감지
      if (showVolume) {
        subscriber.on('streamAudioVolumeChange', (ev: any) => {
          const value = typeof ev.value === 'number' && isFinite(ev.value) ? ev.value : null;

          if (value !== null) {
            setVolumes((prev) => ({ ...prev, [connId]: value }));
            console.log(`[${connId}] volume: ${value.toFixed(2)} dB`);
          } else {
            console.warn('잘못된 볼륨값:', ev.value);
          }
        });
      }
    });

    mySession.on('streamDestroyed', (event) => {
      const connId = event.stream.connection.connectionId;
      setSubscribers((prev) =>
        prev.filter((sub) => sub.stream.streamId !== event.stream.streamId)
      );
      setVolumes((prev) => {
        const updated = { ...prev };
        delete updated[connId];
        return updated;
      });
      console.log(`연결 종료: ${connId}`);
    });

    try {
      const realSessionId = await createSession(sessionId);
      const token = await createToken(realSessionId);

      await mySession.connect(token, {
        clientData: JSON.stringify({ nickname }),
      });

      const publisher = OV.initPublisher(undefined, {
        audioSource: undefined,
        videoSource: false,
        publishAudio: true,
        publishVideo: false,
        mirror: false,
      });

      await mySession.publish(publisher);

      setSession(mySession);
      setJoined(true);
      console.log('세션 연결 완료');
    } catch (err) {
      alert('OpenVidu 연결 실패. 콘솔을 확인하세요.');
      console.error(err);
    }
  };

  const leaveSession = () => {
    if (session) session.disconnect();
    setSession(null);
    setSubscribers([]);
    setJoined(false);
    setVolumes({});
    console.log('세션 종료');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>OpenVidu 음성 통화 테스트</h2>
      {!joined ? (
        <>
          <input ref={nicknameRef} placeholder="닉네임 입력" />
          <button onClick={joinSession}>통화 참여</button>
        </>
      ) : (
        <>
          <p>✅ 참여 중입니다</p>
          <button onClick={leaveSession}>통화 나가기</button>
          <label>
            <input
              type="checkbox"
              checked={showVolume}
              onChange={() => setShowVolume((prev) => !prev)}
            />
            실시간 볼륨 보기
          </label>

          <ul>
            {subscribers.map((sub, idx) => {
              try {
                const data = JSON.parse(sub.stream.connection.data);
                const nickname = JSON.parse(data.clientData)?.nickname;
                const connId = sub.stream.connection.connectionId;
                const volume = volumes[connId];

                return (
                  <li key={idx}>
                    참여자: {nickname || '알 수 없음'}
                    {showVolume && typeof volume === 'number' && (
                      <span>
                        {' '}
                        | {volume > -50 ? '말하는 중' : '조용함'} |{' '}
                        {volume.toFixed(0)} dB{' '}
                        <meter min="-100" max="0" value={volume}></meter>
                      </span>
                    )}
                  </li>
                );
              } catch {
                return <li key={idx}>참여자: 알 수 없음</li>;
              }
            })}
          </ul>
        </>
      )}
    </div>
  );
};

export default VoiceRoom;
