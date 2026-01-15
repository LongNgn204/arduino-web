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
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-teal-400 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-400 animate-pulse">Đang tải nội dung tuần học...</p>
                </div>
            </div>
        );
    }

    if (!week) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-center bg-slate-800/50 p-8 rounded-2xl border border-slate-700">
                    <p className="text-slate-400 mb-4">Không tìm thấy tuần học này.</p>
                    <Link to="/dashboard" className="text-teal-400 hover:underline">
                        ← Quay lại Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Hero Header */}
            <header className="relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-cyan-500/10" />
                <div className="absolute top-20 left-1/4 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl" />
                <div className="absolute top-10 right-1/4 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl" />

                <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Back Button */}
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm">Quay lại Dashboard</span>
                    </Link>

                    {/* Week Info */}
                    <div className="flex items-start gap-6">
                        {/* Week Number Badge */}
                        <div className="relative">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-teal-500/30">
                                {week.weekNumber}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center border-2 border-teal-400">
                                <Sparkles className="w-3 h-3 text-teal-400" />
                            </div>
                        </div>

                        <div className="flex-1">
                            <p className="text-teal-400 text-sm font-medium mb-1">Tuần {week.weekNumber}</p>
                            <h1 className="text-3xl md:text-4xl font-black text-white mb-3">
                                {week.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                                <span className="flex items-center gap-1.5">
                                    <BookOpen className="w-4 h-4 text-teal-400" />
                                    {week.lessons.length} bài giảng
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Beaker className="w-4 h-4 text-amber-400" />
                                    {week.labs.length} thực hành
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Target className="w-4 h-4 text-purple-400" />
                                    {week.objectives.length} mục tiêu
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Tab Navigation */}
            <div className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="flex gap-2 py-3">
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
                            count={week.lessons.length}
                        >
                            Bài giảng
                        </TabButton>
                        <TabButton
                            active={activeTab === 'labs'}
                            onClick={() => setActiveTab('labs')}
                            icon={<Beaker className="w-4 h-4" />}
                            count={week.labs.length}
                        >
                            Thực hành
                        </TabButton>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'overview' && (
                    <div className="space-y-8 animate-fadeIn">
                        {/* Overview Card */}
                        <section className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Cpu className="w-5 h-5 text-teal-400" />
                                Giới thiệu tuần học
                            </h2>
                            <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                                {week.overview}
                            </div>
                        </section>

                        {/* Objectives */}
                        {week.objectives.length > 0 && (
                            <section className="bg-gradient-to-br from-teal-500/10 to-transparent rounded-2xl p-6 border border-teal-500/20">
                                <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                                    <div className="w-8 h-8 bg-teal-500/20 rounded-lg flex items-center justify-center">
                                        <CheckCircle2 className="w-5 h-5 text-teal-400" />
                                    </div>
                                    Mục tiêu học tập
                                </h3>
                                <ul className="space-y-3">
                                    {week.objectives.map((obj, i) => (
                                        <li key={i} className="flex items-start gap-4 group">
                                            <span className="w-8 h-8 shrink-0 rounded-lg bg-slate-800 text-teal-400 flex items-center justify-center text-sm font-bold group-hover:bg-teal-500 group-hover:text-white transition-all">
                                                {i + 1}
                                            </span>
                                            <span className="text-slate-300 pt-1">{obj}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {/* Exam Checklist */}
                        {week.examChecklist.length > 0 && (
                            <section className="bg-gradient-to-br from-amber-500/10 to-transparent rounded-2xl p-6 border border-amber-500/20">
                                <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                                    <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
                                        <FileQuestion className="w-5 h-5 text-amber-400" />
                                    </div>
                                    Checklist ôn thi
                                </h3>
                                <ul className="space-y-2">
                                    {week.examChecklist.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-slate-300">
                                            <Circle className="w-2 h-2 mt-2 text-amber-400 shrink-0 fill-amber-400" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {/* Quick Start */}
                        <section className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                            <h3 className="text-lg font-bold text-white mb-4">🚀 Bắt đầu học ngay</h3>
                            <div className="flex flex-wrap gap-3">
                                {week.lessons.length > 0 && (
                                    <Link
                                        to={`/lessons/${week.lessons[0].id}`}
                                        className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-medium hover:from-teal-400 hover:to-cyan-400 transition-all shadow-lg shadow-teal-500/30 hover:scale-105"
                                    >
                                        <Play className="w-4 h-4" />
                                        Bắt đầu Bài 1
                                    </Link>
                                )}
                                {week.labs.length > 0 && (
                                    <Link
                                        to={`/labs/${week.labs[0].id}`}
                                        className="flex items-center gap-2 px-5 py-3 bg-slate-700 text-white rounded-xl font-medium hover:bg-slate-600 transition-all"
                                    >
                                        <Beaker className="w-4 h-4 text-amber-400" />
                                        Thực hành đầu tiên
                                    </Link>
                                )}
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === 'lessons' && (
                    <div className="space-y-4 animate-fadeIn">
                        {week.lessons.length === 0 ? (
                            <div className="text-center py-16 bg-slate-800/30 rounded-2xl border border-slate-700/50">
                                <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                                <p className="text-slate-400">Chưa có bài giảng nào.</p>
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
                                    completed={index === 0}
                                />
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'labs' && (
                    <div className="space-y-4 animate-fadeIn">
                        {week.labs.length === 0 ? (
                            <div className="text-center py-16 bg-slate-800/30 rounded-2xl border border-slate-700/50">
                                <Beaker className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                                <p className="text-slate-400">Chưa có bài thực hành nào.</p>
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
                flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all
                ${active
                    ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }
            `}
        >
            {icon}
            {children}
            {count !== undefined && (
                <span className={`
                    px-2 py-0.5 text-xs rounded-full
                    ${active ? 'bg-teal-400/20 text-teal-400' : 'bg-slate-700 text-slate-400'}
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
        <Link
            to={href}
            className="group flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300 bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/60 hover:border-teal-500/30 hover:shadow-lg hover:shadow-teal-500/5"
        >
            {/* Index Badge */}
            <div className={`
                w-14 h-14 rounded-xl flex items-center justify-center shrink-0 transition-all
                ${completed
                    ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white'
                    : isLesson
                        ? 'bg-slate-700/50 text-slate-400 group-hover:bg-teal-500/20 group-hover:text-teal-400'
                        : 'bg-slate-700/50 text-slate-400 group-hover:bg-amber-500/20 group-hover:text-amber-400'
                }
            `}>
                {completed ? (
                    <CheckCircle2 className="w-7 h-7" />
                ) : (
                    <span className="text-xl font-bold">{index}</span>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${isLesson ? 'bg-teal-500/10 text-teal-400' : 'bg-amber-500/10 text-amber-400'}`}>
                        {isLesson ? 'Bài giảng' : 'Thực hành'}
                    </span>
                    {hasSimulator && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400">
                            🔧 Simulator
                        </span>
                    )}
                </div>
                <h4 className="font-semibold text-white truncate group-hover:text-teal-400 transition-colors text-lg">
                    {title}
                </h4>
                {duration && (
                    <div className="flex items-center gap-1.5 mt-1 text-sm text-slate-500">
                        <Clock className="w-3.5 h-3.5" />
                        {duration} phút
                    </div>
                )}
            </div>

            {/* Arrow */}
            <div className="w-10 h-10 rounded-xl bg-slate-700/50 flex items-center justify-center group-hover:bg-teal-500 group-hover:text-white text-slate-500 transition-all">
                <ChevronRight className="w-5 h-5" />
            </div>
        </Link>
    );
}
