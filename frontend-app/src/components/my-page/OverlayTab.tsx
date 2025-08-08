/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useState, useEffect } from 'react';
import { getUserSettings, updateOverlay } from '../../apis/auth/userApi';
import { useAuthStore } from '../../stores/store';
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
      //   console.log('글자 크기 설정 완료');
      // } catch (err) {
      //   console.error('글자 크기 설정 실패:', err);
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
        console.log('글자 크기 설정 완료');
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
      console.log('오버레이 설정 저장 시작');

      // TODO: API 연동 시 주석 해제
      // await updateOverlay(
      //   accessToken!,
      //   userSettings.overlayPosition,
      //   userSettings.overlayTransparency,
      //   userSettings.liveFontSize
      // );
      // console.log('오버레이 설정 저장 완료');

      // 임시 저장 시뮬레이션
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
      <div css={loadingContainerStyle}>
        <p css={loadingTextStyle}>오버레이 설정을 불러오는 중...</p>
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

  if (!userSettings) {
    return (
      <div css={errorContainerStyle}>
        <p css={errorTextStyle}>오버레이 설정을 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div css={overlayPanelStyle}>
      <div css={overlayHeaderStyle}>
        <h2 css={panelTitleStyle}>오버레이 설정</h2>
        <button css={saveButtonStyle} onClick={handleSave} disabled={saving}>
          {saving ? '저장 중...' : '저장하기'}
        </button>
      </div>
      <p css={panelSubtitleStyle}>
        실시간 게임 중 오버레이 화면을 커스텀 해보세요.
      </p>

      <div css={overlayContentStyle}>
        <div css={leftSectionStyle}>
          <div css={overlaySectionStyle}>
            <h3 css={overlaySectionTitleStyle}>위치</h3>
            <p css={overlaySectionDescriptionStyle}>
              게임 중 채팅과 엔점이 보일 위치를 지정할 수 있습니다.
            </p>
            <div css={positionGridStyle}>
              {[0, 1, 2, 3, 4, 5].map((position) => (
                <div
                  key={position}
                  css={positionBoxStyle(
                    parseInt(userSettings.overlayPosition) === position,
                    saving,
                  )}
                  onClick={() => !saving && handlePositionChange(position)}
                />
              ))}
            </div>
          </div>
        </div>

        <div css={rightSectionStyle}>
          <div css={overlaySectionStyle}>
            <h3 css={overlaySectionTitleStyle}>글자 크기</h3>
            <p css={overlaySectionDescriptionStyle}>
              게임 중 채팅의 글자 크기를 지정할 수 있습니다.
            </p>
            <div css={sliderContainerStyle}>
              <span css={sliderLabelStyle}>가</span>
              <input
                css={sliderStyle}
                type="range"
                min="12"
                max="48"
                value={userSettings.liveFontSize}
                onChange={(e) => handleFontSizeChange(Number(e.target.value))}
                disabled={saving}
              />
              <span
                css={sliderLabelStyle}
                style={{ fontSize: `${userSettings.liveFontSize}px` }}
              >
                가
              </span>
            </div>
          </div>

          <div css={overlaySectionStyle}>
            <h3 css={overlaySectionTitleStyle}>투명도</h3>
            <p css={overlaySectionDescriptionStyle}>
              게임 중 채팅의 투명도를 지정할 수 있습니다.
            </p>
            <div css={sliderContainerStyle}>
              <span css={sliderLabelStyle}>0%</span>
              <input
                css={sliderStyle}
                type="range"
                min="0"
                max="100"
                value={userSettings.overlayTransparency}
                onChange={(e) =>
                  handleTransparencyChange(Number(e.target.value))
                }
                disabled={saving}
              />
              <span css={sliderLabelStyle}>
                {userSettings.overlayTransparency}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <UpdateDoneModal
        isOpen={showDoneModal}
        onClose={handleCloseModal}
        userName={user?.nickname || '사용자'}
      />
    </div>
  );
};

export default OverlayTab;

// CSS 스타일
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

const overlayPanelStyle = css`
  width: 100%;
  background-color: var(--color-bg-white);
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const overlayHeaderStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const panelTitleStyle = css`
  font-family: 'NanumSquareB', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 8px;
`;

const panelSubtitleStyle = css`
  font-family: 'NanumSquareR', sans-serif;
  font-size: 14px;
  color: var(--color-gray-600);
  margin-bottom: 24px;
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
    background-color: var(--color-gray-400);
    cursor: not-allowed;
  }
`;

const overlayContentStyle = css`
  display: flex;
  gap: 40px;
  max-width: 800px;
  margin-top: 20px;
`;

const leftSectionStyle = css`
  flex: 1;
`;

const rightSectionStyle = css`
  flex: 1;
`;

const overlaySectionStyle = css`
  margin-bottom: 40px;
`;

const overlaySectionTitleStyle = css`
  font-family: 'NanumSquareB', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 8px;
`;

const overlaySectionDescriptionStyle = css`
  font-family: 'NanumSquareR', sans-serif;
  font-size: 14px;
  color: var(--color-gray-600);
  margin-bottom: 20px;
`;

const positionGridStyle = css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  max-width: 320px;
`;

const positionBoxStyle = (selected: boolean, disabled?: boolean) => css`
  width: 90px;
  height: 70px;
  background-color: ${selected
    ? 'var(--color-primary)'
    : 'var(--color-gray-100)'};
  border: 2px solid
    ${selected ? 'var(--color-primary)' : 'var(--color-gray-200)'};
  border-radius: 8px;
  cursor: ${disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  opacity: ${disabled ? 0.6 : 1};

  &:hover {
    border-color: ${disabled
      ? 'var(--color-gray-200)'
      : 'var(--color-primary)'};
  }
`;

const sliderContainerStyle = css`
  display: flex;
  align-items: center;
  gap: 20px;
  max-width: 450px;
`;

const sliderLabelStyle = css`
  font-family: 'NanumSquareR', sans-serif;
  font-size: 14px;
  color: var(--color-text);
  min-width: 40px;
  text-align: center;
`;

const sliderStyle = css`
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
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 18px;
    height: 18px;
    background: var(--color-primary);
    border-radius: 50%;
    cursor: pointer;
    border: none;
  }
`;
