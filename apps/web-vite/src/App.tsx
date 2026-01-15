// App.tsx - Main routing setup với Update Popup

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import WeekDetailPage from './pages/WeekDetailPage';
import LessonPage from './pages/LessonPage';
import LabPage from './pages/LabPage';
import QuizPage from './pages/QuizPage';
import { ExamDrillPage } from './pages/ExamDrillPage';
import UpdatePopup from './components/UpdatePopup';

function App() {
  return (
    <BrowserRouter>
      {/* Update Popup - Hiển thị ở góc phải dưới */}
      <UpdatePopup version="2.0.0" />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/weeks/:weekId" element={<WeekDetailPage />} />
        <Route path="/lessons/:lessonId" element={<LessonPage />} />
        <Route path="/labs/:labId" element={<LabPage />} />
        <Route path="/quizzes/:quizId" element={<QuizPage />} />
        <Route path="/drills/:drillId" element={<ExamDrillPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;



