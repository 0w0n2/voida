/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import RegisterForm from '@/components/RegisterForm';
import { checkEmailDuplicate, checkNicknameDuplicate } from '@/apis/authApi';

const RegisterPage = () => {
  return (
    <div css={wrapperStyle}>
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;

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
