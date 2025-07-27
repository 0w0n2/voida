/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
// import RegisterForm from "@/components/RegisterForm.tsx";

const RegisterPage = () => {
  return <div css={wrapperStyle}>{/* <RegisterForm /> */}</div>;
};

export default RegisterPage;

const wrapperStyle = css`
  min-height: 100vh;
  background-color: #f8f9fc;
  display: flex;
  align-items: center;
  justify-content: center;
`;
