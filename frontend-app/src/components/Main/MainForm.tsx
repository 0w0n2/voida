/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Plus,
  ArrowRight,
  User,
} from 'lucide-react';
import CreateRoomModal from '@/components/main/modal/CreateRoom';
import JoinRoomModal from '@/components/main/modal/JoinRoom';
import type { MeetingRoom } from '@/apis/meetingRoomApi';

const categoryColors: Record<string, string> = {
  게임: '#8e44ad',
  일상: '#f1c40f',
  학습: '#333333',
  회의: '#27ae60',
  자유: '#3498db',
};

interface MainFormProps {
  rooms: MeetingRoom[];
}

const MainForm = ({ rooms }: MainFormProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);

  const itemsPerPage = 6;

  const categories = ['전체', ...Object.keys(categoryColors)];

  const filteredRooms = rooms.filter((room) => {
    const matchesCategory =
      selectedCategory === '전체' || room.category === selectedCategory;
    const matchesSearch = room.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRooms = filteredRooms.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

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
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
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
        {currentRooms.map((room) => (
          <div key={room.meetingRoomId} css={card}>
            <div css={thumbnailWrapper}>
              <img src={room.thumbnailImageUrl} alt={room.title} />
            </div>

            <div css={infoSection}>
              <h3 css={titleText}>{room.title}</h3>
              <div css={bottomRow}>
                <span
                  css={css`
                    ${categoryChip};
                    color: ${categoryColors[room.category] || '#999'};
                    background-color: ${categoryColors[room.category] ||
                    '#999'}20;
                  `}
                >
                  {room.category}
                </span>
                <div css={participants}>
                  <User size={16} />
                  <span>{room.memberCount}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
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

      {isCreateOpen && (
        <CreateRoomModal onClose={() => setIsCreateOpen(false)} />
      )}
      {isJoinOpen && <JoinRoomModal onClose={() => setIsJoinOpen(false)} />}
    </div>
  );
};

export default MainForm;

const container = css`
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 1024px) {
    padding: 16px;
  }

  @media (max-width: 600px) {
    padding: 12px;
  }
`;

const searchContainer = css`
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
`;

const searchBox = css`
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border-radius: 50px;
  padding: 14px 28px;
  width: 100%;
  max-width: 800px;
  transition: border 0.2s ease;
  border: 2px solid transparent;

  &:focus-within {
    border: 2px solid var(--color-primary);
  }

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    padding: 12px 20px;
    border-radius: 16px;
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

    @media (max-width: 600px) {
    margin-right: 0;
    border-right: none;
    padding-right: 0;
    background-position: right 8px center;
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

  &::placeholder {
    color: #aaa;
  }

    @media (max-width: 600px) {
    width: 100%;
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
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  grid-auto-rows: 290px;
  gap: 32px;
  margin-bottom: 40px;

  @media (max-width: 1600px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    grid-auto-rows: 400px;
  }

  @media (max-width: 1366px) {
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    grid-auto-rows: 380px;
    gap: 16px;
    margin-bottom: 32px;
  }

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    grid-auto-rows: 360px;
    gap: 14px;
    margin-bottom: 28px;
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
  gap: 8px;
  margin-bottom: 20px;
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
    background-color: #f0f0f0;
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

  @media (max-width: 1366px) {
    bottom: 30px;
    right: 30px;
  }

  @media (max-width: 1024px) {
    bottom: 20px;
    right: 20px;
  }

    @media (max-width: 600px) {
    flex-direction: column;
    bottom: 16px;
    right: 16px;
    gap: 12px;
  }
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
