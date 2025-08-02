import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { getUserQuickSlots } from '../../apis/userApi';
import { useAuthStore } from '../../store/store';

interface Shortcut {
  key: string;
  text: string;
}

const ShortcutsTab = () => {
  const { accessToken } = useAuthStore();
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 유저 단축키 불러오기
  useEffect(() => {
    const fetchUserQuickSlots = async () => {
      try {
        setLoading(true);

        // TODO: API 연동 시 주석 해제
        // const response = await getUserQuickSlots(accessToken!);
        // setShortcuts(response.data);

        // 임시 데이터 사용 (퍼블리싱용)
        setTimeout(() => {
          setShortcuts([
            { key: '`+ 1', text: '안녕하세요.' },
            { key: '`+ 2', text: '감사합니다.' },
            { key: '`+ 3', text: '도움이 필요합니다.' },
            { key: '`+ 4', text: '죄송합니다.' },
            { key: '`+ 5', text: '잠시만 기다려주세요.' },
            { key: '`+ 6', text: '좋은 하루 되세요.' },
          ]);
          setError(null);
        }, 500);
        // 에러처리
      } catch (err) {
        console.error('유저 단축키 조회 실패:', err);
        setError('유저 단축키를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserQuickSlots();
  }, [accessToken]);

  const handleShortcutChange = (index: number, value: string) => {
    const newShortcuts = [...shortcuts];
    newShortcuts[index].text = value;
    setShortcuts(newShortcuts);
  };
  ///////////
  // TODO: API 연동 시 구현
  // const handleSave = () => {
  //   console.log('단축키 저장');
  //   // TODO: 단축키 업데이트 API 호출
  // };

  // if (loading) {
  //   return (
  //     <LoadingContainer>
  //       <LoadingText>유저 단축키를 불러오는 중...</LoadingText>
  //     </LoadingContainer>
  //   );
  // }

  // if (error) {
  //   return (
  //     <ErrorContainer>
  //       <ErrorText>{error}</ErrorText>
  //     </ErrorContainer>
  //   );
  // }

  // if (!shortcuts.length) {
  //   return (
  //     <ErrorContainer>
  //       <ErrorText>단축키를 찾을 수 없습니다.</ErrorText>
  //     </ErrorContainer>
  //   );
  // }
  ///////////
  return (
    <ShortcutsPanel>
      <ShortcutsHeader>
        <PanelTitle>단축키 설정</PanelTitle>
        <SaveButton onClick={handleSave}>저장하기</SaveButton>
      </ShortcutsHeader>
      <PanelSubtitle>
        실시간 게임 중 자주 사용하는 문구를 단축키로 등록하세요.
      </PanelSubtitle>

      <ShortcutsGrid>
        {shortcuts.map((shortcut, index) => (
          <ShortcutItem key={index}>
            <ShortcutKey>{shortcut.key}</ShortcutKey>
            <ShortcutInput
              value={shortcut.text}
              onChange={(e) => handleShortcutChange(index, e.target.value)}
              placeholder="단축키 문구를 입력하세요"
            />
          </ShortcutItem>
        ))}
      </ShortcutsGrid>
    </ShortcutsPanel>
  );
};

// 스타일 컴포넌트
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  background-color: var(--color-bg-white);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const LoadingText = styled.p`
  font-family: 'NanumSquareR', sans-serif;
  font-size: 16px;
  color: var(--color-gray-600);
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  background-color: var(--color-bg-white);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ErrorText = styled.p`
  font-family: 'NanumSquareR', sans-serif;
  font-size: 16px;
  color: var(--color-red);
`;

const ShortcutsPanel = styled.div`
  width: 100%;
  background-color: var(--color-bg-white);
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ShortcutsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const PanelTitle = styled.h2`
  font-family: 'NanumSquareB', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 8px;
`;

const PanelSubtitle = styled.p`
  font-family: 'NanumSquareR', sans-serif;
  font-size: 14px;
  color: var(--color-gray-600);
  margin-bottom: 24px;
`;

const SaveButton = styled.button`
  padding: 8px 16px;
  background-color: var(--color-primary);
  color: var(--color-text-white);
  border: none;
  border-radius: 6px;
  font-family: 'NanumSquareR', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--color-primary-dark);
  }
`;

const ShortcutsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

const ShortcutItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ShortcutKey = styled.button`
  padding: 8px 12px;
  background-color: var(--color-gray-600);
  color: var(--color-text-white);
  border: none;
  border-radius: 6px;
  font-family: 'NanumSquareR', sans-serif;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  min-width: 60px;
`;

const ShortcutInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid var(--color-gray-300);
  border-radius: 6px;
  font-family: 'NanumSquareR', sans-serif;
  font-size: 14px;
  background-color: var(--color-bg-white);
  color: var(--color-text);

  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
`;

export default ShortcutsTab;
