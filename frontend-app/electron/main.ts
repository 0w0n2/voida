import { app, BrowserWindow, ipcMain, globalShortcut, session, shell } from 'electron';
import * as path from 'path';
import { closeOverlayWindow, createOverlayWindow } from './overlayWindow';

let win: BrowserWindow;

type OverlayPos = 'TOPLEFT' | 'TOPRIGHT' | 'BOTTOMLEFT' | 'BOTTOMRIGHT';
let lastOverlayInit: { roomId: string; overlayPosition?: OverlayPos; overlayTransparency?: number } | null = null;

app.whenReady().then(() => {
  const isDev = !app.isPackaged;

  const preloadPath = isDev
    ? path.join(__dirname, 'preload.js')
    : path.join(process.resourcesPath, 'app.asar.unpacked', 'electron', 'dist', 'preload.js'); 

  win = new BrowserWindow({
    width: 1440,
    height: 900,
    icon: path.join(__dirname, 'assets', 'icon.ico'),
    webPreferences: {
      preload: preloadPath,
      nodeIntegration: false,
      contextIsolation: true,
      devTools: true,
    },
  });

  const filter = {
    urls: ['https://api.voida.site/login/oauth2/code/*'],
  };

  session.defaultSession.webRequest.onHeadersReceived(filter, (details, callback) => {
    if (details.statusCode === 302 && details.responseHeaders?.Location) {
      const location = details.responseHeaders.Location[0];
      if (location.startsWith('file://')) {
        console.log('Intercepted file:// redirect to:', location);

        details.statusCode = 200;
        delete details.responseHeaders.Location;

        if (win) {
          win.loadURL(location);
        }
        callback({ cancel: false, responseHeaders: details.responseHeaders });
        return;
      }
    }
    callback({ cancel: false, responseHeaders: details.responseHeaders });
  });

  if (isDev) {
    win.loadURL('http://localhost:5173');
  } else {
    win.loadFile(path.join(__dirname, '../../dist/index.html'));
  }

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
  ipcMain.handle('app:get-version', () => {
    app.getVersion();
  });
  ipcMain.on('open-external-link', (event, url) => {
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      shell.openExternal(url); 
    }
  });

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

  globalShortcut.register('Alt+Left', goBackFocused);
  globalShortcut.register('Alt+Right', goForwardFocused);
  globalShortcut.register('CommandOrControl+[', goBackFocused);
  globalShortcut.register('CommandOrControl+]', goForwardFocused);

  app.on('will-quit', () => {
    globalShortcut.unregisterAll();
  });

  const attachAppCommand = (bw: BrowserWindow) => {
    bw.on('app-command', (_e, cmd) => {
      if (cmd === 'browser-backward') goBackFocused();
      if (cmd === 'browser-forward') goForwardFocused();
    });
  };
  attachAppCommand(win);

  ipcMain.on('open-overlay', (_e, init?: { roomId: string; overlayPosition?: OverlayPos; overlayTransparency?: number }) => {
    const roomId = init?.roomId;
    const overlayPosition = init?.overlayPosition ?? 'TOPRIGHT';
    const overlayTransparency = init?.overlayTransparency ?? 30;

    if (!roomId) {
      console.error('[open-overlay] roomId 누락');
      return;
    }

    lastOverlayInit = { roomId, overlayPosition, overlayTransparency };
    win?.hide();

    const overlayWin = createOverlayWindow(isDev, overlayPosition, overlayTransparency);

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
