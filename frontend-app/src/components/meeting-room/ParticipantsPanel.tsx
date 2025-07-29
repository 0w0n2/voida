/** @jsxImportSource @emotion/react */
import { css, keyframes } from '@emotion/react';
import { useEffect, useState } from 'react';
import type { RoomParticipant } from '@/apis/meetingRoomApi';
import profile2 from '@/assets/profiles/profile2.png';
import profile3 from '@/assets/profiles/profile3.png';
import Lip from '@/assets/icons/lip-red.png';
import Setting from '@/assets/icons/room-setting.png';
import Home from '@/assets/icons/home-gray.png';
import Crown from '@/assets/icons/crown.png';

const dummyParticipants: RoomParticipant[] = [
  {
    memberId: 1,
    nickname: '민희',
    profileImageUrl: profile2,
    state: 'HOST',
    lipTalkMode: true,
  },
  {
    memberId: 2,
    nickname: '준호',
    profileImageUrl: profile3,
    state: 'PARTICIPANT',
    lipTalkMode: false,
  },
  {
    memberId: 2,
    nickname: '준호',
    profileImageUrl: profile3,
    state: 'PARTICIPANT',
    lipTalkMode: false,
  },
  {
    memberId: 2,
    nickname: '준호',
    profileImageUrl: profile3,
    state: 'PARTICIPANT',
    lipTalkMode: false,
  },
  {
    memberId: 2,
    nickname: '준호',
    profileImageUrl: profile3,
    state: 'PARTICIPANT',
    lipTalkMode: false,
  },
  {
    memberId: 2,
    nickname: '준호',
    profileImageUrl: profile3,
    state: 'PARTICIPANT',
    lipTalkMode: false,
  },
];

const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.4); opacity: 0.4; }
  100% { transform: scale(1); opacity: 1; }
`;

const ParticipantsPanel = ({ meetingRoomId }: { meetingRoomId: string }) => {
  const [participants, setParticipants] =
    useState<RoomParticipant[]>(dummyParticipants);

  useEffect(() => {
    // API 연동
    // getParticipants(meetingRoomId).then((res) => setParticipants(res.data));
  }, [meetingRoomId]);

  return (
    <aside css={panelStyle}>
      <div css={panelHeader}>
        <div>
          <h3>참여자</h3>
          <p>현재 참여자를 확인해보세요.</p>
        </div>
        <div css={headerIcons}>
          <div css={iconWrapper}>
            <img src={Setting} alt="설정" css={iconStyle} />
            <span css={tooltip}>설정</span>
          </div>
          <div css={iconWrapper}>
            <img src={Home} alt="홈" css={iconStyle} />
            <span css={tooltip}>홈으로</span>
          </div>
        </div>
      </div>

      <div css={listStyle}>
        {participants.map((p) => (
          <div key={p.memberId} css={cardStyle}>
            <div css={avatarWrapper}>
              <img src={p.profileImageUrl} alt={p.nickname} css={avatarStyle} />
              {p.state === 'HOST' && (
                <div css={hostBadge}>
                  <img src={Crown} alt="방장" css={crownIcon} />
                </div>
              )}
              <div css={activeBadge} />
              {/*p.isActive && <div css={activeBadge} />*/}
            </div>
            <div css={infoBox}>
              <div css={nameRow}>
                <span>{p.nickname}</span>
                {p.lipTalkMode && <img src={Lip} alt="구화" css={lipIcon} />}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div css={roomInfoBox}>
        <h4>{'모비노기 게임 레이드 같이해요!'}</h4>
        <button css={roomButton}>게임</button>
      </div>
    </aside>
  );
};

export default ParticipantsPanel;

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
    font-size: 18px;
    color: #666;
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
  gap: 20px;
`;

const cardStyle = css`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 1.5rem 2rem;
  background: white;
  border-radius: 100px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 90%;
`;

const avatarStyle = css`
  width: 50px;
  height: 50px;
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
  right: -12px;
  width: 22px;
  height: 22px;
  background-color: #ffcc00;
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

  span {
    font-size: 18px;
    font-family: 'NanumSquareR';
  }
`;

const lipIcon = css`
  width: 20px;
  height: 20px;
  margin-bottom: 20px;
`;

const activeBadge = css`
  position: absolute;
  bottom: -2px;
  right: -9px;
  width: 14px;
  height: 14px;
  background-color: #4ade80;
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
  height: 130px;
  padding: 2rem;
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
