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
  logError: (msg) => import_electron.ipcRenderer.send("overlay-log", msg),
  onOverlayInit: (cb) => {
    const handler = (_, data) => cb(data);
    import_electron.ipcRenderer.on("overlay:init", handler);
    return () => import_electron.ipcRenderer.removeListener("overlay:init", handler);
  },
  getOverlayInit: () => import_electron.ipcRenderer.invoke("overlay:get-init")
});
