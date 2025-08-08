/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';
import { Settings, Users, AlertTriangle, X } from 'lucide-react';
import SettingRoom from '@/components/meeting-room/modal/setting/SettingRoom';
import MemberRoom from '@/components/meeting-room/modal/setting/MemberRoom';
import DeleteRoom from '@/components/meeting-room/modal/setting/DeleteRoom';

type SettingModalProps = {
  onClose: () => void;
};

const SettingModal = ({ onClose }: SettingModalProps) => {
  const [activeTab, setActiveTab] = useState<'general' | 'members' | 'danger'>('general');

  return (
    <div css={overlay}>
      <div css={modal}>
        <X css={closeButton} onClick={onClose} />
       
        <div css={tabList}>
          <button className={activeTab === 'general' ? 'active' : ''} onClick={() => setActiveTab('general')}>
            <Settings size={18} style={{ marginTop: 3}} /> 일반 설정
          </button>
          <button className={activeTab === 'members' ? 'active' : ''} onClick={() => setActiveTab('members')}>
            <Users size={18} style={{ marginTop: 4}} /> 참여자 관리
          </button>
          <button className={activeTab === 'danger' ? 'active' : ''} onClick={() => setActiveTab('danger')}>
            <AlertTriangle size={18} style={{ marginTop: 2}} /> 방 삭제
          </button>
        </div>

        <div css={contentBox}>
          {activeTab === 'general' && <SettingRoom />}
          {activeTab === 'members' && <MemberRoom />}
          {activeTab === 'danger' && <DeleteRoom onClose={onClose} />}
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
  font-size: 24px;
  border: none;
  background: transparent;
  cursor: pointer;
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
  gap: 20px;
  padding-right: 32px;

  h2 {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 8px;
  }

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