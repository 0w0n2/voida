import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage.tsx';
import TutorialMainPage from './pages/TutorialMainPage.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<MainPage />} />
        <Route path='/tutorial' element={<TutorialMainPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
