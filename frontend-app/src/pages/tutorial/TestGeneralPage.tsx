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

const TestGeneralPage = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<null | 'success' | 'fail'>(null);
  const [analysisText, setAnalysisText] = useState<string | null>(null);
  const navigate = useNavigate();

  const { hasPermission, isRecording, start, stop } = useAudioRecorder({
    mimeType: 'audio/webm;codecs=opus',
    maxDurationMs: 10_000,
    onStop: async ({ blob }) => {
      setIsAnalyzing(true);
      try {
        const file = new File([blob], 'general-test.webm', { type: blob.type });
        const res = await uploadTutorialAudio(file, '0');
        setAnalysisResult(res.isSuccess ? 'success' : 'fail');
        setAnalysisText(res.result?.text || null); 
      } catch (err) {
        console.error(err);
        setAnalysisResult('fail');
        setAnalysisText(null);
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

      <TutorialFooter items="튜토리얼 건너뛰기" customCss={footerStyle} />
      <TutorialModal
        isOpen={isAnalyzing}
        result={analysisResult}
        text={analysisText} 
        onRetry={() => {
          setIsAnalyzing(false);
          setAnalysisResult(null);
          setAnalysisText(null);

          navigate('/tutorial/general', { replace: true });
        }}
        onGoHome={() => {
          setIsAnalyzing(false);
          setAnalysisResult(null);
          setAnalysisText(null);
          navigate('/main');
        }}
      />
    </div>
  );
};

export default TestGeneralPage;

const pageWrapperStyle = css`
  min-height: 100vh;
`;

const contentWrapperStyle = css`
  flex: 1;
  max-width: 80%;
  min-height: 100%;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 1400px) {
    max-width: 72rem;
  }
  @media (max-width: 1200px) {
    max-width: 64rem; 
  }
  @media (max-width: 900px) {
    max-width: 80%;
    padding: 0 1.5rem;
  }
  @media (max-width: 600px) {
    max-width: 80%;
    padding: 0 1rem;
  }

  @media (min-height: 900px) {
    padding-top: 0rem;
    padding-bottom: 0rem;
  }
  @media (min-height: 1000px) {
    padding-top: 4rem;
    padding-bottom: 4rem;
  }
  @media (min-height: 1300px) {
    padding-top: 5rem;
    padding-bottom: 5rem;
    max-width: 70%;
  }
`;

const titleStyle = css`
  font-size: 40px;
  font-family: 'NanumSquareEB';
  margin-top: 2rem;
  margin-bottom: 1rem;
  text-align: center;

  @media (max-width: 1400px) {
    font-size: 36px;
  }
  @media (max-width: 1200px) {
    font-size: 32px;
  }
  @media (max-width: 900px) {
    font-size: 28px;
  }
  @media (max-width: 600px) {
    font-size: 24px;
  }

  @media (min-height: 900px) {
    margin-top: 2rem;
  }
  @media (min-height: 1000px) {
    margin-top: 0.5rem;
  }
  @media (min-height: 1300px) {
    margin-top: 0.5rem;
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

const footerStyle = css`
  max-width: 90%;
  margin-top: 64px;
`;
