import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import {
    BookOpen,
    GraduationCap,
    Zap,
    Clock,
    ChevronRight,
    LogOut,
    Trophy,
    Target,
    Cpu
} from 'lucide-react';

// API Base URL
const API_BASE = import.meta.env.PROD
    ? 'https://arduino-workers.stu725114073.workers.dev'
    : '';

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
    totalWeeks: number;
    weeks: Week[];
}

export default function DashboardPage() {
    const { user, logout, isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    // Fetch courses
    useEffect(() => {
        async function fetchCourses() {
            try {
                const res = await fetch(`${API_BASE}/api/courses`, {
                    credentials: 'include',
                });
                const data = await res.json();
                setCourses(data.courses || []);
            } catch (error) {
                console.error('Failed to fetch courses:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchCourses();
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    // Mock progress data (will be replaced with real API)
    const progress = {
        completedLessons: 3,
        totalLessons: 36,
        completedLabs: 1,
        totalLabs: 24,
        quizAverage: 85,
    };

    const progressPercent = Math.round((progress.completedLessons / progress.totalLessons) * 100);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Header */}
            <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-slate-700/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
                                <Cpu className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                                ArduinoHub
                            </span>
                        </Link>

                        {/* User Menu */}
                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm text-slate-400">Xin chào,</p>
                                <p className="text-white font-medium">{user?.displayName || user?.username}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                                title="Đăng xuất"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Chào mừng trở lại! 👋
                    </h1>
                    <p className="text-slate-400">
                        Tiếp tục hành trình chinh phục Arduino của bạn.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatCard
                        icon={<BookOpen className="w-6 h-6" />}
                        label="Bài học"
                        value={`${progress.completedLessons}/${progress.totalLessons}`}
                        color="from-teal-500 to-cyan-500"
                    />
                    <StatCard
                        icon={<Zap className="w-6 h-6" />}
                        label="Bài thực hành"
                        value={`${progress.completedLabs}/${progress.totalLabs}`}
                        color="from-amber-500 to-orange-500"
                    />
                    <StatCard
                        icon={<Trophy className="w-6 h-6" />}
                        label="Điểm Quiz TB"
                        value={`${progress.quizAverage}%`}
                        color="from-purple-500 to-pink-500"
                    />
                    <StatCard
                        icon={<Target className="w-6 h-6" />}
                        label="Tiến độ"
                        value={`${progressPercent}%`}
                        color="from-green-500 to-emerald-500"
                    />
                </div>

                {/* Course Section */}
                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <GraduationCap className="w-6 h-6 text-teal-400" />
                        Khóa học của bạn
                    </h2>

                    {loading ? (
                        <div className="flex items-center justify-center h-40">
                            <div className="w-8 h-8 border-4 border-teal-400 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : courses.length === 0 ? (
                        <div className="text-center py-12 bg-slate-800/50 rounded-2xl border border-slate-700">
                            <p className="text-slate-400">Chưa có khóa học nào.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {courses.map((course) => (
                                <CourseCard key={course.id} course={course} progress={progressPercent} />
                            ))}
                        </div>
                    )}
                </section>

                {/* Quick Links */}
                <section>
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <Clock className="w-6 h-6 text-cyan-400" />
                        Tiếp tục học
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <QuickLinkCard
                            title="Tuần 1: GPIO & LED"
                            subtitle="Bài tiếp theo: Running LEDs"
                            href="/weeks/week-01"
                            progress={60}
                        />
                        <QuickLinkCard
                            title="Quiz: Arduino cơ bản"
                            subtitle="10 câu hỏi • 15 phút"
                            href="/quizzes/quiz-01"
                            isQuiz
                        />
                    </div>
                </section>
            </main>
        </div>
    );
}

// Stat Card Component
function StatCard({ icon, label, value, color }: {
    icon: React.ReactNode;
    label: string;
    value: string;
    color: string;
}) {
    return (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50 hover:border-slate-600 transition-colors">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white mb-3`}>
                {icon}
            </div>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-sm text-slate-400">{label}</p>
        </div>
    );
}

// Course Card Component
function CourseCard({ course, progress }: { course: Course; progress: number }) {
    return (
        <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden hover:border-teal-500/50 transition-all duration-300">
            {/* Course Header */}
            <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-teal-500/10 text-teal-400 border border-teal-500/20 mb-2">
                            {course.code}
                        </span>
                        <h3 className="text-xl font-bold text-white">{course.title}</h3>
                        <p className="text-sm text-slate-400 mt-1">{course.description}</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">Tiến độ</span>
                        <span className="text-teal-400 font-medium">{progress}%</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Weeks Grid */}
            <div className="px-6 pb-6">
                <p className="text-sm text-slate-400 mb-3">Lộ trình {course.totalWeeks} tuần:</p>
                <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-2">
                    {course.weeks.map((week, index) => (
                        <Link
                            key={week.id}
                            to={`/weeks/${week.id}`}
                            className={`
                aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all
                ${index < 1
                                    ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30'
                                    : index < 3
                                        ? 'bg-slate-700 text-white hover:bg-slate-600'
                                        : 'bg-slate-800 text-slate-500 hover:bg-slate-700 hover:text-slate-300'
                                }
              `}
                            title={week.title}
                        >
                            {week.weekNumber}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Quick Link Card Component
function QuickLinkCard({ title, subtitle, href, progress, isQuiz }: {
    title: string;
    subtitle: string;
    href: string;
    progress?: number;
    isQuiz?: boolean;
}) {
    return (
        <Link
            to={href}
            className="group flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-teal-500/50 transition-all"
        >
            <div className="flex-1">
                <h4 className="font-medium text-white group-hover:text-teal-400 transition-colors">{title}</h4>
                <p className="text-sm text-slate-400">{subtitle}</p>
                {progress !== undefined && (
                    <div className="mt-2 h-1 w-24 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-500 rounded-full" style={{ width: `${progress}%` }} />
                    </div>
                )}
            </div>
            <div className={`
        w-10 h-10 rounded-lg flex items-center justify-center
        ${isQuiz ? 'bg-purple-500/10 text-purple-400' : 'bg-teal-500/10 text-teal-400'}
        group-hover:bg-teal-500 group-hover:text-white transition-all
      `}>
                <ChevronRight className="w-5 h-5" />
            </div>
        </Link>
    );
}
