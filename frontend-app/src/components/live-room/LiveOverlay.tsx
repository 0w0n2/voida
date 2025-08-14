/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useRef, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import User from '@/assets/icons/user.png';
import ExitWhite from '@/assets/icons/exit-white.png';
import ExitBlue from '@/assets/icons/exit-blue.png';
import { getUserQuickSlots } from '@/apis/auth/userApi';
import { useOpenViduChat } from '@/hooks/useOpenViduChat';
import { useQuickSlot } from '@/hooks/useQuickSlot';

import {
  getSession,
  getLiveToken,
  connectOpenVidu,
  disconnectOpenVidu,
  sendChatSignal,
  getUserOverview,
} from '@/apis/live-room/openViduApi';

import type { UserOverview } from '@/apis/live-room/openViduApi';

import { useAudioRecorder } from '@/hooks/useAudioRecorder'; 
import { useVideoRecorder } from '@/hooks/useVideoRecorder';

export interface ApiQuickSlot {
  quickSlotId: number;
  message: string;
  hotkey: string;
  url: string;
}

// 메시지/유저 로컬 타입(훅 반환 형태와 호환되면 OK)
type ChatUser = {
  userId: string;
  userNickname: string;
  userImageUrl: string;
  lipTalkMode?: boolean;
};

type IncomingMessage = {
  userId: string;
  userNickname: string;
  userImageUrl: string;
  content: string;
  timestamp?: string;
  lipTalkMode?: boolean;
};

