/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';

export default function RoomsPage() {
  const navigate = useNavigate();

  const pageStyle = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    font-family: 'Pretendard', sans-serif;
    background-color: #f8f8f8;
  `;

  const cardStyle = css`
    background: white;
    border-radius: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    padding: 60px 80px;
    text-align: center;
  `;

  const emptyIcon = css`
    font-size: 36px;
    margin-bottom: 20px;
  `;

  const textStyle = css`
    font-size: 16px;
    margin-bottom: 40px;
    color: #333;
  `;

  const buttonWrapper = css`
    display: flex;
    gap: 20px;
    justify-content: center;
  `;

  const createButton = css`
    padding: 12px 24px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;

    &:hover {
      background-color: #005fcc;
    }
  `;

  const joinButton = css`
    padding: 12px 24px;
    background-color: #f3f3f3;
    color: #333;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;

    &:hover {
      background-color: #e4e4e4;
    }
  `;

  return (
    <div css={pageStyle}>
      <div css={cardStyle}>
        <div css={emptyIcon}>🏠</div>
        <div css={textStyle}>
          현재 참여 중인 방이 없습니다.
          <br />
          새로운 방을 만들거나, 코드를 입력해 방에 참여해보세요.
        </div>

        <div css={buttonWrapper}>
          <button css={createButton} onClick={() => navigate('/rooms/create')}>
            ➕ 방 생성하기
          </button>
          <button css={joinButton} onClick={() => navigate('/rooms/join')}>
            ➡ 방 들어가기
          </button>
        </div>
      </div>
    </div>
  );
}
