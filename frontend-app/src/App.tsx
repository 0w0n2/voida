import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from '@/pages/MainPage.tsx';
import LoginPage from '@/pages/LoginPage.tsx';
import RegisterPage from '@/pages/RegisterPage.tsx';
import EmailAuthPage from '@/pages/EmailAuthPage.tsx';
import TutorialMainPage from '@/pages/TutorialMainPage.tsx';
import UserTypePage from '@/pages/UserTypePage';
import TutorialGeneralPage from '@/pages/TutorialGeneralPage.tsx';
import TutorialLipReadingPage from '@/pages/TutorialLipReadingPage.tsx';
import TestGeneralPage from '@/pages/TestGeneralPage.tsx';
import TestLipReadingPage from '@/pages/TestLipReadingPage.tsx';
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
        <Route path="/tutorial/lip-reading" element={<TutorialLipReadingPage />} />
        <Route path="/tutorial/test/general" element={<TestGeneralPage />} />
        <Route path="/tutorial/test/lip-reading" element={<TestLipReadingPage />} /> 
        <Route path="/rooms" element={<RoomsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
