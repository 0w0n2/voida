import { create } from 'zustand';

interface AlertState {
  message: string;
  position: 'top' | 'bottom';
  duration: number;
  visible: boolean;
  isConfirm: boolean;
  resolve?: (value: boolean) => void;
  showAlert: (message: string, position?: 'top' | 'bottom', duration?: number) => void;
  showConfirm: (message: string, position?: 'top' | 'bottom') => Promise<boolean>;
  hideAlert: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  message: '',
  position: 'bottom',
  duration: 2000,
  visible: false,
  isConfirm: false,

  showAlert: (message, position = 'bottom', duration = 1500) => {
    set({ message, position, duration, visible: true, isConfirm: false });
    setTimeout(() => {
      set({ visible: false });
    }, duration);
  },

  showConfirm: (message, position = 'bottom') => {
    return new Promise<boolean>((resolve) => {
      set({ message, position, visible: true, isConfirm: true, resolve });
    });
  },

  hideAlert: () => set({ visible: false }),
}));
