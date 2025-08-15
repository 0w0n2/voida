import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  openOverlay: (init: { 
    roomId: string; 
    overlayPosition?: 'TOPLEFT' | 'TOPRIGHT' | 'BOTTOMLEFT' | 'BOTTOMRIGHT'; 
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

  onOverlayInit: (cb: (data: { roomId: string; overlayPosition?: 'TOPLEFT' | 'TOPRIGHT' | 'BOTTOMLEFT' | 'BOTTOMRIGHT' }) => void) => {
    const handler = (_: unknown, data: { roomId: string; overlayPosition?: 'TOPLEFT' | 'TOPRIGHT' | 'BOTTOMLEFT' | 'BOTTOMRIGHT' }) => cb(data);
    ipcRenderer.on('overlay:init', handler);
    return () => ipcRenderer.removeListener('overlay:init', handler);
  },

  getOverlayInit: () => ipcRenderer.invoke('overlay:get-init') as Promise<{ 
    roomId: string; 
    overlayPosition?: 'TOPLEFT' | 'TOPRIGHT' | 'BOTTOMLEFT' | 'BOTTOMRIGHT' 
  }>,
});
