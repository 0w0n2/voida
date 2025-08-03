import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { createOverlay } from './overlayWindow';

let mainWin: BrowserWindow;
let overlayWin: BrowserWindow | null = null;

// 메인 창 만드는 함수
function createMainWindow() {
  mainWin = new BrowserWindow({
    width: 1280,
    height: 800,
    // 브라우저 관련 옵션 
    // 렌더러에서 사용할 api 등록하는 preload 파일 경로
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  mainWin.loadURL('http://localhost:5173');
}

// electron 초기화 된 후 준비되면 실행
// 창을 띄우는 작업은 요기에서 ㄱㄱ
app.whenReady().then(() => {
  createMainWindow();
  // React -> Electron 메인 프로세스로 메시지 보냄 
  ipcMain.on('join-live', (_, roomId: string) => {
    if (overlayWin) overlayWin.close(); // 기존 창 있으면 제거
    overlayWin = createOverlay(roomId, true); // 새 오버레이 생성
    mainWin.hide(); // 필요 시 메인 창 숨기는거(오버레이만 남기고 싶을 때)
  });
  // 그냥 닫기
  ipcMain.on('leave-live', () => {
    overlayWin?.close();
    overlayWin = null;
    mainWin.show(); // 메인 창 다시 보임
  });
});
