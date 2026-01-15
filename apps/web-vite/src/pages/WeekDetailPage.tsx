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
    Cpu
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
                <div className="w-10 h-10 border-4 border-teal-400 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!week) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-slate-400 mb-4">Không tìm thấy tuần học này.</p>
                    <Link to="/dashboard" className="text-teal-400 hover:underline">
                        ← Quay lại Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Header */}
            <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-slate-700/50">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center h-16 gap-4">
                        <Link
                            to="/dashboard"
                            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white font-bold">
                                {week.weekNumber}
                            </div>
                            <div>
                                <p className="text-xs text-slate-400">Tuần {week.weekNumber}</p>
                                <h1 className="text-lg font-semibold text-white">{week.title}</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Tab Navigation */}
            <div className="sticky top-16 z-40 bg-slate-900/95 border-b border-slate-700/50">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="flex gap-1">
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
                    <div className="space-y-8">
                        {/* Overview Markdown */}
                        <section className="prose prose-invert prose-teal max-w-none">
                            <div
                                className="text-slate-300 leading-relaxed whitespace-pre-wrap"
                                dangerouslySetInnerHTML={{ __html: week.overview.replace(/\n/g, '<br/>') }}
                            />
                        </section>

                        {/* Objectives */}
                        {week.objectives.length > 0 && (
                            <section>
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-teal-400" />
                                    Mục tiêu học tập
                                </h3>
                                <ul className="space-y-2">
                                    {week.objectives.map((obj, i) => (
                                        <li key={i} className="flex items-start gap-3 text-slate-300">
                                            <Circle className="w-2 h-2 mt-2 text-teal-400 flex-shrink-0" />
                                            {obj}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {/* Exam Checklist */}
                        {week.examChecklist.length > 0 && (
                            <section>
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <FileQuestion className="w-5 h-5 text-amber-400" />
                                    Checklist ôn thi
                                </h3>
                                <ul className="space-y-2">
                                    {week.examChecklist.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-slate-300">
                                            <Circle className="w-2 h-2 mt-2 text-amber-400 flex-shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}
                    </div>
                )}

                {activeTab === 'lessons' && (
                    <div className="space-y-3">
                        {week.lessons.length === 0 ? (
                            <p className="text-slate-400 text-center py-8">Chưa có bài giảng nào.</p>
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
                    <div className="space-y-3">
                        {week.labs.length === 0 ? (
                            <p className="text-slate-400 text-center py-8">Chưa có bài thực hành nào.</p>
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
        flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors
        ${active
                    ? 'border-teal-400 text-teal-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }
      `}
        >
            {icon}
            {children}
            {count !== undefined && (
                <span className={`
          px-1.5 py-0.5 text-xs rounded-full
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
    const Icon = type === 'lesson' ? BookOpen : Beaker;
    const color = type === 'lesson' ? 'teal' : 'amber';

    return (
        <Link
            to={href}
            className={`
        group flex items-center gap-4 p-4 rounded-xl border transition-all
        bg-slate-800/50 border-slate-700/50 hover:border-${color}-500/50 hover:bg-slate-800
      `}
        >
            <div className={`
        w-12 h-12 rounded-xl flex items-center justify-center
        ${completed
                    ? `bg-${color}-500 text-white`
                    : `bg-slate-700 text-slate-400 group-hover:bg-${color}-500/20 group-hover:text-${color}-400`
                }
      `}>
                {completed ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500 mb-0.5">
                    {type === 'lesson' ? 'Bài giảng' : 'Thực hành'} {index}
                </p>
                <h4 className="font-medium text-white truncate group-hover:text-teal-400 transition-colors">
                    {title}
                </h4>
                <div className="flex items-center gap-3 mt-1">
                    {duration && (
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                            <Clock className="w-3 h-3" />
                            {duration} phút
                        </span>
                    )}
                    {hasSimulator && (
                        <span className="text-xs text-cyan-400">🔧 Có Simulator</span>
                    )}
                </div>
            </div>

            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-teal-400 transition-colors" />
        </Link>
    );
}
