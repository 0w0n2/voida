/** @jsxImportSource @emotion/react */
import { css, keyframes } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div css={wrap}>
      <div css={card}>
        <div css={badge}>500</div>
        <h1 css={title}>페이지를 찾을 수 없어요</h1>
        <p css={desc}>
          구글 로그인 중 오류가 발생했습니다. 이전 페이지로 돌아가주세요.
        </p>

        <div css={btnRow}>
          <button css={[btn, ghost]} onClick={() => navigate(-3)}>
            <ArrowLeft size={18} />
            이전 페이지
          </button>
          <button css={btn} onClick={() => navigate('/')}>
            <Home size={18} />
            홈으로 가기
          </button>
        </div>
      </div>
      <div css={blurBg1} />
      <div css={blurBg2} />
      <div css={blurBg3} />
    </div>
  );
}

const float1 = keyframes`
  0% { transform: translate(0,0); }
  50% { transform: translate(180px,-40px); }
  100% { transform: translate(0,0); }
`;
const float2 = keyframes`
  0% { transform: translate(0,0); }
  50% { transform: translate(-180px,40px); }
  100% { transform: translate(0,0); }
`;

const glass = css`
  background: linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.06) 100%);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(255,255,255,0.35);
  box-shadow:
    0 10px 30px rgba(0,0,0,0.12),
    inset 0 1px 1px rgba(255,255,255,0.5),
    inset 0 -1px 1px rgba(0,0,0,0.04);
`;

const wrap = css`
  position: relative;
  min-height: 100vh;
  padding: 60px 20px;
  display: grid;
  place-items: center;
  overflow: hidden;
`;

const card = css`
  ${glass};
  max-width: 640px;
  width: 100%;
  border-radius: 24px;
  padding: 60px 40px;
  text-align: center;
  color: #222;
`;

const badge = css`
  display: inline-block;
  font-family: 'NanumSquareEB';
  font-size: 48px;
  line-height: 1;
  padding: 8px 20px;  
  border-radius: 16px;
  color: var(--color-primary, #8035ff);
  margin-bottom: 16px;
`;

const title = css`
  font-family: 'NanumSquareEB';
  font-size: 28px;
  margin: 0 0 10px;
  color: var(--color-text, #222);
`;

const desc = css`
  font-family: 'NanumSquareR';
  font-size: 16px;
  color: #6b7280;
  margin: 0 0 36px;
`;

const btnRow = css`
  display: flex;
  gap: 40px;
  justify-content: center;
  flex-wrap: wrap;
`;

const btn = css`
  display: inline-flex;
  align-items: center;
  gap: 10px; 
  padding: 16px 24px;
  border-radius: 9999px;
  font-family: 'NanumSquareB';
  font-size: 16px;
  border: none;
  cursor: pointer;
  color: #fff;
  background: linear-gradient(135deg, var(--color-primary, #8035ff), #c35cff);
  box-shadow: 0 8px 20px rgba(180, 49, 246, 0.28);
  transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 24px rgba(180, 49, 246, 0.34);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    display: block;
    width: 20px;
    height: 20px;
  }
`;

const ghost = css`
  color: var(--color-primary, #8035ff);
  background: #ffffff;
  border: 1px solid #e9e9ef;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);

  &:hover {
    background: #fafafa;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  }
`;


const blurBg1 = css`
  position: absolute;
  top: 12%;
  left: 6%;
  width: 300px; height: 300px;
  background: radial-gradient(circle, #b69cff, transparent 70%);
  filter: blur(90px);
  z-index: -1;
  animation: ${float1} 26s ease-in-out infinite;
`;

const blurBg2 = css`
  position: absolute;
  bottom: 10%;
  right: 10%;
  width: 360px; height: 360px;
  background: radial-gradient(circle, #82e9ff, transparent 70%);
  filter: blur(100px);
  z-index: -1;
  animation: ${float2} 28s ease-in-out infinite;
`;

const blurBg3 = css`
  position: absolute;
  top: 45%;
  left: 25%;
  width: 260px; height: 260px;
  background: radial-gradient(circle, #ff8fa3, transparent 70%);
  filter: blur(95px);
  z-index: -1;
  animation: ${float1} 24s ease-in-out infinite;
`;
