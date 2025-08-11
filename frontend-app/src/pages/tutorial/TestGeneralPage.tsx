/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadTutorialAudio } from '@/apis/tutorial/tutorialApi';
import { useMicVolume } from '@/hooks/useMicVolume';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import Header from '@/components/Header';
import TutorialFooter from '@/components/tutorial/TurtorialFooter';
import TutorialModal from '@/components/tutorial/modal/TutorialGeneralModel';
import WaveVisualizer from '@/components/tutorial/WaveVisualizer';
import RecordIcon from '@/assets/icons/record.png';

// const BARS = 40;

const TestGeneralPage = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<null | 'success' | 'fail'>(null);
  const navigate = useNavigate();

  const { hasPermission, isRecording, start, stop } = useAudioRecorder({
    mimeType: 'audio/webm;codecs=opus',
    maxDurationMs: 10_000,
    onStop: async ({ blob }) => {
      setIsAnalyzing(true);
      try {
        const res = await uploadTutorialAudio(blob);
        setAnalysisResult(res.data.result);
      } catch (err) {
        console.error(err);
        setAnalysisResult('fail');
      }
    },
  });

const bars = useMicVolume(isRecording, { barsCount: 40, sensitivity: 1.5, maxHeight: 30 });

const handleRecordToggle = () => {
  if (isRecording) {
    stop(); 
  } else {
    setAnalysisResult(null);
    setIsAnalyzing(false);
    start();
  }
};

  return (
    <div css={pageWrapperStyle}>
      <Header />
      <div css={contentWrapperStyle}>
        <h2 css={titleStyle}>마이크 상태를 확인하고, 녹음 버튼을 눌러주세요.</h2>
        <p css={subtitleStyle}>음성이 잘 들릴 수 있도록 해주세요.</p>

        <div css={recordContainer}>
          {hasPermission ? (
            <>
              <button css={recordButtonStyle(isRecording)} onClick={handleRecordToggle}>
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
        onGoHome={() => navigate('/main')}
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

  @media (max-width: 1400px) {
    max-width: 840px;
  }

  @media (max-width: 1200px) {
    max-width: 720px;
  }

  @media (max-width: 900px) {
    max-width: 100%;
    padding: 1rem;
  }

  @media (max-width: 600px) {
    padding: 0.8rem;
  }
`;

const titleStyle = css`
  font-size: 40px;
  font-family: 'NanumSquareEB';
  margin-bottom: 1rem;
  text-align: center;

  @media (max-width: 1200px) {
    font-size: 36px;
  }

  @media (max-width: 900px) {
    font-size: 32px;
  }

  @media (max-width: 600px) {
    font-size: 28px;
  }
`;

const subtitleStyle = css`
  color: var(--color-gray-600);
  margin-bottom: 3rem;
  text-align: center;
  font-size: 20px;

  @media (max-width: 1200px) {
    font-size: 18px;
  }

  @media (max-width: 900px) {
    font-size: 16px;
  }

  @media (max-width: 600px) {
    font-size: 15px;
  }
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

  @media (max-width: 1400px) {
    width: 840px;
  }

  @media (max-width: 1200px) {
    width: 720px;
  }

  @media (max-width: 900px) {
    width: 100%;
    padding: 2rem 0;
    height: auto;
  }

  @media (max-width: 600px) {
    padding: 1.5rem 0;
    gap: 1.5rem;
  }
`;

const iconStyle = css`
  width: 30px;
  height: 30px;
  margin-right: 20px;

  @media (max-width: 600px) {
    width: 24px;
    height: 24px;
    margin-right: 12px;
  }
`;

const recordButtonStyle = (isRecording: boolean) => css`
  background: ${isRecording ? '#ff4d4f' : '#1677ff'};
  color: #fff;
  font-size: clamp(14px, 1.8vw, 18px);
  font-family: 'NanumSquareB';
  padding: clamp(0.6rem, 1.5vw, 0.8rem) clamp(1.2rem, 4vw, 2rem);
  border: none;
  border-radius: 999px;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 480px) {
    width: 100%;
    max-width: 300px;
  }
`;

const noMic = css`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 1rem;
  color: #fff;
  font-size: clamp(14px, 2vw, 18px);
  text-align: center;
`;
