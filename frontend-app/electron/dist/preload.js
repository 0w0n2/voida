// electron/preload.ts
var import_electron = require("electron");
import_electron.contextBridge.exposeInMainWorld("electronAPI", {
  openOverlay: (init) => {
    import_electron.ipcRenderer.send("open-overlay", init);
  },
  closeOverlay: () => {
    import_electron.ipcRenderer.send("close-overlay");
  },
  sendQuickMessage: (message) => {
    import_electron.ipcRenderer.send("send-quickslot", message);
  },
  // 디버깅용 로그 띄우기
  logError: (msg) => import_electron.ipcRenderer.send("overlay-log", msg),
  //  오버레이 창에서: 메인이 방송하는 초기값 수신 (브로드캐스트)
  onOverlayInit: (cb) => {
    const handler = (_, data) => cb(data);
    import_electron.ipcRenderer.on("overlay:init", handler);
    return () => import_electron.ipcRenderer.removeListener("overlay:init", handler);
  },
  //  오버레이 창에서: 방송 타이밍을 놓쳤을 때 직접 가져오기(폴백)
  getOverlayInit: () => import_electron.ipcRenderer.invoke("overlay:get-init")
});
