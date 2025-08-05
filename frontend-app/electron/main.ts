import { app, BrowserWindow } from 'electron';
import * as path from 'path';

let win: BrowserWindow;

app.whenReady().then(() => {
  win = new BrowserWindow({
    width: 1440,
    height: 900,
    icon: path.join(__dirname, 'assets', 'icon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      devTools: true,
    },
  });

  win.webContents.openDevTools();

  // 개발용: Vite dev 서버 로드
  if (process.env.ELECTRON_DEV) {
    win.loadURL('http://localhost:5173');
  } else {
    // 배포용: dist/index.html 로드
    win.loadFile(path.join(__dirname, '../../dist/index.html'));
  }
});
