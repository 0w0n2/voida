/** @jsxImportSource @emotion/react */
import { useNavigate } from 'react-router-dom';
import { css } from '@emotion/react';
import TutorialMainCard from '@/components/tutorial/TutorialMainCard';
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
          <button css={skipButtonStyle} onClick={() => navigate('/main')}>
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
  max-width: 86rem;
  margin: 0 auto;
  padding: 0 2rem;

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
`;


const titleStyle = css`
  font-size: 2.5rem;
  font-family: 'NanumSquareEB';
  margin-bottom: 1rem;
  text-align: center;

  @media (max-width: 1400px) {
    font-size: 2.2rem;
  }

  @media (max-width: 1200px) {
    font-size: 2rem;
  }

  @media (max-width: 900px) {
    font-size: 1.8rem;
  }

  @media (max-width: 600px) {
    font-size: 1.6rem;
  }
`;

const subtitleStyle = css`
  color: var(--color-gray-600);
  margin-bottom: 3rem;
  text-align: center;
  font-size: 1.25rem;

  @media (max-width: 1200px) {
    font-size: 1.15rem;
  }

  @media (max-width: 900px) {
    font-size: 1.05rem;
  }

  @media (max-width: 600px) {
    font-size: 0.95rem;
  }
`;

const cardGridStyle = css`
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  justify-content: center;

  @media (max-width: 1200px) {
    gap: 1.5rem;
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 1.2rem;
  }
`;

const buttonWrapperStyle = css`
  margin-top: 4rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;

  @media (max-width: 1200px) {
    justify-content: center;
  }

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: center;
  }

  @media (max-width: 600px) {
    width: 100%;
    gap: 0.8rem;
  }
`;

const buttonStyle = css`
  padding: 0.8rem 2.5rem;
  border: none;
  border-radius: 3rem;
  font-weight: 600;
  font-size: 1rem;
  font-family: 'NanumSquareB';
  cursor: pointer;

  @media (max-width: 900px) {
    width: 80%;
  }

  @media (max-width: 600px) {
    width: 100%;
    padding: 0.8rem 1.5rem;
    font-size: 0.95rem;
  }
`;


const skipButtonStyle = css`
  ${buttonStyle};
  background-color: var(--color-gray-400);
  color: var(--color-text-white);

  &:hover {
    background-color: var(--color-gray-500);
  }
`;

const startButtonStyle = css`
  ${buttonStyle};
  background-color: var(--color-primary);
  color: var(--color-text-white);

  &:hover {
    background-color: var(--color-primary-dark);
  }
`;

