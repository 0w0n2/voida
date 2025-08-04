import React from 'react';
import styled from '@emotion/styled';

interface Shortcut {
  key: string;
  text: string;
}

interface ShortcutsTabProps {
  shortcuts: Shortcut[];
  onShortcutChange: (index: number, value: string) => void;
  onSave: () => void;
}

const ShortcutsTab: React.FC<ShortcutsTabProps> = ({
  shortcuts,
  onShortcutChange,
  onSave,
}) => {
  return (
    <ShortcutsPanel>
      <ShortcutsHeader>
        <PanelTitle>단축키 설정</PanelTitle>
        <SaveButton onClick={onSave}>저장하기</SaveButton>
      </ShortcutsHeader>
      <PanelSubtitle>
        실시간 게임 중 자주 사용하는 문구를 단축키로 등록하세요.
      </PanelSubtitle>

      <ShortcutsGrid>
        {shortcuts.map((shortcut, index) => (
          <ShortcutItem key={index}>
            <ShortcutKey>{shortcut.key}</ShortcutKey>
            <ShortcutInput
              value={shortcut.text}
              onChange={(e) => onShortcutChange(index, e.target.value)}
              placeholder="단축키 문구를 입력하세요"
            />
          </ShortcutItem>
        ))}
      </ShortcutsGrid>
    </ShortcutsPanel>
  );
};

// 스타일 컴포넌트
const ShortcutsPanel = styled.div`
  width: 100%;
  background-color: var(--color-bg-white);
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ShortcutsHeader = styled.div`
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

const ShortcutsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

const ShortcutItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ShortcutKey = styled.button`
  padding: 8px 12px;
  background-color: var(--color-gray-600);
  color: var(--color-text-white);
  border: none;
  border-radius: 6px;
  font-family: 'NanumSquareR', sans-serif;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  min-width: 60px;
`;

const ShortcutInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid var(--color-gray-300);
  border-radius: 6px;
  font-family: 'NanumSquareR', sans-serif;
  font-size: 14px;
  background-color: var(--color-bg-white);
  color: var(--color-text);

  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
`;

export default ShortcutsTab; 