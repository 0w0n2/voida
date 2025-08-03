import { BrowserRouter, Routes, Route } from 'react-router-dom';
import StartingPage from '@/pages/StartingPage';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import EmailAuthPage from '@/pages/auth/EmailAuthPage';
import TutorialMainPage from '@/pages/tutorial/TutorialMainPage';
import UserTypePage from '@/pages/tutorial/UserTypePage';
import TutorialGeneralPage from '@/pages/tutorial/TutorialGeneralPage';
import TutorialLipReadingPage from '@/pages/tutorial/TutorialLipReadingPage';
import TestGeneralPage from '@/pages/tutorial/TestGeneralPage';
import TestLipReadingPage from '@/pages/tutorial/TestLipReadingPage';
import CallbackPage from '@/components/auth/callback';
// 테스트용
import MainForm from '@/components/Main/MainForm';
import CodeCheck from '@/components/Main/CodeCheck';
import MyPage from '@/pages/MyPage';
import MeetingRoomPage from '@/pages/MeetingRoomPage';
import MainPage from '@/pages/MainPage';
import OverlayPage from '@/pages/OverlayPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/email-auth" element={<EmailAuthPage />} />
        <Route path="/tutorial" element={<TutorialMainPage />} />
        <Route path="/tutorial/user-type" element={<UserTypePage />} />
        <Route path="/tutorial/general" element={<TutorialGeneralPage />} />
        <Route
          path="/tutorial/lip-reading"
          element={<TutorialLipReadingPage />}
        />
        <Route path="/tutorial/test/general" element={<TestGeneralPage />} />
        <Route
          path="/tutorial/test/lip-reading"
          element={<TestLipReadingPage />}
        />
        <Route path="/meeting-room" element={<MeetingRoomPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/callback" element={<CallbackPage />} />
        <Route path="/mypage" element={<MyPage />} />
        {/* <Route path="/rooms/create" element={<CreateRoomPage />} /> */}
        {/* <Route path="/rooms/join" element={<JoinRoomPage />} /> */}
        // 테스트용
        <Route path="/main/room" element={<MainForm />} />
        <Route path="/codecheck" element={<CodeCheck />} />
        // 오버레이
        <Route path='/overlay/:roomId' element={<OverlayPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
