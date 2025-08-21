/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, UserCog, Settings, Mail, Globe } from 'lucide-react';
import defaultProfile from '@/assets/profiles/defaultProfile.png';
import {
  deleteUser,
  updateUser,
  getUserSocialAccounts,
  linksocialAccount,
} from '@/apis/auth/userApi';
import { useAuthStore } from '@/stores/authStore';
import UpdatePasswordModal from '../modal/UpdatePasswordModal';
import GetOutModal from '../modal/GetOutModal';
import google from '@/assets/icons/google-logo.png';
import { useAlertStore } from '@/stores/useAlertStore';

interface UserProfile {
  nickname: string;
  email: string;
  profileImage?: string;
}

const ProfileTab = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [userNickname, setUserNickname] = useState<string>(
    user?.nickname || '',
  );
  const [userEmail, setUserEmail] = useState<string>(user?.email || '');
  const [userImage, setUserImage] = useState<string>(user?.profileImage || '');
  const [Changed, setChanged] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isGetOutModalOpen, setIsGetOutModalOpen] = useState(false);
  const [isSocial, setIsSocial] = useState(false);
  const [socialEmail, setSocialEmail] = useState<string | null>(null);
  const [nicknameError, setNicknameError] = useState('');
  useEffect(() => {
    setUserNickname(user?.nickname ?? '');
    setUserEmail(user?.email ?? '');
    setUserImage(user?.profileImage ?? '');
    setChanged(false);
    checkGoogleLink();
  }, [user]);

