/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useState, useEffect } from 'react';
import defaultProfile from '../../assets/profiles/defaultProfile.png';
import { getUser, updateUser, linksocialAccount } from '@/apis/auth/userApi';
import { useAuthStore } from '@/store/authStore';
import UpdatePasswordModal from './UpdatePasswordModal';
import GetOutModal from './GetOutModal';
import camera from '@/assets/icons/mp-camera.png';
import global from '@/assets/icons/mp-global.png';
import profile from '@/assets/icons/mp-profile.png';
import mail from '@/assets/icons/mp-mail.png';
import settings from '@/assets/icons/mp-setting.png';
import google from '@/assets/icons/google-logo.png';

interface UserProfile {
  nickname: string;
  email: string;
  profileImage?: string;
}

const ProfileTab = () => {
  const { accessToken, user } = useAuthStore();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isGetOutModalOpen, setIsGetOutModalOpen] = useState(false);

  // 유저 정보 조회 API 호출 (변수에 사진, 닉네임, 이메일 할당)
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);

        // const response = await getUser(accessToken!);
        // const ProfileImage = response.data.profileImage || defaultProfile;
        // const ProfileName = response.data.nickname;
        // const ProfileEmail = response.data.email;

        // 임시 데이터 사용 (퍼블리싱용)
        setTimeout(() => {
          setUserProfile({
            nickname: '진모리',
            email: 'minhe8564@gmail.com',
            profileImage: defaultProfile,
          });
          setError(null);
        }, 500);
      } catch (err) {
        console.error('유저 정보 조회 실패:', err);
        setError('유저 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [accessToken]);

  // 변수에 입력받은 닉네임 할당
  const handleNicknameChange = (newNickname: string) => {
    if (userProfile) {
      setUserProfile({
        ...userProfile,
        nickname: newNickname,
      });
    }
  };

  // 변수에 입력받은 사진 할당 (사진 보여주기도 포함)
  const handleProfileImageChange = () => {
    if (userProfile) {
      // 이미지 파일 선택 및 미리보기
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          // 파일 크기 검증 (5MB 이하)
          if (file.size > 5 * 1024 * 1024) {
            alert('파일 크기는 5MB 이하여야 합니다.');
            return;
          }

          // 이미지 파일 타입 검증
          if (!file.type.startsWith('image/')) {
            alert('이미지 파일만 업로드 가능합니다.');
            return;
          }

          // 이미지 미리보기 URL 생성
          const imageUrl = URL.createObjectURL(file);
          setUserProfile({
            ...userProfile,
            profileImage: imageUrl,
          });

          // File 객체 저장
          setProfileImageFile(file);
        }
      };
      fileInput.click();
    }
  };

  // 수정하기 버튼 클릭 시 한번에 수정 API 호출
  const handleSave = async () => {
    if (userProfile) {
      try {
        setSaving(true);

        // TODO: API 연동 시 주석 해제
        // await updateUser(accessToken!, userProfile.nickname, profileImageFile);
        // console.log('유저 정보 업데이트 완료');

        // 임시 저장 시뮬레이션
        setTimeout(() => {
          console.log('유저 정보 업데이트 완료');
          setSaving(false);
        }, 500);
      } catch (err) {
        console.error('유저 정보 업데이트 실패:', err);
        setSaving(false);
      }
    }
  };

  // TODO: API 연동 시 구현
  const handlePasswordChange = () => {
    setIsPasswordModalOpen(true);
  };

  const handlePasswordUpdateSuccess = () => {
    console.log('비밀번호 변경 완료');
    // 필요한 경우 추가 처리
  };

  // 구글 계정 연동 클릭 시 api 연결
  const handleGoogleLink = async () => {
    // const res = await linksocialAccount(accessToken!);
    // response 오는거에 따라 연동 여부 변경하기
  };

  // 탈퇴하기 버튼 클릭 시 모달 열기
  const handleWithdraw = () => {
    setIsGetOutModalOpen(true);
  };

  const handleWithdrawConfirm = async () => {
    try {
      setSaving(true);

      // TODO: API 연동 시 주석 해제
      // await withdrawUser();
      // console.log('회원탈퇴 완료');
      // // 로그아웃 처리
      // clearAuth();

      // 임시 시뮬레이션
      setTimeout(() => {
        console.log('회원탈퇴 완료');
        setSaving(false);
        setIsGetOutModalOpen(false);
      }, 500);
    } catch (err) {
      console.error('회원탈퇴 실패:', err);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div css={loadingContainerStyle}>
        <p css={loadingTextStyle}>유저 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div css={errorContainerStyle}>
        <p css={errorTextStyle}>{error}</p>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div css={errorContainerStyle}>
        <p css={errorTextStyle}>유저 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <>
      {/* 좌측: 프로필 사진 섹션 */}
      <div css={profilePanelStyle}>
        <h2 css={panelTitleStyle}>프로필 사진</h2>
        <p css={panelSubtitleStyle}>클릭하여 사진을 변경하세요.</p>
        <div css={gradientBorderStyle}>
          <div css={profileImageContainerStyle}>
            <img
              src={userProfile.profileImage || defaultProfile}
              alt="프로필 사진"
              css={largeProfileImageStyle}
            />
          </div>
        </div>

        <button
          onClick={handleProfileImageChange}
          disabled={saving}
          css={changePhotoButtonStyle}
        >
          {saving ? (
            '변경 중...'
          ) : (
            <img src={camera} alt="camera" className="icon" />
          )}
          사진 변경
        </button>
      </div>

      {/* 우측: 기본 정보 섹션 */}
      <div css={infoPanelStyle}>
        <div css={infoHeaderStyle}>
          <h2 css={panelTitleStyle}>기본 정보</h2>
          <div css={actionButtonsStyle}>
            <button
              onClick={handleWithdraw}
              disabled={saving}
              css={withdrawButtonStyle}
            >
              {saving ? '처리 중...' : '탈퇴하기'}
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              css={saveButtonStyle}
            >
              {saving ? '저장 중...' : '수정하기'}
            </button>
          </div>
        </div>

        <p css={secondSubtitleStyle}>개인 정보를 관리하세요.</p>

        <div css={infoSectionStyle}>
          <label css={infoLabelStyle}>
            <img src={profile} alt="profile" />
            닉네임
          </label>
          <input
            type="text"
            value={userProfile.nickname}
            onChange={(e) => handleNicknameChange(e.target.value)}
            placeholder="닉네임을 입력하세요"
            disabled={saving}
            css={inputFieldStyle}
          />
        </div>

        <div css={infoSectionStyle}>
          <label css={infoLabelStyle}>
            <img src={mail} alt="mail" />
            이메일
            <span css={cannotEditButtonStyle}>수정불가</span>
          </label>
          <input
            type="email"
            value={userProfile.email}
            disabled
            placeholder="이메일을 입력하세요"
            css={inputFieldStyle}
          />
        </div>
        <div css={horizontalContainerStyle}>
          <div css={halfSectionStyle}>
            <label css={infoLabelStyle}>
              <img src={settings} alt="settings" />
              비밀번호 수정
            </label>
            <button
              onClick={handlePasswordChange}
              disabled={saving}
              css={actionButtonStyle}
            >
              비밀번호 수정하기
            </button>
          </div>

          <div css={halfSectionStyle}>
            <label css={infoLabelStyle}>
              <img src={global} alt="global" />
              소셜 연동 여부
            </label>
            <button
              onClick={handleGoogleLink}
              disabled={saving}
              css={googleButtonStyle}
            >
              <img src={google} alt="google" css={iconStyle} />
              Google 계정 연동
            </button>
          </div>
        </div>
      </div>

      <UpdatePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onPasswordUpdateSuccess={handlePasswordUpdateSuccess}
      />
      <GetOutModal
        isOpen={isGetOutModalOpen}
        onClose={() => setIsGetOutModalOpen(false)}
        onConfirm={handleWithdrawConfirm}
        userName={user?.nickname || userProfile?.nickname || '사용자'}
      />
    </>
  );
};

