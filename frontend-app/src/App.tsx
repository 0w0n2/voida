import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from '@/pages/MainPage.tsx';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import EmailAuthPage from '@/pages/auth/EmailAuthPage';
import TutorialMainPage from '@/pages/tutorial/TutorialMainPage';
import UserTypePage from '@/pages/tutorial/UserTypePage';
import TutorialGeneralPage from '@/pages/tutorial/TutorialGeneralPage';
import TutorialLipReadingPage from '@/pages/tutorial/TutorialLipReadingPage';
import TestGeneralPage from '@/pages/tutorial/TestGeneralPage';
import TestLipReadingPage from '@/pages/tutorial/TestLipReadingPage';
import RoomsPage from '@/pages/RoomsPage.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
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
        <Route path="/rooms" element={<RoomsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
