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
    CheckCircle2
} from 'lucide-react';

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
        setIsSaving(true);
        // TODO: Save to API
        await new Promise(resolve => setTimeout(resolve, 500));
        setIsSaving(false);
    };

    const handleSubmit = async () => {
        // TODO: Submit for grading
        alert('Tính năng nộp bài đang được phát triển!');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!lab) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-slate-400 mb-4">Không tìm thấy bài thực hành.</p>
                    <Link to="/dashboard" className="text-teal-400 hover:underline">
                        ← Quay lại Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-700/50">
                <div className="max-w-full mx-auto px-4">
                    <div className="flex items-center justify-between h-14">
                        <div className="flex items-center gap-4">
                            <Link
                                to={week ? `/weeks/${week.id}` : '/dashboard'}
                                className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <p className="text-xs text-slate-400">
                                    {week ? `Tuần ${week.weekNumber} • Lab ${lab.orderIndex}` : 'Thực hành'}
                                </p>
                                <h1 className="text-sm font-semibold text-white truncate max-w-[200px] md:max-w-[400px]">
                                    {lab.title}
                                </h1>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors text-sm"
                            >
                                <Save className="w-4 h-4" />
                                {isSaving ? 'Đang lưu...' : 'Lưu'}
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors text-sm font-medium"
                            >
                                <Send className="w-4 h-4" />
                                Nộp bài
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Tab Bar */}
            <div className="bg-slate-800/50 border-b border-slate-700/50">
                <div className="max-w-full mx-auto px-4">
                    <div className="flex gap-1">
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
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-hidden">
                {activeTab === 'instructions' && (
                    <div className="h-full overflow-y-auto p-6">
                        <div className="max-w-4xl mx-auto space-y-6">
                            {/* Objective */}
                            {lab.objective && (
                                <section className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
                                    <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-teal-400" />
                                        Mục tiêu
                                    </h3>
                                    <p className="text-slate-300">{lab.objective}</p>
                                </section>
                            )}

                            {/* Instructions */}
                            <section className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
                                <h3 className="font-semibold text-white mb-4">Hướng dẫn chi tiết</h3>
                                <div className="prose prose-invert prose-sm max-w-none">
                                    <pre className="whitespace-pre-wrap text-slate-300 text-sm leading-relaxed">
                                        {lab.instructions}
                                    </pre>
                                </div>
                            </section>

                            {/* Wiring */}
                            {lab.wiring && (
                                <section className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
                                    <h3 className="font-semibold text-white mb-4">Sơ đồ kết nối</h3>
                                    <div className="bg-slate-900 rounded-lg p-4 text-slate-300 text-sm font-mono">
                                        {lab.wiring}
                                    </div>
                                </section>
                            )}

                            {/* Rubric */}
                            {lab.rubric && (
                                <section className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
                                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                                        <MessageSquare className="w-5 h-5 text-purple-400" />
                                        Tiêu chí chấm điểm ({lab.rubric.total} điểm)
                                    </h3>
                                    <div className="space-y-3">
                                        {lab.rubric.criteria.map((c, i) => (
                                            <div key={i} className="flex items-start gap-3 bg-slate-900/50 rounded-lg p-3">
                                                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center text-sm font-bold">
                                                    {c.points}
                                                </span>
                                                <div>
                                                    <p className="font-medium text-white">{c.name}</p>
                                                    <p className="text-sm text-slate-400">{c.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Duration */}
                            {lab.duration && (
                                <div className="flex items-center gap-2 text-slate-400 text-sm">
                                    <Clock className="w-4 h-4" />
                                    Thời gian ước tính: {lab.duration} phút
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'code' && (
                    <div className="h-full flex flex-col">
                        {/* Code Editor Area */}
                        <div className="flex-1 p-4">
                            <div className="h-full bg-slate-950 rounded-xl border border-slate-700 overflow-hidden">
                                <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
                                    <span className="text-sm text-slate-400">main.ino</span>
                                    <span className="text-xs text-slate-500">Arduino C++</span>
                                </div>
                                <textarea
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="w-full h-[calc(100%-40px)] bg-slate-950 text-slate-300 font-mono text-sm p-4 resize-none focus:outline-none"
                                    spellCheck={false}
                                    placeholder="// Viết code Arduino của bạn ở đây..."
                                />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'simulator' && lab.simulatorUrl && (
                    <div className="h-full p-4">
                        <div className="h-full bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
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
        flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors
        ${active
                    ? 'border-amber-400 text-amber-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }
      `}
        >
            {icon}
            {children}
        </button>
    );
}
