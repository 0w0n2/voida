/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';
import TutorialMainCard from '../components/TutorialMainCard';
import Header from '../components/Header';
import Microphone from '../styles/assets/icon/tutorial-microphone.png';
import WebCam from '../styles/assets/icon/tutorial-webcam.png';
import Text from '../styles/assets/icon/tutorial-text.png';

export default function TutorialMainPage() {
  return (
    <div css={pageWrapperStyle}>
      <Header />
      <div css={cardWrapperStyle}>
        <h2 css={titleStyle}>
          Voida 이용을 위해
          <br />아래와 같은 준비 과정이 필요합니다.
        </h2>
        <p css={subtitleStyle}>쉽고 간단하게 구화를 텍스트로 전달해보세요!</p>

        <div css={cardGridStyle}>
          <TutorialMainCard
            step={1}
            title="마이크 설정"
            image={Microphone}
            items={[
              "음성 텍스트로 변환하기 위해 필요합니다.",
              "마이크가 제대로 연결되어 있는지 확인하세요.",
            ]}
          />
          <TutorialMainCard
            step={2}
            title="웹캠 설정"
            image={WebCam}
            items={[
              "영상을 텍스트로 변환하기 위해 필요합니다.",
              "얼굴이 중앙으로, 입술이 잘 보이도록 해주세요.",
            ]}
          />
          <TutorialMainCard
            step={3}
            title="인식 테스트"
            image={Text}
            items={[
              "음성 인식률이 낮다면 마이크를 확인해주세요.",
              "구화 인식률이 낮다면 조명, 각도를 확인해주세요.",
            ]}
          />
        </div>

        <div css={buttonWrapperStyle}>
          <button css={skipButtonStyle}>튜토리얼 건너뛰기</button>
          <button css={startButtonStyle}>테스트 시작하기</button>
        </div>
      </div>
    </div>
  );
}

const pageWrapperStyle = css`
  min-height: 100vh;
  background-color: #f9f9f9;
`;

const cardWrapperStyle = css`
  max-width: 64rem;
  margin: 0 auto;
  padding: 2.5rem;
`;

const titleStyle = css`
  font-size: 1.875rem;
  font-family: 'NanumSquareEB';
  margin-bottom: 0.5rem;
  text-align: center;
`;

const subtitleStyle = css`
  color: #999;
  margin-bottom: 2.5rem;
  text-align: center;
`;

const cardGridStyle = css`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
`;

const buttonWrapperStyle = css`
  margin-top: 2.5rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const buttonStyle = css`
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
`;

const skipButtonStyle = css`
  ${buttonStyle};
  background-color: #e5e5e5;
  color: #666;
`;

const startButtonStyle = css`
  ${buttonStyle};
  background-color: #2563eb;
  color: white;
`;