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
    Maximize2
} from 'lucide-react';
import AiChatPopup from '../components/AiChatPopup';

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

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-400 animate-pulse">Đang tải bài thực hành...</p>
                </div>
            </div>
        );
    }

    if (!lab) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-center bg-slate-800/50 p-8 rounded-2xl border border-slate-700">
                    <p className="text-slate-400 mb-4">Không tìm thấy bài thực hành.</p>
                    <Link to="/dashboard" className="text-teal-400 hover:underline">
                        ← Quay lại Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-slate-950 flex flex-col overflow-hidden">
            {/* Header */}
            <header className="shrink-0 bg-slate-900 border-b border-slate-800">
                <div className="flex items-center justify-between h-14 px-4">
                    <div className="flex items-center gap-4">
                        <Link
                            to={week ? `/weeks/${week.id}` : '/dashboard'}
                            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2 text-xs">
                                <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 rounded-full border border-amber-500/20">
                                    Lab {lab.orderIndex}
                                </span>
                                {week && <span className="text-slate-500">• Tuần {week.weekNumber}</span>}
                            </div>
                            <h1 className="text-sm font-bold text-white truncate max-w-[200px] md:max-w-[400px]">
                                {lab.title}
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Save Status Indicator */}
                        {saveStatus === 'saved' && (
                            <span className="text-xs text-green-400 flex items-center gap-1 animate-fadeIn">
                                <CheckCircle2 className="w-3 h-3" /> Đã lưu
                            </span>
                        )}

                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors text-sm border border-slate-700"
                        >
                            <Save className="w-4 h-4" />
                            {isSaving ? 'Đang lưu...' : 'Lưu'}
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-400 hover:to-orange-400 transition-all text-sm font-medium shadow-lg shadow-amber-500/20"
                        >
                            <Send className="w-4 h-4" />
                            Nộp bài
                        </button>
                    </div>
                </div>
            </header>

            {/* Tab Bar */}
            <div className="shrink-0 bg-slate-900/80 border-b border-slate-800">
                <div className="flex gap-1 px-4 py-2">
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
                    <div className="h-full overflow-y-auto p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
                        <div className="max-w-4xl mx-auto space-y-6">
                            {/* Objective Card */}
                            {lab.objective && (
                                <section className="bg-gradient-to-br from-teal-500/10 to-transparent rounded-2xl p-6 border border-teal-500/20">
                                    <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                                        <div className="w-8 h-8 bg-teal-500/20 rounded-lg flex items-center justify-center">
                                            <Zap className="w-5 h-5 text-teal-400" />
                                        </div>
                                        Mục tiêu bài thực hành
                                    </h3>
                                    <p className="text-slate-300 leading-relaxed">{lab.objective}</p>
                                </section>
                            )}

                            {/* Instructions */}
                            <section className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                    <FileCode className="w-5 h-5 text-cyan-400" />
                                    Hướng dẫn chi tiết
                                </h3>
                                <div className="prose prose-invert prose-sm max-w-none">
                                    <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                                        {lab.instructions}
                                    </div>
                                </div>
                            </section>

                            {/* Wiring Diagram */}
                            {lab.wiring && (
                                <section className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                        <AlertCircle className="w-5 h-5 text-yellow-400" />
                                        Sơ đồ kết nối
                                    </h3>
                                    <div className="bg-slate-900 rounded-xl p-4 text-slate-300 text-sm font-mono border border-slate-700 overflow-x-auto">
                                        <pre className="whitespace-pre-wrap">{lab.wiring}</pre>
                                    </div>
                                </section>
                            )}

                            {/* Rubric */}
                            {lab.rubric && lab.rubric.criteria && (
                                <section className="bg-gradient-to-br from-purple-500/10 to-transparent rounded-2xl p-6 border border-purple-500/20">
                                    <h3 className="font-bold text-white mb-5 flex items-center gap-2">
                                        <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                            <MessageSquare className="w-5 h-5 text-purple-400" />
                                        </div>
                                        Tiêu chí chấm điểm
                                        <span className="ml-auto text-sm font-normal text-purple-400">
                                            Tổng: {lab.rubric.total || 0} điểm
                                        </span>
                                    </h3>
                                    <div className="space-y-3">
                                        {lab.rubric.criteria.map((c, i) => (
                                            <div key={i} className="flex items-start gap-4 bg-slate-900/50 rounded-xl p-4 border border-slate-700/50 hover:border-purple-500/30 transition-colors">
                                                <span className="w-12 h-12 shrink-0 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-lg font-bold">
                                                    {c.points}
                                                </span>
                                                <div>
                                                    <p className="font-semibold text-white">{c.name}</p>
                                                    <p className="text-sm text-slate-400 mt-1">{c.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Duration Info */}
                            {lab.duration && (
                                <div className="flex items-center gap-2 text-slate-500 text-sm">
                                    <Clock className="w-4 h-4" />
                                    Thời gian ước tính: <span className="text-slate-300">{lab.duration} phút</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'code' && (
                    <div className="h-full flex flex-col bg-[#1e1e1e]">
                        {/* Code Editor Header */}
                        <div className="shrink-0 flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                </div>
                                <span className="text-sm text-slate-300 font-medium">main.ino</span>
                                <span className="text-xs text-slate-500 px-2 py-0.5 bg-slate-700 rounded">Arduino C++</span>
                            </div>
                            <button className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors">
                                <Maximize2 className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Code Editor */}
                        <div className="flex-1 relative">
                            <textarea
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="absolute inset-0 w-full h-full bg-[#1e1e1e] text-slate-300 font-mono text-sm p-4 resize-none focus:outline-none leading-relaxed"
                                spellCheck={false}
                                placeholder="// Viết code Arduino của bạn ở đây..."
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'simulator' && lab.simulatorUrl && (
                    <div className="h-full p-4 bg-slate-950">
                        <div className="h-full bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
                            <iframe
                                src={lab.simulatorUrl}
                                className="w-full h-full"
                                title="Wokwi Simulator"
                                allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
                                sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
                            />
                        </div>
                    </div>
                )}
            </main>

            {/* AI Tutor Popup with code context */}
            <AiChatPopup labId={lab.id} currentCode={code} />
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
                flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all
                ${active
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }
            `}
        >
            {icon}
            {children}
        </button>
    );
}
