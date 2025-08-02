import React from 'react';
import styled from '@emotion/styled';

interface OverlayTabProps {
  selectedPosition: number;
  fontSize: number;
  transparency: number;
  onPositionChange: (position: number) => void;
  onFontSizeChange: (size: number) => void;
  onTransparencyChange: (transparency: number) => void;
  onSave: () => void;
}

const OverlayTab: React.FC<OverlayTabProps> = ({
  selectedPosition,
  fontSize,
  transparency,
  onPositionChange,
  onFontSizeChange,
  onTransparencyChange,
  onSave,
}) => {
  return (
    <OverlayPanel>
      <OverlayHeader>
        <PanelTitle>오버레이 설정</PanelTitle>
        <SaveButton onClick={onSave}>저장하기</SaveButton>
      </OverlayHeader>
      <PanelSubtitle>
        실시간 게임 중 오버레이 화면을 커스텀 해보세요.
      </PanelSubtitle>

      <OverlaySection>
        <OverlaySectionTitle>위치</OverlaySectionTitle>
        <OverlaySectionDescription>
          게임 중 채팅과 엔점이 보일 위치를 지정할 수 있습니다.
        </OverlaySectionDescription>
        <PositionGrid>
          {[0, 1, 2, 3, 4, 5].map((position) => (
            <PositionBox
              key={position}
              selected={selectedPosition === position}
              onClick={() => onPositionChange(position)}
            />
          ))}
        </PositionGrid>
      </OverlaySection>

      <OverlaySection>
        <OverlaySectionTitle>글자 크기</OverlaySectionTitle>
        <OverlaySectionDescription>
          게임 중 채팅의 글자 크기를 지정할 수 있습니다.
        </OverlaySectionDescription>
        <SliderContainer>
          <SliderLabel>가</SliderLabel>
          <Slider
            type="range"
            min="12"
            max="48"
            value={fontSize}
            onChange={(e) => onFontSizeChange(Number(e.target.value))}
          />
          <SliderLabel style={{ fontSize: `${fontSize}px` }}>가</SliderLabel>
        </SliderContainer>
      </OverlaySection>

      <OverlaySection>
        <OverlaySectionTitle>투명도</OverlaySectionTitle>
        <OverlaySectionDescription>
          게임 중 채팅의 투명도를 지정할 수 있습니다.
        </OverlaySectionDescription>
        <SliderContainer>
          <SliderLabel>0%</SliderLabel>
          <Slider
            type="range"
            min="0"
            max="100"
            value={transparency}
            onChange={(e) => onTransparencyChange(Number(e.target.value))}
          />
          <SliderLabel>{transparency}%</SliderLabel>
        </SliderContainer>
      </OverlaySection>
    </OverlayPanel>
  );
};

// 스타일 컴포넌트
const OverlayPanel = styled.div`
  width: 100%;
  background-color: var(--color-bg-white);
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const OverlayHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const PanelTitle = styled.h2`
  font-family: 'NanumSquareB', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 8px;
`;

const PanelSubtitle = styled.p`
  font-family: 'NanumSquareR', sans-serif;
  font-size: 14px;
  color: var(--color-gray-600);
  margin-bottom: 24px;
`;

const SaveButton = styled.button`
  padding: 8px 16px;
  background-color: var(--color-primary);
  color: var(--color-text-white);
  border: none;
  border-radius: 6px;
  font-family: 'NanumSquareR', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--color-primary-dark);
  }
`;

const OverlaySection = styled.div`
  margin-bottom: 32px;
`;

const OverlaySectionTitle = styled.h3`
  font-family: 'NanumSquareB', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 4px;
`;

const OverlaySectionDescription = styled.p`
  font-family: 'NanumSquareR', sans-serif;
  font-size: 14px;
  color: var(--color-gray-600);
  margin-bottom: 16px;
`;

const PositionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  max-width: 300px;
`;

const PositionBox = styled.div<{ selected: boolean }>`
  width: 80px;
  height: 60px;
  background-color: ${(props) =>
    props.selected ? 'var(--color-primary)' : 'var(--color-gray-100)'};
  border: 2px solid
    ${(props) =>
      props.selected ? 'var(--color-primary)' : 'var(--color-gray-200)'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--color-primary);
  }
`;

const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  max-width: 400px;
`;

const SliderLabel = styled.span`
  font-family: 'NanumSquareR', sans-serif;
  font-size: 14px;
  color: var(--color-text);
  min-width: 30px;
`;

const Slider = styled.input`
  flex: 1;
  height: 6px;
  background: linear-gradient(
    to right,
    var(--color-primary) 0%,
    var(--color-primary) 50%,
    var(--color-gray-200) 50%,
    var(--color-gray-200) 100%
  );
  border-radius: 3px;
  outline: none;
  -webkit-appearance: none;
  appearance: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    background: var(--color-primary);
    border-radius: 50%;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 18px;
    height: 18px;
    background: var(--color-primary);
    border-radius: 50%;
    cursor: pointer;
    border: none;
  }
`;

export default OverlayTab; 