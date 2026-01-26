import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import {
    ArrowLeft,
    Play,
    Save,
    Send,
    Clock,
    FileCode,
    MonitorPlay,
    MessageSquare,
    CheckCircle2,
    Zap,
    AlertCircle,
    Wand2,
    Loader2
} from 'lucide-react';
import { Button } from '../components/ui/Button';

const API_BASE = import.meta.env.PROD
    ? 'https://arduino-workers.stu725114073.workers.dev'
    : '';

interface LabDetail {
    id: string;
    weekId: string;
    orderIndex: number;
    title: string;
    objective: string | null;
    instructions: string;
    wiring: string | null;
    starterCode: string | null;
    rubric: { criteria: Array<{ name: string; points: number; description: string }>; total: number } | null;
    simulatorUrl: string | null;
    duration: number | null;
}

interface WeekInfo {
    id: string;
    weekNumber: number;
    title: string;
}

export default function LabPage() {
    const { labId } = useParams<{ labId: string }>();
    const { isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    const [lab, setLab] = useState<LabDetail | null>(null);
    const [week, setWeek] = useState<WeekInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [code, setCode] = useState('');
    const [activeTab, setActiveTab] = useState<'instructions' | 'code' | 'simulator'>('instructions');
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');

    // AI Agent state
    const [isFixing, setIsFixing] = useState(false);
    const [agentResult, setAgentResult] = useState<{
        success: boolean;
        changes: Array<{ line: number; type: string; description: string }>;
        summary: string;
        tips: string[];
    } | null>(null);
    const [showAgentResult, setShowAgentResult] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        async function fetchLab() {
            if (!labId) return;
            try {
                const res = await fetch(`${API_BASE}/api/labs/${labId}`, {
                    credentials: 'include',
                });
                const data = await res.json();
                setLab(data.lab);
                setWeek(data.week);
                setCode(data.lab?.starterCode || '// Viết code của bạn ở đây\n\nvoid setup() {\n  \n}\n\nvoid loop() {\n  \n}');
            } catch (error) {
                console.error('Failed to fetch lab:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchLab();
    }, [labId]);

    const handleSave = async () => {
        if (!lab) return;
        setIsSaving(true);
        setSaveStatus('idle');
        try {
            const res = await fetch(`${API_BASE}/api/labs/${lab.id}/save`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ code, submit: false }),
            });
            if (res.ok) {
                setSaveStatus('saved');
                setTimeout(() => setSaveStatus('idle'), 2000);
            }
        } catch (error) {
            console.error('Failed to save code:', error);
            setSaveStatus('error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSubmit = async () => {
        if (!lab) return;
        setIsSaving(true);
        try {
            const res = await fetch(`${API_BASE}/api/labs/${lab.id}/save`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ code, submit: true }),
            });
            if (res.ok) {
                const data = await res.json();

                // Mark lab as completed in progress
                try {
                    await fetch(`${API_BASE}/api/progress/mark`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({
                            labId: lab.id,
                            status: 'completed'
                        })
                    });
                    console.log('[progress] Lab marked as completed:', lab.id);
                } catch (progressError) {
                    console.error('[progress] Failed to mark lab complete:', progressError);
                }

                alert(data.message || 'Nộp bài thành công!');
            }
        } catch (error) {
            console.error('Failed to submit:', error);
            alert('Có lỗi xảy ra, vui lòng thử lại!');
        } finally {
            setIsSaving(false);
        }
    };

    // AI Agent - Auto fix code
    const handleAutoFix = async () => {
        if (!code.trim() || isFixing) return;

        setIsFixing(true);
        setAgentResult(null);
        setShowAgentResult(false);

        try {
            const res = await fetch(`${API_BASE}/api/ai/agent`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    code,
                    labId: lab?.id,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error?.message || 'Lỗi kết nối');
            }

            const data = await res.json();

            if (data.success && data.fixedCode) {
                // Apply fixed code
                setCode(data.fixedCode);
                setAgentResult({
                    success: true,
                    changes: data.changes || [],
                    summary: data.summary || 'Đã sửa code thành công!',
                    tips: data.tips || [],
                });
            } else {
                setAgentResult({
                    success: false,
                    changes: [],
                    summary: data.summary || 'Không tìm thấy lỗi cần sửa.',
                    tips: data.tips || [],
                });
            }
            setShowAgentResult(true);

            // Auto-hide after 8 seconds
            setTimeout(() => setShowAgentResult(false), 8000);

        } catch (error) {
            console.error('Agent error:', error);
            setAgentResult({
                success: false,
                changes: [],
                summary: error instanceof Error ? error.message : 'Lỗi không xác định',
                tips: ['Vui lòng thử lại sau.'],
            });
            setShowAgentResult(true);
        } finally {
            setIsFixing(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-muted-foreground">Đang tải bài thực hành...</div>;
    }

    if (!lab) {
        return (
            <div className="p-8 text-center bg-background min-h-screen">
                <div className="max-w-md mx-auto p-4 border border-border rounded">
                    <p className="text-muted-foreground mb-4">Không tìm thấy bài thực hành.</p>
                    <Link to="/dashboard" className="text-foreground underline">
                        ← Quay lại Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-background flex flex-col overflow-hidden font-sans text-foreground">
            {/* Header */}
            <header className="shrink-0 bg-background border-b border-border z-10">
                <div className="flex items-center justify-between h-14 px-4">
                    <div className="flex items-center gap-4">
                        <Link
                            to={week ? `/weeks/${week.id}` : '/dashboard'}
                            className="p-2 -ml-2 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="border border-border text-muted-foreground bg-muted px-2 py-0.5 rounded text-xs">
                                    Lab {lab.orderIndex}
                                </span>
                                {week && <span className="text-xs text-muted-foreground">• Tuần {week.weekNumber}</span>}
                            </div>
                            <h1 className="text-sm font-bold truncate max-w-[200px] md:max-w-[400px]">
                                {lab.title}
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Save Status Indicator */}
                        {saveStatus === 'saved' && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1 animate-in fade-in slide-in-from-right-2">
                                <CheckCircle2 className="w-3 h-3 text-green-600" /> Đã lưu
                            </span>
                        )}

                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleSave}
                            disabled={isSaving}
                            className="h-8 gap-2"
                        >
                            <Save className="w-3.5 h-3.5" />
                            {isSaving ? '...' : 'Lưu'}
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            size="sm"
                            className="h-8 gap-2"
                        >
                            <Send className="w-3.5 h-3.5" />
                            Nộp bài
                        </Button>
                    </div>
                </div>
            </header>

            {/* Tab Bar */}
            <div className="shrink-0 bg-background border-b border-border">
                <div className="flex gap-4 px-4">
                    <button
                        onClick={() => setActiveTab('instructions')}
                        className={`flex items-center gap-2 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'instructions' ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <FileCode className="w-4 h-4" /> Hướng dẫn
                    </button>
                    <button
                        onClick={() => setActiveTab('code')}
                        className={`flex items-center gap-2 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'code' ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <Play className="w-4 h-4" /> Code Editor
                    </button>
                    {lab.simulatorUrl && (
                        <button
                            onClick={() => setActiveTab('simulator')}
                            className={`flex items-center gap-2 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'simulator' ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <MonitorPlay className="w-4 h-4" /> Simulator
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content - Full Height */}
            <main className="flex-1 overflow-hidden">
                {activeTab === 'instructions' && (
                    <div className="h-full overflow-y-auto p-6 bg-background">
                        <div className="max-w-4xl mx-auto space-y-6">
                            {/* Objective Card */}
                            {lab.objective && (
                                <section className="border border-border p-6 rounded bg-card">
                                    <h3 className="font-bold mb-3 flex items-center gap-2">
                                        <Zap className="w-4 h-4" />
                                        Mục tiêu bài thực hành
                                    </h3>
                                    <p className="text-muted-foreground">{lab.objective}</p>
                                </section>
                            )}

                            {/* Instructions */}
                            <section className="border border-border p-6 rounded bg-card">
                                <h3 className="font-bold mb-4 flex items-center gap-2">
                                    <FileCode className="w-4 h-4" />
                                    Hướng dẫn chi tiết
                                </h3>
                                <div className="prose prose-sm max-w-none text-muted-foreground">
                                    <div className="whitespace-pre-wrap">
                                        {lab.instructions}
                                    </div>
                                </div>
                            </section>

                            {/* Wiring Diagram */}
                            {lab.wiring && (
                                <section className="border border-border p-6 rounded bg-card">
                                    <h3 className="font-bold mb-4 flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4" />
                                        Sơ đồ kết nối
                                    </h3>
                                    <div className="bg-muted p-4 text-xs font-mono border border-border overflow-x-auto">
                                        <pre className="whitespace-pre-wrap">{lab.wiring}</pre>
                                    </div>
                                </section>
                            )}

                            {/* Rubric */}
                            {lab.rubric && lab.rubric.criteria && (
                                <section className="border border-border p-6 rounded bg-card">
                                    <div className="flex items-center justify-between mb-5">
                                        <h3 className="font-bold flex items-center gap-2">
                                            <MessageSquare className="w-4 h-4" />
                                            Tiêu chí chấm điểm
                                        </h3>
                                        <span className="text-sm border border-border px-2 py-1 rounded bg-muted">
                                            Tổng: {lab.rubric.total || 0} điểm
                                        </span>
                                    </div>
                                    <div className="space-y-3">
                                        {lab.rubric.criteria.map((c, i) => (
                                            <div key={i} className="flex items-start gap-4 p-4 border border-border rounded">
                                                <span className="w-8 h-8 shrink-0 rounded bg-muted flex items-center justify-center text-sm font-bold border border-border">
                                                    {c.points}
                                                </span>
                                                <div>
                                                    <p className="font-semibold">{c.name}</p>
                                                    <p className="text-sm text-muted-foreground mt-1">{c.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Duration Info */}
                            {lab.duration && (
                                <div className="flex items-center gap-2 text-muted-foreground text-sm justify-center pb-4">
                                    <Clock className="w-4 h-4" />
                                    Thời gian ước tính: <span className="font-medium">{lab.duration} phút</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'code' && (
                    <div className="h-full flex flex-col bg-background">
                        {/* Code Editor Header */}
                        <div className="shrink-0 flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium ml-2">main.ino</span>
                                <span className="text-[10px] text-muted-foreground px-2 py-0.5 rounded border border-border">Arduino C++</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {/* AI Agent Button */}
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={handleAutoFix}
                                    disabled={isFixing || !code.trim()}
                                    className="h-8"
                                >
                                    {isFixing ? (
                                        <>
                                            <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
                                            Đang sửa...
                                        </>
                                    ) : (
                                        <>
                                            <Wand2 className="w-3.5 h-3.5 mr-2" />
                                            AI Sửa Code
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* AI Agent Result Panel */}
                        {showAgentResult && agentResult && (
                            <div className={`shrink-0 px-4 py-3 border-b animate-in slide-in-from-top-2 ${agentResult.success ? 'bg-green-50/50 border-green-200 text-green-700' : 'bg-amber-50/50 border-amber-200 text-amber-700'}`}>
                                <div className="flex items-start gap-3">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium flex items-center gap-2">
                                            {agentResult.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                            {agentResult.success ? 'Đã sửa code' : 'Gợi ý từ AI'}
                                        </p>
                                        <p className="text-sm opacity-90 mt-1">{agentResult.summary}</p>
                                        {agentResult.changes.length > 0 && (
                                            <div className="mt-2 space-y-1">
                                                {agentResult.changes.slice(0, 3).map((change, i) => (
                                                    <p key={i} className="text-xs font-mono opacity-80">
                                                        • Dòng {change.line}: {change.description}
                                                    </p>
                                                ))}
                                            </div>
                                        )}
                                        {agentResult.tips.length > 0 && (
                                            <div className="mt-2 text-xs opacity-75">
                                                💡 {agentResult.tips[0]}
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => setShowAgentResult(false)}
                                        className="text-current opacity-50 hover:opacity-100"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Code Editor TextArea */}
                        <div className="flex-1 relative">
                            <textarea
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="absolute inset-0 w-full h-full bg-background text-foreground font-mono text-sm p-4 resize-none focus:outline-none leading-relaxed border-none"
                                spellCheck={false}
                                placeholder="// Viết code Arduino của bạn ở đây..."
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'simulator' && lab.simulatorUrl && (
                    <div className="h-full p-4 bg-muted/10">
                        <div className="h-full bg-background rounded border border-border overflow-hidden flex flex-col">
                            <div className="bg-muted px-4 py-2 border-b border-border flex items-center gap-2">
                                <MonitorPlay className="w-3.5 h-3.5 text-muted-foreground" />
                                <span className="text-xs font-mono text-muted-foreground truncate">{lab.simulatorUrl}</span>
                            </div>
                            <iframe
                                src={lab.simulatorUrl}
                                className="flex-1 w-full h-full"
                                title="Wokwi Simulator"
                                allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
                                sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
                            />
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
