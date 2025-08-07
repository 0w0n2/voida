/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { CrownIcon, UserMinus } from 'lucide-react';
import { delegateHost, kickMember } from '@/apis/meeting-room/meetingRoomApi';
import { useMeetingRoomStore } from '@/store/meetingRoomStore';
import Lip from '@/assets/icons/lip-blue.png';
import Crown from '@/assets/icons/crown.png';

const MemberRoom = () => {
  const { roomInfo, participants } = useMeetingRoomStore();
  console.log(participants);

  const handleDelegate = async (memberId: number) => {
    if (!roomInfo) return;
    await delegateHost(roomInfo.meetingRoomId, String(memberId));
  };

  const handleKick = async (memberId: number) => {
    if (!roomInfo) return;
    await kickMember(roomInfo.meetingRoomId, String(memberId));
  };

  return (
    <div>
      <div css={headerRow}>
        <h2>참여자 관리</h2>
        <span css={memberCount}>{participants?.participants.length}명</span>
      </div>

      <div css={listContainer}>
        {participants?.participants.map((user) => (
          <div
            key={user.memberId}
            css={[memberCard, user.isMine && myCardStyle]}
          >
            <div css={profileArea}>
              <img
                src={`${import.meta.env.VITE_CDN_URL}${user.profileImageUrl}`}
                alt={user.nickname}
                css={avatar}
              />
              <div>
                <div css={nameRow}>
                  <span>{user.nickname}</span>
                    {user.state === 'HOST' && (
                    <span css={roleBadge}>
                        <img src={Crown} alt="방장" css={crownImg} />
                        방장
                    </span>
                    )}
                  {user.lipTalkMode && (
                    <span css={lipIcon}>
                      <img src={Lip} alt="구화" css={lipImg} />
                      구화
                    </span>
                  )}
                </div>
              </div>
            </div>

            {!user.isMine && user.state !== 'HOST' && (
              <div css={buttonArea}>
                <button
                  css={changeRoleButton}
                  onClick={() => handleDelegate(user.memberId)}
                >
                    <CrownIcon size={18} />
                </button>
                <button
                  css={kickButton}
                  onClick={() => handleKick(user.memberId)}
                >
                  <UserMinus size={18} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemberRoom;

const headerRow = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  h2 {
    font-size: 18px;
    font-family: 'NanumSquareEB';
  }
`;

const memberCount = css`
  font-size: 14px;
  color: var(--color-text);
  background: #f7f7f7;
  padding: 5px 14px;
  border-radius: 20px;
`;

const listContainer = css`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const memberCard = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f7f7f7;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 14px 20px;
`;

const myCardStyle = css`
  background: linear-gradient(135deg, #eaf4ff 40%, #f3edff 70%, #e5dfff 100%);
  border: 1px solid #f3edff;
`;

const profileArea = css`
  display: flex;
  gap: 14px;
  align-items: center;
`;

const avatar = css`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #ddd;
  margin-right: 14px;
`;

const nameRow = css`
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 16px;
  font-family: 'NanumSquareB';
  gap: 20px;
`;

const roleBadge = css`
  background: var(--color-yellow);
  color: var(--color-text-white);
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  font-family: 'NanumSquareR';
  padding: 4px 10px;
  border-radius: 8px;
  gap: 6px;
`;

const lipIcon = css`
  background: #eaf4ff;
  color: var(--color-primary);
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  font-family: 'NanumSquareR';
  padding: 4px 10px;
  border-radius: 8px;
  gap: 6px;
`;

const crownImg = css`
  width: 12px;
  height: 12px;
`;

const lipImg = css`
  width: 16px;
  height: 16px;
`;


const buttonArea = css`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const changeRoleButton = css`
  padding: 6px;
  border: none;
  background: #ffffffff;
  border-radius: 6px;
  cursor: pointer;

  svg {
    color: var(--color-gray-300);
  }

  &:hover {
  background: #fffbea;
    svg {
        color: var(--color-yellow);
    }
  }
`;


const kickButton = css`
  padding: 6px;
  border: none;
  background: #ffffffff;
  border-radius: 6px;
  cursor: pointer;

  svg {
    color: var(--color-gray-400);
  }

  &:hover {
  background: #ffeaea;
    svg {
        color: var(--color-red);
    }
  }
`;
