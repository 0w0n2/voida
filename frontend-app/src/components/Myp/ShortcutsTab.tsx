/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useState, useEffect } from 'react';
import { getUserQuickSlots, updateQuickslots } from '../../apis/userApi';
import { useAuthStore } from '../../store/store';
import UpdateDoneModal from './UpdateDoneModal';

interface Shortcut {
  quickSlotId: number;
  message: string;
  hotkey: string;
  url: string;
}

const ShortcutsTab = () => {
  const { accessToken, user } = useAuthStore();
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showDoneModal, setShowDoneModal] = useState(false);

  // 유저 단축키 불러오기
  useEffect(() => {
    const fetchUserQuickSlots = async () => {
      try {
        setLoading(true);

        // TODO: API 연동 시 주석 해제
        // const response = await getUserQuickSlots(accessToken!);
        // setShortcuts(response.data);

        // 임시 데이터 사용 (퍼블리싱용)
        setTimeout(() => {
          setShortcuts([
            { quickSlotId: 1, hotkey: '`+ 1', message: '안녕하세요.', url: '' },
            { quickSlotId: 2, hotkey: '`+ 2', message: '감사합니다.', url: '' },
            {
              quickSlotId: 3,
              hotkey: '`+ 3',
              message: '도움이 필요합니다.',
              url: '',
            },
            { quickSlotId: 4, hotkey: '`+ 4', message: '죄송합니다.', url: '' },
            {
              quickSlotId: 5,
              hotkey: '`+ 5',
              message: '잠시만 기다려주세요.',
              url: '',
            },
            {
              quickSlotId: 6,
              hotkey: '`+ 6',
              message: '좋은 하루 되세요.',
              url: '',
            },
          ]);
          setError(null);
        }, 500);
      } catch (err) {
        console.error('유저 단축키 조회 실패:', err);
        setError('유저 단축키를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserQuickSlots();
  }, [accessToken]);

  const handleShortcutChange = (index: number, value: string) => {
    const newShortcuts = [...shortcuts];
    newShortcuts[index].message = value;
    setShortcuts(newShortcuts);
  };

  // TODO: API 연동 시 구현
  const handleSave = async () => {
    try {
      setSaving(true);
      console.log('단축키 저장 시작');

      // TODO: API 연동 시 주석 해제
      // await updateQuickslots(accessToken!, shortcuts);
      // console.log('단축키 저장 완료');

      // 임시 저장 시뮬레이션
      setTimeout(() => {
        console.log('단축키 저장 완료');
        setShowDoneModal(true);
        setSaving(false);
      }, 1000);
    } catch (err) {
      console.error('단축키 저장 실패:', err);
      setSaving(false);
    }
  };

  const handleCloseModal = () => {
    setShowDoneModal(false);
  };

  if (loading) {
    return (
      <div css={loadingContainerStyle}>
        <p css={loadingTextStyle}>유저 단축키를 불러오는 중...</p>
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

  if (!shortcuts.length) {
    return (
      <div css={errorContainerStyle}>
        <p css={errorTextStyle}>단축키를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div css={shortcutsPanelStyle}>
      <div css={shortcutsHeaderStyle}>
        <h2 css={panelTitleStyle}>단축키 설정</h2>
        <button css={saveButtonStyle} onClick={handleSave} disabled={saving}>
          {saving ? '저장 중...' : '저장하기'}
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
              <button css={numberKeyStyle}>
                {shortcut.hotkey.split('+')[1].trim()}
              </button>
            </div>
            <input
              css={shortcutInputStyle}
              value={shortcut.message}
              onChange={(e) => handleShortcutChange(index, e.target.value)}
              placeholder="단축키 문구를 입력하세요"
            />
          </div>
        ))}
      </div>

      <UpdateDoneModal
        isOpen={showDoneModal}
        onClose={handleCloseModal}
        userName={user?.nickname || '사용자'}
      />
    </div>
  );
};

export default ShortcutsTab;

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
  margin-bottom: 8px;
`;

const panelTitleStyle = css`
  font-family: 'NanumSquareB', sans-serif;
  font-size: 20px;
  font-weight: 900;
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
  height: 40px;
  color: var(--color-text-white);
  border: none;
  border-radius: 6px;
  font-family: 'NanumSquareR', sans-serif;
  font-size: 14px;
  font-weight: 300;
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
`;

const shortcutItemStyle = css`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background-color: var(--color-gray-50);
  border-radius: 8px;
  border: 1px solid var(--color-gray-200);
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

  &:hover {
    background-color: var(--color-gray-700);
  }
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

  &:hover {
    background-color: var(--color-gray-700);
  }
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
