/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ArrowRight, Plus } from 'lucide-react';
import CreateRoomModal from '@/components/main/modal/CreateRoom';
import { verifyInviteCode } from '@/apis/meeting-room/meetingRoomApi';

interface JoinRoomModalProps {
  onClose: () => void;
}

const JoinRoomModal = ({ onClose }: JoinRoomModalProps) => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [codeValues, setCodeValues] = useState<string[]>(Array(9).fill(''));
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleInput = (e: React.FormEvent<HTMLInputElement>, index: number) => {
    const input = e.currentTarget;
    const value = input.value.toUpperCase();
    input.value = value;

    setCodeValues((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });

    if (value.length === 1 && index < 8) {
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
      const res = await verifyInviteCode(inviteCode);

      if (!res.isSuccess) {
        alert('유효하지 않은 초대코드입니다.');
        return;
      }

      onClose();
      navigate('/main');
    } catch (error) {
      console.error('초대코드 검증 실패:', error);
      alert('유효하지 않은 초대코드입니다.');
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
  font-size: 24px;
  border: none;
  background: transparent;
  cursor: pointer;
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
