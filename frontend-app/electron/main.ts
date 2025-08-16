import { app, BrowserWindow, ipcMain, globalShortcut } from 'electron';
import * as path from 'path';
import { closeOverlayWindow, createOverlayWindow } from './overlayWindow';

let win: BrowserWindow;

type OverlayPos = 'TOPLEFT' | 'TOPRIGHT' | 'BOTTOMLEFT' | 'BOTTOMRIGHT';
let lastOverlayInit: { roomId: string; overlayPosition?: OverlayPos; overlayTransparency?: number } | null = null;

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

  // ---------- (A) 뒤로/앞으로/새로고침: IPC ----------
  ipcMain.on('nav:back', (e) => {
    const wc = e.sender;
    if (wc.canGoBack()) wc.goBack();
  });
  ipcMain.on('nav:forward', (e) => {
    const wc = e.sender;
    if (wc.canGoForward()) wc.goForward();
  });
  ipcMain.on('nav:reload', (e) => {
    const wc = e.sender;
    wc.reload();
  });

  // ---------- (B) 전역 단축키(포커스된 창 기준) ----------
  const goBackFocused = () => {
    const focused = BrowserWindow.getFocusedWindow();
    const wc = focused?.webContents;
    if (wc?.canGoBack()) wc.goBack();
  };
  const goForwardFocused = () => {
    const focused = BrowserWindow.getFocusedWindow();
    const wc = focused?.webContents;
    if (wc?.canGoForward()) wc.goForward();
  };

  // Windows/Linux: Alt+Left/Right, macOS: Cmd+[/]
  globalShortcut.register('Alt+Left', goBackFocused);
  globalShortcut.register('Alt+Right', goForwardFocused);
  globalShortcut.register('CommandOrControl+[', goBackFocused);
  globalShortcut.register('CommandOrControl+]', goForwardFocused);

  app.on('will-quit', () => {
    globalShortcut.unregisterAll();
  });

  // ---------- (C) Windows 마우스 뒤로/앞으로 버튼 ----------
  const attachAppCommand = (bw: BrowserWindow) => {
    bw.on('app-command', (_e, cmd) => {
      if (cmd === 'browser-backward') goBackFocused();
      if (cmd === 'browser-forward') goForwardFocused();
    });
  };
  attachAppCommand(win);

  // ---------- 오버레이 열기 ----------
  ipcMain.on('open-overlay', (_e, init?: { roomId: string; overlayPosition?: OverlayPos; overlayTransparency?: number }) => {
    const roomId = init?.roomId;
    const overlayPosition = init?.overlayPosition ?? 'TOPRIGHT';
    const overlayTransparency = init?.overlayTransparency ?? 30;

    if (!roomId) {
      console.error('[open-overlay] roomId 누락');
      return;
    }

    lastOverlayInit = { roomId, overlayPosition };
    win?.hide();

    const overlayWin = createOverlayWindow(isDev, overlayPosition, overlayTransparency);

    // 오버레이에도 마우스 버튼 뒤/앞 처리 붙이기
    attachAppCommand(overlayWin);

    if (isDev) {
      const overlayUrl = `http://localhost:5173/#/live-overlay?roomId=${encodeURIComponent(roomId)}`;
      overlayWin.loadURL(overlayUrl);
    } else {
      const prodHTML = path.join(__dirname, '../../dist/index.html');
      const hash = `/live-overlay?roomId=${encodeURIComponent(roomId)}`;
      overlayWin.loadFile(prodHTML, { hash });
    }
    overlayWin.webContents.once('did-finish-load', () => {
      overlayWin.webContents.send('overlay:init', { roomId, overlayPosition, overlayTransparency });
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
