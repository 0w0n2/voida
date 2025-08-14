// electron/preload.ts
var import_electron = require("electron");
import_electron.contextBridge.exposeInMainWorld("electronAPI", {
  openOverlay: () => {
    import_electron.ipcRenderer.send("open-overlay");
  },
  closeOverlay: () => {
    import_electron.ipcRenderer.send("close-overlay");
  },
  sendQuickMessage: (message) => {
    import_electron.ipcRenderer.send("send-quickslot", message);
  }
});
