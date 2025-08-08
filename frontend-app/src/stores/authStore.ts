import { create } from 'zustand';

export type User = {
  email: string;
  nickname: string;
  profileImage: string;
};

type AuthState = {
  accessToken: string | null;
  user: User | null;
  setAuth: (token: string, user: User | null) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  setAuth: (token, user) => set({ accessToken: token, user }),
  clearAuth: () => set({ accessToken: null, user: null }),
}));
