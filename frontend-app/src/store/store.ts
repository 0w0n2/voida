import { create } from 'zustand';

type Room = {
  pageNo: number;
  pageSize: number;
};

type RoomState = {
  meetingRooms: Room[];
  setMeetingRooms: (meetingRooms: Room[]) => void;
};

type User = {
  id: string;
  email: string;
  nickname: string;
};

type AuthState = {
  accessToken: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
};

///////////////////////

export const useRoomStore = create<RoomState>((set) => ({
  meetingRooms: [],
  setMeetingRooms: (meetingRooms) => set({ meetingRooms: meetingRooms }),
}));

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  setAuth: (token, user) => set({ accessToken: token, user: user }),
  clearAuth: () => set({ accessToken: null, user: null }),
}));
