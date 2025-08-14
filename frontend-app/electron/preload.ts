import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  openOverlay: (init: { roomId: string }) => {
    ipcRenderer.send('open-overlay', init);
  },
  closeOverlay: () => {
    ipcRenderer.send('close-overlay');
  },

  sendQuickMessage: (message: string) => {
    ipcRenderer.send('send-quickslot', message);
  },

  // 디버깅용 로그 띄우기
  logError: (msg: string) => ipcRenderer.send('overlay-log', msg),

  //  오버레이 창에서: 메인이 방송하는 초기값 수신 (브로드캐스트)
  onOverlayInit: (cb: (data: { roomId: string }) => void) => {
    const handler = (_: unknown, data: { roomId: string }) => cb(data);
    ipcRenderer.on('overlay:init', handler);
    return () => ipcRenderer.removeListener('overlay:init', handler);
  },

  //  오버레이 창에서: 방송 타이밍을 놓쳤을 때 직접 가져오기(폴백)
  getOverlayInit: () => ipcRenderer.invoke('overlay:get-init'),
});