export default ProfileTab;

const profilePanelStyle = css`
  background-color: var(--color-bg-white);
  border-radius: 12px;
  min-width: 400px;
  justify-content: center;
  align-items: center;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const infoPanelStyle = css`
  flex: 2;
  background-color: var(--color-bg-white);
  min-width: 600px;
  border-radius: 12px;
  padding: 32px;
  margin: 0 auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const panelTitleStyle = css`
  font-family: 'NanumSquareEB';
  font-size: 20px;
  color: var(--color-text);
  margin-bottom: 8px;
  text-align: center;
`;

const panelSubtitleStyle = css`
  font-family: 'NanumSquareR', sans-serif;
  font-size: 14px;
  color: var(--color-gray-600);
  margin-bottom: 24px;
  text-align: center;
`;

const secondSubtitleStyle = css`
  font-family: 'NanumSquareR', sans-serif;
  font-size: 14px;
  color: var(--color-gray-600);
  margin-bottom: 24px;
`;

const profileImageContainerStyle = css`
  widrth: 180px;
  height: 180px;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  border-radius: 50%;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
`;

const largeProfileImageStyle = css`
  width: 170px;
  height: 170px;
  border-radius: 50%;
  object-fit: cover;
`;

const changePhotoButtonStyle = css`
  display: flex;
  align-items: center;
  gap: 20px;
  width: 40%;
  padding: 12px;
  background-color: var(--color-bg-white);
  color: var(--color-text);
  border: 1px solid var(--color-gray-300);
  border-radius: 8px;
  margin-left: 30%;
  font-family: 'NanumSquareR', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    border-color: var(--color-primary);
    color:var(--color-primary);
  }

  &:disabled {
    background-color: var(--color-gray-300);
    color: var(--color-gray-500);
    cursor: not-allowed;
  }

  .icon{
      width: 20px;
    height: 20px;
    margin-left: 5px; 
`;

const infoHeaderStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const actionButtonsStyle = css`
  display: flex;
  gap: 12px;
`;

const withdrawButtonStyle = css`
  padding: 8px 16px;
  background-color: var(--color-gray-500);
  color: var(--color-text-white);
  border: none;
  border-radius: 6px;
  font-family: 'NanumSquareR', sans-serif;
  font-size: 14px;
  font-weight: 00;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--color-gray-600);
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
  margin-bottom: 8px;
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

  &:focus {
    outline: none;
    border-color: var(--color-primary);
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
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
  }

  &:disabled {
    background-color: var(--color-gray-100);
    color: var(--color-gray-500);
    cursor: not-allowed;
  }
`;

const googleButtonStyle = css`
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
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
  }

  &:disabled {
    background-color: var(--color-gray-100);
    color: var(--color-gray-500);
    cursor: not-allowed;
  }
`;

const loadingContainerStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  background-color: var(--color-bg-white);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const loadingTextStyle = css`
  font-family: 'NanumSquareR', sans-serif;
  font-size: 16px;
  color: var(--color-gray-600);
`;

const errorContainerStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  background-color: var(--color-bg-white);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const errorTextStyle = css`
  font-family: 'NanumSquareR', sans-serif;
  font-size: 16px;
  color: var(--color-red);
`;

const horizontalContainerStyle = css`
  display: flex;
  gap: 24px;
  margin-top: 24px;
`;

const halfSectionStyle = css`
  flex: 1;
`;

const gradientBorderStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white; // or var(--color-bg-white)
  padding: 40px;
`;

const iconStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 25px;
`;
