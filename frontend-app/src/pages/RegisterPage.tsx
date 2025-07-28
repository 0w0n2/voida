/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import RegisterForm from "@/components/RegisterForm";
import { checkEmailDuplicate, checkNicknameDuplicate } from "@/apis/authApi";

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
  ba kground-color: #f8f9fc;
  display: flex;
  align-items: center;
  justify-content: center;
`;
