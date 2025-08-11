/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';
import { Info, Users, AlertTriangle, X } from 'lucide-react';
import InfoRoom from '@/components/meeting-room/modal/info/InfoRoom';
import MemberRoom from '@/components/meeting-room/modal/info/MemberRoom';
import LeaveRoom from '@/components/meeting-room/modal/info/LeaveRoom';

type SettingModalProps = {
  onClose: () => void;
};

const SettingModal = ({ onClose }: SettingModalProps) => {
  const [activeTab, setActiveTab] = useState<'general' | 'members' | 'danger'>(
    'general',
  );

  return (
    <div css={overlay}>
      <div css={modal}>
        <X size={30} css={closeButton} onClick={onClose} />

        <div css={tabList}>
          <button
            className={activeTab === 'general' ? 'active' : ''}
            onClick={() => setActiveTab('general')}
          >
            <Info size={18} style={{ marginTop: 3 }} /> 일반 정보
          </button>
          <button
            className={activeTab === 'members' ? 'active' : ''}
            onClick={() => setActiveTab('members')}
          >
            <Users size={18} style={{ marginTop: 4 }} /> 참여자 확인
          </button>
          <button
            className={activeTab === 'danger' ? 'active' : ''}
            onClick={() => setActiveTab('danger')}
          >
            <AlertTriangle size={18} style={{ marginTop: 2 }} /> 방 탈퇴
          </button>
        </div>

        <div css={contentBox}>
          {activeTab === 'general' && <InfoRoom />}
          {activeTab === 'members' && <MemberRoom />}
          {activeTab === 'danger' && <LeaveRoom onClose={onClose} />}
        </div>
      </div>
    </div>
  );
};

export default SettingModal;

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
  padding: 50px;
  padding-right: 80px;
  width: 1000px;
  max-height: 90%;
  overflow-y: auto;
  position: relative;

  display: flex;
  gap: 32px;

  @media (max-width: 1200px) {
    width: 90%;
    padding: 40px;
  }

  @media (max-width: 900px) {
    flex-direction: column;
    width: 95%;
    padding: 30px;
  }

  @media (max-width: 600px) {
    padding: 20px;
  }
`;

const closeButton = css`
  position: absolute;
  top: 20px;
  right: 20px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #888;
  transition: color 0.2s ease;
  &:hover {
    color: #000;
  }
`;

const tabList = css`
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 150px;
  margin-right: 32px;

  button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    border-radius: 12px;
    background: transparent;
    border: none;
    font-weight: 500;
    font-size: 16px;
    color: #333;
    cursor: pointer;

    &.active {
      background: #eef0f3;
      color: #000;
    }
  }
`;

const contentBox = css`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0px;
  padding-right: 32px;

  label {
    font-weight: 500;
    margin-bottom: 6px;
    display: block;
    font-size: 14px;
    color: #222;
  }

  .row {
    display: flex;
    gap: 16px;
    align-items: center;
  }
`;
