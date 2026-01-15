import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import {
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    Clock,
    CheckCircle2,
    BookOpen,
    Sparkles,
    Eye
} from 'lucide-react';
import AiChatPopup from '../components/AiChatPopup';

const API_BASE = import.meta.env.PROD
    ? 'https://arduino-workers.stu725114073.workers.dev'
    : '';

interface LessonDetail {
    id: string;
    weekId: string;
    orderIndex: number;
    title: string;
    content: string;
    duration: number | null;
}

interface WeekInfo {
    id: string;
    weekNumber: number;
    title: string;
}

export default function LessonPage() {
    const { lessonId } = useParams<{ lessonId: string }>();
    const { isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    const [lesson, setLesson] = useState<LessonDetail | null>(null);
    const [week, setWeek] = useState<WeekInfo | null>(null);
    const [siblings, setSiblings] = useState<{ prev: string | null; next: string | null }>({ prev: null, next: null });
    const [loading, setLoading] = useState(true);
    const [completed, setCompleted] = useState(false);
    const [readingProgress, setReadingProgress] = useState(0);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        async function fetchLesson() {
            if (!lessonId) return;
            try {
                const res = await fetch(`${API_BASE}/api/lessons/${lessonId}`, {
                    credentials: 'include',
                });
                const data = await res.json();
                setLesson(data.lesson);
                setWeek(data.week);
                // Calculate prev/next lesson IDs
                if (data.lesson && data.week) {
                    const currentOrder = data.lesson.orderIndex;
                    const weekNum = data.week.weekNumber;
                    const weekPadded = String(weekNum).padStart(2, '0');
                    const prevOrder = currentOrder - 1;
                    const nextOrder = currentOrder + 1;
                    setSiblings({
                        prev: prevOrder >= 1 ? `lesson-${weekPadded}-${String(prevOrder).padStart(2, '0')}` : (weekNum > 1 ? `lesson-${String(weekNum - 1).padStart(2, '0')}-01` : null),
                        next: `lesson-${weekPadded}-${String(nextOrder).padStart(2, '0')}`
                    });
                }
            } catch (error) {
                console.error('Failed to fetch lesson:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchLesson();
    }, [lessonId]);

    // Reading progress tracker
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? Math.min(100, Math.round((scrollTop / docHeight) * 100)) : 0;
            setReadingProgress(progress);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleMarkComplete = async () => {
        if (!lesson || completed) return;
        try {
            const res = await fetch(`${API_BASE}/api/progress/mark`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    lessonId: lesson.id,
                    status: 'completed',
                }),
            });
            if (res.ok) {
                setCompleted(true);
            }
        } catch (error) {
            console.error('Failed to mark complete:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-teal-400 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-400 animate-pulse">Đang tải bài học...</p>
                </div>
            </div>
        );
    }

    if (!lesson) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-center bg-slate-800/50 p-8 rounded-2xl border border-slate-700">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="w-8 h-8 text-red-400" />
                    </div>
                    <p className="text-slate-300 mb-4">Không tìm thấy bài giảng.</p>
                    <Link to="/dashboard" className="text-teal-400 hover:underline">
                        ← Quay lại Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Reading Progress Bar */}
            <div className="fixed top-0 left-0 right-0 h-1 bg-slate-800 z-[60]">
                <div
                    className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 transition-all duration-150"
                    style={{ width: `${readingProgress}%` }}
                />
            </div>

            {/* Header */}
            <header className="sticky top-1 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-slate-700/50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <Link
                                to={week ? `/weeks/${week.id}` : '/dashboard'}
                                className="p-2.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all hover:scale-105"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="px-2 py-0.5 bg-teal-500/10 text-teal-400 rounded-full border border-teal-500/20">
                                        Tuần {week?.weekNumber || '?'}
                                    </span>
                                    <span className="text-slate-500">•</span>
                                    <span className="text-slate-400">Bài {lesson.orderIndex}</span>
                                </div>
                                <h1 className="text-lg font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent truncate max-w-[300px]">
                                    {lesson.title}
                                </h1>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {lesson.duration && (
                                <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-full">
                                    <Clock className="w-4 h-4" />
                                    {lesson.duration} phút
                                </div>
                            )}
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                <Eye className="w-4 h-4" />
                                {readingProgress}%
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Lesson Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Feature Banner */}
                <div className="mb-8 p-4 bg-gradient-to-r from-teal-500/10 via-cyan-500/5 to-transparent rounded-2xl border border-teal-500/20 flex items-center gap-4">
                    <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center shrink-0">
                        <Sparkles className="w-6 h-6 text-teal-400" />
                    </div>
                    <div>
                        <h2 className="text-white font-semibold">AI Tutor sẵn sàng hỗ trợ</h2>
                        <p className="text-sm text-slate-400">Bôi đen văn bản để hỏi AI hoặc click nút chat ở góc phải</p>
                    </div>
                </div>

                <article className="prose prose-invert prose-teal max-w-none">
                    {/* Content Card with Glassmorphism */}
                    <div className="lesson-content bg-slate-800/30 backdrop-blur-sm rounded-3xl p-6 md:p-10 border border-slate-700/50 shadow-xl shadow-slate-900/50">
                        <MarkdownRenderer content={lesson.content} />
                    </div>
                </article>

                {/* Completion Section */}
                <div className="mt-10 p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-center sm:text-left">
                            <h3 className="text-white font-semibold mb-1">
                                {completed ? '🎉 Tuyệt vời! Bạn đã hoàn thành bài học!' : 'Hoàn thành bài học?'}
                            </h3>
                            <p className="text-sm text-slate-400">
                                {completed ? 'Tiếp tục sang bài tiếp theo hoặc ôn lại nội dung.' : 'Đánh dấu khi bạn đã hiểu nội dung bài học.'}
                            </p>
                        </div>

                        <button
                            onClick={handleMarkComplete}
                            disabled={completed}
                            className={`
                                flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all
                                ${completed
                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-default'
                                    : 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-400 hover:to-cyan-400 shadow-lg shadow-teal-500/30 hover:scale-105'
                                }
                            `}
                        >
                            {completed ? (
                                <>
                                    <CheckCircle2 className="w-5 h-5" />
                                    Đã hoàn thành
                                </>
                            ) : (
                                <>
                                    <BookOpen className="w-5 h-5" />
                                    Đánh dấu hoàn thành
                                </>
                            )}
                        </button>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between border-t border-slate-700 mt-6 pt-6">
                        {siblings.prev ? (
                            <Link to={`/lessons/${siblings.prev}`} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
                                <ChevronLeft className="w-5 h-5" />
                                Bài trước
                            </Link>
                        ) : (
                            <Link to={week ? `/weeks/${week.id}` : '/dashboard'} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
                                <ChevronLeft className="w-5 h-5" />
                                Về tuần học
                            </Link>
                        )}
                        <Link to={`/lessons/${siblings.next}`} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-400 hover:to-cyan-400 transition-all shadow-lg">
                            Bài sau
                            <ChevronRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </main>

            {/* AI Tutor Popup */}
            <AiChatPopup lessonId={lesson.id} />
        </div>
    );
}

