import { BrowserWindow, screen } from 'electron';
import * as path from 'path';

function createOverlay(dev = true): BrowserWindow {
  const { width: screenWidth } = screen.getPrimaryDisplay().workAreaSize;

  const overlayWin = new BrowserWindow({
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
    overlayWin.loadURL(`http://localhost:5173/#/overlay`);
  } else {
    overlayWin.loadFile(path.join(__dirname, '../renderer/index.html'), {
      hash: '/overlay',
    });
  }

  return overlayWin;
}

module.exports = { createOverlay };
