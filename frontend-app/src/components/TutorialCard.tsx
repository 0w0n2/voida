/** @jsxImportSource @emotion/react */
import { css, keyframes } from '@emotion/react';
import { useState } from 'react';

const StepCards = () => {
  const [step, setStep] = useState(0);
  const next = () => setStep((s) => Math.min(s + 1, cards.length - 1));

  const CurrentCard = cards[step];

  return (
    <div css={wrapper}>
      <div css={card}>
        <div css={fadeIn}>
          <CurrentCard />
        </div>
        <div css={buttonBox}>
          {step < cards.length - 1 ? (
            <button css={nextBtn} onClick={next}>
              다음
            </button>
          ) : (
            <button css={finishBtn}>확인 완료</button>
          )}
        </div>
      </div>

      <div css={dotBox}>
        {cards.map((_, i) => (
          <span key={i} css={dot(i === step)} />
        ))}
      </div>
    </div>
  );
};

export default StepCards;

const cards = [
  () => (
    <>
      <p>얼굴 전체가 화면에 들어오도록 해주세요.</p>
      <img src="/ok.png" alt="ok" width={100} />
    </>
  ),
  () => (
    <>
      <p>입술이 가려지지 않게 주의해주세요.</p>
      <img src="/error.png" alt="error" width={100} />
    </>
  ),
  () => (
    <>
      <p>카메라 각도가 바뀌지 않도록 유의해주세요.</p>
      <img src="/ok.png" alt="ok" width={100} />
    </>
  ),
];

const wrapper = css`
  width: 100%;
  max-width: 400px;
  margin: 40px auto;
  text-align: center;
`;

const card = css`
  background: #f5f5f5;
  border-radius: 20px;
  padding: 40px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const fade = keyframes`
  from { opacity: 0; transform: scale(0.98); }
  to { opacity: 1; transform: scale(1); }
`;

const fadeIn = css`
  animation: ${fade} 0.3s ease;
`;

const buttonBox = css`
  margin-top: 24px;
`;

const nextBtn = css`
  background: #e0e0e0;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 16px;
  cursor: pointer;
`;

const finishBtn = css`
  background: #3182f6;
  border: none;
  color: white;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 16px;
  cursor: pointer;
`;

const dotBox = css`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 8px;
`;

const dot = (active: boolean) => css`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${active ? '#3182f6' : '#ccc'};
`;
