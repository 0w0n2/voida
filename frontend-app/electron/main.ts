import { app, BrowserWindow } from 'electron';
import * as path from 'path';

let win: BrowserWindow;

app.whenReady().then(() => {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  win.loadURL('http://localhost:5173');
});
