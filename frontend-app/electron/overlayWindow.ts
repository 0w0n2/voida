import { BrowserWindow, screen } from 'electron';
import * as path from 'path';

let overlayWin: BrowserWindow | null = null;

export function createOverlayWindow(_isDev: boolean): BrowserWindow {
  // 이미 떠 있으면 재사용
  if (overlayWin && !overlayWin.isDestroyed()) {
    overlayWin.show();
    overlayWin.focus();
    return overlayWin;
  }
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

  // ⚠️ 여기서는 URL을 로드하지 않음. (main.ts에서 roomId 포함 URL로 로드)
  overlayWin.setIgnoreMouseEvents(false);

  overlayWin.on('closed', () => {
    overlayWin = null;
  });

  return overlayWin; // ✅ 반환 보장
}

export function closeOverlayWindow() {
  if (!overlayWin) return;
  overlayWin.close();
  overlayWin = null;
}
