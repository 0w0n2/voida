import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import defaultProfile from '../../assets/profiles/defaultProfile.png';
import { getUser, updateUser } from '../../apis/userApi';
import { useAuthStore } from '../../store/store';
import UpdatePasswordModal from './UpdatePasswordModal';
import GetOutModal from './GetOutModal';

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

        // TODO: API 연동 시 주석 해제
        // const response = await getUser(accessToken!);
        // setUserProfile(response.data);

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

  // TODO: API 연동 시 구현
  const handleGoogleLink = () => {
    console.log('Google 계정 연동');
    // TODO: Google OAuth 연동
  };

  // TODO: API 연동 시 구현
  const handleWithdraw = () => {
    setIsGetOutModalOpen(true);
  };

  const handleWithdrawConfirm = async () => {
    try {
      setSaving(true);

      // TODO: API 연동 시 주석 해제
      // await withdrawUser(accessToken!);
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
      <LoadingContainer>
        <LoadingText>유저 정보를 불러오는 중...</LoadingText>
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <ErrorContainer>
        <ErrorText>{error}</ErrorText>
      </ErrorContainer>
    );
  }

  if (!userProfile) {
    return (
      <ErrorContainer>
        <ErrorText>유저 정보를 찾을 수 없습니다.</ErrorText>
      </ErrorContainer>
    );
  }

  return (
    <>
      <ProfilePanel>
        <PanelTitle>프로필 사진</PanelTitle>
        <PanelSubtitle>클릭하여 사진을 변경하세요.</PanelSubtitle>
        <ProfileImageContainer>
          <LargeProfileImage
            src={userProfile.profileImage || defaultProfile}
            alt="프로필 사진"
          />
        </ProfileImageContainer>
        <ChangePhotoButton onClick={handleProfileImageChange} disabled={saving}>
          {saving ? '변경 중...' : '📷 사진 변경'}
        </ChangePhotoButton>
      </ProfilePanel>

      <InfoPanel>
        <InfoHeader>
          <PanelTitle>기본 정보</PanelTitle>
          <ActionButtons>
            <WithdrawButton onClick={handleWithdraw} disabled={saving}>
              {saving ? '처리 중...' : '탈퇴하기'}
            </WithdrawButton>
            <SaveButton onClick={handleSave} disabled={saving}>
              {saving ? '저장 중...' : '수정하기'}
            </SaveButton>
          </ActionButtons>
        </InfoHeader>
        <PanelSubtitle>개인 정보를 관리하세요.</PanelSubtitle>

        <InfoSection>
          <InfoLabel>
            <LabelIcon>👤</LabelIcon>
            닉네임
          </InfoLabel>
          <InputField
            value={userProfile.nickname}
            onChange={(e) => handleNicknameChange(e.target.value)}
            placeholder="닉네임을 입력하세요"
            disabled={saving}
          />
        </InfoSection>

        <InfoSection>
          <InfoLabel>
            <LabelIcon>📧</LabelIcon>
            이메일
            <CannotEditButton>수정불가</CannotEditButton>
          </InfoLabel>
          <InputField
            value={userProfile.email}
            disabled
            placeholder="이메일을 입력하세요"
          />
        </InfoSection>

        <InfoSection>
          <InfoLabel>
            <LabelIcon>🔒</LabelIcon>
            비밀번호 수정
          </InfoLabel>
          <ActionButton onClick={handlePasswordChange} disabled={saving}>
            비밀번호 수정하기
          </ActionButton>
        </InfoSection>

        <InfoSection>
          <InfoLabel>
            <LabelIcon>🌐</LabelIcon>
            소셜 연동 여부
          </InfoLabel>
          <GoogleButton onClick={handleGoogleLink} disabled={saving}>
            <GoogleIcon>G</GoogleIcon>
            Google 계정 연동
          </GoogleButton>
        </InfoSection>
      </InfoPanel>
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

// 스타일 컴포넌트
const ProfilePanel = styled.div`
  flex: 1;
  background-color: var(--color-bg-white);
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const InfoPanel = styled.div`
  flex: 2;
  background-color: var(--color-bg-white);
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const PanelTitle = styled.h2`
  font-family: 'NanumSquareB', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 8px;
`;

const PanelSubtitle = styled.p`
  font-family: 'NanumSquareR', sans-serif;
  font-size: 14px;
  color: var(--color-gray-600);
  margin-bottom: 24px;
`;

const ProfileImageContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
`;

const LargeProfileImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--color-primary);
`;

const ChangePhotoButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: var(--color-primary);
  color: var(--color-text-white);
  border: none;
  border-radius: 8px;
  font-family: 'NanumSquareR', sans-serif;
  font-size: 14px;
  font-weight: 600;
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

const InfoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
`;

const WithdrawButton = styled.button`
  padding: 8px 16px;
  background-color: var(--color-gray-500);
  color: var(--color-text-white);
  border: none;
  border-radius: 6px;
  font-family: 'NanumSquareR', sans-serif;
  font-size: 14px;
  font-weight: 600;
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

const SaveButton = styled.button`
  padding: 8px 16px;
  background-color: var(--color-primary);
  color: var(--color-text-white);
  border: none;
  border-radius: 6px;
  font-family: 'NanumSquareR', sans-serif;
  font-size: 14px;
  font-weight: 600;
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

const InfoSection = styled.div`
  margin-bottom: 24px;
`;

const InfoLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'NanumSquareR', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 8px;
`;

const LabelIcon = styled.span`
  font-size: 16px;
`;

const CannotEditButton = styled.span`
  margin-left: auto;
  padding: 4px 8px;
  background-color: var(--color-gray-200);
  color: var(--color-gray-600);
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
`;

const InputField = styled.input`
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

const ActionButton = styled.button`
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

const GoogleButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
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

const GoogleIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background-color: #4285f4;
  color: var(--color-text-white);
  border-radius: 50%;
  font-size: 12px;
  font-weight: bold;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  background-color: var(--color-bg-white);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const LoadingText = styled.p`
  font-family: 'NanumSquareR', sans-serif;
  font-size: 16px;
  color: var(--color-gray-600);
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  background-color: var(--color-bg-white);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ErrorText = styled.p`
  font-family: 'NanumSquareR', sans-serif;
  font-size: 16px;
  color: var(--color-red);
`;

export default ProfileTab;
