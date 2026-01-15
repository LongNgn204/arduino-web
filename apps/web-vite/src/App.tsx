// App.tsx - Main routing setup với Update Popup

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UpdatePopup from './components/UpdatePopup';

// Placeholder Dashboard page
function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">🎉 Dashboard</h1>
        <p className="text-gray-400">Chào mừng bạn đến với Arduino Hub!</p>
        <p className="text-gray-500 text-sm mt-2">(Trang này sẽ được phát triển thêm)</p>
      </div>
    </div>
  );
}

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
