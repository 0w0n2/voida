/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import VoidaLogo from "../assets/icon/VoidaLogo.png";

const MainPage = () => {
  return (
    <div css={wrapper}>
      <img src={VoidaLogo} alt="VOIDA 로고" css={logo} />
      <h1 css={title}>모두가 함께하는 소통의 공간</h1>
      <p css={desc}>
        청각장애인과 비장애인이 함께 소통할 수 있도록,
        <br />
        입술의 움직임을 글자로 바꾸는 실시간 대화 플랫폼입니다.
      </p>
    </div>
  );
};

export default MainPage;

const wrapper = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #F8F9FC;
  text-align: center;
`;

const logo = css`
  width: 230px;
  margin-bottom: 32px;
`;

const title = css`
  font-size: 30px;
  font-family: 'NanumSquareEB';
  margin-bottom: 16px;
`;

const desc = css`
  font-size: 18px;
  color: #888;
  line-height: 1.6;
`;
