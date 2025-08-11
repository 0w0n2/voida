import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  openOverlay: () => {
    ipcRenderer.send('open-overlay');
  },
  closeOverlay: () => {
    ipcRenderer.send('close-overlay');
  },
});
