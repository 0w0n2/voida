/** @jsxImportSource @emotion/react */
import { css, keyframes } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import VoidaLogo from '@/assets/logo/voida-logo.png';
import ChatImage from '@/assets/icons/main-chat.png';
import LipIcon from '@/assets/icons/lip-blue.png';
import StartIcon from '@/assets/icons/start.png';
import DemoVideoIcon from '@/assets/icons/demo-video.png';

const MainPage = () => {
  const navigate = useNavigate();

  return (
    <div css={wrapper}>
      <div css={headerLogo}>
        <img src={VoidaLogo} alt="VOIDA 로고" />
      </div>

      <div css={content}>
        <div css={left}>
          <div css={tag}>
            <img src={LipIcon} alt="" css={tagIcon} />
            새로운 소통의 시작
          </div>

          <h1 css={title}>
            누구나 <span css={gradientBlue}>말하고,</span>
            <br />
            누구나 <span css={gradientPurple}>들을 수 있도록</span>
          </h1>

          <p css={desc}>
            청각장애인과 비장애인이 함께 소통할 수 있도록,
            <br />
            입술의 움직임을 글자로 바꾸는 실시간 대화 플랫폼입니다.
          </p>

          <div css={buttonBox}>
            <button css={startButton} onClick={() => navigate('/login')}>
              지금 시작하기
              <img src={StartIcon} alt="화살표 아이콘" />
            </button>
            <button css={demoButton}>
              <img src={DemoVideoIcon} alt="재생 아이콘" />
              데모 보기
            </button>
          </div>
        </div>

        <div css={right}>
          <div css={decorCircle1} />
          <div css={decorCircle2} />
          <div css={decorCircle3} />

          <img src={ChatImage} alt="대화 UI" css={chatImage} />
        </div>
      </div>
    </div>
  );
};

export default MainPage;

const wrapper = css`
  position: relative;
  height: 100vh;
  background: linear-gradient(135deg, #ffffffff 0%, #eaf3ff 50%, #e0ecff 100%);
`;

const headerLogo = css`
  position: absolute;
  top: 40px;
  left: 80px;

  img {
    height: 50px;
  }
`;

const content = css`
  display: flex;
  height: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px 0 180px;
  gap: 80px;

  @media (max-width: 1024px) {
    padding-left: 120px;
    gap: 40px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    justify-content: center;
    text-align: center;
    padding: 120px 20px 40px;
    gap: 40px;
  }
`;

const left = css`
  display: flex;
  flex-direction: column;
  max-width: 600px;
`;

const tag = css`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-family: 'NanumSquareB';
  color: var(--color-primary);
  background: rgba(49, 130, 246, 0.1);
  padding: 13px 20px;
  border-radius: 100px;
  margin-bottom: 18px;
  max-width: 240px;
`;

const tagIcon = css`
  width: 20px;
  height: 20px;
  margin-right: 8px;
`;

const title = css`
  font-size: 65px;
  font-family: 'NanumSquareEB';
  line-height: 1.3;
  margin-bottom: 20px;

  @media (max-width: 1024px) {
    font-size: 48px;
  }

  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const gradientBlue = css`
  background: linear-gradient(to right, #2563eb, #4f46e5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const gradientPurple = css`
  background: linear-gradient(to right, #4f46e5, #9333ea);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const desc = css`
  font-size: 18px;
  color: #555;
  line-height: 1.7;
  margin-bottom: 30px;

  @media (max-width: 1024px) {
    font-size: 16px;
  }

  @media (max-width: 768px) {
    font-size: 15px;
  }
`;

const buttonBox = css`
  display: flex;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }
`;

const startButton = css`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  background: linear-gradient(to right, #3182f6, #9b6bff);
  color: #fff;
  font-weight: 700;
  border-radius: 12px;
  font-size: 20px;
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }

  img {
    width: 35px;
    height: 35px;
    margin-left: 5px;
    margin-bottom: 3px;
  }
`;

const demoButton = css`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  background: #fff;
  color: var(--color-gray-600);
  font-weight: 600;
  border-radius: 12px;
  font-size: 18px;
  border: 2px solid #d9d9d9;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #f9fafb;
  }

  img {
    width: 18px;
    height: 18px;
    margin-right: 10px;
  }
`;

const chatImage = css`
  width: 900px;
  display: block;
  transition: transform 0.4s ease;
  z-index: 1;

  &:hover {
    transform: rotate(-4.5deg);
  }

  @media (max-width: 1280px) {
    width: 700px;
  }

  @media (max-width: 1024px) {
    width: 500px;
  }

  @media (max-width: 768px) {
    width: 90%;
  }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-10px) scale(1.05); }
`;

const right = css`
  flex: 1;
  display: flex;
  justify-content: center;
  position: relative;
`;

const decorBase = css`
  position: absolute;
  border-radius: 50%;
  opacity: 20;
  animation: ${bounce} 3s ease-in-out infinite;
`;

const decorCircle1 = css`
  ${decorBase};
  width: 140px;
  height: 140px;
  background: #eae8d5;
  top: 50px;
  left: 40px;
  animation-delay: 0s;
`;

const decorCircle2 = css`
  ${decorBase};
  width: 100px;
  height: 100px;
  background: #c4d8ff;
  bottom: 90px;
  right: 30px;
  animation-delay: 0.8s;
`;

const decorCircle3 = css`
  ${decorBase};
  width: 80px;
  height: 80px;
  background: #dfccf7;
  top: 50%;
  right: 60px;
  animation-delay: 1.6s;
`;
