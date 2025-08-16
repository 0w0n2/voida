import { create } from 'zustand';
import type { RoomInfo, RoomParticipant } from '@/apis/meeting-room/meetingRoomApi';
import type { ChatMessage } from '@/apis/stomp/meetingRoomStomp';

type State = {
  roomInfo: RoomInfo | null;
  participants: RoomParticipant | null;
  chatMessages: Record<string, ChatMessage[]>;

  setRoomInfo: (info: RoomInfo) => void;
  setParticipants: (info: RoomParticipant) => void;

  setChatMessages: (roomId: string, msgs: ChatMessage[], replace?: boolean) => void;
  addChatMessage: (roomId: string, msg: ChatMessage) => void;
  clearChatMessages: (roomId: string) => void;
};

export const useMeetingRoomStore = create<State>((set) => ({
  roomInfo: null,
  participants: null,
  chatMessages: {},

  setRoomInfo: (info) => set({ roomInfo: info }),
  setParticipants: (info) => set({ participants: info }),

  setChatMessages: (roomId, msgs, replace = false) =>
    set((state) => ({
      chatMessages: {
        ...state.chatMessages,
        [roomId]: replace ? msgs : [...(state.chatMessages[roomId] || []), ...msgs],
      },
    })),

  addChatMessage: (roomId, msg) =>
    set((state) => ({
      chatMessages: {
        ...state.chatMessages,
        [roomId]: [...(state.chatMessages[roomId] || []), msg],
      },
    })),

  clearChatMessages: (roomId) =>
    set((state) => ({
      chatMessages: {
        ...state.chatMessages,
        [roomId]: [],
      },
    })),
}));