const handleNicknameChange = (newNickname: string) => {
  if (newNickname.length > 10) {
    newNickname = newNickname.slice(0, 10);
  }

  setUserNickname(newNickname);
  setChanged(true);

  const regex = /^[a-zA-Z0-9가-힣]+$/;

  if (!newNickname.trim()) {
    setNicknameError('닉네임을 입력해주세요.');
  } else if (newNickname.length < 3) {
    setNicknameError('닉네임은 3자 이상이어야 합니다.');
  } else if (!regex.test(newNickname)) {
    setNicknameError('닉네임은 한글, 영문, 숫자만 사용할 수 있습니다.');
  } else if (newNickname.length > 10) {
    setNicknameError('닉네임은 10자 이하여야 합니다.');
  } else {
    setNicknameError('');
  }
};

  const handleProfileImageChange = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        if (file.size > 1 * 1024 * 1024) {
          alert('파일 크기는 1MB 이하여야 합니다.');
          return;
        }
        if (!file.type.startsWith('image/')) {
          useAlertStore
            .getState()
            .showAlert('이미지 파일만 업로드 가능합니다.', 'top');
          return;
        }
        const imageUrl = URL.createObjectURL(file);
        setUserImage(imageUrl);
        setProfileImageFile(file);
        if (imageUrl !== user?.profileImage) setChanged(true);
      }
    };
    fileInput.click();
  };

  const handleSave = async () => {
    if (nicknameError) {
      useAlertStore
        .getState()
        .showAlert(nicknameError, 'top');
      return;
    }

    if (profileImageFile || userNickname !== user?.nickname) {
      try {
        const res = await updateUser(userNickname, profileImageFile);
        const resCode = res.data.code;
        if (resCode === 910) {
          useAlertStore
            .getState()
            .showAlert('이미 사용중인 닉네임입니다.', 'top');
          return;
        }
        useAuthStore.getState().setUser({
          ...user!,
          nickname: userNickname,
          profileImage: userImage,
        });
        useAlertStore
          .getState()
          .showAlert('유저 정보가 업데이트되었습니다.', 'top');
        setChanged(false);
      } catch (err) {
        console.error('유저 정보 업데이트 실패:', err);
      }
    }
  };

  const handlePasswordChange = () => {
    setIsPasswordModalOpen(true);
  };

  // 소셜 계정 연동
  const handleGoogleLink = async () => {
    if (!window.electronAPI) {
      useAlertStore.getState().showAlert('해당 기능은 Desktop App 전용입니다. 앱 다운로드 후 이용해주세요.', 'top');
      return;
    }
    const res = await linksocialAccount('google');
    const redirectUrl = res.data.result.redirectUrl;
    window.location.href = `${
      import.meta.env.VITE_SPRING_API_URL
    }${redirectUrl}`;
  };

  // 소셜 계정 조회
  const checkGoogleLink = async () => {
    const res = await getUserSocialAccounts();
    const socialData = res.data.result.socialAccounts;
    if (socialData.length > 0) {
      setIsSocial(true);
      setSocialEmail(socialData[0].email);
    }
    return isSocial;
  };

  // 탈퇴하기 버튼 클릭 시 모달 열기
  const handleWithdraw = () => {
    setIsGetOutModalOpen(true);
  };

  const handleWithdrawConfirm = async () => {
    try {
      const res = await deleteUser();
      if (res.data.code === 911) {
        useAlertStore
          .getState()
          .showAlert('방장인 대기실이 있어 탈퇴할 수 없습니다.', 'top');
        return;
      }
      navigate('/login');
    } catch (err) {
      console.error('회원탈퇴 실패:', err);
    }
  };

  // 다 닫는 함수
  const closeAllModals = () => {
    setIsPasswordModalOpen(false);
    // setIsSuccessModalOpen(false);
  };

  return (
    <>
      <div css={profileTabContainer}>
        <div css={profilePanelStyle}>
          <h2 css={panelTitleStyle}>프로필 사진</h2>
          <p css={panelSubtitleStyle}>클릭하여 사진을 변경하세요.</p>
          <div css={gradientBorderStyle}>
            <div css={profileImageContainerStyle}>
              <img
                src={
                  userImage
                    ? userImage.startsWith('blob:')
                      ? userImage
                      : `${import.meta.env.VITE_CDN_URL}/${userImage.replace(
                          /^\/+/,
                          '',
                        )}`
                    : defaultProfile
                }
                alt="프로필 사진"
                css={largeProfileImageStyle}
              />
            </div>
          </div>
          <button
            onClick={handleProfileImageChange}
            css={changePhotoButtonStyle}
          >
            <Camera size={22} />
            사진 변경
          </button>
        </div>

        <div css={infoPanelStyle}>
          <div css={infoHeaderStyle}>
            <h2 css={panelTitleStyle}>기본 정보</h2>
            <div css={actionButtonsStyle}>
              <button onClick={handleWithdraw} css={withdrawButtonStyle}>
                탈퇴하기
              </button>
              <button
                onClick={handleSave}
                disabled={!Changed}
                css={saveButtonStyle}
              >
                수정하기
              </button>
            </div>
          </div>

          <p css={secondSubtitleStyle}>개인 정보를 관리하세요.</p>

          <div css={infoSectionStyle}>
            <label css={infoLabelStyle}>
              <UserCog size={24} />
              닉네임
            </label>
            <input
              type="text"
              value={userNickname}
              onChange={(e) => handleNicknameChange(e.target.value)}
              placeholder="닉네임을 입력하세요"
              css={inputFieldStyle}
            />
          </div>

          <div css={infoSectionStyle}>
            <label css={infoLabelStyle}>
              <Mail size={24} />
              이메일
              <span css={cannotEditButtonStyle}>수정불가</span>
            </label>
            <input
              type="email"
              value={userEmail}
              disabled
              placeholder="이메일을 입력하세요"
              css={inputFieldStyle}
            />
          </div>

          <div css={horizontalContainerStyle}>
            <div css={halfSectionStyle}>
              <label css={infoLabelStyle}>
                <Settings size={24} />
                비밀번호 수정
              </label>
              <button onClick={handlePasswordChange} css={actionButtonStyle}>
                비밀번호 수정하기
              </button>
            </div>

            <div css={halfSectionStyle}>
              <label css={infoLabelStyle}>
                <Globe size={24} />
                소셜 연동 여부
              </label>
              <button
                onClick={handleGoogleLink}
                disabled={isSocial}
                css={googleButtonStyle(isSocial)}
              >
                <img src={google} alt="google" css={iconStyle} />
                {isSocial ? `${socialEmail}` : 'Google 계정 연동하기'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <UpdatePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        closeAll={closeAllModals}
      />
      <GetOutModal
        isOpen={isGetOutModalOpen}
        onClose={() => setIsGetOutModalOpen(false)}
        onConfirm={handleWithdrawConfirm}
        userName={userNickname || userProfile?.nickname || '사용자'}
        userImage={userImage || userProfile?.profileImage || defaultProfile}
      />
    </>
  );
};

export default ProfileTab;

const profileTabContainer = css`
  display: flex;
  gap: 24px;
  align-items: flex-start;
  justify-content: center;
  flex-wrap: wrap;
  align-items: stretch;
`;

const profilePanelStyle = css`
  background-color: var(--color-bg-white);
  border-radius: 12px;
  min-width: 30%;
  justify-content: center;
  align-items: center;
  padding: 3%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 500px;
`;

const infoPanelStyle = css`
  flex: 2;
  background-color: var(--color-bg-white);
  min-width: 45%;
  border-radius: 12px;
  padding: 3%;
  margin: 0 auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 100%;
  min-height: 500px;
`;

const panelTitleStyle = css`
  font-family: 'NanumSquareEB';
  font-size: 22px;
  color: var(--color-text);
  margin-bottom: 10px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 18px;
  }

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const panelSubtitleStyle = css`
  font-family: 'NanumSquareR', sans-serif;
  font-size: 16px;
  color: var(--color-gray-600);
  text-align: center;

  @media (max-width: 768px) {
    font-size: 13px;
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    margin-bottom: 15px;
  }
