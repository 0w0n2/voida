/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { postUserType } from '@/apis/userApi';
import Header from '@/components/Header';
import GeneralUserImg from '@/assets/icon/general-user-gray.png';
import GeneralUserImgHover from '@/assets/icon/general-user-blue.png';
import LipReadingUserImg from '@/assets/icon/lip-reading-user-gray.png';
import LipReadingUserImgHover from '@/assets/icon/lip-reading-user-blue.png';
import Microphton from '@/assets/icon/microphone.png';
import Lip from '@/assets/icon/lip.png';

export default function UserType() {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const handleSelect = async (
    e: React.MouseEvent,
    type: 'general' | 'lip-reading',
  ) => {
    e.stopPropagation();
    try {
      await postUserType(type);
      navigate(
        type === 'general' ? '/tutorial/general' : '/tutorial/lip-reading',
      );
    } catch (error) {
      console.error('사용자 유형 선택 실패:', error);
      alert('사용자 유형 선택에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div css={pageWrapperStyle}>
      <Header />
      <div css={contentWrapperStyle}>
        <h2 css={titleStyle}>Voida 튜토리얼을 시작합니다.</h2>
        <p css={subtitleStyle}>
          사용자 유형에 맞게 선택해 Voida의 AI를 테스트 해보세요!
        </p>

        <div css={cardGridStyle}>
          <div
            css={cardStyle}
            onMouseEnter={() => setHoveredCard('general')}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => navigate('/tutorial/general')}
          >
            <img
              src={
                hoveredCard === 'general' ? GeneralUserImgHover : GeneralUserImg
              }
              alt="일반 사용자"
              css={cardImageStyle}
            />
            <h3 css={cardTitleStyle}>일반 사용자라면?</h3>
            <p css={cardDescStyle}>
              음성 {'→'} 텍스트
              <br />
              대화내용을 실시간으로 바꿔줍니다!
            </p>
            <button
              css={[
                cardButtonStyle,
                hoveredCard === 'general' && {
                  backgroundColor: 'var(--color-primary)',
                  color: '#fff',
                },
              ]}
              onClick={(e) => handleSelect(e, 'general')}
            >
              <img src={Microphton} alt="" />
              <span>음성 테스트</span>
            </button>
          </div>

          <div
            css={cardStyle}
            onMouseEnter={() => setHoveredCard('lip')}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => navigate('/tutorial/lip-reading')}
          >
            <img
              src={
                hoveredCard === 'lip'
                  ? LipReadingUserImgHover
                  : LipReadingUserImg
              }
              alt="구화 사용자"
              css={cardImageStyle}
            />
            <h3 css={cardTitleStyle}>구화 사용자라면?</h3>
            <p css={cardDescStyle}>
              입 모양 {'→'} 텍스트
              <br />입 모양을 실시간으로 바꿔줍니다!
            </p>

            <button css={cardButtonStyle}>
              <img src={Lip} alt="" />
              <span>구화 테스트</span>
            </button>
          </div>
        </div>

        <div css={buttonWrapperStyle}>
          <button css={skipButtonStyle} onClick={() => navigate('/rooms')}>
            메인으로 가기
          </button>
        </div>
      </div>
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
  margin-top: 2.8rem;
  margin-bottom: 1rem;
`;

const subtitleStyle = css`
  color: var(--color-gray-600);
  margin-bottom: 3rem;
  font-size: 20px;
`;

const cardGridStyle = css`
  display: grid;
  gap: 3rem;
  justify-content: center;
  grid-template-columns: repeat(auto-fit, minmax(280px, 410px));
  margin-bottom: 2.5rem;
`;

const cardStyle = css`
  border-radius: 16px;
  border: 2px solid var(--color-gray-100);
  background: var(--color-bg-white);
  padding: 2rem;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  min-height: 450px;

  &:hover {
    background: #f0f7ff;
    transform: translateY(-4px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  }

  &:hover button {
    background-color: var(--color-primary);
    color: #fff;
  }
`;

const cardImageStyle = css`
  width: 130px;
  height: 130px;
  object-fit: contain;
  margin: 30px 0;
`;

const cardTitleStyle = css`
  font-size: 24px;
  font-family: 'NanumSquareEB';
  marign-top: 14px;
`;

const cardDescStyle = css`
  font-size: 16px;
  color: #555;
  line-height: 1.8;
  letter-spacing: 0.03em;
`;

const buttonWrapperStyle = css`
  display: flex;
  justify-content: right;
  gap: 1rem;
`;

const buttonStyle = css`
  padding: 0.75rem 2.5rem;
  border: none;
  border-radius: 3rem;
  font-weight: 600;
  font-size: 1rem;
  font-family: 'NanumSquareB';
`;

const skipButtonStyle = css`
  ${buttonStyle};
  background-color: var(--color-gray-400);
  color: var(--color-text-white);
  cursor: pointer;

  &:hover {
    background-color: var(--color-gray-500);
  }
`;

const cardButtonStyle = css`
  margin-top: 1.5rem;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  background-color: var(--color-gray-200);
  color: var(--color-text-white);
  font-size: 1rem;
  font-family: 'NanumSquareR';
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;

  img {
    width: 20px;
    height: 20px;
  }
`;
