/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadTutorialAudio } from '@/apis/tutorialApi';
import { useMicVolume } from '@/hooks/useMicVolume';
import Header from '@/components/Header';
import TutorialFooter from '@/components/tutorial/TurtorialFooter';
import TutorialModal from '@/components/tutorial/TutorialGeneralModel';
import WaveVisualizer from '@/components/tutorial/WaveVisualizer';
import RecordIcon from '@/assets/icons/record.png';

const BARS = 40;

const TestGeneralPage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<
    null | 'success' | 'fail'
  >(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const bars = useMicVolume(isRecording, BARS);
  const navigate = useNavigate();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 마이크 권한 요청 및 스트림 설정
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((mediaStream) => {
        setStream(mediaStream);
        setHasPermission(true);
      })
      .catch((err) => {
        console.error('Audio permission denied:', err);
        setHasPermission(false);
      });
  }, []);

  // 녹음 시작
  const startRecording = async () => {
    if (!stream) return;

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    chunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    // 녹음이 끝났을 때
    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
      chunksRef.current = [];

      setIsAnalyzing(true);
      try {
        const res = await uploadTutorialAudio(blob);
        setAnalysisResult(res.data.result);
      } catch (err) {
        console.error(err);
        setAnalysisResult('fail');
      }
    };

    mediaRecorder.start();
    setIsRecording(true);

    timerRef.current = setTimeout(() => {
      stopRecording();
    }, 10000);
  };

  // 녹음 중지
  const stopRecording = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsRecording(false);
    mediaRecorderRef.current?.stop();
  };

  // 녹음 시작/중지 핸들러
  const handleRecordToggle = () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  return (
    <div css={pageWrapperStyle}>
      <Header />
      <div css={contentWrapperStyle}>
        <h2 css={titleStyle}>
          마이크 상태를 확인하고, 녹음 버튼을 눌러주세요.
        </h2>
        <p css={subtitleStyle}>음성이 잘 들릴 수 있도록 해주세요.</p>

        <div css={recordContainer}>
          {hasPermission ? (
            <>
              <button
                css={recordButtonStyle(isRecording)}
                onClick={handleRecordToggle}
              >
                <img src={RecordIcon} alt="record" css={iconStyle} />
                {isRecording ? '녹음 그만하기' : '녹음 시작하기'}
              </button>

              <WaveVisualizer bars={bars} />
            </>
          ) : (
            <div css={noMic}>마이크 접근 권한이 필요합니다.</div>
          )}
        </div>
      </div>

      <TutorialFooter items={'튜토리얼 건너뛰기'} />
      <TutorialModal
        isOpen={isAnalyzing}
        result={analysisResult}
        onRetry={() => {
          setIsAnalyzing(false);
          setAnalysisResult(null);
        }}
        onGoHome={() => navigate('/')}
      />
    </div>
  );
};

export default TestGeneralPage;

const pageWrapperStyle = css`
  min-height: 100vh;
`;

const contentWrapperStyle = css`
  max-width: 960px;
  margin: 0 auto;
  padding: 1.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
`;

const titleStyle = css`
  font-size: 40px;
  font-family: 'NanumSquareEB';
  margin-bottom: 1rem;
  text-align: center;
`;

const subtitleStyle = css`
  color: var(--color-gray-600);
  margin-bottom: 3rem;
  text-align: center;
  font-size: 20px;
`;

const recordContainer = css`
  width: 960px;
  height: 440px;
  margin-bottom: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 3rem 0;
`;

const iconStyle = css`
  width: 30px;
  height: 30px;
  margin-right: 20px;
`;

const recordButtonStyle = (isRecording: boolean) => css`
  background: ${isRecording ? '#ff4d4f' : '#1677ff'};
  color: #fff;
  font-size: 18px;
  font-family: 'NanumSquareB';
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 999px;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const noMic = css`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #fff;
`;
