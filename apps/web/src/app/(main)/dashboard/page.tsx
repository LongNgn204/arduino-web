'use client';

// Dashboard với Progress tracking
// Hiển thị tiến độ lessons, labs, quizzes và AI usage

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    BookOpen, Code2, FileQuestion, ChevronRight,
    LogOut, User, Loader2, Cpu, Trophy, Bot,
    CheckCircle2, Circle, Clock
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

interface Week {
    id: string;
    weekNumber: number;
    title: string;
}

interface Course {
    id: string;
    code: string;
    title: string;
    description: string;
    weeks: Week[];
}

interface Progress {
    overall: number;
    lessons: { completed: number; total: number; percentage: number };
    labs: { completed: number; total: number; percentage: number };
    quizzes: { passed: number; total: number; percentage: number };
    aiQuestions: number;
    avgQuizScore: number | null;
}

export default function DashboardPage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading: authLoading, logout, checkAuth } = useAuthStore();

    const [courses, setCourses] = useState<Course[]>([]);
    const [progress, setProgress] = useState<Progress | null>(null);
    const [loading, setLoading] = useState(true);

    // Kiểm tra auth
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    // Redirect nếu chưa đăng nhập
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [authLoading, isAuthenticated, router]);

    // Fetch courses và progress
    useEffect(() => {
        async function fetchData() {
            try {
                const [coursesRes, progressRes] = await Promise.all([
                    fetch('/api/courses', { credentials: 'include' }),
                    fetch('/api/progress', { credentials: 'include' }),
                ]);

                const coursesData = await coursesRes.json();
                setCourses(coursesData.courses || []);

                if (progressRes.ok) {
                    const progressData = await progressRes.json();
                    setProgress(progressData.progress);
                }
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        }

        if (isAuthenticated) {
            fetchData();
        }
    }, [isAuthenticated]);

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-arduino-teal" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <Cpu className="h-7 w-7 text-arduino-teal" />
                            <span className="text-xl font-bold">Arduino Hub</span>
                        </Link>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-sm">
                                <User className="h-4 w-4" />
                                <span>{user?.displayName || user?.username}</span>
                                {user?.role === 'admin' && (
                                    <span className="bg-arduino-teal/10 text-arduino-teal text-xs px-2 py-0.5 rounded-full">
                                        Admin
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <LogOut className="h-4 w-4" />
                                Đăng xuất
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="container mx-auto px-6 py-8">
                {/* Welcome */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">
                        Xin chào, {user?.displayName || user?.username}! 👋
                    </h1>
                    <p className="text-muted-foreground">
                        Tiếp tục học Arduino và theo dõi tiến độ của bạn
                    </p>
                </div>

                {/* Progress Stats */}
                {progress && (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
                        {/* Overall Progress */}
                        <div className="col-span-2 bg-gradient-to-br from-arduino-teal to-primary-600 rounded-xl p-5 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white/80 text-sm">Tiến độ tổng thể</p>
                                    <p className="text-4xl font-bold">{progress.overall}%</p>
                                </div>
                                <Trophy className="h-12 w-12 text-white/30" />
                            </div>
                            <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-white rounded-full transition-all duration-500"
                                    style={{ width: `${progress.overall}%` }}
                                />
                            </div>
                        </div>

                        {/* Lessons */}
                        <div className="bg-card rounded-xl border border-border p-4">
                            <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                <BookOpen className="h-4 w-4" />
                                <span className="text-sm">Lessons</span>
                            </div>
                            <p className="text-2xl font-bold">{progress.lessons.completed}/{progress.lessons.total}</p>
                            <p className="text-xs text-muted-foreground">{progress.lessons.percentage}% hoàn thành</p>
                        </div>

                        {/* Labs */}
                        <div className="bg-card rounded-xl border border-border p-4">
                            <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                <Code2 className="h-4 w-4" />
                                <span className="text-sm">Labs</span>
                            </div>
                            <p className="text-2xl font-bold">{progress.labs.completed}/{progress.labs.total}</p>
                            <p className="text-xs text-muted-foreground">{progress.labs.percentage}% hoàn thành</p>
                        </div>

                        {/* Quizzes */}
                        <div className="bg-card rounded-xl border border-border p-4">
                            <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                <FileQuestion className="h-4 w-4" />
                                <span className="text-sm">Quizzes</span>
                            </div>
                            <p className="text-2xl font-bold">{progress.quizzes.passed}/{progress.quizzes.total}</p>
                            <p className="text-xs text-muted-foreground">
                                {progress.avgQuizScore !== null ? `TB: ${progress.avgQuizScore}%` : 'Chưa làm quiz'}
                            </p>
                        </div>

                        {/* AI Questions */}
                        <div className="bg-card rounded-xl border border-border p-4">
                            <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                <Bot className="h-4 w-4" />
                                <span className="text-sm">Câu hỏi AI</span>
                            </div>
                            <p className="text-2xl font-bold">{progress.aiQuestions}</p>
                            <p className="text-xs text-muted-foreground">đã hỏi</p>
                        </div>
                    </div>
                )}

                {/* Courses */}
                {courses.map((course) => (
                    <section key={course.id} className="mb-12">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold">
                                <span className="text-arduino-teal">{course.code}</span> - {course.title}
                            </h2>
                            <p className="text-muted-foreground text-sm mt-1">{course.description}</p>
                        </div>

                        {/* Weeks grid */}
                        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {course.weeks.map((week) => (
                                <Link
                                    key={week.id}
                                    href={`/week/${week.id}`}
                                    className="group bg-card rounded-xl border border-border p-5 card-hover"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <span className="text-sm font-medium text-arduino-teal">
                                            Tuần {week.weekNumber}
                                        </span>
                                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-arduino-teal transition-colors" />
                                    </div>
                                    <h3 className="font-medium line-clamp-2">{week.title}</h3>

                                    {/* Progress indicator */}
                                    <div className="flex items-center gap-2 mt-4">
                                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                            <div className="h-full bg-arduino-teal/50 rounded-full w-0" />
                                        </div>
                                        <span className="text-xs text-muted-foreground">0%</span>
                                    </div>

                                    {/* Quick stats */}
                                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <BookOpen className="h-3.5 w-3.5" />
                                            3 bài
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Code2 className="h-3.5 w-3.5" />
                                            2 lab
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <FileQuestion className="h-3.5 w-3.5" />
                                            1 quiz
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                ))}

                {courses.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">Chưa có khóa học nào</p>
                    </div>
                )}
            </main>
        </div>
    );
}
