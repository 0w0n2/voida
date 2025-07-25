/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import LoginForm from '@/components/LoginForm'

const LoginPage = () => {
  return (
    <div css={wrapperStyle}>
      <LoginForm />
    </div>
  )
}

export default LoginPage

const wrapperStyle = css`
  min-height: 100vh;
  background-color: #F8F9FC;
  display: flex;
  align-items: center;
  justify-content: center;
`