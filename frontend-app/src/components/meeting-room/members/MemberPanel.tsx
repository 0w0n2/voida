/** @jsxImportSource @emotion/react */
import { css, keyframes } from '@emotion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMeetingRoomStore } from '@/store/meetingRoomStore';
import SettingModal from '@/components/meeting-room/modal/SettingModal';
import InfoModal from '@/components/meeting-room/modal/InfoModal';
import Lip from '@/assets/icons/lip-blue.png';
import Setting from '@/assets/icons/room-setting.png';
import Info from '@/assets/icons/info.png';
import Home from '@/assets/icons/home-gray.png';
import Crown from '@/assets/icons/crown.png';

const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.4); opacity: 0.4; }
  100% { transform: scale(1); opacity: 1; }
`;

const categoryColors: Record<string, string> = {
  게임: '#8e44ad',
  일상: '#f1c40f',
  학습: '#333333',
  회의: '#27ae60',
  자유: '#3498db',
};

const MemberPanel = ({ meetingRoomId }: { meetingRoomId: string }) => {
  const { participants, roomInfo } = useMeetingRoomStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const memberList = participants?.participants ?? [];
  // const myInfo = memberList.find((p) => p.isMine);
  const myInfo = memberList[0];
  const isHost = myInfo?.state === 'HOST';

  return (
    <aside css={panelStyle}>
      <div css={panelHeader}>
        <div>
          <h3>참여자</h3>
          <p>{roomInfo?.title ?? '대기방'} 참여자</p>
        </div>
        <div css={headerIcons}>
          <div css={iconWrapper} onClick={() => setIsModalOpen(true)}>
            <img
              src={isHost ? Setting : Info}
              alt={isHost ? '설정' : '정보'}
              css={iconStyle}
            />
            <span css={tooltip}>{isHost ? '설정' : '정보'}</span>
          </div>
          {isModalOpen &&
            (isHost ? (
              <SettingModal onClose={() => setIsModalOpen(false)} />
            ) : (
              <InfoModal onClose={() => setIsModalOpen(false)} />
            ))}

          <div css={iconWrapper} onClick={() => navigate('/main')}>
            <img src={Home} alt="홈" css={iconStyle} />
            <span css={tooltip}>홈으로</span>
          </div>
        </div>
      </div>

      <div css={listStyle}>
        {memberList.map((p) => (
          <div key={p.memberId} css={[cardStyle, p.isMine && myCardStyle]}>
            <div css={avatarWrapper}>
              <img src={p.profileImageUrl} alt={p.nickname} css={avatarStyle} />
              {p.state === 'HOST' && (
                <div css={hostBadge}>
                  <img src={Crown} alt="방장" css={crownIcon} />
                </div>
              )}
              <div css={activeBadge} />
            </div>
            <div css={infoBox}>
              <div css={nameRow}>
                <span css={nicknameStyle}>{p.nickname}</span>
                {p.lipTalkMode && (
                  <div css={lipIconWrapper}>
                    <img src={Lip} alt="구화" css={lipIcon} />
                    <span css={lipTooltip}>구화 사용자</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div css={roomInfoBox}>
        <h4>{roomInfo?.title}</h4>
        <button
          css={css`
            ${roomButton};
            color: ${categoryColors[roomInfo?.category || ''] || '#666'};
            background-color: ${categoryColors[roomInfo?.category || ''] ||
            '#999'}20;
            border: none;
          `}
        >
          {roomInfo?.category}
        </button>
      </div>
    </aside>
  );
};

export default MemberPanel;

const panelStyle = css`
  width: 450px;
  background: #f9f9f9;
  padding: 1.5rem;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
`;

const panelHeader = css`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin: 1rem;

  h3 {
    font-size: 24px;
    margin: 0;
    font-family: 'NanumSquareEB';
    margin-bottom: 1rem;
  }

  p {
    font-size: 16px;
    color: var(--color-gray-600);
    margin: 6px 0 0;
  }
`;

const headerIcons = css`
  display: flex;
  gap: 3px;
`;

const iconWrapper = css`
  position: relative;
  width: 45px;
  height: 45px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 8px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }

  &:hover span {
    opacity: 1;
    transform: translateY(0);
  }
`;

const tooltip = css`
  position: absolute;
  bottom: -28px;
  left: 50%;
  transform: translateX(-50%) translateY(4px);
  background: #333;
  color: #fff;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: all 0.2s ease;
`;

const iconStyle = css`
  width: 30px;
  height: 30px;
`;

const listStyle = css`
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25px;
`;

const cardStyle = css`
  display: flex;
  align-items: center;
  gap: 25px;
  padding: 1rem 2rem;
  padding-bottom: 1.5rem;
  background: white;
  border-radius: 100px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 90%;
`;

const myCardStyle = css`
  background: #eef6ff;
  border: 1px solid #d0e2ff;
`;

const avatarStyle = css`
  width: 55px;
  height: 55px;
  border-radius: 50%;
  object-fit: cover;
`;

const avatarWrapper = css`
  position: relative;
  width: 44px;
  height: 44px;
`;

const hostBadge = css`
  position: absolute;
  top: -6px;
  right: -15px;
  width: 22px;
  height: 22px;
  background-color: var(--color-yellow);
  border: 1.5px solid white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const crownIcon = css`
  width: 10px;
  height: 10px;
`;

const infoBox = css`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 10px;
`;

const nameRow = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const nicknameStyle = css`
  font-size: 18px;
  font-family: 'NanumSquareR';
`;

const lipIcon = css`
  width: 20px;
  height: 20px;
`;

const lipIconWrapper = css`
  position: relative;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 4px;
  transition: background-color 0.2s ease;
  margin-bottom: 12px;
  margin-right: 4px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }

  &:hover span {
    opacity: 1;
    transform: translateY(0);
  }
`;

const lipTooltip = css`
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%) translateY(4px);
  background: #333;
  color: #fff;
  font-size: 12px;
  padding: 4px 6px;
  border-radius: 4px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: all 0.2s ease;
  z-index: 10;
`;

const activeBadge = css`
  position: absolute;
  bottom: -5px;
  right: -12px;
  width: 15px;
  height: 15px;
  background-color: var(--color-green);
  border: 2px solid white;
  border-radius: 50%;
  animation: ${pulse} 4s infinite;
`;

const roomInfoBox = css`
  margin-top: auto;
  margin-left: -1.5rem;
  margin-right: -1.5rem;
  margin-bottom: -1.5rem;
  width: calc(100% + 3rem);
  height: 120px;
  padding: 1.5rem;
  padding-left: 2.5rem;
  background: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  text-align: left;

  h4 {
    font-size: 18px;
    font-family: 'NanumSquarEB';
    margin-bottom: 12px;
  }
`;

const roomButton = css`
  padding: 6px 12px;
  background: #f3f3f3;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    background: #eaeaea;
  }
`;
