import { BrowserWindow, screen } from 'electron';
import * as path from 'path';

let overlayWin: BrowserWindow | null = null;

export function createOverlayWindow(isDev: boolean) {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth } = primaryDisplay.workAreaSize;

  const overlayWidth = 320;
  const overlayHeight = 480;

  const margin = 16;
  const overlayX = screenWidth - overlayWidth - margin;
  const overlayY = margin;

  overlayWin = new BrowserWindow({
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
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (isDev) {
    const devURL = 'http://localhost:5173/#/live-overlay';
    overlayWin.loadURL(devURL);
    // overlayWin.webContents.openDevTools({ mode: 'detach' });
  } else {
    const prodHTML = path.join(__dirname, '../../dist/index.html');
    const prodHash = '/live-overlay';
    overlayWin.loadFile(prodHTML, { hash: prodHash });
  }

  overlayWin.setIgnoreMouseEvents(false);
}

export function closeOverlayWindow() {
  if (!overlayWin) return;
  overlayWin.close();
  overlayWin = null;
}
