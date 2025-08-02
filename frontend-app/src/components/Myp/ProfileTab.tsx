import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import defaultProfile from '../../assets/profiles/defaultProfile.png';
import { getUser } from '../../apis/userApi';
import { useAuthStore } from '../../store/store';

interface UserProfile {
  nickname: string;
  email: string;
  profileImage?: string;
}

const ProfileTab = () => {
  const { accessToken } = useAuthStore();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 유저 정보 불러오기
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

  const handleNicknameChange = (newNickname: string) => {
    if (userProfile) {
      setUserProfile({
        ...userProfile,
        nickname: newNickname,
      });
    }
  };

  // TODO: API 연동 시 구현
  const handleProfileImageChange = () => {
    console.log('프로필 이미지 변경');
    // TODO: 이미지 업로드 API 호출
  };

  // TODO: API 연동 시 구현
  const handlePasswordChange = () => {
    console.log('비밀번호 변경');
    // TODO: 비밀번호 변경 모달 또는 페이지로 이동
  };

  // TODO: API 연동 시 구현
  const handleGoogleLink = () => {
    console.log('Google 계정 연동');
    // TODO: Google OAuth 연동
  };

  // TODO: API 연동 시 구현
  const handleSave = () => {
    console.log('정보 저장');
    // TODO: 유저 정보 업데이트 API 호출
  };

  // TODO: API 연동 시 구현
  const handleWithdraw = () => {
    console.log('탈퇴하기');
    // TODO: 회원탈퇴 확인 모달 및 API 호출
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
        <ChangePhotoButton onClick={handleProfileImageChange}>
          📷 사진 변경
        </ChangePhotoButton>
      </ProfilePanel>

      <InfoPanel>
        <InfoHeader>
          <PanelTitle>기본 정보</PanelTitle>
          <ActionButtons>
            <WithdrawButton onClick={handleWithdraw}>탈퇴하기</WithdrawButton>
            <SaveButton onClick={handleSave}>수정하기</SaveButton>
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
          <ActionButton onClick={handlePasswordChange}>
            비밀번호 수정하기
          </ActionButton>
        </InfoSection>

        <InfoSection>
          <InfoLabel>
            <LabelIcon>🌐</LabelIcon>
            소셜 연동 여부
          </InfoLabel>
          <GoogleButton onClick={handleGoogleLink}>
            <GoogleIcon>G</GoogleIcon>
            Google 계정 연동
          </GoogleButton>
        </InfoSection>
      </InfoPanel>
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
