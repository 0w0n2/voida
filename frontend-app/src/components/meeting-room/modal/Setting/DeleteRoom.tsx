/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { useMeetingRoomStore } from '@/store/meetingRoomStore';
import { deleteRoom } from '@/apis/meeting-room/meetingRoomApi';

const DeleteRoom = ({ onClose }: { onClose: () => void }) => {
  const { roomInfo } = useMeetingRoomStore();
  const [confirmMode, setConfirmMode] = useState(false);
  const [input, setInput] = useState('');
  const navigate = useNavigate();

  const handleDeleteClick = () => {
    setConfirmMode(true);
  };

  const handleConfirmDelete = async () => {
    if (input !== roomInfo?.title) {
      alert('방 이름이 일치하지 않습니다.');
      return;
    }

    await deleteRoom(roomInfo?.meetingRoomId);
    alert('삭제 완료');
    onClose();
    navigate('/main');
  };

  return (
    <div>
      <div css={headerRow}>
        <h2>방 삭제</h2>
      </div>

      <div css={box}>
        <p>
          방을 삭제하면 모든 메시지와 파일이 <strong>영구적으로 삭제</strong>됩니다.
        </p>

        {confirmMode ? (
          <div css={confirmBox}>
            <p css={confirmTitle}>
              <AlertTriangle size={15} style={{ marginTop: 2}} />
              정말 삭제하시겠습니까?
            </p>
            <p>
              삭제하려면 방 이름 <strong>"{roomInfo?.title}"</strong>을 입력해주세요.
            </p>
            <input
              css={inputBox}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="방 이름을 입력하세요"
            />

            <div css={buttonRow}>
              <button css={cancelButton} onClick={() => setConfirmMode(false)}>
                취소
              </button>
              <button css={deleteButton} onClick={handleConfirmDelete}>
                영구 삭제
              </button>
            </div>
          </div>
        ) : (
          <button css={deleteButton} onClick={handleDeleteClick}>
            <Trash2 size={16} style={{ marginRight: 6, marginTop: 2 }} />
            방 삭제하기
          </button>
        )}
      </div>
    </div>
  );
};

export default DeleteRoom;

const headerRow = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  h2 {
    font-size: 18px;
    font-weight: bold;
  }
`;

const box = css`
  border: 1px solid #f44336;
  background: #ffffffff;
  padding: 20px;
  border-radius: 12px;
  color: #c62828;

  p {
    color: #c62828;
    font-size: 16px;
    line-height: 1.5;
  }
`;

const confirmBox = css`
  margin-top: 40px;
  margin-bottom: 20px;
  padding: 16px;
  border: 1px solid #f99;
  background: #fff5f5;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const confirmTitle = css`
  font-family: 'NanumSquareEB';
  display: flex;
  align-items: center;
  gap: 6px;
`;

const inputBox = css`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  margin-top: 10px;
  margin-bottom: 16px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #f44336;
  }
`;

const buttonRow = css`
  display: flex;
  justify-content: flex-end;
  gap: 20px;
`;

const cancelButton = css`
  padding: 10px 16px;
  background: #ffffffff;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-family: 'NanumSquareB';
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;

  &:hover {
    background: #f5f5f5;
  }
`;

const deleteButton = css`
  padding: 10px 16px;
  background: #e53935;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-family: 'NanumSquareB';
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 20px;

  &:hover {
    background: #c62828;
  }
`;
