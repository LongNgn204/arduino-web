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
    Award,
    Sparkles,
    PlayCircle,
    Flame
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { cn } from '../components/ui/Card';
import OnboardingTour from '../components/OnboardingTour';

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
        if (!isAuthenticated) navigate('/login');
    }, [isAuthenticated, navigate]);

    // Fetch courses and progress
    useEffect(() => {
        async function fetchData() {
            if (!isAuthenticated) return;
            try {
                // Fetch courses
                const coursesRes = await fetch(`${API_BASE}/api/courses`, { credentials: 'include' });
                const coursesData = await coursesRes.json();
                setCourses(coursesData.courses || []);

                // Fetch progress
                const progressRes = await fetch(`${API_BASE}/api/progress`, { credentials: 'include' });
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
        <div className="min-h-screen bg-arduino-base pb-20 font-sans">
            {/* Header - Mobile Only */}
            <header className="lg:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-arduino-teal flex items-center justify-center">
                                <Cpu className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-lg font-bold text-gray-800">ArduinoHub</span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-red-500 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Tour Guide */}
            <OnboardingTour />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div id="dashboard-welcome" className="mb-10 text-center md:text-left animate-slide-up">
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2 tracking-tight">
                        Xin chào, <span className="text-arduino-teal">{user?.displayName || user?.username || 'Bạn hiền'}</span>! 👋
                    </h1>
                    <p className="text-lg text-gray-500 max-w-2xl bg-white/50 inline-block px-4 py-1 rounded-full border border-gray-100 shadow-sm">
                        Sẵn sàng cho bài học hôm nay chưa? Hãy tiếp tục hành trình chinh phục IoT.
                    </p>
                </div>

                {/* Stats Grid */}
                <div id="dashboard-stats" className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <StatCard
                        icon={<BookOpen className="w-6 h-6" />}
                        label="Bài học"
                        value={`${progress.lessons.completed}/${progress.lessons.total}`}
                        color="blue"
                    />
                    <StatCard
                        icon={<Zap className="w-6 h-6" />}
                        label="Labs"
                        value={`${progress.labs.completed}/${progress.labs.total}`}
                        color="orange"
                    />
                    <StatCard
                        icon={<Trophy className="w-6 h-6" />}
                        label="Điểm TB"
                        value={`${progress.avgQuizScore ?? '--'}%`}
                        color="purple"
                    />
                    <StatCard
                        icon={<Target className="w-6 h-6" />}
                        label="Tiến độ"
                        value={`${progress.overall}%`}
                        color="teal"
                    />
                </div>

                {/* Main Dashboard Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Courses */}
                    <div className="lg:col-span-2 space-y-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <section id="dashboard-courses">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <GraduationCap className="w-6 h-6 text-arduino-teal" />
                                    Khóa học đang diễn ra
                                </h2>
                            </div>

                            {loading ? (
                                <div className="animate-pulse space-y-4">
                                    <div className="h-48 bg-white rounded-3xl border border-gray-100 shadow-sm"></div>
                                </div>
                            ) : courses.length === 0 ? (
                                <Card className="p-10 text-center border-dashed border-2 border-gray-200 bg-white/50">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-gray-400">
                                        <BookOpen className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">Chưa đăng ký khóa học nào</h3>
                                    <p className="text-gray-500 mb-6">Hãy bắt đầu hành trình của bạn ngay hôm nay.</p>
                                    <Button>Khám phá khóa học</Button>
                                </Card>
                            ) : (
                                <div className="space-y-6">
                                    {courses.map((course) => (
                                        <CourseCard key={course.id} course={course} progress={progress.overall} />
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Right Column: Quick Actions & Leaderboard */}
                    <div className="space-y-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                        {/* Make Learning a Habit */}
                        <Card id="dashboard-challenges" className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0 shadow-xl shadow-indigo-500/20 overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700" />
                            <div className="relative z-10 p-6">
                                <div className="flex justify-between items-start">
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                                        <Flame className="w-6 h-6 text-yellow-300 animate-pulse-soft" />
                                    </div>
                                    <span className="bg-white/20 text-xs font-bold px-2 py-1 rounded-md">NEW</span>
                                </div>
                                <h3 className="text-xl font-bold mb-2">Daily Streak</h3>
                                <p className="text-indigo-100 text-sm mb-4">Bạn đã học 3 ngày liên tiếp. Cố lên!</p>
                                <div className="flex gap-2 mb-4">
                                    {['M', 'T', 'W'].map(day => (
                                        <div key={day} className="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center text-xs font-bold text-green-900 border-2 border-white/20">
                                            {day}
                                        </div>
                                    ))}
                                    {['T', 'F', 'S', 'S'].map(day => (
                                        <div key={day} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/50 border-2 border-transparent">
                                            {day}
                                        </div>
                                    ))}
                                </div>
                                <Button className="w-full bg-white text-indigo-600 hover:bg-indigo-50 border-0 font-bold shadow-none">
                                    Học tiếp ngay <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                            </div>
                        </Card>

                        {/* Quick Links */}
                        <section>
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Zap className="w-5 h-5 text-amber-500" />
                                Truy cập nhanh
                            </h2>
                            <div className="space-y-3">
                                <QuickLink
                                    icon={<Trophy className="w-5 h-5" />}
                                    label="Bảng xếp hạng"
                                    href="/leaderboard"
                                    color="yellow"
                                />
                                <QuickLink
                                    icon={<Zap className="w-5 h-5" />}
                                    label="Luyện tập (Exam Drills)"
                                    href="/drills"
                                    color="orange"
                                />
                                <QuickLink
                                    icon={<Clock className="w-5 h-5" />}
                                    label="Lịch sử Quiz"
                                    href="/history"
                                    color="blue"
                                />
                                <QuickLink
                                    icon={<Award className="w-5 h-5" />}
                                    label="Chứng chỉ"
                                    href="/certificate"
                                    color="purple"
                                />
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}

// Components
function StatCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, color: 'blue' | 'orange' | 'purple' | 'teal' }) {
    const colors = {
        blue: 'bg-arduino-sky text-blue-600',
        orange: 'bg-orange-50 text-orange-600',
        purple: 'bg-arduino-lavender text-purple-600',
        teal: 'bg-arduino-mint text-arduino-teal'
    };

    return (
        <Card className="p-5 flex flex-col items-center justify-center hover:shadow-hover transition-all border-none bg-white shadow-soft hover:scale-[1.02] cursor-default">
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-colors shadow-sm", colors[color])}>
                {icon}
            </div>
            <span className="text-2xl font-black text-gray-800 tabular-nums mb-0.5 tracking-tight">{value}</span>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</span>
        </Card>
    );
}

function CourseCard({ course, progress }: { course: Course; progress: number }) {
    return (
        <Card className="p-0 overflow-hidden border-none shadow-card hover:shadow-hover transition-all duration-300 group bg-white">
            <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-6 md:items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="bg-arduino-mint text-arduino-teal text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                {course.code}
                            </span>
                            <span className="text-gray-400 text-xs font-medium flex items-center gap-1">
                                <Sparkles className="w-3 h-3" /> Official Course
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-arduino-teal transition-colors">
                            {course.title}
                        </h3>
                        <p className="text-gray-500 leading-relaxed mb-6 font-medium">{course.description}</p>

                        {/* Progress Bar */}
                        <div className="space-y-2 max-w-md">
                            <div className="flex justify-between text-sm font-bold">
                                <span className="text-gray-400">Tiến độ khóa học</span>
                                <span className="text-arduino-teal">{progress}%</span>
                            </div>
                            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-arduino-teal to-teal-400 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(20,184,166,0.3)]" style={{ width: `${progress}%` }} />
                            </div>
                        </div>
                    </div>

                    <div className="shrink-0 flex md:flex-col gap-3">
                        <Button className="w-full md:w-auto shadow-lg shadow-arduino-teal/20 bg-arduino-teal hover:bg-teal-600 border-none h-12 px-6 rounded-xl text-base">
                            Tiếp tục học <PlayCircle className="w-5 h-5 ml-2" />
                        </Button>
                        <Button variant="secondary" className="w-full md:w-auto h-12 px-6 rounded-xl text-base border-gray-100 bg-gray-50 text-gray-600 hover:bg-white hover:border-gray-200">
                            Chi tiết
                        </Button>
                    </div>
                </div>
            </div>

            {/* Weeks Strip */}
            <div className="bg-arduino-base/50 border-t border-gray-50 p-4 overflow-x-auto scrollbar-hide">
                <div className="flex gap-2 min-w-max">
                    {course.weeks.map((week, idx) => {
                        const isCompleted = idx < 1;
                        const isCurrent = idx === 1;

                        return (
                            <Link
                                key={week.id}
                                to={`/weeks/${week.id}`}
                                className={cn(
                                    "w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold transition-all border",
                                    isCompleted ? "bg-arduino-teal text-white border-arduino-teal shadow-md shadow-arduino-teal/20" :
                                        isCurrent ? "bg-white text-arduino-teal border-arduino-teal ring-2 ring-arduino-teal/20 shadow-lg scale-105" :
                                            "bg-white text-gray-300 border-gray-100 hover:border-gray-300 hover:text-gray-500 hover:scale-105"
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

function QuickLink({ icon, label, href, color }: { icon: React.ReactNode, label: string, href: string, color: 'yellow' | 'orange' | 'blue' | 'purple' }) {
    const colors = {
        yellow: 'text-amber-500 bg-amber-50 group-hover:bg-amber-100',
        orange: 'text-orange-500 bg-orange-50 group-hover:bg-orange-100',
        blue: 'text-blue-500 bg-blue-50 group-hover:bg-blue-100',
        purple: 'text-purple-500 bg-purple-50 group-hover:bg-purple-100',
    };

    return (
        <Link to={href} className="flex items-center gap-4 p-4 rounded-2xl border border-transparent bg-white shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all group">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-colors", colors[color])}>
                {icon}
            </div>
            <span className="flex-1 font-bold text-gray-700 group-hover:text-gray-900 transition-colors">
                {label}
            </span>
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-arduino-teal group-hover:text-white transition-all">
                <ChevronRight className="w-4 h-4" />
            </div>
        </Link>
    );
}

