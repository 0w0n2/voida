/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import Voice from '@/assets/images/general-tutorial2.png';

interface TutorialModalProps {
  isOpen: boolean;
  result: null | 'success' | 'fail';
  onRetry: () => void;
  onGoHome: () => void;
  text?: string | null; 
}

export default function TutorialModal({
  isOpen,
  result,
  onRetry,
  onGoHome,
  text,
}: TutorialModalProps) {
  if (!isOpen) return null;

  return (
    <div css={overlayStyle}>
      <div css={modalStyle}>
        {result === null && (
          <>
            <div css={dotsWrapper}>
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </div>
            <h3>녹음 분석 중</h3>
            <p>음성을 텍스트로 바꾸고 있어요.</p>
          </>
        )}

        {result === 'success' && (
          <>
            <div css={title}>안정적으로 잘 변환되고 있어요.</div>
            <div css={contentRow}>
              <div css={iconWrapper}>
                <img src={Voice} alt="인식 성공" />
              </div>
              <div css={textCol}>
                <p className="status-text success">음성 인식 성공</p>
                <p>
                  <strong>Voida</strong> 사용을 위한
                  <br />
                  모든 준비가 끝났습니다.
                </p>
                {text && (
                  <p css={recognizedText}>
                    <strong>인식된 문장 :</strong> {text}
                  </p>
                )}
              </div>
            </div>
            <div css={buttonGroup}>
              <button className="retry" onClick={onRetry}>다시 하기</button>
              <button className="main" onClick={onGoHome}>메인으로 가기</button>
            </div>
          </>
        )}

        {result === 'fail' && (
          <>
            <h3>음성 인식이 잘 안되고 있어요.</h3>
            <div css={contentRow}>
              <div css={iconWrapper}>
                <img src={Voice} alt="인식 실패" />
              </div>
              <div css={textCol}>
                <p className="status-text fail">음성 인식 실패</p>
                <p>
                  마이크 상태를 확인하고,
                  <br />
                  다시 녹음 해주세요.
                </p>
              </div>
            </div>
            <div css={buttonGroup}>
              <button className="retry" onClick={onRetry}>다시 하기</button>
              <button className="disabled" onClick={onGoHome}>메인으로 가기</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const overlayStyle = css`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const modalStyle = css`
  background: #fff;
  width: clamp(320px, 90vw, 600px);
  min-height: clamp(300px, 60vh, 450px);
  border-radius: 24px;
  padding: clamp(1.5rem, 4vw, 3rem);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  h3 {
    font-size: clamp(22px, 4vw, 28px);
    font-family: 'NanumSquareEB';
    margin: 1rem 0 3rem;
  }

  p {
    font-size: clamp(16px, 1.8vw, 20px);
    line-height: 1.7;
    color: var(--color-gray-600);
    margin: 0.5rem 0 0;
  }

  .status-text.success,
  .status-text.fail {
    font-family: 'NanumSquareEB';
    font-size: clamp(16px, 2vw, 20px);
    margin-bottom: 0.5rem;
  }

  .status-text.success { color: #10b981; }
  .status-text.fail { color: #ef4444; }
`;

const dotsWrapper = css`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 2rem;

  .dot {
    width: 18px;
    height: 18px;
    background: #ccc;
    border-radius: 50%;
    animation: pulse 3s infinite ease-in-out;
  }
  .dot:nth-of-type(1) { animation-delay: 0s; }
  .dot:nth-of-type(2) { animation-delay: 0.4s; }
  .dot:nth-of-type(3) { animation-delay: 0.6s; }
  .dot:nth-of-type(4) { animation-delay: 0.8s; }

  @keyframes pulse {
    0%, 80%, 100% { background-color: #ccc; transform: scale(1); }
    40% { background-color: var(--color-primary); transform: scale(1.2); }
  }
`;

const title = css`
  font-size: 24px;
  font-family: 'NanumSquareEB';
  margin: 1.5rem;
  margin-bottom: 3rem;
`;

const contentRow = css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(3rem, 4vw, 5rem);
  flex-wrap: wrap;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const iconWrapper = css`
  position: relative;
  display: inline-block;

  img {
    width: clamp(100px, 30vw, 150px);
    height: auto;
    margin-right: 0;
    @media (max-width: 900px) {
      margin: 0 auto;
    }
  }
`;

const textCol = css`
  text-align: left;
  @media (max-width: 900px) { text-align: center; }
`;

const recognizedText = css`
  margin-top: 0.75rem;
  font-size: clamp(13px, 1.6vw, 16px);
  color: #374151;
  word-break: keep-all;
`;

const buttonGroup = css`
  margin-top: clamp(2rem, 5vh, 3rem);
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: clamp(0.8rem, 2vw, 1.7rem);

  button {
    padding: clamp(10px, 1.2vw, 14px) clamp(18px, 4vw, 28px);
    border-radius: 30px;
    border: none;
    font-size: clamp(14px, 1.5vw, 16px);
    font-family: 'NanumSquareEB';
    cursor: pointer;
    transition: background 0.2s ease;
    margin-bottom: 0.5rem;

    @media (max-width: 600px) {
      width: 100%;
      max-width: 300px;
    }
  }

  .disabled { background: #e5e7eb; color: #9ca3af; }
  .main { background: #10b981; color: #fff; }
  .main:hover { background: #059669; }
  .retry { background: #ef4444; color: #fff; }
  .retry:hover { background: #dc2626; }
`;
