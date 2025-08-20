import {
  app,
  BrowserWindow,
  ipcMain,
  globalShortcut,
  shell,
  protocol,
  net,
} from 'electron';
import * as path from 'path';
import { closeOverlayWindow, createOverlayWindow, getOverlayWindow } from './overlayWindow';

let win: BrowserWindow;

type OverlayPos = 'TOPLEFT' | 'TOPRIGHT' | 'BOTTOMLEFT' | 'BOTTOMRIGHT';
let lastOverlayInit: { roomId: string; overlayPosition?: OverlayPos; overlayTransparency?: number } | null = null;

const electronScheme = 'voida-electron';

protocol.registerSchemesAsPrivileged([
  {
    scheme: electronScheme,
    privileges: {
      standard: true,
      secure: true,
      bypassCSP: true,
      allowServiceWorkers: true,
      supportFetchAPI: true,
      corsEnabled: true,
    },
  },
]);

app.whenReady().then(() => {
  const isDev = !app.isPackaged;
  if (!isDev) {
    protocol.handle(electronScheme, ({ url }) => {
      const { pathname } = new URL(url);
      const relativePath = pathname === '/' ? '/index.html' : pathname;
      const filePath = path.join(__dirname, '../../dist', relativePath);
      return net.fetch(`file://${filePath}`);
    });
  }

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

  if (isDev) {
    win.loadURL('http://localhost:5173');
  } else {
    win.loadURL(`${electronScheme}://index.html`);
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
  ipcMain.on("resize-overlay", (_, { width, height, animate }) => {
    const overlayWindow = getOverlayWindow();

    if (!overlayWindow) return;

    if (!animate) {
      const bounds = overlayWindow.getBounds();
      const steps = 10;
      const stepH = (height - bounds.height) / steps;
      let i = 0;

      const interval = setInterval(() => {
        if (!overlayWindow || i >= steps) {
          clearInterval(interval);
          return;
        }
        const b = overlayWindow.getBounds();
        overlayWindow.setBounds({
          ...b,
          height: Math.round(b.height + stepH),
        });
        i++;
      }, 30);
    } else {
      const bounds = overlayWindow.getBounds();
      const steps = 8;
      const stepH = (height - bounds.height) / steps;
      let i = 0;

      const interval = setInterval(() => {
        if (!overlayWindow || i >= steps) {
          clearInterval(interval);
          return;
        }
        const b = overlayWindow.getBounds();
        overlayWindow.setBounds({
          ...b,
          height: Math.round(b.height + stepH),
        });
        i++;
      }, 25);
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
  });

  ipcMain.handle('overlay:get-init', async () => lastOverlayInit);
});
