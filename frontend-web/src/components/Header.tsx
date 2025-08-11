/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import VoidaLogo from '@/assets/logo/voida-logo.png';

export default function Header() {
  return (
    <header css={headerStyle}>
      <img src={VoidaLogo} css={logoStyle}></img>
      <button css={buttonStyle}>Voida 실행하기</button>
    </header>
  );
}

const headerStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 150px;
  border-bottom: 1px solid #f1f3f5;
  background: var(--color-bg-white);
  font-family: 'NanumSquareR';
`;

const logoStyle = css`
  width: 130px;
  cursor: pointer;
  transition: opacity 0.2s ease-in-out;

  &:hover {
    opacity: 0.8;
  }
`;

const buttonStyle = css`
  background: var(--color-primary);
  color: var(--color-text-white);
  font-size: 16px;
  padding: 14px 30px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-family: 'NanumSquareR';
  transition: background 0.2s ease, transform 0.15s ease;

  &:hover {
    background: var(--color-primary-dark);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;
