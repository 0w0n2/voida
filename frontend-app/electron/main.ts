import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { closeOverlayWindow, createOverlayWindow } from './overlayWindow';

let win: BrowserWindow;

type OverlayPos = 'TOPLEFT' | 'TOPRIGHT' | 'BOTTOMLEFT' | 'BOTTOMRIGHT';
let lastOverlayInit: { roomId: string; overlayPosition?: OverlayPos } | null = null;

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


  const isDev = !!process.env.ELECTRON_DEV;

  if (isDev) {
    win.loadURL('http://localhost:5173');
  } else {
    win.loadFile(path.join(__dirname, '../../dist/index.html'));
  }

  ipcMain.on('open-overlay', (_e, init?: { roomId: string; overlayPosition?: OverlayPos }) => {
    const roomId = init?.roomId;
    const overlayPosition = init?.overlayPosition ?? 'TOPRIGHT';

    if (!roomId) {
      console.error('[open-overlay] roomId 누락');
      return;
    }

    lastOverlayInit = { roomId, overlayPosition };

    win?.hide();

    const overlayWin = createOverlayWindow(isDev, overlayPosition);

    if (isDev) {
      const overlayUrl = `http://localhost:5173/#/live-overlay?roomId=${encodeURIComponent(roomId)}`;
      overlayWin.loadURL(overlayUrl);
    } else {
      const prodHTML = path.join(__dirname, '../../dist/index.html');
      const hash = `/live-overlay?roomId=${encodeURIComponent(roomId)}`;
      overlayWin.loadFile(prodHTML, { hash });
    }
    overlayWin.webContents.once('did-finish-load', () => {
      overlayWin.webContents.send('overlay:init', { roomId, overlayPosition });
    });

    overlayWin.show();
    overlayWin.focus();
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

  ipcMain.on('overlay-log', (_e, msg) => {
    console.log('[OVERLAY]', msg);
  });

  ipcMain.handle('overlay:get-init', async () => lastOverlayInit);
});
