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
      <TutorialFooter items={'튜토리얼 건너뛰기'} />
    </div>
  );
}

const pageWrapperStyle = css`
  min-height: 100vh;
`;

const contentWrapperStyle = css`
  max-width: 200rem;
  margin: 0 auto;
  padding: 1.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  font-size: 20px;
  text-align: center;
`;
