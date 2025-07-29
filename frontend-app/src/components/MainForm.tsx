import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import VoidaLogo from '@/assets/icon/voida-logo.png';
import mainHome from '@/assets/icon/main-home.png';
import Header from '@/components/Header';

const MainForm = () => {
  return (
    <div>
      <Header />
    </div>
  );
};

export default MainForm;

const iconWrapperStyle = css`
  background-color: linear-gradient(
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;
