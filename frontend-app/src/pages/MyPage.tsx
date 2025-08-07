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
  max-width: 1200px;
  margin: 0 auto;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  padding: 0 24px;
`;

export const selectorBoxStyle = css`
  width: 100%;
  max-width: 1200px;
  display: flex;
  align-items: center;
  margin: 0 auto;
  gap: 16px;
  padding: 0 24px;
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

`;

export const tabTextStyle = css`
  font-family: 'NanumSquareR', sans-serif;
`;

export const mainContentStyle = css`
  display: flex;
  gap: 24px;
  padding: 40px;
  max-width: 1200px;
  width: 100%;
  margin: auto;
`;

export default MyPage;
