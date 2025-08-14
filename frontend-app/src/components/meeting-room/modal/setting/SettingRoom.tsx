/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Home, RefreshCw, Copy, Camera, Grid, UserPlus } from 'lucide-react';
import { useMeetingRoomStore } from '@/stores/useMeetingRoomStore';
import { getInviteCode, postInviteCode, getRoomInfo, updateRoomInfo } from '@/apis/meeting-room/meetingRoomApi';
import { useAlertStore } from '@/stores/useAlertStore';

const SettingRoom = () => {
  const { roomInfo, setRoomInfo } = useMeetingRoomStore();
  const [title, setTitle] = useState(roomInfo?.title ?? '');
  const [category, setCategory] = useState(roomInfo?.category ?? '');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>(
    roomInfo?.thumbnailImageUrl?.toString() || '',
  );
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchInviteCode = useCallback(async () => {
    if (!roomInfo?.meetingRoomId) return;

    try {
      const res = await getInviteCode(roomInfo.meetingRoomId);
      if (
        typeof res.inviteCode !== 'string' ||
        res.inviteCode.includes('만료')
      ) {
        throw new Error('초대코드가 만료되었거나 유효하지 않음');
      }
      setInviteCode(res.inviteCode);
    } catch {
      const res = await postInviteCode(roomInfo.meetingRoomId);
      setInviteCode(res.inviteCode);
    }
  }, [roomInfo?.meetingRoomId]);

  useEffect(() => {
    fetchInviteCode();
  }, [fetchInviteCode]);

  const refreshCode = async () => {
    if (!roomInfo?.meetingRoomId) return;
    const res = await postInviteCode(roomInfo.meetingRoomId);
    setInviteCode(res.inviteCode);
  };

  const copyCode = () => {
    if (!inviteCode) return;
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

    const isTitleChanged = title.trim() !== roomInfo.title;
    const isCategoryChanged = category.trim() !== roomInfo.category;
    const isThumbnailChanged = !!thumbnailFile;

    if (!isTitleChanged && !isCategoryChanged && !isThumbnailChanged) {
      useAlertStore.getState().showAlert('변경된 내용이 없습니다.', 'top');
      return;
    }

    try {
      await updateRoomInfo(roomInfo.meetingRoomId, {
        title,
        category,
        thumbnailImageUrl: thumbnailFile ?? undefined,
      });

      const updatedRoomInfo = await getRoomInfo(roomInfo.meetingRoomId);
      setRoomInfo({
        ...updatedRoomInfo,
        meetingRoomId: roomInfo.meetingRoomId,
      });

      useAlertStore.getState().showAlert('방 정보가 수정되었습니다!', 'top');
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch {
      useAlertStore.getState().showAlert('방 정보 저장에 실패했습니다.', 'top');
    }
  };

  return (
    <>
      <div css={headerRow}>
        <h2>방 정보</h2>
      </div>

      <div css={thumbnailBox} onClick={handleThumbnailClick}>
        <img
          src={
            thumbnailPreview
              ? thumbnailPreview.startsWith('blob:')
                ? thumbnailPreview
                : `${import.meta.env.VITE_CDN_URL}/${thumbnailPreview.replace(
                    /^\/+/,
                    '',
                  )}`
              : '/default-thumbnail.png'
          }
          alt={roomInfo?.category || 'thumbnail'}
          css={thumbnail}
        />
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

      <div>
        <div css={fieldRow}>
          <div css={fieldIcon}>
            <Home />
          </div>
          <input
            css={fieldInput}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="방 제목을 입력해주세요."
          />
        </div>
      </div>
      <div css={fieldRow}>
        <div
          css={fieldIcon}
          style={{
            background: category
              ? categoryColors[category]
              : 'var(--color-primary)',
            color: '#fff',
          }}
        >
          <Grid />
        </div>
        <select
          css={select}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">카테고리를 선택해주세요.</option>
          <option value="game">게임</option>
          <option value="talk">일상</option>
          <option value="study">학습</option>
          <option value="meeting">회의</option>
          <option value="free">자유</option>
        </select>
      </div>

      <div css={fieldRow}>
        <div css={fieldIcon}>
          <UserPlus />
        </div>
        <input css={fieldInput} value={inviteCode ?? ''} readOnly />
        <button css={refreshButton} onClick={refreshCode}>
          <RefreshCw />
        </button>
        <button css={codeButton} onClick={copyCode}>
          <Copy />
        </button>
      </div>

      <div css={buttonRow}>
        <button css={saveButton} onClick={handleSave}>
          변경사항 저장
        </button>
      </div>
      {copied &&
        useAlertStore
          .getState()
          .showAlert('초대코드가 복사되었습니다!', 'bottom')}
    </>
  );
};

export default SettingRoom;

const fieldRow = css`
  display: flex;
  align-items: center;
  background: #f7f7f7;
  border-radius: 50px;
  padding: 10px 14px;
  border: 2px solid #eee;
  transition: border-color 0.2s ease, background-color 0.2s ease;

  &:hover {
    border: 2px solid var(--color-primary);
  }

  div {
    background: #ccc;
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
  caret-color: black;

  &::placeholder {
    color: var(--color-gray-600);
  }

  @media (max-width: 600px) {
    font-size: 15px;
  }
`;

const categoryColors: Record<string, string> = {
  game: '#8e44ad',
  talk: '#f1c40f',
  study: '#333333',
  meeting: '#27ae60',
  free: '#3498db',
};

const select = css`
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

  @media (max-width: 600px) {
    font-size: 15px;
  }
`;

const refreshButton = css`
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

const headerRow = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  h2 {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 8px;
  }
`;

const thumbnailBox = css`
  position: relative;
  width: 100%;
  max-width: 400px;
  aspect-ratio: 16 / 9;
  border: 2px dashed #ccc;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  margin: 0 auto;
`;

const thumbnail = css`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;

  @media (max-width: 600px) {
    width: 100%;
  }
`;

const thumbnailOverlay = css`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
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
  border-radius: 12px;

  &:hover {
    opacity: 1;
  }
`;

const buttonRow = css`
  display: flex;
  gap: 20px;
  margin-top: 20px;
  justify-content: right;
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
