import { create } from 'zustand';

export type User = {
  email: string;
  nickname: string;
  profileImage: string;
  memberUuid: string;
};

type AuthState = {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
