/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import Setting from '@/assets/icons/room-setting.png';
import Close from '@/assets/icons/close.png';
import Home from '@/assets/icons/home-white.png';
import CategoryIcon from '@/assets/icons/category.png';
import Invite from '@/assets/icons/user-invite.png';
import sampleImage from '@/assets/category/category-game.png';
import profileImage from '@/assets/profiles/profile2.png';

type RoomSettingModalProps = {
  onClose: () => void;
};

const participants = [
  { id: 1, name: '이진모', state: 'HOST' },
  { id: 1, name: '이진모', state: 'PARTICIPANT' },
  { id: 1, name: '이진모', state: 'PARTICIPANT' },
  { id: 1, name: '이진모', state: 'PARTICIPANT' },
  { id: 1, name: '이진모', state: 'PARTICIPANT' },
];

const RoomSettingModal = ({ onClose }: RoomSettingModalProps) => {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [preview, setPreview] = useState<string>(sampleImage);

  const [roomTitle, setRoomTitle] = useState('');
  const [roomCategory, setRoomCategory] = useState('');
  const [inviteCode, setInviteCode] = useState('');

  useEffect(() => {
    setRoomTitle('게임하는 방');
    setRoomCategory('game');
    setInviteCode('010857365321sd12');
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  const toggleMenu = (id: number) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleSave = () => {
    console.log({
      roomTitle,
      roomCategory,
      inviteCode,
      preview,
    });
    onClose();
  };

  return (
    <div css={overlay}>
      <div css={modal}>
        <div css={modalHeader}>
          <div css={titleRow}>
            <img src={Setting} alt="방 설정 아이콘" css={Seeting} />
            <span css={titleText}>방 설정하기</span>
          </div>
          <img src={Close} alt="닫기 아이콘" css={closeBtn} onClick={onClose} />
        </div>

        <div css={contentRow}>
          <div css={left}>
            {/* 썸네일 */}
            <div css={imageBox}>
              <img src={preview} alt="방 이미지" />
              <div className="overlay">
                <label htmlFor="thumbnailUpload">
                  <div className="overlay-content">썸네일 변경</div>
                </label>
                <input
                  id="thumbnailUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            {/* 입력 */}
            <div css={inputGroup}>
              <div css={inputRow}>
                <div className="label active">
                  <img src={Home} alt="방 제목" />
                  <span>방 제목</span>
                </div>
                <input
                  type="text"
                  placeholder="방 제목을 입력해주세요."
                  value={roomTitle}
                  onChange={(e) => setRoomTitle(e.target.value)}
                />
              </div>

              <div css={inputRow}>
                <div className="label">
                  <img src={CategoryIcon} alt="카테고리" />
                  <span>카테고리</span>
                </div>
                <select
                  value={roomCategory}
                  onChange={(e) => setRoomCategory(e.target.value)}
                >
                  <option value="" disabled>
                    카테고리를 선택해주세요.
                  </option>
                  <option value="game">게임</option>
                  <option value="study">공부</option>
                </select>
              </div>

              <div css={inputRow}>
                <div className="label">
                  <img src={Invite} alt="초대코드" />
                  <span>초대코드</span>
                </div>
                <input type="text" readOnly value={inviteCode} />
                <button
                  css={copyBtn}
                  onClick={() => navigator.clipboard.writeText(inviteCode)}
                >
                  📋
                </button>
              </div>
            </div>

            {/* 버튼 */}
            <div css={btnRow}>
              <button css={deleteBtn}>방 삭제</button>
              <button css={saveBtn} onClick={handleSave}>
                설정 완료
              </button>
            </div>
          </div>

          {/* 참여자 */}
          <div css={right}>
            <span css={titleTextSmall}>현재 참여자</span>
            <div css={participantList}>
              {participants.map((p) => (
                <div key={p.id} css={participantItem}>
                  <img src={profileImage} alt={p.name} />
                  <span>{p.name}</span>
                  {p.isHost && <span css={hostIcon}>👑</span>}

                  <div css={menuWrapper}>
                    <button css={menuBtn} onClick={() => toggleMenu(p.id)}>
                      ⋯
                    </button>
                    {openMenuId === p.id && !p.isHost && (
                      <div css={menuDropdown}>
                        <div>방장 위임하기</div>
                        <div css={kick}>강퇴하기</div>
                      </div>
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

export default RoomSettingModal;

/* 스타일 */
const overlay = css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;
const modal = css`
  background: white;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  width: 1000px;
  height: 650px;
  overflow: hidden;
`;
const modalHeader = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-bottom: 1px solid #eee;
`;
const titleRow = css`
  display: flex;
  align-items: center;
`;
const Seeting = css`
  width: 24px;
  height: 24px;
  margin-right: 20px;
`;
const contentRow = css`
  flex: 1;
  display: flex;
  overflow: hidden;
`;
const titleTextSmall = css`
  font-size: 17px;
  font-weight: 600;
  color: #222;
`;
const left = css`
  flex: 1.5;
  display: flex;
  flex-direction: column;
  padding: 32px;
  border-right: 1px solid #f0f0f0;
  gap: 20px;
`;
const right = css`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 32px;
`;
const titleText = css`
  font-size: 20px;
  font-weight: 700;
  color: #222;
`;
const closeBtn = css`
  cursor: pointer;
  width: 28px;
  height: 28px;
  padding: 4px;
  border-radius: 6px;
  transition: background 0.2s ease;
  &:hover {
    background: rgba(0, 0, 0, 0.06);
  }
`;
const imageBox = css`
  position: relative;
  width: 80%;
  max-width: 350px;
  height: 200px;
  margin: 0 auto;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 12px;
    border: 1px solid #e5e5e5;
    display: block;
    background: #fafafa;
  }
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    cursor: pointer;
    border-radius: 12px;
    background: rgba(0, 0, 0, 0.55);
    label {
      cursor: pointer;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    input {
      display: none;
    }
    .overlay-content {
      color: #fff;
      font-size: 16px;
      font-weight: 600;
      text-align: center;
    }
  }
  &:hover .overlay {
    opacity: 1;
  }
`;
const inputGroup = css`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const inputRow = css`
  display: flex;
  align-items: center;
  height: 48px;
  border-radius: 100px;
  border: 1.5px solid #dcdcdc;
  background: #fafafa;
  overflow: hidden;
  transition: border 0.2s ease;
  &:hover {
    border-color: #3182f6;
  }
  &:hover .label:not(.active) {
    background: #3182f6;
    color: #fff;
  }
  .label {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 14px;
    background: #efefef;
    font-size: 14px;
    font-weight: 600;
    color: #666;
    height: 100%;
    transition: background 0.2s ease, color 0.2s ease;
    img {
      width: 18px;
      height: 18px;
    }
    &.active {
      background: #3182f6;
      color: #fff;
    }
  }
  input,
  select {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    padding: 0 14px;
    font-size: 14px;
    color: #333;
  }
  select {
    appearance: none;
    cursor: pointer;
  }
`;
const copyBtn = css`
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 18px;
  padding: 0 12px;
`;
const btnRow = css`
  display: flex;
  gap: 12px;
  margin-top: auto;
`;
const commonButton = `
  flex: 1;
  color: #fff;
  border: none;
  padding: 12px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
`;
const saveBtn = css`
  ${commonButton}
  background: #3182f6;
  &:hover {
    background: #2569d9;
  }
`;
const deleteBtn = css`
  ${commonButton}
  background: #f2f2f2;
  color: #d93a3a;
  &:hover {
    background: #ffeaea;
    color: #f74c4c;
  }
`;
const participantList = css`
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
`;
const participantItem = css`
  background: #fafafa;
  border-radius: 10px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  border: 1px solid #eee;
  img {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    object-fit: cover;
  }
`;
const hostIcon = css`
  color: #ffbb00;
  font-size: 18px;
`;
const menuWrapper = css`
  margin-left: auto;
  position: relative;
`;
const menuBtn = css`
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 20px;
  padding: 4px 8px;
`;
const menuDropdown = css`
  position: absolute;
  top: 36px;
  right: 0;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  min-width: 120px;
  z-index: 10;
  div {
    padding: 10px 14px;
    font-size: 14px;
    cursor: pointer;
    &:hover {
      background: #f5f5f5;
    }
  }
`;
const kick = css`
  color: #f74c4c;
`;
