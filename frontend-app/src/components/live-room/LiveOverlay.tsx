/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import User from '@/assets/icons/user.png';
import ExitWhite from '@/assets/icons/exit-white.png';
import ExitBlue from '@/assets/icons/exit-blue.png';
import InfoWhite from '@/assets/icons/info-white.png';
import InfoBlue from '@/assets/icons/info-blue.png';
import { getUserQuickSlots } from '@/apis/auth/userApi';
import { useQuickSlot } from '@/hooks/useQuickSlot';
import { getUserOverview, getSession, getLiveToken, connectOpenVidu, disconnectOpenVidu } from '@/apis/live-room/openViduApi';
import { uploadTutorialAudio, uploadLipTestVideo } from '@/apis/tutorial/tutorialApi';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { useMicVolume } from '@/hooks/useMicVolume';
import WaveVisualizer from '@/components/live-room/WaveVisualizar';
import { useVideoRecorder } from '@/hooks/useVideoRecorder';
import { dummyMessages } from './dummy';

export interface ApiQuickSlot {
  quickSlotId: number;
  message: string;
  hotkey: string;
  url: string;
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

type OverlayPos = 'TOPLEFT' | 'TOPRIGHT' | 'BOTTOMLEFT' | 'BOTTOMRIGHT';

const LiveOverlay = () => {
  const [searchParams] = useSearchParams();
  const meetingRoomId = searchParams.get('roomId');

  const [isExpanded, setIsExpanded] = useState(true);
  const [overlayPosition, setOverlayPosition] = useState<OverlayPos>('TOPRIGHT');
  const isBottom = overlayPosition.startsWith('BOTTOM');

  // 단축키 / 오디오 레퍼런스
  const hotkeyMapRef = useRef(new Map<string, string>());
  const ttsUrlMapRef = useRef(new Map<string, string>());
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 분석 상태
  const [step, setStep] = useState<'record' | 'loading' | 'result'>('record');
  const [analysisResult, setAnalysisResult] = useState<null | 'success' | 'fail'>(null);
  const [analysisText, setAnalysisText] = useState<string | null>(null);

  const [userInfo, setUserInfo] = useState<any>(null);

  // 채팅 스크롤 제어
  const chatListRef = useRef<HTMLDivElement | null>(null);
  const [stickBottom, setStickBottom] = useState(true);
  const BOTTOM_THRESHOLD = 40; 

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
        const User = await getUserOverview();
        setUserInfo(User);
        const pos = (User?.setting?.overlayPosition as OverlayPos) || 'TOPRIGHT';
        setOverlayPosition(pos);
      } catch (err) {
        console.error('유저 정보 조회 실패:', err);
      }
    })();
  }, []);

  // OpenVidu 연결
  // useEffect(() => {
  //   if (!userInfo || !meetingRoomId) return;

  //   (async () => {
  //     try {
  //       const sessionInfo = await getSession(meetingRoomId);
  //       console.log(sessionInfo);
  //       const token = await getLiveToken(meetingRoomId);

  //       await connectOpenVidu(token!, {
  //         onSignalMessage: (msg) => {
  //           console.log('시그널 수신:', msg);
  //         },
  //         clientData: {
  //           nickname: userInfo.member.nickname,
  //           profileImageUrl: userInfo.member.profileImageUrl,
  //         },
  //         audioSource: true,
  //         videoSource: false,
  //       });
  //     } catch (err) {
  //       console.error('OpenVidu 연결 실패:', err);
  //     }
  //   })();

  //   return () => {
  //     disconnectOpenVidu();
  //   };
  // }, [userInfo, meetingRoomId]);

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
        const parseHotkey = (hotkey: string) =>
          hotkey.trim().toLowerCase().replace(/^`/, '');

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
  useQuickSlot(hotkeyMapRef, ttsUrlMapRef, audioRef);

  // 시그널 보내기
  const sendSignalMessage = (text: string) => {
    if (window.OVSession) {
      window.OVSession
        .signal({ type: 'chat', data: text })
        .catch((err) => console.error('시그널 전송 실패:', err));
    }
  };

  // 오디오 녹음 onStop
  const { isRecording: isAudioRecording, start: startAudio, stop: stopAudio } = useAudioRecorder({
    onStop: async ({ blob }) => {
      setStep('loading');
      try {
        const file = new File([blob], 'general-test.webm', { type: blob.type });
        const res = await uploadTutorialAudio(file, '0');

        setAnalysisResult(res.isSuccess ? 'success' : 'fail');
        setAnalysisText(res.result?.text || null);
        setStep('result');

        if (res.result?.text) sendSignalMessage(res.result.text);

        setTimeout(() => setStep('record'), 5000);
      } catch (e) {
        console.log(e);
        setAnalysisResult('fail');
        setAnalysisText(null);
        setStep('result');
        setTimeout(() => setStep('record'), 800);
      }
    },
  });

  // 비디오 녹화 onStop
  const { isRecording: isVideoRecording, stream: videoStream, start: startVideo, stop: stopVideo } = useVideoRecorder({
    onStop: async ({ blob }) => {
      setStep('loading');
      try {
        const file = new File([blob], 'lip-test.webm', { type: blob.type });
        const res = await uploadLipTestVideo(file, '0');
        console.log(res);

        setAnalysisResult(res.videoResult ? 'success' : 'fail');
        console.log(res.transText);
        setAnalysisText(res.transTextKo || null);
        setStep('result');

        if (res.transTextKo) sendSignalMessage(res.transTextKo);

        setTimeout(() => setStep('record'), 5000);
      } catch(e) {
        console.log(e);
        setAnalysisResult('fail');
        setAnalysisText(null);
        setStep('result');
        setTimeout(() => setStep('record'), 800);
      }
    },
  });

  // 나가기
  const exitLive = () => {
    disconnectOpenVidu();
    window?.electronAPI?.closeOverlay?.();
  };

  // 채팅: 바닥 자동 스크롤 (마운트/확장변경 시, 그리고 stickBottom일 때만)
  useEffect(() => {
    if (stickBottom) scrollToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded, stickBottom]);

  // (데모) 더미 메시지 길이 변경 시에도 바닥 유지
  useEffect(() => {
    if (stickBottom) scrollToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dummyMessages.length, stickBottom]);

  const bars = useMicVolume(isAudioRecording, { barsCount: 20, sensitivity: 1.0, maxHeight: 8 });

  return (
    <div css={overlayContainer(isBottom)}>
      <div css={[overlayContent(isBottom), isExpanded ? expanded : collapsed]}>
        <div css={header}>
          <div css={headerLeft} />
          <div css={headerRight}>
            <img src={User} alt="User" css={userIcon} />
            <div css={infoBtn}></div>
            <div css={outBtn} onClick={exitLive} />
          </div>
        </div>

        <div css={contentBody(isBottom)}>
          <div ref={chatListRef} css={chatList} onScroll={onChatScroll}>
            {dummyMessages.map((msg) => (
              <div key={msg.messageId} css={chatItem}>
                <img src={msg.user.userImageUrl} alt={msg.user.userNickname} css={chatAvatar} />
                <div css={chatContent}>
                  <div css={chatMeta}>
                    <span css={chatName}>{msg.user.userNickname}</span>
                    <span css={chatTime}>
                      {new Date(msg.timestamp).toLocaleTimeString('ko-KR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
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
                  <video
                    ref={(el) => {
                      if (el && videoStream) {
                        el.srcObject = videoStream;
                        el.play().catch(() => {});
                      }
                    }}
                    autoPlay
                    muted
                    css={cameraPreview}
                  />
                  <button css={recordBtn} onClick={isVideoRecording ? stopVideo : startVideo}>
                    {isVideoRecording ? '중지' : '녹화'}
                  </button>
                </div>
              ) : (
                <div css={normalUserControls}>
                  <button css={recordBtn} onClick={isAudioRecording ? stopAudio : startAudio}>
                    {isAudioRecording ? '중지' : '녹음'}
                  </button>
                   <WaveVisualizer bars={bars} />
                </div>
                
              )}
            </>
          )}

          {step === 'loading' && (
            <div css={loadingDots}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}

          {step === 'result' && (
            <div css={resultBox(analysisResult || 'fail')}>
              결과: {analysisResult === 'success' ? '성공' : '실패'}
              {analysisText && <div css={resultText}>{analysisText}</div>}
            </div>
          )}
        </div>
      )}

        <button onClick={() => setIsExpanded(!isExpanded)} css={toggleBtn(isBottom)}>
          {isExpanded
            ? (isBottom ? <ChevronDown size={30} /> : <ChevronUp size={30} />)
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

const overlayContent = (isBottom: boolean) => css`
  background: rgba(0, 0, 0, 0.4);
  color: white;
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
  justify-content: space-between;
  align-items: center;
  padding: 12px 10px;
`;

const headerLeft = css`
  display: flex;
  gap: 8px;
  align-items: center;
  min-height: 30px;
`;

const headerRight = css`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const userIcon = css`
  width: 18px;
  height: 18px;
  margin-right: 2px;
`;

const infoBtn = css`
  position: relative;
  width: 23px;
  height: 23px;
  background-image: url(${InfoWhite});
  background-size: cover;
  cursor: pointer;
  margin-left: 4px;
  &:hover {
    background-image: url(${InfoBlue});
  }
  &::after {
    content: '단축키로 음성을 전송해보세요!';
    position: absolute;
    top: 170%;
    right: -400%;
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
  margin-left: 4px;
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
  margin-bottom: 20px;
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
  margin: 8px 0 12px;
  gap: 6px;
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
  width: 90%;
  height: 180px;
  background: black;
  border-radius: 8px;
  object-fit: cover;
  transform: scaleX(-1);
`;

const recordBtn = css`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  margin-top: 8px;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  &:hover {
    background: rgba(255, 255, 255, 0.4);
  }
`;

const toggleBtn = (isBottom: boolean) => css`
  position: absolute;
  ${isBottom ? 'top: 6px;' : 'bottom: 6px;'}
  left: 50%;
  transform: translateX(-50%);
  background: none;
  border: none;
  padding: 10px 0px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    color: white;
    transition: color 0.2s ease;
  }
  &:hover svg {
    color: #ccc;
  }
`;

const loadingDots = css`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 13px;
  margin-top: 6px;

  span {
    width: 10px;
    height: 10px;
    background-color: #ffffffff;
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

const resultBox = (status: 'success' | 'fail') => css`
  text-align: center;
  font-size: 14px;
  margin-top: 8px;
  padding: 6px;
  border-radius: 4px;
  background: ${status === 'success' ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)'};
`;

const resultText = css`
  font-size: 13px;
  margin-top: 4px;
  color: #fff;
`;

const chatList = css`
  flex: 1;
  min-height: 0;     
  overflow-y: auto;
  padding: 8px 8px 12px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  /* 스크롤바 살짝 커스텀(크롬/엣지) */
  &::-webkit-scrollbar { width: 8px; }
  &::-webkit-scrollbar-thumb { background: rgba(255,255,255,.25); border-radius: 8px; }
  &::-webkit-scrollbar-track { background: transparent; }
`;

const chatItem = css`
  display: flex;
  align-items: flex-start;
  gap: 8px;
`;

const chatAvatar = css`
  width: 32px;
  height: 32px;
  border-radius: 50%;
`;

const chatContent = css`
  display: flex;
  flex-direction: column;
  max-width: calc(100% - 40px);
`;

const chatMeta = css`
  display: flex;
  align-items: baseline;
  gap: 6px;
`;

const chatName = css`
  font-size: 13px;
  font-weight: bold;
  color: #fff;
`;

const chatTime = css`
  font-size: 11px;
  color: #ccc;
`;

const chatText = css`
  font-size: 14px;
  color: #fff;
  white-space: pre-wrap;
  word-break: break-word;
`;
