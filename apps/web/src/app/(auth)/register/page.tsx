'use client';

// Trang đăng ký tài khoản

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Cpu, Eye, EyeOff, Loader2, Check, X } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

export default function RegisterPage() {
    const router = useRouter();
    const { register, isLoading } = useAuthStore();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    // Validation rules
    const usernameValid = /^[a-zA-Z0-9_]{3,20}$/.test(username);
    const passwordValid = password.length >= 6;
    const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Client-side validation
        if (!usernameValid) {
            setError('Username 3-20 ký tự, chỉ chứa chữ cái, số và dấu _');
            return;
        }

        if (!passwordValid) {
            setError('Mật khẩu tối thiểu 6 ký tự');
            return;
        }

        if (!passwordsMatch) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        const result = await register(username, password);

        if (result.success) {
            router.push('/dashboard');
        } else {
            setError(result.error || 'Đăng ký thất bại');
        }
    };

    // Validation indicator component
    const ValidationItem = ({ valid, text }: { valid: boolean; text: string }) => (
        <div className={`flex items-center gap-1.5 text-sm ${valid ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
            {valid ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
            {text}
        </div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 px-4 py-8">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2">
                        <Cpu className="h-10 w-10 text-arduino-teal" />
                        <span className="text-2xl font-bold gradient-text">Arduino Hub</span>
                    </Link>
                    <p className="text-muted-foreground mt-2">Tạo tài khoản để bắt đầu học</p>
                </div>

                {/* Register Card */}
                <div className="bg-card rounded-2xl shadow-xl border border-border p-8">
                    <h1 className="text-2xl font-bold text-center mb-6">Đăng ký</h1>

                    {error && (
                        <div className="bg-destructive/10 text-destructive text-sm rounded-lg p-3 mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Username */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium mb-1.5">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Nhập username"
                                required
                                autoComplete="username"
                                className="w-full px-4 py-2.5 rounded-lg border border-input bg-background
                         focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                         transition-all"
                            />
                            {username && (
                                <div className="mt-2">
                                    <ValidationItem valid={usernameValid} text="3-20 ký tự, chỉ chữ/số/_" />
                                </div>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium mb-1.5">
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Nhập mật khẩu"
                                    required
                                    autoComplete="new-password"
                                    className="w-full px-4 py-2.5 pr-10 rounded-lg border border-input bg-background
                           focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                           transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {password && (
                                <div className="mt-2">
                                    <ValidationItem valid={passwordValid} text="Tối thiểu 6 ký tự" />
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1.5">
                                Xác nhận mật khẩu
                            </label>
                            <input
                                id="confirmPassword"
                                type={showPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Nhập lại mật khẩu"
                                required
                                autoComplete="new-password"
                                className="w-full px-4 py-2.5 rounded-lg border border-input bg-background
                         focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                         transition-all"
                            />
                            {confirmPassword && (
                                <div className="mt-2">
                                    <ValidationItem valid={passwordsMatch} text="Mật khẩu khớp" />
                                </div>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading || !usernameValid || !passwordValid || !passwordsMatch}
                            className="w-full btn-arduino py-2.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Đang đăng ký...
                                </>
                            ) : (
                                'Tạo tài khoản'
                            )}
                        </button>
                    </form>

                    {/* Login link */}
                    <p className="text-center text-sm text-muted-foreground mt-6">
                        Đã có tài khoản?{' '}
                        <Link href="/login" className="text-arduino-teal hover:underline font-medium">
                            Đăng nhập
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
