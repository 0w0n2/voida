/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useState, useEffect } from 'react';
import { getUserSettings, updateGuideMode } from '../../apis/auth/userApi';
import { useAuthStore } from '../../store/store';
import { useNavigate } from 'react-router-dom';
import UpdateDoneModal from './UpdateDoneModal';
import guide from '@/assets/icons/mp-guide.png';

interface UserSettings {
  useLipTalkMode: boolean; // API 스펙에 맞게 변경
  // 필요한 다른 설정들 추가 가능
}

const SettingsTab = () => {
  const { accessToken, user } = useAuthStore();
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showDoneModal, setShowDoneModal] = useState(false);
  const navigate = useNavigate();

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
            useLipTalkMode: false,
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

  const handleSpeechToggle = async (enabled: boolean) => {
    if (userSettings) {
      setUserSettings({
        ...userSettings,
        useLipTalkMode: enabled,
      });

      // TODO: API 연동 시 주석 해제
      // try {
      //   setSaving(true);
      //   await updateGuideMode(accessToken!, enabled);
      //   console.log('구화 모드 설정 완료');
      // } catch (err) {
      //   console.error('구화 모드 설정 실패:', err);
      //   // 실패 시 원래 상태로 되돌리기
      //   setUserSettings({
      //     ...userSettings,
      //     useLipTalkMode: !enabled,
      //   });
      // } finally {
      //   setSaving(false);
      // }

      // 임시 저장 시뮬레이션
      setSaving(true);
      setTimeout(() => {
        console.log('구화 모드 설정 완료');
        setSaving(false);
      }, 500);
    }
  };

  // TODO: API 연동 시 구현
  const handleSave = async () => {
    try {
      setSaving(true);
      console.log('설정 저장');

      // TODO: 유저 설정 업데이트 API 호출
      // await updateGuideMode(accessToken!, userSettings);

      // 임시 시뮬레이션
      setTimeout(() => {
        console.log('설정 저장 완료');
        setShowDoneModal(true);
        setSaving(false);
      }, 1000);
    } catch (err) {
      console.error('설정 저장 실패:', err);
      setSaving(false);
    }
  };

  const handleCloseModal = () => {
    setShowDoneModal(false);
  };

  // TODO: API 연동 시 구현
  const handleGuidebook = () => {
    navigate('/tutorial');
  };

  if (loading) {
    return (
      <div css={loadingContainerStyle}>
        <p css={loadingTextStyle}>유저 설정을 불러오는 중...</p>
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
        <p css={errorTextStyle}>유저 설정을 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div css={settingsPanelStyle}>
      <div css={settingsHeaderStyle}>
        <h2 css={panelTitleStyle}>설정</h2>
        <button css={saveButtonStyle} onClick={handleSave} disabled={saving}>
          {saving ? '저장 중...' : '저장하기'}
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
              css={toggleSwitchStyle(userSettings.useLipTalkMode, saving)}
              onClick={() =>
                !saving && handleSpeechToggle(!userSettings.useLipTalkMode)
              }
            >
              <div css={toggleSliderStyle(userSettings.useLipTalkMode)} />
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

      <UpdateDoneModal
        isOpen={showDoneModal}
        onClose={handleCloseModal}
        userName={user?.nickname || '사용자'}
      />
    </div>
  );
};

export default SettingsTab;

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

const settingsPanelStyle = css`
  width: 100%;
  background-color: var(--color-bg-white);
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const settingsHeaderStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const panelTitleStyle = css`
  font-family: 'NanumSquareB', sans-serif;
  font-size: 20px;
  font-weight: 800;
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
  gap: 40px;
  width: 100%;
`;

const settingsItemStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid var(--color-gray-200);
  flex: 1;
`;

const settingsItemLeftStyle = css`
  flex: 1;
`;

const settingsItemTitleStyle = css`
  font-family: 'NanumSquareB', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 4px;
`;

const settingsItemDescriptionStyle = css`
  font-family: 'NanumSquareR', sans-serif;
  font-size: 14px;
  color: var(--color-gray-600);
`;

const toggleSwitchStyle = (enabled: boolean, disabled?: boolean) => css`
  width: 50px;
  height: 24px;
  margin-right: 80px;
  background-color: ${enabled
    ? 'var(--color-primary)'
    : 'var(--color-gray-200)'};
  border-radius: 12px;
  position: relative;
  cursor: ${disabled ? 'not-allowed' : 'pointer'};
  transition: background-color 0.2s ease;
  opacity: ${disabled ? 0.6 : 1};
`;

const toggleSliderStyle = (enabled: boolean) => css`
  width: 20px;
  height: 20px;
  background-color: var(--color-bg-white);
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: ${enabled ? '28px' : '2px'};
  transition: left 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const guidebookButtonStyle = css`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  background: linear-gradient(90deg, #6e8efb, #a777e3);
  color: var(--color-text-white);
  border: none;
  border-radius: 6px;
  font-family: 'NanumSquareR', sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #1e8a5a;
  }
`;
