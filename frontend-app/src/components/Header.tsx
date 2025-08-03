/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';
import VoidaLogo from '@/assets/logo/voida-logo.png';
import ProfileImage from '@/assets/profiles/profile1.png';
import { useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';

export default function Header() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogoClick = () => {
    navigate('/main');
  };

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const handleEditProfile = () => {
    navigate('/mypage');
    setIsOpen(false);
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm('로그아웃 하시겠습니까?');
    if (confirmLogout) {
      localStorage.removeItem('accessToken');
      // navigate('/login');
    }
  };

  return (
    <div css={headerContainer}>
      <img
        src={VoidaLogo}
        alt="VOIDA 로고"
        css={logo}
        onClick={handleLogoClick}
      />
      <div css={userSection}>
        <div css={userInfoStyle} onClick={toggleMenu}>
          <img src={ProfileImage} alt="프로필 이미지" css={avatarStyle} />
          <span>
            <span css={{ fontFamily: 'NanumSquareEB' }}>진모리</span> 님
          </span>
        </div>

        {isOpen && (
          <div css={dropdownMenu}>
            <img src={ProfileImage} alt="프로필" css={dropdownAvatar} />
            <div css={dropdownTitle}>
              <strong>진모리</strong> 님, 안녕하세요!
            </div>
            <hr css={divider} />
            <button css={menuButton} onClick={handleEditProfile}>
              <User size={18} />내 정보 수정
            </button>
            <button css={logoutButton} onClick={handleLogout}>
              <LogOut size={18} />
              로그아웃
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const headerContainer = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  position: relative;
`;

const logo = css`
  width: 130px;
  cursor: pointer;
`;

const userSection = css`
  position: relative;
`;

const userInfoStyle = css`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 0.95rem;
  font-family: 'NanumSquareB';
  color: #333;
  cursor: pointer;
`;

const avatarStyle = css`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
`;

const dropdownMenu = css`
  position: absolute;
  top: 70px;
  right: 0;
  background: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  padding: 18px 20px;
  width: 210px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
`;

const dropdownAvatar = css`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 16px;
`;

const dropdownTitle = css`
  font-size: 16px;
  text-align: center;
`;

const divider = css`
  width: 100%;
  border: none;
  border-top: 1px solid #ddd;
  margin: 20px 0;
`;

const menuButton = css`
  width: 80%;
  padding: 10px;
  background: var(--color-primary);
  border: none;
  border-radius: 10px;
  color: white;
  cursor: pointer;
  font-family: 'NanumSquareR';
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-bottom: 8px;

  &:hover {
    background: var(--color-primary-dark);
  }
`;

const logoutButton = css`
  width: 80%;
  padding: 10px;
  background: #f1f1f1;
  border: none;
  border-radius: 10px;
  color: #666;
  cursor: pointer;
  font-family: 'NanumSquareR';
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:hover {
    background: #e6e6e6;
  }
`;
