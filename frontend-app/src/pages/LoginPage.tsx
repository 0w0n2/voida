/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import LoginForm from '@/components/LoginForm';

const LoginPage = () => {
  return (
    <div css={wrapperStyle}>
      <LoginForm />
    </div>
  );
};

export default LoginPage;

const wrapperStyle = css`
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    #f8fbff 0%,
    #eaeeffff 50%,
    #e0efffff 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
`;
