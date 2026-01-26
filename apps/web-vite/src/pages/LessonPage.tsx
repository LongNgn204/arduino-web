import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import MermaidDiagram from '../components/MermaidDiagram';

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
    const [toc, setToc] = useState<TOCItem[]>([]);
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

    // Fetch progress status for this lesson
    useEffect(() => {
        async function fetchProgress() {
            if (!lessonId || !week?.id) return;
            try {
                const res = await fetch(`${API_BASE}/api/progress/week/${week.id}`, {
                    credentials: 'include',
                });
                if (res.ok) {
                    const data = await res.json();
                    // Kiểm tra lesson này đã completed chưa
                    const lessonProgress = data.lessons?.find((l: { id: string; status: string }) => l.id === lessonId);
                    if (lessonProgress?.status === 'completed') {
                        setCompleted(true);
                    }
                }
            } catch (e) {
                console.error('Failed to fetch progress:', e);
            }
        }
        fetchProgress();
    }, [lessonId, week?.id]);

    const handleMarkComplete = async () => {
        if (!lesson || completed) return;

        try {
            const res = await fetch(`${API_BASE}/api/progress/mark`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    lessonId: lesson.id,
                    status: 'completed'
                })
            });

            if (res.ok) {
                setCompleted(true);
                console.log('[progress] Lesson marked as completed:', lesson.id);
            } else {
                console.error('[progress] Failed to mark complete:', await res.text());
            }
        } catch (error) {
            console.error('[progress] API error:', error);
        }
    };

    if (loading) return <div className="p-8 text-center text-muted-foreground">Đang tải bài học...</div>;
    if (!lesson) return <div className="p-8 text-center text-muted-foreground">Không tìm thấy bài học.</div>;

    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-background border-b border-border p-4">
                <div className="max-w-[1200px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to={week ? `/weeks/${week.id}` : '/dashboard'} className="text-muted-foreground hover:text-foreground">
                            &larr; Quay lại
                        </Link>
                        <h1 className="text-lg font-bold truncate max-w-md">{lesson.title}</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden text-sm border border-border px-2 py-1 rounded"
                        >
                            Mục lục
                        </button>
                        <span className="hidden md:inline-block text-sm text-muted-foreground">
                            {lesson.duration || 15} phút
                        </span>
                        <button
                            onClick={handleMarkComplete}
                            disabled={completed}
                            className={`px-4 py-2 rounded text-sm font-medium border border-border ${completed ? "bg-muted text-muted-foreground" : "bg-foreground text-background hover:opacity-90"
                                }`}
                        >
                            {completed ? "Đã xong" : "Hoàn thành"}
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-[1200px] mx-auto px-4 py-8 flex gap-8 relative">

                {/* TOC Sidebar (Desktop) */}
                <aside className="hidden lg:block w-64 shrink-0 fixed top-24 bottom-8 overflow-y-auto pr-2">
                    <div className="p-4 border border-border rounded-lg bg-card">
                        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Mục lục</h3>
                        <nav className="space-y-1">
                            {toc.map((item) => (
                                <a
                                    key={item.id}
                                    href={`#${item.id}`}
                                    className="block text-sm py-1 hover:underline text-muted-foreground hover:text-foreground"
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
                    <article className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:scroll-mt-24 prose-img:border prose-img:border-border prose-img:rounded-lg">
                        <div className="p-6 md:p-12 border border-border rounded-lg bg-card">
                            <MarkdownRenderer content={lesson.content} toc={toc} />
                        </div>
                    </article>

                    {/* Navigation Footer */}
                    <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-border">
                        {siblings.prev ? (
                            <Link to={`/lessons/${siblings.prev}`} className="block p-4 border border-border rounded hover:bg-muted transition-colors text-left">
                                <div className="text-xs text-muted-foreground mb-1">Bài trước</div>
                                <div className="font-bold">&larr; Quay lại</div>
                            </Link>
                        ) : <div />}

                        {siblings.next ? (
                            <Link to={`/lessons/${siblings.next}`} className="block p-4 border border-border rounded hover:bg-muted transition-colors text-right">
                                <div className="text-xs text-muted-foreground mb-1">Bài tiếp theo</div>
                                <div className="font-bold">Tiếp tục &rarr;</div>
                            </Link>
                        ) : <div />}
                    </div>
                </main>
            </div>

            {/* Mobile TOC Drawer */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-[60] lg:hidden">
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
                    <div className="absolute right-0 top-0 bottom-0 w-3/4 max-w-xs bg-background border-l border-border p-6 overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-lg">Mục lục</h3>
                            <button onClick={() => setMobileMenuOpen(false)}>Đóng</button>
                        </div>
                        <nav className="space-y-2">
                            {toc.map((item) => (
                                <a
                                    key={item.id}
                                    href={`#${item.id}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block py-1 text-sm hover:underline"
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

// Custom Copy Button for Code Blocks
const CopyButton = ({ text }: { text: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className="text-xs text-muted-foreground hover:text-foreground border border-border px-2 py-0.5 rounded"
        >
            {copied ? 'Copied' : 'Copy'}
        </button>
    );
};

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
                    return <h1 id={getId(text)} className="text-3xl font-black mt-8 mb-6 pb-4 border-b border-border">{children}</h1>;
                },
                h2: ({ children }) => {
                    const text = String(children);
                    return <h2 id={getId(text)} className="text-2xl font-bold mt-12 mb-4">{children}</h2>;
                },
                h3: ({ children }) => {
                    const text = String(children);
                    return <h3 id={getId(text)} className="text-xl font-bold mt-8 mb-3">{children}</h3>;
                },
                p: ({ children }) => (
                    <p className="my-4 leading-relaxed text-base">{children}</p>
                ),
                ul: ({ children }) => <ul className="my-6 space-y-2 list-disc pl-6">{children}</ul>,
                li: ({ children }) => (
                    <li className="pl-1">{children}</li>
                ),
                // Table Styling
                table: ({ children }) => (
                    <div className="overflow-x-auto my-8 border border-border rounded">
                        <table className="w-full text-left border-collapse">
                            {children}
                        </table>
                    </div>
                ),
                thead: ({ children }) => <thead className="bg-muted border-b border-border">{children}</thead>,
                th: ({ children }) => (
                    <th className="px-4 py-2 text-xs font-bold uppercase tracking-wider whitespace-nowrap">
                        {children}
                    </th>
                ),
                tr: ({ children }) => <tr className="border-b border-border last:border-0 hover:bg-muted/30">{children}</tr>,
                td: ({ children }) => <td className="px-4 py-2 text-sm leading-relaxed">{children}</td>,

                // Code & Mermaid
                code: ({ className, children }) => {
                    const isInline = !className;
                    if (isInline) {
                        return <code className="px-1 py-0.5 bg-muted rounded text-sm font-mono border border-border">{children}</code>;
                    }
                    const language = className?.replace('language-', '') || 'text';
                    const codeText = String(children).replace(/\n$/, '');

                    // Mermaid Diagram Support
                    if (language === 'mermaid') {
                        return <MermaidDiagram code={String(children)} />;
                    }

                    return (
                        <div className="my-8 rounded border border-border overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-2 bg-muted border-b border-border">
                                <span className="text-xs font-mono uppercase">{language}</span>
                                <CopyButton text={codeText} />
                            </div>
                            <pre className="bg-card p-4 overflow-x-auto m-0">
                                <code className="text-sm font-mono leading-relaxed whitespace-pre">{children}</code>
                            </pre>
                        </div>
                    );
                },
                // GitHub Alerts Support
                blockquote: ({ children }) => {
                    return (
                        <blockquote className="my-8 pl-4 border-l-4 border-muted py-2 italic">
                            {children}
                        </blockquote>
                    );
                },
                img: ({ src, alt }) => (
                    <img src={src} alt={alt} className="border border-border rounded my-8 w-full object-cover" loading="lazy" />
                )
            }}
        >
            {content}
        </ReactMarkdown>
    );
}


