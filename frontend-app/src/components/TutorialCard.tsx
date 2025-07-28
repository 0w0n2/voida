/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';

const StepCards = () => {
  const [step, setStep] = useState(0); // 0, 1, 2...

  const next = () => setStep((s) => Math.min(s + 1, cards.length - 1));

  return (
    <div css={wrapper}>
      <div css={slider(step)}>
        {cards.map((Card, idx) => (
          <div css={card} key={idx}>
            <Card />
            {idx < cards.length - 1 ? (
              <button css={nextBtn} onClick={next}>
                ➡
              </button>
            ) : (
              <button css={finishBtn}>확인 완료</button>
            )}
          </div>
        ))}
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
      <p>마지막 안내</p>
      <img src="/ok.png" alt="ok" width={100} />
    </>
  ),
];

const wrapper = css`
  width: 100%;
  max-width: 900px;
  overflow: hidden;
  margin: 40px auto;
`;

const slider = (step: number) => css`
  display: flex;
  transition: transform 0.5s ease;
  transform: translateX(-${step * 100}%);
`;

const card = css`
  min-width: 100%;
  padding: 40px;
  box-sizing: border-box;
  background: #f5f5f5;
  border-radius: 20px;
  text-align: center;
  position: relative;
`;

const nextBtn = css`
  position: absolute;
  top: 50%;
  right: -20px;
  transform: translateY(-50%);
  background: #e0e0e0;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
`;

const finishBtn = css`
  margin-top: 20px;
  background: #3182f6;
  border: none;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
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
