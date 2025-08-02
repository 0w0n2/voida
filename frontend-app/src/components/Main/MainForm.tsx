/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiPlus,
  FiPlay,
} from 'react-icons/fi';
import { FiUser } from 'react-icons/fi';
import VoidaLogo from '@/assets/logo/voida-logo.png';
import mainHome from '@/assets/icons/main-home.png';
import Header from '@/components/Header';
import { getRooms } from '@/apis/roomApi';
import { useRoomStore } from '@/store/roomStore';
import jinmo from '@/assets/test/jinmo.jpg';

const MainForm = () => {
  const meetingRooms = useRoomStore((state) => state.meetingRooms);
  const setMeetingRooms = useRoomStore((state) => state.setMeetingRooms);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // 더미 데이터
  const dummyRooms = [
    {
      id: 1,
      title: '마비노기 싸피길드방',
      category: '게임',
      participants: 6,
      thumbnail: jinmo,
    },
    {
      id: 2,
      title: '마비노기 싸피길드방',
      category: '게임',
      participants: 6,
      thumbnail: jinmo,
    },
    {
      id: 3,
      title: '마비노기 싸피길드방',
      category: '게임',
      participants: 6,
      thumbnail: jinmo,
    },
    {
      id: 4,
      title: '마비노기 싸피길드방',
      category: '게임',
      participants: 6,
      thumbnail: jinmo,
    },
    {
      id: 5,
      title: '마비노기 싸피길드방',
      category: '게임',
      participants: 6,
      thumbnail: jinmo,
    },
    {
      id: 6,
      title: '마비노기 싸피길드방',
      category: '게임',
      participants: 6,
      thumbnail: jinmo,
    },
    {
      id: 7,
      title: '마비노기 싸피길드방',
      category: '게임',
      participants: 6,
      thumbnail: jinmo,
    },
  ];

  // 현재 페이지에 표시할 데이터 계산
  const totalPages = Math.ceil(dummyRooms.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRooms = dummyRooms.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div>
        <Header />
      </div>
      <div css={containerStyle}>
        {/* 검색바 */}
        <div css={searchBarContainer}>
          <div css={searchBarWrapper}>
            <select css={selectStyle}>
              <option>게임</option>
              <option>일상</option>
              <option>학습</option>
              <option>회의</option>
              <option>자유</option>
            </select>
            <input
              css={inputStyle}
              placeholder="참여 중인 방의 이름을 검색해보세요."
            />
            <button css={searchButtonStyle}>
              <FiSearch />
            </button>
          </div>
        </div>

        {/* 카드 그리드 */}
        <div css={cardGridStyle}>
          {currentRooms.map((room) => (
            <div key={room.id} css={cardStyle}>
              <div css={cardImageStyle}>
                <img src={room.thumbnail} alt={room.title} />
              </div>
              <div css={cardContentStyle}>
                <h3 css={cardTitleStyle}>{room.title}</h3>
                <p css={cardCategoryStyle}>{room.category}</p>
                <div css={participantCountStyle}>
                  <FiUser size={14} />
                  <span>{room.participants}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 페이지네이션 */}
        <div css={paginationStyle}>
          <button
            css={paginationButtonStyle}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <FiChevronLeft />
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <button
                key={page}
                css={[
                  paginationButtonStyle,
                  currentPage === page && currentPageStyle,
                ]}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ),
          )}

          <button
            css={paginationButtonStyle}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <FiChevronRight />
          </button>
        </div>

        {/* 플로팅 액션 버튼 */}
        <div css={floatingActionButtonsStyle}>
          <button css={floatingButtonStyle}>
            <FiPlay />
          </button>
          <button css={floatingButtonStyle}>
            <FiPlus />
          </button>
        </div>
      </div>
    </>
  );
};

export default MainForm;

const containerStyle = css`
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 1600px) {
    max-width: 1200px;
    padding: 18px;
  }

  @media (max-width: 1366px) {
    max-width: 1000px;
    padding: 16px;
  }

  @media (max-width: 1024px) {
    max-width: 900px;
    padding: 14px;
  }
`;

const searchBarContainer = css`
  display: flex;
  justify-content: center;
  margin-bottom: 30px;

  @media (max-width: 1366px) {
    margin-bottom: 25px;
  }

  @media (max-width: 1024px) {
    margin-bottom: 20px;
  }
`;

const searchBarWrapper = css`
  display: flex;
  align-items: center;
  background-color: var(--color-gray-100);
  border-radius: 30px;
  padding: 16px 20px;
  width: 100%;
  max-width: 800px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 1600px) {
    max-width: 700px;
    padding: 14px 18px;
  }

  @media (max-width: 1366px) {
    max-width: 600px;
    padding: 12px 16px;
  }

  @media (max-width: 1024px) {
    max-width: 500px;
    padding: 10px 14px;
  }
`;

