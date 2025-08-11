/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';
import { X } from 'lucide-react';
import { updateGuideMode } from '@/apis/auth/userApi';
import { useAlertStore } from '@/stores/useAlertStore';
import { useNavigate } from 'react-router-dom';

type LipTalkModeModalProps = {
  onClose: () => void;
};

export default function LipTalkModeModal({ onClose }: LipTalkModeModalProps) {
  const [isLipTalk, setIsLipTalk] = useState(true);
  const navigate = useNavigate();

  const handleSelect = async (useLipTalkMode: boolean) => {
    try {
      await updateGuideMode(useLipTalkMode);
      useAlertStore.getState()
      .showAlert(
        useLipTalkMode
          ? '구화 사용자 모드로 설정되었습니다.'
          : '일반 사용자 모드로 설정되었습니다.',
        'top'
     );
    setTimeout(() => {
      navigate('/main');
    }, 1000);
    } catch (error) {
      console.error('구화 모드 설정 실패', error);
    }
  };

  const handleToggle = (mode: boolean) => {
    setIsLipTalk(mode);
    handleSelect(mode);
  };

  return (
    <div css={overlay}>
      <div css={modal}>
        <button css={closeButton} onClick={onClose}>
          <X />
        </button>

        <h2 css={title}>구화 여부 확인하기</h2>
        <p css={desc}>
          튜토리얼은 <span className="highlight">내 정보 수정</span> &gt;{' '}
          <span className="highlight">가이드 북 보기</span> 에서 확인할 수 있습니다.
        </p>

        <div css={btnGroup}>
          <div css={slider(isLipTalk)} />
          <div css={toggleBtn(isLipTalk)} onClick={() => handleToggle(true)}>
            구화 사용자
          </div>
          <div css={toggleBtn(!isLipTalk)} onClick={() => handleToggle(false)}>
            일반 사용자
          </div>
        </div>
      </div>
    </div>
  );
}

const overlay = css`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const modal = css`
  background: white;
  border-radius: 20px;
  padding: clamp(30px, 5vw, 50px);
  width: clamp(320px, 90%, 560px);
  text-align: center;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const closeButton = css`
  position: absolute;
  top: 20px;
  right: 20px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #888;
  transition: color 0.2s ease;
  &:hover {
    color: #000;
  }
`;

const title = css`
  font-size: clamp(20px, 2.5vw, 24px);
  font-family: 'NanumSquareEB';
  color: #111;
`;

const desc = css`
  font-size: clamp(14px, 1.5vw, 16px);
  color: #555;
  line-height: 1.5;

  .highlight {
    color: var(--color-primary);
    font-family: 'NanumSquareB';
  }
`;

const btnGroup = css`
  display: flex;
  background: #f3f3f3;
  border-radius: 50px;
  padding: 6px;
  position: relative;
  overflow: hidden;
  height: 80px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.04);
`;

const slider = (active: boolean) => css`
  position: absolute;
  top: 6px;
  left: ${active ? '6px' : 'calc(50% + 0px)'};
  width: calc(50% - 6px);
  height: calc(100% - 12px);
  background: var(--color-primary);
  border-radius: 50px;
  transition: left 0.25s ease-in-out;
  z-index: 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
`;

const toggleBtn = (active: boolean) => css`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(18px, 2vw, 22px);
  font-weight: ${active ? '600' : '500'};
  cursor: pointer;
  z-index: 1;
  color: ${active ? '#fff' : '#555'};
  user-select: none;
  transition: color 0.2s ease;
`;
