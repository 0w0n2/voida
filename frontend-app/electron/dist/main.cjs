"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
let win;
electron_1.app.whenReady().then(() => {
    win = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });
    // 👇 개발용일 때는 Vite dev 서버 URL
    win.loadURL('http://localhost:5173');
});
