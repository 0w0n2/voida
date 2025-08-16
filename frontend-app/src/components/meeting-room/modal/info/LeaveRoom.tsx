/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { useMeetingRoomStore } from '@/stores/useMeetingRoomStore';
import { leaveRoom } from '@/apis/meeting-room/meetingRoomApi';
import { useAlertStore } from '@/stores/useAlertStore';

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
      useAlertStore.getState().showAlert('방 이름이 일치하지 않습니다.', 'top');
      return;
    }

    await leaveRoom(roomInfo?.meetingRoomId);
    useAlertStore.getState().showAlert('방에서 탈퇴되었습니다.', 'top');
    onClose();
    navigate('/main');
  };

  return (
    <div>
      <div css={headerRow}>
        <h2>방 탈퇴</h2>
      </div>

      <div css={box}>
        <p>
          방을 탈퇴하면 초대코드를 입력해 <strong>다시 입장</strong>해야 합니다.
        </p>

        {confirmMode ? (
          <div css={confirmBox}>
            <p css={confirmTitle}>
              <AlertTriangle size={15} style={{ marginTop: 2 }} />
              정말 탈퇴하시겠습니까?
            </p>
            <p>
              탈퇴하려면 방 이름 <strong>"{roomInfo?.title}"</strong>을
              입력해주세요.
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
              <button css={leaveButton} onClick={handleConfirmDelete}>
                탈퇴
              </button>
            </div>
          </div>
        ) : (
          <button css={leaveButton} onClick={handleDeleteClick}>
            <Trash2 size={16} style={{ marginRight: 6, marginTop: 2 }} />방
            탈퇴하기
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

const leaveButton = css`
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