const selectStyle = css`
  border: none;
  background: transparent;
  font-size: 16px;
  margin-right: 16px;
  outline: none;
  cursor: pointer;
  font-weight: 500;
  color: var(--color-text);
  padding: 4px 8px;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(49, 130, 246, 0.1);
  }

  &:focus {
    background-color: rgba(49, 130, 246, 0.1);
  }

  option {
    background-color: white;
    color: var(--color-text);
    padding: 8px;
  }

  @media (max-width: 1366px) {
    font-size: 15px;
    margin-right: 14px;
  }

  @media (max-width: 1024px) {
    font-size: 14px;
    margin-right: 12px;
  }
`;

const inputStyle = css`
  flex: 1;
  border: none;
  background: transparent;
  font-size: 16px;
  outline: none;
  color: var(--color-text);

  &::placeholder {
    color: var(--color-gray-500);
  }

  @media (max-width: 1366px) {
    font-size: 15px;
  }

  @media (max-width: 1024px) {
    font-size: 14px;
  }
`;

const searchButtonStyle = css`
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-gray-500);
  padding: 6px;
  display: flex;
  align-items: center;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(49, 130, 246, 0.1);
    color: var(--color-primary);
  }

  svg {
    width: 20px;
    height: 20px;
  }

  @media (max-width: 1366px) {
    svg {
      width: 18px;
      height: 18px;
    }
  }

  @media (max-width: 1024px) {
    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

const cardGridStyle = css`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
  margin-bottom: 40px;

  @media (max-width: 1600px) {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 20px;
  }

  @media (max-width: 1366px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 18px;
    margin-bottom: 35px;
  }

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
    margin-bottom: 30px;
  }
`;

const cardStyle = css`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
`;

const cardImageStyle = css`
  width: 100%;
  height: 200px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 1366px) {
    height: 180px;
  }

  @media (max-width: 1024px) {
    height: 160px;
  }
`;

const cardContentStyle = css`
  padding: 16px;
  position: relative;
`;

const cardTitleStyle = css`
  margin: 0 0 8px 0;
  font-size: 17px;
  font-weight: 600;
  color: var(--color-text);

  @media (max-width: 1366px) {
    font-size: 16px;
  }

  @media (max-width: 1024px) {
    font-size: 15px;
  }
`;

const cardCategoryStyle = css`
  margin: 0;
  font-size: 14px;
  color: var(--color-gray-500);

  @media (max-width: 1024px) {
    font-size: 13px;
  }
`;

const participantCountStyle = css`
  position: absolute;
  bottom: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: var(--color-gray-600);

  @media (max-width: 1024px) {
    font-size: 13px;
    bottom: 14px;
    right: 14px;
  }
`;

const paginationStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 30px;

  @media (max-width: 1366px) {
    gap: 8px;
    margin-bottom: 25px;
  }

  @media (max-width: 1024px) {
    gap: 6px;
    margin-bottom: 20px;
  }
`;

const paginationButtonStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: none;
  background: transparent;
  border-radius: 50%;
  cursor: pointer;
  font-size: 15px;
  color: var(--color-text);
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: var(--color-gray-100);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 1366px) {
    width: 40px;
    height: 40px;
    font-size: 14px;
  }

  @media (max-width: 1024px) {
    width: 36px;
    height: 36px;
    font-size: 13px;
  }
`;

const currentPageStyle = css`
  background-color: var(--color-primary);
  color: white;

  &:hover {
    background-color: var(--color-primary-dark);
  }
`;

const ellipsisStyle = css`
  color: var(--color-gray-600);
  font-size: 14px;
`;

const floatingActionButtonsStyle = css`
  position: fixed;
  bottom: 40px;
  right: 40px;
  display: flex;
  flex-direction: row;
  gap: 16px;
  z-index: 1000;

  @media (max-width: 1366px) {
    bottom: 30px;
    right: 30px;
    gap: 12px;
  }

  @media (max-width: 1024px) {
    bottom: 25px;
    right: 25px;
    gap: 10px;
  }
`;

const floatingButtonStyle = css`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  background-color: var(--color-primary);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(49, 130, 246, 0.3);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(49, 130, 246, 0.4);
    background-color: var(--color-primary-dark);
  }

  svg {
    width: 22px;
    height: 22px;
  }

  @media (max-width: 1366px) {
    width: 56px;
    height: 56px;

    svg {
      width: 20px;
      height: 20px;
    }
  }

  @media (max-width: 1024px) {
    width: 50px;
    height: 50px;

    svg {
      width: 18px;
      height: 18px;
    }
  }
`;
