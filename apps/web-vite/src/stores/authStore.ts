// Auth store sử dụng Zustand
// Quản lý trạng thái đăng nhập và user info

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// API URL - production dùng Workers trực tiếp, dev dùng proxy
const API_BASE = import.meta.env.PROD
    ? 'https://arduino-workers.stu725114073.workers.dev'
    : '';

// User type từ API
export interface User {
    id: string;
    username: string;
    displayName: string | null;
    role: 'student' | 'admin';
}

interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;

    // Actions
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;
    login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isLoading: false, // Ban đầu false, chỉ true khi submit form
            isAuthenticated: false,

            setUser: (user) => set({
                user,
                isAuthenticated: !!user,
                isLoading: false,
            }),

            setLoading: (isLoading) => set({ isLoading }),

            // Đăng nhập
            login: async (username, password) => {
                set({ isLoading: true });

                try {
                    const res = await fetch(`${API_BASE}/api/auth/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username, password }),
                        credentials: 'include',
                    });

                    const data = await res.json();

                    if (!res.ok) {
                        set({ isLoading: false });
                        return {
                            success: false,
                            error: data.error?.message || 'Đăng nhập thất bại'
                        };
                    }

                    set({
                        user: data.user,
                        isAuthenticated: true,
                        isLoading: false
                    });

                    return { success: true };
                } catch {
                    set({ isLoading: false });
                    return { success: false, error: 'Lỗi kết nối server' };
                }
            },

            // Đăng ký
            register: async (username, password) => {
                set({ isLoading: true });

                try {
                    const res = await fetch(`${API_BASE}/api/auth/register`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username, password }),
                        credentials: 'include',
                    });

                    const data = await res.json();

                    if (!res.ok) {
                        set({ isLoading: false });
                        return {
                            success: false,
                            error: data.error?.message || 'Đăng ký thất bại'
                        };
                    }

                    set({
                        user: data.user,
                        isAuthenticated: true,
                        isLoading: false
                    });

                    return { success: true };
                } catch {
                    set({ isLoading: false });
                    return { success: false, error: 'Lỗi kết nối server' };
                }
            },

            // Đăng xuất
            logout: async () => {
                try {
                    await fetch(`${API_BASE}/api/auth/logout`, {
                        method: 'POST',
                        credentials: 'include',
                    });
                } catch {
                    // Ignore logout errors
                }

                set({ user: null, isAuthenticated: false });
            },

            // Kiểm tra session hiện tại
            checkAuth: async () => {
                set({ isLoading: true });

                try {
                    const res = await fetch(`${API_BASE}/api/auth/me`, {
                        credentials: 'include',
                    });

                    const data = await res.json();

                    if (data.user) {
                        set({
                            user: data.user,
                            isAuthenticated: true,
                            isLoading: false
                        });
                    } else {
                        set({
                            user: null,
                            isAuthenticated: false,
                            isLoading: false
                        });
                    }
                } catch {
                    set({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false
                    });
                }
            },
        }),
        {
            name: 'arduino-auth',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated
            }),
            onRehydrateStorage: () => (state) => {
                // When rehydrating from localStorage, sync isAuthenticated with user
                if (state && state.user) {
                    state.isAuthenticated = true;
                }
            }
        }
    )
);
