import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import {
    ArrowLeft,
    BookOpen,
    Beaker,
    FileQuestion,
    Clock,
    ChevronRight,
    CheckCircle2,
    Circle,
    Cpu,
    Target,
    Sparkles,
    Play
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

const API_BASE = import.meta.env.PROD
    ? 'https://arduino-workers.stu725114073.workers.dev'
    : '';

interface Lesson {
    id: string;
    orderIndex: number;
    title: string;
    duration: number | null;
}

interface Lab {
    id: string;
    orderIndex: number;
    title: string;
    duration: number | null;
    simulatorUrl: string | null;
}

interface WeekDetail {
    id: string;
    weekNumber: number;
    title: string;
    overview: string;
    objectives: string[];
    examChecklist: string[];
    lessons: Lesson[];
    labs: Lab[];
}

export default function WeekDetailPage() {
    const { weekId } = useParams<{ weekId: string }>();
    const { isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    const [week, setWeek] = useState<WeekDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'lessons' | 'labs'>('overview');

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        async function fetchWeek() {
            if (!weekId) return;
            try {
                const res = await fetch(`${API_BASE}/api/weeks/${weekId}`, {
                    credentials: 'include',
                });
                const data = await res.json();
                setWeek(data.week);
            } catch (error) {
                console.error('Failed to fetch week:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchWeek();
    }, [weekId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-arduino-base flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-arduino-teal border-t-transparent rounded-full animate-spin" />
                    <p className="text-arduino-text-secondary animate-pulse">Đang tải nội dung tuần học...</p>
                </div>
            </div>
        );
    }

    if (!week) {
        return (
            <div className="min-h-screen bg-arduino-base flex items-center justify-center">
                <Card className="text-center p-8 border-dashed">
                    <p className="text-arduino-text-muted mb-4">Không tìm thấy tuần học này.</p>
                    <Link to="/dashboard" className="text-arduino-teal hover:underline font-medium">
                        ← Quay lại Dashboard
                    </Link>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-arduino-base text-arduino-text-primary font-sans">
            {/* Hero Header */}
            <header className="relative overflow-hidden bg-white shadow-soft pt-6 md:pt-8 pb-12 md:pb-16 lg:pb-24">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-1/2 md:w-1/3 h-full bg-arduino-mint/30 rounded-bl-[100px] -z-0" />
                <div className="absolute bottom-0 left-0 w-1/3 md:w-1/4 h-1/2 bg-arduino-yellow/20 rounded-tr-[80px] -z-0" />

                <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Back Button */}
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center gap-2 text-arduino-text-secondary hover:text-arduino-teal transition-colors mb-6 md:mb-8 font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm">Quay lại Dashboard</span>
                    </Link>

                    {/* Week Info */}
                    <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-8">
                        {/* Week Number Badge */}
                        <div className="relative shrink-0 mx-auto md:mx-0">
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl md:rounded-3xl bg-gradient-to-br from-arduino-teal to-teal-600 flex items-center justify-center text-white text-3xl md:text-4xl font-black shadow-lg shadow-arduino-teal/20">
                                {week.weekNumber}
                            </div>
                            <div className="absolute -bottom-2 md:-bottom-3 -right-2 md:-right-3 w-7 h-7 md:w-8 md:h-8 bg-white rounded-full flex items-center justify-center border-2 border-arduino-teal shadow-sm">
                                <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-arduino-teal" />
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <Badge variant="mint" className="mb-3">Tuần {week.weekNumber}</Badge>
                            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                                {week.title}
                            </h1>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-4 text-xs md:text-sm text-arduino-text-secondary">
                                <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                                    <BookOpen className="w-4 h-4 text-arduino-teal" />
                                    <span className="font-medium text-gray-700">{(week.lessons || []).length}</span> bài giảng
                                </span>
                                <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                                    <Beaker className="w-4 h-4 text-amber-500" />
                                    <span className="font-medium text-gray-700">{(week.labs || []).length}</span> thực hành
                                </span>
                                <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                                    <Target className="w-4 h-4 text-indigo-500" />
                                    <span className="font-medium text-gray-700">{(week.objectives || []).length}</span> mục tiêu
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Tab Navigation (Sticky) */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="flex gap-2 py-3 overflow-x-auto no-scrollbar">
                        <TabButton
                            active={activeTab === 'overview'}
                            onClick={() => setActiveTab('overview')}
                            icon={<Cpu className="w-4 h-4" />}
                        >
                            Tổng quan
                        </TabButton>
                        <TabButton
                            active={activeTab === 'lessons'}
                            onClick={() => setActiveTab('lessons')}
                            icon={<BookOpen className="w-4 h-4" />}
                            count={(week.lessons || []).length}
                        >
                            Bài giảng
                        </TabButton>
                        <TabButton
                            active={activeTab === 'labs'}
                            onClick={() => setActiveTab('labs')}
                            icon={<Beaker className="w-4 h-4" />}
                            count={(week.labs || []).length}
                        >
                            Thực hành
                        </TabButton>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {activeTab === 'overview' && (
                    <div className="space-y-8 animate-fade-in">
                        {/* Overview Card */}
                        <Card className="p-8 border-l-4 border-l-arduino-teal">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Cpu className="w-5 h-5 text-arduino-teal" />
                                Giới thiệu tuần học
                            </h2>
                            <div className="text-arduino-text-secondary leading-relaxed whitespace-pre-wrap text-lg">
                                {week.overview}
                            </div>
                        </Card>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Objectives */}
                            {week.objectives && week.objectives.length > 0 && (
                                <Card className="p-6 bg-gradient-to-br from-white to-arduino-mint/20 border-arduino-mint/30 h-full">
                                    <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-arduino-teal">
                                            <CheckCircle2 className="w-5 h-5" />
                                        </div>
                                        Mục tiêu học tập
                                    </h3>
                                    <ul className="space-y-3">
                                        {week.objectives.map((obj, i) => (
                                            <li key={i} className="flex items-start gap-4 group">
                                                <span className="w-6 h-6 shrink-0 rounded-full bg-arduino-teal/10 text-arduino-teal flex items-center justify-center text-xs font-bold mt-0.5">
                                                    {i + 1}
                                                </span>
                                                <span className="text-gray-600 group-hover:text-gray-900 transition-colors">{obj}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </Card>
                            )}

                            {/* Exam Checklist */}
                            {week.examChecklist && week.examChecklist.length > 0 && (
                                <Card className="p-6 bg-gradient-to-br from-white to-arduino-yellow/20 border-arduino-yellow/30 h-full">
                                    <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-amber-500">
                                            <FileQuestion className="w-5 h-5" />
                                        </div>
                                        Checklist ôn thi
                                    </h3>
                                    <ul className="space-y-3">
                                        {week.examChecklist.map((item, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <Circle className="w-2 h-2 mt-2.5 text-amber-400 shrink-0 fill-amber-400" />
                                                <span className="text-gray-600">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </Card>
                            )}
                        </div>

                        {/* Quick Start */}
                        <Card className="p-8 bg-arduino-text-primary text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                            <div className="relative z-10">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    🚀 Bắt đầu học ngay
                                </h3>
                                <div className="flex flex-wrap gap-4">
                                    {week.lessons && week.lessons.length > 0 && (
                                        <Link to={`/lessons/${week.lessons[0].id}`}>
                                            <Button size="lg" className="shadow-xl bg-white text-arduino-teal hover:bg-gray-100">
                                                <Play className="w-4 h-4 mr-2 fill-current" />
                                                Bắt đầu Bài 1
                                            </Button>
                                        </Link>
                                    )}
                                    {week.labs && week.labs.length > 0 && (
                                        <Link to={`/labs/${week.labs[0].id}`}>
                                            <Button variant="secondary" size="lg" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                                                <Beaker className="w-4 h-4 mr-2" />
                                                Thực hành đầu tiên
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {activeTab === 'lessons' && (
                    <div className="space-y-4 animate-slide-up">
                        {!week.lessons || week.lessons.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
                                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-arduino-text-secondary">Chưa có bài giảng nào.</p>
                            </div>
                        ) : (
                            week.lessons.map((lesson, index) => (
                                <ContentCard
                                    key={lesson.id}
                                    type="lesson"
                                    index={index + 1}
                                    title={lesson.title}
                                    duration={lesson.duration}
                                    href={`/lessons/${lesson.id}`}
                                    completed={index === 0} // Mock completion logic
                                />
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'labs' && (
                    <div className="space-y-4 animate-slide-up">
                        {!week.labs || week.labs.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
                                <Beaker className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-arduino-text-secondary">Chưa có bài thực hành nào.</p>
                            </div>
                        ) : (
                            week.labs.map((lab, index) => (
                                <ContentCard
                                    key={lab.id}
                                    type="lab"
                                    index={index + 1}
                                    title={lab.title}
                                    duration={lab.duration}
                                    href={`/labs/${lab.id}`}
                                    hasSimulator={!!lab.simulatorUrl}
                                />
                            ))
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}

function TabButton({
    active,
    onClick,
    children,
    icon,
    count
}: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
    icon: React.ReactNode;
    count?: number;
}) {
    return (
        <button
            onClick={onClick}
            className={`
                flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-full transition-all whitespace-nowrap
                ${active
                    ? 'bg-arduino-teal text-white shadow-md shadow-arduino-teal/20'
                    : 'text-arduino-text-secondary hover:bg-gray-100 hover:text-arduino-teal'
                }
            `}
        >
            {icon}
            {children}
            {count !== undefined && (
                <span className={`
                    ml-1 px-2 py-0.5 text-xs rounded-full font-bold
                    ${active ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'}
                `}>
                    {count}
                </span>
            )}
        </button>
    );
}

function ContentCard({
    type,
    index,
    title,
    duration,
    href,
    completed,
    hasSimulator
}: {
    type: 'lesson' | 'lab';
    index: number;
    title: string;
    duration: number | null;
    href: string;
    completed?: boolean;
    hasSimulator?: boolean;
}) {
    const isLesson = type === 'lesson';

    return (
        <Link to={href} className="block group">
            <Card className={`
                flex items-center gap-5 p-5 transition-all duration-300 border-l-4 
                ${completed ? 'border-l-green-500 bg-green-50/30' : 'border-l-transparent hover:border-l-arduino-teal'}
                hover:shadow-hover hover:-translate-y-1
            `}>
                {/* Index Badge */}
                <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all font-bold text-lg
                    ${completed
                        ? 'bg-green-100 text-green-600'
                        : isLesson
                            ? 'bg-arduino-mint/50 text-arduino-teal group-hover:bg-arduino-teal group-hover:text-white'
                            : 'bg-amber-100 text-amber-600 group-hover:bg-amber-500 group-hover:text-white'
                    }
                `}>
                    {completed ? <CheckCircle2 className="w-6 h-6" /> : index}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                        <Badge variant={isLesson ? 'mint' : 'yellow'} className={!isLesson ? 'bg-amber-100 text-amber-700' : ''}>
                            {isLesson ? 'Bài giảng' : 'Thực hành'}
                        </Badge>
                        {hasSimulator && (
                            <Badge variant="outline" className="text-cyan-600 border-cyan-200 bg-cyan-50">
                                🔧 Simulator
                            </Badge>
                        )}
                    </div>
                    <h4 className="font-bold text-gray-800 text-lg mb-1 group-hover:text-arduino-teal transition-colors">
                        {title}
                    </h4>
                    {duration && (
                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                            <Clock className="w-3.5 h-3.5" />
                            {duration} phút
                        </div>
                    )}
                </div>

                {/* Arrow */}
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-arduino-teal group-hover:text-white transition-all">
                    <ChevronRight className="w-5 h-5" />
                </div>
            </Card>
        </Link>
    );
}
