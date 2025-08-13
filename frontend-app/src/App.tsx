import { HashRouter, Routes, Route } from 'react-router-dom';
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
import OAuthCallback from '@/components/auth/OAuthCallback';
import MainPage from '@/pages/MainPage';
import MyPage from '@/pages/MyPage';
import MeetingRoomPage from '@/pages/MeetingRoomPage';
import LiveRoomOverlay from '@/components/live-room/LiveOverlay';
import VoiceRoom from '@/components/live-room/VoiceRoom';
import GlobalAlert from '@/components/common/GlobalAlert';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <HashRouter>
      <GlobalAlert />
      <Routes>
        <Route path="" element={<NotFound />} />
        <Route path="/" element={<StartingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/email-auth" element={<EmailAuthPage />} />
        <Route path="/oauth/success" element={<OAuthCallback />} />
        <Route path="/tutorial" element={<TutorialMainPage />} />
        <Route path="/tutorial/user-type" element={<UserTypePage />} />
        <Route path="/tutorial/general" element={<TutorialGeneralPage />} />
        <Route path="/tutorial/lip-reading" element={<TutorialLipReadingPage />} />
        <Route path="/tutorial/test/general" element={<TestGeneralPage />} />
        <Route path="/tutorial/test/lip-reading" element={<TestLipReadingPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/meeting-room/:meetingRoomId" element={<MeetingRoomPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/voice-test" element={<VoiceRoom />} />
        <Route path="/live-overlay" element={<LiveRoomOverlay />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
