/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Home, Grid } from 'lucide-react';
import { useMeetingRoomStore } from '@/store/meetingRoomStore';

const InfoRoom = () => {
  const { roomInfo } = useMeetingRoomStore();

  const thumbnailPreview = roomInfo?.thumbnailImageUrl
    ? `${import.meta.env.VITE_CDN_URL}/${roomInfo.thumbnailImageUrl}`
    : '/default-thumbnail.png';

  return (
    <>
      <div css={headerRow}>
        <h2>방 정보</h2>
      </div>

      <div css={[thumbnailBox, noPointer]}>
        <img
          src={thumbnailPreview}
          alt={roomInfo?.category || 'thumbnail'}
          css={thumbnail}
        />
      </div>

      <div css={fieldRow}>
        <div css={fieldIcon}>
          <Home />
        </div>
        <input
          css={fieldInput}
          value={roomInfo?.title ?? ''}
          readOnly
          placeholder="방 제목"
        />
      </div>

      <div css={fieldRow}>
        <div
          css={fieldIcon}
          style={{
            background: roomInfo?.category
              ? categoryColors[roomInfo.category]
              : 'var(--color-primary)',
            color: '#fff',
          }}
        >
          <Grid />
        </div>
        <select css={select} value={roomInfo?.category ?? ''} disabled>
          <option value="">카테고리를 선택해주세요.</option>
          <option value="game">게임</option>
          <option value="talk">일상</option>
          <option value="study">학습</option>
          <option value="meeting">회의</option>
          <option value="free">자유</option>
        </select>
      </div>
    </>
  );
};

export default InfoRoom;

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

const fieldRow = css`
  display: flex;
  align-items: center;
  background: #f7f7f7;
  border-radius: 50px;
  padding: 10px 14px;
  border: 2px solid #eee;
  margin-top: 20px;
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
  background: #ccc;
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
`;

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
  cursor: not-allowed;
`;

const categoryColors: Record<string, string> = {
  game: '#8e44ad',
  talk: '#f1c40f',
  study: '#333333',
  meeting: '#27ae60',
  free: '#3498db',
};

const thumbnailBox = css`
  position: relative;
  width: 100%;
  max-width: 400px;
  aspect-ratio: 16 / 9;
  border: 2px solid #eee;
  border-radius: 12px;
  overflow: hidden;
  margin: 0 auto;
`;

const noPointer = css`
  pointer-events: none;
`;

const thumbnail = css`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
`;