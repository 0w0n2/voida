var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// electron/overlayWindow.ts
var overlayWindow_exports = {};
__export(overlayWindow_exports, {
  closeOverlayWindow: () => closeOverlayWindow,
  createOverlayWindow: () => createOverlayWindow
});
module.exports = __toCommonJS(overlayWindow_exports);
var import_electron = require("electron");
var path = __toESM(require("path"), 1);
var overlayWin = null;
function createOverlayWindow(isDev) {
  const primaryDisplay = import_electron.screen.getPrimaryDisplay();
  const { width: screenWidth } = primaryDisplay.workAreaSize;
  const overlayWidth = 320;
  const overlayHeight = 480;
  const margin = 16;
  const overlayX = screenWidth - overlayWidth - margin;
  const overlayY = margin;
  overlayWin = new import_electron.BrowserWindow({
    width: overlayWidth,
    height: overlayHeight,
    x: overlayX,
    y: overlayY,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: true,
    focusable: true,
    hasShadow: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js")
    }
  });
  if (isDev) {
    const devURL = "http://localhost:5173/#/live-overlay";
    overlayWin.loadURL(devURL);
  } else {
    const prodHTML = path.join(__dirname, "../../dist/index.html");
    const prodHash = "/live-overlay";
    overlayWin.loadFile(prodHTML, { hash: prodHash });
  }
  overlayWin.setIgnoreMouseEvents(false);
}
function closeOverlayWindow() {
  if (!overlayWin) return;
  overlayWin.close();
  overlayWin = null;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  closeOverlayWindow,
  createOverlayWindow
});
