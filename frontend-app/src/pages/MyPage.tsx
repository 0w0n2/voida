/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useRef, useState } from 'react';
import { UserCog, Settings, Keyboard, Scan } from 'lucide-react';
import Header from '@/components/Header';
import ProfileTab from '@/components/my-page/ProfileTab';
import SettingsTab from '@/components/my-page/SettingsTab';
import ShortcutsTab from '@/components/my-page/ShortcutsTab';
import OverlayTab from '@/components/my-page/OverlayTab';

const tabList = [
  { key: 'profile', label: '프로필', icon: UserCog, component: <ProfileTab /> },
  {
    key: 'settings',
    label: '설정',
    icon: Settings,
    component: <SettingsTab />,
  },
  {
    key: 'shortcuts',
    label: '단축키',
    icon: Keyboard,
    component: <ShortcutsTab />,
  },
  { key: 'overlay', label: '오버레이', icon: Scan, component: <OverlayTab /> },
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
    <main css={mainWrapper}>
      <Header />
      <nav css={navWrapper}>
        <div css={navContainer}>
          <span css={highlightBox(highlightStyle.left, highlightStyle.width)} />

          {tabList.map((tab, index) => (
            <button
              key={tab.key}
              ref={(el) => (tabRefs.current[index] = el)}
              css={navTab(index === activeIndex)}
              onClick={() => setActiveIndex(index)}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

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

const mainWrapper = css`
  min-height: 100vh;
`;

const navWrapper = css`
  max-width: 1200px;
  margin: 0 auto;
  padding: 10px 0;
  @media (min-height: 900px) {
    padding: 20px 0px;
  }
  @media (min-height: 1000px) {
    padding-top: 60px;
    padding: 50px 0px;
  }
  @media (min-height: 1300px) {
    padding: 50px 0px;
  }
`;

const navContainer = css`
  display: inline-flex;
  position: relative;
  background: #f3f4f6;
  border-radius: 10px;
  margin: 0px 40px;
  padding: 10px 0px;
  gap: 10px;
`;

const navTab = (active: boolean) => css`
  background: none;
  border: none;
  font-size: 18px;
  font-family: ${active ? 'NanumSquareEB' : 'NanumSquareR'};
  color: ${active ? '#000' : '#555'};
  cursor: pointer;
  padding: 10px 30px;
  margin: 0px 5px;
  display: flex;
  align-items: center;
  gap: 14px;
  border-radius: 10px;
  z-index: 1;
  transition: color 0.3s ease;
`;

const highlightBox = (left: number, width: number) => css`
  position: absolute;
  top: 4px;
  left: ${left}px;
  width: ${width}px;
  height: calc(100% - 8px);
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  z-index: 0;
`;

const sliderWrapper = css`
  overflow: hidden;
  max-width: 1200px;
  margin: auto;
  @media (min-height: 900px) {
    padding: 10px 0px;
  }
  @media (min-height: 1000px) {
    padding: 30px 0px;
    padding-top: 0px;
  }
  @media (min-height: 1300px) {
    padding: 30px 0px;
  }
`;

const sliderTrack = (activeIndex: number) => css`
  display: flex;
  transition: transform 0.4s ease;
  transform: translateX(-${activeIndex * 100}%);
`;

const sliderItem = css`
  min-width: 1200px;
  padding: 40px;
  box-sizing: border-box;
`;
