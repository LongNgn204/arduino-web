import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Check } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { AuthLayout } from '../components/layout/AuthLayout';
import { Button } from '../components/ui/Button';

export default function RegisterPage() {
    const navigate = useNavigate();
    const { register, isLoading, isAuthenticated } = useAuthStore();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

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
            return;
        }

        if (!validations.passwordLength) {
            setError('Mật khẩu tối thiểu 6 ký tự');
            return;
        }

        if (!validations.passwordsMatch) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        const result = await register(username.trim().toLowerCase(), password);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error || 'Đăng ký thất bại');
        }
    };

    const ValidationItem = ({ valid, text }: { valid: boolean; text: string }) => (
        <div className={`flex items-center gap-2 text-xs transition-all duration-300 ${valid ? 'text-green-500 font-medium' : 'text-gray-400'}`}>
            {valid ? <Check className="h-3 w-3" /> : <div className="h-3 w-3 rounded-full border border-gray-300" />}
            <span>{text}</span>
        </div>
    );

    return (
        <AuthLayout
            title="Tạo tài khoản mới 🚀"
            subtitle="Tham gia cộng đồng giáo viên STEM tương lai ngay hôm nay."
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm border border-red-100 flex items-center gap-2 animate-shake">
                        ⚠️ {error}
                    </div>
                )}

                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">Tên đăng nhập</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="VD: sinhvien_01"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-arduino-teal focus:ring-4 focus:ring-arduino-teal/10 outline-none transition-all bg-white/50 backdrop-blur-sm"
                        disabled={isLoading}
                    />
                    {username && (
                        <div className="flex gap-3 mt-1.5">
                            <ValidationItem valid={validations.usernameLength} text="3-20 ký tự" />
                            <ValidationItem valid={validations.usernameFormat} text="Chữ thường, số, _" />
                        </div>
                    )}
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">Mật khẩu</label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Tối thiểu 6 ký tự"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-arduino-teal focus:ring-4 focus:ring-arduino-teal/10 outline-none transition-all bg-white/50 backdrop-blur-sm pr-12"
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                    {password && (
                        <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-gray-500">Độ mạnh:</span>
                                <span className={`text-xs font-bold ${passwordStrength.color.replace('bg-', 'text-')}`}>
                                    {passwordStrength.label}
                                </span>
                            </div>
                            <div className="flex gap-1 h-1">
                                {[1, 2, 3, 4].map((level) => (
                                    <div
                                        key={level}
                                        className={`flex-1 rounded-full transition-all duration-500 ${level <= passwordStrength.level ? passwordStrength.color : 'bg-gray-200'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">Xác nhận mật khẩu</label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Nhập lại mật khẩu"
                        className={`w-full px-4 py-3 rounded-xl border focus:ring-4 outline-none transition-all bg-white/50 backdrop-blur-sm ${confirmPassword && !validations.passwordsMatch
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                            : 'border-gray-200 focus:border-arduino-teal focus:ring-arduino-teal/10'
                            }`}
                        disabled={isLoading}
                    />
                </div>


                <Button
                    type="submit"
                    className="w-full py-6 text-base font-bold shadow-lg shadow-arduino-teal/20 hover:shadow-arduino-teal/30 hover:-translate-y-0.5 transition-all mt-4"
                    disabled={isLoading || !validations.usernameValid || !validations.passwordLength || !validations.passwordsMatch}
                >
                    {isLoading ? <Loader2 className="animate-spin mr-2" /> : 'Đăng ký tài khoản'}
                </Button>

                <p className="text-center text-gray-600 mt-6">
                    Đã có tài khoản?{' '}
                    <Link to="/login" className="font-bold text-arduino-teal hover:text-teal-600 transition-colors">
                        Đăng nhập ngay
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}
