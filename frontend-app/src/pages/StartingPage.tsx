/** @jsxImportSource @emotion/react */
import { css, keyframes } from '@emotion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VoidaLogo from '@/assets/logo/voida-logo.png';
import ChatImage from '@/assets/icons/main-chat.png';
import LipIcon from '@/assets/icons/lip-blue.png';
import StartIcon from '@/assets/icons/start.png';
import { Download } from 'lucide-react';

const MainPage = () => {
  const navigate = useNavigate();
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  return (
    <div css={wrapper}>
      <div css={headerLogo}>
        <img src={VoidaLogo || '/placeholder.svg'} alt="VOIDA 로고" />
      </div>
      <div css={content}>
        <div css={left}>
          <div css={tag}>
            <img src={LipIcon || '/placeholder.svg'} alt="" css={tagIcon} />
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
              <img
                src={StartIcon || '/placeholder.svg'}
                alt="화살표 아이콘"
                css={startIconStyle}
              />
            </button>
            <button
              css={demoButton}
              onMouseEnter={() => setIsTooltipVisible(true)}
              onMouseLeave={() => setIsTooltipVisible(false)}
              onClick={() => window.open('https://www.test.voida.site/')}
            >
              <Download />
              지금 받기
              {isTooltipVisible && (
                <span css={tooltipStyle}>
                  공식 웹사이트에서 Desktop App을 설치해보세요!
                </span>
              )}
            </button>
          </div>
        </div>
        <div css={right}>
          <div css={decorCircle1} />
          <div css={decorCircle2} />
          <div css={decorCircle3} />
          <img
            src={ChatImage || '/placeholder.svg'}
            alt="대화 UI"
            css={chatImage}
          />
        </div>
      </div>
    </div>
  );
};

export default MainPage;

const wrapper = css`
  position: relative;
  height: 100vh;
  min-height: 600px;
  background: linear-gradient(135deg, #ffffff 0%, #eaf3ff 50%, #e0ecff 100%);
  overflow: hidden;

  @media (max-width: 1400px) {
    min-height: 550px;
  }

  @media (max-width: 1200px) {
    min-height: 500px;
  }

  @media (max-width: 900px) {
    min-height: 450px;
  }

  @media (max-width: 600px) {
    min-height: 420px;
  }
`;

const headerLogo = css`
  position: absolute;
  top: clamp(20px, 3vh, 40px);
  left: clamp(40px, 6vw, 80px);
  z-index: 10;

  img {
    height: clamp(35px, 4vh, 50px);
    transition: all 0.3s ease;

    @media (max-width: 900px) {
      height: 40px;
    }

    @media (max-width: 600px) {
      height: 36px;
    }
  }
`;

const content = css`
  display: flex;
  height: 100vh;
  min-height: 600px;
  justify-content: space-between;
  align-items: center;
  padding: 0 clamp(20px, 3vw, 60px) 0 clamp(120px, 15vw, 180px);
  gap: clamp(30px, 6vw, 80px);

  @media (max-width: 1400px) {
    padding-left: clamp(80px, 12vw, 140px);
    gap: clamp(25px, 5vw, 60px);
  }

  @media (max-width: 1200px) {
    padding-left: clamp(60px, 10vw, 100px);
    gap: clamp(20px, 4vw, 40px);
  }

  @media (max-width: 1000px) {
    padding-left: clamp(40px, 8vw, 80px);
    gap: clamp(15px, 3vw, 30px);
  }

  @media (max-width: 800px) {
    flex-direction: column;
    justify-content: center;
    text-align: center;
    padding: clamp(80px, 12vh, 120px) clamp(20px, 4vw, 40px)
      clamp(20px, 4vh, 40px);
    gap: clamp(20px, 4vh, 30px);
    min-height: 500px;
  }
`;

const left = css`
  display: flex;
  flex-direction: column;
  max-width: clamp(400px, 50vw, 600px);
  flex-shrink: 0;

  @media (max-width: 800px) {
    max-width: 100%;
    align-items: center;
  }
`;

const tag = css`
  display: inline-flex;
  align-items: center;
  gap: clamp(6px, 1vw, 8px);
  font-size: clamp(16px, 1.8vw, 20px);
  font-family: 'NanumSquareB';
  color: var(--color-primary);
  background: rgba(49, 130, 246, 0.1);
  padding: clamp(10px, 1.2vw, 13px) clamp(16px, 2vw, 20px);
  border-radius: 100px;
  margin-bottom: clamp(14px, 2vh, 18px);
  max-width: fit-content;
  white-space: nowrap;

  @media (max-width: 800px) {
    align-self: center;
  }
`;

const tagIcon = css`
  width: clamp(16px, 1.8vw, 20px);
  height: clamp(16px, 1.8vw, 20px);
  margin-right: clamp(6px, 0.8vw, 8px);
`;

const title = css`
  font-size: clamp(32px, 5.5vw, 65px);
  font-family: 'NanumSquareEB';
  line-height: 1.3;
  margin-bottom: clamp(16px, 2.5vh, 20px);

  @media (max-width: 1400px) {
    font-size: clamp(28px, 4.8vw, 55px);
  }

  @media (max-width: 1200px) {
    font-size: clamp(26px, 4.2vw, 48px);
  }

  @media (max-width: 1000px) {
    font-size: clamp(24px, 3.8vw, 42px);
  }

  @media (max-width: 800px) {
    font-size: clamp(22px, 3.5vw, 36px);
    text-align: center;
  }
`;

