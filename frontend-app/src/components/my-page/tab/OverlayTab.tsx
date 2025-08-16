/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useEffect } from 'react';
import { getUserSettings, updateOverlay } from '@/apis/auth/userApi';
import { useAuthStore } from '@/stores/userStore';
import UpdateDoneModal from '@/components/my-page/modal/UpdateDoneModal';
import { useAlertStore } from '@/stores/useAlertStore';

type OverlayPosition = 'TOPLEFT' | 'TOPRIGHT' | 'BOTTOMLEFT' | 'BOTTOMRIGHT';

const OverlayTab = () => {
  const { user } = useAuthStore();
  const [overlayPosition, setOverlayPosition] =
    useState<OverlayPosition>('TOPLEFT');
  const [liveFontSize, setLiveFontSize] = useState<number>(0);
  const [overlayTransparency, setOverlayTransparency] = useState<number>(0);
  const [changed, setChanged] = useState(false);
  const [showDoneModal, setShowDoneModal] = useState(false);

  // 유저 설정 불러오기
  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        const res = await getUserSettings();
        setOverlayPosition(
          res.data.result.setting.overlayPosition as OverlayPosition,
        );
        setLiveFontSize(res.data.result.setting.liveFontSize);
        setOverlayTransparency(res.data.result.setting.overlayTransparency);
      } catch (err) {
        console.error('유저 설정 조회 실패:', err);
      }
    };
    fetchUserSettings();
  }, []);

  const handlePositionChange = (pos: OverlayPosition) => {
    setOverlayPosition(pos);
    setChanged(true);
  };

  // const handleFontSizeChange = (size: number) => {
  //   setLiveFontSize(size);
  //   setChanged(true);
  // };

  const handleTransparencyChange = (transparency: number) => {
    setOverlayTransparency(transparency);
    setChanged(true);
  };

  const handleSave = async () => {
    try {
      await updateOverlay(overlayPosition, overlayTransparency, liveFontSize);
      setShowDoneModal(true);
      setChanged(false);
      useAlertStore
        .getState()
        .showAlert('유저 정보가 업데이트되었습니다.', 'top');
    } catch (err) {
      console.error('오버레이 설정 저장 실패:', err);
    }
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
              게임 중 채팅과 웹캠이 보일 위치를 지정할 수 있습니다.
            </p>
            <div css={monitorFrameStyle}>
              <div
                css={topLeftStyle(overlayPosition === 'TOPLEFT')}
                onClick={() => handlePositionChange('TOPLEFT')}
              />
              <div
                css={topRightStyle(overlayPosition === 'TOPRIGHT')}
                onClick={() => handlePositionChange('TOPRIGHT')}
              />
              <div
                css={bottomLeftStyle(overlayPosition === 'BOTTOMLEFT')}
                onClick={() => handlePositionChange('BOTTOMLEFT')}
              />
              <div
                css={bottomRightStyle(overlayPosition === 'BOTTOMRIGHT')}
                onClick={() => handlePositionChange('BOTTOMRIGHT')}
              />
            </div>
          </div>
        </div>

        <div css={rightSectionStyle}>
          <div css={overlaySectionStyle}>
            <h3 css={overlaySectionTitleStyle}>투명도</h3>
            <p css={overlaySectionDescriptionStyle}>
              게임 중 채팅의 투명도를 지정할 수 있습니다.
            </p>
            <div css={sliderContainerStyle}>
              <span css={sliderLabelStyle}>0%</span>
              <input
                css={sliderStyle(overlayTransparency)}
                type="range"
                min="0"
                max="100"
                value={overlayTransparency}
                onChange={(e) =>
                  handleTransparencyChange(Number(e.target.value))
                }
              />
              <span css={sliderLabelStyle}>{overlayTransparency}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* <UpdateDoneModal
        isOpen={showDoneModal}
        onClose={() => setShowDoneModal(false)}
        userName={user?.nickname || '사용자'}
      /> */}
    </div>
  );
};

export default OverlayTab;

/* === 스타일 === */
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
`;

const panelTitleStyle = css`
  font-family: 'NanumSquareEB';
  font-size: 22px;
  color: var(--color-text);
`;

const panelSubtitleStyle = css`
  font-family: 'NanumSquareR', sans-serif;
  font-size: 16px;
  color: var(--color-gray-600);
  margin-bottom: 48px;
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
  &:hover {
    background-color: var(--color-primary-dark);
  }
  &:disabled {
    background-color: var(--color-gray-300);
    color: var(--color-gray-500);
    cursor: not-allowed;
  }
`;

const overlayContentStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
`;

const leftSectionStyle = css`
  flex: 1;
`;
const rightSectionStyle = css`
  flex: 1;
  min-width: 550px;
  align-self: flex-start;
`;

const overlaySectionStyle = css`
  margin-bottom: 40px;
  border-radius: 12px;
  background-color: var(--color-gray-100);
  padding: 30px;
`;

const overlaySectionTitleStyle = css`
  font-family: 'NanumSquareEB';
  font-size: 18px;
  color: var(--color-text);
  margin-bottom: 10px;
`;

const overlaySectionDescriptionStyle = css`
  font-family: 'NanumSquareR', sans-serif;
  font-size: 15px;
  color: var(--color-gray-600);
  margin-bottom: 30px;
`;

const monitorFrameStyle = css`
  position: relative;
  width: 400px;
  aspect-ratio: 16 / 9;
  border-radius: 12px;
  box-shadow: inset 0 0 0 2px #e3e6ef, 0 2px 8px rgba(0, 0, 0, 0.06);
  margin: 30px 0px;
`;

const overlayPositionButton = (selected: boolean) => css`
  position: absolute;
  width: 130px;
  height: 70px;
  background-color: ${selected ? 'rgba(100, 149, 237, 0.7)' : '#ccc'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.25s ease;
  &:hover {
    background-color: ${selected ? 'rgba(100, 149, 237, 0.85)' : '#bfbfbf'};
    transform: scale(1.05);
  }
`;

const topLeftStyle = (selected: boolean) => css`
  ${overlayPositionButton(selected)};
  top: 10px;
  left: 10px;
`;
const topRightStyle = (selected: boolean) => css`
  ${overlayPositionButton(selected)};
  top: 10px;
  right: 10px;
`;
const bottomLeftStyle = (selected: boolean) => css`
  ${overlayPositionButton(selected)};
  bottom: 10px;
  left: 10px;
`;
const bottomRightStyle = (selected: boolean) => css`
  ${overlayPositionButton(selected)};
  bottom: 10px;
  right: 10px;
`;

const sliderContainerStyle = css`
  display: flex;
  align-items: center;
  gap: 20px;
  max-width: 450px;
  margin-bottom: 15px;
`;

const sliderLabelStyle = css`
  font-family: 'NanumSquareR', sans-serif;
  font-size: 14px;
  color: var(--color-text);
  min-width: 40px;
  text-align: center;
`;

const sliderStyle = (value: number) => css`
  flex: 1;
  height: 6px;
  border-radius: 3px;
  outline: none;
  -webkit-appearance: none;
  appearance: none;

  background: linear-gradient(
    to right,
    rgba(0, 123, 255, ${value / 100}) 0%,
    rgba(0, 123, 255, ${value / 100}) ${value}%,
    var(--color-gray-200) ${value}%,
    var(--color-gray-200) 100%
  );

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    background: var(--color-primary);
    border-radius: 50%;
    cursor: pointer;
  }
`;
