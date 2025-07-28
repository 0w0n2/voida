/** @jsxImportSource @emotion/react */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { css } from '@emotion/react';
import TutorialMainCard from '@/components/TutorialMainCard';
import Header from '@/components/Header';
import Microphone from '@/assets/images/tutorial-microphone.png';
import WebCam from '@/assets/images/tutorial-webcam.png';
import Text from '@/assets/images/tutorial-text.png';

export default function TutorialMainPage() {
  const navigate = useNavigate();

  return (
    <div css={pageWrapperStyle}>
      <Header />
      <div css={cardWrapperStyle}>
        <h2 css={titleStyle}>
          Voida 이용을 위해
          <br />
          아래와 같은 준비 과정이 필요합니다.
        </h2>
        <p css={subtitleStyle}>쉽고 간단하게 구화를 텍스트로 전달해보세요!</p>
        <div css={cardGridStyle}>
          <TutorialMainCard
            step={1}
            title="마이크 설정"
            image={Microphone}
            items={[
              '음성 텍스트로 변환하기 위해 필요합니다.',
              '마이크가 제대로 연결되어 있는지 확인하세요.',
            ]}
          />
          <TutorialMainCard
            step={2}
            title="웹캠 설정"
            image={WebCam}
            items={[
              '영상을 텍스트로 변환하기 위해 필요합니다.',
              '얼굴이 중앙으로, 입술이 잘 보이도록 해주세요.',
            ]}
          />
          <TutorialMainCard
            step={3}
            title="인식 테스트"
            image={Text}
            items={[
              '음성 인식률이 낮다면 마이크를 확인해주세요.',
              '구화 인식률이 낮다면 조명, 각도를 확인해주세요.',
            ]}
          />
        </div>

        <div css={buttonWrapperStyle}>
          <button css={skipButtonStyle} onClick={() => navigate('/rooms')}>
            튜토리얼 건너뛰기
          </button>
          <button
            css={startButtonStyle}
            onClick={() => navigate('/tutorial/user-type')}
          >
            테스트 시작하기
          </button>
        </div>
      </div>
    </div>
  );
}

const pageWrapperStyle = css`
  min-height: 100vh;
  background-color: var(--color-bg-white);
`;

const cardWrapperStyle = css`
  max-width: 84rem;
  margin: 0 auto;
  padding: 1.5rem;
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

const cardGridStyle = css`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(280px, 410px));
`;

const buttonWrapperStyle = css`
  margin-top: 3rem;
  display: flex;
  justify-content: right;
  gap: 1rem;
`;

const buttonStyle = css`
  padding: 0.75rem 2.5rem;
  border: none;
  border-radius: 3rem;
  font-weight: 600;
  font-size: 1rem;
  font-family: 'NanumSquareB';
`;

const skipButtonStyle = css`
  ${buttonStyle};
  background-color: var(--color-gray-400);
  color: var(--color-text-white);
  cursor: pointer;

  &:hover {
    background-color: var(--color-gray-500);
  }
`;

const startButtonStyle = css`
  ${buttonStyle};
  background-color: var(--color-primary);
  color: var(--color-text-white);
  cursor: pointer;

  &:hover {
    background-color: var(--color-primary-dark);
  }
`;
