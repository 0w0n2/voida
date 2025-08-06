/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import {
  register,
  checkEmailDuplicate,
  checkNicknameDuplicate,
} from '@/apis/auth/authApi';
import VoidaLogo from '@/assets/logo/voida-logo.png';
import defaultProfile from '@/assets/profiles/defaultProfile.png';
import EmailVerificationModal from './EmailVerificationModal';
import { getRandomNickname } from '@/apis/auth/authApi';
import IsRegisteredModal from './IsRegisteredModal';
import {
  useSearchParams,
  useNavigate,
  useLocation,
  Link,
} from 'react-router-dom';

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

  // 회원가입 완료 상태
  const [isRegistered, setIsRegistered] = useState(false);

  // 프로필 이미지 상태
  const [profileImage, setProfileImage] = useState<string>(defaultProfile);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  // 회원가입 완료 모달 닫기
  const handleCloseRegisteredModal = () => {
    setIsRegistered(false);
  };

  // 소셜 로그인시 이메일 자동 입력
  const location = useLocation();
  const socialEmail = location.state?.socialEmail;

  useEffect(() => {
    if (socialEmail) {
      setEmail(socialEmail);
      setIsEmailChecked(true);
    }
  }, []);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setIsEmailChecked(false);
    setIsEmailVerified(false);

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
    setIsNicknameChecked(false);

    if (!value.trim()) {
      setNicknameError('닉네임을 입력해주세요.');
    } else if (value.length < 3 || value.length > 10) {
      setNicknameError('3자 이상 10자 이하로 입력해주세요.');
    } else {
      setNicknameError('');
    }
  };

  // 닉네임 랜덤 생성
  useEffect(() => {
    const fetchRandomNickname = async () => {
      try {
        const response = await getRandomNickname();
        const name = response.data?.result?.nickname ?? '';
        setNickname(name);
        console.log(name);
      } catch (error) {
        console.error('닉네임 랜덤 생성 중 오류 발생:', error);
      }
    };
    fetchRandomNickname();
  }, []);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
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

  // 프로필 이미지 변경 핸들러
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('파일 크기는 5MB 이하여야 합니다.');
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfileImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);

      // File 객체 저장
      setProfileImageFile(file);
    }
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

    try {
      const response = await checkEmailDuplicate(email);
      const emailDuplicated = response.data.result.emailDuplicated;

      if (!emailDuplicated) {
        setEmailError('');
        setIsEmailChecked(true);
        alert('사용 가능한 이메일입니다.');
      } else {
        setEmailError('이미 사용중인 이메일입니다.');
        setIsEmailChecked(false);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        setEmailError(
          error.response?.data?.message || '중복확인 중 오류가 발생했습니다.',
        );
      }
      setIsEmailChecked(false);
    }
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
      const nicknameDuplicated = response.data.nicknameDuplicated;
      console.log(response);
      if (!nicknameDuplicated) {
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
          error.response?.data?.message || '중복확인 중 오류가 발생했습니다.',
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

    // // 오버레이 테스트
    // setTimeout(() => {
    //   window.electron.joinLive();
    // }, 1000);
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
      // 소셜 로그인 여부 확인
      const isSocial = !!socialEmail;

      // register API 호출
      await register(
        email,
        password,
        nickname,
        isSocial,
        profileImageFile,
        isSocial ? 'GOOGLE' : undefined, // 소셜 로그인인 경우 providerName 추가
      );

      setIsRegistered(true);
    } catch (error) {
      if (error instanceof AxiosError) {
        alert(
          error.response?.data?.message || '회원가입 중 오류가 발생했습니다.',
        );
      } else {
        alert('회원가입 중 오류가 발생했습니다.');
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
                src={profileImage}
                alt="프로필 이미지"
                css={profileImageStyle}
              />
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleProfileChange}
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
                disabled={!!socialEmail}
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
                disabled={!nickname || !!nicknameError}
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
            <Link to="/login" css={loginLinkStyle}>
              로그인
            </Link>
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
      {/* 이메일 인증 모달 */}
      <EmailVerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        email={email}
        onVerificationSuccess={handleVerificationSuccess}
      />
      {/* 회원가입 완료 모달 */}
      <IsRegisteredModal
        isOpen={isRegistered}
        onClose={handleCloseRegisteredModal}
        nickname={nickname}
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
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  font-family: 'NanumSquareR', sans-serif;
  color: var(--color-text);
  margin-left: 0.35rem;
`;

const requiredStyle = css`
  color: var(--color-red);
  font-size: 15px;
  font-family: 'NanumSquareR', sans-serif;
`;

const inputRowStyle = css`
  display: flex;
  flex-direction: column;
  margin-bottom: 18px;
`;

const inputStyle = css`
  height: 44px;
  border: 1px solid var(--color-gray-200);
  border-radius: 8px;
  padding: 0 14px;
  font-size: 15px;
  font-family: 'NanumSquareR', sans-serif;
  background: #ffffffff;
  outline: none;
  &:focus {
    border-color: var(--color-primary);
    background: var(--color-bg-white);
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
  border: 2px solid var(--color-gray-200);
  background: var(--color-gray-100);
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--color-primary);
    transform: scale(1.05);
  }
`;

const checkboxWrapperStyle = css`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
  font-family: 'NanumSquareR', sans-serif;
  color: var(--color-gray-500);
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
  font-family: 'NanumSquareR', sans-serif;
  line-height: 1.4;
  display: inline-block;
`;
const loginLinkStyle = css`
  color: var(--color-primary);
  text-decoration: none;
  font-family: 'NanumSquareB', sans-serif;
  font-weight: 500;
  &:hover {
    text-decoration: underline;
  }
  line-height: 1.5;
`;
const submitButtonStyle = css`
  margin-left: auto;
  background: var(--color-primary);
  color: var(--color-text-white);
  border: none;
  border-radius: 8px;
  padding: 10px 24px;
  font-size: 16px;
  font-family: 'NanumSquareB', sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: var(--color-primary-dark);
  }
`;

const errorInputStyle = css`
  border: 2px solid var(--color-red) !important;
  background: #fff0f0;
`;

const errorMsgStyle = css`
  color: var(--color-red);
  font-size: 13px;
  font-family: 'NanumSquareR', sans-serif;
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
  background: var(--color-primary);
  color: var(--color-text-white);
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 13px;
  font-family: 'NanumSquareB', sans-serif;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: var(--color-primary-dark);
  }

  &:disabled {
    background: var(--color-gray-300);
    cursor: not-allowed;
  }
`;

const checkedButtonStyle = css`
  background: var(--color-green) !important;
  pointer-events: none;
  &:hover {
    background: var(--color-green) !important;
  }
`;

const verifiedButtonStyle = css`
  background: var(--color-primary) !important;
  pointer-events: none;
  &:hover {
    background: var(--color-primary-dark) !important;
  }
`;
