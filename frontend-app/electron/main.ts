import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { closeOverlayWindow, createOverlayWindow } from './overlayWindow';

let win: BrowserWindow;

app.whenReady().then(() => {
  win = new BrowserWindow({
    width: 1440,
    height: 900,
    icon: path.join(__dirname, 'assets', 'icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      devTools: true,
    },
  });

  // win.webContents.openDevTools();

  const isDev = !!process.env.ELECTRON_DEV;

  if (isDev) {
    win.loadURL('http://localhost:5173');
  } else {
    win.loadFile(path.join(__dirname, '../../dist/index.html'));
  }

  ipcMain.on('open-overlay', () => {
    win?.hide();
    createOverlayWindow(isDev);
  });

  ipcMain.on('close-overlay', () => {
    closeOverlayWindow();
    if (win) {
      win.show();
      win.focus();
    }
  });
});
