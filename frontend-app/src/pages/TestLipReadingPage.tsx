/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import TutorialFooter from '@/components/TurtorialFooter';
import TutorialModal from '@/components/TutorialModal';
import axios from 'axios';
import RecordButton from '@/assets/icons/record.png';

const TestLipReadingPage = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [progress, setProgress] = useState(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const maxDuration = 7000;
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<
    null | 'success' | 'fail'
  >(null);
  const navigate = useNavigate();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        setHasPermission(true);
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      })
      .catch((err) => {
        console.error('Camera permission denied:', err);
        setHasPermission(false);
      });
  }, []);

  const handleRecord = () => {
    if (!stream) return;

    if (!isRecording) {
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm',
      });
      const chunks: BlobPart[] = [];
      const startTime = Date.now();

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
        setProgress(0);

        const blob = new Blob(chunks, { type: 'video/webm' });
        const formData = new FormData();
        formData.append('file', blob, 'lip-test.webm');

        try {
          setIsAnalyzing(true);
          setAnalysisResult(null);
          await axios.post('/api/upload/lip-test', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          alert('업로드 완료!');
          setAnalysisResult('success');
        } catch (e) {
          console.error(e);
          setIsAnalyzing(false);
          setAnalysisResult('fail');
        }
      };

      progressIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const ratio = Math.min(elapsed / maxDuration, 1);
        setProgress(ratio * 100);
        if (elapsed >= maxDuration) {
          mediaRecorder.stop();
          setIsRecording(false);
        }
      }, 100);

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
    } else {
      mediaRecorderRef.current?.stop();
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setProgress(0);
      setIsRecording(false);
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
              <div css={noCamera}>카메라 접근 권한이 필요합니다</div>
            )}
            <div css={progressBarWrapper}>
              <div css={progressBar(progress)} />
            </div>
          </div>
          {!isRecording && (
            <button css={recordButton} onClick={handleRecord}>
              <img src={RecordButton} alt="record" css={iconStyle} />
            </button>
          )}
          <div css={textBox(progress)}>
            <p>“Hello, My name is John.”</p>
          </div>
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

export default TestLipReadingPage;

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

const videoContener = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 800px;
  gap: 2rem;
  border-radius: 12px;
  background: var(--color-gray-100);
`;

const videoBox = css`
  position: relative;
  width: 800px;
  height: 360px;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  margin: 0 auto;
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
  top: 50%;
  left: 50%;
  transform: translate(-50%, 120%);
  background: transparent;
  border: none;
  cursor: pointer;
  z-index: 2;
`;

const iconStyle = css`
  width: 70px;
  height: 70px;
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
