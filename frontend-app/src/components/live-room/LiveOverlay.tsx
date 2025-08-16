/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronDown, ChevronUp, Camera, CameraOff } from 'lucide-react';
import User from '@/assets/icons/user.png';
import ExitWhite from '@/assets/icons/exit-white.png';
import ExitBlue from '@/assets/icons/exit-blue.png';
import InfoWhite from '@/assets/icons/info-white.png';
import InfoBlue from '@/assets/icons/info-blue.png';
import { getUserQuickSlots } from '@/apis/auth/userApi';
import { useQuickSlot } from '@/hooks/useQuickSlot';
import { getUserOverview, getSession, getLiveToken, connectOpenVidu, disconnectOpenVidu, sendChatSignal } from '@/apis/live-room/openViduApi';
import { uploadTutorialAudio, uploadLipTestVideo } from '@/apis/tutorial/tutorialApi';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { useVideoRecorder } from '@/hooks/useVideoRecorder';
import ProgressBar from './ProgressBar';

export interface ApiQuickSlot {
  quickSlotId: number;
  message: string;
  hotkey: string;
  url: string;
}

interface Participant {
  profileImageUrl?: string;
  nickname?: string;
  lipTalkMode?: boolean;
}
export interface ChatMessage {
  messageId: string;
  user: {
    userId: string;
    userNickname: string;
    userImageUrl: string;
  };
  content: string;
  timestamp: string;
}

type AnalysisPayload = {
  videoResult?: boolean;
  transText?: string;  
  audioMime?: string;   
  message?: string;   
};

