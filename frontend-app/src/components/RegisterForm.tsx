/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';
import { AxiosError } from 'axios';
import {
  register,
  checkEmailDuplicate,
  checkNicknameDuplicate,
} from '@/apis/authApi';
import VoidaLogo from '@/assets/icon/voida-logo.png';
import defaultProfile from '@/assets/profiles/defaultProfile.png';
import EmailVerificationModal from './EmailVerificationModal';

const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  // 에러 관리 변수
  const [emailError, setEmailError] = useState('');
  const [nicknameError, setNicknameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordCheckError, setPasswordCheckError] = useState('');
  const [isPrivacyChecked, setIsPrivacyChecked] = useState(false);

  // 중복확인 상태
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 이메일 인증 상태
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  //
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setIsEmailChecked(false); // 이메일 변경 시 중복확인 상태 초기화
    setIsEmailVerified(false); // 이메일 변경 시 인증 상태 초기화

    if (!value.trim()) {
      setEmailError('이메일을 입력해주세요.');
    } else if (!/^[\w-.]+@[\w-]+\.[a-z]{2,}$/i.test(value)) {
      setEmailError('올바른 이메일 형식이 아닙니다.');
    } else {
      setEmailError('');
    }
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNickname(value);
    setIsNicknameChecked(false); // 닉네임 변경 시 중복확인 상태 초기화

    if (!value.trim()) {
      setNicknameError('닉네임을 입력해주세요.');
    } else if (value.length < 3 || value.length > 10) {
      setNicknameError('3자 이상 10자 이하로 입력해주세요.');
    } else {
      setNicknameError('');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    // 비밀번호가 변경되면 비밀번호 확인 필드도 다시 검증
    if (passwordCheck) {
      validatePasswordCheck(passwordCheck);
    }
  };

  const validatePassword = (value: string) => {
    // 8자 이상, 영문, 숫자, 특수문자 포함
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!regex.test(value)) {
      setPasswordError('최소 8자의 영문, 숫자, 특수문자를 입력해주세요.');
    } else {
      setPasswordError('');
    }
  };

  const validatePasswordCheck = (value: string) => {
    if (!value.trim()) {
      setPasswordCheckError('비밀번호 확인을 입력해주세요.');
    } else if (value !== password) {
      setPasswordCheckError('비밀번호가 일치하지 않습니다.');
    } else {
      setPasswordCheckError('');
    }
  };

  const handlePrivacyCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsPrivacyChecked(e.target.checked);
  };

  // 이메일 중복확인
  const handleEmailCheck = async () => {
    if (!email.trim()) {
      setEmailError('이메일을 입력해주세요.');
      return;
    }
    if (!/^[\w-.]+@[\w-]+\.[a-z]{2,}$/i.test(email)) {
      setEmailError('올바른 이메일 형식이 아닙니다.');
      return;
    }

    // try {
    //   const response = await checkEmailDuplicate(email);
    //   if (response.data.isAvailable) {
    //     setEmailError("");
    //     setIsEmailChecked(true);
    //     alert("사용 가능한 이메일입니다.");
    //   } else {
    //     setEmailError("이미 사용중인 이메일입니다.");
    //     setIsEmailChecked(false);
    //   }
    // } catch (error) {
    //   if (error instanceof AxiosError) {
    //     setEmailError(error.response?.data?.message || "중복확인 중 오류가 발생했습니다.");
    //   }
    //   setIsEmailChecked(false);
    // }
    setIsEmailChecked(true);
  };

  // 닉네임 중복확인
  // api 호출 부분
  const handleNicknameCheck = async () => {
    if (!nickname.trim()) {
      setNicknameError('닉네임을 입력해주세요.');
      return;
    }
    if (nickname.length < 3 || nickname.length > 10) {
      setNicknameError('3자 이상 10자 이하로 입력해주세요.');
      return;
    }

    try {
      const response = await checkNicknameDuplicate(nickname);
      if (response.data.isAvailable) {
        setNicknameError('');
        setIsNicknameChecked(true);
        alert('사용 가능한 닉네임입니다.');
      } else {
        setNicknameError('이미 사용중인 닉네임입니다.');
        setIsNicknameChecked(false);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        setNicknameError(
          error.response?.data?.message || '중복확인 중 오류가 발생했습니다.'
        );
      }
      setIsNicknameChecked(false);
    }
  };

  // 이메일 인증 모달 열기
  const handleEmailVerification = () => {
    if (!isEmailChecked) {
      alert('먼저 이메일 중복확인을 해주세요.');
      return;
    }
    setIsVerificationModalOpen(true);
  };

  // 이메일 인증 성공 처리
  const handleVerificationSuccess = () => {
    setIsEmailVerified(true);
    alert('이메일 인증이 완료되었습니다!');
  };

  // 회원가입 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 모든 필수 필드 검증
    if (
      !email.trim() ||
      !password.trim() ||
      !passwordCheck.trim() ||
      !nickname.trim()
    ) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }

    if (!isEmailChecked) {
      alert('이메일 중복확인을 해주세요.');
      return;
    }

    if (!isEmailVerified) {
      alert('이메일 인증을 완료해주세요.');
      return;
    }

    if (!isNicknameChecked) {
      alert('닉네임 중복확인을 해주세요.');
      return;
    }

    if (!isPrivacyChecked) {
      alert('개인정보 수집 및 이용동의에 체크해주세요.');
      return;
    }

    if (password !== passwordCheck) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await register(email, password);
      alert('회원가입이 완료되었습니다!');
      // TODO: 로그인 페이지로 이동
      // navigate('/login');
    } catch (error) {
      if (error instanceof AxiosError) {
        alert(
          error.response?.data?.message || '회원가입 중 오류가 발생했습니다.'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  //////////////////////////////////////////////////////
  //////////////////////////////////////////////////////
  return (
    <>
      <form css={formStyle} onSubmit={handleSubmit}>
        <div>
          <div css={logoStyle}>
            <img src={VoidaLogo} alt="Voida Logo" css={logoStyle} />
          </div>
          <div css={profileImageWrapperStyle}>
            <label htmlFor="profile-upload">
              <img
                src={defaultProfile}
                alt="기본 프로필"
                css={profileImageStyle}
              />
              {/* 추후 이미지 변경 기능을 위해 input 추가 */}
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                // onChange={handleProfileChange} // 추후 구현
              />
            </label>
          </div>

          <div css={inputRowStyle}>
            <label htmlFor="email" css={labelStyle}>
              이메일 주소 <span css={requiredStyle}>*</span>
            </label>
            <div css={inputWithButtonStyle}>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                css={[inputStyle, emailError && errorInputStyle]}
                required
              />
              <button
                type="button"
                onClick={handleEmailCheck}
                css={[checkButtonStyle, isEmailChecked && checkedButtonStyle]}
                disabled={!email.trim() || !!emailError}
              >
                {isEmailChecked ? '확인완료' : '중복확인'}
              </button>
              <button
                type="button"
                onClick={handleEmailVerification}
                css={[checkButtonStyle, isEmailVerified && verifiedButtonStyle]}
                disabled={!isEmailChecked || !!emailError}
              >
                {isEmailVerified ? '인증완료' : '인증'}
              </button>
            </div>
            {emailError && <span css={errorMsgStyle}>{emailError}</span>}
          </div>
          <div css={inputRowStyle}>
            <label css={labelStyle}>Voida 닉네임</label>
            <div css={inputWithButtonStyle}>
              <input
                type="text"
                value={nickname}
                onChange={handleNicknameChange}
                css={[inputStyle, nicknameError && errorInputStyle]}
                required
              />
              <button
                type="button"
                onClick={handleNicknameCheck}
                css={[
                  checkButtonStyle,
                  isNicknameChecked && checkedButtonStyle,
                ]}
                disabled={!nickname.trim() || !!nicknameError}
              >
                {isNicknameChecked ? '확인완료' : '중복확인'}
              </button>
            </div>
            {nicknameError && <span css={errorMsgStyle}>{nicknameError}</span>}
          </div>
          <div css={inputRowStyle}>
            <label css={labelStyle}>
              비밀번호 <span css={requiredStyle}>*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                handlePasswordChange(e);
                validatePassword(e.target.value);
              }}
              css={[inputStyle, passwordError && errorInputStyle]}
              required
            />
            {passwordError && <span css={errorMsgStyle}>{passwordError}</span>}
          </div>
          <div css={inputRowStyle}>
            <label css={labelStyle}>
              비밀번호 확인 <span css={requiredStyle}>*</span>
            </label>
            <input
              type="password"
              value={passwordCheck}
              onChange={(e) => {
                setPasswordCheck(e.target.value);
                validatePasswordCheck(e.target.value);
              }}
              css={[inputStyle, passwordCheckError && errorInputStyle]}
              required
            />
            {passwordCheckError && (
              <span css={errorMsgStyle}>{passwordCheckError}</span>
            )}
          </div>
          <div css={checkboxWrapperStyle}>
            <input
              type="checkbox"
              id="privacy-agree"
              checked={isPrivacyChecked}
              onChange={handlePrivacyCheck}
              required
            />
            <label htmlFor="privacy-agree">
              [필수] 개인정보 수집 및 이용동의
            </label>
          </div>
          <div css={bottomRowStyle}>
            <span css={checkIdStyle}>이미 계정이 있으신가요?&nbsp;</span>
            <a href="/login" css={loginLinkStyle}>
              로그인
            </a>
            <button
              type="submit"
              css={submitButtonStyle}
              disabled={isSubmitting}
            >
              {isSubmitting ? '처리중...' : '회원가입'}
            </button>
          </div>
        </div>
      </form>

      <EmailVerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        email={email}
        onVerificationSuccess={handleVerificationSuccess}
      />
    </>
  );
};
export default RegisterForm;

