/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { CrownIcon, UserMinus } from 'lucide-react';
import { delegateHost, kickMember } from '@/apis/meeting-room/meetingRoomApi';
import { useMeetingRoomStore } from '@/stores/useMeetingRoomStore';
import Lip from '@/assets/icons/lip-blue.png';
import Crown from '@/assets/icons/crown.png';
import { useAlertStore } from '@/stores/useAlertStore';

const MemberRoom = () => {
  const { roomInfo, participants } = useMeetingRoomStore();

  const handleDelegate = async (memberId: number) => {
    if (!roomInfo) return;
    await delegateHost(roomInfo.meetingRoomId, String(memberId));
    useAlertStore.getState().showAlert('방장이 위임되었습니다.', 'top');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleKick = async (memberId: number) => {
    if (!roomInfo) return;
    await kickMember(roomInfo.meetingRoomId, String(memberId));
    useAlertStore.getState().showAlert('참여자 강퇴가 완료되었습니다.', 'top');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
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
            key={user.memberUuid}
            css={[memberCard, user.mine && myCardStyle]}
          >
            <div css={profileArea}>
              <img
                src={`${import.meta.env.VITE_CDN_URL}/${user.profileImageUrl}`}
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

            {!user.mine && user.state !== 'HOST' && (
              <div css={buttonArea}>
                <div css={tooltipWrapper}>
                  <button
                    css={changeRoleButton}
                    onClick={() => handleDelegate(user.memberUuid)}
                  >
                    <CrownIcon size={18} />
                  </button>
                  <span css={tooltip}>방장 위임</span>
                </div>

                <div css={tooltipWrapper}>
                  <button
                    css={kickButton}
                    onClick={() => handleKick(user.memberUuid)}
                  >
                    <UserMinus size={18} />
                  </button>
                  <span css={tooltip}>강퇴</span>
                </div>
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
  background: #ffffffff;
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

const tooltipWrapper = css`
  position: relative;
  display: inline-block;

  &:hover span {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
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
  z-index: 10;
`;
