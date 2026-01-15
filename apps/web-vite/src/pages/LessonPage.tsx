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
    Sparkles,
    Eye,
    Bookmark
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

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
    const [isSaved, setIsSaved] = useState(false);

    const handleSave = async () => {
        setIsSaved(!isSaved);
        try {
            await fetch(`${API_BASE}/api/save`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: 'user_current',
                    itemType: 'lesson',
                    itemId: lessonId
                }),
                credentials: 'include'
            });
        } catch (e) { console.error(e); }
    };

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
            <div className="min-h-screen bg-arduino-base flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-arduino-teal border-t-transparent rounded-full animate-spin" />
                    <p className="text-arduino-text-secondary animate-pulse">Đang tải bài học...</p>
                </div>
            </div>
        );
    }

    if (!lesson) {
        return (
            <div className="min-h-screen bg-arduino-base flex items-center justify-center">
                <Card className="text-center p-8 border-dashed">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="w-8 h-8 text-red-400" />
                    </div>
                    <p className="text-arduino-text-secondary mb-4">Không tìm thấy bài giảng.</p>
                    <Link to="/dashboard" className="text-arduino-teal hover:underline font-medium">
                        ← Quay lại Dashboard
                    </Link>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-arduino-base text-gray-800 font-sans">
            {/* Reading Progress Bar */}
            <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-[60]">
                <div
                    className="h-full bg-arduino-teal transition-all duration-150"
                    style={{ width: `${readingProgress}%` }}
                />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <Link
                                to={week ? `/weeks/${week.id}` : '/dashboard'}
                                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-arduino-teal transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <div className="flex items-center gap-2 text-xs">
                                    <Badge variant="mint" className="py-0 h-5">Tuần {week?.weekNumber || '?'}</Badge>
                                    <span className="text-gray-300">•</span>
                                    <span className="text-gray-500 font-medium">Bài {lesson.orderIndex}</span>
                                </div>
                                <h1 className="text-lg font-bold text-gray-900 truncate max-w-[200px] sm:max-w-md">
                                    {lesson.title}
                                </h1>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleSave}
                                className={`rounded-full ${isSaved ? 'text-arduino-teal bg-arduino-teal/10' : 'text-gray-400 hover:text-arduino-teal hover:bg-gray-50'}`}
                            >
                                <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                            </Button>
                            {lesson.duration && (
                                <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                                    <Clock className="w-4 h-4" />
                                    {lesson.duration} phút
                                </div>
                            )}
                            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                                <Eye className="w-4 h-4" />
                                {readingProgress}%
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Lesson Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                {/* Feature Banner */}
                <div className="mb-8 p-4 bg-gradient-to-r from-arduino-mint/30 to-white rounded-2xl border border-arduino-mint/50 flex items-center gap-4 shadow-sm">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm text-arduino-teal">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-gray-900 font-semibold text-sm md:text-base">AI Tutor sẵn sàng hỗ trợ</h2>
                        <p className="text-xs md:text-sm text-gray-500">Bôi đen văn bản để hỏi AI hoặc click nút chat ở góc phải</p>
                    </div>
                </div>

                <article className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-h1:text-arduino-teal prose-a:text-arduino-teal prose-img:rounded-xl prose-img:shadow-md">
                    {/* Content Card */}
                    <Card className="p-8 md:p-12 shadow-md">
                        <MarkdownRenderer content={lesson.content} />
                    </Card>
                </article>

                {/* Completion Section */}
                <Card className="mt-12 p-8 bg-gradient-to-br from-white to-gray-50 border-gray-100">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="text-center sm:text-left">
                            <h3 className="text-gray-900 font-bold text-lg mb-1">
                                {completed ? '🎉 Tuyệt vời! Bạn đã hoàn thành bài học!' : 'Hoàn thành bài học?'}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {completed ? 'Tiếp tục sang bài tiếp theo hoặc ôn lại nội dung.' : 'Đánh dấu khi bạn đã hiểu nội dung bài học.'}
                            </p>
                        </div>

                        <Button
                            onClick={handleMarkComplete}
                            disabled={completed}
                            size="lg"
                            className={completed ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-100 shadow-none cursor-default" : "bg-arduino-teal hover:bg-teal-600 shadow-lg shadow-arduino-teal/20"}
                        >
                            {completed ? (
                                <>
                                    <CheckCircle2 className="w-5 h-5 mr-2" />
                                    Đã hoàn thành
                                </>
                            ) : (
                                <>
                                    <BookOpen className="w-5 h-5 mr-2" />
                                    Đánh dấu hoàn thành
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between border-t border-gray-100 mt-8 pt-8">
                        {siblings.prev ? (
                            <Link to={`/lessons/${siblings.prev}`}>
                                <Button variant="ghost" className="text-gray-500 hover:text-arduino-teal">
                                    <ChevronLeft className="w-5 h-5 mr-1" />
                                    Bài trước
                                </Button>
                            </Link>
                        ) : (
                            <Link to={week ? `/weeks/${week.id}` : '/dashboard'}>
                                <Button variant="ghost" className="text-gray-500 hover:text-arduino-teal">
                                    <ChevronLeft className="w-5 h-5 mr-1" />
                                    Về tuần học
                                </Button>
                            </Link>
                        )}

                        <Link to={`/lessons/${siblings.next}`}>
                            <Button className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-arduino-teal shadow-sm">
                                Bài sau
                                <ChevronRight className="w-5 h-5 ml-1" />
                            </Button>
                        </Link>
                    </div>
                </Card>
            </main>
        </div>
    );
}

// Professional Markdown Renderer using react-markdown
function MarkdownRenderer({ content }: { content: string }) {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                // Headings
                h1: ({ children }) => (
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 mt-8 mb-6 pb-4 border-b border-gray-100">
                        {children}
                    </h1>
                ),
                h2: ({ children }) => (
                    <h2 className="text-2xl font-bold text-gray-800 mt-10 mb-4 flex items-center gap-3">
                        <span className="w-1.5 h-8 bg-arduino-teal rounded-full" />
                        {children}
                    </h2>
                ),
                h3: ({ children }) => (
                    <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">{children}</h3>
                ),
                h4: ({ children }) => (
                    <h4 className="text-lg font-semibold text-gray-700 mt-6 mb-2">{children}</h4>
                ),
                // Paragraphs
                p: ({ children }) => (
                    <p className="text-gray-600 my-4 leading-relaxed text-lg">{children}</p>
                ),
                // Lists
                ul: ({ children }) => <ul className="my-6 space-y-2 list-none">{children}</ul>,
                ol: ({ children }) => <ol className="my-6 space-y-2 list-decimal list-outside ml-6 text-gray-600 font-medium">{children}</ol>,
                li: ({ children }) => {
                    // Check if parent is ul (via context if possible, but here we approximate)
                    // For safety, we just style generic li
                    return (
                        <li className="text-gray-600 flex items-start gap-3">
                            <span className="w-1.5 h-1.5 mt-2.5 rounded-full bg-arduino-teal shrink-0" />
                            <span className="flex-1">{children}</span>
                        </li>
                    )
                },
                // Blockquote
                blockquote: ({ children }) => (
                    <blockquote className="my-8 pl-6 border-l-4 border-arduino-teal bg-arduino-mint/10 py-4 pr-6 rounded-r-lg text-gray-700 italic">
                        {children}
                    </blockquote>
                ),
                // Code
                code: ({ className, children }) => {
                    const isInline = !className;
                    if (isInline) {
                        return (
                            <code className="px-1.5 py-0.5 bg-gray-100 rounded-md text-pink-600 text-sm font-mono border border-gray-200">
                                {children}
                            </code>
                        );
                    }
                    const language = className?.replace('language-', '') || 'cpp';
                    return (
                        <div className="my-8 rounded-xl overflow-hidden border border-gray-200 shadow-md">
                            <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                                </div>
                                <span className="text-xs text-gray-500 font-mono font-bold uppercase">{language}</span>
                            </div>
                            <pre className="bg-[#1e1e1e] p-5 overflow-x-auto m-0">
                                <code className="text-sm text-gray-300 font-mono leading-relaxed whitespace-pre">
                                    {children}
                                </code>
                            </pre>
                        </div>
                    );
                },
                pre: ({ children }) => <>{children}</>,
                // Tables (GFM)
                table: ({ children }) => (
                    <div className="my-8 overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
                        <table className="w-full text-sm">{children}</table>
                    </div>
                ),
                thead: ({ children }) => (
                    <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-100">{children}</thead>
                ),
                tbody: ({ children }) => <tbody className="divide-y divide-gray-100 bg-white">{children}</tbody>,
                tr: ({ children }) => <tr className="hover:bg-gray-50/50 transition-colors">{children}</tr>,
                th: ({ children }) => <th className="px-6 py-4 text-left whitespace-nowrap">{children}</th>,
                td: ({ children }) => <td className="px-6 py-4 text-gray-600">{children}</td>,
                // Links
                a: ({ href, children }) => (
                    <a href={href} className="text-arduino-teal hover:text-teal-700 underline underline-offset-2 font-medium transition-colors" target="_blank" rel="noopener noreferrer">
                        {children}
                    </a>
                ),
                // Strong/Bold
                strong: ({ children }) => <strong className="text-gray-900 font-bold">{children}</strong>,
                // Emphasis/Italic
                em: ({ children }) => <em className="text-gray-800 italic">{children}</em>,
                // Horizontal Rule
                hr: () => <hr className="my-8 border-t border-gray-100" />,
            }}
        >
            {content}
        </ReactMarkdown>
    );
}
