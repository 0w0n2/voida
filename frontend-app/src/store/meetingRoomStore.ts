import { create } from 'zustand';
import type {
  RoomInfo,
  RoomParticipant,
  ChatMessage,
} from '@/apis/meetingRoomApi';
import CateGory from '@/assets/category/category-game.png';
import Profile from '@/assets/profiles/profile1.png';

const dummyRoomInfo: RoomInfo = {
  title: '테스트 방',
  category: 'ㅇ',
  thumbnailImageUrl: CateGory,
};

const dummyParticipants: RoomParticipant = {
  memberCount: 2,
  participants: [
    {
      memberId: 1,
      nickname: '민희',
      profileImageUrl: Profile,
      state: 'HOST',
      lipTalkMode: true,
      isMine: true,
    },
    {
      memberId: 2,
      nickname: '준호',
      profileImageUrl: Profile,
      state: 'PARTICIPANT',
      lipTalkMode: false,
      isMine: false,
    },
    {
      memberId: 3,
      nickname: '준호',
      profileImageUrl: Profile,
      state: 'PARTICIPANT',
      lipTalkMode: false,
      isMine: false,
    },
    {
      memberId: 4,
      nickname: '준호',
      profileImageUrl: Profile,
      state: 'PARTICIPANT',
      lipTalkMode: false,
      isMine: false,
    },
    {
      memberId: 5,
      nickname: '준호',
      profileImageUrl: Profile,
      state: 'PARTICIPANT',
      lipTalkMode: false,
      isMine: false,
    },
    {
      memberId: 6,
      nickname: '준호',
      profileImageUrl: Profile,
      state: 'PARTICIPANT',
      lipTalkMode: false,
      isMine: false,
    },
  ],
};

const dummyChatMessages: ChatMessage[] = [
  {
    senderId: '1',
    writerNickname: '민희',
    profileImageUrl: '/dummy1.png',
    content: '안녕하세요!',
    createdAt: new Date().toISOString(),
    isMine: false,
  },
  {
    senderId: '2',
    writerNickname: '나',
    profileImageUrl: '/dummy2.png',
    content: '테스트 채팅입니다',
    createdAt: new Date().toISOString(),
    isMine: true,
  },
];

type State = {
  roomInfo: RoomInfo | null;
  participants: RoomParticipant | null;
  chatMessages: ChatMessage[];

  setRoomInfo: (info: RoomInfo) => void;
  setParticipants: (info: RoomParticipant) => void;
  setChatMessages: (msgs: ChatMessage[], replace?: boolean) => void;
  addChatMessage: (msg: ChatMessage) => void;
};

export const useMeetingRoomStore = create<State>((set) => ({
  roomInfo: dummyRoomInfo,
  participants: dummyParticipants,
  chatMessages: dummyChatMessages,

  setRoomInfo: (info) => set({ roomInfo: info }),
  setParticipants: (info) => set({ participants: info }),
  setChatMessages: (msgs, replace = false) =>
    set((state) => ({
      chatMessages: replace ? msgs : [...state.chatMessages, ...msgs],
    })),
  addChatMessage: (msg) =>
    set((state) => ({ chatMessages: [...state.chatMessages, msg] })),
}));