const formStyle = css`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  width: 480px;
  height: 730px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const logoStyle = css`
  width: 120px;
  margin: 0.5rem auto 0.5rem;
`;

const labelStyle = css`
  font-size: 15px;
  margin-bottom: 6px;
  color: #222;
  font-family: 'NanumSquareR';
  margin-left: 0.5rem;
`;

const requiredStyle = css`
  color: #ff3b3b;
  font-size: 15px;
`;

const inputRowStyle = css`
  display: flex;
  flex-direction: column;
  margin-bottom: 18px;
`;

const inputStyle = css`
  height: 44px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 0 14px;
  font-size: 15px;
  background: #fafbfc;
  outline: none;
  &:focus {
    border-color: #4a90e2;
    background: #fff;
  }
`;

const profileImageWrapperStyle = css`
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
`;

const profileImageStyle = css`
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
  border: 2px solid #e0e0e0;
  background: #f5f5f5;
`;

const checkboxWrapperStyle = css`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
  color: #666;
  gap: 8px;
`;

const bottomRowStyle = css`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 8px;
  gap: 8px;
`;

const checkIdStyle = css`
  font-size: 14px;
  line-height: 1.4;
  display: inline-block;
`;
const loginLinkStyle = css`
  color: #1976d2;
  text-decoration: none;
  font-weight: 500;
  &:hover {
    text-decoration: underline;
  }
  line-height: 1.5;
`;
const submitButtonStyle = css`
  margin-left: auto;
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #1565c0;
  }
`;

const errorInputStyle = css`
  border: 2px solid #ff3b3b !important;
  background: #fff0f0;
`;

const errorMsgStyle = css`
  color: #ff3b3b;
  font-size: 13px;
  margin-top: 4px;
  margin-left: 2px;
  min-height: 18px;
  display: block;
`;

const inputWithButtonStyle = css`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const checkButtonStyle = css`
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 13px;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: #1565c0;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const checkedButtonStyle = css`
  background: #4caf50 !important;

  &:hover {
    background: #45a049 !important;
  }
`;

const verifiedButtonStyle = css`
  background: #2196f3 !important;

  &:hover {
    background: #1976d2 !important;
  }
`;
