/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';
import { checkCurrentPassword, updatePassword } from '@/apis/auth/userApi';

interface UpdatePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPasswordUpdateSuccess: () => void;
}

const UpdatePasswordModal = ({
  isOpen,
  onClose,
  onPasswordUpdateSuccess,
}: UpdatePasswordModalProps) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const accessToken = localStorage.getItem('accessToken');

  // 개별 필드 에러 상태
  const [currentPasswordError, setCurrentPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // 비밀번호 수정 성공 시 모달
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // 비밀번호 유효성 검사 함수
  const validatePassword = (password: string) => {
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasMinLength = password.length >= 8;

    if (!hasMinLength) return '최소 8자 이상이어야 합니다.';
    if (!hasLetter || !hasNumber || !hasSpecial)
      return '영문, 숫자, 특수문자를 포함해야 합니다.';
    return '';
  };

  // 현재 비밀번호 변경 핸들러
  const handleCurrentPasswordChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    setCurrentPassword(value);
    setCurrentPasswordError('');
  };

  // 현재 비밀번호 유효성 검사 핸들러
  // const isSameCurrentPassword = async () => {
  //   try {
  //     const res = await checkCurrentPassword(accessToken!, currentPassword);
  //     const isMatched = res.data.isMatched;
  //     if (isMatched) {
  //       setCurrentPasswordError('');
  //     }else{
  //       setCurrentPasswordError('현재 비밀번호가 일치하지 않습니다.');
  //     }
  //   } catch {
  //     setCurrentPasswordError('오류가 발생하였습니다');
  //   }
  // };

  // 새 비밀번호 변경 핸들러
  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);

    // 새 비밀번호 유효성 검사
    const passwordError = validatePassword(value);
    setNewPasswordError(passwordError);

    // 확인 비밀번호 재검사
    if (confirmPassword && value !== confirmPassword) {
      setConfirmPasswordError('일치하지 않습니다.');
    } else if (confirmPassword) {
      setConfirmPasswordError('');
    }
  };

  // 확인 비밀번호 변경 핸들러
  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    setConfirmPassword(value);

    if (newPassword && value !== newPassword) {
      setConfirmPasswordError('일치하지 않습니다.');
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleUpdatePassword = async () => {
    // 입력값 검증
    if (!currentPassword.trim()) {
      setCurrentPasswordError('현재 비밀번호를 입력해주세요.');
      return;
    }

    if (!newPassword.trim()) {
      setNewPasswordError('새 비밀번호를 입력해주세요.');
      return;
    }

    if (!confirmPassword.trim()) {
      setConfirmPasswordError('비밀번호 확인을 입력해주세요.');
      return;
    }

    // 개별 필드 에러 확인
    if (currentPasswordError || newPasswordError || confirmPasswordError) {
      return;
    }

    if (currentPassword === newPassword) {
      setNewPasswordError('새 비밀번호는 현재 비밀번호와 달라야 합니다.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // TODO: API 연동 시 주석 해제
      // await updatePassword(accessToken!, {
      //   currentPassword,
      //   newPassword,
      // });
      // console.log('비밀번호 변경 완료');

      // 임시 시뮬레이션
      setTimeout(() => {
        setIsSuccessModalOpen(true);
        onPasswordUpdateSuccess();
        onClose();
        // 폼 초기화
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setCurrentPasswordError('');
        setNewPasswordError('');
        setConfirmPasswordError('');
      }, 1000);
    } catch (err) {
      setCurrentPasswordError('현재 비밀번호가 일치하지 않습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setCurrentPasswordError('');
    setNewPasswordError('');
    setConfirmPasswordError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div css={overlayStyle}>
      <div css={modalStyle}>
        <button
          type="button"
          onClick={handleClose}
          css={closeButtonStyle}
          aria-label="닫기"
        >
          ✕
        </button>
        <h2 css={titleStyle}>비밀번호 수정</h2>

        <div css={inputContainerStyle}>
          <div css={inputGroupStyle}>
            <label css={labelStyle}>현재 비밀번호</label>
            <div css={inputWrapperStyle}>
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={handleCurrentPasswordChange}
                // onBlur={isSameCurrentPassword}
                css={[inputStyle, !!currentPasswordError && inputErrorStyle]}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                css={eyeButtonStyle}
                disabled={isLoading}
              >
                {showCurrentPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {currentPasswordError && (
              <p css={fieldErrorStyle}>{currentPasswordError}</p>
            )}
          </div>
        </div>

        <div css={inputContainerStyle}>
          <div css={inputGroupStyle}>
            <label css={labelStyle}>변경 비밀번호</label>
            <div css={inputWrapperStyle}>
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={handleNewPasswordChange}
                css={[inputStyle, !!newPasswordError && inputErrorStyle]}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                css={eyeButtonStyle}
                disabled={isLoading}
              >
                {showNewPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {newPasswordError && (
              <p css={fieldErrorStyle}>{newPasswordError}</p>
            )}
          </div>
        </div>

        <div css={inputContainerStyle}>
          <div css={inputGroupStyle}>
            <label css={labelStyle}>변경 비밀번호 확인</label>
            <div css={inputWrapperStyle}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                css={[inputStyle, !!confirmPasswordError && inputErrorStyle]}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                css={eyeButtonStyle}
                disabled={isLoading}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {confirmPasswordError && (
              <p css={fieldErrorStyle}>{confirmPasswordError}</p>
            )}
          </div>
        </div>

        {error && <p css={errorStyle}>{error}</p>}

        <button
          type="button"
          onClick={handleUpdatePassword}
          disabled={
            isLoading ||
            !currentPassword.trim() ||
            !newPassword.trim() ||
            !confirmPassword.trim() ||
            !!currentPasswordError ||
            !!newPasswordError ||
            !!confirmPasswordError
          }
          css={[
            updateButtonStyle,
            (isLoading ||
              !currentPassword.trim() ||
              !newPassword.trim() ||
              !confirmPassword.trim() ||
              !!currentPasswordError ||
              !!newPasswordError ||
              !!confirmPasswordError) &&
              disabledButtonStyle,
          ]}
        >
          {isLoading ? '변경 중...' : '수정하기'}
        </button>
      </div>
      {/* 비밀번호 수정 성공 시 모달 */}
      {/* <UpdatePasswordDoneModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        // userName={user?.nickname}
      /> */}
    </div>
  );
};

export default UpdatePasswordModal;

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
`;

const closeButtonStyle = css`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  background: var(--color-gray-100);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  color: var(--color-gray-500);
  font-weight: bold;
  transition: all 0.2s ease;
  z-index: 10;

  &:hover {
    background: var(--color-gray-200);
    color: var(--color-text);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const titleStyle = css`
  font-size: 28px;
  font-family: 'NanumSquareEB', sans-serif;
  font-weight: 800;
  text-align: center;
  margin: 0 0 32px 0;
  color: var(--color-text);
  letter-spacing: -0.5px;
`;

const inputContainerStyle = css`
  margin-bottom: 20px;
`;

const inputGroupStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
  margin: 0 auto;
`;

const labelStyle = css`
  display: block;
  font-family: 'NanumSquareB', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 8px;
  text-align: left;
  width: 100%;
`;

const inputWrapperStyle = css`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const inputStyle = css`
  width: 300px;
  height: 40px;
  border: 1px solid var(--color-gray-200);
  border-radius: 8px;
  padding: 0 40px 0 12px;
  font-size: 14px;
  font-family: 'NanumSquareR', sans-serif;
  outline: none;
  background: var(--color-gray-100);
  transition: all 0.2s ease;

  &:focus {
    border-color: var(--color-primary);
    background: white;
    box-shadow: 0 0 0 3px rgba(49, 130, 246, 0.1);
  }

  &:disabled {
    background: var(--color-gray-200);
    color: var(--color-gray-500);
    cursor: not-allowed;
  }
`;

const eyeButtonStyle = css`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: var(--color-gray-500);
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: var(--color-gray-200);
    color: var(--color-text);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const updateButtonStyle = css`
  width: 100px;
  height: 40px;
  margin: 24px auto 0;
  background: var(--color-primary);
  color: var(--color-text-white);
  border: none;
  border-radius: 16px;
  padding: 16px 20px;
  font-size: 16px;
  font-family: 'NanumSquareB', sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover:not(:disabled) {
    background: var(--color-primary-dark);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(49, 130, 246, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const disabledButtonStyle = css`
  background: var(--color-gray-300) !important;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;

  &:hover {
    background: var(--color-gray-300) !important;
    transform: none !important;
    box-shadow: none !important;
  }
`;

const errorStyle = css`
  color: var(--color-red);
  font-size: 14px;
  text-align: center;
  margin: 12px 0;
  font-family: 'NanumSquareR', sans-serif;
  font-weight: 500;
  background: #fef2f2;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #fecaca;
`;

const fieldErrorStyle = css`
  color: var(--color-red);
  font-size: 12px;
  margin-top: 4px;
  text-align: right;
  width: 100%;
  font-family: 'NanumSquareR', sans-serif;
  font-weight: 500;
  min-height: 18px;
`;

const inputErrorStyle = css`
  border-color: var(--color-red);
  background: #fef2f2;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
`;
