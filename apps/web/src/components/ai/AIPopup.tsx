'use client';

// AI Popup Component với SSE Streaming
// 3 chế độ: tutor, socratic, grader
// Hỗ trợ feedback (helpful/not helpful)

import { useState, useRef, useEffect, useCallback } from 'react';
import {
    X, Send, Copy, Check, Loader2, Bot, Sparkles,
    GraduationCap, ClipboardCheck, ThumbsUp, ThumbsDown
} from 'lucide-react';

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
    const [chatLogId, setChatLogId] = useState<string | null>(null);
    const [feedbackSent, setFeedbackSent] = useState(false);

    const inputRef = useRef<HTMLTextAreaElement>(null);
    const responseRef = useRef<HTMLDivElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    // Focus input on mount
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // Auto-scroll khi có response mới
    useEffect(() => {
        if (response && responseRef.current) {
            responseRef.current.scrollTop = responseRef.current.scrollHeight;
        }
    }, [response]);

    // Cleanup abort controller
    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        if (!question.trim() || loading) return;

        // Abort previous request if any
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        setLoading(true);
        setError('');
        setResponse('');
        setChatLogId(null);
        setFeedbackSent(false);

        try {
            const res = await fetch('/api/ai/tutor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                signal: abortControllerRef.current.signal,
                body: JSON.stringify({
                    mode,
                    lessonId,
                    labId,
                    userQuestion: question,
                    selectedText,
                    currentCode,
                    stream: true,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error?.message || 'Có lỗi xảy ra');
                setLoading(false);
                return;
            }

            // Handle SSE stream
            const reader = res.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) {
                setError('Không thể đọc response');
                setLoading(false);
                return;
            }

            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || ''; // Giữ lại phần chưa hoàn chỉnh

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6).trim();
                        if (!data) continue;

                        try {
                            const parsed = JSON.parse(data);

                            if (parsed.done) {
                                // Stream kết thúc
                                setChatLogId(parsed.chatLogId);
                                setRemainingQuota(parsed.remainingQuota);
                                setLoading(false);
                            } else if (parsed.content) {
                                // Thêm content mới
                                setResponse(prev => prev + parsed.content);
                            } else if (parsed.error) {
                                setError(parsed.error.message);
                                setLoading(false);
                            }
                        } catch {
                            // Ignore parse errors
                        }
                    }
                }
            }

        } catch (err) {
            if ((err as Error).name === 'AbortError') {
                // Request was aborted, ignore
                return;
            }
            setError('Lỗi kết nối server');
            setLoading(false);
        }
    }, [question, mode, lessonId, labId, selectedText, currentCode, loading]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(response);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Ignore copy errors
        }
    };

    const handleFeedback = async (helpful: boolean) => {
        if (!chatLogId || feedbackSent) return;

        try {
            await fetch('/api/ai/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ chatLogId, helpful }),
            });
            setFeedbackSent(true);
        } catch {
            // Ignore feedback errors
        }
    };

    const handleStopGeneration = () => {
        abortControllerRef.current?.abort();
        setLoading(false);
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
                            disabled={loading}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors disabled:opacity-50 ${mode === m
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
                <div ref={responseRef} className="flex-1 overflow-y-auto p-5 space-y-4">
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
                                disabled={loading}
                                className="w-full px-4 py-3 pr-12 rounded-lg border border-input bg-background resize-none
                         focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                         disabled:opacity-50"
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

                    {/* Loading indicator */}
                    {loading && !response && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm">AI đang suy nghĩ...</span>
                        </div>
                    )}

                    {/* Response */}
                    {response && (
                        <div className="relative bg-muted rounded-lg p-4">
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <span className="text-sm font-medium text-arduino-teal">
                                    AI ({MODE_CONFIG[mode].label})
                                </span>
                                <div className="flex items-center gap-1">
                                    {loading && (
                                        <button
                                            onClick={handleStopGeneration}
                                            className="px-2 py-1 text-xs bg-destructive/10 text-destructive rounded hover:bg-destructive/20"
                                        >
                                            Dừng
                                        </button>
                                    )}
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
                            </div>

                            {/* Markdown-like rendering */}
                            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                                {response}
                                {loading && <span className="inline-block w-2 h-4 bg-arduino-teal animate-pulse ml-1" />}
                            </div>

                            {/* Feedback buttons */}
                            {!loading && chatLogId && (
                                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/50">
                                    <span className="text-xs text-muted-foreground">Câu trả lời có hữu ích?</span>
                                    {feedbackSent ? (
                                        <span className="text-xs text-green-600">Cảm ơn bạn!</span>
                                    ) : (
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => handleFeedback(true)}
                                                className="p-1.5 rounded hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                                                title="Hữu ích"
                                            >
                                                <ThumbsUp className="h-4 w-4 text-muted-foreground hover:text-green-600" />
                                            </button>
                                            <button
                                                onClick={() => handleFeedback(false)}
                                                className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                                title="Chưa hữu ích"
                                            >
                                                <ThumbsDown className="h-4 w-4 text-muted-foreground hover:text-red-600" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
