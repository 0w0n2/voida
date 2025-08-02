import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { getUserSettings, updateOverlay } from '../../apis/userApi';
import { useAuthStore } from '../../store/store';
import UpdateDoneModal from './UpdateDoneModal';

interface UserSettings {
  overlayPosition: string;
  overlayTransparency: number;
  liveFontSize: number;
  // 필요한 다른 설정들 추가 가능
}

const OverlayTab = () => {
  const { accessToken, user } = useAuthStore();
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showDoneModal, setShowDoneModal] = useState(false);

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
            overlayPosition: '0',
            overlayTransparency: 100,
            liveFontSize: 70,
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

  const handlePositionChange = async (position: number) => {
    if (userSettings) {
      setUserSettings({
        ...userSettings,
        overlayPosition: position.toString(),
      });

      // TODO: API 연동 시 주석 해제
      // try {
      //   setSaving(true);
      //   await updateOverlay(
      //     accessToken!,
      //     position.toString(),
      //     userSettings.overlayTransparency,
      //     userSettings.liveFontSize
      //   );
      //   console.log('오버레이 위치 설정 완료');
      // } catch (err) {
      //   console.error('오버레이 위치 설정 실패:', err);
      //   // 실패 시 원래 상태로 되돌리기
      //   setUserSettings({
      //     ...userSettings,
      //     overlayPosition: userSettings.overlayPosition,
      //   });
      // } finally {
      //   setSaving(false);
      // }

      // 임시 저장 시뮬레이션
      setSaving(true);
      setTimeout(() => {
        console.log('오버레이 위치 설정 완료');
        setSaving(false);
      }, 500);
    }
  };

  const handleFontSizeChange = async (size: number) => {
    if (userSettings) {
      setUserSettings({
        ...userSettings,
        liveFontSize: size,
      });

      // TODO: API 연동 시 주석 해제
      // try {
      //   setSaving(true);
      //   await updateOverlay(
      //     accessToken!,
      //     userSettings.overlayPosition,
      //     userSettings.overlayTransparency,
      //     size
      //   );
      //   console.log('폰트 크기 설정 완료');
      // } catch (err) {
      //   console.error('폰트 크기 설정 실패:', err);
      //   // 실패 시 원래 상태로 되돌리기
      //   setUserSettings({
      //     ...userSettings,
      //     liveFontSize: userSettings.liveFontSize,
      //   });
      // } finally {
      //   setSaving(false);
      // }

      // 임시 저장 시뮬레이션
      setSaving(true);
      setTimeout(() => {
        console.log('폰트 크기 설정 완료');
        setSaving(false);
      }, 500);
    }
  };

  const handleTransparencyChange = async (transparency: number) => {
    if (userSettings) {
      setUserSettings({
        ...userSettings,
        overlayTransparency: transparency,
      });

      // TODO: API 연동 시 주석 해제
      // try {
      //   setSaving(true);
      //   await updateOverlay(
      //     accessToken!,
      //     userSettings.overlayPosition,
      //     transparency,
      //     userSettings.liveFontSize
      //   );
      //   console.log('투명도 설정 완료');
      // } catch (err) {
      //   console.error('투명도 설정 실패:', err);
      //   // 실패 시 원래 상태로 되돌리기
      //   setUserSettings({
      //     ...userSettings,
      //     overlayTransparency: userSettings.overlayTransparency,
      //   });
      // } finally {
      //   setSaving(false);
      // }

      // 임시 저장 시뮬레이션
      setSaving(true);
      setTimeout(() => {
        console.log('투명도 설정 완료');
        setSaving(false);
      }, 500);
    }
  };

  // TODO: API 연동 시 구현
  const handleSave = async () => {
    try {
      setSaving(true);
      console.log('오버레이 설정 저장');

      // TODO: 오버레이 설정 업데이트 API 호출
      // await updateOverlay(accessToken!, userSettings);

      // 임시 시뮬레이션
      setTimeout(() => {
        console.log('오버레이 설정 저장 완료');
        setShowDoneModal(true);
        setSaving(false);
      }, 1000);
    } catch (err) {
      console.error('오버레이 설정 저장 실패:', err);
      setSaving(false);
    }
  };

  const handleCloseModal = () => {
    setShowDoneModal(false);
  };

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingText>오버레이 설정을 불러오는 중...</LoadingText>
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
        <ErrorText>오버레이 설정을 찾을 수 없습니다.</ErrorText>
      </ErrorContainer>
    );
  }

  return (
    <OverlayPanel>
      <OverlayHeader>
        <PanelTitle>오버레이 설정</PanelTitle>
        <SaveButton onClick={handleSave} disabled={saving}>
          {saving ? '저장 중...' : '저장하기'}
        </SaveButton>
      </OverlayHeader>
      <PanelSubtitle>
        실시간 게임 중 오버레이 화면을 커스텀 해보세요.
      </PanelSubtitle>

      <OverlaySection>
        <OverlaySectionTitle>위치</OverlaySectionTitle>
        <OverlaySectionDescription>
          게임 중 채팅과 엔점이 보일 위치를 지정할 수 있습니다.
        </OverlaySectionDescription>
        <PositionGrid>
          {[0, 1, 2, 3, 4, 5].map((position) => (
            <PositionBox
              key={position}
              selected={parseInt(userSettings.overlayPosition) === position}
              onClick={() => handlePositionChange(position)}
              disabled={saving}
            />
          ))}
        </PositionGrid>
      </OverlaySection>

      <OverlaySection>
        <OverlaySectionTitle>글자 크기</OverlaySectionTitle>
        <OverlaySectionDescription>
          게임 중 채팅의 글자 크기를 지정할 수 있습니다.
        </OverlaySectionDescription>
        <SliderContainer>
          <SliderLabel>가</SliderLabel>
          <Slider
            type="range"
            min="12"
            max="48"
            value={userSettings.liveFontSize}
            onChange={(e) => handleFontSizeChange(Number(e.target.value))}
            disabled={saving}
          />
          <SliderLabel style={{ fontSize: `${userSettings.liveFontSize}px` }}>
            가
          </SliderLabel>
        </SliderContainer>
      </OverlaySection>

      <OverlaySection>
        <OverlaySectionTitle>투명도</OverlaySectionTitle>
        <OverlaySectionDescription>
          게임 중 채팅의 투명도를 지정할 수 있습니다.
        </OverlaySectionDescription>
        <SliderContainer>
          <SliderLabel>0%</SliderLabel>
          <Slider
            type="range"
            min="0"
            max="100"
            value={userSettings.overlayTransparency}
            onChange={(e) => handleTransparencyChange(Number(e.target.value))}
            disabled={saving}
          />
          <SliderLabel>{userSettings.overlayTransparency}%</SliderLabel>
        </SliderContainer>
      </OverlaySection>

      <UpdateDoneModal
        isOpen={showDoneModal}
        onClose={handleCloseModal}
        userName={user?.nickname || '사용자'}
      />
    </OverlayPanel>
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

const OverlayPanel = styled.div`
  width: 100%;
  background-color: var(--color-bg-white);
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const OverlayHeader = styled.div`
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

  &:disabled {
    background-color: var(--color-gray-400);
    cursor: not-allowed;
  }
`;

const OverlaySection = styled.div`
  margin-bottom: 32px;
`;

const OverlaySectionTitle = styled.h3`
  font-family: 'NanumSquareB', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 4px;
`;

const OverlaySectionDescription = styled.p`
  font-family: 'NanumSquareR', sans-serif;
  font-size: 14px;
  color: var(--color-gray-600);
  margin-bottom: 16px;
`;

const PositionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  max-width: 300px;
`;

const PositionBox = styled.div<{ selected: boolean; disabled?: boolean }>`
  width: 80px;
  height: 60px;
  background-color: ${(props) =>
    props.selected ? 'var(--color-primary)' : 'var(--color-gray-100)'};
  border: 2px solid
    ${(props) =>
      props.selected ? 'var(--color-primary)' : 'var(--color-gray-200)'};
  border-radius: 8px;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.2s ease;
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};

  &:hover {
    border-color: ${(props) =>
      props.disabled ? 'var(--color-gray-200)' : 'var(--color-primary)'};
  }
`;

const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  max-width: 400px;
`;

const SliderLabel = styled.span`
  font-family: 'NanumSquareR', sans-serif;
  font-size: 14px;
  color: var(--color-text);
  min-width: 30px;
`;

const Slider = styled.input`
  flex: 1;
  height: 6px;
  background: linear-gradient(
    to right,
    var(--color-primary) 0%,
    var(--color-primary) 50%,
    var(--color-gray-200) 50%,
    var(--color-gray-200) 100%
  );
  border-radius: 3px;
  outline: none;
  -webkit-appearance: none;
  appearance: none;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    background: var(--color-primary);
    border-radius: 50%;
    cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  }

  &::-moz-range-thumb {
    width: 18px;
    height: 18px;
    background: var(--color-primary);
    border-radius: 50%;
    cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
    border: none;
  }
`;

export default OverlayTab;
