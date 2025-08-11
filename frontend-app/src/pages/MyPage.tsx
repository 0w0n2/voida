/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useRef, useState, useEffect } from 'react';
import Header from '../components/Header';
import ProfileTab from '../components/my-page/ProfileTab';
import SettingsTab from '../components/my-page/SettingsTab';
import ShortcutsTab from '../components/my-page/ShortcutsTab';
import OverlayTab from '../components/my-page/OverlayTab';
import settings from '@/assets/icons/mp-setting.png';
import shortcuts from '@/assets/icons/mp-shortcut.png';
import overlay from '@/assets/icons/mp-overlay.png';
import profile from '@/assets/icons/mp-profile.png';

const MyPage = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileTab />;
      case 'settings':
        return <SettingsTab />;
      case 'shortcuts':
        return <ShortcutsTab />;
      case 'overlay':
        return <OverlayTab />;
      default:
        return null;
    }
  };

  return (
    <main>
      <Header />
      <nav css={navigationStyle}>
        <div css={selectorBoxStyle}>
          <button
            css={navTabStyle(activeTab === 'profile')}
            onClick={() => handleTabClick('profile')}
          >
            <img src={profile} alt="profile" />
            <span css={tabTextStyle}>프로필</span>
          </button>
          <button
            css={navTabStyle(activeTab === 'settings')}
            onClick={() => handleTabClick('settings')}
          >
            <img src={settings} alt="settings" />
            <span css={tabTextStyle}>설정</span>
          </button>
          <button
            css={navTabStyle(activeTab === 'shortcuts')}
            onClick={() => handleTabClick('shortcuts')}
          >
            <img src={shortcuts} alt="shortcuts" />
            <span css={tabTextStyle}>단축키</span>
          </button>
          <button
            css={navTabStyle(activeTab === 'overlay')}
            onClick={() => handleTabClick('overlay')}
          >
            <img src={overlay} alt="overlay" />
            <span css={tabTextStyle}>오버레이</span>
          </button>
        </div>
      </nav>

      <section css={mainContentStyle}>{renderContent()}</section>
    </main>
  );
};

export const navigationStyle = css`
  width: 100%;
  max-width: 90%;
  margin: 0 auto;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5%;
  padding: 0 2%;

  @media (max-width: 768px) {
    max-width: 95%;
    gap: 1%;
    padding: 0 1%;
  }

  @media (max-width: 480px) {
    max-width: 98%;
    padding: 0 0.5%;
  }
`;

export const selectorBoxStyle = css`
  width: 100%;
  max-width: 90%;
  display: flex;
  align-items: center;
  margin: 0 auto;
  gap: 1.5%;
  padding: 0 2%;

  @media (max-width: 768px) {
    max-width: 95%;
    gap: 1%;
    padding: 0 1%;
  }

  @media (max-width: 480px) {
    max-width: 98%;
    padding: 0 0.5%;
  }
`;

export const navTabStyle = (active: boolean) => css`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border: none;
  background: none;
  font-weight: ${active ? '700' : '400'};
  color: ${active ? '#000' : '#888'};
  cursor: pointer;
  font-size: 14px;
  border-radius: 12px;

  @media (max-width: 768px) {
    padding: 8px 12px;
    font-size: 13px;
    gap: 4px;
  }

  @media (max-width: 480px) {
    padding: 6px 8px;
    font-size: 12px;
    gap: 2px;
  }
`;

export const tabTextStyle = css`
  font-family: 'NanumSquareR', sans-serif;
`;

export const mainContentStyle = css`
  display: flex;
  gap: 3%;
  padding: 3%;
  max-width: 90%;
  width: 100%;
  margin: auto;

  @media (max-width: 1024px) {
    max-width: 95%;
    gap: 2%;
    padding: 2%;
  }

  @media (max-width: 768px) {
    max-width: 98%;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
  }

  @media (max-width: 480px) {
    max-width: 100%;
    padding: 15px;
    gap: 15px;
  }
`;

export default MyPage;
