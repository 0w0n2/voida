/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useAuthStore } from '@/stores/authStore';
import defaultProfile from '../../assets/profiles/defaultProfile.png';

interface UpdateDoneModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UpdatePasswordDoneModal = ({ isOpen, onClose }: UpdateDoneModalProps) => {
  if (!isOpen) return null;

  const user = useAuthStore((state) => state.user);
  console.log(user);
  const userImage = user?.profileImage;
  const userNickname = user?.nickname;

  return (
    <div css={overlayStyle}>
      <div css={modalStyle}>
        <div css={profileImageContainer}>
          <div css={profileImagePlaceholder}>
            <img
              src={
                `${import.meta.env.VITE_CDN_URL}/${userImage}` || defaultProfile
              }
              alt="프로필 사진"
              css={largeProfileImageStyle}
            />
          </div>
        </div>

        <div css={messageContainer}>
          <h2 css={mainMessageStyle}>
            {userNickname}님 <br/>비밀번호 수정이 완료되었습니다.
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

export default UpdatePasswordDoneModal;

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
  backdrop-filter: blur(2px);
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
    background: var(--color-primary);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;

const largeProfileImageStyle = css`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
`;