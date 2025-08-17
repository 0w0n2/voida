/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useEffect } from 'react';
import { getUserSettings, updateGuideMode } from '@/apis/auth/userApi';
import { useAuthStore } from '@/stores/userStore';
import { useAlertStore } from '@/stores/useAlertStore';
import { useNavigate } from 'react-router-dom';
import guide from '@/assets/icons/mp-guide.png';

interface UserSettings {
  useLipTalkMode: boolean;
}

const SettingsTab = () => {
  const [userSpeech, setUserSpeech] = useState<UserSettings | null>(null);
  const [hasChanged, setHasChanged] = useState(false);
  const navigate = useNavigate();

  // 유저 설정 불러오기
  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        const res = await getUserSettings();
        const lipTalkMode = res.data.result.setting.lipTalkMode;
        setUserSpeech({ useLipTalkMode: lipTalkMode });
      } catch (err) {
        console.error('유저 설정 조회 실패:', err);
      }
    };

    fetchUserSettings();
  }, []);

  // 유저 구화 설정 토글
  const handleSpeechToggle = () => {
    setUserSpeech({
      useLipTalkMode: !userSpeech?.useLipTalkMode,
    });

    setHasChanged(true);
  };

  // 유저 설정 업데이트 API 호출
  const handleSave = async () => {
    try {
      await updateGuideMode(userSpeech?.useLipTalkMode ?? false);
      setHasChanged(false);
      useAlertStore
        .getState()
        .showAlert('유저 정보가 업데이트되었습니다.', 'top');
    } catch (err) {
      console.error('설정 저장 실패:', err);
    }
  };

  // const handleCloseModal = () => {
  //   setShowDoneModal(false);
  // };

  const handleGuidebook = () => {
    navigate('/tutorial');
  };

  return (
    <div css={settingsPanelStyle}>
      <div css={settingsHeaderStyle}>
        <h2 css={panelTitleStyle}>설정</h2>
        <button
          css={saveButtonStyle}
          onClick={handleSave}
          disabled={!hasChanged}
        >
          저장하기
        </button>
      </div>
      <p css={panelSubtitleStyle}>구화 및 음성 관련 설정을 관리하세요.</p>

      <div css={settingsSectionStyle}>
        <div css={horizontalContainerStyle}>
          <div css={settingsItemStyle}>
            <div css={settingsItemLeftStyle}>
              <h3 css={settingsItemTitleStyle}>구화 사용 여부</h3>
              <p css={settingsItemDescriptionStyle}>
                구화를 텍스트로 변환할 수 있습니다.
              </p>
            </div>
            <div
              css={toggleSwitchStyle(userSpeech?.useLipTalkMode ?? false)}
              onClick={handleSpeechToggle}
            >
              <div
                css={toggleSliderStyle(userSpeech?.useLipTalkMode ?? false)}
              />
            </div>
          </div>

          <div css={settingsItemStyle}>
            <div css={settingsItemLeftStyle}>
              <h3 css={settingsItemTitleStyle}>가이드 북 보기</h3>
              <p css={settingsItemDescriptionStyle}>
                Volda의 AI가이드를 확인하세요.
              </p>
            </div>
            <button css={guidebookButtonStyle} onClick={handleGuidebook}>
              <img src={guide} alt="guide" />
              가이드북 보기
            </button>
          </div>
        </div>
      </div>

      {/* <UpdateDoneModal
        isOpen={showDoneModal}
        onClose={handleCloseModal}
        userName={user?.nickname || '사용자'}
      /> */}
    </div>
  );
};

export default SettingsTab;

const settingsPanelStyle = css`
  width: 100%;
  background-color: var(--color-bg-white);
  border-radius: 12px;
  padding: 3%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 1024px) {
    padding: 2.5%;
  }

  @media (max-width: 768px) {
    padding: 20px;
  }

  @media (max-width: 480px) {
    padding: 15px;
  }
`;

const settingsHeaderStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const panelTitleStyle = css`
  font-family: 'NanumSquareEB';
  font-size: 22px;
  color: var(--color-text);
  margin-bottom: 10px;
  text-align: center;
`;

const panelSubtitleStyle = css`
  font-family: 'NanumSquareR', sans-serif;
  font-size: 16px;
  color: var(--color-gray-600);
  margin-bottom: 48px;
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

const settingsSectionStyle = css`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const horizontalContainerStyle = css`
  display: flex;
  gap: 3%;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
  }

  @media (max-width: 480px) {
    gap: 15px;
  }
`;

const settingsItemStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  // border-bottom: 1px solid var(--color-gray-200);
  flex: 1;
  border-radius: 12px;
  background-color: var(--color-gray-100);
  padding: 24px;
`;

const settingsItemLeftStyle = css`
  flex: 1;
  margin-left: 20px;
`;

const settingsItemTitleStyle = css`
  font-family: 'NanumSquareEB';
  font-size: 18px;
  color: var(--color-text);
  margin-bottom: 10px;
`;

const settingsItemDescriptionStyle = css`
  font-family: 'NanumSquareR', sans-serif;
  font-size: 15px;
  color: var(--color-gray-600);
`;

const toggleSwitchStyle = (enabled: boolean, disabled?: boolean) => css`
  width: 60px;
  height: 32px;
  margin-right: 40px;
  background-color: ${enabled
    ? 'var(--color-primary)'
    : 'var(--color-gray-200)'};
  border-radius: 20px;
  position: relative;
  cursor: ${disabled ? 'not-allowed' : 'pointer'};
  transition: background-color 0.25s ease, box-shadow 0.25s ease;
  opacity: ${disabled ? 0.6 : 1};

  &:hover {
    box-shadow: ${disabled
      ? 'none'
      : enabled
      ? '0 0 6px rgba(0, 150, 255, 0.5)'
      : '0 0 6px rgba(150, 150, 150, 0.5)'};
  }

  &:active {
    transform: scale(0.96);
  }
`;

const toggleSliderStyle = (enabled: boolean) => css`
  width: 28px;
  height: 28px;
  background-color: var(--color-bg-white);
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: ${enabled ? '28px' : '2px'};
  transition: left 0.25s cubic-bezier(0.4, 0, 0.2, 1), transform 0.15s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.9);
  }
`;

const guidebookButtonStyle = css`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  margin-right: 20px;
  background: linear-gradient(90deg, #6e8efb, #a777e3);
  color: var(--color-text-white);
  border: none;
  border-radius: 6px;
  font-family: 'NanumSquareR';
  font-size: 14px;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    background: linear-gradient(90deg, #5c7de5, #965fe0);
    transform: scale(1.05);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    font-family: 'NanumSquareB';
  }
`;
