import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { getUserSettings } from '../../apis/userApi';
import { useAuthStore } from '../../store/store';

interface UserSettings {
  speechEnabled: boolean;
  // 필요한 다른 설정들 추가 가능
}

const SettingsTab = () => {
  const { accessToken } = useAuthStore();
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 유저 설정 불러오기
  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        setLoading(true);

        // TODO: API 연동 시 주석 해제
        // const response = await getUserSettings(accessToken!);
        // setUserSettings(response.data);

        // 임시 데이터 사용 (퍼블리싱용)
        setTimeout(() => {
          setUserSettings({
            speechEnabled: false,
          });
          setError(null);
        }, 500);
      } catch (err) {
        console.error('유저 설정 조회 실패:', err);
        setError('유저 설정을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserSettings();
  }, [accessToken]);

  const handleSpeechToggle = (enabled: boolean) => {
    if (userSettings) {
      setUserSettings({
        ...userSettings,
        speechEnabled: enabled,
      });
    }
  };

  // TODO: API 연동 시 구현
  const handleSave = () => {
    console.log('설정 저장');
    // TODO: 유저 설정 업데이트 API 호출
  };

  // TODO: API 연동 시 구현
  const handleGuidebook = () => {
    console.log('가이드북 보기');
    // TODO: 가이드북 페이지로 이동 또는 모달 표시
  };

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingText>유저 설정을 불러오는 중...</LoadingText>
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

  if (!userSettings) {
    return (
      <ErrorContainer>
        <ErrorText>유저 설정을 찾을 수 없습니다.</ErrorText>
      </ErrorContainer>
    );
  }

  return (
    <SettingsPanel>
      <SettingsHeader>
        <PanelTitle>설정</PanelTitle>
        <SaveButton onClick={handleSave}>저장하기</SaveButton>
      </SettingsHeader>
      <PanelSubtitle>구화 및 음성 관련 설정을 관리하세요.</PanelSubtitle>

      <SettingsSection>
        <SettingsItem>
          <SettingsItemLeft>
            <SettingsItemTitle>구화 사용 여부</SettingsItemTitle>
            <SettingsItemDescription>
              구화를 텍스트로 변환할 수 있습니다.
            </SettingsItemDescription>
          </SettingsItemLeft>
          <ToggleSwitch
            enabled={userSettings.speechEnabled}
            onClick={() => handleSpeechToggle(!userSettings.speechEnabled)}
          >
            <ToggleSlider enabled={userSettings.speechEnabled} />
          </ToggleSwitch>
        </SettingsItem>

        <SettingsItem>
          <SettingsItemLeft>
            <SettingsItemTitle>가이드 북 보기</SettingsItemTitle>
            <SettingsItemDescription>
              Volda의 AI가이드를 확인하세요.
            </SettingsItemDescription>
          </SettingsItemLeft>
          <GuidebookButton onClick={handleGuidebook}>
            📖 가이드북 보기
          </GuidebookButton>
        </SettingsItem>
      </SettingsSection>
    </SettingsPanel>
  );
};

// 스타일 컴포넌트
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

const SettingsPanel = styled.div`
  width: 100%;
  background-color: var(--color-bg-white);
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const SettingsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
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

const SettingsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SettingsItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid var(--color-gray-200);
`;

const SettingsItemLeft = styled.div`
  flex: 1;
`;

const SettingsItemTitle = styled.h3`
  font-family: 'NanumSquareB', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 4px;
`;

const SettingsItemDescription = styled.p`
  font-family: 'NanumSquareR', sans-serif;
  font-size: 14px;
  color: var(--color-gray-600);
`;

const ToggleSwitch = styled.div<{ enabled: boolean }>`
  width: 50px;
  height: 24px;
  background-color: ${(props) =>
    props.enabled ? 'var(--color-primary)' : 'var(--color-gray-200)'};
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.2s ease;
`;

const ToggleSlider = styled.div<{ enabled: boolean }>`
  width: 20px;
  height: 20px;
  background-color: var(--color-bg-white);
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: ${(props) => (props.enabled ? '28px' : '2px')};
  transition: left 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const GuidebookButton = styled.button`
  padding: 8px 16px;
  background-color: var(--color-green);
  color: var(--color-text-white);
  border: none;
  border-radius: 6px;
  font-family: 'NanumSquareR', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #1e8a5a;
  }
`;

export default SettingsTab;
