/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Lip1 from '@/assets/images/lip-reading-tutorial1.png';
import Lip2 from '@/assets/images/lip-reading-tutorial2.png';
import Lip3 from '@/assets/images/lip-reading-tutorial3.png';
import General1 from '@/assets/images/general-tutorial1.png';
import General2 from '@/assets/images/general-tutorial2.png';
import NextIcon from '@/assets/icons/next.png';

interface StepCardsProps {
  type: 'general' | 'lip';
}

const StepCards = ({ type }: StepCardsProps) => {
  const cardSets = type === 'general' ? generalCards : lipReadingCards;
  const [step, setStep] = useState(0);

  const next = () => setStep((s) => Math.min(s + 1, cardSets.length - 1));

  const navigate = useNavigate();

  const handleFinish = () => {
    if (type === 'general') {
      navigate('/tutorial/test/general');
    } else {
      navigate('/tutorial/test/lip-reading');
    }
  };

  return (
    <div css={wrapper}>
      <div css={row}>
        {cardSets.slice(0, step + 1).map((Card, idx) => (
          <div css={cardWithArrow} key={idx}>
            <div css={card}>
              <Card />
              <div css={buttonBox}>
                {idx === step ? (
                  idx < cardSets.length - 1 ? (
                    <>
                      <button css={nextBtn} onClick={next}>
                        확인 완료
                      </button>
                      <img src={NextIcon} alt="next" css={floatingArrow} />
                    </>
                  ) : (
                    <button css={finishBtn} onClick={handleFinish}>
                      {type === 'general'
                        ? '음성 테스트 하기'
                        : '구화 테스트 하기'}
                    </button>
                  )
                ) : (
                  <div css={dotsWrapper}>
                    {cardSets.map((_, dotIdx) => (
                      <span key={dotIdx} css={dot(dotIdx <= idx)} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepCards;

const generalCards = [
  () => (
    <>
      <p>
        마이크 연결상태를 <br /> 확인해주세요.
      </p>
      <img
        src={General1}
        width={105}
        css={css`
          padding-bottom: 25px;
        `}
      />
    </>
  ),
  () => (
    <>
      <p>
        목소리가 작거나 소란스럽지 <br /> 않도록 해주세요.
      </p>
      <img src={General2} width={105} />
    </>
  ),
];

const lipReadingCards = [
  () => (
    <>
      <p>
        얼굴 전체가 화면에 <br /> 들어오도록 해주세요.
      </p>
      <img src={Lip1} width={145} />
    </>
  ),
  () => (
    <>
      <p>
        입술이 가려지지 않게 <br /> 주의해주세요.
      </p>
      <img src={Lip2} width={145} />
    </>
  ),
  () => (
    <>
      <p>
        카메라 각도가 바뀌지 <br /> 않도록 유의해주세요.
      </p>
      <img src={Lip3} width={110} />
    </>
  ),
];

const wrapper = css`
  width: 100%;
  max-width: 1500px;
  margin-top: 30px;
  overflow-x: auto;
  display: flex;
  justify-content: center;
`;

const row = css`
  display: flex;
  gap: 3rem;
`;

const cardWithArrow = css`
  display: flex;
  align-items: center;
  gap: 10px;

  opacity: 0;
  transform: translateX(40px);
  animation: slideIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;

  @keyframes slideIn {
    0% {
      opacity: 0;
      transform: translateX(40px);
    }
    70% {
      opacity: 1;
      transform: translateX(0px);
    }
    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const card = css`
  flex: 0 0 250px;
  padding: 24px;
  background: #f5f5f5;
  border-radius: 16px;
  text-align: center;
  min-width: 320px;
  min-height: 440px;
  margin-bottom: 50px;

  p {
    font-family: 'NanumSquareB';
    font-size: 18px;
    line-height: 1.5;
    margin-top: 30px;
    margin-bottom: 60px;
  }
`;

const buttonBox = css`
  margin-top: 16px;
  display: flex;
  justify-content: center;
  position: relative;
`;

const floatingArrow = css`
  position: absolute;
  top: 50%;
  right: -50px;
  transform: translateY(-310%);
  width: 55px;
  height: 55px;
  background: #e0e0e0;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const nextBtn = css`
  background: var(--color-primary);
  color: var(--color-text-white);
  border: none;
  border-radius: 100px;
  padding: 10px 30px;
  cursor: pointer;
  font-family: 'NanumSquareB';
  font-size: 16px;
  line-height: 1.5;
  margin-top: 40px;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: var(--color-primary-dark);
  }
`;

const finishBtn = css`
  background: var(--color-primary);
  color: var(--color-text-white);
  border: none;
  border-radius: 100px;
  padding: 10px 30px;
  cursor: pointer;
  font-family: 'NanumSquareB';
  font-size: 16px;
  line-height: 1.5;
  margin-top: 60px;
  margin-bottom: 10px;

  &:hover {
    background-color: var(--color-primary-dark);
  }
`;

const dotsWrapper = css`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 50px;
`;

const dot = (active: boolean) => css`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${active
    ? 'var(--color-primary)'
    : 'var(--color-gray-300)'};
  transition: background-color 0.3s ease;
`;
