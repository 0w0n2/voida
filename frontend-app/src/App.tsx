import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from '@/pages/MainPage.tsx';
import LoginPage from '@/pages/LoginPage.tsx';
import RegisterPage from '@/pages/RegisterPage.tsx';
import EmailAuthPage from '@/pages/EmailAuthPage.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="email-auth" element={<EmailAuthPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
