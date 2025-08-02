/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useMeetingRoomStore } from '@/store/meetingRoomStore';
import { leaveRoom } from '@/apis/meetingRoomApi';
import { Info, X, UserRoundSearch, Home, Grid } from 'lucide-react';
import CrownIcon from '@/assets/icons/crown-yellow.png';

type SettingModalProps = {
  onClose: () => void;
};

const categoryColors: Record<string, string> = {
  게임: '#8e44ad',
  일상: '#f1c40f',
  학습: '#333333',
  회의: '#27ae60',
  자유: '#3498db',
};

const SettingModal = ({ onClose }: SettingModalProps) => {
  const { roomInfo, participants } = useMeetingRoomStore();

  const handleLeave = async (memberId: number) => {
    if (!roomInfo) return;
    await leaveRoom(roomInfo.id, String(memberId));
  };

  return (
    <div css={overlay}>
      <div css={modal}>
        <X css={closeButton} onClick={onClose} />
        <div css={modalContent}>
          <div css={leftSection}>
            <div css={headerRow}>
              <Info css={iconStyle} />
              <h2>방 정보</h2>
            </div>

            <div css={thumbnailBox}>
              <img
                src={roomInfo?.thumbnailImageUrl}
                alt="썸네일"
                css={thumbnail}
              />
            </div>

            <div css={fieldRow}>
              <div css={fieldIcon}>
                <Home />
              </div>
              <input css={fieldInput} value={roomInfo?.title} disabled />
            </div>

            <div css={fieldRow}>
              <div
                css={[
                  fieldIcon,
                  {
                    background: categoryColors[roomInfo!.category],
                    color: '#fff',
                  },
                ]}
              >
                <Grid />
              </div>
              <div
                css={{
                  flex: 1,
                  fontSize: '16px',
                  color: '#333',
                  padding: '8px 0',
                }}
              >
                {roomInfo!.category}
              </div>
            </div>

            <div css={buttonRow}>
              <button css={leaveButton} onClick={handleLeave}>
                방 탈퇴하기
              </button>
            </div>
          </div>

          <div css={rightSection}>
            <div css={headerRow}>
              <UserRoundSearch />
              <h2>현재 참여자</h2>
            </div>

            <div css={participantsBox}>
              {participants?.participants.map((p) => (
                <div key={p.memberId} css={participantRow}>
                  <div css={participantInfo}>
                    <img
                      src={p.profileImageUrl}
                      alt={p.nickname}
                      css={avatar}
                    />
                    <span>{p.nickname}</span>
                    {p.state === 'HOST' && (
                      <img src={CrownIcon} css={hostIcon} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
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
  width: 1000px;
  max-height: 90%;
  overflow-y: auto;
  position: relative;
`;

const modalContent = css`
  display: flex;
  gap: 40px;
`;

const leftSection = css`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const rightSection = css`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
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

const headerRow = css`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  margin-left: 40px;
  font-family: 'NanumSquareEB';
`;

const iconStyle = css`
  width: 24px;
  height: 24px;
`;

const thumbnailBox = css`
  position: relative;
  cursor: pointer;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  justify-content: center;

  aspect-ratio: 18/9;
`;

const thumbnail = css`
  width: 80%;
  border-radius: 10px;
  object-fit: cover;
`;

const fieldRow = css`
  display: flex;
  align-items: center;
  background: #f7f7f7;
  border-radius: 50px;
  padding: 6px 14px;
  border: 2px solid #e0e0e0;
  transition: border-color 0.2s ease, background-color 0.2s ease;
`;

const fieldIcon = css`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  flex-shrink: 0;
  background: var(--color-primary);
  svg {
    width: 18px;
    height: 18px;
    color: #fff;
  }
`;

const fieldInput = css`
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 16px;
  color: #333;
  padding: 8px 0;

  &::placeholder {
    color: #aaa;
  }
`;

const buttonRow = css`
  display: flex;
  gap: 20px;
  margin-top: 20px;
  justify-content: center;
  align-items: center;
`;

const baseButton = `
  padding: 12px 30px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-family: 'NanumSquareB';
  cursor: pointer;
`;

const leaveButton = css`
  ${baseButton}
  background: var(--color-gray-100);
  color: var(--color-gray-600);
  transition: all 0.2s ease;

  &:hover {
    background: var(--color-red);
    color: var(--color-text-white);
  }
`;

const participantsBox = css`
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
`;

const participantRow = css`
  background: var(--color-gray-100);
  padding: 14px 22px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 80%;
`;

const participantInfo = css`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const avatar = css`
  width: 36px;
  height: 36px;
  border-radius: 50%;
`;

const hostIcon = css`
  width: 14px;
  height: 14px;
`;
