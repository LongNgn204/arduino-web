import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

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
        <div className="min-h-screen bg-background font-sans text-foreground">
            {/* Header - Mobile Only */}
            <header className="lg:hidden border-b border-border p-4 flex justify-between items-center">
                <Link to="/" className="font-bold text-lg">HỌC ARDUINO</Link>
                <button
                    onClick={handleLogout}
                    className="text-sm text-muted-foreground hover:text-foreground"
                >
                    Đăng xuất
                </button>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-8">
                {/* Welcome Section */}
                <div className="mb-8 p-6 border border-border rounded-lg bg-card">
                    <h1 className="text-2xl font-bold mb-2">
                        Xin chào, {user?.displayName || user?.username || 'Bạn hiền'}!
                    </h1>
                    <p className="text-muted-foreground">
                        Sẵn sàng cho bài học hôm nay chưa? Hãy tiếp tục hành trình chinh phục IoT.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatCard label="Bài học" value={`${progress.lessons.completed}/${progress.lessons.total}`} />
                    <StatCard label="Labs" value={`${progress.labs.completed}/${progress.labs.total}`} />
                    <StatCard label="Điểm TB" value={`${progress.avgQuizScore ?? '--'}%`} />
                    <StatCard label="Tiến độ" value={`${progress.overall}%`} />
                </div>

                {/* Main Dashboard Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Courses */}
                    <div className="lg:col-span-2 space-y-8">
                        <section>
                            <h2 className="text-xl font-bold mb-4">Khóa học đang diễn ra</h2>

                            {loading ? (
                                <div className="p-4 border border-border rounded-lg text-muted-foreground">Đang tải...</div>
                            ) : courses.length === 0 ? (
                                <div className="p-8 border border-border rounded-lg text-center bg-card">
                                    <h3 className="text-lg font-bold mb-2">Chưa đăng ký khóa học nào</h3>
                                    <p className="text-muted-foreground mb-4">Hãy bắt đầu hành trình của bạn ngay hôm nay.</p>
                                    <button className="px-4 py-2 bg-foreground text-background rounded font-medium">Khám phá khóa học</button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {courses.map((course) => (
                                        <CourseCard key={course.id} course={course} progress={progress.overall} />
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Right Column: Quick Actions */}
                    <div className="space-y-8">
                        {/* Progress Summary Card */}
                        <div className="p-6 border border-border rounded-lg bg-card">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-bold">Tiến độ học tập</h3>
                            </div>
                            <p className="text-sm text-muted-foreground mb-6">
                                Bạn đã hoàn thành {progress.lessons.completed}/{progress.lessons.total} bài học.
                            </p>
                            <Link to={courses[0]?.weeks?.[0]?.id ? `/weeks/${courses[0].weeks[0].id}` : '/dashboard'}>
                                <button className="w-full py-2 bg-foreground text-background rounded font-medium hover:opacity-90 transition-opacity">
                                    Học tiếp ngay
                                </button>
                            </Link>
                        </div>

                        {/* Quick Links */}
                        <section>
                            <h2 className="text-lg font-bold mb-4">Truy cập nhanh</h2>
                            <div className="grid grid-cols-1 gap-2">
                                <QuickLink label="Bảng xếp hạng" href="/leaderboard" />
                                <QuickLink label="Luyện tập (Exam Drills)" href="/drills" />
                                <QuickLink label="Lịch sử Quiz" href="/history" />
                                <QuickLink label="Chứng chỉ" href="/certificate" />
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}

// Components
function StatCard({ label, value }: { label: string, value: string }) {
    return (
        <div className="p-4 border border-border rounded-lg bg-card">
            <span className="block text-2xl font-bold mb-1">{value}</span>
            <span className="text-xs text-muted-foreground uppercase">{label}</span>
        </div>
    );
}

function CourseCard({ course, progress }: { course: Course; progress: number }) {
    const navigate = useNavigate();
    const firstWeekId = course.weeks?.[0]?.id;

    const handleContinue = () => {
        if (firstWeekId) {
            navigate(`/weeks/${firstWeekId}`);
        }
    };

    return (
        <div className="p-6 border border-border rounded-lg bg-card hover:bg-muted/30 transition-colors">
            <div className="flex flex-col md:flex-row gap-6 justify-between mb-6">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold px-2 py-0.5 border border-border rounded uppercase">
                            {course.code}
                        </span>
                        <span className="text-xs text-muted-foreground">Official Course</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{course.description}</p>

                    {/* Progress Bar */}
                    <div className="max-w-md">
                        <div className="flex justify-between text-xs font-medium mb-1">
                            <span className="text-muted-foreground">Tiến độ khóa học</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-foreground" style={{ width: `${progress}%` }} />
                        </div>
                    </div>
                </div>

                <div className="flex md:flex-col gap-2 shrink-0">
                    <button
                        onClick={handleContinue}
                        disabled={!firstWeekId}
                        className="px-4 py-2 bg-foreground text-background rounded font-medium hover:opacity-90 disabled:opacity-50"
                    >
                        Tiếp tục học
                    </button>
                    <button
                        onClick={handleContinue}
                        disabled={!firstWeekId}
                        className="px-4 py-2 border border-border rounded font-medium hover:bg-muted disabled:opacity-50 text-center"
                    >
                        Chi tiết
                    </button>
                </div>
            </div>

            {/* Weeks Strip (Simplified) */}
            <div className="border-t border-border pt-4 overflow-x-auto">
                <div className="flex gap-2">
                    {course.weeks.map((week, idx) => {
                        const isCompleted = idx < 1;
                        const isCurrent = idx === 1;

                        return (
                            <Link
                                key={week.id}
                                to={`/weeks/${week.id}`}
                                className={`w-8 h-8 rounded flex items-center justify-center text-sm font-bold border transition-colors ${isCompleted ? "bg-foreground text-background border-foreground" :
                                    isCurrent ? "bg-background text-foreground border-foreground ring-1 ring-foreground" :
                                        "bg-background text-muted-foreground border-border hover:border-muted-foreground"
                                    }`}
                                title={week.title}
                            >
                                {week.weekNumber}
                            </Link>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}

function QuickLink({ label, href }: { label: string, href: string }) {
    return (
        <Link to={href} className="block p-3 border border-border rounded bg-card hover:bg-muted transition-colors text-sm font-medium">
            {label}
            <span className="float-right text-muted-foreground">&rarr;</span>
        </Link>
    );
}

