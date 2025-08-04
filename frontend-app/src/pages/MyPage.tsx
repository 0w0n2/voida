import React, { useState } from 'react';
import styled from '@emotion/styled';
import Header from '../components/Header';
import ProfileTab from '../components/Myp/ProfileTab';
import SettingsTab from '../components/Myp/SettingsTab';
import ShortcutsTab from '../components/Myp/ShortcutsTab';
import OverlayTab from '../components/Myp/OverlayTab';
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
    <Container>
      {/* 헤더 */}
      <Header />

      {/* 네비게이션 바 */}
      <Navigation>
        <NavTab
          active={activeTab === 'profile'}
          onClick={() => handleTabClick('profile')}
        >
          <img src={profile} alt="profile" />
          <TabText>프로필</TabText>
        </NavTab>
        <NavTab
          active={activeTab === 'settings'}
          onClick={() => handleTabClick('settings')}
        >
          <img src={settings} alt="settings" />
          <TabText>설정</TabText>
        </NavTab>
        <NavTab
          active={activeTab === 'shortcuts'}
          onClick={() => handleTabClick('shortcuts')}
        >
          <img src={shortcuts} alt="shortcuts" />
          <TabText>단축키</TabText>
        </NavTab>
        <NavTab
          active={activeTab === 'overlay'}
          onClick={() => handleTabClick('overlay')}
        >
          <img src={overlay} alt="overlay" />
          <TabText>오버레이</TabText>
        </NavTab>
      </Navigation>

      {/* 메인 콘텐츠 */}
      <MainContent>{renderContent()}</MainContent>
    </Container>
  );
};

// 스타일 컴포넌트
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    #f8fbff 0%,
    #eaeeffff 50%,
    #e0efffff 100%
  );
  font-family: 'NanumSquareR', sans-serif;
`;

const Navigation = styled.nav`
  display: flex;
  background-color: var(--color-bg-white);
  border-bottom: 1px solid var(--color-gray-200);
`;

const NavTab = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 24px;
  background: none;
  border: none;
  cursor: pointer;
  font-family: 'NanumSquareR', sans-serif;
  font-size: 14px;
  color: ${(props) =>
    props.active ? 'var(--color-primary)' : 'var(--color-gray-600)'};
  font-weight: ${(props) => (props.active ? '700' : '400')};
  border-bottom: 2px solid
    ${(props) => (props.active ? 'var(--color-primary)' : 'transparent')};
  transition: all 0.2s ease;

  &:hover {
    color: var(--color-primary);
  }
`;

const TabIcon = styled.span`
  font-size: 16px;
`;

const TabText = styled.span`
  font-family: 'NanumSquareR', sans-serif;
`;

const MainContent = styled.main`
  display: flex;
  gap: 24px;
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
`;

export default MyPage;
