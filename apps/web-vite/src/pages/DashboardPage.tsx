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
    Cpu,
    Award
} from 'lucide-react';
import { Card } from '../components/ui/Card'; // Use new UI component
import { cn } from '../components/ui/Card';

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
    const { logout, isAuthenticated, user } = useAuthStore();
    const navigate = useNavigate();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState({
        overall: 0,
        lessons: { completed: 0, total: 1, percentage: 0 },
        labs: { completed: 0, total: 1, percentage: 0 },
        quizzes: { completed: 0, total: 1, percentage: 0 },
        avgQuizScore: null as number | null,
    });

    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    // Fetch courses and progress
    useEffect(() => {
        async function fetchData() {
            if (!isAuthenticated) return;

            try {
                // Fetch courses
                const coursesRes = await fetch(`${API_BASE}/api/courses`, {
                    credentials: 'include',
                });
                const coursesData = await coursesRes.json();
                setCourses(coursesData.courses || []);

                // Fetch progress
                const progressRes = await fetch(`${API_BASE}/api/progress`, {
                    credentials: 'include',
                });
                if (progressRes.ok) {
                    const progressData = await progressRes.json();
                    setProgress(progressData.progress || progress);
                }
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-arduino-base pb-12">
            {/* Header - Mobile Only (Desktop is in Sidebar) */}
            <header className="lg:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-arduino-teal flex items-center justify-center">
                                <Cpu className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-lg font-bold text-gray-800">
                                ArduinoHub
                            </span>
                        </Link>

                        {/* User Menu */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleLogout}
                                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-red-500 transition-colors"
                                title="Đăng xuất"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 py-8">
                {/* Welcome Section */}
                <div className="mb-8 animate-slide-up">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Chào mừng trở lại, {user?.displayName || user?.username || 'bạn'}! 👋
                    </h1>
                    <p className="text-gray-600">
                        Tiếp tục hành trình chinh phục Arduino của bạn.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatCard
                        icon={<BookOpen className="w-6 h-6" />}
                        label="Bài học"
                        value={`${progress.lessons.completed}/${progress.lessons.total}`}
                        color="bg-blue-50 text-blue-500"
                        delay={0}
                    />
                    <StatCard
                        icon={<Zap className="w-6 h-6" />}
                        label="Bài thực hành"
                        value={`${progress.labs.completed}/${progress.labs.total}`}
                        color="bg-orange-50 text-orange-500"
                        delay={100}
                    />
                    <StatCard
                        icon={<Trophy className="w-6 h-6" />}
                        label="Điểm Quiz TB"
                        value={`${progress.avgQuizScore ?? '--'}%`}
                        color="bg-purple-50 text-purple-500"
                        delay={200}
                    />
                    <StatCard
                        icon={<Target className="w-6 h-6" />}
                        label="Tiến độ"
                        value={`${progress.overall}%`}
                        color="bg-teal-50 text-teal-500"
                        delay={300}
                    />
                </div>

                {/* Course Section */}
                <section className="mb-10 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <GraduationCap className="w-6 h-6 text-arduino-teal" />
                        Khóa học của bạn
                    </h2>

                    {loading ? (
                        <div className="flex items-center justify-center h-60 bg-white rounded-2xl border border-gray-100 shadow-sm">
                            <div className="w-10 h-10 border-4 border-arduino-teal border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : courses.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <BookOpen className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-700">Chưa có khóa học nào</h3>
                            <p className="text-gray-500 mt-2">Hãy bắt đầu bằng việc đăng ký khóa học đầu tiên!</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {courses.map((course) => (
                                <CourseCard key={course.id} course={course} progress={progress.overall} />
                            ))}
                        </div>
                    )}
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Challenge Section */}
                    <section className="lg:col-span-2 animate-slide-up" style={{ animationDelay: '0.5s' }}>
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <Trophy className="w-6 h-6 text-yellow-500" />
                            Thử thách & Xếp hạng
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <QuickLinkCard
                                title="Kiểm tra áp lực"
                                subtitle="Exam Drill 60 phút"
                                href="/drills/drill-01"
                                icon={<Zap className="w-5 h-5" />}
                                color="cyan"
                            />
                            <QuickLinkCard
                                title="Bảng xếp hạng"
                                subtitle="Top 10 tuần này"
                                href="/leaderboard"
                                icon={<Trophy className="w-5 h-5" />}
                                color="yellow"
                            />
                            <div className="md:col-span-2">
                                <QuickLinkCard
                                    title="Chứng nhận Completion"
                                    subtitle="Hoàn thành 80% để nhận bằng"
                                    href="/certificate"
                                    icon={<Award className="w-5 h-5" />}
                                    color="purple"
                                    isHorizontal
                                />
                            </div>
                        </div>
                    </section>

                    {/* Quick Links / Continue Learning */}
                    <section className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <Clock className="w-6 h-6 text-blue-500" />
                            Tiếp tục học
                        </h2>
                        <div className="space-y-4">
                            <QuickLinkCard
                                title="Tuần 1: GPIO & LED"
                                subtitle="Bài tiếp theo: Running LEDs"
                                href="/weeks/week-01"
                                progress={60}
                                color="teal"
                                isHorizontal
                            />
                            <QuickLinkCard
                                title="Quiz: Arduino cơ bản"
                                subtitle="10 câu hỏi • 15 phút"
                                href="/quizzes/quiz-01"
                                color="purple"
                                isHorizontal
                            />
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}

// Stat Card Component
function StatCard({ icon, label, value, color, delay }: {
    icon: React.ReactNode;
    label: string;
    value: string;
    color: string;
    delay?: number;
}) {
    // color prop expects classes like "bg-blue-50 text-blue-500"
    return (
        <Card
            className="flex flex-col items-center justify-center p-6 hover:shadow-lg transition-all duration-300 transform animate-slide-up"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-transform hover:scale-110", color)}>
                {icon}
            </div>
            <p className="text-3xl font-bold text-gray-800 mb-1">{value}</p>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{label}</p>
        </Card>
    );
}

// Course Card Component
function CourseCard({ course, progress }: { course: Course; progress: number }) {
    return (
        <Card className="overflow-hidden border-l-4 border-l-arduino-teal group hover:shadow-lg transition-all duration-300">
            {/* Course Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-arduino-mint text-arduino-teal uppercase tracking-wider">
                            {course.code}
                        </span>
                        <span className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-1 rounded-md">
                            Official Course
                        </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 group-hover:text-arduino-teal transition-colors">
                        {course.title}
                    </h3>
                    <p className="text-gray-500 mt-2 leading-relaxed max-w-2xl">{course.description}</p>
                </div>

                <div className="w-full md:w-64 bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 font-medium">Tiến độ chung</span>
                        <span className="text-arduino-teal font-bold">{progress}%</span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-arduino-teal to-teal-400 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="text-xs text-gray-400 mt-2 text-center">
                        Hãy hoàn thành {course.totalWeeks} tuần học để nhận chứng chỉ
                    </p>
                </div>
            </div>

            {/* Weeks Grid */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Lộ trình học tập</p>
                    <span className="text-xs text-gray-400">{course.totalWeeks} tuần</span>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-3">
                    {course.weeks.map((week, index) => {
                        // Logic for card styling based on locked/unlocked state
                        // For demo: first week active, next 2 enabled, rest disabled
                        const isCompleted = index < 1;
                        const isCurrent = index === 1; // Just for demo visuals
                        const isLocked = index > 3;

                        return (
                            <Link
                                key={week.id}
                                to={`/weeks/${week.id}`}
                                className={cn(
                                    "aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-200 border-2",
                                    isCompleted
                                        ? "bg-arduino-teal text-white border-arduino-teal shadow-md shadow-arduino-teal/20"
                                        : isCurrent
                                            ? "bg-white text-arduino-teal border-arduino-teal shadow-sm ring-2 ring-arduino-teal/20"
                                            : isLocked
                                                ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
                                                : "bg-white text-gray-600 border-gray-200 hover:border-arduino-teal hover:text-arduino-teal"
                                )}
                                title={week.title}
                            >
                                {week.weekNumber}
                            </Link>
                        )
                    })}
                </div>
            </div>
        </Card>
    );
}

// Quick Link Card Component
function QuickLinkCard({ title, subtitle, href, progress, icon, color = 'teal', isHorizontal = false }: {
    title: string;
    subtitle: string;
    href: string;
    progress?: number;
    icon?: React.ReactNode;
    color?: 'teal' | 'cyan' | 'purple' | 'yellow' | 'orange';
    isHorizontal?: boolean;
}) {
    const colors = {
        teal: 'text-teal-600 bg-teal-50 group-hover:bg-teal-100',
        cyan: 'text-cyan-600 bg-cyan-50 group-hover:bg-cyan-100',
        purple: 'text-purple-600 bg-purple-50 group-hover:bg-purple-100',
        yellow: 'text-yellow-600 bg-yellow-50 group-hover:bg-yellow-100',
        orange: 'text-orange-600 bg-orange-50 group-hover:bg-orange-100',
    };

    const activeColor = colors[color] || colors.teal;

    return (
        <Link
            to={href}
            className={cn(
                "group bg-white rounded-xl border border-gray-100 p-4 hover:shadow-card hover:border-gray-200 transition-all duration-200 block h-full",
                isHorizontal && "flex items-center gap-4"
            )}
        >
            <div className={cn(
                "rounded-lg flex items-center justify-center transition-colors",
                activeColor,
                isHorizontal ? "w-12 h-12 shrink-0" : "w-10 h-10 mb-3"
            )}>
                {icon || <ChevronRight className="w-5 h-5" />}
            </div>

            <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-800 group-hover:text-arduino-teal transition-colors truncate">
                    {title}
                </h4>
                <p className="text-sm text-gray-500 truncate">{subtitle}</p>

                {progress !== undefined && (
                    <div className="mt-3 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-arduino-teal rounded-full"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                )}
            </div>

            {!isHorizontal && (
                <div className="mt-3 flex justify-end">
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-arduino-teal transition-colors" />
                </div>
            )}

            {isHorizontal && !progress && (
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-arduino-teal transition-colors" />
            )}
        </Link>
    );
}

