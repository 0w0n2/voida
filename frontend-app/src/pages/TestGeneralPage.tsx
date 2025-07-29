/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';
import Header from '@/components/Header';
import TutorialFooter from '@/components/TurtorialFooter';
import { useMicVolume } from '@/hooks/useMicVolume';
import WaveVisualizer from '@/components/WaveVisualizer';
import RecordIcon from '@/assets/icons/record.png';

const BARS = 40;

const TestGeneralPage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const bars = useMicVolume(isRecording, BARS);

  return (
    <div css={pageWrapperStyle}>
      <Header />
      <div css={contentWrapperStyle}>
        <h2 css={titleStyle}>마이크 상태를 확인하고, 녹음 버튼을 눌러주세요.</h2>
        <p css={subtitleStyle}>음성이 잘 들릴 수 있도록 해주세요.</p>

        <div css={recordContainer}>
          <button
            css={recordButtonStyle(isRecording)}
            onClick={() => setIsRecording((prev) => !prev)}
          >
             <img src={RecordIcon} alt="record" css={iconStyle} />
            {isRecording ? '녹음 그만하기' : '녹음 시작하기'}
          </button>

          <WaveVisualizer bars={bars} />
        </div>
      </div>
      <TutorialFooter items={'튜토리얼 건너뛰기'} />
    </div>
  );
};

export default TestGeneralPage;

const pageWrapperStyle = css`
  min-height: 100vh;
`;

const contentWrapperStyle = css`
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
`;

const subtitleStyle = css`
  color: var(--color-gray-600);
  margin-bottom: 3rem;
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

