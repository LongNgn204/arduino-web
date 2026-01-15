// App.tsx - Main routing setup với Sidebar và Auth Persistence

import { useEffect } from 'react';
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
import { LeaderboardPage } from './pages/LeaderboardPage';
import { CertificatePage } from './pages/CertificatePage';
import WebIdePage from './pages/WebIdePage';
import UpdatePopup from './components/UpdatePopup';
import Sidebar from './components/Sidebar';
import { useAuthStore } from './stores/authStore';

function AppContent() {
  const { checkAuth } = useAuthStore();

  // Check auth on mount to verify session is still valid
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      {/* Update Popup - Hiển thị ở góc phải dưới */}
      <UpdatePopup version="2.0.0" />

      <Routes>
        {/* Public routes - No sidebar */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes - With sidebar */}
        <Route path="/dashboard" element={
          <Sidebar><DashboardPage /></Sidebar>
        } />
        <Route path="/weeks/:weekId" element={
          <Sidebar><WeekDetailPage /></Sidebar>
        } />
        <Route path="/lessons/:lessonId" element={
          <Sidebar><LessonPage /></Sidebar>
        } />
        <Route path="/labs/:labId" element={
          <Sidebar><LabPage /></Sidebar>
        } />
        <Route path="/quizzes/:quizId" element={
          <Sidebar><QuizPage /></Sidebar>
        } />
        <Route path="/drills/:drillId" element={
          <Sidebar><ExamDrillPage /></Sidebar>
        } />
        <Route path="/leaderboard" element={
          <Sidebar><LeaderboardPage /></Sidebar>
        } />
        <Route path="/certificate" element={
          <Sidebar><CertificatePage /></Sidebar>
        } />
        <Route path="/ide" element={
          <Sidebar><WebIdePage /></Sidebar>
        } />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
