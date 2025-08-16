import { BrowserWindow, screen } from 'electron';
import type { Rectangle, Display } from 'electron';
import * as path from 'path';

let overlayWin: BrowserWindow | null = null;

type OverlayPos = 'TOPLEFT' | 'TOPRIGHT' | 'BOTTOMLEFT' | 'BOTTOMRIGHT';

function calcOverlayBounds(
  display: Display,
  size: { w: number; h: number },
  pos: OverlayPos,
  margin = 16,
): Pick<Rectangle, 'x' | 'y' | 'width' | 'height'> {
  const { workArea } = display; 
  const xLeft = workArea.x + margin;
  const xRight = workArea.x + workArea.width - size.w - margin;
  const yTop = workArea.y + margin;
  const yBottom = workArea.y + workArea.height - size.h - margin;

  const map: Record<OverlayPos, { x: number; y: number }> = {
    TOPLEFT: { x: xLeft, y: yTop },
    TOPRIGHT: { x: xRight, y: yTop },
    BOTTOMLEFT: { x: xLeft, y: yBottom },
    BOTTOMRIGHT: { x: xRight, y: yBottom },
  };

  return { x: map[pos].x, y: map[pos].y, width: size.w, height: size.h };
}
export function createOverlayWindow(
  _isDev: boolean,
  overlayPosition: OverlayPos = 'TOPRIGHT',
  overlayTransparency = 30
): BrowserWindow {
  const overlaySize = { w: 400, h: 600 };
  const targetDisplay = screen.getDisplayNearestPoint(screen.getCursorScreenPoint());
  const bounds = calcOverlayBounds(targetDisplay, overlaySize, overlayPosition, overlayTransparency);

  if (overlayWin && !overlayWin.isDestroyed()) {
    overlayWin.setBounds(bounds);
    overlayWin.show();
    overlayWin.focus();
    return overlayWin;
  }

  overlayWin = new BrowserWindow({
    width: bounds.width,
    height: bounds.height,
    x: bounds.x,
    y: bounds.y,
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
  overlayWin.on('closed', () => { overlayWin = null; });

  const realign = () => {
    if (!overlayWin) return;
    const disp = screen.getDisplayNearestPoint(screen.getCursorScreenPoint());
    const b = calcOverlayBounds(disp, overlaySize, overlayPosition);
    overlayWin.setBounds(b);
  };
  screen.on('display-metrics-changed', realign);
  screen.on('display-added', realign);
  screen.on('display-removed', realign);

  return overlayWin;
}

export function closeOverlayWindow() {
  if (!overlayWin) return;
  overlayWin.close();
  overlayWin = null;
}
