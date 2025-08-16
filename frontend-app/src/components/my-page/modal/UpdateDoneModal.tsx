/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

interface UpdateDoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
}

const UpdateDoneModal = ({
  isOpen,
  onClose,
  userName = '사용자',
}: UpdateDoneModalProps) => {
  if (!isOpen) return null;

  return (
    <div css={overlayStyle}>
      <div css={modalStyle}>
        <div css={profileImageContainer}>
          <div css={profileImagePlaceholder}>
          </div>
        </div>

        <div css={messageContainer}>
          <h2 css={mainMessageStyle}>
            {userName}님 회원정보 수정이 완료되었습니다.
          </h2>
          <p css={subMessageStyle}>Voida 에서 많은 사람들과 소통해보세요!</p>
        </div>

        <button type="button" onClick={onClose} css={confirmButtonStyle}>
          확인하기
        </button>
      </div>
    </div>
    
  );
};

export default UpdateDoneModal;

const overlayStyle = css`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const modalStyle = css`
  background: white;
  border-radius: 20px;
  padding: 50px 40px;
  width: 500px;
  max-width: 90vw;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const profileImageContainer = css`
  margin-bottom: 24px;
`;

const profileImagePlaceholder = css`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid var(--color-gray-100);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const messageContainer = css`
  text-align: center;
  margin-bottom: 32px;
`;

const mainMessageStyle = css`
  font-size: 20px;
  font-family: 'NanumSquareEB', sans-serif;
  font-weight: 800;
  color: var(--color-text);
  margin: 0 0 8px 0;
  line-height: 1.4;
`;

const subMessageStyle = css`
  font-size: 14px;
  font-family: 'NanumSquareR', sans-serif;
  color: var(--color-gray-500);
  margin: 0;
  line-height: 1.4;
`;

const confirmButtonStyle = css`
  width: 120px;
  height: 44px;
  background: var(--color-gray-200);
  color: var(--color-gray-700);
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-family: 'NanumSquareB', sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    background: var(--color-gray-300);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;
