/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useState, useEffect } from 'react';
import { getUserQuickSlots, updateQuickslots } from '../../apis/auth/userApi';
import { useAuthStore } from '../../stores/userStore';
import { useAlertStore } from '@/stores/useAlertStore';
import UpdateDoneModal from './UpdateDoneModal';

interface Shortcut {
  quickSlotId: number;
  message: string;
  hotkey: string;
  url: string;
}

const ShortcutsTab = () => {
  const { user } = useAuthStore();
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);
  const [hasChanged, setHasChanged] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showDoneModal, setShowDoneModal] = useState(false);
  const [quickSlotMessages, setQuickSlotMessages] = useState<string[]>([]);
  const [quickSlotHotkeys, setQuickSlotHotkeys] = useState<string[]>([]);
  const [quickSlotUrls, setQuickSlotUrls] = useState<string[]>([]);
  const [quickSlotIds, setQuickSlotIds] = useState<number[]>([]);

  // 유저 단축키 불러오기
  useEffect(() => {
    const fetchUserQuickSlots = async () => {
      try {
        const res = await getUserQuickSlots();
        console.log(res);

        // 단축키 배열 넣어주기
        const quickSlots = res.data.result.quickSlots;
        setShortcuts(quickSlots);
        setQuickSlotIds(quickSlots.map((slot: any) => slot.quickSlotId));
        setQuickSlotMessages(quickSlots.map((slot: any) => slot.message));
        setQuickSlotHotkeys(quickSlots.map((slot: any) => slot.hotkey));
        setQuickSlotUrls(quickSlots.map((slot: any) => slot.url));
      } catch (err) {
        console.error('유저 단축키 조회 실패:', err);
        setError('유저 단축키를 불러오는데 실패했습니다.');
      }
    };

    fetchUserQuickSlots();
  }, []);

  const handleShortcutChange = (index: number, value: string) => {
    const newMessages = [...quickSlotMessages];
    newMessages[index] = value;
    setQuickSlotMessages(newMessages);

    const newShortcuts = [...shortcuts];
    newShortcuts[index].message = value;
    setShortcuts(newShortcuts);

    setHasChanged(true);
  };

  // TODO: API 연동 시 구현
  const handleSave = async () => {
    try {
      await updateQuickslots(shortcuts);
      setShowDoneModal(true);
      console.log('단축키 저장 완료');
      console.log(shortcuts);
      setHasChanged(false);
      useAlertStore
        .getState()
        .showAlert('유저 정보가 업데이트되었습니다.', 'top');
    } catch (err) {
      console.error('단축키 저장 실패:', err);
    }
  };

  const handleCloseModal = () => {
    setShowDoneModal(false);
  };

  return (
    <div css={shortcutsPanelStyle}>
      <div css={shortcutsHeaderStyle}>
        <h2 css={panelTitleStyle}>단축키 설정</h2>
        <button
          css={saveButtonStyle}
          onClick={handleSave}
          disabled={!hasChanged}
        >
          저장하기
        </button>
      </div>
      <p css={panelSubtitleStyle}>
        실시간 게임 중 자주 사용하는 문구를 단축키로 등록하세요.
      </p>

      <div css={shortcutsGridStyle}>
        {shortcuts.map((shortcut, index) => (
          <div key={shortcut.quickSlotId} css={shortcutItemStyle}>
            <div css={keyContainerStyle}>
              <button css={backtickKeyStyle}>`</button>
              <span css={plusSignStyle}>+</span>
              <button css={numberKeyStyle}>{quickSlotHotkeys[index][1]}</button>
            </div>
            <input
              css={shortcutInputStyle}
              value={quickSlotMessages[index]}
              onChange={(e) => handleShortcutChange(index, e.target.value)}
              placeholder="단축키 문구를 입력하세요"
            />
          </div>
        ))}
      </div>

      {/* <UpdateDoneModal
        isOpen={showDoneModal}
        onClose={handleCloseModal}
        userName={user?.nickname || '사용자'}
      /> */}
    </div>
  );
};

export default ShortcutsTab;

const shortcutsPanelStyle = css`
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

const shortcutsHeaderStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const panelTitleStyle = css`
  font-family: 'NanumSquareB', sans-serif;
  font-size: 20px;
  font-weight: 900;
  color: var(--color-text);
  margin-bottom: 8px;

  @media (max-width: 768px) {
    font-size: 18px;
  }

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const panelSubtitleStyle = css`
  font-family: 'NanumSquareR', sans-serif;
  font-size: 14px;
  color: var(--color-gray-600);
  margin-bottom: 24px;

  @media (max-width: 768px) {
    font-size: 13px;
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    margin-bottom: 15px;
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

const shortcutsGridStyle = css`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  @media (max-width: 480px) {
    gap: 10px;
  }
`;

const shortcutItemStyle = css`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background-color: var(--color-gray-50);
  border-radius: 8px;
  border: 1px solid var(--color-gray-200);

  @media (max-width: 768px) {
    gap: 12px;
    padding: 12px;
  }

  @media (max-width: 480px) {
    gap: 8px;
    padding: 10px;
  }
`;

const keyContainerStyle = css`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

const backtickKeyStyle = css`
  width: 40px;
  height: 40px;
  background-color: var(--color-gray-600);
  color: var(--color-text-white);
  border: none;
  border-radius: 6px;
  font-family: 'NanumSquareR', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
`;

const plusSignStyle = css`
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 4px;
`;

const numberKeyStyle = css`
  width: 40px;
  height: 40px;
  background-color: var(--color-gray-600);
  color: var(--color-text-white);
  border: none;
  border-radius: 6px;
  font-family: 'NanumSquareR', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
`;

const shortcutInputStyle = css`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid var(--color-gray-300);
  border-radius: 6px;
  font-family: 'NanumSquareR', sans-serif;
  font-size: 14px;
  font-weight: 600;
  background-color: var(--color-bg-white);
  color: var(--color-text);
  min-height: 40px;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: var(--color-gray-400);
  }
`;
