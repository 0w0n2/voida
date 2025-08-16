/** @jsxImportSource @emotion/react */
import React, { useEffect } from 'react';
import { css } from '@emotion/react';
import { deleteUser } from '@/apis/auth/userApi';
import { useAuthStore } from '@/stores/userStore';
import defaultProfile from '@/assets/profiles/defaultProfile.png';

interface GetOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName?: string;
  userImage?: string;
}

const GetOutModal = ({
  isOpen,
  onClose,
  onConfirm,
  userName = '사용자',
  userImage,
}: GetOutModalProps) => {
  if (!isOpen) return null;
  return (
    <div data-modal-root css={overlayStyle} onClick={onClose}>
      <div css={modalStyle} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={onClose}
          css={closeButtonStyle}
          aria-label="닫기"
        >
          ✕
        </button>
        <div css={profileImageContainer}>
          <div css={profileImagePlaceholder}>
            <img
              src={
                userImage
                  ? userImage.startsWith('blob:')
                    ? userImage
                    : `${import.meta.env.VITE_CDN_URL}/${userImage.replace(
                        /^\/+/,
                        '',
                      )}`
                  : defaultProfile
              }
              alt="프로필 사진"
              css={largeProfileImageStyle}
            />
          </div>
        </div>

        <div css={messageContainer}>
          <p css={mainMessageStyle}>{userName}님 계정을 탈퇴하시겠습니까?</p>
          <p css={subMessageStyle}>탈퇴하실 경우 모든 기록은 삭제됩니다.</p>
        </div>

        <button css={confirmButtonStyle} onClick={onConfirm}>
          탈퇴하기
        </button>
      </div>
    </div>
  );
};

const overlayStyle = css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const modalStyle = css`
  background: white;
  border-radius: 10px;
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
  font-weight: 500;
  color: var(--color-gray-600);
  margin: 0;
  line-height: 1.4;
`;

const confirmButtonStyle = css`
  padding: 12px 32px;
  background-color: var(--color-red);
  color: var(--color-text-white);
  border: none;
  border-radius: 10px;
  font-family: 'NanumSquareB', sans-serif;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #dc2626;
  }
`;

const closeButtonStyle = css`
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: var(--color-gray-200);
  color: var(--color-gray-600);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--color-gray-300);
  }
`;

const largeProfileImageStyle = css`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
`;

export default GetOutModal;
