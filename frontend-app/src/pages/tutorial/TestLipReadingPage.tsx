/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadLipTestVideo } from '@/apis/tutorial/tutorialApi';
import Header from '@/components/Header';
import TutorialFooter from '@/components/tutorial/TurtorialFooter';
import TutorialModal from '@/components/tutorial/modal/TutorialLipReadingModal';
import RecordButton from '@/assets/icons/record.png';
import { useVideoRecorder } from '@/hooks/useVideoRecorder';

const maxDuration = 3000;

const TestLipReadingPage = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<null | 'success' | 'fail'>(null);
  const [analysisText, setAnalysisText] = useState<string | null>(null);
  const navigate = useNavigate();

  const { hasPermission, isRecording, stream, start, stop } = useVideoRecorder({
    mimeType: 'video/webm',
    maxDurationMs: maxDuration,
    audioConstraints: true,
    videoConstraints: true,
    onProgress: (percent) => setProgress(percent),
    onStop: async ({ blob }) => {
      setIsAnalyzing(true);
      try {
      const parseJsonSafe = (data: any) => {
        if (!data) return {};

        if (typeof data === 'string') {
          const jsonStart = data.indexOf('{');
          const jsonEnd = data.indexOf('}', jsonStart); // 첫 번째 JSON 종료 지점 찾기

          if (jsonStart !== -1 && jsonEnd !== -1) {
            try {
              const jsonStr = data.slice(jsonStart, jsonEnd + 1).trim(); // JSON 부분만 추출
              return JSON.parse(jsonStr);
            } catch (e) {
              console.error('JSON 파싱 실패:', e, jsonStr);
            }
          }
          return {};
        }

        return data; // 이미 객체면 그대로 반환
      };

      const file = new File([blob], 'lip-test.webm', { type: blob.type });
      const rawRes = await uploadLipTestVideo(file, '0');
      const parsed = parseJsonSafe(rawRes?.data ?? rawRes);
      
      console.log(parsed.audioMime);

      setAnalysisResult(parsed.videoResult ? 'success' : 'fail');
      setAnalysisText(parsed.transText || null);
      } catch (err) {
        console.error(err);
        setAnalysisResult('fail');
        setAnalysisText(null);
      }
    },
  });

  if (stream && videoRef.current && !videoRef.current.srcObject) {
    videoRef.current.srcObject = stream;
  }

  const handleRecordClick = () => {
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
        <h2 css={titleStyle}>얼굴을 맞추고, 녹화 버튼을 눌러주세요.</h2>
        <p css={subtitleStyle}>녹화가 시작되면 아래 문장을 읽어주세요.</p>

        <div css={videoContener}>
          <div css={videoBox}>
            {hasPermission ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  css={videoStyle}
                />
                <div css={guideBox}></div>
              </>
            ) : (
              <div css={noCamera}>카메라 접근 권한이 필요합니다.</div>
            )}
            <div css={progressBarWrapper}>
              <div css={progressBar(progress)} />
            </div>
          </div>

          {!isRecording && (
            <button css={recordButton} onClick={handleRecordClick}>
              <img src={RecordButton} alt="record" css={iconStyle} />
            </button>
          )}

          <div css={textBox(progress)}>
            <p>“Hello, Good Morning!”</p>
          </div>
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

         navigate('/tutorial/lip-reading', { replace: true });
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

export default TestLipReadingPage;

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
  margin-bottom: 3rem;

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
  // margin-top: 2rem;
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

const videoContener = css`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 800px;
  gap: 2rem;
  border-radius: 12px;
  background: var(--color-gray-100);

  @media (max-width: 900px) {
    width: 100%;
  }
`;

const videoBox = css`
  position: relative;
  width: 800px;
  height: 360px;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  margin: 0 auto;

  @media (max-width: 900px) {
    width: 100%;
    height: auto;
    aspect-ratio: 16 / 9;
  }
`;

const videoStyle = css`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scaleX(-1);
`;

const noCamera = css`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #fff;
`;

const guideBox = css`
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50%;
  height: 70%;
  border-radius: 20px;
  pointer-events: none;
  z-index: 1;
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 8px;
    padding: 5px;
    background: #ffffff;
    -webkit-mask: linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }
`;

const recordButton = css`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translate(-50%, -220%);
  z-index: 10;

  background: white;
  border: none;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 12px;
  cursor: pointer;

  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 900px) {
    transform: translate(-50%, -210%);
    padding: 10px;
  }

  @media (max-width: 600px) {
    transform: translate(-50%, -200%);
    padding: 8px;
  }
`;

const iconStyle = css`
  width: 70px;
  height: 70px;

  @media (max-width: 900px) {
    width: 60px;
    height: 60px;
  }

  @media (max-width: 600px) {
    width: 50px;
    height: 50px;
  }
`;

const textBox = (progress: number) => css`
  margin-top: 10px;
  margin-bottom: 20px;
  font-size: 30px;
  font-family: 'NanumSquareEB';
  padding: 20px 30px;
  display: inline-block;

  background: linear-gradient(
    to right,
    #3182f6 0%,
    #a162e5 ${progress}%,
    #ccc ${progress + 15 > 100 ? 100 : progress + 15}%
  );

  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: background 0.3s ease;

  @media (max-width: 900px) {
    font-size: 26px;
  }

  @media (max-width: 600px) {
    font-size: 22px;
  }
`;

const progressBarWrapper = css`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 10px;
  background: rgba(255, 255, 255, 0.3);
  z-index: 1;
`;

const progressBar = (progress: number) => css`
  height: 100%;
  width: ${progress}%;
  background: linear-gradient(to right, #3182f6, #a162e5);
  transition: width 0.1s linear;
`;

const footerStyle = css`
  max-width: 90%;
`;