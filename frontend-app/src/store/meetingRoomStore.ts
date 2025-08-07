import { create } from 'zustand';
import type { RoomInfo, RoomParticipant, ChatMessage } from '@/apis/meeting-room/meetingRoomApi';

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
  roomInfo: null,
  participants: null,
  chatMessages: [],

  setRoomInfo: (info) => set({ roomInfo: info }),
  setParticipants: (info) => set({ participants: info }),
  setChatMessages: (msgs, replace = false) =>
    set((state) => ({
      chatMessages: replace ? msgs : [...state.chatMessages, ...msgs],
    })),
  addChatMessage: (msg) =>
    set((state) => ({ chatMessages: [...state.chatMessages, msg] })),
}));
