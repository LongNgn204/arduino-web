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
    Loader2,
    Sparkles
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

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
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-arduino-teal animate-spin" />
                    <p className="text-gray-500 animate-pulse">Đang tải bài thực hành...</p>
                </div>
            </div>
        );
    }

    if (!lab) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-gray-500 mb-4">Không tìm thấy bài thực hành.</p>
                    <Link to="/dashboard" className="text-arduino-teal hover:underline font-medium">
                        ← Quay lại Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-gray-50 flex flex-col overflow-hidden font-sans">
            {/* Header */}
            <header className="shrink-0 bg-white border-b border-gray-200 shadow-sm z-10">
                <div className="flex items-center justify-between h-16 px-6">
                    <div className="flex items-center gap-4">
                        <Link
                            to={week ? `/weeks/${week.id}` : '/dashboard'}
                            className="p-2 -ml-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2 mb-0.5">
                                <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
                                    Lab {lab.orderIndex}
                                </Badge>
                                {week && <span className="text-xs text-gray-500 font-medium">• Tuần {week.weekNumber}</span>}
                            </div>
                            <h1 className="text-sm font-bold text-gray-900 truncate max-w-[200px] md:max-w-[400px]">
                                {lab.title}
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Save Status Indicator */}
                        {saveStatus === 'saved' && (
                            <span className="text-xs text-green-600 flex items-center gap-1 animate-fade-in font-medium">
                                <CheckCircle2 className="w-3 h-3" /> Đã lưu
                            </span>
                        )}

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleSave}
                            disabled={isSaving}
                            className="gap-2"
                        >
                            <Save className="w-4 h-4" />
                            {isSaving ? 'Đang lưu...' : 'Lưu'}
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            size="sm"
                            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 border-none shadow-md shadow-amber-500/20 gap-2"
                        >
                            <Send className="w-4 h-4" />
                            Nộp bài
                        </Button>
                    </div>
                </div>
            </header>

            {/* Tab Bar */}
            <div className="shrink-0 bg-white border-b border-gray-200">
                <div className="flex gap-1 px-6 py-2">
                    <TabButton
                        active={activeTab === 'instructions'}
                        onClick={() => setActiveTab('instructions')}
                        icon={<FileCode className="w-4 h-4" />}
                    >
                        Hướng dẫn
                    </TabButton>
                    <TabButton
                        active={activeTab === 'code'}
                        onClick={() => setActiveTab('code')}
                        icon={<Play className="w-4 h-4" />}
                    >
                        Code Editor
                    </TabButton>
                    {lab.simulatorUrl && (
                        <TabButton
                            active={activeTab === 'simulator'}
                            onClick={() => setActiveTab('simulator')}
                            icon={<MonitorPlay className="w-4 h-4" />}
                        >
                            Simulator
                        </TabButton>
                    )}
                </div>
            </div>

            {/* Main Content - Full Height */}
            <main className="flex-1 overflow-hidden">
                {activeTab === 'instructions' && (
                    <div className="h-full overflow-y-auto p-6 bg-gray-50">
                        <div className="max-w-4xl mx-auto space-y-6">
                            {/* Objective Card */}
                            {lab.objective && (
                                <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm ring-1 ring-gray-950/5">
                                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <div className="w-8 h-8 bg-arduino-teal/10 rounded-lg flex items-center justify-center">
                                            <Zap className="w-5 h-5 text-arduino-teal" />
                                        </div>
                                        Mục tiêu bài thực hành
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">{lab.objective}</p>
                                </section>
                            )}

                            {/* Instructions */}
                            <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm ring-1 ring-gray-950/5">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <FileCode className="w-5 h-5 text-blue-500" />
                                    Hướng dẫn chi tiết
                                </h3>
                                <div className="prose prose-slate prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-code:text-pink-600 prose-code:bg-pink-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-[#1e1e1e] prose-pre:text-gray-50">
                                    <div className="leading-relaxed whitespace-pre-wrap">
                                        {lab.instructions}
                                    </div>
                                </div>
                            </section>

                            {/* Wiring Diagram */}
                            {lab.wiring && (
                                <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm ring-1 ring-gray-950/5">
                                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <AlertCircle className="w-5 h-5 text-amber-500" />
                                        Sơ đồ kết nối
                                    </h3>
                                    <div className="bg-gray-50 rounded-xl p-4 text-gray-700 text-sm font-mono border border-gray-200 overflow-x-auto shadow-inner">
                                        <pre className="whitespace-pre-wrap">{lab.wiring}</pre>
                                    </div>
                                </section>
                            )}

                            {/* Rubric */}
                            {lab.rubric && lab.rubric.criteria && (
                                <section className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-6 border border-purple-100 shadow-sm">
                                    <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
                                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <MessageSquare className="w-5 h-5 text-purple-600" />
                                        </div>
                                        Tiêu chí chấm điểm
                                        <span className="ml-auto text-sm font-normal text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
                                            Tổng: {lab.rubric.total || 0} điểm
                                        </span>
                                    </h3>
                                    <div className="space-y-3">
                                        {lab.rubric.criteria.map((c, i) => (
                                            <div key={i} className="flex items-start gap-4 bg-white rounded-xl p-4 border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                                                <span className="w-10 h-10 shrink-0 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg font-bold border border-purple-100">
                                                    {c.points}
                                                </span>
                                                <div>
                                                    <p className="font-semibold text-gray-900">{c.name}</p>
                                                    <p className="text-sm text-gray-500 mt-1">{c.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Duration Info */}
                            {lab.duration && (
                                <div className="flex items-center gap-2 text-gray-500 text-sm justify-center pb-4">
                                    <Clock className="w-4 h-4" />
                                    Thời gian ước tính: <span className="text-gray-900 font-medium">{lab.duration} phút</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'code' && (
                    <div className="h-full flex flex-col bg-[#1e1e1e]">
                        {/* Code Editor Header */}
                        <div className="shrink-0 flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-[#1e1e1e]">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
                                    <div className="w-3 h-3 rounded-full bg-red-500" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                </div>
                                <span className="text-sm text-gray-300 font-medium ml-2">main.ino</span>
                                <span className="text-[10px] text-gray-400 px-2 py-0.5 bg-[#3c3c3c] rounded border border-[#4d4d4d]">Arduino C++</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {/* AI Agent Button */}
                                <Button
                                    size="sm"
                                    onClick={handleAutoFix}
                                    disabled={isFixing || !code.trim()}
                                    className="h-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-none shadow-lg shadow-purple-900/20"
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
                            <div className={`shrink-0 px-4 py-3 border-b ${agentResult.success ? 'bg-green-900/20 border-green-500/20' : 'bg-amber-900/20 border-amber-500/20'}`}>
                                <div className="flex items-start gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${agentResult.success ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'}`}>
                                        <Sparkles className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`font-medium ${agentResult.success ? 'text-green-400' : 'text-amber-400'}`}>
                                            {agentResult.success ? '✨ Đã sửa code!' : '⚠️ Kết quả'}
                                        </p>
                                        <p className="text-sm text-gray-300 mt-1">{agentResult.summary}</p>
                                        {agentResult.changes.length > 0 && (
                                            <div className="mt-2 space-y-1">
                                                {agentResult.changes.slice(0, 3).map((change, i) => (
                                                    <p key={i} className="text-xs text-gray-400 font-mono">
                                                        • Dòng {change.line}: {change.description}
                                                    </p>
                                                ))}
                                            </div>
                                        )}
                                        {agentResult.tips.length > 0 && (
                                            <div className="mt-2 text-xs text-gray-500">
                                                💡 {agentResult.tips[0]}
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => setShowAgentResult(false)}
                                        className="text-gray-500 hover:text-white"
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
                                className="absolute inset-0 w-full h-full bg-[#1e1e1e] text-gray-300 font-mono text-sm p-4 resize-none focus:outline-none leading-relaxed selection:bg-arduino-teal/30 placeholder:text-gray-600"
                                spellCheck={false}
                                placeholder="// Viết code Arduino của bạn ở đây..."
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'simulator' && lab.simulatorUrl && (
                    <div className="h-full p-6 bg-gray-100/50">
                        <div className="h-full bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center gap-2">
                                <MonitorPlay className="w-4 h-4 text-gray-500" />
                                <span className="text-xs font-mono text-gray-500 truncate">{lab.simulatorUrl}</span>
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

function TabButton({
    active,
    onClick,
    children,
    icon
}: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
    icon: React.ReactNode;
}) {
    return (
        <button
            onClick={onClick}
            className={`
                flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all relative
                ${active
                    ? 'text-arduino-teal bg-arduino-teal/10 ring-1 ring-arduino-teal/20'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }
            `}
        >
            {icon}
            {children}
        </button>
    );
}
