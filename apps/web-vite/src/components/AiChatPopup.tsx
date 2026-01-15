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

    const currentModeConfig = modeConfig[mode];

    const quickSuggestions = {
        tutor: [
            "Hàm setup() dùng để làm gì?",
            "Làm sao để LED nhấp nháy?",
            "Giải thích code hiện tại giúp tôi",
            "Tại sao cần dùng trở kéo?"
        ],
        socratic: [
            "Gợi ý cho tôi về bài lab này",
            "Tôi đang gặp lỗi, hãy giúp tôi tư duy",
            "Thử thách tôi một câu hỏi khó",
            "Khái niệm này áp dụng thực tế thế nào?"
        ],
        grader: [
            "Chấm điểm code của tôi",
            "Code này có tối ưu không?",
            "Tìm lỗi tiềm ẩn trong code",
            "Gợi ý cải thiện code style"
        ]
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

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
                    stream: false // Use non-streaming for stability
                }),
            });

            if (!res.ok) {
                // Try to parse error message from backend
                let errorMessage = `Lỗi ${res.status}`;
                try {
                    const errorData = await res.json();
                    if (errorData.error?.message) {
                        errorMessage = errorData.error.message;
                    }
                } catch (e) {
                    // If json parse fails, stick to status code or reading text
                    const text = await res.text();
                    if (text) errorMessage = text.slice(0, 100);
                }
                throw new Error(errorMessage);
            }

            const data = await res.json();
            const aiResponse = data.response || 'Không có phản hồi từ AI';

            if (data.remainingQuota !== undefined) {
                setRemainingQuota(data.remainingQuota);
            }

            setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);

        } catch (error) {
            console.error('AI error:', error);
            const errorMsg = error instanceof Error ? error.message : 'Lỗi không xác định';
            setMessages(prev => [
                ...prev,
                { role: 'assistant', content: `❌ Lỗi: ${errorMsg}\n\nVui lòng thử lại sau.` }
            ]);
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
        if (window.confirm('Bạn có chắc chắn muốn xóa lịch sử chat không?')) {
            setMessages([]);
        }
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
                                <p className="text-xs text-slate-500">Mimo Flash • {currentModeConfig.description}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={clearChat}
                                className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                                title="Xóa lịch sử chat"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Mode Selector Dropdown */}
                    {showModeSelect && (
                        <div className="absolute top-[72px] left-4 right-4 bg-slate-800 rounded-xl border border-slate-700 shadow-xl z-20 p-2 space-y-1">
                            {(Object.keys(modeConfig) as AiMode[]).map((m) => (
                                <button
                                    key={m}
                                    onClick={() => {
                                        setMode(m);
                                        setShowModeSelect(false);
                                    }}
                                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${mode === m ? 'bg-slate-700' : 'hover:bg-slate-700/50'}`}
                                >
                                    <div className={`w-8 h-8 rounded-lg ${modeConfig[m].bgColor} ${modeConfig[m].textColor} flex items-center justify-center`}>
                                        {modeConfig[m].icon}
                                    </div>
                                    <div className="text-left">
                                        <p className={`font-medium ${mode === m ? 'text-white' : 'text-slate-300'}`}>
                                            {modeConfig[m].label}
                                        </p>
                                        <p className="text-xs text-slate-500">{modeConfig[m].description}</p>
                                    </div>
                                    {mode === m && <CheckCircle className="w-4 h-4 text-teal-500 ml-auto" />}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
                                <div className={`w-16 h-16 rounded-2xl ${currentModeConfig.bgColor} ${currentModeConfig.textColor} flex items-center justify-center mb-2`}>
                                    {currentModeConfig.icon}
                                </div>
                                <p className="text-center text-sm">
                                    Chào bạn! Tôi là trợ lý ảo hỗ trợ học tập.<br />
                                    Hãy chọn một gợi ý bên dưới hoặc đặt câu hỏi:
                                </p>
                                <div className="flex flex-wrap gap-2 justify-center max-w-[90%]">
                                    {quickSuggestions[mode].map((suggestion, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setInput(suggestion)}
                                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-full border border-slate-700 transition-colors"
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user'
                                                ? 'bg-teal-600 text-white rounded-tr-none'
                                                : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'
                                            }`}
                                    >
                                        {msg.role === 'assistant' ? (
                                            <div className="prose prose-invert prose-sm max-w-none">
                                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                                            </div>
                                        ) : (
                                            msg.content
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
                                    <span className="text-xs text-slate-400">Đang suy nghĩ...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Footer Input */}
                    <div className="p-4 bg-slate-800 border-t border-slate-700 space-y-2">
                        {remainingQuota !== null && remainingQuota < 10 && (
                            <div className="flex items-center gap-2 text-xs text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-lg">
                                <AlertTriangle className="w-3 h-3" />
                                <span>Bạn còn {remainingQuota} lượt hỏi trong phiên này.</span>
                            </div>
                        )}
                        <div className="relative">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Đặt câu hỏi cho AI..."
                                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 placeholder-slate-500"
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-teal-500 hover:bg-teal-400 text-white rounded-lg disabled:opacity-50 disabled:hover:bg-teal-500 transition-colors"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

// Icons components helpers
function CheckCircle({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    )
}

function AlertTriangle({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" />
        </svg>
    )
}
