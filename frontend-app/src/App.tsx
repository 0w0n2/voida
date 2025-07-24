import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage.tsx';
import LoginPage from './pages/LoginPage.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
