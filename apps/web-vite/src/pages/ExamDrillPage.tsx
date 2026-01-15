
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Clock, Code, AlertTriangle, Send, Expand, Minimize } from 'lucide-react';

const API_BASE = import.meta.env.PROD
    ? 'https://arduino-workers.stu725114073.workers.dev'
    : '';

interface ExamDrill {
    id: string;
    title: string;
    description: string;
    content: string;
    timeLimit: number;
    simulatorUrl?: string;
}

export function ExamDrillPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();

    const [drill, setDrill] = useState<ExamDrill | null>(null);
    const [timeLeft, setTimeLeft] = useState<number>(0); // Seconds
    const [code, setCode] = useState<string>('// Viết code của bạn ở đây...');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [zenMode, setZenMode] = useState(false);

    // Fetch Drill Data
    useEffect(() => {
        async function fetchDrill() {
            try {
                const res = await fetch(`${API_BASE}/api/drills/${id}`, {
                    credentials: 'include',
                });
                if (!res.ok) throw new Error('Failed to load drill');
                const data = await res.json();
                setDrill(data.drill);
                setTimeLeft(data.drill.timeLimit * 60);
            } catch (error) {
                console.error(error);
                alert('Không thể tải bài thi!');
                navigate('/dashboard');
            } finally {
                setLoading(false);
            }
        }
        fetchDrill();
    }, [id, navigate]);

    // Timer Logic
    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit(true); // Auto submit when time runs out
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    // Format Time
    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    // Toggle Zen Mode (Full Screen)
    const toggleZenMode = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setZenMode(true);
        } else {
            document.exitFullscreen();
            setZenMode(false);
        }
    };

    const handleSubmit = async (auto = false) => {
        if (submitting) return;
        if (!auto && !confirm('Bạn có chắc chắn muốn nộp bài? Bạn chỉ được nộp 1 lần duy nhất.')) return;

        setSubmitting(true);
        try {
            const res = await fetch(`${API_BASE}/api/drills/${id}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    code,
                    timeSpentMinutes: drill ? drill.timeLimit - Math.floor(timeLeft / 60) : 0
                }),
            });

            if (res.ok) {
                alert(auto ? 'Hết giờ! Bài làm đã được tự động nộp.' : 'Nộp bài thành công!');
                navigate('/dashboard');
            } else {
                alert('Có lỗi xảy ra khi nộp bài.');
            }
        } catch (error) {
            console.error(error);
            alert('Lỗi kết nối!');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-white">Đang tải đề thi...</div>;
    if (!drill) return <div className="p-8 text-center text-white">Không tìm thấy bài thi.</div>;

    return (
        <div className={`min-h-screen bg-slate-900 text-white flex flex-col ${zenMode ? 'fixed inset-0 z-50' : ''}`}>
            {/* Header Bar */}
            <div className="bg-slate-800 border-b border-indigo-500/30 p-4 flex justify-between items-center shadow-lg">
                <div className="flex items-center gap-4">
                    <div className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full border border-red-500/30 font-bold flex items-center gap-2 animate-pulse">
                        <Clock className="w-4 h-4" />
                        {formatTime(timeLeft)}
                    </div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                        {drill.title}
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleZenMode}
                        className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                        title="Zen Mode"
                    >
                        {zenMode ? <Minimize className="w-5 h-5" /> : <Expand className="w-5 h-5" />}
                    </button>
                    <button
                        onClick={() => handleSubmit(false)}
                        disabled={submitting}
                        className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-semibold shadow-lg shadow-green-500/20 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                    >
                        <Send className="w-4 h-4" />
                        {submitting ? 'Đang nộp...' : 'Nộp Bài'}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left: Problem Statement & Chat */}
                <div className="w-1/3 border-r border-slate-700 bg-slate-900/50 flex flex-col">
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="prose prose-invert max-w-none">
                            <h2 className="text-indigo-300 border-b border-indigo-500/30 pb-2 mb-4">Đề bài</h2>
                            <div dangerouslySetInnerHTML={{ __html: drill.content }} /> {/* In real app, render Markdown */}

                            <div className="mt-8 bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg">
                                <h3 className="text-amber-400 font-bold flex items-center gap-2 text-sm mb-2">
                                    <AlertTriangle className="w-4 h-4" /> Lưu ý quan trọng
                                </h3>
                                <ul className="text-sm text-slate-300 list-disc list-inside space-y-1">
                                    <li>Thời gian làm bài: {drill.timeLimit} phút.</li>
                                    <li>Chỉ được nộp 1 lần duy nhất.</li>
                                    <li>Không chuyển tab (Hệ thống có log focus).</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Code Editor & Simulator */}
                <div className="flex-1 flex flex-col bg-[#1e1e1e]">
                    {/* Wokwi Simulator */}
                    <div className="h-1/2 border-b border-slate-700 bg-slate-950 relative">
                        <iframe
                            src={drill.simulatorUrl || "https://wokwi.com/projects/new/arduino-uno?hex=1"}
                            className="w-full h-full border-0"
                            title="Wokwi Simulator"
                        />
                    </div>

                    {/* Simple Code Editor (Placeholder for Monaco) */}
                    <div className="flex-1 flex flex-col">
                        <div className="bg-[#2d2d2d] px-4 py-2 border-b border-slate-700 flex items-center gap-2 text-sm text-slate-300">
                            <Code className="w-4 h-4" />
                            <span>main.cpp</span>
                        </div>
                        <textarea
                            className="flex-1 bg-[#1e1e1e] text-slate-300 p-4 font-mono resize-none focus:outline-none"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            spellCheck={false}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
