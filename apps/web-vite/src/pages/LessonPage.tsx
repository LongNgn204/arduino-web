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
                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
                            <ChevronLeft className="w-5 h-5" />
                            Bài trước
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
                            Bài sau
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </main>

            {/* AI Tutor Popup */}
            <AiChatPopup lessonId={lesson.id} />
        </div>
    );
}

// Enhanced Markdown Renderer Component
function MarkdownRenderer({ content }: { content: string }) {
    const renderContent = () => {
        const lines = content.split('\n');
        const elements: React.ReactNode[] = [];
        let inCodeBlock = false;
        let codeContent = '';
        let codeLanguage = '';

        lines.forEach((line, index) => {
            // Code block detection
            if (line.startsWith('```')) {
                if (!inCodeBlock) {
                    inCodeBlock = true;
                    codeLanguage = line.slice(3).trim() || 'cpp';
                    codeContent = '';
                } else {
                    inCodeBlock = false;
                    elements.push(
                        <div key={index} className="my-6 rounded-xl overflow-hidden border border-slate-700/50 shadow-lg">
                            <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                </div>
                                <span className="text-xs text-slate-500 font-mono">{codeLanguage}</span>
                            </div>
                            <pre className="bg-slate-900 p-4 overflow-x-auto">
                                <code className={`language-${codeLanguage} text-sm text-slate-300 font-mono leading-relaxed`}>
                                    {codeContent.trim()}
                                </code>
                            </pre>
                        </div>
                    );
                }
                return;
            }

            if (inCodeBlock) {
                codeContent += line + '\n';
                return;
            }

            // Headers with gradient styling
            if (line.startsWith('# ')) {
                elements.push(
                    <h1 key={index} className="text-3xl font-black bg-gradient-to-r from-white via-teal-200 to-cyan-300 bg-clip-text text-transparent mt-10 mb-6 pb-3 border-b border-slate-700/50">
                        {line.slice(2)}
                    </h1>
                );
            } else if (line.startsWith('## ')) {
                elements.push(
                    <h2 key={index} className="text-2xl font-bold text-white mt-8 mb-4 flex items-center gap-3">
                        <span className="w-1.5 h-8 bg-gradient-to-b from-teal-400 to-cyan-500 rounded-full" />
                        {line.slice(3)}
                    </h2>
                );
            } else if (line.startsWith('### ')) {
                elements.push(
                    <h3 key={index} className="text-xl font-semibold text-slate-200 mt-6 mb-3">
                        {line.slice(4)}
                    </h3>
                );
            }
            // Blockquote / Important notes
            else if (line.startsWith('> ')) {
                elements.push(
                    <blockquote key={index} className="my-4 pl-4 border-l-4 border-teal-500 bg-teal-500/5 py-3 pr-4 rounded-r-lg text-slate-300 italic">
                        {line.slice(2)}
                    </blockquote>
                );
            }
            // List items
            else if (line.startsWith('- ')) {
                elements.push(
                    <li key={index} className="text-slate-300 ml-6 list-none flex items-start gap-3 my-2">
                        <span className="w-2 h-2 mt-2 rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 shrink-0" />
                        <span>{line.slice(2)}</span>
                    </li>
                );
            }
            // Numbered list
            else if (/^\d+\. /.test(line)) {
                const match = line.match(/^(\d+)\. (.*)$/);
                if (match) {
                    elements.push(
                        <li key={index} className="text-slate-300 ml-6 list-none flex items-start gap-3 my-2">
                            <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center text-sm font-bold shrink-0">
                                {match[1]}
                            </span>
                            <span>{match[2]}</span>
                        </li>
                    );
                }
            }
            // Inline code
            else if (line.includes('`')) {
                const parts = line.split(/(`[^`]+`)/);
                elements.push(
                    <p key={index} className="text-slate-300 my-3 leading-relaxed">
                        {parts.map((part, i) =>
                            part.startsWith('`') && part.endsWith('`') ? (
                                <code key={i} className="px-2 py-1 bg-slate-800 rounded-md text-teal-300 text-sm font-mono border border-slate-700">
                                    {part.slice(1, -1)}
                                </code>
                            ) : (
                                part
                            )
                        )}
                    </p>
                );
            }
            // Bold text
            else if (line.includes('**')) {
                const parts = line.split(/(\*\*[^*]+\*\*)/);
                elements.push(
                    <p key={index} className="text-slate-300 my-3 leading-relaxed">
                        {parts.map((part, i) =>
                            part.startsWith('**') && part.endsWith('**') ? (
                                <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>
                            ) : (
                                part
                            )
                        )}
                    </p>
                );
            }
            // Regular paragraph
            else if (line.trim()) {
                elements.push(
                    <p key={index} className="text-slate-300 my-3 leading-relaxed text-base">
                        {line}
                    </p>
                );
            }
            // Empty line = spacing
            else {
                elements.push(<div key={index} className="h-3" />);
            }
        });

        return elements;
    };

    return <div className="space-y-1">{renderContent()}</div>;
}
