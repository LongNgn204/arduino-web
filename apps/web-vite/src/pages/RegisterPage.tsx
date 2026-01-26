import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { AuthLayout } from '../components/layout/AuthLayout';
import { Button } from '../components/ui/Button';

export default function RegisterPage() {
    const navigate = useNavigate();
    const { register, isLoading, isAuthenticated } = useAuthStore();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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

    return (
        <AuthLayout
            title="Tạo tài khoản mới"
            subtitle="Tham gia ngay hôm nay."
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="bg-destructive/10 text-destructive p-3 rounded text-sm border border-destructive/20">
                        {error}
                    </div>
                )}

                <div className="space-y-1">
                    <label className="text-sm font-medium">Tên đăng nhập</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="VD: sinhvien_01"
                        className="w-full px-3 py-2 rounded border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                        disabled={isLoading}
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                        3-20 ký tự, chữ thường, số, _
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium">Mật khẩu</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Tối thiểu 6 ký tự"
                        className="w-full px-3 py-2 rounded border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                        disabled={isLoading}
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium">Xác nhận mật khẩu</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Nhập lại mật khẩu"
                        className="w-full px-3 py-2 rounded border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                        disabled={isLoading}
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full py-2 font-medium"
                    disabled={isLoading || !validations.usernameValid || !validations.passwordLength || !validations.passwordsMatch}
                >
                    {isLoading ? 'Đang xử lý...' : 'Đăng ký tài khoản'}
                </Button>

                <p className="text-center text-sm text-muted-foreground mt-4">
                    Đã có tài khoản?{' '}
                    <Link to="/login" className="font-medium text-foreground hover:underline">
                        Đăng nhập ngay
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}
