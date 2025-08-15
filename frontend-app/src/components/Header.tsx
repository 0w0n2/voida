/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useEffect } from 'react';
import VoidaLogo from '@/assets/logo/voida-logo.png';
import { useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { logout } from '@/apis/auth/authApi';
import { getUser } from '@/apis/auth/userApi';
import { useAuthStore } from '@/stores/authStore';
import { useAlertStore } from '@/stores/useAlertStore';
import defaultProfile from '@/assets/profiles/defaultProfile.png';

export default function Header() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { user, setUser, clearUser } = useAuthStore();
  const { showConfirm } = useAlertStore();
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    if (accessToken && !user) {
      getUser()
        .then((res) => {
          const data = res.data.result.member;
          setUser({
            email: data.email,
            nickname: data.nickname,
            profileImage: data.profileImageUrl || '',
            memberUuid: data.memberUuid,
          });
        })
        .catch((err) => {
          console.error('유저 정보 로드 실패', err);
          clearUser();
        });
    }
  }, [accessToken, user, setUser, clearUser]);

  const ProfileImage = user?.profileImage;
  const ProfileName = user?.nickname || '사용자';

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

  const handleLogout = async () => {
    const confirmed = await showConfirm('로그아웃 하시겠습니까?', 'top');
    if (confirmed) {
      await logout();
      localStorage.removeItem('accessToken');
      clearUser();
      navigate('/login');
    }
  };

  const handleLogin = () => {
    navigate('/login');
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
        {accessToken ? (
          user ? (
            <div css={userInfoStyle} onClick={toggleMenu}>
              <img
                src={
                  ProfileImage
                    ? ProfileImage.startsWith('blob:')
                      ? ProfileImage
                      : `${import.meta.env.VITE_CDN_URL}/${ProfileImage.replace(
                          /^\/+/,
                          '',
                        )}`
                    : defaultProfile
                }
                alt="프로필 이미지"
                css={avatarStyle}
              />
              <span>
                <span css={{ fontFamily: 'NanumSquareEB' }}>{ProfileName}</span>{' '}
                님
              </span>
            </div>
          ) : (
            <span>로딩 중...</span>
          )
        ) : (
          <button css={loginButton} onClick={handleLogin}>
            로그인
          </button>
        )}

        {isOpen && accessToken && user && (
          <div css={dropdownMenu}>
            <img
              src={
                ProfileImage
                  ? ProfileImage.startsWith('blob:')
                    ? ProfileImage
                    : `${import.meta.env.VITE_CDN_URL}/${ProfileImage.replace(
                        /^\/+/,
                        '',
                      )}`
                  : defaultProfile
              }
              alt="프로필"
              css={dropdownAvatar}
            />
            <div css={dropdownTitle}>
              <strong>{ProfileName}</strong> 님<br />
              안녕하세요!
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
  background-color: transparent !important;

  @media (max-width: 1200px) {
    padding: 1.2rem 1.5rem;
  }

  @media (max-width: 900px) {
    padding: 1rem 1.2rem;
  }

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
`;

const logo = css`
  width: 130px;
  cursor: pointer;

  @media (max-width: 1200px) {
    width: 110px;
  }

  @media (max-width: 900px) {
    width: 100px;
  }

  @media (max-width: 600px) {
    width: 90px;
  }
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

  @media (max-width: 1200px) {
    font-size: 0.9rem;
  }

  @media (max-width: 900px) {
    font-size: 0.85rem;
  }

  @media (max-width: 600px) {
    font-size: 0.8rem;
  }
`;

const avatarStyle = css`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;

  @media (max-width: 1200px) {
    width: 44px;
    height: 44px;
  }

  @media (max-width: 900px) {
    width: 40px;
    height: 40px;
  }

  @media (max-width: 600px) {
    width: 36px;
    height: 36px;
  }
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

  @media (max-width: 600px) {
    width: 180px;
    padding: 16px;
  }
`;

const dropdownAvatar = css`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 16px;

  @media (max-width: 600px) {
    width: 50px;
    height: 50px;
  }
`;

const dropdownTitle = css`
  font-size: 16px;
  text-align: center;
  line-height: 1.5;

  @media (max-width: 600px) {
    font-size: 14px;
  }
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

const loginButton = css`
  padding: 10px 16px;
  background: var(--color-primary);
  border: none;
  border-radius: 10px;
  color: white;
  cursor: pointer;
  font-family: 'NanumSquareB';
  font-size: 14px;

  &:hover {
    background: var(--color-primary-dark);
  }
`;
