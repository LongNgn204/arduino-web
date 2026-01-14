'use client';

// Trang chi tiết bài lab
// Code editor (Monaco) + Tab Simulator (Wokwi embed)

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
    ChevronLeft, Clock, Loader2, Bot, Play, Code2,
    RotateCcw, Save, CheckCircle2
} from 'lucide-react';
import { remark } from 'remark';
import html from 'remark-html';
import AIPopup from '@/components/ai/AIPopup';

// Lazy load Monaco Editor (heavy component)
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
    ssr: false,
    loading: () => (
        <div className="h-full flex items-center justify-center bg-gray-900">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
    ),
});

interface Lab {
    id: string;
    title: string;
    objective: string | null;
    instructions: string;
    wiring: string | null;
    starterCode: string | null;
    simulatorUrl: string | null;
    duration: number | null;
    rubric: { criteria: Array<{ name: string; points: number; description: string }>; total: number } | null;
}

interface Week {
    id: string;
    weekNumber: number;
    title: string;
}

export default function LabPage() {
    const params = useParams();
    const labId = params.id as string;

    const [lab, setLab] = useState<Lab | null>(null);
    const [week, setWeek] = useState<Week | null>(null);
    const [instructionsHtml, setInstructionsHtml] = useState('');
    const [loading, setLoading] = useState(true);

    const [activeTab, setActiveTab] = useState<'code' | 'simulator'>('code');
    const [code, setCode] = useState('');
    const [showAI, setShowAI] = useState(false);

    // LocalStorage key cho autosave
    const storageKey = `lab-code-${labId}`;

    useEffect(() => {
        async function fetchLab() {
            try {
                const res = await fetch(`/api/labs/${labId}`, { credentials: 'include' });
                const data = await res.json();
                setLab(data.lab);
                setWeek(data.week);

                // Load saved code hoặc starter code
                const savedCode = localStorage.getItem(storageKey);
                const initialCode = savedCode || data.lab?.starterCode || '';
                setCode(initialCode);

                // Render instructions markdown
                if (data.lab?.instructions) {
                    const result = await remark().use(html).process(data.lab.instructions);
                    setInstructionsHtml(result.toString());
                }
            } catch (error) {
                console.error('Failed to fetch lab:', error);
            } finally {
                setLoading(false);
            }
        }

        if (labId) {
            fetchLab();
        }
    }, [labId, storageKey]);

    // Autosave code to localStorage
    useEffect(() => {
        if (code && labId) {
            localStorage.setItem(storageKey, code);
        }
    }, [code, storageKey, labId]);

    const handleResetCode = () => {
        if (confirm('Khôi phục về code ban đầu? Code hiện tại sẽ bị xóa.')) {
            setCode(lab?.starterCode || '');
            localStorage.removeItem(storageKey);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-arduino-teal" />
            </div>
        );
    }

    if (!lab) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-muted-foreground">Bài lab không tồn tại</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="bg-card border-b border-border">
                <div className="container mx-auto px-6 py-3">
                    <div className="flex items-center justify-between">
                        <div>
                            {week && (
                                <Link
                                    href={`/week/${week.id}`}
                                    className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    Tuần {week.weekNumber}
                                </Link>
                            )}
                            <h1 className="text-lg font-semibold">{lab.title}</h1>
                        </div>

                        <div className="flex items-center gap-3">
                            {lab.duration && (
                                <span className="text-sm text-muted-foreground flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {lab.duration} phút
                                </span>
                            )}
                            <button
                                onClick={() => setShowAI(true)}
                                className="btn-arduino text-sm flex items-center gap-1.5"
                            >
                                <Bot className="h-4 w-4" />
                                Hỏi AI
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main content - split view */}
            <div className="flex-1 flex flex-col lg:flex-row">
                {/* Left: Instructions */}
                <div className="lg:w-1/2 border-b lg:border-b-0 lg:border-r border-border overflow-auto">
                    <div className="p-6">
                        {lab.objective && (
                            <div className="bg-arduino-teal/10 rounded-lg p-4 mb-6">
                                <h3 className="font-medium text-arduino-teal mb-1">Mục tiêu</h3>
                                <p className="text-sm">{lab.objective}</p>
                            </div>
                        )}

                        <article
                            className="prose prose-sm dark:prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: instructionsHtml }}
                        />

                        {/* Rubric */}
                        {lab.rubric && (
                            <div className="mt-8 bg-card rounded-lg border border-border p-4">
                                <h3 className="font-medium mb-3 flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    Tiêu chí chấm điểm ({lab.rubric.total} điểm)
                                </h3>
                                <ul className="space-y-2">
                                    {lab.rubric.criteria.map((c, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm">
                                            <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded text-xs font-medium">
                                                {c.points}đ
                                            </span>
                                            <div>
                                                <strong>{c.name}</strong>
                                                <p className="text-muted-foreground">{c.description}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Editor / Simulator */}
                <div className="lg:w-1/2 flex flex-col">
                    {/* Tabs */}
                    <div className="flex border-b border-border">
                        <button
                            onClick={() => setActiveTab('code')}
                            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors ${activeTab === 'code'
                                    ? 'text-arduino-teal border-b-2 border-arduino-teal'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <Code2 className="h-4 w-4" />
                            Code Editor
                        </button>
                        {lab.simulatorUrl && (
                            <button
                                onClick={() => setActiveTab('simulator')}
                                className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors ${activeTab === 'simulator'
                                        ? 'text-green-600 border-b-2 border-green-600'
                                        : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                <Play className="h-4 w-4" />
                                Simulator
                            </button>
                        )}
                    </div>

                    {/* Tab content */}
                    <div className="flex-1 min-h-[400px]">
                        {activeTab === 'code' ? (
                            <div className="h-full flex flex-col">
                                {/* Editor toolbar */}
                                <div className="flex items-center justify-between px-3 py-2 bg-gray-800 text-gray-300 text-sm">
                                    <span className="flex items-center gap-1.5">
                                        <Save className="h-4 w-4" />
                                        Tự động lưu
                                    </span>
                                    <button
                                        onClick={handleResetCode}
                                        className="flex items-center gap-1 hover:text-white transition-colors"
                                    >
                                        <RotateCcw className="h-4 w-4" />
                                        Khôi phục
                                    </button>
                                </div>

                                {/* Monaco Editor */}
                                <div className="flex-1">
                                    <MonacoEditor
                                        height="100%"
                                        language="cpp"
                                        theme="vs-dark"
                                        value={code}
                                        onChange={(value) => setCode(value || '')}
                                        options={{
                                            minimap: { enabled: false },
                                            fontSize: 14,
                                            lineNumbers: 'on',
                                            scrollBeyondLastLine: false,
                                            automaticLayout: true,
                                        }}
                                    />
                                </div>
                            </div>
                        ) : (
                            <iframe
                                src={lab.simulatorUrl || ''}
                                className="w-full h-full min-h-[500px]"
                                allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; microphone; midi; vr"
                                sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
                                title="Arduino Simulator"
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* AI Popup */}
            {showAI && (
                <AIPopup
                    labId={lab.id}
                    currentCode={code}
                    onClose={() => setShowAI(false)}
                />
            )}
        </div>
    );
}
