// Trang đăng nhập - UI Premium với glassmorphism và animations

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Cpu, Eye, EyeOff, Loader2, ArrowRight, Sparkles } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login, isLoading, isAuthenticated } = useAuthStore();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [shakeError, setShakeError] = useState(false);

    // Redirect nếu đã đăng nhập
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    // Xử lý submit form đăng nhập
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!username.trim() || !password.trim()) {
            setError('Vui lòng điền đầy đủ thông tin');
            triggerShake();
            return;
        }

        const result = await login(username.trim().toLowerCase(), password);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error || 'Đăng nhập thất bại');
            triggerShake();
        }
    };

    const triggerShake = () => {
        setShakeError(true);
        setTimeout(() => setShakeError(false), 500);
    };

    return (
        <div className="min-h-screen auth-gradient-bg flex items-center justify-center px-4 py-8 relative overflow-hidden">
            {/* Decorative floating orbs */}
            <div className="auth-orb w-96 h-96 -top-48 -left-48 animate-float" />
            <div className="auth-orb w-64 h-64 top-1/4 -right-32 animate-float" style={{ animationDelay: '2s' }} />
            <div className="auth-orb w-48 h-48 bottom-20 left-1/4 animate-float" style={{ animationDelay: '4s' }} />

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <div className="text-center mb-8 animate-fade-in">
                    <Link to="/" className="inline-flex items-center gap-3 group">
                        <div className="relative">
                            <Cpu className="h-12 w-12 text-arduino-teal transition-transform group-hover:scale-110" />
                            <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-arduino-light animate-pulse" />
                        </div>
                        <span className="text-3xl font-bold text-white">
                            Arduino<span className="text-arduino-teal">Hub</span>
                        </span>
                    </Link>
                    <p className="text-gray-400 mt-3 text-lg">
                        Chào mừng bạn quay lại! 👋
                    </p>
                </div>

                {/* Login Card */}
                <div className="auth-card animate-slide-up">
                    <h1 className="text-2xl font-bold text-center text-white mb-2">
                        Đăng nhập
                    </h1>
                    <p className="text-gray-400 text-center text-sm mb-8">
                        Tiếp tục hành trình học Arduino của bạn
                    </p>

                    {error && (
                        <div className={`auth-error mb-6 ${shakeError ? 'shake' : ''}`}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="username" className="auth-label">
                                Tên đăng nhập
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Nhập username của bạn"
                                autoComplete="username"
                                className="auth-input"
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="auth-label">
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Nhập mật khẩu"
                                    autoComplete="current-password"
                                    className="auth-input pr-12"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`auth-btn-primary flex items-center justify-center gap-2 mt-8 ${isLoading ? 'loading' : ''}`}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Đang đăng nhập...
                                </>
                            ) : (
                                <>
                                    Đăng nhập
                                    <ArrowRight className="h-5 w-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 text-gray-500 bg-transparent">
                                Chưa có tài khoản?
                            </span>
                        </div>
                    </div>

                    <Link to="/register" className="auth-btn-secondary">
                        Tạo tài khoản mới
                    </Link>
                </div>

                <p className="text-center text-gray-500 text-sm mt-8 animate-fade-in">
                    HNUE - Khoa Kỹ thuật & Công nghệ
                </p>
            </div>
        </div>
    );
}
