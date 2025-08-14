/** @jsxImportSource @emotion/react */
import { css,  keyframes } from '@emotion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, Plus, ArrowRight, User } from 'lucide-react';
import CreateRoomModal from '@/components/main/modal/CreateRoom';
import JoinRoomModal from '@/components/main/modal/JoinRoom';
import type { MeetingRoom } from '@/apis/meeting-room/meetingRoomApi';

const categoryColors: Record<string, string> = {
  game: '#8e44ad',
  talk: '#f1c40f',
  study: '#333333',
  meeting: '#27ae60',
  free: '#3498db',
};

const categoryLabels: Record<string, string> = {
  game: '게임',
  talk: '일상',
  study: '학습',
  meeting: '회의',
  free: '자유',
};

interface MainFormProps {
  rooms: MeetingRoom[];
}

const MainForm = ({ rooms = [] }: MainFormProps) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);

  const itemsPerPage = 6;
  const categories = ['전체', ...Object.values(categoryLabels)];

  const filteredRooms = rooms.filter((room) => {
    const normalizedCategory = room.categoryName?.toLowerCase().trim();
    const roomCategoryKo = categoryLabels[normalizedCategory] || '기타';

    const matchesCategory =
      selectedCategory === '전체' || roomCategoryKo === selectedCategory;

    const matchesSearch = room.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRooms = filteredRooms.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div css={container}>
      <div css={searchContainer}>
        <div css={searchBox}>
          <select
            css={categorySelect}
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
          >
            {categories.map((label) => (
              <option key={label} value={label}>
                {label}
              </option>
            ))}
          </select>

          <input
            css={searchInput}
            placeholder="참여 중인 방의 이름을 검색해보세요."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button css={searchBtn}>
            <Search size={22} />
          </button>
        </div>
      </div>

      <div css={cardGrid}>
        {currentRooms.map((room) => {
          const normalizedCategory = room.categoryName?.toLowerCase().trim();
          const categoryKo = categoryLabels[normalizedCategory] || '기타';
          const categoryColor = categoryColors[normalizedCategory] || '#999';

          return (
            <div
              key={room.meetingRoomId}
              css={card}
              onClick={() => navigate(`/meeting-room/${room.meetingRoomId}`)}
            >
              <div css={thumbnailWrapper}>
                <img
                  src={`${import.meta.env.VITE_CDN_URL}/${room.thumbnailImageUrl}`}
                  alt={room.title}
                />
              </div>

              <div css={infoSection}>
                <h3 css={titleText}>{room.title}</h3>
                <div css={bottomRow}>
                  <span
                    css={css`
                      ${categoryChip};
                      color: ${categoryColor};
                      background-color: ${categoryColor}20;
                    `}
                  >
                    {categoryKo}
                  </span>
                  <div css={participants}>
                    <User size={16} />
                    <span>{room.memberCount}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div css={pagination}>
        <button
          css={pageBtn}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={20} />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            css={[pageBtn, currentPage === page && activePage]}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}

        <button
          css={pageBtn}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div css={floatBtns}>
        <div css={floatBtnWrapper}>
          <button css={floatBtn} onClick={() => setIsJoinOpen(true)}>
            <ArrowRight size={35} />
          </button>
          <span css={floatTooltip}>코드를 입력해 방에 들어갈 수 있습니다.</span>
        </div>

        <div css={floatBtnWrapper}>
          <button css={floatBtn} onClick={() => setIsCreateOpen(true)}>
            <Plus size={35} />
          </button>
          <span css={floatTooltip}>새로운 방을 만들 수 있습니다.</span>
        </div>
      </div>

      {isCreateOpen && <CreateRoomModal onClose={() => setIsCreateOpen(false)} />}
      {isJoinOpen && <JoinRoomModal onClose={() => setIsJoinOpen(false)} />}

      <div css={blurBg1} />
      <div css={blurBg2} /> 
      <div css={blurBg3} />
    </div>
  );
};

export default MainForm;

const glassStyle = css`
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.25) 0%,
    rgba(255, 255, 255, 0.05) 100%
  );
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border-radius: 100px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.15),
    inset 0 1px 1px rgba(255, 255, 255, 0.4),
    inset 0 -1px 1px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
`;

const container = css`
  padding: 0px 20px;
  max-width: 1300px; 
  margin: 0 auto;
  width: 100%;
  z-index: 1;
  overflow: hidden;
`;

const searchContainer = css`
  ${glassStyle};
  position: sticky;
  top: 0;
  z-index: 10;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;

  @media (min-height: 1000px) {
    top: 20px;
  }
`;

const searchBox = css`
  display: flex;
  align-items: center;
  border-radius: 50px;
  padding: 14px 28px;
  width: 100%;
  max-width: 800px;
  transition: border 0.2s ease;
  border: 2px solid transparent;
  &:focus-within {
    background: var(--color-bg-white);
  }
`;

const categorySelect = css`
  border: none;
  background: transparent;
  font-size: 16px;
  font-family: 'NanumSquareB';
  color: #333;
  margin-right: 24px;
  padding-right: 24px;
  outline: none;
  appearance: none;
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right center;
  background-size: 12px 12px;
  border-right: 1px solid #ccc;
  text-align: center;
  text-align-last: center;

  option {
    text-align: center;
  }
`;

const searchInput = css`
  flex: 1;
  border: none;
  background: transparent;
  font-size: 16px;
  line-height: 1.5;
  padding: 0 12px;
  outline: none;
  color: #333;
  caret-color: black;

  &::placeholder {
    color: #aaa;
  }
`;

const searchBtn = css`
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 6px;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const cardGrid = css`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 360px));
  justify-content: center;
  grid-auto-rows: 290px;
  gap: 32px;
  margin: 40px;

  @media (min-height: 1000px) {
    margin-top: 110px;
    gap: 50px;
  }
`;

const card = css`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  }
`;

const thumbnailWrapper = css`
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const infoSection = css`
  padding: 22px;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const titleText = css`
  font-size: 18px;
  font-family: 'NanumSquareEB';
  margin-bottom: 12px;
  color: #222;
  line-height: 1.4;
