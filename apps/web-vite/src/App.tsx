// App.tsx - Main routing setup với Sidebar, Auth Persistence, Error Boundary và Lazy Loading

import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import { PageLoading } from './components/LoadingSpinner';
import UpdatePopup from './components/UpdatePopup';
import Sidebar from './components/Sidebar';
import AiChatSidebar from './components/chat/AiChatSidebar';
import ContextualAiAssistant from './components/ContextualAiAssistant';
import { useAuthStore } from './stores/authStore';

// ==========================================
// LAZY LOADED PAGES - Chỉ load khi cần
// ==========================================
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const WeekDetailPage = lazy(() => import('./pages/WeekDetailPage'));
const LessonPage = lazy(() => import('./pages/LessonPage'));
const LabPage = lazy(() => import('./pages/LabPage'));
const QuizPage = lazy(() => import('./pages/QuizPage'));
const WebIdePage = lazy(() => import('./pages/WebIdePage'));
const AiAssistantPage = lazy(() => import('./pages/AiAssistantPage'));

// Named exports - cần wrap trong object
const ExamDrillPage = lazy(() =>
  import('./pages/ExamDrillPage').then(m => ({ default: m.ExamDrillPage }))
);
const LeaderboardPage = lazy(() =>
  import('./pages/LeaderboardPage').then(m => ({ default: m.LeaderboardPage }))
);
const CertificatePage = lazy(() =>
  import('./pages/CertificatePage').then(m => ({ default: m.CertificatePage }))
);
const ProjectListingPage = lazy(() => import('./pages/ProjectListingPage'));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'));
const SavedPage = lazy(() => import('./pages/SavedPage'));
const QuizListingPage = lazy(() => import('./pages/QuizListingPage'));
const ExamDrillListingPage = lazy(() => import('./pages/ExamDrillListingPage'));
const LibraryPage = lazy(() => import('./pages/LibraryPage'));
const QuizHistoryPage = lazy(() => import('./pages/QuizHistoryPage'));

// ==========================================
// APP CONTENT
// ==========================================
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

      {/* Suspense wrapper cho lazy loaded components */}
      <Suspense fallback={<PageLoading />}>
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

          <Route path="/quizzes" element={
            <Sidebar><QuizListingPage /></Sidebar>
          } />
          <Route path="/quizzes/:quizId" element={
            <Sidebar><QuizPage /></Sidebar>
          } />
          <Route path="/history" element={
            <Sidebar><QuizHistoryPage /></Sidebar>
          } />
          <Route path="/drills" element={
            <Sidebar><ExamDrillListingPage /></Sidebar>
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
          <Route path="/projects" element={
            <Sidebar><ProjectListingPage /></Sidebar>
          } />
          <Route path="/projects/:projectId" element={
            <Sidebar><ProjectDetailPage /></Sidebar>
          } />
          <Route path="/saved" element={
            <Sidebar><SavedPage /></Sidebar>
          } />
          <Route path="/ide" element={
            <Sidebar><WebIdePage /></Sidebar>
          } />
          <Route path="/ai-assistant" element={
            <Sidebar><AiAssistantPage /></Sidebar>
          } />
          <Route path="/library" element={
            <Sidebar><LibraryPage /></Sidebar>
          } />
        </Routes>
      </Suspense>

      {/* AI Chat Sidebar - Global */}
      <AiChatSidebar />

      {/* Legacy/Floating AI Chat Popup - Can be removed later or toggled via settings */}
      {/* <AiChatPopup /> */}

      {/* Global Text Selection Handler for Real-time AI */}
      <ContextualAiAssistant onOpenFullChat={(text) => {
        window.dispatchEvent(new CustomEvent('open-ai-chat', {
          detail: { question: text, autoSubmit: true }
        }));
      }} />
    </>
  );
}

// ==========================================
// MAIN APP - Wrapped with ErrorBoundary
// ==========================================
function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
