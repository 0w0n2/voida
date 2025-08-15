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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  closeOverlayWindow,
  createOverlayWindow
});
