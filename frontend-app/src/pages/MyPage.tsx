import React, { useState } from 'react';
import styled from '@emotion/styled';
import Header from '../components/Header';
import ProfileTab from '../components/Myp/ProfileTab';
import SettingsTab from '../components/Myp/SettingsTab';
import ShortcutsTab from '../components/Myp/ShortcutsTab';
import OverlayTab from '../components/Myp/OverlayTab';

const MyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [nickname, setNickname] = useState('진모리');
  const [email] = useState('minhe8564@gmail.com');

  // 설정 탭 상태
  const [speechEnabled, setSpeechEnabled] = useState(false);

  // 단축키 탭 상태
  const [shortcuts, setShortcuts] = useState([
    { key: '`+ 1', text: '안녕하세요.' },
    { key: '`+ 2', text: '감사합니다.' },
    { key: '`+ 3', text: '도움이 필요합니다.' },
    { key: '`+ 1', text: '죄송합니다.' },
    { key: '`+ 3', text: '잠시만 기다려주세요.' },
    { key: '`+ 3', text: '좋은 하루 되세요.' },
  ]);

  // 오버레이 탭 상태
  const [selectedPosition, setSelectedPosition] = useState(0);
  const [fontSize, setFontSize] = useState(70);
  const [transparency, setTransparency] = useState(100);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const handleProfileImageChange = () => {
    console.log('프로필 이미지 변경');
  };

  const handlePasswordChange = () => {
    console.log('비밀번호 변경');
  };

  const handleGoogleLink = () => {
    console.log('Google 계정 연동');
  };

  const handleSave = () => {
    console.log('정보 저장');
  };

  const handleGuidebook = () => {
    console.log('가이드북 보기');
  };

  const handleWithdraw = () => {
    console.log('탈퇴하기');
  };

  const handleShortcutChange = (index: number, value: string) => {
    const newShortcuts = [...shortcuts];
    newShortcuts[index].text = value;
    setShortcuts(newShortcuts);
  };

  const handleNicknameChange = (newNickname: string) => {
    setNickname(newNickname);
  };

  const handleSpeechToggle = (enabled: boolean) => {
    setSpeechEnabled(enabled);
  };

  const handlePositionChange = (position: number) => {
    setSelectedPosition(position);
  };

  const handleFontSizeChange = (size: number) => {
    setFontSize(size);
  };

  const handleTransparencyChange = (transparency: number) => {
    setTransparency(transparency);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <ProfileTab
            nickname={nickname}
            email={email}
            onNicknameChange={handleNicknameChange}
            onSave={handleSave}
            onWithdraw={handleWithdraw}
            onProfileImageChange={handleProfileImageChange}
            onPasswordChange={handlePasswordChange}
            onGoogleLink={handleGoogleLink}
          />
        );

      case 'settings':
        return (
          <SettingsTab
            speechEnabled={speechEnabled}
            onSpeechToggle={handleSpeechToggle}
            onSave={handleSave}
            onGuidebook={handleGuidebook}
          />
        );

      case 'shortcuts':
        return (
          <ShortcutsTab
            shortcuts={shortcuts}
            onShortcutChange={handleShortcutChange}
            onSave={handleSave}
          />
        );

      case 'overlay':
        return (
          <OverlayTab
            selectedPosition={selectedPosition}
            fontSize={fontSize}
            transparency={transparency}
            onPositionChange={handlePositionChange}
            onFontSizeChange={handleFontSizeChange}
            onTransparencyChange={handleTransparencyChange}
            onSave={handleSave}
          />
        );

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
          <TabIcon>👤</TabIcon>
          <TabText>프로필</TabText>
        </NavTab>
        <NavTab
          active={activeTab === 'settings'}
          onClick={() => handleTabClick('settings')}
        >
          <TabIcon>⚙️</TabIcon>
          <TabText>설정</TabText>
        </NavTab>
        <NavTab
          active={activeTab === 'shortcuts'}
          onClick={() => handleTabClick('shortcuts')}
        >
          <TabIcon>⌨️</TabIcon>
          <TabText>단축키</TabText>
        </NavTab>
        <NavTab
          active={activeTab === 'overlay'}
          onClick={() => handleTabClick('overlay')}
        >
          <TabIcon>⊞</TabIcon>
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
  background-color: var(--color-bg-blue);
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
