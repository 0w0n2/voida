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
  email: string;
  nickname: string;
  profileImage: string;
  memberUuid: string;
};

// 유저 정보 조회 setting
type OverlayPosition = 'TOPLEFT' | 'TOPRIGHT' | 'BOTTOMLEFT' | 'BOTTOMRIGHT';

type Settings = {
  lipTalkMode: boolean;
  overlayPosition: OverlayPosition;
  liveFontSize: number;
  overlayTransparency: number;
};

type SettingResponse = {
  setting: Settings;
};

// 유저 정보 조회 quickSlots
type QuickSlots = {
  quickSlotId: number;
  message:string
  hotkey:string
  url:string
}

type QuickSlotsResponse = {
  quickSlots: QuickSlots[];
};

type AuthState = {
  accessToken: string | null;
  user: User | null;
  setAuth: (token: string, user: User | null) => void;
  clearAuth: () => void;
};

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

