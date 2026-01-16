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
    Bookmark,
    List,
    X
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { cn } from '../components/ui/Card';

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

interface TOCItem {
    id: string;
    text: string;
    level: number;
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
    const [toc, setToc] = useState<TOCItem[]>([]);
    const [activeSection, setActiveSection] = useState<string>('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Initial Data Fetch
    useEffect(() => {
        if (!isAuthenticated) navigate('/login');
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

                // Use API-provided siblings (calculated on backend)
                if (data.siblings) {
                    setSiblings({
                        prev: data.siblings.prev,
                        next: data.siblings.next
                    });
                }

                // Generate TOC from lesson content
                if (data.lesson) {
                    const headings = data.lesson.content.match(/^#{1,3} (.*)$/gm) || [];
                    const tocItems = headings.map((heading: string, index: number) => {
                        const levelMatch = heading.match(/^#+/);
                        const level = levelMatch ? levelMatch[0].length : 1;
                        const text = heading.replace(/^#+ /, '');
                        const id = `heading-${index}`;
                        return { id, text, level };
                    });
                    setToc(tocItems);
                }
            } catch (error) {
                console.error('Failed to fetch lesson:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchLesson();
    }, [lessonId]);

    const handleSave = async () => {
        setIsSaved(!isSaved);
        // Mock API call
    };

    // Scroll Spy & Progress
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? Math.min(100, Math.round((scrollTop / docHeight) * 100)) : 0;
            setReadingProgress(progress);

            // Active Section
            const headings = document.querySelectorAll('h1, h2, h3');
            let current = '';
            headings.forEach((h) => {
                const top = h.getBoundingClientRect().top;
                if (top < 150) current = h.id;
            });
            setActiveSection(current);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleMarkComplete = async () => {
        if (!lesson || completed) return;
        setCompleted(true);
        // Real app would fetch API here
    };

    if (loading) return <LessonSkeleton />;
    if (!lesson) return <LessonNotFound />;

    return (
        <div className="min-h-screen bg-arduino-base text-gray-800 font-sans">
            {/* Progress Bar */}
            <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-[60]">
                <div className="h-full bg-arduino-teal transition-all duration-150" style={{ width: `${readingProgress}%` }} />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <Link to={week ? `/weeks/${week.id}` : '/dashboard'} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-arduino-teal transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <div className="hidden md:block">
                                <h1 className="text-lg font-bold text-gray-900 truncate max-w-md">{lesson.title}</h1>
                            </div>
                            {/* Mobile Title */}
                            <div className="md:hidden">
                                <span className="text-sm font-bold text-gray-900">Bài {lesson.orderIndex}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                {mobileMenuOpen ? <X className="w-5 h-5" /> : <List className="w-5 h-5" />}
                            </Button>

                            <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                                <Clock className="w-4 h-4" />
                                {lesson.duration || 15} phút
                            </div>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleSave}
                                className={`rounded-full ${isSaved ? 'text-arduino-teal bg-arduino-teal/10' : 'text-gray-400 hover:text-arduino-teal hover:bg-gray-50'}`}
                            >
                                <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                            </Button>

                            <Button
                                onClick={handleMarkComplete}
                                disabled={completed}
                                className={cn("hidden sm:flex", completed ? "bg-green-100 text-green-700 hover:bg-green-100 shadow-none border-green-200" : "bg-arduino-teal shadow-arduino-teal/20")}
                            >
                                {completed ? <CheckCircle2 className="w-5 h-5 mr-2" /> : <BookOpen className="w-5 h-5 mr-2" />}
                                {completed ? "Đã xong" : "Hoàn thành"}
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8 relative">

                {/* TOC Sidebar (Desktop) */}
                <aside className="hidden lg:block w-64 shrink-0 fixed top-24 bottom-8 overflow-y-auto pr-2 scrollbar-hide">
                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Mục lục</h3>
                        <nav className="space-y-1">
                            {toc.map((item) => (
                                <a
                                    key={item.id}
                                    href={`#${item.id}`}
                                    className={cn(
                                        "block text-sm py-2 px-3 rounded-lg transition-all border-l-2",
                                        activeSection === item.id
                                            ? "bg-arduino-mint/30 text-arduino-teal border-arduino-teal font-medium pl-3"
                                            : "text-gray-500 hover:bg-gray-50 border-transparent hover:text-gray-900"
                                    )}
                                    style={{ marginLeft: `${(item.level - 1) * 8}px` }}
                                >
                                    {item.text}
                                </a>
                            ))}
                        </nav>
                    </div>
                </aside>

                {/* Spacer for fixed sidebar */}
                <div className="hidden lg:block w-64 shrink-0" />

                {/* Main Content */}
                <main className="flex-1 min-w-0">
                    {/* Feature Banner */}
                    <div className="mb-8 p-4 bg-gradient-to-r from-arduino-mint/30 to-white rounded-2xl border border-arduino-mint/50 flex items-center gap-4 shadow-sm animate-fade-in">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm text-arduino-teal">
                            <Sparkles className="w-5 h-5 animate-pulse-soft" />
                        </div>
                        <div>
                            <h2 className="text-gray-900 font-semibold text-sm md:text-base">AI Tutor sẵn sàng hỗ trợ</h2>
                            <p className="text-xs md:text-sm text-gray-500">Bôi đen văn bản để hỏi hoặc đặt câu hỏi bất kỳ.</p>
                        </div>
                    </div>

                    <article className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:scroll-mt-24 prose-h1:text-arduino-teal prose-a:text-arduino-teal prose-img:rounded-2xl prose-img:shadow-lg">
                        <Card className="p-6 md:p-12 shadow-card border-none bg-white">
                            {/* Inject IDs into headings manually via MarkdownRenderer would be complex, 
                                 so we use a custom renderer that adds IDs based on text content matching TOC */}
                            <MarkdownRenderer content={lesson.content} toc={toc} />
                        </Card>
                    </article>

                    {/* Completion Mobile Actions */}
                    <div className="mt-8 lg:hidden flex flex-col gap-4">
                        <Button
                            onClick={handleMarkComplete}
                            disabled={completed}
                            size="lg"
                            className={cn("w-full", completed ? "bg-green-100 text-green-700" : "bg-arduino-teal")}
                        >
                            {completed ? "Đã hoàn thành bài học" : "Đánh dấu hoàn thành"}
                        </Button>
                    </div>

                    {/* Navigation Footer */}
                    <div className="grid grid-cols-2 gap-4 mt-8">
                        {siblings.prev ? (
                            <Link to={`/lessons/${siblings.prev}`}>
                                <Button variant="secondary" className="w-full h-14 justify-start bg-white hover:bg-gray-50 border-gray-200">
                                    <div className="text-left">
                                        <div className="text-xs text-gray-400 font-normal mb-0.5">Bài trước</div>
                                        <div className="flex items-center font-bold text-gray-700"><ChevronLeft className="w-4 h-4 mr-1" /> Quay lại</div>
                                    </div>
                                </Button>
                            </Link>
                        ) : <div />}

                        <Link to={`/lessons/${siblings.next}`}>
                            <Button className="w-full h-14 justify-end bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-arduino-teal shadow-soft">
                                <div className="text-right">
                                    <div className="text-xs text-gray-400 font-normal mb-0.5">Bài tiếp theo</div>
                                    <div className="flex items-center font-bold">Tiếp tục <ChevronRight className="w-4 h-4 ml-1" /></div>
                                </div>
                            </Button>
                        </Link>
                    </div>
                </main>
            </div>

            {/* Mobile TOC Drawer */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-[60] lg:hidden">
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
                    <div className="absolute right-0 top-0 bottom-0 w-3/4 max-w-xs bg-white shadow-2xl p-6 overflow-y-auto animate-slide-left">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-lg text-gray-900">Mục lục bài học</h3>
                            <button onClick={() => setMobileMenuOpen(false)}><X className="w-6 h-6 text-gray-500" /></button>
                        </div>
                        <nav className="space-y-2">
                            {toc.map((item) => (
                                <a
                                    key={item.id}
                                    href={`#${item.id}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block p-3 rounded-xl bg-gray-50 text-gray-700 font-medium text-sm active:bg-arduino-mint"
                                >
                                    {item.text}
                                </a>
                            ))}
                        </nav>
                    </div>
                </div>
            )}
        </div>
    );
}

function LessonSkeleton() {
    return (
        <div className="min-h-screen bg-arduino-base flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 text-arduino-teal animate-spin" />
                <p className="text-gray-400 font-medium">Đang tải bài học...</p>
            </div>
        </div>
    );
}

function LessonNotFound() {
    return (
        <div className="min-h-screen bg-arduino-base flex items-center justify-center p-4">
            <Card className="text-center p-8 border-dashed max-w-md w-full">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Không tìm thấy bài học</h3>
                <p className="text-gray-500 mb-6">Bài học này có thể chưa được xuất bản hoặc không tồn tại.</p>
                <Link to="/dashboard">
                    <Button>Về trang chủ</Button>
                </Link>
            </Card>
        </div>
    );
}

// Markdown Renderer with TOC ID injection
function MarkdownRenderer({ content, toc }: { content: string, toc: TOCItem[] }) {
    // Helper to find ID for a heading content
    const getId = (text: string) => {
        const item = toc.find(t => t.text.trim() === text.trim());
        return item ? item.id : undefined;
    };

    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                h1: ({ children }) => {
                    const text = String(children);
                    return <h1 id={getId(text)} className="text-3xl md:text-4xl font-black text-gray-900 mt-8 mb-6 pb-4 border-b border-gray-100">{children}</h1>;
                },
                h2: ({ children }) => {
                    const text = String(children);
                    return (
                        <h2 id={getId(text)} className="text-2xl font-bold text-gray-800 mt-12 mb-4 flex items-center gap-3 group">
                            <span className="w-1.5 h-8 bg-arduino-teal rounded-full group-hover:scale-y-110 transition-transform" />
                            {children}
                        </h2>
                    );
                },
                h3: ({ children }) => {
                    const text = String(children);
                    return <h3 id={getId(text)} className="text-xl font-bold text-gray-800 mt-8 mb-3">{children}</h3>;
                },
                p: ({ children }) => (
                    <p className="text-gray-600 my-4 leading-relaxed text-lg">{children}</p>
                ),
                ul: ({ children }) => <ul className="my-6 space-y-2 list-none">{children}</ul>,
                li: ({ children }) => (
                    <li className="text-gray-600 flex items-start gap-3">
                        <span className="w-1.5 h-1.5 mt-2.5 rounded-full bg-arduino-teal shrink-0" />
                        <span className="flex-1">{children}</span>
                    </li>
                ),
                // Table Styling
                table: ({ children }) => (
                    <div className="overflow-x-auto my-8 rounded-xl border border-gray-200 shadow-sm">
                        <table className="w-full text-left border-collapse bg-white">
                            {children}
                        </table>
                    </div>
                ),
                thead: ({ children }) => <thead className="bg-gray-50 border-b border-gray-200">{children}</thead>,
                th: ({ children }) => (
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        {children}
                    </th>
                ),
                tr: ({ children }) => <tr className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">{children}</tr>,
                td: ({ children }) => <td className="px-6 py-4 text-sm text-gray-600 leading-relaxed">{children}</td>,

                // Code & Mermaid
                code: ({ className, children }) => {
                    const isInline = !className;
                    if (isInline) {
                        return <code className="px-1.5 py-0.5 bg-gray-100 rounded-md text-pink-600 text-sm font-mono border border-gray-200">{children}</code>;
                    }
                    const language = className?.replace('language-', '') || 'text';

                    // Mermaid Diagram Support
                    if (language === 'mermaid') {
                        return <MermaidDiagram code={String(children)} />;
                    }

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
                                <code className="text-sm text-gray-300 font-mono leading-relaxed whitespace-pre">{children}</code>
                            </pre>
                        </div>
                    );
                },
                blockquote: ({ children }) => (
                    <blockquote className="my-8 pl-6 border-l-4 border-arduino-teal bg-arduino-mint/10 py-4 pr-6 rounded-r-lg text-gray-700 italic">
                        {children}
                    </blockquote>
                ),
                img: ({ src, alt }) => (
                    <img src={src} alt={alt} className="rounded-2xl shadow-lg border border-gray-100 my-8 w-full object-cover" loading="lazy" />
                )
            }}
        >
            {content}
        </ReactMarkdown>
    );
}

function Loader2({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    );
}

function MermaidDiagram({ code }: { code: string }) {
    const [svg, setSvg] = useState('');
    const [error, setError] = useState(false);
    // Unique ID for this diagram
    const [id] = useState(`mermaid-${Math.random().toString(36).substr(2, 9)}`);

    useEffect(() => {
        const renderDiagram = async () => {
            try {
                // @ts-ignore
                if (!window.mermaid) {
                    // Load script if not present
                    const script = document.createElement('script');
                    script.src = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js';
                    script.onload = () => initMermaid();
                    document.head.appendChild(script);
                } else {
                    initMermaid();
                }
            } catch (e) {
                console.error('Mermaid load error:', e);
                setError(true);
            }
        };

        const initMermaid = async () => {
            try {
                // @ts-ignore
                window.mermaid.initialize({ startOnLoad: false, theme: 'default', securityLevel: 'loose' });
                // @ts-ignore
                const { svg } = await window.mermaid.render(id, code);
                setSvg(svg);
            } catch (e) {
                console.error('Mermaid render error:', e);
                setError(true);
            }
        };

        renderDiagram();
    }, [code, id]);

    if (error) {
        return (
            <div className="my-8 p-4 bg-red-50 border border-red-100 rounded-xl text-xs font-mono text-red-600 overflow-auto">
                <div className="font-bold mb-2">Mermaid Render Error:</div>
                {code}
            </div>
        );
    }

    if (!svg) {
        return (
            <div className="my-8 flex justify-center py-12 bg-gray-50 rounded-xl border border-gray-100 animate-pulse">
                <Loader2 className="w-6 h-6 text-gray-300 animate-spin" />
            </div>
        );
    }

    return (
        <div className="my-8 flex justify-center bg-white p-6 rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
            <div dangerouslySetInnerHTML={{ __html: svg }} />
        </div>
    );
}
