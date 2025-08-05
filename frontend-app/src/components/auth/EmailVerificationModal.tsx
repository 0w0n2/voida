/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useEffect } from 'react';
import { AxiosError } from 'axios';
import { sendEmailVerification, verifyEmailCode } from '@/apis/auth/authApi';
import mailIcon from '@/assets/icons/mail.png';

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onVerificationSuccess: () => void;
}

const EmailVerificationModal = ({
  isOpen,
  onClose,
  email,
  onVerificationSuccess,
}: EmailVerificationModalProps) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);

  // 모달이 열릴 때 인증 코드 자동 발송
  useEffect(() => {
    if (isOpen && email) {
      sendVerificationCode();
    }
  }, [isOpen, email]);

  // 인증 코드 발송
  const sendVerificationCode = async () => {
    setIsLoading(true);
    setError('');
    setVerificationCode('');
    try {
      console.log(email);
      const res = await sendEmailVerification(email.trim());
      console.log(res)
      setCountdown(180); // 3분 카운트다운
      alert('인증 코드가 이메일로 발송되었습니다.');
    } catch (error) {
      if (error instanceof AxiosError) {
        setError(
          error.response?.data?.message || '인증 코드 발송에 실패했습니다.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 인증 코드 확인
  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      setError('인증 코드를 입력해주세요.');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      console.log(email, verificationCode);
      const res = await verifyEmailCode(email, verificationCode);
      console.log(res);
      const verified = res.data.result.verified;
      console.log(verified);
      if (verified) {
      alert('이메일 인증이 완료되었습니다!');
      onVerificationSuccess();
      onClose();
    } else {
      setError('인증 코드가 올바르지 않습니다.');
      setVerificationCode(''); 
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      setError(
        error.response?.data?.message || '오류가 발생하였습니다. 다시 시도해주세요.'
      );
    }
    } finally {
      setIsLoading(false);
    }
  };

  // 재발송
  const handleResend = async () => {
    if (countdown > 0) return;

    setIsResending(true);
    try {
      await sendVerificationCode();
    } finally {
      setIsResending(false);
    }
  };

  // 카운트다운 효과
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  if (!isOpen) return null;

  return (
    <div css={overlayStyle}>
      <div css={modalStyle}>
        <button
          type="button"
          onClick={onClose}
          css={closeButtonStyle}
          aria-label="닫기"
        >
          ✕
        </button>
        <h2 css={titleStyle}>이메일 인증</h2>
        <p css={instructionStyle}>
          인증번호를 입력하고, 본인 인증을 완료해주세요.
        </p>

        <div css={inputContainerStyle}>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="인증번호"
            css={inputStyle}
            maxLength={6}
          />
          <button
            type="button"
            onClick={handleResend}
            disabled={countdown > 0 || isResending}
            css={[resendButtonStyle, countdown > 0 && disabledButtonStyle]}
          >
            {countdown > 0
              ? `재요청 (${Math.floor(countdown / 60)}:${(countdown % 60)
                  .toString()
                  .padStart(2, '0')})`
              : isResending
              ? '발송중...'
              : '재요청'}
          </button>
        </div>

        {error && <p css={errorStyle}>{error}</p>}

        <button
          type="button"
          onClick={handleVerifyCode}
          disabled={isLoading || !verificationCode.trim()}
          css={[
            verifyButtonStyle,
            (isLoading || !verificationCode.trim()) && disabledButtonStyle,
          ]}
        >
          <img src={mailIcon} alt="메일" css={iconStyle} />
          이메일 인증하기
        </button>
      </div>
    </div>
  );
};

export default EmailVerificationModal;

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
  margin: 0 0 12px 0;
  color: var(--color-text);
  letter-spacing: -0.5px;
`;

const instructionStyle = css`
  text-align: center;
  color: var(--color-gray-500);
  margin: 0 0 32px 0;
  font-size: 15px;
  line-height: 1.6;
  font-family: 'NanumSquareR', sans-serif;
  font-weight: 400;
`;

const inputContainerStyle = css`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  align-items: center;
`;

const inputStyle = css`
  flex: 1;
  height: 48px;
  border: 1px solid var(--color-gray-200);
  border-radius: 12px;
  padding: 0 16px;
  font-size: 16px;
  font-family: 'NanumSquareR', sans-serif;
  outline: none;
  background: var(--color-gray-100);
  transition: all 0.2s ease;

  &::placeholder {
    color: var(--color-gray-400);
    font-weight: 400;
  }

  &:focus {
    border-color: var(--color-primary);
    background: white;
    box-shadow: 0 0 0 3px rgba(49, 130, 246, 0.1);
  }
`;

const resendButtonStyle = css`
  background: var(--color-primary);
  color: var(--color-text-white);
  border: none;
  border-radius: 12px;
  padding: 0 20px;
  height: 48px;
  font-size: 16px;
  font-family: 'NanumSquareB', sans-serif;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
  min-width: 80px;

  &:hover:not(:disabled) {
    background: var(--color-primary-dark);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(49, 130, 246, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const verifyButtonStyle = css`
  width: 200px;
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

const iconStyle = css`
  width: 18px;
  height: 18px;
  display: inline-block;
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
