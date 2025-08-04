/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';
import { FiX, FiCheck, FiCopy } from 'react-icons/fi';

const CodeCheck = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('98942 8802');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div css={modalOverlay}>
      <div css={modalContainer}>
        {/* 모달 헤더 */}
        <div css={modalHeader}>
          <h2 css={modalTitle}>코드 확인하기</h2>
          <button css={closeButton} onClick={handleClose}>
            <FiX />
          </button>
        </div>

        {/* 코드 표시 영역 */}
        <div css={codeDisplayContainer}>
          <div css={codeBox}>
            <div css={codeLabel}>초대코드</div>
            <div css={codeValue}>98942 8802</div>
            <button css={copyButton} onClick={handleCopy}>
              <FiCopy />
            </button>
          </div>
        </div>

        {/* 안내 텍스트 */}
        <div css={infoContainer}>
          <div css={mainText}>방 초대코드를 전송해보세요!</div>

          <div css={infoList}>
            <div css={infoItem}>
              <FiCheck css={checkIcon} />
              <span>
                초대코드는 방 생성 후 <span css={highlightText}>24시간</span>{' '}
                내까지 유효합니다.
              </span>
            </div>
            <div css={infoItem}>
              <FiCheck css={checkIcon} />
              <span>초대코드는 방 설정에서 다시 확인 가능합니다.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeCheck;

const modalOverlay = css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;

const modalContainer = css`
  background: var(--color-bg-white);
  border-radius: 16px;
  padding: 24px;
  width: 90%;
  max-width: 480px;
  min-height: 400px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
`;

const modalHeader = css`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;
  position: relative;
`;

const modalTitle = css`
  font-family: 'NanumSquareB', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
  text-align: center;
`;

const closeButton = css`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-gray-500);
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--color-gray-100);
    color: var(--color-text);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const codeDisplayContainer = css`
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 150px;
`;

const codeBox = css`
  background-color: var(--color-gray-100);
  border-radius: 12px;
  padding: 20px;
  width: 100%;
  max-width: 300px;
  position: relative;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const codeLabel = css`
  font-family: 'NanumSquareR', sans-serif;
  font-size: 12px;
  color: var(--color-gray-500);
  margin-bottom: 8px;
  font-weight: 500;
`;

const codeValue = css`
  font-family: 'NanumSquareB', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: 2px;
  margin-bottom: 8px;
`;

const copyButton = css`
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-gray-500);
  padding: 6px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--color-gray-200);
    color: var(--color-text);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const infoContainer = css`
  text-align: center;
`;

const mainText = css`
  font-family: 'NanumSquareB', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 16px;
  text-align: center;
`;

const infoList = css`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  width: 100%;
`;

const infoItem = css`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-family: 'NanumSquareR', sans-serif;
  font-size: 14px;
  color: var(--color-text);
  text-align: left;
  line-height: 1.4;
  justify-content: flex-start;
  max-width: 350px;
  width: 100%;
`;

const checkIcon = css`
  width: 16px;
  height: 16px;
  color: var(--color-text);
  margin-top: 2px;
  flex-shrink: 0;
  min-width: 16px;
`;

const highlightText = css`
  font-family: 'NanumSquareB', sans-serif;
  color: var(--color-primary);
  font-weight: 600;
`;
