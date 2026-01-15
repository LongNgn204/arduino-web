import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Code, AlertTriangle, Send, Expand, Minimize, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

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
    const { drillId } = useParams();
    const id = drillId;

    const navigate = useNavigate();

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

    if (loading) return (
        <div className="h-screen bg-gray-50 flex items-center justify-center font-sans">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 text-arduino-teal animate-spin" />
                <p className="text-gray-500 animate-pulse">Đang tải đề thi...</p>
            </div>
        </div>
    );

    if (!drill) return (
        <div className="h-screen bg-gray-50 flex items-center justify-center font-sans">
            <div className="text-center text-gray-500">Không tìm thấy bài thi.</div>
        </div>
    );

    return (
        <div className={`min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans ${zenMode ? 'fixed inset-0 z-50 bg-white' : ''}`}>
            {/* Header Bar */}
            <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center shadow-sm z-10">
                <div className="flex items-center gap-6">
                    <Badge variant="outline" className={`font-mono text-lg py-1 px-3 border-red-200 ${timeLeft < 300 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-gray-50 text-gray-700'}`}>
                        <Clock className="w-4 h-4 mr-2" />
                        {formatTime(timeLeft)}
                    </Badge>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">{drill.title}</h1>
                        <p className="text-xs text-gray-500 hidden sm:block">Exam Mode • No Tab Switching</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleZenMode}
                        title="Zen Mode"
                        className="text-gray-400 hover:text-gray-900"
                    >
                        {zenMode ? <Minimize className="w-5 h-5" /> : <Expand className="w-5 h-5" />}
                    </Button>
                    <Button
                        onClick={() => handleSubmit(false)}
                        disabled={submitting}
                        className="bg-green-600 hover:bg-green-700 text-white shadow-md shadow-green-600/20 gap-2"
                    >
                        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        {submitting ? 'Đang nộp...' : 'Nộp Bài'}
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left: Problem Statement & Chat */}
                <div className="w-1/3 border-r border-gray-200 bg-gray-50/50 flex flex-col">
                    <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-200">
                        <div className="prose prose-slate max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-code:text-pink-600 prose-code:bg-pink-50 prose-code:px-1 prose-code:rounded">
                            <h2 className="text-arduino-teal border-b border-gray-200 pb-2 mb-4 font-bold flex items-center gap-2">
                                <Code className="w-5 h-5" /> Đề bài
                            </h2>
                            <div dangerouslySetInnerHTML={{ __html: drill.content }} /> {/* In real app, render Markdown */}

                            <div className="mt-8 bg-amber-50 border border-amber-200 p-4 rounded-xl">
                                <h3 className="text-amber-700 font-bold flex items-center gap-2 text-sm mb-2">
                                    <AlertTriangle className="w-4 h-4" /> Lưu ý quan trọng
                                </h3>
                                <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                                    <li>Thời gian làm bài: <span className="font-semibold">{drill.timeLimit} phút</span>.</li>
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
                    <div className="h-1/2 border-b border-[#333] bg-[#000] relative group">
                        <iframe
                            src={drill.simulatorUrl || "https://wokwi.com/projects/new/arduino-uno?hex=1"}
                            className="w-full h-full border-0"
                            title="Wokwi Simulator"
                        />
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white text-xs px-2 py-1 rounded pointer-events-none">
                            Simulator
                        </div>
                    </div>

                    {/* Simple Code Editor (Placeholder for Monaco) */}
                    <div className="flex-1 flex flex-col">
                        <div className="bg-[#2d2d2d] px-4 py-2 border-b border-[#333] flex items-center gap-2 text-sm text-gray-300">
                            <Code className="w-4 h-4 text-arduino-teal" />
                            <span>main.cpp</span>
                            <span className="text-xs text-gray-500 ml-auto">Arduino C++</span>
                        </div>
                        <textarea
                            className="flex-1 bg-[#1e1e1e] text-gray-300 p-4 font-mono text-sm resize-none focus:outline-none leading-relaxed selection:bg-arduino-teal/30"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            spellCheck={false}
                            placeholder="// Code của bạn ở đây..."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
