import { create } from 'zustand';

type Room = {
    pageNo:number
    pageSize:number
}

type RoomState = {
  meetingRooms: Room[];
  setMeetingRooms: (meetingRooms: Room[]) => void;
};

export const useRoomStore = create<RoomState>((set) => ({
  meetingRooms: [],
  setMeetingRooms: (meetingRooms) => set({ meetingRooms:meetingRooms }),
}));