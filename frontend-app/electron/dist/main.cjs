var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// electron/main.ts
var import_electron2 = require("electron");
var path2 = __toESM(require("path"), 1);

// electron/overlayWindow.ts
var import_electron = require("electron");
var path = __toESM(require("path"), 1);
var overlayWin = null;
function calcOverlayBounds(display, size, pos, margin = 16) {
  const { workArea } = display;
  const xLeft = workArea.x + margin;
  const xRight = workArea.x + workArea.width - size.w - margin;
  const yTop = workArea.y + margin;
  const yBottom = workArea.y + workArea.height - size.h - margin;
  const map = {
    TOPLEFT: { x: xLeft, y: yTop },
    TOPRIGHT: { x: xRight, y: yTop },
    BOTTOMLEFT: { x: xLeft, y: yBottom },
    BOTTOMRIGHT: { x: xRight, y: yBottom }
  };
  return { x: map[pos].x, y: map[pos].y, width: size.w, height: size.h };
}
function createOverlayWindow(_isDev, overlayPosition = "TOPRIGHT") {
  const overlaySize = { w: 400, h: 600 };
  const targetDisplay = import_electron.screen.getDisplayNearestPoint(import_electron.screen.getCursorScreenPoint());
  const bounds = calcOverlayBounds(targetDisplay, overlaySize, overlayPosition);
  if (overlayWin && !overlayWin.isDestroyed()) {
    overlayWin.setBounds(bounds);
    overlayWin.show();
    overlayWin.focus();
    return overlayWin;
  }
  overlayWin = new import_electron.BrowserWindow({
    width: bounds.width,
    height: bounds.height,
    x: bounds.x,
    y: bounds.y,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    titleBarStyle: "hidden",
    backgroundColor: "#00000000",
    skipTaskbar: true,
    focusable: true,
    hasShadow: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js")
    }
  });
  overlayWin.setIgnoreMouseEvents(false);
  overlayWin.on("closed", () => {
    overlayWin = null;
  });
  const realign = () => {
    if (!overlayWin) return;
    const disp = import_electron.screen.getDisplayNearestPoint(import_electron.screen.getCursorScreenPoint());
    const b = calcOverlayBounds(disp, overlaySize, overlayPosition);
    overlayWin.setBounds(b);
  };
  import_electron.screen.on("display-metrics-changed", realign);
  import_electron.screen.on("display-added", realign);
  import_electron.screen.on("display-removed", realign);
  return overlayWin;
}
function closeOverlayWindow() {
  if (!overlayWin) return;
  overlayWin.close();
  overlayWin = null;
}

// electron/main.ts
var win;
var lastOverlayInit = null;
import_electron2.app.whenReady().then(() => {
  win = new import_electron2.BrowserWindow({
    width: 1440,
    height: 900,
    icon: path2.join(__dirname, "assets", "icon.ico"),
    webPreferences: {
      preload: path2.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      devTools: true
    }
  });
  const isDev = !!process.env.ELECTRON_DEV;
  if (isDev) {
    win.loadURL("http://localhost:5173");
  } else {
    win.loadFile(path2.join(__dirname, "../../dist/index.html"));
  }
  import_electron2.ipcMain.on("nav:back", (e) => {
    const wc = e.sender;
    if (wc.canGoBack()) wc.goBack();
  });
  import_electron2.ipcMain.on("nav:forward", (e) => {
    const wc = e.sender;
    if (wc.canGoForward()) wc.goForward();
  });
  import_electron2.ipcMain.on("nav:reload", (e) => {
    const wc = e.sender;
    wc.reload();
  });
  const goBackFocused = () => {
    const focused = import_electron2.BrowserWindow.getFocusedWindow();
    const wc = focused?.webContents;
    if (wc?.canGoBack()) wc.goBack();
  };
  const goForwardFocused = () => {
    const focused = import_electron2.BrowserWindow.getFocusedWindow();
    const wc = focused?.webContents;
    if (wc?.canGoForward()) wc.goForward();
  };
  import_electron2.globalShortcut.register("Alt+Left", goBackFocused);
  import_electron2.globalShortcut.register("Alt+Right", goForwardFocused);
  import_electron2.globalShortcut.register("CommandOrControl+[", goBackFocused);
  import_electron2.globalShortcut.register("CommandOrControl+]", goForwardFocused);
  import_electron2.app.on("will-quit", () => {
    import_electron2.globalShortcut.unregisterAll();
  });
  const attachAppCommand = (bw) => {
    bw.on("app-command", (_e, cmd) => {
      if (cmd === "browser-backward") goBackFocused();
      if (cmd === "browser-forward") goForwardFocused();
    });
  };
  attachAppCommand(win);
  import_electron2.ipcMain.on("open-overlay", (_e, init) => {
    const roomId = init?.roomId;
    const overlayPosition = init?.overlayPosition ?? "TOPRIGHT";
    if (!roomId) {
      console.error("[open-overlay] roomId \uB204\uB77D");
      return;
    }
    lastOverlayInit = { roomId, overlayPosition };
    win?.hide();
    const overlayWin2 = createOverlayWindow(isDev, overlayPosition);
    attachAppCommand(overlayWin2);
    if (isDev) {
      const overlayUrl = `http://localhost:5173/#/live-overlay?roomId=${encodeURIComponent(roomId)}`;
      overlayWin2.loadURL(overlayUrl);
    } else {
      const prodHTML = path2.join(__dirname, "../../dist/index.html");
      const hash = `/live-overlay?roomId=${encodeURIComponent(roomId)}`;
      overlayWin2.loadFile(prodHTML, { hash });
    }
    overlayWin2.webContents.once("did-finish-load", () => {
      overlayWin2.webContents.send("overlay:init", { roomId, overlayPosition });
    });
    overlayWin2.show();
    overlayWin2.focus();
  });
  import_electron2.ipcMain.on("close-overlay", () => {
    closeOverlayWindow();
    if (win) {
      win.show();
      win.focus();
    }
  });
  import_electron2.ipcMain.on("send-quickslot", (event, message) => {
    event.sender.send("quickslot-message", message);
    console.log(`Received quickslot: ${message}`);
  });
  import_electron2.ipcMain.on("overlay-log", (_e, msg) => {
    console.log("[OVERLAY]", msg);
  });
  import_electron2.ipcMain.handle("overlay:get-init", async () => lastOverlayInit);
});
