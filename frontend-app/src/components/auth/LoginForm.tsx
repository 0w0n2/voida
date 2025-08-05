/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';
import { AxiosError } from 'axios';
import { login } from '@/apis/authApi';
import VoidaLogo from '@/assets/logo/voida-logo.png';
import GoogleLogo from '@/assets/icons/google-logo.png';
import EyeIcon from '@/assets/icons/eye.png';
import EyeCloseIcon from '@/assets/icons/crossed-eye.png';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  // 구글 로그인 리다이렉트 함수 !!
  // 리다이렉트 페이지 : callback.tsx
  const handleGoogleLogin = () => {
    const provider = 'google';
    window.location.href = `${
      import.meta.env.VITE_API_URL
    }/v1/auth/login/${provider}`;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    if (!value.trim()) {
      setEmailError('이메일을 입력해주세요.');
    } else if (!/^[\w-.]+@[\w-]+\.[a-z]{2,}$/i.test(value)) {
      setEmailError('올바른 이메일 형식이 아닙니다.');
    } else {
      setEmailError('');
    }
  };

  const validate = () => {
    let isValid = true;

    if (!email.trim()) {
      setEmailError('이메일을 입력해주세요.');
      isValid = false;
    }

    if (!password.trim()) {
      setPasswordError('비밀번호를 입력해주세요.');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await login(email, password);
      const isNewbie = res.data.result.isNewbie;
      const accessToken = res.headers.authorization;
      const { user } = res.data;
      // 유저 정보 저장
      setAuth(accessToken, user);
      localStorage.setItem('accessToken', accessToken);
      if (isNewbie) {
        navigate('/tutorial');
      }
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;

      setError(axiosError.response?.data?.message || '로그인 실패');
    }
  };

  return (
    <form css={formStyle} onSubmit={handleLogin}>
      <img src={VoidaLogo} alt="Voida Logo" css={logoStyle} />

      <button type="button" css={googleBtnStyle} onClick={handleGoogleLogin}>
        <img src={GoogleLogo} alt="Google" css={googleLogoStyle} />
        Google로 로그인하기
      </button>

      <div css={dividerStyle}>
        <span>or</span>
      </div>

      <div css={inputRowStyle}>
        <label htmlFor="email" css={labelStyle}>
          이메일 주소
        </label>
        <input
          id="email"
          type="email"
          placeholder="이메일"
          value={email}
          onChange={handleEmailChange}
          css={[inputStyle, emailError && inputErrorStyle]}
        />
        {emailError && <div css={errorTextStyle}>{emailError}</div>}
      </div>

      <div css={inputRowStyle}>
        <label htmlFor="password" css={labelStyle}>
          비밀번호
        </label>
        <div css={passwordBoxStyle}>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            css={[inputStyle, passwordError && inputErrorStyle]}
          />
          <img
            src={showPassword ? EyeCloseIcon : EyeIcon}
            alt="비밀번호 보기"
            onClick={() => setShowPassword(!showPassword)}
            css={eyeIconStyle}
          />
        </div>
        {passwordError && <div css={errorTextStyle}>{passwordError}</div>}
      </div>

      {error && <div css={globalErrorStyle}>{error}</div>}

      <div css={footerStyle}>
        <div css={linkBoxStyle}>
          <a href="/register">회원가입</a>
          <span>|</span>
          <a href="/forgot">비밀번호 찾기</a>
        </div>
        <button type="submit" css={loginBtnStyle}>
          로그인
        </button>
      </div>
    </form>
  );
};

export default LoginForm;

const formStyle = css`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  width: 480px;
  height: 650px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const logoStyle = css`
  width: 120px;
  margin: 1rem auto 2rem;
`;

const googleBtnStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: var(--color-bg-white);
  border: 1px solid #ddd;
  height: 60px;
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
  font-family: 'NanumSquareR';
  font-size: 16px;
  color: #939393;

  &:hover {
    color: #666666;
    background: #f8f8f8;
  }
`;

const googleLogoStyle = css`
  width: 20px;
`;

const dividerStyle = css`
  display: flex;
  align-items: center;
  color: #aaa;
  font-size: 1rem;
  margin: 1rem 0;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: #e0e0e0;
  }

  span {
    padding: 0 0.75rem;
  }
`;

const labelStyle = css`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  color: #444;
  font-family: 'NanumSquareR';
  margin-left: 0.35rem;
`;

const inputRowStyle = css`
  display: flex;
  flex-direction: column;
`;

const inputStyle = css`
  padding: 0.75rem;
  border: 1px solid #ddd;
  height: 60px;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  width: 100%;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f9f9f9;
  }

  &:focus {
    border: 2px solid var(--color-primary);
    background-color: white;
  }
`;

const inputErrorStyle = css`
  border: 2px solid red !important;
`;

const errorTextStyle = css`
  color: red;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  text-align: right;
`;

const globalErrorStyle = css`
  color: red;
  font-size: 0.9rem;
  text-align: center;
  margin-top: 0.5rem;
`;

const passwordBoxStyle = css`
  position: relative;
`;

const eyeIconStyle = css`
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  cursor: pointer;
  opacity: 0.6;

  &:hover {
    opacity: 1;
  }
`;

const loginBtnStyle = css`
  background: var(--color-primary);
  color: white;
  padding: 0.75rem;
  font-family: 'NanumSquareR';
  border: none;
  border-radius: 8px;
  cursor: pointer;
  width: 80px;

  &:hover {
    background: var(--color-primary-dark);
  }
`;

const footerStyle = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
`;

const linkBoxStyle = css`
  font-size: 0.8rem;
  color: #888;

  a {
    text-decoration: none;
    color: #666;
    margin: 0 0.25rem;

    &:hover {
      color: #2d6cdf;
    }
  }

  span {
    margin: 0 0.25rem;
  }
`;
