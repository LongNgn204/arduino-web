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
    PlayCircle
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
        <div className="min-h-screen bg-gray-50 pb-20 font-sans">
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
                <div id="dashboard-welcome" className="mb-10 text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2 tracking-tight">
                        Xin chào, {user?.displayName || user?.username || 'bạn hiền'}! 👋
                    </h1>
                    <p className="text-lg text-gray-500 max-w-2xl">
                        Sẵn sàng cho bài học hôm nay chưa? Hãy tiếp tục hành trình chinh phục IoT.
                    </p>
                </div>

                {/* Stats Grid */}
                <div id="dashboard-stats" className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
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
                    <div className="lg:col-span-2 space-y-8">
                        <section id="dashboard-courses">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <GraduationCap className="w-6 h-6 text-arduino-teal" />
                                    Khóa học đang diễn ra
                                </h2>
                            </div>

                            {loading ? (
                                <div className="animate-pulse space-y-4">
                                    <div className="h-48 bg-gray-200 rounded-2xl"></div>
                                </div>
                            ) : courses.length === 0 ? (
                                <Card className="p-10 text-center border-dashed border-2 border-gray-200 bg-gray-50/50">
                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-gray-400">
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
                    <div className="space-y-8">
                        {/* Make Learning a Habit */}
                        <Card id="dashboard-challenges" className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0 shadow-lg shadow-indigo-200 overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                            <div className="relative z-10 p-6">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                                    <Sparkles className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Thử thách tuần này</h3>
                                <p className="text-indigo-100 text-sm mb-4">Hoàn thành 3 bài Lab để nhận huy hiệu "Kỹ sư tập sự".</p>
                                <div className="w-full bg-black/20 rounded-full h-2 mb-4">
                                    <div className="bg-white rounded-full h-full w-2/3" />
                                </div>
                                <Button className="w-full bg-white text-indigo-600 hover:bg-indigo-50 border-0 font-bold">
                                    Tiếp tục ngay <ChevronRight className="w-4 h-4 ml-1" />
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
        blue: 'bg-blue-50 text-blue-600',
        orange: 'bg-orange-50 text-orange-600',
        purple: 'bg-purple-50 text-purple-600',
        teal: 'bg-teal-50 text-teal-600'
    };

    return (
        <Card className="p-5 flex flex-col items-center justify-center hover:shadow-lg transition-all border-gray-100 hover:scale-[1.02]">
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-colors", colors[color])}>
                {icon}
            </div>
            <span className="text-2xl font-bold text-gray-900 tabular-nums mb-0.5">{value}</span>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</span>
        </Card>
    );
}

function CourseCard({ course, progress }: { course: Course; progress: number }) {
    return (
        <Card className="p-0 overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 group">
            <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-6 md:items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="bg-arduino-teal/10 text-arduino-teal text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                {course.code}
                            </span>
                            <span className="text-gray-400 text-xs font-medium">Official Course</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-arduino-teal transition-colors">
                            {course.title}
                        </h3>
                        <p className="text-gray-500 leading-relaxed mb-6">{course.description}</p>

                        {/* Progress Bar */}
                        <div className="space-y-2 max-w-md">
                            <div className="flex justify-between text-sm font-medium">
                                <span className="text-gray-600">Tiến độ khóa học</span>
                                <span className="text-arduino-teal">{progress}%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-arduino-teal rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
                            </div>
                        </div>
                    </div>

                    <div className="shrink-0 flex md:flex-col gap-3">
                        <Button className="w-full md:w-auto shadow-md shadow-arduino-teal/20">
                            Tiếp tục học <PlayCircle className="w-4 h-4 ml-2" />
                        </Button>
                        <Button variant="secondary" className="w-full md:w-auto">
                            Xem chi tiết
                        </Button>
                    </div>
                </div>
            </div>

            {/* Weeks Strip */}
            <div className="bg-gray-50/50 border-t border-gray-100 p-4 overflow-x-auto">
                <div className="flex gap-2 min-w-max">
                    {course.weeks.map((week, idx) => {
                        const isCompleted = idx < 1;
                        const isCurrent = idx === 1;

                        return (
                            <Link
                                key={week.id}
                                to={`/weeks/${week.id}`}
                                className={cn(
                                    "w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all border-2",
                                    isCompleted ? "bg-arduino-teal text-white border-arduino-teal" :
                                        isCurrent ? "bg-white text-arduino-teal border-arduino-teal ring-2 ring-arduino-teal/20" :
                                            "bg-white text-gray-400 border-gray-200 hover:border-gray-300 hover:text-gray-600"
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
        yellow: 'text-yellow-600 bg-yellow-50 group-hover:bg-yellow-100',
        orange: 'text-orange-600 bg-orange-50 group-hover:bg-orange-100',
        blue: 'text-blue-600 bg-blue-50 group-hover:bg-blue-100',
        purple: 'text-purple-600 bg-purple-50 group-hover:bg-purple-100',
    };

    return (
        <Link to={href} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-white hover:shadow-md hover:border-gray-200 transition-all group">
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center transition-colors", colors[color])}>
                {icon}
            </div>
            <span className="flex-1 font-bold text-gray-700 group-hover:text-gray-900 transition-colors">
                {label}
            </span>
            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-arduino-teal" />
        </Link>
    );
}

