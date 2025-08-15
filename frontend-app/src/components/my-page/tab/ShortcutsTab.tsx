/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useEffect } from 'react';
import { getUserQuickSlots, updateQuickslots } from '@/apis/auth/userApi';
import { useAuthStore } from '@/stores/authStore';
import { useAlertStore } from '@/stores/useAlertStore';
interface Shortcut {
  quickSlotId: number;
  message: string;
  hotkey: string;
  url: string;
}

const ShortcutsTab = () => {
  const { user } = useAuthStore();
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);
  const [saving, setSaving] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);
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
      }
    };

    fetchUserQuickSlots();
  }, []);

  const handleShortcutChange = (index: number, value: string) => {
    const newMessages = [...quickSlotMessages];
    newMessages[index] = value;
    setQuickSlotMessages(newMessages);
    setHasChanged(true);

    const newShortcuts = [...shortcuts];
    newShortcuts[index].message = value;
    setShortcuts(newShortcuts);
  };

  const handleSave = async () => {
    try {
      await updateQuickslots(shortcuts);
      console.log('단축키 저장 완료');
      console.log(shortcuts);
      useAlertStore
        .getState()
        .showAlert('유저 정보가 업데이트되었습니다.', 'top');
      setHasChanged(false);
    } catch (err) {
      console.error('단축키 저장 실패:', err);
    }
  };

  // const handleCloseModal = () => {
  //   setShowDoneModal(false);
  // };

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
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const shortcutsHeaderStyle = css`
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

const shortcutsGridStyle = css`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
`;

const shortcutItemStyle = css`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  flex: 1;
  border-radius: 12px;
  background-color: var(--color-gray-100);
  padding: 30px;
`;

const keyContainerStyle = css`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

const backtickKeyStyle = css`
  width: 50px;
  height: 50px;
  background-color: var(--color-gray-600);
  color: var(--color-text-white);
  border: none;
  border-radius: 6px;
  font-family: 'NanumSquareR', sans-serif;
  font-size: 26px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
`;

const plusSignStyle = css`
  font-size: 26px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 4px;
`;

const numberKeyStyle = css`
  width: 50px;
  height: 50px;
  background-color: var(--color-gray-600);
  color: var(--color-text-white);
  border: none;
  border-radius: 6px;
  font-family: 'NanumSquareR', sans-serif;
  font-size: 22px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
`;

const shortcutInputStyle = css`
  flex: 1;
  padding: 12px 16px;
  margin-left: 16px;
  border: none;
  border-radius: 6px;
  font-family: 'NanumSquareEB', sans-serif;
  font-size: 18px;
  background-color: var(--color-gray-100);
  color: var(--color-text);
  min-height: 40px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    background-color: var(--color-bg-white);
    box-shadow: 0 0 0 1px rgba(156, 163, 175, 0.3);
  }

  &:hover {
    background-color: var(--color-gray-200);
  }

  &::placeholder {
    color: var(--color-gray-400);
    font-family: 'NanumSquareR';
    font-size: 16px;
  }
`;
