"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path = require("path");
function createOverlay(roomId, dev) {
    if (dev === void 0) { dev = true; }
    var screenWidth = electron_1.screen.getPrimaryDisplay().workAreaSize.width;
    var overlayWin = new electron_1.BrowserWindow({
        width: 300,
        height: 400,
        x: screenWidth - 300 - 20,
        y: 20,
        transparent: true,
        frame: false,
        alwaysOnTop: true,
        resizable: false,
        hasShadow: false,
        skipTaskbar: true,
        focusable: false,
        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.cjs'),
        },
    });
    overlayWin.setIgnoreMouseEvents(true, { forward: true }); // 클릭 통과
    overlayWin.setBackgroundColor('#00000000'); // 완전 투명
    // 로컬 서버, 배포 서버에 따라 다르게 로드
    if (dev) {
        overlayWin.loadURL("http://localhost:5173/#/overlay");
    }
    else {
        overlayWin.loadFile(path.join(__dirname, '../renderer/index.html'), { hash: "/overlay/".concat(roomId) });
    }
    return overlayWin;
}
module.exports = { createOverlay: createOverlay };
