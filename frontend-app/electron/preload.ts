import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  getAppVersion: () => ipcRenderer.invoke('app:get-version'),

  openOverlay: (init: { 
    roomId: string; 
    overlayPosition?: 'TOPLEFT' | 'TOPRIGHT' | 'BOTTOMLEFT' | 'BOTTOMRIGHT'; 
    overlayTransparency?: number;
  }) => {
    ipcRenderer.send('open-overlay', init);
  },
  closeOverlay: () => {
    ipcRenderer.send('close-overlay');
  },

  sendQuickMessage: (message: string) => {
    ipcRenderer.send('send-quickslot', message);
  },

  logError: (msg: string) => ipcRenderer.send('overlay-log', msg),

  onOverlayInit: (cb: (data: { roomId: string; overlayPosition?: 'TOPLEFT' | 'TOPRIGHT' | 'BOTTOMLEFT' | 'BOTTOMRIGHT'; overlayTransparency?: number }) => void) => {
    const handler = (_: unknown, data: { roomId: string; overlayPosition?: 'TOPLEFT' | 'TOPRIGHT' | 'BOTTOMLEFT' | 'BOTTOMRIGHT'; overlayTransparency?: number }) => cb(data);
    ipcRenderer.on('overlay:init', handler);
    return () => ipcRenderer.removeListener('overlay:init', handler);
  },

  getOverlayInit: () => ipcRenderer.invoke('overlay:get-init') as Promise<{ 
    roomId: string; 
    overlayPosition?: 'TOPLEFT' | 'TOPRIGHT' | 'BOTTOMLEFT' | 'BOTTOMRIGHT'
    overlayTransparency?: number
  }>,

  openLink: (url) => ipcRenderer.send('open-external-link', url),
});
