import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { AuthLayout } from '../components/layout/AuthLayout';
import { Button } from '../components/ui/Button';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login, isLoading, isAuthenticated } = useAuthStore();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (isAuthenticated) navigate('/dashboard');
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!username.trim() || !password.trim()) {
            setError('Vui lòng điền đầy đủ thông tin');
            return;
        }

        const result = await login(username.trim().toLowerCase(), password);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error || 'Đăng nhập thất bại');
        }
    };

    return (
        <AuthLayout
            title="Chào mừng trở lại"
            subtitle="Đăng nhập để tiếp tục."
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
                        placeholder="Nhập tên đăng nhập"
                        className="w-full px-3 py-2 rounded border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                        disabled={isLoading}
                    />
                </div>

                <div className="space-y-1">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium">Mật khẩu</label>
                        <Link to="/forgot-password" className="text-xs text-muted-foreground hover:underline">
                            Quên mật khẩu?
                        </Link>
                    </div>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Nhập mật khẩu"
                        className="w-full px-3 py-2 rounded border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                        disabled={isLoading}
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full py-2 font-medium"
                    disabled={isLoading}
                >
                    {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
                </Button>

                <p className="text-center text-sm text-muted-foreground mt-4">
                    Chưa có tài khoản?{' '}
                    <Link to="/register" className="font-medium text-foreground hover:underline">
                        Đăng ký ngay
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}