type OverlayPos = 'TOPLEFT' | 'TOPRIGHT' | 'BOTTOMLEFT' | 'BOTTOMRIGHT';
const LiveOverlay = () => {
  const [searchParams] = useSearchParams();
  const meetingRoomId = searchParams.get('roomId');
  const [participants, setParticipants] = useState<Participant[]>([]);

  const [isExpanded, setIsExpanded] = useState(true);
  const [overlayPosition, setOverlayPosition] = useState<OverlayPos>('TOPRIGHT');
  const [overlayTransparency, setOverlayTransparency] = useState(30);
  const isBottom = overlayPosition.startsWith('BOTTOM');

  // 단축키 / 오디오 레퍼런스
  const hotkeyMapRef = useRef(new Map<string, string>());
  const ttsUrlMapRef = useRef(new Map<string, string>());
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 분석 상태
  const [step, setStep] = useState<'record' | 'loading' | 'result'>('record');
  
  const [userInfo, setUserInfo] = useState<any>(null);

  // 채팅 상태
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const chatListRef = useRef<HTMLDivElement | null>(null);
  const [stickBottom, setStickBottom] = useState(true);
  const BOTTOM_THRESHOLD = 40;

  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [showVideo, setShowVideo] = useState(true);

  const onChatScroll = () => {
    const el = chatListRef.current;
    if (!el) return;
    const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setStickBottom(distanceToBottom <= BOTTOM_THRESHOLD);
  };

  const scrollToBottom = () => {
    const el = chatListRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  };

  // 유저 정보 조회 + 위치 적용
  useEffect(() => {
    (async () => {
      try {
        const user = await getUserOverview();
        setUserInfo(user);
        const pos = (user?.setting?.overlayPosition as OverlayPos) || 'TOPRIGHT';
        setOverlayPosition(pos);
        const trans = user?.setting?.overlayTransparency;
        console.log(trans);
        setOverlayTransparency(trans);
      } catch (err) {
        console.error('유저 정보 조회 실패:', err);
      }
    })();
  }, []);

  // OpenVidu 연결
  useEffect(() => {
    if(!userInfo || !meetingRoomId) return;

    (async () => {
      try {
        const sessionInfo = await getSession(meetingRoomId);
        const initialParticipants: Participant[] = (sessionInfo?.participants || [])
          .filter(p => p.nickname !== userInfo.member.nickname)
          .concat({
            profileImageUrl: userInfo.member.profileImageUrl,
            nickname: userInfo.member.nickname,
            lipTalkMode: userInfo.setting.lipTalkMode,
          });
        setParticipants(initialParticipants);

        const token = await getLiveToken(meetingRoomId);

        await connectOpenVidu(token, {
        onParticipantJoin: (participant) => {
          if (participant.nickname === userInfo.member.nickname) return;
          setParticipants((prev) => {
            if (prev.some((p) => p.nickname === participant.nickname)) return prev;
            return [...prev, participant];
          });
        },

        onParticipantLeave: () => {
          setParticipants((prev) =>
            prev.filter((participant) => participant.nickname !== userInfo.member.nickname)
          );
        },

       onChatMessage: (data) => {
          try {
            const parsed = JSON.parse(data);
            const newMsg: ChatMessage = {
              messageId: crypto.randomUUID(),
              user: {
                userId: parsed.userId,
                userNickname: parsed.userNickname,
                userImageUrl: parsed.userImageUrl,
              },
              content: parsed.content,
              timestamp: new Date().toISOString(),
            };

            if (newMsg.content.endsWith('.mp3')) {
              const el = audioRef.current;
              if (!el) return;
              if (!el.paused) {
                el.pause();  
              }
              el.src = import.meta.env.VITE_CDN_URL
                ? `${import.meta.env.VITE_CDN_URL}/${newMsg.content}`
                : newMsg.content;
              try {
                el.play(); 
              } catch (err) {
                console.error("오디오 재생 실패:", err);
              }
              return;
            }

            // 오디오 메시지인 경우 → UI에 추가하지 않고 바로 재생
            if (newMsg.content.startsWith("{")) {
              const msg = JSON.parse(newMsg.content);

              if (msg.kind === "audio" && msg.data?.startsWith("data:")) {
                const audio = new Audio(msg.data);
                audio.play().catch(err => console.error("재생 실패:", err));
                return;
              }
            }

            setChatMessages(prev => [...prev, newMsg]);
          } catch {
            const newMsg: ChatMessage = {
              messageId: crypto.randomUUID(),
              user: {
                userId: "unknown",
                userNickname: "시스템",
                userImageUrl: "",
                },
              content: data, // 그냥 raw 텍스트
              timestamp: new Date().toISOString(),
            };
            setChatMessages(prev => [...prev, newMsg]);
          }
        },
      });
    } catch (err) {
      console.error('OpenVidu 연결 실패:', err);
    }
  })();

    return () => {
      (async () => {
        try {
          await disconnectOpenVidu();
        } catch (err) {
          console.error('OpenVidu 연결 해제 실패:', err);
        }
      })();
    }
  }, [userInfo, meetingRoomId])

  // 오디오 객체 초기화
  useEffect(() => {
    const el = new Audio();
    el.preload = 'auto';
    audioRef.current = el;

    const onError = () => console.error('오디오 로드/재생 에러:', el.error);
    el.addEventListener('error', onError);

    return () => {
      el.removeEventListener('error', onError);
      el.pause();
      audioRef.current = null;
    };
  }, []);

  // 퀵슬롯 로딩
  useEffect(() => {
    (async () => {
      try {
        const res = await getUserQuickSlots();
        const quickSlots: ApiQuickSlot[] = res?.data?.result?.quickSlots ?? [];
        const parseHotkey = (hotkey: string) => hotkey.trim().toLowerCase().replace(/^`/, '');

        hotkeyMapRef.current.clear();
        ttsUrlMapRef.current.clear();

        for (const slot of quickSlots) {
          const sigKey = parseHotkey(slot.hotkey);
          if (!sigKey) continue;
          hotkeyMapRef.current.set(sigKey, slot.message);
          if (slot.url) ttsUrlMapRef.current.set(sigKey, slot.url);
        }
      } catch (e) {
        console.error('퀵슬롯 불러오기 실패:', e);
      }
    })();
  }, []);

  // 단축키 훅
  useQuickSlot(hotkeyMapRef, ttsUrlMapRef, audioRef, (msg: string) => {
    const key = [...hotkeyMapRef.current].find(([k, v]) => v === msg)?.[0];
    if (!key) return;
    const url = ttsUrlMapRef.current.get(key);
    const contentToSend = url || msg;
    sendSignalMessage(contentToSend);
    sendSignalMessage(msg);
  });

  // 시그널 보내기
  const sendSignalMessage = (text: string) => {
    if (!userInfo) return;

    const payload = JSON.stringify({
      userId: userInfo.member.memberUuid,
      userNickname: userInfo.member.nickname,
      userImageUrl: `${import.meta.env.VITE_CDN_URL}/${userInfo.member.profileImageUrl.replace(/^\/+/, '')}`,
      content: text,
    });

    sendChatSignal(payload).catch((err) =>
      console.error("시그널 전송 실패:", err)
    );
  };

  // 오디오 녹음 onStop
  const { isRecording: isAudioRecording, start: startAudio, stop: stopAudio } = useAudioRecorder({
    maxDurationMs: 3000,
    onProgress: (percent) => setProgress(percent),
    onStop: async ({ blob }) => {
      setStep('loading');
      try {
        const file = new File([blob], 'general-test.webm', { type: blob.type });
        const res = await uploadTutorialAudio(file, '0');

        setStep('result');

        if (res.result?.text) sendSignalMessage(res.result.text);

        setStep('record');
      } catch (e) {
        console.log(e);
        setStep('result');
        setTimeout(() => setStep('record'), 500);
      }
    },
  });

  // 비디오 녹화 onStop
const { isRecording: isVideoRecording, stream: videoStream, start: startVideo, stop: stopVideo } = useVideoRecorder({
  maxDurationMs: 3000,
  onProgress: (percent) => setProgress(percent),
  onStop: async ({ blob }) => {
    setStep('loading');
    try {
      const file = new File([blob], 'lip-test.webm', { type: blob.type });
      const res = await uploadLipTestVideo(file, '0');
      const buffer = await res;

      // JSON + 오디오 분리
      const view = new DataView(buffer);
      const jsonLength = view.getUint32(0, false);
      const jsonBytes = new Uint8Array(buffer, 4, jsonLength);
      const jsonString = new TextDecoder().decode(jsonBytes);
      const parsedJson: AnalysisPayload = JSON.parse(jsonString);
      const audioStartIndex = 4 + jsonLength;
      const audioBytes = new Uint8Array(buffer, audioStartIndex);

      if (parsedJson.transText) {
        await sendSignalMessage(parsedJson.transText);
      }

      if (audioBytes.length > 0) {
        const audioBlob = new Blob([audioBytes], { type: parsedJson.audioMime || 'audio/mpeg' });

        const reader = new FileReader();
        reader.onloadend = async () => {
          if (reader.result) {
            const base64DataUrl = reader.result as string;
            await sendSignalMessage(JSON.stringify({
              kind: "audio",
              mime: parsedJson.audioMime || "audio/mpeg",
              data: base64DataUrl,
            }));
          }
        };
        reader.readAsDataURL(audioBlob);
      }

      setStep('result');
      setStep('record');
    } catch (e) {
      console.error(e);
      setStep('result');
      setTimeout(() => setStep('record'), 800);
    }
  },
});

  const videoRef = useRef<HTMLVideoElement>(null);
 useEffect(() => {
    if (showVideo && step === 'record' && videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream;
      videoRef.current.play().catch(() => {
        console.error("비디오 자동 재생 실패");
      });
    }
  }, [step, videoStream, showVideo]);
  // 나가기
  const exitLive = () => {
    disconnectOpenVidu();
    window?.electronAPI?.closeOverlay?.();
  };

  // 채팅: 바닥 자동 스크롤
  useEffect(() => {
    if (stickBottom) scrollToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded, stickBottom]);

  // 채팅: 새 메시지 올 때도 바닥 유지
  useEffect(() => {
    if (stickBottom) scrollToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatMessages.length, stickBottom]);

  return (
  <div css={overlayContainer(isBottom)}>
    <div css={[overlayContent(isBottom, overlayTransparency), isExpanded ? expanded : collapsed]}>
      <div css={header}>
        <div css={headerLeft}>
          {participants.map((p, idx) => (
           <div key={idx} css={participantWrapper}>
            <div css={userIconWrapper} data-nickname={p.nickname}>
              <img
                src={
                  p.profileImageUrl
                    ? `${import.meta.env.VITE_CDN_URL}/${p.profileImageUrl.replace(/^\/+/, '')}`
                    : ''
                }
                alt={p.nickname || '사용자'}
                css={userIcon}
              />
              {p.lipTalkMode && <span css={lipTalkBadge} />}
            </div>
          </div>
          ))}
        </div>

        <div css={headerRight}>
          <img src={User} alt="User" css={userIcon} />
          <p>{participants.length}</p>
          <div css={infoBtn}></div>
          <div css={outBtn} onClick={exitLive} />
        </div>
      </div>

      <div css={contentBody(isBottom)}>
        <div ref={chatListRef} css={chatList} onScroll={onChatScroll}>
          {chatMessages.map((msg) => (
            <div key={msg.messageId} css={chatItem}>
              <img src={msg.user.userImageUrl} alt={msg.user.userNickname} css={chatAvatar} />
              <div css={chatContent}>
                <div css={chatMeta}>
                  <span css={chatName}>{msg.user.userNickname}</span>
                  <span css={chatTime}>
                    {new Date(msg.timestamp).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div css={chatText}>{msg.content}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isExpanded && (
        <div css={expandedContentWrapper}>
          {step === 'record' && (
            <>
            {userInfo?.setting?.lipTalkMode ? (
              <div css={lipUserControls}>
                <div css={lipUserVideo}>
                  {showVideo && (
                    <div css={videoWrapper}>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline 
                        muted
                        css={cameraPreview}
                      />
                      {isVideoRecording && (
                        <ProgressBar percent={progress} height={6} position="relative" bottom={3} />
                      )}
                    </div>
                  )}
                </div>
              <div css={controlWrapper}>
                <div
                  css={cameraToggleBtn(showVideo)}
                  onClick={() => setShowVideo((prev) => !prev)}
                >
                  {showVideo ? <Camera size={18} /> : <CameraOff size={18} />}
                </div>
                <button
                  css={recordBtn(isVideoRecording)}
                  onClick={isVideoRecording ? stopVideo : startVideo}
                >
                  {isVideoRecording ? '중지' : '녹화'}
                </button>
              </div>
              </div>
            ) : (
              <div css={normalUserControls}>
                <div css={audioWrapper}>
                  {isAudioRecording && (
                     <ProgressBar percent={progress} height={6} position="relative" />
                  )}
                </div>

                <button
                  css={recordBtn(isAudioRecording)}
                  onClick={isAudioRecording ? stopAudio : startAudio}
                >
                  {isAudioRecording ? '중지' : '녹음'}
                </button>
              </div>    
            )}
            </>
          )}

          {step === 'loading' && (
            <div css={loadingDots}>
              <span></span><span></span><span></span>
            </div>
          )}
        </div>
      )}

      <button onClick={() => setIsExpanded(!isExpanded)} css={toggleBtn(isBottom)}>
        {isExpanded ? (isBottom ? <ChevronDown size={30} /> : <ChevronUp size={30} />)
                  : (isBottom ? <ChevronUp size={30} /> : <ChevronDown size={30} />)}
      </button>
    </div>
  </div>
  );
};

export default LiveOverlay;

const overlayContainer = (isBottom: boolean) => css`
  width: 100%;
  height: 100vh;
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: ${isBottom ? 'flex-end' : 'flex-start'};
  padding: 16px;
`;

const overlayContent = (isBottom: boolean, transparency: number) => css`
  background: rgba(255, 255, 255, ${transparency/100});
  color: #fff;
  border-radius: 10px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
  transform-origin: ${isBottom ? 'bottom center' : 'top center'};
  display: flex;
  flex-direction: column;
  ${isBottom ? 'padding-top: 44px;' : 'padding-bottom: 44px;'}
`;

const expanded = css`
  width: 100%;
  height: 95vh;
  max-width: 960px;
`;

const collapsed = css`
  width: 100%;
  max-width: 960px;
  height: 60px;
`;

const header = css`
  display: flex;
  align-items: center;
  padding: 12px 10px;
  width: 100%;
`;

const headerLeft = css`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-right: auto; 
`;

const headerRight = css`
  display: flex;
  align-items: center;
  gap: 2px;
`;

const participantWrapper = css`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const userIcon = css`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
`;

const userIconWrapper = css`
  position: relative;
  display: inline-block;
    &::after {
    content: attr(data-nickname);
    position: absolute;
    top: 130%;
    left: 130%;
    transform: translateX(-50%);
    background: rgba(255, 255, 255, 1);
    color: #000;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease;
  }
  &:hover::after {
    opacity: 1;
  }
`;

const lipTalkBadge = css`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  background-color: #3b82f6;
  border-radius: 50%;
  border: 2px solid white; 
`;

const infoBtn = css`
  position: relative;
  width: 21px;
  height: 21px;
  background-image: url(${InfoWhite});
  background-size: cover;
  margin-left: 12px;
  &:hover {
    background-image: url(${InfoBlue});
  }
  &::after {
    content: '단축키로 음성을 전송해보세요!';
    position: absolute;
    top: 170%;
    right: -430%;
    transform: translateX(-50%);
    background: rgba(255, 255, 255, 1);
    color: #000;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease;
  }
  &:hover::after {
    opacity: 1;
  }
`;

const outBtn = css`
  position: relative;
  width: 28px;
  height: 28px;
  background-image: url(${ExitWhite});
  background-size: cover;
  cursor: pointer;
  margin-left: 6px;
  &:hover {
    background-image: url(${ExitBlue});
  }
  &::after {
    content: '나가기';
    position: absolute;
    top: 150%;
    left: 30%;
    transform: translateX(-50%);
    background: rgba(255, 255, 255, 1);
    color: #000;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease;
  }
  &:hover::after {
    opacity: 1;
  }
`;

const expandedContentWrapper = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding-bottom: 0px;
`;

const contentBody = (isBottom: boolean) => css`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  gap: 8px;
  padding: ${isBottom ? '0 12px 12px' : '0 12px 12px'};
`;

const lipUserControls = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 8px 0px;
  gap: 6px;
`;

const lipUserVideo = css`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const videoWrapper = css`
  position: relative;
  display: inline-block;
  width: 100%;
  height: 100%;
`;

const audioWrapper = css`
  position: relative;
  display: inline-block;
  width: 300px; 
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  margin-bottom: 10px;
`;

const normalUserControls = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
  gap: 6px;
  margin: 8px 0 12px;
`;

const cameraPreview = css`
  width: 230px;
  height: 130px;
  background: black;
  border-radius: 8px;
  object-fit: cover;
  transform: scaleX(-1);
  pointer-events: none; 
`;

const controlWrapper = css`
  display: flex;
  flex-direction: row; 
  align-items: center;  
  gap: 20px;           
  margin-top: 10px; 
`;

const cameraToggleBtn = (isOn: boolean) => css`
  all: unset;
  cursor: pointer;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;  
  background: ${isOn
    ? 'linear-gradient(90deg, #6e8efb, #a777e3)'
    : 'rgba(255,255,255,0.85)'};            
  color: ${isOn ? '#fff' : '#222'};
  box-shadow: ${isOn
    ? '0 4px 15px rgba(110, 142, 251, 0.4)'
    : '0 4px 12px rgba(0,0,0,0.15)'};
  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-1px) scale(1.05);
    box-shadow: ${isOn
      ? '0 6px 18px rgba(110, 142, 251, 0.5)'
      : '0 6px 16px rgba(0,0,0,0.2)'};
  }

  &:active {
    transform: scale(0.95);
  }
`;

const recordBtn = (isActive?: boolean) => css`
  all: unset;
  cursor: pointer;
  padding: 10px 16px;
  border-radius: 9999px; 
  font-size: 13px;
  font-family: 'NanumSquareR';
  letter-spacing: 0.5px;
  color: ${isActive ? '#fff' : '#222'};
  background: ${isActive
    ? 'linear-gradient(90deg, #6e8efb, #a777e3)'
    : 'rgba(255,255,255,0.85)'};
  box-shadow: ${isActive
    ? '0 4px 15px rgba(110, 142, 251, 0.4)'
    : '0 4px 12px rgba(0,0,0,0.15)'};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.25s ease;

  &:hover {
    font-family: 'NanumSquareB';
    transform: translateY(-1px) scale(1.02);
    box-shadow: ${isActive
      ? '0 6px 18px rgba(110, 142, 251, 0.5)'
      : '0 6px 16px rgba(0,0,0,0.2)'};
  }

  &:active {
    transform: scale(0.98);
  }
  ${isActive &&
  `
    font-family: 'NanumSquareR';
    animation: pulse 1.5s infinite;
    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(110, 142, 251, 0.6); }
      70% { box-shadow: 0 0 0 15px rgba(110, 142, 251, 0); }
      100% { box-shadow: 0 0 0 0 rgba(110, 142, 251, 0); }
    }
  `}
`;

const toggleBtn = (isBottom: boolean) => css`
  position: absolute;
  ${isBottom ? 'top: 6px;' : 'bottom: 6px;'}
  left: 50%;
  transform: translateX(-50%);
  background: none;
  border: none;
  padding: 0px 0px 10px 0px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    color: #565656ff;
    transition: color 0.2s ease;
  }
  &:hover svg {
    color: #ffffffff;
  }
`;

const loadingDots = css`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 13px;
  margin-top: 6px;
  margin-bottom: 20px;

  span {
    width: 10px;
    height: 10px;
    background: linear-gradient(90deg, #6e8efb, #a777e3);
    border-radius: 50%;
    display: inline-block;
    animation: bounce 3s infinite ease-in-out both;
  }

  span:nth-of-type(1) {
    animation-delay: -0.32s;
  }
  span:nth-of-type(2) {
    animation-delay: -0.16s;
  }
  span:nth-of-type(3) {
    animation-delay: 0s;
  }

  @keyframes bounce {
    0%, 80%, 100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1);
    }
  }
`;

const chatList = css`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 8px 8px 0px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  &::-webkit-scrollbar { width: 8px; }
  &::-webkit-scrollbar-thumb { background: rgba(255,255,255,.25); border-radius: 8px; }
  &::-webkit-scrollbar-track { background: transparent; }
`;

const chatItem = css`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const chatAvatar = css`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
`;

const chatContent = css`
  display: flex;
  flex-direction: column;
  max-width: calc(100% - 40px);
`;

const chatMeta = css`
  display: flex;
  align-items: baseline;
  gap: 10px;
`;

const chatName = css`
  font-size: 13px;
  font-family: 'NanumSquareEB';
  color: #fff;
`;

const chatTime = css`
  font-size: 11px;
  font-family: 'NanumSquareR';
  color: #ccc;
`;

const chatText = css`
  font-size: 14px;
  font-family: 'NanumSquareR';
  color: #fff;
  white-space: pre-wrap;
  word-break: break-word;
  margin-top: 2px;
`;
