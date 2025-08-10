/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useRef, useState } from 'react';
import { X, ArrowRight, Plus } from 'lucide-react';
import CreateRoomModal from '@/components/main/modal/CreateRoom';
import { verifyInviteCode } from '@/apis/meeting-room/meetingRoomApi';
import { useAlertStore } from '@/stores/useAlertStore';

interface JoinRoomModalProps {
  onClose: () => void;
}

const JoinRoomModal = ({ onClose }: JoinRoomModalProps) => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [codeValues, setCodeValues] = useState<string[]>(Array(9).fill(''));
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const sanitize = (s: string) => s.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 9);

   const fillFrom = (start: number, raw: string) => {
    const chars = sanitize(raw).split('');
    if (chars.length === 0) return;

    setCodeValues((prev) => {
      const updated = [...prev];
      let idx = start;

      for (const ch of chars) {
        if (idx > 8) break;
        updated[idx] = ch;
        const el = inputsRef.current[idx];
        if (el) el.value = ch; 
        idx++;
      }

      if (idx <= 8) {
        inputsRef.current[idx]?.focus();
      } else {
        inputsRef.current[8]?.blur();
      }
      return updated;
    });
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text');
    fillFrom(index, text);
  };

  const handleInput = (e: React.FormEvent<HTMLInputElement>, index: number) => {
    const input = e.currentTarget;
    const value = input.value;

    if (value.length > 1) {
      fillFrom(index, value);
      return;
    }

    const upper = sanitize(value);
    input.value = upper;

    setCodeValues((prev) => {
      const updated = [...prev];
      updated[index] = upper;
      return updated;
    });

    if (upper.length === 1 && index < 8) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      const input = e.currentTarget;
      if (input.value === '') {
        if (index > 0) {
          const prevInput = inputsRef.current[index - 1];
          if (prevInput) {
            prevInput.value = '';
            prevInput.focus();
            setCodeValues((prev) => {
              const updated = [...prev];
              updated[index - 1] = '';
              return updated;
            });
          }
        }
      } else {
        setCodeValues((prev) => {
          const updated = [...prev];
          updated[index] = '';
          return updated;
        });
      }
    }
  };

  const isCodeComplete = codeValues.every((v) => v.trim() !== '');

  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };

  const handleEnter = async () => {
    const inviteCode = codeValues.join('');

    try {
      await verifyInviteCode(inviteCode);
      useAlertStore.getState().showAlert('방 입장에 성공했습니다!', 'top');
      setTimeout(() => { window.location.reload() }, 500);
    } catch (error) {
      console.error('초대코드 검증 실패:', error);
      useAlertStore.getState().showAlert('유효하지 않은 초대코드입니다.', 'top');
    }
  };

  return (
    <div css={overlay}>
      <div css={modal}>
        <button css={closeButton} onClick={onClose}>
          <X size={24} />
        </button>

        <div css={headerRow}>
          <h2>방 참여하기</h2>
        </div>

        <p css={desc}>초대코드를 입력해주세요.</p>

         <div css={codeContainer}>
          {Array.from({ length: 9 }).map((_, i) => (
            <input
              key={i}
              maxLength={1}
              css={codeBox}
              type="text"
              onInput={(e) => handleInput(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              onPaste={(e) => handlePaste(e, i)}
              ref={(el: HTMLInputElement | null) => {
                inputsRef.current[i] = el;
              }}
            />
          ))}
        </div>

        <button
          css={[joinButtonStyle, !isCodeComplete && disabledStyle]}
          disabled={!isCodeComplete}
          onClick={handleEnter}
        >
          <ArrowRight size={30} />방 입장하기
        </button>

        <button css={createLinkButtonStyle} onClick={handleCreate}>
          <Plus size={30} />방 생성하기
        </button>

        {isCreateModalOpen && <CreateRoomModal onClose={() => setIsCreateModalOpen(false)} />}
      </div>
    </div>
  );
};

export default JoinRoomModal;

const overlay = css`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const modal = css`
  background: white;
  border-radius: 20px;
  padding: 40px;
  width: 600px;
  max-height: 90%;
  overflow-y: auto;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const closeButton = css`
  position: absolute;
  top: 20px;
  right: 20px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #888;
  transition: color 0.2s ease;
  &:hover {
    color: #000;
  }
`;

const headerRow = css`
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'NanumSquareEB';
`;

const desc = css`
  font-size: 16px;
  color: var(--color-gray-500);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const codeContainer = css`
  display: flex;
  gap: 10px;
  justify-content: center;
`;

const codeBox = css`
  width: 50px;
  height: 60px;
  text-align: center;
  font-size: 24px;
  border: 1px solid #ccc;
  border-radius: 8px;
  text-transform: uppercase;
`;

const joinButtonStyle = css`
  padding: 12px 30px;
  margin-top: 20px;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-family: 'NanumSquareB';
  background: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  align-self: center;
  width: auto;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: var(--color-primary-dark);
  }
`;

const disabledStyle = css`
  background: var(--color-gray-100) !important;
  color: var(--color-text) !important;
  cursor: not-allowed !important;
`;

const createLinkButtonStyle = css`
  padding: 12px 30px;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-family: 'NanumSquareB';
  cursor: pointer;
  background: var(--color-gray-100);
  color: var(--color-text);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  align-self: center;
  width: auto;

  &:hover {
    background: var(--color-gray-200);
  }
`;
