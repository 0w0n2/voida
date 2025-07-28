/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import Header from '@/components/Header';
import TutorialFooter from '@/components/TurtorialFooter';

export default function TutorialLipReadingPage() {
  return (
    <div css={pageWrapperStyle}>
      <Header />
      <div css={contentWrapperStyle}>
        <h2 css={titleStyle}>마이크 인식 상태를 확인하겠습니다.</h2>
        <p css={subtitleStyle}>아래의 유의 사항을 확인해주세요.</p>
      </div>
      <TutorialFooter items={'튜토리얼 건너뛰기'} />
    </div>
  );
}

const pageWrapperStyle = css`
  min-height: 100vh;
  background-color: var(--color-bg-blue);
`;

const contentWrapperStyle = css`
  max-width: 60rem;
  margin: 0 auto;
  padding: 1.5rem;
  text-align: center;
`;

const titleStyle = css`
  font-size: 40px;
  font-family: 'NanumSquareEB';
  margin-top: 2rem;
  margin-bottom: 1rem;
`;

const subtitleStyle = css`
  color: var(--color-gray-600);
  margin-bottom: 3rem;
  font-size: 20px;
`;
