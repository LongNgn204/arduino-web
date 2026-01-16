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
    Trash2,
    Maximize2,
    Minimize2,
    Scaling,
    Paperclip,
    FileText
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

const API_BASE = import.meta.env.PROD
    ? 'https://arduino-workers.stu725114073.workers.dev'
    : '';

type AiMode = 'tutor' | 'socratic' | 'grader';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp?: Date;
}

interface Attachment {
    type: 'image' | 'text';
    content: string; // Base64 or text content
    name: string;
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
    const [attachments, setAttachments] = useState<Attachment[]>([]);

    // Persistence Effect
    useEffect(() => {
        // Load on mount
        const saved = localStorage.getItem('ai_chat_history');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setMessages(parsed);
            } catch (e) {
                console.error('Failed to parse chat history', e);
            }
        }
    }, []);

    useEffect(() => {
        // Save on update (limit to last 50 messages)
        const toSave = messages.slice(-50);
        localStorage.setItem('ai_chat_history', JSON.stringify(toSave));
    }, [messages]);

    // UI State for Resize/Drag
    const [isMaximized, setIsMaximized] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 }); // Will init in useEffect
    const [size, setSize] = useState({ width: 450, height: 600 });
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const dragRef = useRef<{ startX: number; startY: number; startLeft: number; startTop: number }>({ startX: 0, startY: 0, startLeft: 0, startTop: 0 });
    const resizeRef = useRef<{ startX: number; startY: number; startWidth: number; startHeight: number }>({ startX: 0, startY: 0, startWidth: 0, startHeight: 0 });

    // Initialize position on client side only to avoid huge jumps
    useEffect(() => {
        setPosition({
            x: window.innerWidth - 480,
            y: window.innerHeight - 650
        });
    }, []);

    // Chú thích: Light theme mode colors để match với main website
    const modeConfig = {
        tutor: {
            label: 'Tutor',
            description: 'Bách khoa toàn thư & Trợ giảng',
            icon: <Sparkles className="w-4 h-4" />,
            color: 'teal',
            bgColor: 'bg-teal-100',
            textColor: 'text-teal-700',
            borderColor: 'border-teal-200'
        },
        socratic: {
            label: 'Socratic',
            description: 'Gợi mở tư duy & Vấn đáp',
            icon: <GraduationCap className="w-4 h-4" />,
            color: 'purple',
            bgColor: 'bg-purple-100',
            textColor: 'text-purple-700',
            borderColor: 'border-purple-200'
        },
        grader: {
            label: 'Grader',
            description: 'Chấm điểm & Review code',
            icon: <ClipboardCheck className="w-4 h-4" />,
            color: 'amber',
            bgColor: 'bg-amber-100',
            textColor: 'text-amber-700',
            borderColor: 'border-amber-200'
        }
    };

    const currentModeConfig = modeConfig[mode];

    const quickSuggestions = {
        tutor: [
            "Định luật Ohm là gì?",
            "Viết code điều khiển servo",
            "Công thức tính điện trở LED?",
            "Giải thích code hiện tại"
        ],
        socratic: [
            "Tại sao LED cần điện trở?",
            "Làm sao để code chạy nhanh hơn?",
            "Gợi ý hướng giải quyết bài này",
            "Hệ thống nhúng là gì?"
        ],
        grader: [
            "Review code của tôi",
            "Tìm lỗi logic tiềm ẩn",
            "Tối ưu hóa bộ nhớ",
            "Kiểm tra chuẩn style guide"
        ]
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    // Drag handlers
    const handleDragStart = (e: React.MouseEvent) => {
        if (isMaximized) return;
        setIsDragging(true);
        dragRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            startLeft: position.x,
            startTop: position.y
        };
    };

    // Resize handlers
    const handleResizeStart = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isMaximized) return;
        setIsResizing(true);
        resizeRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            startWidth: size.width,
            startHeight: size.height
        };
    };

    // Global mouse move/up handlers
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                const dx = e.clientX - dragRef.current.startX;
                const dy = e.clientY - dragRef.current.startY;
                setPosition({
                    x: dragRef.current.startLeft + dx,
                    y: dragRef.current.startTop + dy
                });
            }
            if (isResizing) {
                const dx = e.clientX - resizeRef.current.startX;
                const dy = e.clientY - resizeRef.current.startY;
                setSize({
                    width: Math.max(300, resizeRef.current.startWidth + dx),
                    height: Math.max(400, resizeRef.current.startHeight + dy)
                });
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            setIsResizing(false);
        };

        if (isDragging || isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, isResizing]);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            const newAttachments: Attachment[] = [];

            for (const file of files) {
                // Limit size (e.g. 2MB)
                if (file.size > 2 * 1024 * 1024) {
                    alert(`File ${file.name} quá lớn (max 2MB)`);
                    continue;
                }

                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    await new Promise<void>((resolve) => {
                        reader.onload = () => {
                            newAttachments.push({
                                type: 'image',
                                content: reader.result as string,
                                name: file.name
                            });
                            resolve();
                        };
                    });
                } else if (file.type === 'text/plain' || file.name.endsWith('.cpp') || file.name.endsWith('.ino') || file.name.endsWith('.h') || file.name.endsWith('.c') || file.name.endsWith('.txt') || file.name.endsWith('.json') || file.name.endsWith('.md')) { // Basic code/text check
                    const text = await file.text();
                    newAttachments.push({
                        type: 'text',
                        content: text,
                        name: file.name
                    });
                } else {
                    alert(`Format file chưa hỗ trợ: ${file.name}`);
                }
            }

            setAttachments(prev => [...prev, ...newAttachments]);
            // Reset input
            e.target.value = '';
        }
    };

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };


    const handleSend = async (messageOverride?: string) => {
        const messageToSend = messageOverride || input;
        if (!messageToSend.trim() || isLoading) return;

        const userMessage = messageToSend.trim();
        const currentAttachments = [...attachments];

        setInput('');
        setAttachments([]); // Clear attachments after send

        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        // Add placeholder for streaming response
        setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

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
                    attachments: currentAttachments.length > 0 ? currentAttachments : undefined,
                    stream: true // Enable SSE streaming
                }),
            });

            if (!res.ok) {
                let errorMessage = `Lỗi ${res.status}`;
                try {
                    const errorData = await res.json();
                    if (errorData.error?.message) {
                        errorMessage = errorData.error.message;
                    }
                } catch {
                    const text = await res.text();
                    if (text) errorMessage = text.slice(0, 100);
                }
                throw new Error(errorMessage);
            }

            // Handle SSE streaming
            const reader = res.body?.getReader();
            const decoder = new TextDecoder();
            let fullContent = '';

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split('\n').filter(line => line.startsWith('data: '));

                    for (const line of lines) {
                        const data = line.slice(6); // Remove 'data: ' prefix
                        try {
                            const parsed = JSON.parse(data);

                            if (parsed.content) {
                                fullContent += parsed.content;
                                // Update streaming message in real-time
                                setMessages(prev => {
                                    const newMessages = [...prev];
                                    newMessages[newMessages.length - 1] = {
                                        role: 'assistant',
                                        content: fullContent
                                    };
                                    return newMessages;
                                });
                            }

                            if (parsed.done) {
                                if (parsed.remainingQuota !== undefined) {
                                    setRemainingQuota(parsed.remainingQuota);
                                }
                            }
                        } catch {
                            // Ignore parse errors for incomplete chunks
                        }
                    }
                }
            }

            // Fallback if streaming didn't work
            if (!fullContent) {
                const data = await res.json();
                const aiResponse = data.response || 'Không có phản hồi từ AI';
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = {
                        role: 'assistant',
                        content: aiResponse
                    };
                    return newMessages;
                });

                if (data.remainingQuota !== undefined) {
                    setRemainingQuota(data.remainingQuota);
                }
            }

        } catch (error) {
            console.error('AI error:', error);
            const errorMsg = error instanceof Error ? error.message : 'Lỗi không xác định';
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                    role: 'assistant',
                    content: `❌ Lỗi: ${errorMsg}\n\nVui lòng thử lại sau.`
                };
                return newMessages;
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Listen for custom event/selection to open AI chat
    useEffect(() => {
        const handleOpenChat = (e: CustomEvent<{ question: string; autoSubmit?: boolean }>) => {
            setIsOpen(true);
            const { question, autoSubmit } = e.detail;
            if (question) {
                setTimeout(() => {
                    setInput(question);
                    if (autoSubmit) {
                        handleSend(question);
                    }
                }, 100);
            }
        };

        window.addEventListener('open-ai-chat' as any, handleOpenChat as any);
        return () => {
            window.removeEventListener('open-ai-chat' as any, handleOpenChat as any);
        };
    }, [handleSend]); // Depend on handleSend

    const clearChat = () => {
        if (window.confirm('Bạn có chắc chắn muốn xóa lịch sử chat không?')) {
            setMessages([]);
        }
    };

    return (
        <>
            {/* Floating Button - Only show when closed */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/30 flex items-center justify-center hover:scale-110 transition-transform group animate-bounce-subtle"
                >
                    <MessageSquare className="w-6 h-6" />
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold animate-pulse">
                        AI
                    </span>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div
                    style={{
                        position: 'fixed',
                        left: isMaximized ? 0 : position.x,
                        top: isMaximized ? 0 : position.y,
                        width: isMaximized ? '100vw' : size.width,
                        height: isMaximized ? '100vh' : size.height,
                        zIndex: 100,
                    }}
                    className={`bg-white border border-gray-200 shadow-2xl shadow-gray-300/50 flex flex-col overflow-hidden transition-all duration-200 ${isMaximized ? 'rounded-none' : 'rounded-2xl'}`}
                >
                    {/* Header - Draggable */}
                    <div
                        onMouseDown={handleDragStart}
                        className={`flex items-center justify-between p-3 border-b border-gray-100 bg-gray-50/90 backdrop-blur select-none cursor-move ${isDragging ? 'cursor-grabbing' : ''}`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl ${currentModeConfig.bgColor} ${currentModeConfig.textColor} flex items-center justify-center`}>
                                {currentModeConfig.icon}
                            </div>
                            <div>
                                <button
                                    onMouseDown={(e) => e.stopPropagation()}
                                    onClick={() => setShowModeSelect(!showModeSelect)}
                                    className="flex items-center gap-1 font-bold text-gray-800 hover:text-teal-600 transition-colors"
                                >
                                    {currentModeConfig.label}
                                    <ChevronDown className={`w-4 h-4 transition-transform ${showModeSelect ? 'rotate-180' : ''}`} />
                                </button>
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                                    AI Assistant
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1" onMouseDown={(e) => e.stopPropagation()}>
                            <button
                                onClick={clearChat}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Xóa lịch sử"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setIsMaximized(!isMaximized)}
                                className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                                title={isMaximized ? "Thu nhỏ" : "Phóng to"}
                            >
                                {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Mode Selector Dropdown */}
                    {showModeSelect && (
                        <div className="absolute top-[60px] left-4 right-4 bg-white rounded-xl border border-gray-200 shadow-xl z-20 p-2 space-y-1">
                            {(Object.keys(modeConfig) as AiMode[]).map((m) => (
                                <button
                                    key={m}
                                    onClick={() => {
                                        setMode(m);
                                        setShowModeSelect(false);
                                    }}
                                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${mode === m ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                                >
                                    <div className={`w-8 h-8 rounded-lg ${modeConfig[m].bgColor} ${modeConfig[m].textColor} flex items-center justify-center`}>
                                        {modeConfig[m].icon}
                                    </div>
                                    <div className="text-left">
                                        <p className={`font-medium ${mode === m ? 'text-gray-900' : 'text-gray-700'}`}>
                                            {modeConfig[m].label}
                                        </p>
                                        <p className="text-xs text-gray-500">{modeConfig[m].description}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 scroll-smooth custom-scrollbar">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-6">
                                <div className={`w-20 h-20 rounded-3xl ${currentModeConfig.bgColor} ${currentModeConfig.textColor} flex items-center justify-center shadow-lg`}>
                                    {currentModeConfig.icon}
                                </div>
                                <div className="text-center space-y-2 px-4">
                                    <h3 className="text-lg font-bold text-gray-800">Xin chào! 👋</h3>
                                    <p className="text-sm text-gray-600">Tôi là AI Assistant toàn năng.<br />Hỏi tôi về Arduino, Toán học, hay bất cứ điều gì!</p>
                                    <div className="text-xs bg-teal-50 text-teal-700 px-3 py-1.5 rounded-full inline-block mt-2 border border-teal-200">
                                        ✨ Hỗ trợ công thức Toán LaTeX ($E=mc^2$)
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-2 w-full max-w-[80%]">
                                    {quickSuggestions[mode].map((suggestion, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setInput(suggestion)}
                                            className="px-4 py-2 bg-white hover:bg-teal-50 hover:border-teal-300 text-gray-700 text-xs rounded-xl border border-gray-200 transition-all text-left truncate shadow-sm"
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
                                        className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                                            ? 'bg-teal-600 text-white rounded-tr-none'
                                            : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                                            }`}
                                    >
                                        {msg.role === 'assistant' ? (
                                            <div className="prose prose-sm max-w-none break-words prose-headings:text-gray-800 prose-p:text-gray-700">
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkMath, remarkGfm]}
                                                    rehypePlugins={[rehypeKatex]}
                                                    components={{
                                                        code: ({ node, inline, className, children, ...props }: any) => {
                                                            const match = /language-(\w+)/.exec(className || '')
                                                            return !inline ? (
                                                                <div className="relative group my-2">
                                                                    <div className="absolute top-2 right-2 px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        {match ? match[1] : 'code'}
                                                                    </div>
                                                                    <code className={`${className} block p-3 bg-gray-900 text-gray-100 rounded-lg overflow-x-auto`} {...props}>
                                                                        {children}
                                                                    </code>
                                                                </div>
                                                            ) : (
                                                                <code className={`${className} bg-gray-100 text-teal-700 px-1 py-0.5 rounded`} {...props}>
                                                                    {children}
                                                                </code>
                                                            )
                                                        }
                                                    }}
                                                >
                                                    {msg.content}
                                                </ReactMarkdown>
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
                                <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2 shadow-sm">
                                    <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
                                    <span className="text-xs text-gray-500 animate-pulse">Đang phân tích...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Footer Input */}
                    <div className="p-4 bg-white/90 backdrop-blur border-t border-gray-100 space-y-2">
                        {remainingQuota !== null && remainingQuota < 10 && (
                            <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                                <span className="font-bold">⚠️</span>
                                <span>Còn {remainingQuota} câu hỏi.</span>
                            </div>
                        )}

                        {/* Attachments Preview */}
                        {attachments.length > 0 && (
                            <div className="flex gap-2 overflow-x-auto py-2 px-1">
                                {attachments.map((file, idx) => (
                                    <div key={idx} className="relative group flex-shrink-0">
                                        <div className="w-16 h-16 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
                                            {file.type === 'image' ? (
                                                <img src={file.content} alt={file.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <FileText className="w-8 h-8 text-gray-400" />
                                            )}
                                        </div>
                                        <button
                                            onClick={() => removeAttachment(idx)}
                                            className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 shadow-md hover:bg-red-600 transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                        <p className="text-[10px] text-gray-500 truncate w-16 text-center mt-1">{file.name}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="relative flex items-end gap-2">
                            <label className="p-2 text-gray-400 hover:text-teal-600 cursor-pointer transition-colors rounded-lg hover:bg-teal-50">
                                <Paperclip className="w-5 h-5" />
                                <input
                                    type="file"
                                    multiple
                                    className="hidden"
                                    onChange={handleFileSelect}
                                    accept="image/*,.txt,.cpp,.ino,.h,.c,.json,.md"
                                />
                            </label>
                            <textarea
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                                placeholder="Nhập câu hỏi..."
                                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-300 resize-none transition-all placeholder:text-gray-400 max-h-32 min-h-[46px]"
                                rows={1}
                                disabled={isLoading}
                                style={{ lineHeight: '1.5' }}
                            />
                            <button
                                onClick={() => handleSend()}
                                disabled={!input.trim() || isLoading}
                                className="absolute right-2 bottom-2 p-2 bg-teal-500 hover:bg-teal-400 text-white rounded-lg disabled:opacity-50 disabled:hover:bg-teal-500 transition-all shadow-lg shadow-teal-500/20"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Resize Handle */}
                    {!isMaximized && (
                        <div
                            onMouseDown={handleResizeStart}
                            className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize flex items-end justify-end p-0.5 text-slate-600 hover:text-teal-400 opacity-50 hover:opacity-100 transition-opacity"
                        >
                            <Scaling className="w-4 h-4" />
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
