/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

type RoomSettingModalProps = {
  onClose: () => void;
};

const RoomSettingModal = ({ onClose }: RoomSettingModalProps) => {
  return (
    <div css={overlay}>
      <div css={modal}>
        <button css={closeButton} onClick={onClose}>×</button>
        {/* 여기에 방 설정 UI 넣기 */}
        <h2>방 설정하기</h2>
        <p>여기에 내용 채워넣으세요</p>
      </div>
    </div>
  );
};

export default RoomSettingModal;

const overlay = css`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const modal = css`
  position: relative;
  background: white;
  border-radius: 12px;
  padding: 24px;
  width: 800px;
  max-height: 90%;
  overflow-y: auto;
`;

const closeButton = css`
  position: absolute;
  top: 16px;
  right: 16px;
  font-size: 24px;
  border: none;
  background: transparent;
  cursor: pointer;
`;