const LiveOverlay = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hotkeyMapRef = useRef(new Map<string, string>());
  const ttsUrlMapRef = useRef(new Map<string, string>());
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [params] = useSearchParams();
  const roomIdFromQuery = useMemo(() => params.get('roomId'), [params]);
  const [roomId, setRoomId] = useState<string | null>(roomIdFromQuery ?? null);
  const [currentUser, setCurrentUser] = useState<UserOverview['member'] | null>(null);
  const [currentSettings, setCurrentSettings] = useState<UserOverview['setting'] | null>(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (roomIdFromQuery) setRoomId(roomIdFromQuery);
  }, [roomIdFromQuery]);

  // 채팅 훅 (실시간 메시지/시그널 처리)
  // const { handleSignalMessage, messages } = useOpenViduChat<IncomingMessage>();

  // 1) 사용자 정보 로딩
  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const { member, setting } = await getUserOverview();
  //       setCurrentUser(member);
  //       setCurrentSettings(setting);
  //     } catch (err) {
  //       console.error('사용자 정보 불러오기 실패:', err);
  //     }
  //   })();
  // }, []);

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

  useEffect(() => {
    (async () => {
      try {
        const res = await getUserQuickSlots();
        const quickSlots: ApiQuickSlot[] = res?.data?.result?.quickSlots ?? [];
        const parseHotkey = (hotkey: string) =>
          hotkey.trim().toLowerCase().replace(/^`/, '');

        const hotkeyMap = hotkeyMapRef.current;
        const urlMap = ttsUrlMapRef.current;
        hotkeyMap.clear();
        urlMap.clear();
        for (const slot of quickSlots) {
          const message: string = slot.message;
          const sigKey = parseHotkey(slot.hotkey);
          const ttsUrl = slot.url;
          hotkeyMap.set(sigKey, message);
          urlMap.set(sigKey, ttsUrl);
        }
      } catch (e) {
        console.error('퀵슬롯 불러오기 실패:', e);
      }
    })();
  }, []);

  useQuickSlot(hotkeyMapRef, ttsUrlMapRef, audioRef);

  // 5) OpenVidu 연결 (roomId + 사용자/설정 로딩 이후 한 번)
  // useEffect(() => {
  //   if (!roomId) return;
  //   if (!currentUser || !currentSettings) return;

  //   (async () => {
  //     try {
  //       await getSession(roomId); // 존재 확인/메타 읽기 (필요 시)
  //       const token = await getLiveToken(roomId);

  //       await connectOpenVidu(
  //         token,
  //         // 수신 시그널 처리기
  //         (data: string) => {
  //           try {
  //             const parsed = JSON.parse(data) as IncomingMessage;
  //             handleSignalMessage({
  //               userId: parsed.userId ?? 'unknown',
  //               userNickname: parsed.userNickname ?? 'unknown',
  //               userImageUrl: parsed.userImageUrl ?? '',
  //               content: parsed.content ?? '',
  //               timestamp: parsed.timestamp,
  //               lipTalkMode: parsed.lipTalkMode,
  //             });
  //           } catch {
  //             handleSignalMessage({
  //               userId: 'unknown',
  //               userNickname: 'unknown',
  //               userImageUrl: '',
  //               content: String(data),
  //             });
  //           }
  //         },
  //         // 내 메타데이터
  //         {
  //           userId: currentUser.memberUuid,
  //           userNickname: currentUser.nickname,
  //           userImageUrl: currentUser.profileImageUrl,
  //           lipTalkMode: currentSettings.lipTalkMode,
  //         }
  //       );
  //     } catch (err) {
  //       console.error('OpenVidu bootstrap error', err);
  //       // Electron 환경 로그 보조
  //       // @ts-expect-error - 런타임 주입 API
  //       window?.electronAPI?.logError?.(`OpenVidu bootstrap error: ${String(err)}`);
  //     }
  //   })();

  //   return () => {
  //     disconnectOpenVidu();
  //   };
  // }, [roomId, currentUser, currentSettings, handleSignalMessage]);

  // 6) 채팅 전송 API
  // const sendChat = async (text: string) => {
  //   if (!text?.trim()) return;
  //   await sendChatSignal({
  //     userId: currentUser?.memberUuid,
  //     userNickname: currentUser?.nickname,
  //     userImageUrl: currentUser?.profileImageUrl,
  //     content: text.trim(),
  //     timestamp: new Date().toISOString(),
  //     lipTalkMode: currentSettings?.lipTalkMode,
  //   });
  // };

  // 7) 녹화/종료 버튼 (실구현은 별도 훅과 연동)
// 오디오 훅
const { 
  hasPermission: hasAudioPermission, 
  isRecording: isAudioRecording, 
  start: startAudio, 
  stop: stopAudio 
} = useAudioRecorder({
  onStop: ({ blob }) => {
    const url = URL.createObjectURL(blob);
    setAudioPreviewUrl(url);
  }
});

// 비디오 훅
const { 
  hasPermission: hasVideoPermission, 
  isRecording: isVideoRecording, 
  stream: videoStream, 
  start: startVideo, 
  stop: stopVideo 
} = useVideoRecorder({
  onStop: ({ blob }) => {
    const url = URL.createObjectURL(blob);
    setVideoPreviewUrl(url);
  }
});

  const exitLive = () => {
    disconnectOpenVidu();
    window?.electronAPI?.closeOverlay?.();
  };

  // 8) 표시용 유니크 유저 목록/카운트 (messages 단일 출처 사용)
  // const uniqueUsers: ChatUser[] = Array.from(
  //   new Map(
  //     (messages as IncomingMessage[]).map((m) => [
  //       m.userId,
  //       {
  //         userId: m.userId,
  //         userNickname: m.userNickname,
  //         userImageUrl: m.userImageUrl,
  //         lipTalkMode: m.lipTalkMode,
  //       } as ChatUser,
  //     ])
  //   ).values()
  // );
  // const participantCount = uniqueUsers.length;

  // 최근 N개 메시지
  // const recentMessages = (messages as IncomingMessage[]).slice(-6);

  return (
    <div css={overlayContainer}>
      <div css={[overlayContent, isExpanded ? expanded : collapsed]}>
        <div css={header}>
          <div css={headerLeft}>
            {/* {uniqueUsers.map((u) => (
              <div key={u.userId} css={profileWrap}>
                <img
                  src={u.userImageUrl}
                  alt={u.userNickname}
                  title={u.userNickname}
                  css={profile}
                />
                {u.lipTalkMode && (
                  <div css={micBadge} aria-label="구화모드 사용중">
                    🎤
                  </div>
                )}
              </div>
            ))} */}
          </div>
          <div css={headerRight}>
            <img src={User} alt="User" css={userIcon} />
            {/* <p>{participantCount}</p> */}
            <div css={outBtn} onClick={exitLive} />
          </div>
        </div>

        {isExpanded && (
          <div css={body}>
            <div css={messagesWrap}>
              {/* {recentMessages.map((msg, idx) => (
                <div key={`${msg.userId}-${idx}`} css={messageRow}>
                  <img
                    src={msg.userImageUrl}
                    alt={msg.userNickname}
                    css={profile}
                  />
                  <p>
                    {msg.userNickname}: {msg.content}
                  </p>
                </div>
              ))} */}
            </div>
          </div>
        )}
{isExpanded &&
  (currentSettings?.lipTalkMode ? (
    <div css={normalUserControls}>
      <button css={recordBtn} onClick={isAudioRecording ? stopAudio : startAudio}>
        {isAudioRecording ? '중지' : '녹음'}
      </button>

      {audioPreviewUrl && (
        <audio
          controls
          src={audioPreviewUrl}
          style={{ marginTop: '8px', width: '100%' }}
        />
      )}
    </div>

  ) : (


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
      {/* {videoPreviewUrl && (
        <video
          controls
          src={videoPreviewUrl}
          style={{ marginTop: '8px', width: '100%', borderRadius: '8px' }}
        />
      )} */}
    </div>
  ))}
        <button onClick={() => setIsExpanded(!isExpanded)} css={toggleBtn}>
          {isExpanded ? <ChevronUp size={30} /> : <ChevronDown size={30} />}
        </button>
      </div>
    </div>
  );
};

export default LiveOverlay;

const overlayContainer = css`
  width: 100%;
  height: 100vh;         
  background: transparent;
  display: flex;
  justify-content: center;   
  align-items: top;    
  padding: 16px;
`;

const overlayContent = css`
  background: rgba(0, 0, 0, 0.4);
  color: white;
  border-radius: 10px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
`;

const expanded = css`
  width: 100%;
  height: 60vh;             
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
  font-size: 14px;
  font-weight: bold;
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
    top: 130%;
    left: 50%;
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
const body = css`
  flex: 1;
  padding: 8px 4px 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;
const toggleBtn = css`
  position: absolute;
  bottom: 6px;
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
// const profile = css`
//   width: 30px;
//   height: 30px;
//   border-radius: 50%;
//   object-fit: cover;
// `;
// const messageRow = css`
//   display: flex;
//   align-items: center;
//   gap: 8px;
// `;
const messagesWrap = css`
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 8px;
`;
// 
const lipUserControls = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 8px 0 12px;
  gap: 6px;
`;

const normalUserControls = css`
  display: flex;
  justify-content: center;
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
