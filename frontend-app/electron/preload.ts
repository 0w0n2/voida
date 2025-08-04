import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  joinLive: () => ipcRenderer.invoke('join-live'),
  leaveLive: () => ipcRenderer.invoke('leave-live'),
});

declare global {
  interface Window {
    electron: {
      joinLive: () => Promise<void>;
      leaveLive: () => Promise<void>;
    };
  }
}

export {};