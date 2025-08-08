import { create } from 'zustand';

interface AlertState {
  message: string;
  position: 'top' | 'bottom';
  duration: number;
  visible: boolean;
  showAlert: (message: string, position?: 'top' | 'bottom', duration?: number) => void;
  hideAlert: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  message: '',
  position: 'bottom',
  duration: 2000,
  visible: false,
  showAlert: (message, position = 'bottom', duration = 1500) => {
    set({ message, position, duration, visible: true });
    setTimeout(() => {
      set({ visible: false });
    }, duration);
  },
  hideAlert: () => set({ visible: false }),
}));
