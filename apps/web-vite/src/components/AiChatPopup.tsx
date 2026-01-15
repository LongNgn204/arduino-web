import { useState } from 'react';
import {
    MessageSquare,
    X,
    Send,
    Sparkles,
    GraduationCap,
    ClipboardCheck,
    Loader2,
    ChevronDown
} from 'lucide-react';

const API_BASE = import.meta.env.PROD
    ? 'https://arduino-workers.stu725114073.workers.dev'
    : '';

type AiMode = 'tutor' | 'socratic' | 'grader';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface AiChatPopupProps {
    lessonId?: string;
    labId?: string;
    currentCode?: string;
}

export default function AiChatPopup({ lessonId, labId, currentCode }: AiChatPopupProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<AiMode>('tutor');
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showModeSelect, setShowModeSelect] = useState(false);

    const modeConfig = {
        tutor: {
            label: 'Tutor',
            description: 'Giải thích kiến thức, fix lỗi code',
            icon: <Sparkles className="w-4 h-4" />,
            color: 'teal'
        },
        socratic: {
            label: 'Socratic',
            description: 'Đặt câu hỏi gợi mở tư duy',
            icon: <GraduationCap className="w-4 h-4" />,
            color: 'purple'
        },
        grader: {
            label: 'Grader',
            description: 'Chấm điểm code lab',
            icon: <ClipboardCheck className="w-4 h-4" />,
            color: 'amber'
        }
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const res = await fetch(`${API_BASE}/api/ai/tutor`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    mode,
                    lessonId,
                    labId,
                    userQuestion: userMessage,
                    currentCode,
                }),
            });

            if (!res.ok) {
                throw new Error('AI request failed');
            }

            // Handle streaming response
            const reader = res.body?.getReader();
            const decoder = new TextDecoder();
            let assistantMessage = '';
            let buffer = ''; // Buffer for incomplete lines

            setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    // Append new chunk to buffer
                    buffer += decoder.decode(value, { stream: true });

                    // Split by double newline (SSE separator)
                    const parts = buffer.split('\n\n');

                    // Keep the last part in buffer if incomplete
                    buffer = parts.pop() || '';

                    for (const part of parts) {
                        const lines = part.split('\n');
                        for (const line of lines) {
                            if (line.startsWith('data: ')) {
                                const data = line.slice(6).trim();
                                if (data === '[DONE]' || data === '') continue;

                                try {
                                    const parsed = JSON.parse(data);
                                    // Handle both formats: 
                                    // 1. Backend simplified: {content: "..."}
                                    // 2. OpenRouter pass-through: {choices: [{delta: {content: "..."}}]}
                                    const content = parsed.content || parsed.choices?.[0]?.delta?.content || '';
                                    if (content) {
                                        assistantMessage += content;

                                        setMessages(prev => {
                                            const updated = [...prev];
                                            updated[updated.length - 1] = { role: 'assistant', content: assistantMessage };
                                            return updated;
                                        });
                                    }
                                } catch {
                                    // Ignore parse errors (incomplete JSON)
                                }
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error('AI error:', error);
            const errorMsg = error instanceof Error ? error.message : 'Lỗi không xác định';
            setMessages(prev => [
                ...prev,
                { role: 'assistant', content: `❌ Lỗi: ${errorMsg}\n\nVui lòng thử lại sau hoặc liên hệ admin nếu lỗi tiếp tục.` }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const currentModeConfig = modeConfig[mode];

    return (
        <>
            {/* Floating Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/30 flex items-center justify-center hover:scale-110 transition-transform"
                >
                    <MessageSquare className="w-6 h-6" />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-32px)] h-[500px] max-h-[calc(100vh-100px)] bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-slate-700">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl bg-${currentModeConfig.color}-500/20 text-${currentModeConfig.color}-400 flex items-center justify-center`}>
                                {currentModeConfig.icon}
                            </div>
                            <div>
                                <button
                                    onClick={() => setShowModeSelect(!showModeSelect)}
                                    className="flex items-center gap-1 font-medium text-white hover:text-teal-400 transition-colors"
                                >
                                    AI {currentModeConfig.label}
                                    <ChevronDown className="w-4 h-4" />
                                </button>
                                <p className="text-xs text-slate-400">{currentModeConfig.description}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Mode Selector Dropdown */}
                    {showModeSelect && (
                        <div className="absolute top-16 left-4 right-4 bg-slate-800 rounded-xl border border-slate-700 shadow-lg z-10 overflow-hidden">
                            {(Object.keys(modeConfig) as AiMode[]).map((m) => (
                                <button
                                    key={m}
                                    onClick={() => {
                                        setMode(m);
                                        setShowModeSelect(false);
                                    }}
                                    className={`w-full flex items-center gap-3 p-3 text-left hover:bg-slate-700 transition-colors ${mode === m ? 'bg-slate-700' : ''}`}
                                >
                                    <div className={`w-8 h-8 rounded-lg bg-${modeConfig[m].color}-500/20 text-${modeConfig[m].color}-400 flex items-center justify-center`}>
                                        {modeConfig[m].icon}
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">{modeConfig[m].label}</p>
                                        <p className="text-xs text-slate-400">{modeConfig[m].description}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-center">
                                <div>
                                    <div className="w-16 h-16 rounded-full bg-teal-500/10 text-teal-400 flex items-center justify-center mx-auto mb-4">
                                        <Sparkles className="w-8 h-8" />
                                    </div>
                                    <p className="text-slate-400">
                                        Xin chào! Tôi là AI trợ giảng Arduino.
                                    </p>
                                    <p className="text-sm text-slate-500 mt-1">
                                        Hãy hỏi bất cứ điều gì bạn muốn!
                                    </p>
                                </div>
                            </div>
                        ) : (
                            messages.map((msg, i) => (
                                <div
                                    key={i}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${msg.role === 'user'
                                            ? 'bg-teal-500 text-white rounded-br-sm'
                                            : 'bg-slate-800 text-slate-300 rounded-bl-sm'
                                            }`}
                                    >
                                        <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>
                                    </div>
                                </div>
                            ))
                        )}
                        {isLoading && messages[messages.length - 1]?.role === 'user' && (
                            <div className="flex justify-start">
                                <div className="bg-slate-800 text-slate-400 px-4 py-2 rounded-2xl rounded-bl-sm">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-slate-700">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Nhập câu hỏi của bạn..."
                                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                className="w-10 h-10 rounded-xl bg-teal-500 text-white flex items-center justify-center hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
