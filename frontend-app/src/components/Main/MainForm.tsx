import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import VoidaLogo from '@/assets/logo/voida-logo.png';
import mainHome from '@/assets/icons/main-home.png';
import Header from '@/components/Header';
import { getRooms } from '@/apis/roomApi';
import { useRoomStore } from '@/store/store';

const MainForm = () => {
  const meetingRooms = useRoomStore((state) => state.meetingRooms);
  const setMeetingRooms = useRoomStore((state) => state.setMeetingRooms);

  getRooms(1, 10).then((response) => {
    setMeetingRooms(response.data.meetingRooms);
  });
  return (
    <>
      <div>
        <Header />
      </div>
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
          placeholder="참여 중인 방의 이름을 검색해보세요"
        />
        <button css={searchButtonStyle}>
          <FiSearch />
        </button>
      </div>
    </>
  );
};

export default MainForm;

const iconWrapperStyle = css`
  background-color: linear-gradient(
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const searchBarWrapper = css`
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 30px;
  padding: 10px 16px;
  width: 500px;
`;

const selectStyle = css`
  border: none;
  background: transparent;
  font-size: 14px;
  margin-right: 12px;
  outline: none;
  cursor: pointer;
`;

const inputStyle = css`
  flex: 1;
  border: none;
  background: transparent;
  font-size: 14px;
  outline: none;
  color: #333;

  &::placeholder {
    color: #aaa;
  }
`;

const searchButtonStyle = css`
  background: none;
  border: none;
  cursor: pointer;
  color: #888;
  padding: 4px;
`;
