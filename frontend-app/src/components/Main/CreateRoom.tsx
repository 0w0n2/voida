/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';
import {
  FiX,
  FiHome,
  FiGrid,
  FiPlus,
  FiUsers,
  FiChevronDown,
} from 'react-icons/fi';
import jinmo from '@/assets/test/jinmo.jpg';
import Roading from './Roading';

interface CreateRoomProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateRoom = ({ isOpen, onClose }: CreateRoomProps) => {
  const [roomTitle, setRoomTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateRoom = () => {
    if (!roomTitle.trim() || !selectedCategory) {
      alert('방 제목과 카테고리를 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);

    // 실제 방 생성 로직을 여기에 추가
    // 예시: API 호출 후 로딩 상태 해제
    setTimeout(() => {
      setIsLoading(false);
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <>
      <div css={modalOverlay}>
        <div css={modalContainer}>
          {/* 모달 헤더 */}
          <div css={modalHeader}>
            <h2 css={modalTitle}>방 생성하기</h2>
            <button css={closeButton} onClick={onClose}>
              <FiX />
            </button>
          </div>

          {/* 이미지 영역 */}
          <div css={thumbnailContainer}>
            <img src={jinmo} alt="방 썸네일" css={thumbnailImage} />
          </div>

          {/* 입력 필드들 */}
          <div css={inputContainer}>
            {/* 방 제목 입력 */}
            <div css={inputGroup}>
              <div css={inputLabel}>
                <FiHome css={labelIcon} />
                <span>방 제목</span>
              </div>
              <input
                css={textInput}
                type="text"
                placeholder="방 제목을 입력해주세요."
                value={roomTitle}
                onChange={(e) => setRoomTitle(e.target.value)}
              />
            </div>

            {/* 카테고리 선택 */}
            <div css={inputGroup}>
              <div css={categoryLabel}>
                <FiGrid css={labelIcon} />
                <span>카테고리</span>
              </div>
              <div css={selectWrapper}>
                <select
                  css={selectInput}
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">카테고리를 선택해주세요.</option>
                  <option value="게임">게임</option>
                  <option value="일상">일상</option>
                  <option value="학습">학습</option>
                  <option value="회의">회의</option>
                  <option value="자유">자유</option>
                </select>
                <FiChevronDown css={selectArrow} />
              </div>
            </div>
          </div>

          {/* 버튼 및 안내 문구 */}
          <div css={buttonContainer}>
            <button css={createButton} onClick={handleCreateRoom}>
              <FiPlus />
              <span>방 생성하기</span>
            </button>
            <div css={infoText}>
              <FiUsers css={infoIcon} />
              <span>6명의 인원 제한이 있습니다.</span>
            </div>
          </div>
        </div>
      </div>

      {/* 로딩 모달 */}
      <Roading isOpen={isLoading} onClose={() => setIsLoading(false)} />
    </>
  );
};

export default CreateRoom;

const modalOverlay = css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;

const modalContainer = css`
  background: var(--color-bg-white);
  border-radius: 16px;
  padding: 24px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
`;

const modalHeader = css`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
`;

const modalTitle = css`
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
  text-align: center;
`;

const closeButton = css`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-gray-500);
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--color-gray-100);
    color: var(--color-text);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const thumbnailContainer = css`
  width: 100%;
  height: 120px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const thumbnailImage = css`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const inputContainer = css`
  margin-bottom: 24px;
`;

const inputGroup = css`
  display: flex;
  align-items: stretch;
  margin-bottom: 16px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--color-gray-200);

  &:last-child {
    margin-bottom: 0;
  }
`;

const inputLabel = css`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 16px;
  background-color: var(--color-primary);
  color: var(--color-text-white);
  font-size: 12px;
  font-weight: 600;
  width: 100px;
  justify-content: center;
  border-right: 1px solid var(--color-gray-200);
  flex-shrink: 0;
`;

const categoryLabel = css`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 16px;
  background-color: var(--color-gray-500);
  color: var(--color-text-white);
  font-size: 12px;
  font-weight: 600;
  width: 100px;
  justify-content: center;
  border-right: 1px solid var(--color-gray-200);
  flex-shrink: 0;
`;

const labelIcon = css`
  width: 14px;
  height: 14px;
  color: var(--color-text-white);
`;

const textInput = css`
  flex: 1;
  padding: 12px 16px;
  border: none;
  outline: none;
  font-size: 14px;
  background-color: var(--color-bg-white);

  &::placeholder {
    color: var(--color-gray-500);
  }
`;

const selectWrapper = css`
  position: relative;
  flex: 1;
`;

const selectInput = css`
  width: 100%;
  padding: 12px 16px;
  padding-right: 40px;
  border: none;
  outline: none;
  font-size: 14px;
  background-color: var(--color-bg-white);
  cursor: pointer;
  appearance: none;

  option {
    padding: 8px;
  }
`;

const selectArrow = css`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: var(--color-gray-500);
  pointer-events: none;
`;

const buttonContainer = css`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
`;

const createButton = css`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: var(--color-primary);
  color: var(--color-text-white);
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--color-primary-dark);
    transform: translateY(-1px);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const infoText = css`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--color-gray-500);
`;

const infoIcon = css`
  width: 12px;
  height: 12px;
`;
