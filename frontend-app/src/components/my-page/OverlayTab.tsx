/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useState, useEffect } from 'react';
import { getUserSettings, updateOverlay } from '../../apis/auth/userApi';
import { useAuthStore } from '../../stores/userStore';
import UpdateDoneModal from './UpdateDoneModal';

type OverlayPosition =
  | 'TOPLEFT'
  | 'TOPRIGHT'
  | 'BOTTOMLEFT'
  | 'BOTTOMRIGHT';

const OverlayTab = () => {
  const { user } = useAuthStore();
  // 오버레이 정보 변수
  const [overlayPosition, setOverlayPosition] =
    useState<OverlayPosition>('TOP_RIGHT');
  const [liveFontSize, setLiveFontSize] = useState<number>(0);
  const [overlayTransparency, setOverlayTransparency] = useState<number>(0);
  const [changed, setChanged] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showDoneModal, setShowDoneModal] = useState(false);

  const enumToNum: { [key in OverlayPosition]: number } = {
    TOP_LEFT: 0,
    TOP_RIGHT: 1,
    BOTTOM_LEFT: 2,
    BOTTOM_RIGHT: 3,
  };

  const numToEnum: OverlayPosition[] = [
    'TOPLEFT',
    'TOPRIGHT',
    'BOTTOMLEFT',
    'BOTTOMRIGHT',
  ];

  // 유저 설정 불러오기
  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        const res = await getUserSettings();
        console.log(res);
        setOverlayPosition(
          res.data.result.setting.overlayPosition as OverlayPosition,
        );
        setLiveFontSize(res.data.result.setting.liveFontSize);
        setOverlayTransparency(res.data.result.setting.overlayTransparency);
      } catch (err) {
        console.error('유저 설정 조회 실패:', err);
        setError('유저 설정을 불러오는데 실패했습니다.');
      }
    };

    fetchUserSettings();
  }, []);

  const handlePositionChange = async (position: number) => {
    const newPosition = numToEnum[position];
    if (newPosition) {
      setOverlayPosition(newPosition);
      setChanged(true);
    }
    console.log('위치 변경됨:', position);
  };

  // 폰트 사이즈 변경
  const handleFontSizeChange = async (size: number) => {
    setLiveFontSize(size);
    setChanged(true);
    console.log('폰트 사이즈 변경됨:', size);
  };

  // 투명도 변경
  const handleTransparencyChange = (transparency: number) => {
    setOverlayTransparency(transparency);
    setChanged(true);
    console.log('투명도 변경됨:', transparency);
  };

  // 오버레이 설정 저장 하기
  const handleSave = async () => {
    try {
      console.log('오버레이 설정 저장 시작');
      const res = await updateOverlay(overlayPosition, overlayTransparency, liveFontSize);
      setChanged(true);
      console.log('오버레이 설정 저장 완료');
      
    } catch (err) {
      console.error('오버레이 설정 저장 실패:', err);
      setSaving(true);
      setShowDoneModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowDoneModal(false);
  };

  return (
    <div css={overlayPanelStyle}>
      <div css={overlayHeaderStyle}>
        <h2 css={panelTitleStyle}>오버레이 설정</h2>
        <button css={saveButtonStyle} onClick={handleSave} disabled={!changed}>
          저장하기
        </button>
      </div>
      <p css={panelSubtitleStyle}>
        실시간 게임 중 오버레이 화면을 커스텀 해보세요.
      </p>

      <div css={overlayContentStyle}>
        <div css={leftSectionStyle}>
          <div css={overlaySectionStyle}>
            <h3 css={overlaySectionTitleStyle}>위치</h3>
            <p css={overlaySectionDescriptionStyle}>
              게임 중 채팅과 엔점이 보일 위치를 지정할 수 있습니다.
            </p>
            <div css={positionGridStyle}>
              {[0, 1, 2, 3].map((position) => (
                <div
                  key={position}
                  css={positionBoxStyle(
                    overlayPosition
                      ? enumToNum[overlayPosition] === position
                      : false,
                  )}
                  onClick={() => handlePositionChange(position)}
                />
              ))}
            </div>
          </div>
        </div>

        <div css={rightSectionStyle}>
          <div css={overlaySectionStyle}>
            <h3 css={overlaySectionTitleStyle}>글자 크기</h3>
            <p css={overlaySectionDescriptionStyle}>
              게임 중 채팅의 글자 크기를 지정할 수 있습니다.
            </p>
            <div css={sliderContainerStyle}>
              <span css={sliderLabelStyle}>가</span>
              <input
                css={sliderStyle}
                type="range"
                min="12"
                max="48"
                value={liveFontSize}
                onChange={(e) => handleFontSizeChange(Number(e.target.value))}
                // disabled={saving}
              />
              <span
                css={sliderLabelStyle}
                style={{ fontSize: `${liveFontSize}px` }}
              >
                가
              </span>
            </div>
          </div>

          <div css={overlaySectionStyle}>
            <h3 css={overlaySectionTitleStyle}>투명도</h3>
            <p css={overlaySectionDescriptionStyle}>
              게임 중 채팅의 투명도를 지정할 수 있습니다.
            </p>
            <div css={sliderContainerStyle}>
              <span css={sliderLabelStyle}>0%</span>
              <input
                css={sliderStyle}
                type="range"
                min="0"
                max="100"
                value={overlayTransparency}
                onChange={(e) =>
                  handleTransparencyChange(Number(e.target.value))
                }
                // disabled={saving}
              />
              <span css={sliderLabelStyle}>{overlayTransparency}%</span>
            </div>
          </div>
        </div>
      </div>

      <UpdateDoneModal
        isOpen={showDoneModal}
        onClose={handleCloseModal}
        userName={user?.nickname || '사용자'}
      />
    </div>
  );
};

