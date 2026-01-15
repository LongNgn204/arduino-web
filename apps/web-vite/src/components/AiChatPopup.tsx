import { useState, useRef, useEffect } from 'react';
import {
    MessageSquare,
    X,
    Send,
    Sparkles,
    GraduationCap,
    ClipboardCheck,
    Loader2,
    ChevronDown,
    RefreshCw,
    Trash2
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const API_BASE = import.meta.env.PROD
    ? 'https://arduino-workers.stu725114073.workers.dev'
    : '';

type AiMode = 'tutor' | 'socratic' | 'grader';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp?: Date;
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
    const [remainingQuota, setRemainingQuota] = useState<number | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const modeConfig = {
        tutor: {
            label: 'Tutor',
            description: 'Giải thích kiến thức, fix lỗi code',
            icon: <Sparkles className="w-4 h-4" />,
            color: 'teal',
            bgColor: 'bg-teal-500/20',
            textColor: 'text-teal-400',
            borderColor: 'border-teal-500/30'
        },
        socratic: {
            label: 'Socratic',
            description: 'Đặt câu hỏi gợi mở tư duy',
            icon: <GraduationCap className="w-4 h-4" />,
            color: 'purple',
            bgColor: 'bg-purple-500/20',
            textColor: 'text-purple-400',
            borderColor: 'border-purple-500/30'
        },
        grader: {
            label: 'Grader',
            description: 'Chấm điểm code lab',
            icon: <ClipboardCheck className="w-4 h-4" />,
            color: 'amber',
            bgColor: 'bg-amber-500/20',
            textColor: 'text-amber-400',
            borderColor: 'border-amber-500/30'
        }
    };

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, {
            role: 'user',
            content: userMessage,
            timestamp: new Date()
        }]);
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
                    stream: false,
                }),
            });

            // Handle error responses
            if (!res.ok) {
                const errorText = await res.text();
                try {
                    const errorData = JSON.parse(errorText);
                    throw new Error(errorData.error?.message || `Lỗi ${res.status}`);
                } catch {
                    throw new Error(`Lỗi kết nối (${res.status})`);
                }
            }

            // Parse JSON response
            const data = await res.json();
            const aiResponse = data.response || '';

            // Update remaining quota if provided
            if (data.remainingQuota !== undefined) {
                setRemainingQuota(data.remainingQuota);
            }

            // Add AI response
            if (aiResponse) {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: aiResponse,
                    timestamp: new Date()
                }]);
            } else {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: '⚠️ Không nhận được phản hồi từ AI. Vui lòng thử lại.',
                    timestamp: new Date()
                }]);
            }

        } catch (error) {
            console.error('AI error:', error);
            const errorMsg = error instanceof Error ? error.message : 'Lỗi không xác định';
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `❌ **Lỗi:** ${errorMsg}\n\nVui lòng thử lại sau.`,
                timestamp: new Date()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const clearChat = () => {
        setMessages([]);
    };

    const currentModeConfig = modeConfig[mode];

    // Quick suggestions based on mode
    const quickSuggestions = {
        tutor: [
            'pinMode() là gì?',
            'Cách làm LED nhấp nháy?',
            'digitalWrite HIGH/LOW khác gì?'
        ],
        socratic: [
            'LED cần gì để sáng?',
            'Tại sao cần điện trở?',
            'loop() khác setup() như nào?'
        ],
        grader: [
            'Chấm code LED nháy',
            'Kiểm tra code này',
            'Đánh giá bài lab'
        ]
    };

    return (
        <>
            {/* Floating Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/30 flex items-center justify-center hover:scale-110 transition-transform group"
                >
                    <MessageSquare className="w-6 h-6" />
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold animate-pulse">
                        AI
                    </span>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 z-50 w-[420px] max-w-[calc(100vw-32px)] h-[600px] max-h-[calc(100vh-100px)] bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800/50">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl ${currentModeConfig.bgColor} ${currentModeConfig.textColor} flex items-center justify-center`}>
                                {currentModeConfig.icon}
                            </div>
                            <div>
                                <button
                                    onClick={() => setShowModeSelect(!showModeSelect)}
                                    className="flex items-center gap-1 font-medium text-white hover:text-teal-400 transition-colors"
                                >
                                    AI {currentModeConfig.label}
                                    <ChevronDown className={`w-4 h-4 transition-transform ${showModeSelect ? 'rotate-180' : ''}`} />
                                </button>
                                <p className="text-xs text-slate-400">{currentModeConfig.description}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={clearChat}
                                className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                                title="Xóa lịch sử chat"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
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
                                    <div className={`w-8 h-8 rounded-lg ${modeConfig[m].bgColor} ${modeConfig[m].textColor} flex items-center justify-center`}>
                                        {modeConfig[m].icon}
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">{modeConfig[m].label}</p>
                                        <p className="text-xs text-slate-400">{modeConfig[m].description}</p>
                                    </div>
                                    {mode === m && (
                                        <span className="ml-auto text-teal-400">✓</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-4">
                                <div className={`w-20 h-20 rounded-full ${currentModeConfig.bgColor} ${currentModeConfig.textColor} flex items-center justify-center mx-auto mb-4`}>
                                    <Sparkles className="w-10 h-10" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">
                                    Xin chào! Tôi là AI Trợ giảng Arduino
                                </h3>
                                <p className="text-slate-400 text-sm mb-6">
                                    Hãy hỏi bất cứ điều gì về Arduino, tôi sẵn sàng giúp bạn!
                                </p>

                                {/* Quick Suggestions */}
                                <div className="w-full space-y-2">
                                    <p className="text-xs text-slate-500 uppercase tracking-wide">Gợi ý câu hỏi:</p>
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {quickSuggestions[mode].map((suggestion, i) => (
                                            <button
                                                key={i}
                                                onClick={() => {
                                                    setInput(suggestion);
                                                    inputRef.current?.focus();
                                                }}
                                                className="px-3 py-1.5 text-xs bg-slate-800 text-slate-300 rounded-full border border-slate-700 hover:border-teal-500/50 hover:text-teal-400 transition-colors"
                                            >
                                                {suggestion}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                {messages.map((msg, i) => (
                                    <div
                                        key={i}
                                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm ${msg.role === 'user'
                                                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-br-sm'
                                                    : 'bg-slate-800 text-slate-200 rounded-bl-sm border border-slate-700'
                                                }`}
                                        >
                                            {msg.role === 'assistant' ? (
                                                <div className="prose prose-invert prose-sm max-w-none">
                                                    <ReactMarkdown
                                                        components={{
                                                            code: ({ className, children, ...props }) => {
                                                                const isInline = !className;
                                                                return isInline ? (
                                                                    <code className="bg-slate-700 px-1.5 py-0.5 rounded text-teal-300 text-xs" {...props}>
                                                                        {children}
                                                                    </code>
                                                                ) : (
                                                                    <pre className="bg-slate-900 p-3 rounded-lg overflow-x-auto my-2">
                                                                        <code className="text-xs text-slate-300" {...props}>
                                                                            {children}
                                                                        </code>
                                                                    </pre>
                                                                );
                                                            },
                                                            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                                            ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                                                            ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                                                            li: ({ children }) => <li className="text-slate-300">{children}</li>,
                                                            strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
                                                            h3: ({ children }) => <h3 className="text-white font-bold mt-3 mb-1">{children}</h3>,
                                                            h4: ({ children }) => <h4 className="text-white font-semibold mt-2 mb-1">{children}</h4>,
                                                        }}
                                                    >
                                                        {msg.content}
                                                    </ReactMarkdown>
                                                </div>
                                            ) : (
                                                <span className="whitespace-pre-wrap">{msg.content}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}

                        {/* Loading indicator */}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-slate-800 text-slate-400 px-4 py-3 rounded-2xl rounded-bl-sm border border-slate-700 flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span className="text-sm">Đang suy nghĩ...</span>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quota indicator */}
                    {remainingQuota !== null && remainingQuota < 10 && (
                        <div className="px-4 py-1 text-xs text-center text-amber-400 bg-amber-500/10 border-t border-amber-500/20">
                            Còn {remainingQuota} lượt hỏi. Refresh sau 10 phút.
                        </div>
                    )}

                    {/* Input */}
                    <div className="p-4 border-t border-slate-700 bg-slate-800/50">
                        <div className="flex items-center gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={`Hỏi AI ${currentModeConfig.label}...`}
                                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/50"
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                className="w-12 h-12 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white flex items-center justify-center hover:from-teal-400 hover:to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-teal-500/20"
                            >
                                {isLoading ? (
                                    <RefreshCw className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Send className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
