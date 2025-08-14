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

  ipcMain.on('open-overlay', (_e, init?: { roomId: string }) => {
    const roomId = init?.roomId; // NEW
    if (!roomId) {
      console.error('[open-overlay] roomId 누락');
      return;
    }

    win?.hide();
    const overlayWin = createOverlayWindow(isDev);

    if (isDev) {
      const overlayUrl = `http://localhost:5173/#/live-overlay?roomId=${encodeURIComponent(
        roomId,
      )}`; // NEW
      overlayWin.loadURL(overlayUrl); // NEW
    } else {
      const prodHTML = path.join(__dirname, '../../dist/index.html');
      const hash = `/live-overlay?roomId=${encodeURIComponent(roomId)}`; // NEW
      overlayWin.loadFile(prodHTML, { hash }); // NEW
    }

    overlayWin.show(); // NEW
    overlayWin.focus(); // NEW
  });

  ipcMain.on('close-overlay', () => {
    closeOverlayWindow();
    if (win) {
      win.show();
      win.focus();
    }
  });

  ipcMain.on('send-quickslot', (event, message) => {
    event.sender.send('quickslot-message', message);
    console.log(`Received quickslot: ${message}`);
  });

  // 디버깅용 로그 띄우기
  ipcMain.on('overlay-log', (_e, msg) => {
    console.log('[OVERLAY]', msg);
  });
});