export default OverlayTab;

// CSS 스타일
const loadingContainerStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  background-color: var(--color-bg-white);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const loadingTextStyle = css`
  font-family: 'NanumSquareR', sans-serif;
  font-size: 16px;
  color: var(--color-gray-600);
`;

const errorContainerStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  background-color: var(--color-bg-white);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const errorTextStyle = css`
  font-family: 'NanumSquareR', sans-serif;
  font-size: 16px;
  color: var(--color-red);
`;

const overlayPanelStyle = css`
  width: 100%;
  background-color: var(--color-bg-white);
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const overlayHeaderStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const panelTitleStyle = css`
  font-family: 'NanumSquareB', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 8px;
`;

const panelSubtitleStyle = css`
  font-family: 'NanumSquareR', sans-serif;
  font-size: 14px;
  color: var(--color-gray-600);
  margin-bottom: 24px;
`;

const saveButtonStyle = css`
  padding: 8px 16px;
  background-color: var(--color-primary);
  color: var(--color-text-white);
  border: none;
  border-radius: 6px;
  font-family: 'NanumSquareR', sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--color-primary-dark);
  }

  &:disabled {
    background-color: var(--color-gray-400);
    cursor: not-allowed;
  }
`;

const overlayContentStyle = css`
  display: flex;
  gap: 40px;
  max-width: 800px;
  margin-top: 20px;
`;

const leftSectionStyle = css`
  flex: 1;
`;

const rightSectionStyle = css`
  flex: 1;
`;

const overlaySectionStyle = css`
  margin-bottom: 40px;
`;

const overlaySectionTitleStyle = css`
  font-family: 'NanumSquareB', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 8px;
`;

const overlaySectionDescriptionStyle = css`
  font-family: 'NanumSquareR', sans-serif;
  font-size: 14px;
  color: var(--color-gray-600);
  margin-bottom: 20px;
`;

const positionGridStyle = css`
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 2 x 2 */
  grid-template-rows: repeat(2, 1fr); /* ← 행 높이도 지정 */
  gap: 16px;

  /* 셀 높이의 기준을 만들어줘야 함 — 둘 중 하나 선택 */
  width: 360px;
  height: 200px; /* 고정 박스형 */
  /* 또는: width: 360px; aspect-ratio: 16 / 9;  grid-auto-rows: 1fr; */

  padding: 10px;
  border-radius: 12px;
  background: #f7f8fb;
  box-shadow: inset 0 0 0 2px #e3e6ef;
`;

const positionBoxStyle = (selected: boolean, disabled?: boolean) => css`
  width: 100%;
  height: 100%;
  display: block;
  background-color: ${selected
    ? 'var(--color-primary-50)'
    : 'var(--color-gray-100)'};
  border: 2px solid
    ${selected ? 'var(--color-primary)' : 'var(--color-gray-200)'};
  border-radius: 10px;
  cursor: ${disabled ? 'not-allowed' : 'pointer'};
  transition: background-color 0.2s, border-color 0.2s, transform 0.1s,
    box-shadow 0.2s;
  ${!disabled
    ? `&:hover { transform: translateY(-1px); box-shadow: 0 4px 10px rgba(0,0,0,.06); }`
    : ''}
`;

const sliderContainerStyle = css`
  display: flex;
  align-items: center;
  gap: 20px;
  max-width: 450px;
`;

const sliderLabelStyle = css`
  font-family: 'NanumSquareR', sans-serif;
  font-size: 14px;
  color: var(--color-text);
  min-width: 40px;
  text-align: center;
`;

const sliderStyle = css`
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

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

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
