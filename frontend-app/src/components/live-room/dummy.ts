import type { ChatMessage } from './LiveOverlay';

export const dummyMessages: ChatMessage[] = [
  {
    messageId: 'msg-001',
    user: {
      userId: 'user-abc',
      userNickname: '이진모',
      userImageUrl: 'https://i.pravatar.cc/40?u=user-abc',
    },
    content: '안녕하세요! 여기로 와주세요.',
    timestamp: '2025-08-11T10:58:01Z',
  },
  {
    messageId: 'msg-002',
    user: {
      userId: 'user-abc',
      userNickname: '이혜원',
      userImageUrl: 'https://i.pravatar.cc/40?u=user-abc',
    },
    content: '안녕하세요! 여기로 와주세요.',
    timestamp: '2025-08-11T10:58:02Z',
  },
  {
    messageId: 'msg-003',
    user: {
      userId: 'user-def',
      userNickname: '전사123',
      userImageUrl: 'https://i.pravatar.cc/40?u=user-def',
    },
    content: '네, 지금 바로 가겠습니다!',
    timestamp: '2025-08-11T10:58:15Z',
  },
  {
    messageId: 'msg-004',
    user: {
      userId: 'user-ghi',
      userNickname: '김규찬',
      userImageUrl: 'https://i.pravatar.cc/40?u=user-ghi',
    },
    content: '저도 퀘스트 같이 해도 될까요?',
    timestamp: '2025-08-11T10:58:25Z',
  },
  {
    messageId: 'msg-005',
    user: {
      userId: 'user-abc',
      userNickname: '이민희',
      userImageUrl: 'https://i.pravatar.cc/40?u=user-abc',
    },
    content: '네 그럼요! 같이 해요 ㅎㅎ',
    timestamp: '2025-08-11T10:58:31Z',
  },
  {
    messageId: 'msg-006',
    user: {
      userId: 'user-def',
      userNickname: '이석재',
      userImageUrl: 'https://i.pravatar.cc/40?u=user-def',
    },
    content: 'ㅋㅋㅋ 좋아요!',
    timestamp: '2025-08-11T10:58:40Z',
  },
  {
    messageId: 'msg-007',
    user: {
      userId: 'gm-01',
      userNickname: '김수민',
      userImageUrl: 'https://i.pravatar.cc/40?u=gm-01',
    },
    content: '잠시 후 11시부터 10분간 긴급 서버 점검이 있을 예정입니다.',
    timestamp: '2025-08-11T10:59:00Z',
  },
  {
    messageId: 'msg-008',
    user: {
      userId: 'user-ghi',
      userNickname: '법사GOD',
      userImageUrl: 'https://i.pravatar.cc/40?u=user-ghi',
    },
    content: '헐... 점검이래요. 빨리 잡아야겠네요!',
    timestamp: '2025-08-11T10:59:12Z',
  },
];
