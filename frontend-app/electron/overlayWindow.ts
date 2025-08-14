import { BrowserWindow, screen } from 'electron';
import * as path from 'path';

let overlayWin: BrowserWindow | null = null;

export function createOverlayWindow(_isDev: boolean): BrowserWindow {
  if (overlayWin && !overlayWin.isDestroyed()) {
    overlayWin.show();
    overlayWin.focus();
    return overlayWin;
  }
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth } = primaryDisplay.workAreaSize;

  const overlayWidth = 400;
  const overlayHeight = 600;

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
    titleBarStyle: 'hidden',
    backgroundColor: '#00000000',
    skipTaskbar: true,
    focusable: true,
    hasShadow: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  overlayWin.setIgnoreMouseEvents(false);

  overlayWin.on('closed', () => {overlayWin = null;});

  return overlayWin; 
}

export function closeOverlayWindow() {
  if (!overlayWin) return;
  overlayWin.close();
  overlayWin = null;
}
