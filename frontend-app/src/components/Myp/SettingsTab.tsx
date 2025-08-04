import React from 'react';
import styled from '@emotion/styled';

interface SettingsTabProps {
  speechEnabled: boolean;
  onSpeechToggle: (enabled: boolean) => void;
  onSave: () => void;
  onGuidebook: () => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({
  speechEnabled,
  onSpeechToggle,
  onSave,
  onGuidebook,
}) => {
  return (
    <SettingsPanel>
      <SettingsHeader>
        <PanelTitle>설정</PanelTitle>
        <SaveButton onClick={onSave}>저장하기</SaveButton>
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
            enabled={speechEnabled}
            onClick={() => onSpeechToggle(!speechEnabled)}
          >
            <ToggleSlider enabled={speechEnabled} />
          </ToggleSwitch>
        </SettingsItem>

        <SettingsItem>
          <SettingsItemLeft>
            <SettingsItemTitle>가이드 북 보기</SettingsItemTitle>
            <SettingsItemDescription>
              Volda의 AI가이드를 확인하세요.
            </SettingsItemDescription>
          </SettingsItemLeft>
          <GuidebookButton onClick={onGuidebook}>
            📖 가이드북 보기
          </GuidebookButton>
        </SettingsItem>
      </SettingsSection>
    </SettingsPanel>
  );
};

// 스타일 컴포넌트
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