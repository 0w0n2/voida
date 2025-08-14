/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useRef, useState } from 'react';
import Header from '@/components/Header';
import ProfileTab from '@/components/my-page/ProfileTab';
import SettingsTab from '@/components/my-page/SettingsTab';
import ShortcutsTab from '@/components/my-page/ShortcutsTab';
import OverlayTab from '@/components/my-page/OverlayTab';
import settings from '@/assets/icons/mp-setting.png';
import shortcuts from '@/assets/icons/mp-shortcut.png';
import overlay from '@/assets/icons/mp-overlay.png';
import profile from '@/assets/icons/mp-profile.png';

const tabList = [
  { key: 'profile', label: '프로필', icon: profile, component: <ProfileTab /> },
  { key: 'settings', label: '설정', icon: settings, component: <SettingsTab /> },
  { key: 'shortcuts', label: '단축키', icon: shortcuts, component: <ShortcutsTab /> },
  { key: 'overlay', label: '오버레이', icon: overlay, component: <OverlayTab /> },
];

export default function MyPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [highlightStyle, setHighlightStyle] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const currentTab = tabRefs.current[activeIndex];
    if (currentTab) {
      const { offsetLeft, offsetWidth } = currentTab;
      setHighlightStyle({ left: offsetLeft, width: offsetWidth });
    }
  }, [activeIndex]);

  return (
    <main>
      <Header />

      {/* 네비게이션 */}
      <nav css={navWrapper}>
        <div css={navContainer}>
          {/* 하이라이트 박스 */}
          <span css={highlightBox(highlightStyle.left, highlightStyle.width)} />

          {tabList.map((tab, index) => (
            <button
              key={tab.key}
              ref={(el) => (tabRefs.current[index] = el)}
              css={navTab(index === activeIndex)}
              onClick={() => setActiveIndex(index)}
            >
              <img src={tab.icon} alt={tab.label} css={iconStyle} />
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* 슬라이더 콘텐츠 */}
      <div css={sliderWrapper}>
        <div css={sliderTrack(activeIndex)}>
          {tabList.map((tab) => (
            <div css={sliderItem} key={tab.key}>
              {tab.component}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

const navWrapper = css`
  width: 100%;
  overflow-x: auto;
  padding: 8px 0;
  display: flex;
  justify-content: center;
`;

const navContainer = css`
  display: flex;
  position: relative;
  background: #f3f4f6;
  border-radius: 999px;
  padding: 6px; 
  gap: 6px;
`;

const navTab = (active: boolean) => css`
  background: none;
  border: none;
  font-size: 15px; 
  font-weight: ${active ? 800 : 600}; 
  color: ${active ? '#000' : '#555'};
  cursor: pointer;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 999px;
  z-index: 1;
  transition: color 0.3s ease;
`;

const iconStyle = css`
  width: 16px;
  height: 16px;
`;

const highlightBox = (left: number, width: number) => css`
  position: absolute;
  top: 4px;
  left: ${left}px;
  width: ${width}px;
  height: calc(100% - 8px);
  background-color: #fff;
  border-radius: 999px; /* 완전 둥근 */
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  z-index: 0;
`;

const sliderWrapper = css`
  overflow: hidden;
  max-width: 1200px;
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

const sliderTrack = (activeIndex: number) => css`
  display: flex;
  transition: transform 0.4s ease;
  transform: translateX(-${activeIndex * 100}%);
`;

const sliderItem = css`
  min-width: 100%;
  padding: 40px;
  box-sizing: border-box;
`;
