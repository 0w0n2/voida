/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useRef } from 'react';
import { useMeetingRoomStore } from '@/store/meetingRoomStore';
import {
  updateRoomInfo,
  deleteRoom,
  delegateHost,
  kickMember,
} from '@/apis/meetingRoomApi';
import {
  MoreHorizontal,
  Settings,
  Camera,
  X,
  UserRoundSearch,
  Crown,
  UserMinus,
  Home,
  Grid,
  UserPlus,
  Copy,
} from 'lucide-react';
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
  const {
    roomInfo,
    participants,
    updateRoomInfo: updateStore,
  } = useMeetingRoomStore();

  const [title, setTitle] = useState(roomInfo?.title ?? '');
  const [category, setCategory] = useState(roomInfo?.category ?? '');
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(
    roomInfo?.thumbnailImageUrl || '',
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleThumbnailClick = () => {
    fileInputRef.current?.click();
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbnailFile(file);
    const previewUrl = URL.createObjectURL(file);
    setThumbnailPreview(previewUrl);
  };

  const handleSave = async () => {
    if (!roomInfo) return;

    if (!title.trim() && !category.trim() && !thumbnailFile) {
      alert(
        '방 제목, 썸네일, 카테고리 중 하나는 반드시 입력 또는 변경해야 합니다.',
      );
      return;
    }

    await updateRoomInfo(roomInfo.id, { title, category });

    // if (thumbnailFile) {
    //   const formData = new FormData();
    //   formData.append('thumbnail', thumbnailFile);
    //   await uploadThumbnailApi(roomInfo.id, formData);
    // }

    updateStore({ title, category });
    onClose();
  };

  const handleDelete = async () => {
    if (!roomInfo) return;
    await deleteRoom(roomInfo.id);
  };

  const handleDelegate = async (memberId: number) => {
    if (!roomInfo) return;
    await delegateHost(roomInfo.id, String(memberId));
  };

  const handleKick = async (memberId: number) => {
    if (!roomInfo) return;
    await kickMember(roomInfo.id, String(memberId));
  };

  const copyCode = () => {
    const code = '010857365321sd12';
    navigator.clipboard.writeText(code);
    alert('초대코드가 복사되었습니다.');
  };

  return (
    <div css={overlay}>
      <div css={modal}>
        <X css={closeButton} onClick={onClose} />
        <div css={modalContent}>
          <div css={leftSection}>
            <div css={headerRow}>
              <Settings css={iconStyle} />
              <h2>방 설정하기</h2>
            </div>

            <div css={thumbnailBox} onClick={handleThumbnailClick}>
              <img src={thumbnailPreview} alt="썸네일" css={thumbnail} />
              <div css={thumbnailOverlay}>
                <Camera />
                <span>이미지 변경</span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleThumbnailChange}
              />
            </div>

            <div css={fieldRow}>
              <div css={[fieldIcon, { background: '#ccc' }]}>
                <Home />
              </div>
              <input
                css={fieldInput}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="방 제목을 입력해주세요."
              />
            </div>

            <div css={[fieldRow, category]}>
              <div
                css={[
                  fieldIcon,
                  category
                    ? { background: categoryColors[category], color: '#fff' }
                    : { background: '#ccc' },
                ]}
              >
                <Grid />
              </div>
              <select
                css={selectStyle}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">카테고리를 선택해주세요.</option>
                <option value="게임">게임</option>
                <option value="일상">일상</option>
                <option value="학습">학습</option>
                <option value="회의">회의</option>
                <option value="자유">자유</option>
              </select>
            </div>

            <div css={fieldRow}>
              <div css={[fieldIcon, { background: '#ccc' }]}>
                <UserPlus />
              </div>
              <input css={fieldInput} value={'010857365321sd12'} readOnly />
              <button css={codeButton} onClick={copyCode}>
                <Copy />
              </button>
            </div>

            <div css={buttonRow}>
              <button css={saveButton} onClick={handleSave}>
                설정 저장
              </button>
              <button css={deleteButton} onClick={handleDelete}>
                방 삭제하기
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

                  {p.state !== 'HOST' && (
                    <div css={menuWrapper}>
                      <button
                        css={menuButton}
                        onClick={() =>
                          setMenuOpenId(
                            menuOpenId === p.memberId ? null : p.memberId,
                          )
                        }
                      >
                        <MoreHorizontal />
                      </button>
                      {menuOpenId === p.memberId && (
                        <div css={menuDropdown}>
                          <button onClick={() => handleDelegate(p.memberId)}>
                            <Crown />
                            위임하기
                          </button>
                          <button
                            css={kickButton}
                            onClick={() => handleKick(p.memberId)}
                          >
                            <UserMinus />
                            추방하기
                          </button>
                        </div>
                      )}
                    </div>
                  )}
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
  gap: 16px;
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

const thumbnailOverlay = css`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80%;
  height: 100%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.4);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
  font-size: 14px;
  gap: 8px;
  border-radius: 10px;
  &:hover {
    opacity: 1;
  }
`;

const fieldRow = css`
  display: flex;
  align-items: center;
  background: #f7f7f7;
  border-radius: 50px;
  padding: 6px 14px;
  border: 2px solid #e0e0e0;
  transition: border-color 0.2s ease, background-color 0.2s ease;

  &:hover {
    border-color: var(--color-primary);
  }

  &:hover > div {
    background: var(--color-primary);
  }
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
    color: var(--color-gray-600);
  }
`;

const selectStyle = css`
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 16px;
  color: #333;
  padding: 8px 0;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='16' height='16' fill='none' stroke='%23666' stroke-width='2' viewBox='0 0 24 24'%3E%3Cpath d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 16px 16px;
  cursor: pointer;
`;

const codeButton = css`
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }

  &:hover {
    opacity: 0.8;
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

const saveButton = css`
  ${baseButton}
  background: var(--color-primary);
  color: white;
  &:hover {
    background: var(--color-primary-dark);
  }
`;

const deleteButton = css`
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

const menuWrapper = css`
  position: relative;
`;

const menuButton = css`
  border: none;
  background: transparent;
  cursor: pointer;
`;

const menuDropdown = css`
  position: absolute;
  right: 0;
  top: 30px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  min-width: 140px;
  padding: 2px 0;
  z-index: 1000;

  button {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 15px;
    font-weight: 500;
    text-align: left;
    transition: background-color 0.2s ease;
    margin: 2px;
    font-family: 'NanumSquareR';

    svg {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    &:hover {
      background: #f5f5f5;
      border-radius: 12px;
    }
  }
`;

const kickButton = css`
  color: #e54848 !important;

  &:hover {
    background: #fff5f5 !important;
  }

  svg {
    color: #e54848;
  }
`;
