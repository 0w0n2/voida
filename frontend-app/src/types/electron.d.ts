// src/types/electron.d.ts
export {};

declare global {
  interface Window {
    electronAPI: {
      openOverlay: (init: { roomId: string }) => void;
      closeOverlay: () => void;
      sendQuickMessage: (message: string) => void;

      // onOverlayInit?: (cb: (data: { roomId: string }) => void) => () => void;
      // getOverlayInit?: () => Promise<{ roomId: string }>;
    };
  }
}
