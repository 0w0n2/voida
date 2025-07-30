/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import VoidaLogo from '@/assets/logo/voida-logo.png';
import mainHome from '@/assets/icons/main-home.png';
import Header from '@/components/Header';
import goButton from '@/assets/icons/go-button.png';
import plusButton from '@/assets/icons/plus-button.png';
import { useState } from 'react';

const NoRoomMainForm = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const navigate = useNavigate();
  const CreateRoom = () => {
    navigate('/rooms/create');
  };
  const JoinRoom = () => {
    navigate('/rooms/join');
  };
  return (
    <div>
      <Header />
      <div css={iconWrapperStyle}>
        <div css={iconContainerStyle}>
          <img src={mainHome} alt="mainHome" css={iconStyle} />
        </div>
        <h1 css={NoRoomTextStyle}>현재 참여 중인 방이 없습니다.</h1>
        <span css={GuideTextStyle}>
          새로운 방을 만들어보거나, 코드를 입력해 입장해보세요.
        </span>
      </div>
      <div css={buttonWrapperStyle}>
        <div css={buttonContainerStyle}>
          <h3>새로운</h3>
          <button
            onMouseEnter={() => setHoveredCard('general')}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={CreateRoom}
            css={[
              GoRoomButtonStyle,
              hoveredCard === 'general' && {
                backgroundColor: 'var(--color-gray-500)',
                color: '#fff',
              },
            ]}
          >
            <img src={plusButton} alt="plusButton" />방 생성하기
          </button>
        </div>
        <div css={buttonContainerStyle}>
          <h3>코드로</h3>
          <button
            onMouseEnter={() => setHoveredCard('join')}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={JoinRoom}
            css={[
              joinButtonStyle,
              hoveredCard === 'join' && joinButtonHoverStyle,
            ]}
          >
            <img src={goButton} alt="goButton" />방 들어가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoRoomMainForm;

const iconWrapperStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  padding: 2rem 1rem;
  background-color: #ffffff;
`;

const iconContainerStyle = css`
  width: 120px;
  height: 120px;
  background-color: var(--color-gray-100);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
`;

const iconStyle = css`
  width: 60px;
  height: 60px;
  object-fit: contain;
`;

const NoRoomTextStyle = css`
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 0.5rem;
  text-align: center;
  font-family: 'NanumSquareR', sans-serif;
  font-weight: 800;
`;

const GuideTextStyle = css`
  font-size: 1.125rem;
  color: var(--color-gray-500);
  font-weight: 400;
  text-align: center;
  margin-bottom: 3rem;
  font-family: 'NanumSquareR', sans-serif;
`;

const buttonWrapperStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

const GoRoomButtonStyle = css`
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  font-family: 'NanumSquareR', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-width: 160px;
  background-color: var(--color-gray-100);
  color: var(--color-text);

  &:hover {
    background-color: var(--color-gray-200);
  }

  &:active {
    transform: translateY(1px);
  }

  img {
    width: 20px;
    height: 20px;
    object-fit: contain;
  }
`;
const buttonContainerStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-align: center;

  h3 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-text);
    margin: 0;
    text-align: center;
    font-family: 'NanumSquareR', sans-serif;
  }
`;

const joinButtonStyle = css`
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  font-family: 'NanumSquareR', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-width: 160px;
  background-color: var(--color-primary);
  color: var(--color-text-white);

  &:hover {
    background-color: var(--color-primary-dark);
  }

  &:active {
    transform: translateY(1px);
  }

  img {
    width: 20px;
    height: 20px;
    object-fit: contain;
  }
`;

const joinButtonHoverStyle = css`
  background-color: #1565c0 !important;
`;
