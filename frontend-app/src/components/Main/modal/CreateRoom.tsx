/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { X, Camera, Grid, Home, Plus, UserRound, Copy } from 'lucide-react';
import { useState, useRef } from 'react';
import { createRoom, getInviteCode } from '@/apis/meetingRoomApi';

interface CreateRoomModalProps {
  onClose: () => void;
}

const categoryColors: Record<string, string> = {
  게임: '#8e44ad',
  일상: '#f1c40f',
  학습: '#333333',
  회의: '#27ae60',
  자유: '#3498db',
};

const CreateRoomModal = ({ onClose }: CreateRoomModalProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<string | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false); // 복사 알림 상태

  const handleThumbnailClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setThumbnailImageUrl(url);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setThumbnailImageUrl(url);
    }
  };

  const handleCreate = async () => {
    const thumbnail = thumbnailImageUrl ?? 'null';
    setIsLoading(true);

    try {
      // 1. 방 생성
      const room = await createRoom(title, category, thumbnail);

      // 2. 초대코드 요청
      const { inviteCode } = await getInviteCode(room.meetingRoomId);

      // 3. 화면에 초대코드 표시
      setInviteCode(inviteCode);
    } catch (error) {
      console.error('방 생성 또는 초대코드 요청 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!inviteCode) return;
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div css={overlay}>
      <div css={modal}>
        {isLoading && (
          <div css={loadingOverlay}>
            <div css={loadingBox}>
              <div css={spinner} />
              <p>초대코드 로딩 중 입니다.</p>
            </div>
          </div>
        )}

        {inviteCode ? (
          <>
            <X css={closeButton} onClick={onClose} />
            <h2 css={codeTitle}>코드 확인하기</h2>
            <div css={codeDisplay}>
              <span>초대코드</span>
              <button css={copyButton} onClick={handleCopy}>
                <Copy />
              </button>
              <p>{inviteCode}</p>
              {copied && <div css={toastAlert}>초대코드가 복사되었습니다!</div>}
            </div>

            <h3 css={infoTitle}>방 초대코드를 전송해보세요!</h3>
            <ul css={infoList}>
              <li>초대코드는 방 생성 후 24시간 내까지 유효합니다.</li>
              <li>초대코드는 방 설정에서 다시 확인하실 수 있습니다.</li>
            </ul>
          </>
        ) : (
          <>
            <X css={closeButton} onClick={onClose} />
            <div css={headerRow}>
              <h2>방 생성하기</h2>
            </div>

            <div
              css={[thumbnailBox, isDragging && dragActive]}
              onClick={handleThumbnailClick}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {thumbnailImageUrl ? (
                <>
                  <img
                    src={thumbnailImageUrl}
                    css={thumbnailImage}
                    alt="썸네일"
                  />
                  <div
                    css={[
                      thumbnailOverlay,
                      isDragging && thumbnailOverlayActive,
                    ]}
                  >
                    {isDragging ? (
                      <span>이미지를 여기에 놓으세요</span>
                    ) : (
                      <>
                        <Camera />
                        <span>이미지 변경</span>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <div css={emptyBoxText}>
                  {isDragging ? (
                    '이미지를 여기에 놓으세요'
                  ) : (
                    <>
                      클릭 또는 드래그해 이미지 추가
                      <br />
                      (미선택 시 카테고리 기본 이미지 적용)
                    </>
                  )}
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileInputChange}
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

            <div css={fieldRow}>
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
                css={[
                  selectStyle,
                  category === '' && { color: 'var(--color-gray-600)' },
                ]}
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

            <div css={buttonRow}>
              <button css={createButton} onClick={handleCreate}>
                <Plus size={30} /> 방 생성하기
              </button>
            </div>

            <p css={guideText}>
              <UserRound size={20} />
              6명의 인원 제한이 있습니다.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateRoomModal;

const loadingOverlay = css`
  position: absolute;
  inset: 0;
  background: var(--color-bg-white);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
`;

const loadingBox = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  font-size: 20px;
  font-family: 'NanumSquareB';
`;

const spinner = css`
  width: 80px;
  height: 80px;
  border: 8px solid #ccc;
  border-top: 8px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

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
  padding: 40px;
  width: 600px;
  max-height: 90%;
  overflow-y: auto;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
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
  justify-content: center;
  font-family: 'NanumSquareEB';
  margin-bottom: 20px;
`;

const thumbnailBox = css`
  position: relative;
  cursor: pointer;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 350px;
  height: 200px;
  border: 3px dashed var(--color-primary);
  transition: border-color 0.2s ease, background-color 0.2s ease;
  margin: 0 auto;

  &:hover {
    background: rgba(0, 123, 255, 0.05);
  }
`;

const emptyBoxText = css`
  color: var(--color-gray-500);
  font-size: 14px;
  text-align: center;
  padding: 10px;
  line-height: 1.6;
`;

const dragActive = css`
  background: rgba(0, 123, 255, 0.05);
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
  &:hover {
    opacity: 1;
  }
`;

const thumbnailImage = css`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const thumbnailOverlayActive = css`
  opacity: 1;
  background: rgba(0, 0, 0, 0.6);
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

const buttonRow = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const createButton = css`
  padding: 12px 30px;
  margin-top: 20px;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-family: 'NanumSquareB';
  cursor: pointer;
  background: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  &:hover {
    background: var(--color-primary-dark);
  }
`;

const guideText = css`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  text-align: center;
  font-size: 0.9rem;
  color: var(--color-gray-500);
`;

const codeTitle = css`
  font-family: 'NanumSquareEB';
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
`;

const codeDisplay = css`
  position: relative;
  background: #f8f8f8;
  padding: 60px 50px;
  border-radius: 16px;
  text-align: center;
  font-size: 36px;
  font-family: 'NanumSquareB';
  margin-bottom: 20px;

  span {
    display: block;
    font-size: 16px;
    color: var(--color-gray-600);
    margin-bottom: 12px;
    letter-spacing: normal;
  }

  p {
    font-size: 36px;
    letter-spacing: 4px;
    margin: 0;
  }
`;

const copyButton = css`
  position: absolute;
  top: 16px;
  right: 16px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 20px;

  &:hover {
    opacity: 0.7;
  }
`;

const toastAlert = css`
  position: fixed;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.85);
  color: white;
  font-size: 15px;
  padding: 10px 20px;
  border-radius: 8px;
  z-index: 5000;
  animation: fadeInOut 2s forwards;

  @keyframes fadeInOut {
    0% {
      opacity: 0;
      transform: translate(-50%, -20px);
    }
    15% {
      opacity: 1;
      transform: translate(-50%, 0);
    }
    85% {
      opacity: 1;
      transform: translate(-50%, 0);
    }
    100% {
      opacity: 0;
      transform: translate(-50%, -20px);
    }
  }
`;

const infoTitle = css`
  font-family: 'NanumSquareEB';
  font-size: 20px;
  text-align: center;
  margin-bottom: 10px;
`;

const infoList = css`
  font-size: 16px;
  color: var(--color-gray-700);
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  li {
    position: relative;
    padding-left: 24px;
    text-align: left;
  }

  li::before {
    content: '✔';
    position: absolute;
    left: 0;
    color: var(--color-primary);
    font-weight: bold;
  }
`;
