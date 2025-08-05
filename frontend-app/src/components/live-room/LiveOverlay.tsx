/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

const LiveOverlay = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div css={overlayContainer}>
      <div css={[overlayContent, isExpanded ? expanded : collapsed]}>
        <div css={header}>
          <div css={headerLeft}>테스트용 투명 오버레이</div>
          <div css={headerRight}>
            <button>
              <X css={iconBtn} />
            </button>
          </div>
        </div>

        {isExpanded && (
          <div css={body}>
            <p>이곳은 오버레이 투명 창입니다.</p>
            <p>화면 우측 상단에 떠 있어요.</p>
            <p>emotion 기반 스타일이 적용되어 있습니다.</p>
          </div>
        )}

        <button onClick={() => setIsExpanded(!isExpanded)} css={toggleBtn}>
          {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </button>
      </div>
    </div>
  );
};

export default LiveOverlay;

const overlayContainer = css`
  width: 100vw;
  height: 100vh;
  background: transparent;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  padding: 16px;
`;

const overlayContent = css`
  background: rgba(0, 0, 0, 0.4);
  color: white;
  border-radius: 24px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  overflow: hidden;
`;

const expanded = css`
  width: 300px;
  height: 460px;
`;

const collapsed = css`
  width: 320px;
  height: 60px;
`;

const header = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

const headerLeft = css`
  font-size: 14px;
  font-weight: bold;
`;

const headerRight = css`
  display: flex;
  align-items: center;
`;

const iconBtn = css`
  width: 20px;
  height: 20px;
  cursor: pointer;

  &:hover {
    color: #f87171;
  }
`;

const body = css`
  flex: 1;
  padding: 12px 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const toggleBtn = css`
  position: absolute;
  bottom: 6px;
  right: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 9999px;
  padding: 4px;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;
