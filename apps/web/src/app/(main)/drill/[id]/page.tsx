'use client';

export const runtime = 'edge';

// Exam Drill page với đồng hồ đếm ngược
// Textarea code, wiring description, submit với AI grader

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ChevronLeft, Clock, Send, Loader2, AlertTriangle,
    Play, Pause, RotateCcw, CheckCircle2
} from 'lucide-react';
import dynamic from 'next/dynamic';
import AIPopup from '@/components/ai/AIPopup';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface Drill {
    id: string;
    title: string;
    description: string | null;
    content: string;
    rubric: { items: Array<{ name: string; points: number; description: string }> } | null;
    timeLimit: number; // phút
}

interface Week {
    id: string;
    weekNumber: number;
    title: string;
}

export default function DrillPage() {
    const params = useParams();
    const router = useRouter();
    const drillId = params.id as string;

    const [drill, setDrill] = useState<Drill | null>(null);
    const [week, setWeek] = useState<Week | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [code, setCode] = useState('');
    const [wiring, setWiring] = useState('');
    const [showAI, setShowAI] = useState(false);

    // Timer state
    const [timeRemaining, setTimeRemaining] = useState(0); // seconds
    const [timerRunning, setTimerRunning] = useState(false);
    const [timerStarted, setTimerStarted] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Submit state
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

    // Fetch drill
    useEffect(() => {
        async function fetchDrill() {
            try {
                const res = await fetch(`/api/drills/${drillId}`, { credentials: 'include' });
                if (res.status === 401) {
                    router.push('/login');
                    return;
                }
                if (!res.ok) {
                    setError('Không tìm thấy bài thi');
                    return;
                }
                const data = await res.json();
                setDrill(data.drill);
                setWeek(data.week);
                setTimeRemaining(data.drill.timeLimit * 60);
            } catch {
                setError('Lỗi kết nối server');
            } finally {
                setLoading(false);
            }
        }
        fetchDrill();
    }, [drillId, router]);

    // Timer effect
    useEffect(() => {
        if (timerRunning && timeRemaining > 0) {
            timerRef.current = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev <= 1) {
                        setTimerRunning(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [timerRunning, timeRemaining]);

    const startTimer = () => {
        setTimerStarted(true);
        setTimerRunning(true);
    };

    const pauseTimer = () => {
        setTimerRunning(false);
    };

    const resetTimer = () => {
        setTimerRunning(false);
        setTimeRemaining((drill?.timeLimit || 60) * 60);
        setTimerStarted(false);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSubmit = async () => {
        if (!code.trim()) {
            alert('Vui lòng nhập code');
            return;
        }

        setSubmitting(true);
        try {
            const timeSpentMinutes = drill ? drill.timeLimit - Math.floor(timeRemaining / 60) : 0;

            const res = await fetch(`/api/drills/${drillId}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ code, wiring, timeSpentMinutes }),
            });

            const data = await res.json();

            if (res.ok) {
                setSubmitted(true);
                setResult({ success: true, message: data.message });
                setTimerRunning(false);
            } else {
                setResult({ success: false, message: data.error?.message || 'Lỗi nộp bài' });
            }
        } catch {
            setResult({ success: false, message: 'Lỗi kết nối server' });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-arduino-teal" />
            </div>
        );
    }

    if (error || !drill) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-destructive mb-4">{error}</p>
                    <Link href="/dashboard" className="text-arduino-teal hover:underline">
                        ← Quay lại Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    const isTimeLow = timeRemaining < 300; // < 5 phút

    return (
        <div className="min-h-screen bg-background">
            {/* Header với Timer */}
            <header className="sticky top-0 z-50 bg-card/90 backdrop-blur-md border-b border-border">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={`/week/${week?.id}`} className="text-muted-foreground hover:text-foreground">
                            <ChevronLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <p className="text-xs text-muted-foreground">Tuần {week?.weekNumber}</p>
                            <h1 className="font-semibold line-clamp-1">{drill.title}</h1>
                        </div>
                    </div>

                    {/* Timer */}
                    <div className={`flex items-center gap-3 px-4 py-2 rounded-lg ${isTimeLow ? 'bg-destructive/10 text-destructive' : 'bg-muted'
                        }`}>
                        <Clock className="h-5 w-5" />
                        <span className={`font-mono text-2xl font-bold ${isTimeLow ? 'animate-pulse' : ''}`}>
                            {formatTime(timeRemaining)}
                        </span>
                        <div className="flex gap-1">
                            {!timerStarted ? (
                                <button onClick={startTimer} className="p-1 hover:bg-background rounded">
                                    <Play className="h-4 w-4" />
                                </button>
                            ) : timerRunning ? (
                                <button onClick={pauseTimer} className="p-1 hover:bg-background rounded">
                                    <Pause className="h-4 w-4" />
                                </button>
                            ) : (
                                <button onClick={startTimer} className="p-1 hover:bg-background rounded">
                                    <Play className="h-4 w-4" />
                                </button>
                            )}
                            <button onClick={resetTimer} className="p-1 hover:bg-background rounded">
                                <RotateCcw className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Time warning */}
            {timeRemaining === 0 && (
                <div className="bg-destructive text-white px-4 py-3 flex items-center justify-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    <span>Hết thời gian! Hãy nộp bài ngay.</span>
                </div>
            )}

            {/* Main */}
            <main className="container mx-auto px-4 py-6">
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Left - Đề bài */}
                    <div className="space-y-4">
                        <div className="bg-card rounded-lg border border-border p-6">
                            <h2 className="font-semibold text-lg mb-4">📝 Đề bài</h2>
                            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                                {drill.content}
                            </div>
                        </div>

                        {/* Rubric */}
                        {drill.rubric && (
                            <div className="bg-card rounded-lg border border-border p-6">
                                <h3 className="font-semibold mb-3">📊 Tiêu chí chấm điểm</h3>
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-border">
                                            <th className="text-left py-2">Tiêu chí</th>
                                            <th className="text-right py-2">Điểm</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {drill.rubric.items?.map((item, i) => (
                                            <tr key={i} className="border-b border-border/50">
                                                <td className="py-2">
                                                    <p className="font-medium">{item.name}</p>
                                                    <p className="text-muted-foreground text-xs">{item.description}</p>
                                                </td>
                                                <td className="text-right py-2">{item.points}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Right - Code editor */}
                    <div className="space-y-4">
                        {/* Wiring description */}
                        <div className="bg-card rounded-lg border border-border p-4">
                            <label className="block text-sm font-medium mb-2">
                                🔌 Mô tả đấu nối (wiring)
                            </label>
                            <textarea
                                value={wiring}
                                onChange={(e) => setWiring(e.target.value)}
                                placeholder="Ví dụ: LED nối pin 13 qua R220Ω → GND..."
                                rows={3}
                                disabled={submitted}
                                className="w-full px-3 py-2 rounded-lg border border-input bg-background resize-none
                         focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>

                        {/* Code editor */}
                        <div className="bg-card rounded-lg border border-border overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-2 bg-muted border-b border-border">
                                <span className="text-sm font-medium">💻 Code Arduino</span>
                                <button
                                    onClick={() => setShowAI(true)}
                                    className="text-xs bg-arduino-teal/10 text-arduino-teal px-2 py-1 rounded hover:bg-arduino-teal/20"
                                >
                                    🤖 Hỏi AI
                                </button>
                            </div>
                            <div className="h-[400px]">
                                <MonacoEditor
                                    height="100%"
                                    language="cpp"
                                    theme="vs-dark"
                                    value={code}
                                    onChange={(val) => setCode(val || '')}
                                    options={{
                                        fontSize: 14,
                                        minimap: { enabled: false },
                                        readOnly: submitted,
                                    }}
                                />
                            </div>
                        </div>

                        {/* Submit button */}
                        {!submitted ? (
                            <button
                                onClick={handleSubmit}
                                disabled={submitting || !code.trim()}
                                className="w-full flex items-center justify-center gap-2 bg-arduino-teal text-white py-3 rounded-lg
                         hover:bg-arduino-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Đang nộp...
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-5 w-5" />
                                        Nộp bài
                                    </>
                                )}
                            </button>
                        ) : (
                            <div className={`flex items-center gap-3 p-4 rounded-lg ${result?.success ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                : 'bg-destructive/10 text-destructive'
                                }`}>
                                <CheckCircle2 className="h-6 w-6" />
                                <p>{result?.message}</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* AI Popup */}
            {showAI && (
                <AIPopup
                    labId={drillId}
                    currentCode={code}
                    onClose={() => setShowAI(false)}
                />
            )}
        </div>
    );
}