`;

const bottomRow = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const categoryChip = css`
  font-size: 14px;
  font-family: 'NanumSquareB';
  padding: 4px 8px;
  border-radius: 8px;
`;

const participants = css`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #666;
  font-size: 14px;
`;

const pagination = css`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 40px;
  @media (min-height: 1000px) {
    margin-top: 80px;
  }
`;

const pageBtn = css`
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  border-radius: 50%;
  cursor: pointer;
  font-size: 15px;
  color: #444;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: #ffffff74;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const activePage = css`
  background-color: var(--color-primary);
  color: white;

  &:hover {
    background-color: var(--color-primary-dark);
  }
`;

const floatBtns = css`
  position: fixed;
  bottom: 40px;
  right: 40px;
  display: flex;
  gap: 20px;
`;

const floatBtn = css`
  width: 65px;
  height: 65px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, var(--color-primary), #c35cffff);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 14px rgba(180, 49, 246, 0.3);
  }
`;

const floatBtnWrapper = css`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover span {
    opacity: 1;
    transform: translateY(0);
  }
`;

const floatTooltip = css`
  position: absolute;
  right: 0px;
  top: -70%;
  transform: translateY(-50%);
  background: #333;
  color: #fff;
  font-size: 13px;
  padding: 6px 10px;
  border-radius: 6px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: all 0.2s ease;
  z-index: 9999;
`;

const float1 = keyframes`
  0%   { transform: translateY(0px) translateX(0px); }
  50%  { transform: translateY(-50px) translateX(200px); }
  100% { transform: translateY(0px) translateX(0px); }
`;

const float2 = keyframes`
  0%   { transform: translateY(0px) translateX(0px); }
  50%  { transform: translateY(50px) translateX(-200px); }
  100% { transform: translateY(0px) translateX(0px); }
`;

const blurBg1 = css`
  position: absolute;
  top: 15%;
  left: 3%;
  width: 280px;
  height: 280px;
  background: radial-gradient(circle, #b69cff, transparent 70%);
  filter: blur(80px);
  z-index: -1;
  animation: ${float1} 30s ease-in-out infinite;
`;

const blurBg2 = css`
  position: absolute;
  bottom: 10%;
  right: 10%;
  width: 380px;
  height: 380px;
  background: radial-gradient(circle, #82e9ff, transparent 70%);
  filter: blur(100px);
  z-index: -1;
  animation: ${float2} 28s ease-in-out infinite;
`;

const blurBg3 = css`
  position: absolute;
  top: 45%;
  left: 25%;
  width: 260px;
  height: 260px;
  background: radial-gradient(circle, #ff8fa3, transparent 70%);
  filter: blur(90px);
  z-index: -1;
  animation: ${float1} 24s ease-in-out infinite;
`;
