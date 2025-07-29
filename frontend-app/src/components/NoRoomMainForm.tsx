/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import VoidaLogo from '@/assets/icon/voida-logo.png';
import mainHome from '@/assets/icon/main-home.png';
import Header from '@/components/Header';
import goButton from '@/assets/icon/go-button.png';
import plusButton from '@/assets/icon/plus-button.png';
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
        <img src={mainHome} alt="mainHome" />
        <h1 css={NoRoomTextStyle}>현재 참여 중인 방이 없습니다.</h1>
        <span css={GuideTextStyle}>
          새로운 방을 만들어보거나, 코드를 입력해 입장해보세요.
        </span>
      </div>
      <div css={buttonWrapperStyle}>
        <div>
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
        <div>
          <h3>코드로</h3>
          <button
            onMouseEnter={() => setHoveredCard('general')}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={JoinRoom}
            css={[
              GoRoomButtonStyle,
              hoveredCard === 'general' && {
                backgroundColor: 'var(--color-primary)',
                color: '#fff',
              },
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
  background-color: linear-gradient(
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const NoRoomTextStyle = css`
  font-size: 24px;
  font-weight: 700;
  color: #000;
`;

const GuideTextStyle = css`
  font-size: 16px;
  color: #000;
`;

const buttonWrapperStyle = css`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const GoRoomButtonStyle = css`
  margin-top: 1.5rem;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  background-color: #1976d2;
  color: white;
  font-size: 1rem;
  font-family: 'NanumSquareR';
  cursor: pointer;
  transition: all 0.2s ease;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;

  &:hover {
    background-color: #1565c0;
  }

  &:active {
    transform: translateY(1px);
  }

  img {
    width: 20px;
    height: 20px;
  }
`;