// Professional Markdown Renderer using react-markdown
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function MarkdownRenderer({ content }: { content: string }) {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                // Headings
                h1: ({ children }) => (
                    <h1 className="text-3xl font-black bg-gradient-to-r from-white via-teal-200 to-cyan-300 bg-clip-text text-transparent mt-10 mb-6 pb-3 border-b border-slate-700/50">
                        {children}
                    </h1>
                ),
                h2: ({ children }) => (
                    <h2 className="text-2xl font-bold text-white mt-8 mb-4 flex items-center gap-3">
                        <span className="w-1.5 h-8 bg-gradient-to-b from-teal-400 to-cyan-500 rounded-full" />
                        {children}
                    </h2>
                ),
                h3: ({ children }) => (
                    <h3 className="text-xl font-semibold text-slate-200 mt-6 mb-3">{children}</h3>
                ),
                h4: ({ children }) => (
                    <h4 className="text-lg font-semibold text-slate-300 mt-4 mb-2">{children}</h4>
                ),
                // Paragraphs
                p: ({ children }) => (
                    <p className="text-slate-300 my-3 leading-relaxed text-base">{children}</p>
                ),
                // Lists
                ul: ({ children }) => <ul className="my-4 space-y-2">{children}</ul>,
                ol: ({ children }) => <ol className="my-4 space-y-2">{children}</ol>,
                li: ({ children }) => (
                    <li className="text-slate-300 ml-6 flex items-start gap-3">
                        <span className="w-2 h-2 mt-2 rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 shrink-0" />
                        <span>{children}</span>
                    </li>
                ),
                // Blockquote
                blockquote: ({ children }) => (
                    <blockquote className="my-4 pl-4 border-l-4 border-teal-500 bg-teal-500/5 py-3 pr-4 rounded-r-lg text-slate-300 italic">
                        {children}
                    </blockquote>
                ),
                // Code
                code: ({ className, children }) => {
                    const isInline = !className;
                    if (isInline) {
                        return (
                            <code className="px-2 py-1 bg-slate-800 rounded-md text-teal-300 text-sm font-mono border border-slate-700">
                                {children}
                            </code>
                        );
                    }
                    const language = className?.replace('language-', '') || 'cpp';
                    return (
                        <div className="my-6 rounded-xl overflow-hidden border border-slate-700/50 shadow-lg">
                            <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                </div>
                                <span className="text-xs text-slate-500 font-mono">{language}</span>
                            </div>
                            <pre className="bg-slate-900 p-4 overflow-x-auto">
                                <code className="text-sm text-slate-300 font-mono leading-relaxed whitespace-pre">
                                    {children}
                                </code>
                            </pre>
                        </div>
                    );
                },
                pre: ({ children }) => <>{children}</>,
                // Tables (GFM)
                table: ({ children }) => (
                    <div className="my-6 overflow-x-auto rounded-xl border border-slate-700/50">
                        <table className="w-full text-sm">{children}</table>
                    </div>
                ),
                thead: ({ children }) => (
                    <thead className="bg-slate-800 text-slate-200 font-semibold">{children}</thead>
                ),
                tbody: ({ children }) => <tbody className="divide-y divide-slate-700/50">{children}</tbody>,
                tr: ({ children }) => <tr className="hover:bg-slate-800/50 transition-colors">{children}</tr>,
                th: ({ children }) => <th className="px-4 py-3 text-left">{children}</th>,
                td: ({ children }) => <td className="px-4 py-3 text-slate-300">{children}</td>,
                // Links
                a: ({ href, children }) => (
                    <a href={href} className="text-teal-400 hover:text-teal-300 underline underline-offset-2" target="_blank" rel="noopener noreferrer">
                        {children}
                    </a>
                ),
                // Strong/Bold
                strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
                // Emphasis/Italic
                em: ({ children }) => <em className="text-slate-200 italic">{children}</em>,
                // Horizontal Rule
                hr: () => <hr className="my-8 border-t border-slate-700/50" />,
            }}
        >
            {content}
        </ReactMarkdown>
    );
}
