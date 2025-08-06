/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm }: DeleteConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div css={overlayStyle}>
      <div css={modalStyle}>
        <h2 css={mainMessageStyle}>정말 삭제하시겠습니까?</h2>
        <p css={subMessageStyle}>삭제 후에는 되돌릴 수 없습니다.</p>
        <div css={buttonRow}>
          <button css={cancelButtonStyle} onClick={onClose}>취소</button>
          <button css={confirmButtonStyle} onClick={onConfirm}>삭제하기</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;

const overlayStyle = css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const modalStyle = css`
  background: white;
  border-radius: 16px;
  padding: 40px 30px;
  width: 400px;
  max-width: 90vw;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const mainMessageStyle = css`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
`;

const subMessageStyle = css`
  font-size: 14px;
  color: var(--color-gray-600);
  margin-bottom: 24px;
`;

const buttonRow = css`
  display: flex;
  justify-content: space-around;
  gap: 16px;
`;

const cancelButtonStyle = css`
  padding: 10px 20px;
  border: none;
  background: var(--color-gray-200);
  color: var(--color-gray-700);
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: var(--color-gray-300);
  }
`;

const confirmButtonStyle = css`
  padding: 10px 20px;
  border: none;
  background: var(--color-red);
  color: white;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #c0392b;
  }
`;