`;

const secondSubtitleStyle = css`
  font-family: 'NanumSquareR', sans-serif;
  font-size: 16px;
  color: var(--color-gray-600);
  margin-bottom: 48px;
`;

const profileImageContainerStyle = css`
  width: 180px;
  height: 180px;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  border-radius: 50%;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 1024px) {
    width: 160px;
    height: 160px;
  }

  @media (max-width: 768px) {
    width: 140px;
    height: 140px;
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    width: 120px;
    height: 120px;
    margin-bottom: 15px;
  }
`;

const largeProfileImageStyle = css`
  width: 170px;
  height: 170px;
  border-radius: 50%;
  object-fit: cover;

  @media (max-width: 1024px) {
    width: 150px;
    height: 150px;
  }

  @media (max-width: 768px) {
    width: 130px;
    height: 130px;
  }

  @media (max-width: 480px) {
    width: 110px;
    height: 110px;
  }
`;

const changePhotoButtonStyle = css`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 50%;
  padding: 14px;
  background-color: var(--color-bg-white);
  color: var(--color-text);
  border: 1px solid var(--color-gray-300);
  border-radius: 8px;
  font-family: 'NanumSquareR', sans-serif;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
    font-family: 'NanumSquareEB';
  }

  &:disabled {
    background-color: var(--color-gray-300);
    color: var(--color-gray-500);
    cursor: not-allowed;
  }

  svg {
    margin-left: 8px;
    margin-top: 2px;
    display: block;
  }
`;

const infoHeaderStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const actionButtonsStyle = css`
  display: flex;
  gap: 12px;
`;

const withdrawButtonStyle = css`
  padding: 8px 16px;
  background-color: var(--color-gray-300);
  color: var(--color-gray-500);
  border: none;
  border-radius: 6px;
  font-family: 'NanumSquareR', sans-serif;
  font-size: 14px;
  font-weight: 00;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--color-red-dark);
    color: var(--color-text-white);
  }

  &:disabled {
    background-color: var(--color-gray-300);
    color: var(--color-gray-500);
    cursor: not-allowed;
  }
`;

const saveButtonStyle = css`
  padding: 8px 16px;
  background-color: var(--color-primary);
  color: var(--color-text-white);
  border: none;
  border-radius: 6px;
  font-family: 'NanumSquareR', sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--color-primary-dark);
  }

  &:disabled {
    background-color: var(--color-gray-300);
    color: var(--color-gray-500);
    cursor: not-allowed;
  }
`;

const infoSectionStyle = css`
  margin-bottom: 24px;
`;

const infoLabelStyle = css`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'NanumSquareR', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 10px;
  caret-color: black;
`;

const cannotEditButtonStyle = css`
  margin-left: auto;
  padding: 4px 8px;
  background-color: var(--color-gray-200);
  color: var(--color-gray-600);
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
`;

const inputFieldStyle = css`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--color-gray-300);
  border-radius: 8px;
  font-family: 'NanumSquareR', sans-serif;
  font-size: 14px;
  background-color: var(--color-bg-white);
  color: var(--color-text);
  margin-bottom: 16px;
  caret-color: black;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    font-family: 'NanumSquareEB';
  }

  &:disabled {
    background-color: var(--color-gray-100);
    color: var(--color-gray-500);
    cursor: not-allowed;
  }
`;

const actionButtonStyle = css`
  width: 100%;
  padding: 12px 16px;
  background-color: var(--color-bg-white);
  color: var(--color-text);
  border: 1px solid var(--color-gray-300);
  border-radius: 8px;
  font-family: 'NanumSquareR', sans-serif;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
    font-family: 'NanumSquareEB';
  }

  &:disabled {
    background-color: var(--color-gray-100);
    color: var(--color-gray-500);
    cursor: not-allowed;
  }
`;

const googleButtonStyle =(isSocial: boolean) => css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  height: 46px;
  padding: 12px 16px;
  background-color: var(--color-bg-white);
  color: var(--color-text);
  border: 1px solid var(--color-gray-300);
  border-radius: 8px;
  font-family: 'NanumSquareR', sans-serif;
  font-size: 14px;
  transition: all 0.2s ease;
  cursor: pointer;

  ${!isSocial &&
  `
  &:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
    font-family: 'NanumSquareEB';
  }`}


  &:disabled {
    background-color: var(--color-gray-100);
    color: var(--color-gray-500);
    cursor: not-allowed;
  }
`;

const horizontalContainerStyle = css`
  display: flex;
  gap: 3%;
  margin-top: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
  }

  @media (max-width: 480px) {
    gap: 15px;
  }
`;

const halfSectionStyle = css`
  flex: 1;
`;

const gradientBorderStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  padding: 40px;
`;

const iconStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 25px;
`;