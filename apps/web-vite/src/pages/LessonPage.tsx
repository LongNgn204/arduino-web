import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import {
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    Clock,
    CheckCircle2,
    BookOpen
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
                <div className="w-10 h-10 border-4 border-teal-400 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!lesson) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-slate-400 mb-4">Không tìm thấy bài giảng.</p>
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
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <Link
                                to={week ? `/weeks/${week.id}` : '/dashboard'}
                                className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <p className="text-xs text-slate-400">
                                    {week ? `Tuần ${week.weekNumber} • Bài ${lesson.orderIndex}` : 'Bài giảng'}
                                </p>
                                <h1 className="text-lg font-semibold text-white truncate max-w-[300px]">
                                    {lesson.title}
                                </h1>
                            </div>
                        </div>

                        {lesson.duration && (
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                <Clock className="w-4 h-4" />
                                {lesson.duration} phút
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Lesson Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <article className="prose prose-invert prose-teal max-w-none">
                    {/* Render Markdown content */}
                    <div className="lesson-content bg-slate-800/30 rounded-2xl p-6 md:p-8 border border-slate-700/50">
                        <MarkdownRenderer content={lesson.content} />
                    </div>
                </article>

                {/* Completion Button */}
                <div className="mt-8 flex items-center justify-between">
                    <button
                        onClick={handleMarkComplete}
                        disabled={completed}
                        className={`
              flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all
              ${completed
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-default'
                                : 'bg-teal-500 text-white hover:bg-teal-600 shadow-lg shadow-teal-500/30'
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

                    {/* Navigation */}
                    <div className="flex items-center gap-2">
                        <button className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
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

// Simple Markdown Renderer Component
function MarkdownRenderer({ content }: { content: string }) {
    // Basic markdown parsing (can be enhanced with a proper library like react-markdown)
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
                    codeLanguage = line.slice(3).trim();
                    codeContent = '';
                } else {
                    inCodeBlock = false;
                    elements.push(
                        <pre key={index} className="bg-slate-900 rounded-lg p-4 overflow-x-auto my-4">
                            <code className={`language-${codeLanguage} text-sm text-slate-300`}>
                                {codeContent}
                            </code>
                        </pre>
                    );
                }
                return;
            }

            if (inCodeBlock) {
                codeContent += line + '\n';
                return;
            }

            // Headers
            if (line.startsWith('# ')) {
                elements.push(
                    <h1 key={index} className="text-2xl font-bold text-white mt-8 mb-4">
                        {line.slice(2)}
                    </h1>
                );
            } else if (line.startsWith('## ')) {
                elements.push(
                    <h2 key={index} className="text-xl font-semibold text-white mt-6 mb-3">
                        {line.slice(3)}
                    </h2>
                );
            } else if (line.startsWith('### ')) {
                elements.push(
                    <h3 key={index} className="text-lg font-medium text-white mt-4 mb-2">
                        {line.slice(4)}
                    </h3>
                );
            }
            // List items
            else if (line.startsWith('- ')) {
                elements.push(
                    <li key={index} className="text-slate-300 ml-4 list-disc">
                        {line.slice(2)}
                    </li>
                );
            }
            // Regular paragraph
            else if (line.trim()) {
                elements.push(
                    <p key={index} className="text-slate-300 my-2 leading-relaxed">
                        {line}
                    </p>
                );
            }
            // Empty line = spacing
            else {
                elements.push(<div key={index} className="h-2" />);
            }
        });

        return elements;
    };

    return <div className="space-y-1">{renderContent()}</div>;
}
