
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FiX, FiArrowRight, FiPlus } from 'react-icons/fi';

const JoinRoomModal = () => {
  return (
    <div css={overlayStyle}>
      <div css={modalStyle}>
        <div css={headerStyle}>
          <h2>방 참여하기</h2>
          <button css={closeButtonStyle}>
            <FiX size={20} />
          </button>
        </div>

        <p css={descriptionStyle}>초대코드를 입력해주세요.</p>

        <div css={codeInputContainerStyle}>
          {[9, 8, 9].map((digit, index) => (
            <div css={digitBoxStyle} key={index}>
              {digit}
            </div>
          ))}
          {Array.from({ length: 3 }).map((_, index) => (
            <div css={emptyBoxStyle} key={index} />
          ))}
        </div>

        <div css={buttonGroupStyle}>
          <button css={submitButtonStyle}>
            <FiArrowRight />
            인정하기
          </button>
          <button css={createButtonStyle}>
            <FiPlus />
            방 생성하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinRoomModal;

const overlayStyle = css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const modalStyle = css`
  width: 400px;
  background: white;
  border-radius: 20px;
  padding: 30px 32px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  position: relative;
`;

const headerStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  h2 {
    font-size: 20px;
    font-weight: bold;
  }
`;

const closeButtonStyle = css`
  background: none;
  border: none;
  cursor: pointer;
  color: #888;
`;

const descriptionStyle = css`
  font-size: 14px;
  color: #666;
  margin-bottom: 24px;
`;

const codeInputContainerStyle = css`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 32px;
`;

const digitBoxStyle = css`
  width: 32px;
  height: 2px;
  border-bottom: 2px solid #3182f6;
  font-size: 20px;
  text-align: center;
  line-height: 32px;
  font-weight: bold;
  color: #000;
`;

const emptyBoxStyle = css`
  width: 32px;
  height: 2px;
  border-bottom: 2px solid #ddd;
`;

const buttonGroupStyle = css`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const submitButtonStyle = css`
  background-color: #3182f6;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px;
  font-size: 15px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;

  &:hover {
    background-color: #1b6dec;
  }
`;

const createButtonStyle = css`
  background-color: white;
  color: #3182f6;
  border: 2px solid #3182f6;
  border-radius: 12px;
  padding: 12px;
  font-size: 15px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;

  &:hover {
    background-color: #f5f9ff;
  }
`;

