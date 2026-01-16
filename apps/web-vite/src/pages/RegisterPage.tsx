// Trang đăng ký - UI Premium với glassmorphism, validation real-time

import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Cpu, Eye, EyeOff, Loader2, ArrowRight, Check, X, Sparkles, Shield } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

export default function RegisterPage() {
    const navigate = useNavigate();
    const { register, isLoading, isAuthenticated } = useAuthStore();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [shakeError, setShakeError] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const validations = useMemo(() => ({
        usernameLength: username.length >= 3 && username.length <= 20,
        usernameFormat: /^[a-zA-Z0-9_]*$/.test(username),
        usernameValid: /^[a-zA-Z0-9_]{3,20}$/.test(username),
        passwordLength: password.length >= 6,
        passwordsMatch: password === confirmPassword && confirmPassword.length > 0,
    }), [username, password, confirmPassword]);

    const passwordStrength = useMemo(() => {
        if (!password) return { level: 0, label: '', color: '' };

        let score = 0;
        if (password.length >= 6) score++;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        if (score <= 2) return { level: 1, label: 'Yếu', color: 'bg-red-500' };
        if (score <= 3) return { level: 2, label: 'Trung bình', color: 'bg-yellow-500' };
        if (score <= 4) return { level: 3, label: 'Mạnh', color: 'bg-green-500' };
        return { level: 4, label: 'Rất mạnh', color: 'bg-emerald-400' };
    }, [password]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validations.usernameValid) {
            setError('Username 3-20 ký tự, chỉ chứa chữ cái, số và dấu _');
            triggerShake();
            return;
        }

        if (!validations.passwordLength) {
            setError('Mật khẩu tối thiểu 6 ký tự');
            triggerShake();
            return;
        }

        if (!validations.passwordsMatch) {
            setError('Mật khẩu xác nhận không khớp');
            triggerShake();
            return;
        }

        const result = await register(username.trim().toLowerCase(), password);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error || 'Đăng ký thất bại');
            triggerShake();
        }
    };

    const triggerShake = () => {
        setShakeError(true);
        setTimeout(() => setShakeError(false), 500);
    };

    const ValidationItem = ({ valid, text }: { valid: boolean; text: string }) => (
        <div className={`flex items-center gap-2 text-sm transition-all duration-300 ${valid ? 'text-green-400' : 'text-gray-500'}`}>
            {valid ? <Check className="h-4 w-4 auth-success-icon" /> : <X className="h-4 w-4" />}
            <span>{text}</span>
        </div>
    );

    return (
        <div className="min-h-screen auth-gradient-bg flex items-center justify-center px-4 py-8 relative overflow-hidden">
            <div className="auth-orb w-96 h-96 -top-48 -right-48 animate-float" />
            <div className="auth-orb w-64 h-64 bottom-1/4 -left-32 animate-float" style={{ animationDelay: '2s' }} />
            <div className="auth-orb w-48 h-48 top-20 right-1/4 animate-float" style={{ animationDelay: '4s' }} />

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-6 md:mb-8 animate-fade-in">
                    <Link to="/" className="inline-flex items-center gap-2 md:gap-3 group">
                        <div className="relative">
                            <Cpu className="h-10 w-10 md:h-12 md:w-12 text-arduino-teal transition-transform group-hover:scale-110" />
                            <Sparkles className="absolute -top-1 -right-1 h-3 w-3 md:h-4 md:w-4 text-arduino-yellow animate-pulse" />
                        </div>
                        <span className="text-2xl md:text-3xl font-bold text-white">
                            Arduino<span className="text-arduino-teal">Hub</span>
                        </span>
                    </Link>
                    <p className="text-gray-400 mt-2 md:mt-3 text-base md:text-lg">
                        Bắt đầu hành trình học Arduino! 🚀
                    </p>
                </div>

                <div className="auth-card animate-slide-up">
                    <h1 className="text-xl md:text-2xl font-bold text-center text-white mb-2">
                        Tạo tài khoản
                    </h1>
                    <p className="text-gray-400 text-center text-sm mb-8">
                        Miễn phí, chỉ mất 30 giây
                    </p>

                    {error && (
                        <div className={`auth-error mb-6 ${shakeError ? 'shake' : ''}`}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="username" className="auth-label">Tên đăng nhập</label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Nhập username (VD: sinhvien01)"
                                autoComplete="username"
                                className="auth-input"
                                disabled={isLoading}
                            />
                            {username && (
                                <div className="mt-3 space-y-1.5">
                                    <ValidationItem valid={validations.usernameLength} text="3-20 ký tự" />
                                    <ValidationItem valid={validations.usernameFormat} text="Chỉ chứa chữ, số và dấu _" />
                                </div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="auth-label">Mật khẩu</label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Tối thiểu 6 ký tự"
                                    autoComplete="new-password"
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

                            {password && (
                                <div className="mt-3">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Shield className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-gray-400">Độ mạnh:</span>
                                        <span className={`text-sm font-medium ${passwordStrength.level === 1 ? 'text-red-400' :
                                            passwordStrength.level === 2 ? 'text-yellow-400' : 'text-green-400'
                                            }`}>
                                            {passwordStrength.label}
                                        </span>
                                    </div>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4].map((level) => (
                                            <div
                                                key={level}
                                                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${level <= passwordStrength.level ? passwordStrength.color : 'bg-gray-700'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="auth-label">Xác nhận mật khẩu</label>
                            <input
                                id="confirmPassword"
                                type={showPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Nhập lại mật khẩu"
                                autoComplete="new-password"
                                className="auth-input"
                                disabled={isLoading}
                            />
                            {confirmPassword && (
                                <div className="mt-3">
                                    <ValidationItem
                                        valid={validations.passwordsMatch}
                                        text={validations.passwordsMatch ? 'Mật khẩu khớp' : 'Mật khẩu không khớp'}
                                    />
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !validations.usernameValid || !validations.passwordLength || !validations.passwordsMatch}
                            className={`auth-btn-primary flex items-center justify-center gap-2 mt-8 ${isLoading ? 'loading' : ''}`}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Đang tạo tài khoản...
                                </>
                            ) : (
                                <>
                                    Tạo tài khoản
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
                            <span className="px-4 text-gray-500 bg-transparent">Đã có tài khoản?</span>
                        </div>
                    </div>

                    <Link to="/login" className="auth-btn-secondary">
                        Đăng nhập
                    </Link>
                </div>

                <p className="text-center text-gray-500 text-sm mt-8 animate-fade-in">
                    HNUE - Khoa Kỹ thuật & Công nghệ
                </p>
            </div>
        </div>
    );
}
