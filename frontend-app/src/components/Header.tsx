/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import VoidaLogo from '@/assets/logo/voida-logo.png';
import ProfileImage from '@/assets/profiles/profile1.png';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/main');
  };

  return (
    <div css={headerContainer}>
      <img
        src={VoidaLogo}
        alt="VOIDA 로고"
        css={logo}
        onClick={handleLogoClick}
      />
      <div css={userInfoStyle}>
        <img src={ProfileImage} alt="프로필 이미지" css={avatarStyle} />
        <span>
          <span css={{ fontFamily: 'NanumSquareEB' }}>김싸피</span> 님
        </span>
      </div>
    </div>
  );
}

const headerContainer = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
`;

const logo = css`
  width: 130px;
  cursor: pointer;
`;

const userInfoStyle = css`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 0.95rem;
  font-family: 'NanumSquareB';
  color: #333;
`;

const avatarStyle = css`
  width: 55px;
  height: 55px;
  border-radius: 50%;
  object-fit: cover;
`;
