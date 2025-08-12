/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMeetingRoomStore } from '@/stores/useMeetingRoomStore';
import SettingModal from '@/components/meeting-room/modal/setting/SettingModal';
import InfoModal from '@/components/meeting-room/modal/info/InfoModal';
import Lip from '@/assets/icons/lip-blue.png';
import Setting from '@/assets/icons/room-setting.png';
import Info from '@/assets/icons/info.png';
import Home from '@/assets/icons/home-gray.png';
import Crown from '@/assets/icons/crown.png';

const MemberPanel = () => {
  const { participants, roomInfo } = useMeetingRoomStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const memberList = participants?.participants ?? [];

  const myInfo = memberList.find((p) => p.mine);
  const isHost = myInfo ? myInfo.state === 'HOST' : false;

  return (
    <aside css={panelStyle}>
      <div css={panelHeader}>
        <div>
          <h3>참여자</h3>
          <p>{roomInfo?.title ?? '대기방'}</p>
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
          <div key={p.memberUuid} css={[cardStyle, p.mine && myCardStyle]}>
            <div css={avatarWrapper}>
              <img
                src={`${import.meta.env.VITE_CDN_URL}/${p.profileImageUrl}`}
                alt={p.nickname}
                css={avatarStyle}
              />
              {p.state === 'HOST' && (
                <div css={hostBadge}>
                  <img src={Crown} alt="방장" css={crownIcon} />
                </div>
              )}
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
        <div css={roomInfoLeft}>
          <h4>{roomInfo?.title}</h4>
          <button
            css={css`
              ${roomButton};
              color: ${categoryColors[roomInfo?.category || ''] || '#666'};
              background-color: ${categoryColors[roomInfo?.category || ''] || '#999'}20;
              border: none;
            `}
          >
            {categoryLabels[roomInfo?.category || ''] || '기타'}
          </button>
        </div>

        {roomInfo?.thumbnailImageUrl && (
          <img
            src={`${import.meta.env.VITE_CDN_URL}/${roomInfo.thumbnailImageUrl}`}
            alt="방 썸네일"
            css={thumbnailStyle}
          />
        )}
      </div>
    </aside>
  );
};

export default MemberPanel;

const categoryColors: Record<string, string> = {
  game: '#8e44ad',
  talk: '#f1c40f',
  study: '#333333',
  meeting: '#27ae60',
  free: '#3498db',
};

const categoryLabels: Record<string, string> = {
  game: '게임',
  talk: '일상',
  study: '학습',
  meeting: '회의',
  free: '자유',
};

const panelStyle = css`
  width: 450px;
  background: #f9f9f9;
  padding: 1.5rem;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;

  @media (max-width: 1400px) {
    width: 400px;
  }
  @media (max-width: 1200px) {
    width: 350px;
  }
  @media (max-width: 900px) {
    width: 100%;
    border-right: none;
    border-top: 1px solid #ddd;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }
  @media (max-width: 600px) {
    padding: 1rem;
  }
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

  @media (max-width: 900px) {
    max-width: 100%;
    border-radius: 20px;
    padding: 1rem;
    gap: 16px;
  }
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const myCardStyle = css`
  background: linear-gradient(135deg, #eaf4ff 40%, #f3edff 70%, #e5dfff 100%);
  border: 1px solid #f3edff;
`;

const avatarStyle = css`
  width: 55px;
  height: 55px;
  border-radius: 50%;
  object-fit: cover;

  @media (max-width: 1400px) {
    width: 48px;
    height: 48px;
  }
  @media (max-width: 1200px) {
    width: 42px;
    height: 42px;
  }
  @media (max-width: 900px) {
    width: 36px;
    height: 36px;
  }
  @media (max-width: 600px) {
    width: 32px;
    height: 32px;
  }
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

  @media (max-width: 900px) {
    height: auto;
    padding: 1rem;
  }
  @media (max-width: 600px) {
    h4 {
      font-size: 16px;
    }
  }
`;

const nameRow = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const nicknameStyle = css`
  font-size: 18px;
  font-family: 'NanumSquareR';

  @media (max-width: 1200px) {
    font-size: 16px;
  }
  @media (max-width: 900px) {
    font-size: 15px;
  }
  @media (max-width: 600px) {
    font-size: 14px;
  }
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

const roomInfoBox = css`
  box-sizing: border-box;
  margin-top: auto;
  margin-left: -1.5rem;
  margin-right: -1.5rem;
  margin-bottom: -1.5rem;
  width: calc(100% + 3rem);
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);

  h4 {
    font-size: 18px;
    font-family: 'NanumSquareEB';
    margin-bottom: 12px;
  }

  @media (max-width: 1400px) {
    height: 100px;
    padding: 12px 40px;
  }

  @media (max-width: 1200px) {
    height: 90px;
    padding: 10px 30px;
  }

  @media (max-width: 900px) {
    height: 80px;
    padding: 8px 20px;
  }

  @media (max-width: 600px) {
    height: 70px;
    padding: 6px 12px;
  }
`;

const roomButton = css`
  display: inline-flex;
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

const roomInfoLeft = css`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;

  h4 {
    font-size: 18px;
    font-family: 'NanumSquareEB';
    margin: 0;
  }
`;

const thumbnailStyle = css`
  width: 130px;
  aspect-ratio: 16 / 9;
  border-radius: 8px;
  object-fit: cover;
`;
