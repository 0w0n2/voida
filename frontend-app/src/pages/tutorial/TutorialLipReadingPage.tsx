/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import Header from '@/components/Header';
import TutorialCard from '@/components/tutorial/TutorialCard';
import TutorialFooter from '@/components/tutorial/TurtorialFooter';

export default function TutorialLipReadingPage() {
  return (
    <div css={pageWrapperStyle}>
      <Header />
      <div css={contentWrapperStyle}>
        <h2 css={titleStyle}>웹캠 인식 상태를 확인하겠습니다.</h2>
        <p css={subtitleStyle}>아래의 유의 사항을 확인해주세요.</p>
        <TutorialCard type="lip" />
      </div>
      <TutorialFooter items="튜토리얼 건너뛰기" customCss={footerStyle} />
    </div>
  );
}

const pageWrapperStyle = css`
  min-height: 100vh;
`;

const contentWrapperStyle = css`
  flex: 1;
  max-width: 80%;
  min-height: 100%;
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
  font-size: 20px;
  text-align: center;

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

const footerStyle = css`
  max-width: 90%;
  margin-top: 4rem;
`;