const gradientBlue = css`
  background: linear-gradient(to right, #2563eb, #4f46e5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const gradientPurple = css`
  background: linear-gradient(to right, #4f46e5, #9333ea);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const desc = css`
  font-size: clamp(14px, 1.6vw, 18px);
  color: #555;
  line-height: 1.7;
  margin-bottom: clamp(24px, 3vh, 30px);

  @media (max-width: 800px) {
    text-align: center;
    br {
      display: none;
    }
  }
`;

const buttonBox = css`
  display: flex;
  gap: clamp(12px, 1.5vw, 16px);

  @media (max-width: 800px) {
    flex-direction: column;
    align-items: center;
    gap: clamp(10px, 1.5vh, 12px);
    width: 100%;
  }

  @media (max-width: 600px) {
    button {
      width: 100%;
      max-width: 280px;
    }
  }
`;

const startButton = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: clamp(6px, 0.8vw, 8px);
  padding: clamp(10px, 1.2vw, 12px) clamp(20px, 2.5vw, 28px);
  background: linear-gradient(to right, #3182f6, #9b6bff);
  color: #fff;
  font-weight: 700;
  border-radius: clamp(10px, 1.2vw, 12px);
  font-size: clamp(16px, 1.8vw, 20px);
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(49, 130, 246, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  img {
    width: clamp(28px, 3vw, 35px);
    height: clamp(28px, 3vw, 35px);
    margin-left: clamp(3px, 0.5vw, 5px);
    margin-bottom: clamp(2px, 0.3vw, 3px);
  }
`;

const demoButton = css`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: clamp(6px, 0.8vw, 8px);
  padding: clamp(10px, 1.2vw, 12px) clamp(20px, 2.5vw, 28px);
  background: #fff;
  color: var(--color-gray-600);
  font-weight: 600;
  border-radius: clamp(10px, 1.2vw, 12px);
  font-size: clamp(15px, 1.6vw, 18px);
  border: 2px solid #d9d9d9;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    background: #f9fafb;
    transform: translateY(-1px);
  }
`;

const tooltipStyle = css`
  position: absolute;
  top: 145%;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, rgba(49, 130, 246, 0.95), rgba(155, 107, 255, 0.95));
  color: white;
  padding: 14px 18px;
  font-size: 16px;
  font-family: 'NanumSquareB';
  border-radius: 12px;
  white-space: nowrap;
  box-shadow: 0px 8px 25px rgba(49, 130, 246, 0.35);
  backdrop-filter: blur(6px);
  animation: fadeInDown 0.3s ease-out;
  z-index: 20;

  &::after {
    content: '';
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 10px;
    border-style: solid;
    border-color: transparent transparent rgba(49, 130, 246, 0.95) transparent;
    filter: drop-shadow(0px -2px 2px rgba(49, 130, 246, 0.2));
  }

  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
`;


const right = css`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  min-width: 0;

  @media (max-width: 800px) {
    flex: none;
    width: 100%;
    height: clamp(200px, 30vh, 300px);
  }
`;

const chatImage = css`
  width: clamp(300px, 45vw, 900px);
  max-width: 100%;
  height: auto;
  display: block;
  transition: transform 0.4s ease;
  z-index: 1;
  object-fit: contain;

  &:hover {
    transform: rotate(-5deg) scale(1.1);
  }

  @media (max-width: 1400px) {
    width: clamp(280px, 42vw, 700px);
  }

  @media (max-width: 1200px) {
    width: clamp(250px, 38vw, 550px);
  }

  @media (max-width: 1000px) {
    width: clamp(220px, 35vw, 450px);
  }

  @media (max-width: 800px) {
    width: clamp(200px, 80vw, 400px);

    &:hover {
      transform: rotate(-1deg) scale(1.01);
    }
  }

  @media (max-width: 600px) {
    width: 100%;
    max-width: 380px;
  }
`;

const bounce = keyframes`
  0%, 100% { 
    transform: translateY(0) scale(1); 
    opacity: 0.6;
  }
  50% { 
    transform: translateY(-10px) scale(1.05); 
    opacity: 0.8;
  }
`;

const decorBase = css`
  position: absolute;
  border-radius: 50%;
  opacity: 0.6;
  animation: ${bounce} 4s ease-in-out infinite;
  pointer-events: none;
`;

const decorCircle1 = css`
  ${decorBase};
  width: clamp(100px, 10vw, 150px);
  height: clamp(100px, 10vw, 150px);
  background: linear-gradient(135deg, #eae8d5, #f1edc6ff);
  top: clamp(30px, 8vh, 50px);
  left: clamp(20px, 4vw, 40px);
  animation-delay: 0s;

  @media (max-width: 800px) {
    top: 10%;
    left: 10%;
  }

  @media (max-width: 600px) {
    top: 12%;
    left: 8%;
    width: 80px;
    height: 80px;
  }
`;

const decorCircle2 = css`
  ${decorBase};
  width: clamp(60px, 8vw, 100px);
  height: clamp(60px, 8vw, 100px);
  background: linear-gradient(135deg, #b7cdf7ff, #b7d0f7ff);
  bottom: clamp(60px, 12vh, 90px);
  right: clamp(20px, 3vw, 30px);
  animation-delay: 1.3s;

  @media (max-width: 800px) {
    bottom: 15%;
    right: 15%;
  }

  @media (max-width: 600px) {
    width: 70px;
    height: 70px;
  }
`;

const decorCircle3 = css`
  ${decorBase};
  width: clamp(50px, 6vw, 80px);
  height: clamp(50px, 6vw, 80px);
  background: linear-gradient(135deg, #dfccf7, #dbc6faff);
  top: 50%;
  right: clamp(40px, 6vw, 60px);
  animation-delay: 2.6s;

  @media (max-width: 800px) {
    top: 40%;
    right: 20%;
  }

  @media (max-width: 600px) {
    width: 60px;
    height: 60px;
  }
`;

const startIconStyle = css`
  margin-top: 4px;
`;
