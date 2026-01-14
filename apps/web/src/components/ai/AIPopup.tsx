'use client';

// AI Popup Component
// 3 chế độ: tutor, socratic, grader

import { useState, useRef, useEffect } from 'react';
import { X, Send, Copy, Check, Loader2, Bot, Sparkles, GraduationCap, ClipboardCheck } from 'lucide-react';

interface AIPopupProps {
    lessonId?: string;
    labId?: string;
    selectedText?: string;
    currentCode?: string;
    onClose: () => void;
}

type AIMode = 'tutor' | 'socratic' | 'grader';

const MODE_CONFIG: Record<AIMode, { label: string; icon: React.ReactNode; description: string }> = {
    tutor: {
        label: 'Trợ giảng',
        icon: <Bot className="h-4 w-4" />,
        description: 'Giải thích chi tiết, ví dụ code, checklist debug',
    },
    socratic: {
        label: 'Giảng viên',
        icon: <GraduationCap className="h-4 w-4" />,
        description: 'Câu hỏi gợi mở, bài tập nhỏ, hint',
    },
    grader: {
        label: 'Chấm bài',
        icon: <ClipboardCheck className="h-4 w-4" />,
        description: 'Đánh giá code, chỉ lỗi, gợi ý sửa',
    },
};

export default function AIPopup({
    lessonId,
    labId,
    selectedText,
    currentCode,
    onClose
}: AIPopupProps) {
    const [mode, setMode] = useState<AIMode>('tutor');
    const [question, setQuestion] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [remainingQuota, setRemainingQuota] = useState<number | null>(null);

    const inputRef = useRef<HTMLTextAreaElement>(null);
    const responseRef = useRef<HTMLDivElement>(null);

    // Focus input on mount
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // Scroll response into view when updated
    useEffect(() => {
        if (response) {
            responseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [response]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!question.trim()) return;

        setLoading(true);
        setError('');
        setResponse('');

        try {
            const res = await fetch('/api/ai/tutor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    mode,
                    lessonId,
                    labId,
                    userQuestion: question,
                    selectedText,
                    currentCode,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error?.message || 'Có lỗi xảy ra');
                return;
            }

            setResponse(data.response);
            setRemainingQuota(data.remainingQuota);
        } catch (err) {
            setError('Lỗi kết nối server');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(response);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Ignore copy errors
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Popup */}
            <div className="relative w-full max-w-2xl max-h-[90vh] bg-card rounded-t-2xl sm:rounded-2xl border border-border shadow-2xl flex flex-col animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-arduino-teal" />
                        <h2 className="font-semibold">AI Trợ giảng</h2>
                        {remainingQuota !== null && (
                            <span className="text-xs text-muted-foreground">
                                ({remainingQuota} lượt còn lại)
                            </span>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Mode selector */}
                <div className="flex gap-2 px-5 py-3 border-b border-border overflow-x-auto">
                    {(Object.keys(MODE_CONFIG) as AIMode[]).map((m) => (
                        <button
                            key={m}
                            onClick={() => setMode(m)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${mode === m
                                    ? 'bg-arduino-teal text-white'
                                    : 'bg-muted text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            {MODE_CONFIG[m].icon}
                            {MODE_CONFIG[m].label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    {/* Mode description */}
                    <p className="text-sm text-muted-foreground">
                        {MODE_CONFIG[mode].description}
                    </p>

                    {/* Selected text preview */}
                    {selectedText && (
                        <div className="bg-muted rounded-lg p-3 text-sm">
                            <span className="text-muted-foreground">Đoạn text đã chọn:</span>
                            <p className="mt-1 line-clamp-3">{selectedText}</p>
                        </div>
                    )}

                    {/* Question form */}
                    <form onSubmit={handleSubmit}>
                        <div className="relative">
                            <textarea
                                ref={inputRef}
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="Nhập câu hỏi của bạn..."
                                rows={3}
                                className="w-full px-4 py-3 pr-12 rounded-lg border border-input bg-background resize-none
                         focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                            />
                            <button
                                type="submit"
                                disabled={loading || !question.trim()}
                                className="absolute right-2 bottom-2 p-2 rounded-lg bg-arduino-teal text-white 
                         hover:bg-arduino-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <Send className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Error */}
                    {error && (
                        <div className="bg-destructive/10 text-destructive rounded-lg p-3 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Response */}
                    {response && (
                        <div ref={responseRef} className="relative bg-muted rounded-lg p-4">
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <span className="text-sm font-medium text-arduino-teal">AI ({MODE_CONFIG[mode].label})</span>
                                <button
                                    onClick={handleCopy}
                                    className="p-1.5 rounded hover:bg-background transition-colors"
                                    title="Sao chép"
                                >
                                    {copied ? (
                                        <Check className="h-4 w-4 text-green-500" />
                                    ) : (
                                        <Copy className="h-4 w-4 text-muted-foreground" />
                                    )}
                                </button>
                            </div>
                            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                                {response}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
