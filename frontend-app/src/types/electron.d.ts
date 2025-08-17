export {};

declare global {
  interface Window {
    electronAPI: {
      openOverlay: (init: {
        roomId: string;
        overlayPosition?: 'TOPLEFT' | 'TOPRIGHT' | 'BOTTOMLEFT' | 'BOTTOMRIGHT';
        overlayTransparency?: number;
      }) => void;
      closeOverlay: () => void;
      sendQuickMessage: (message: string) => void;
      getAppVersion: () => Promise<string>;
      onOverlayInit: (cb: (data: { roomId: string }) => void) => () => void;
      getOverlayInit: () => Promise<{ roomId: string }>;
      openLink: (url: string) => void;
    };
  }
}