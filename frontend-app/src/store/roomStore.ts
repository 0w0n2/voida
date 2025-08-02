import { create } from 'zustand';
import type { MeetingRoom } from '@/apis/roomApi';

type RoomState = {
  meetingRooms: MeetingRoom[];
  setMeetingRooms: (meetingRooms: MeetingRoom[]) => void;
};

export const useRoomStore = create<RoomState>((set) => ({
  meetingRooms: [],
  setMeetingRooms: (meetingRooms) => set({ meetingRooms }),
}));
