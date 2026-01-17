// AiChatSidebar.tsx - Main Wrapper Component
import { useState, useEffect, useRef } from 'react';
import {
    X,
    Sparkles,
    GraduationCap,
    ClipboardCheck,
    ChevronLeft,
    MessageSquare,
} from 'lucide-react';
import { useChatStore } from '../../stores/chatStore';
import type { Message } from '../../stores/chatStore';
import { cn } from '../ui/Card';
import ChatHistoryPanel from './ChatHistoryPanel';
import ChatInput from './ChatInput';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import MermaidDiagram from '../MermaidDiagram';

// Config
const API_BASE = import.meta.env.PROD
    ? 'https://arduino-workers.stu725114073.workers.dev'
    : '';

interface AiChatSidebarProps {
    className?: string;
    embedded?: boolean; // New prop
}

export default function AiChatSidebar({ className, embedded = false }: AiChatSidebarProps) {
    const {
        isChatSidebarOpen,
        closeChatSidebar,
        activeConversationId,
        getActiveMessages,
        addMessage,
        getConversationById,
        createConversation
    } = useChatStore();

    const [isLoading, setIsLoading] = useState(false);
    const [deepThink, setDeepThink] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messages = getActiveMessages();
    const activeConversation = activeConversationId ? getConversationById(activeConversationId) : null;

    // Scroll to bottom on new messages
    useEffect(() => {
        if (isChatSidebarOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isChatSidebarOpen, activeConversationId]);

    // Ensure active conversation
    useEffect(() => {
        if (isChatSidebarOpen && !activeConversationId) {
            createConversation();
        }
    }, [isChatSidebarOpen, activeConversationId, createConversation]);

    const handleSendMessage = async (input: string, attachments: any[]) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        if (!activeConversationId) return;

        addMessage(activeConversationId, {
            role: 'user',
            content: input,
        });

        setIsLoading(true);

        try {
            const res = await fetch(`${API_BASE}/api/ai/tutor`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    mode: activeConversation?.mode || 'tutor',
                    userQuestion: input,
                    attachments: attachments.length > 0 ? attachments : undefined,
                    stream: false,
                    deepThink, // Truyền cờ Deep Think
                }),
            });

            if (!res.ok) throw new Error('Failed to fetch AI response');

            const data = await res.json();
            const aiResponse = data.response || 'Không có phản hồi.';

            addMessage(activeConversationId, {
                role: 'assistant',
                content: aiResponse
            });

        } catch (err) {
            console.error(err);
            addMessage(activeConversationId, {
                role: 'assistant',
                content: '❌ Lỗi kết nối. Vui lòng thử lại.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Modes UI Config
    const modeConfig = {
        tutor: { icon: Sparkles, color: 'text-teal-600', label: 'Tutor' },
        socratic: { icon: GraduationCap, color: 'text-purple-600', label: 'Socratic' },
        grader: { icon: ClipboardCheck, color: 'text-amber-600', label: 'Grader' },
    };

    const ModeIcon = activeConversation ? modeConfig[activeConversation.mode].icon : Sparkles;

    // Embedded Logic Override
    const shouldRender = embedded || isChatSidebarOpen;
    if (!shouldRender) return null;

    return (
        <>
            {/* Backdrop for mobile (only if not embedded) */}
            {!embedded && isChatSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                    onClick={closeChatSidebar}
                />
            )}

            {/* Main Panel */}
            <div className={cn(
                "bg-white border-l border-gray-200 shadow-2xl flex flex-col transition-all duration-300 ease-in-out",
                embedded
                    ? "relative w-full h-full shadow-none border-none rounded-none z-0 translate-x-0"
                    : "fixed inset-y-0 right-0 z-50 w-full sm:w-[500px] transform",
                !embedded && (isChatSidebarOpen ? "translate-x-0" : "translate-x-full"),
                className
            )}>
                {/* Header */}
                <div className="h-16 border-b border-gray-100 flex items-center justify-between px-4 bg-white/95 backdrop-blur-xl z-10 shrink-0 shadow-sm sticky top-0">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <button
                            onClick={() => setShowHistory(!showHistory)}
                            className="p-2 hover:bg-gray-50 rounded-xl text-gray-500 hover:text-arduino-teal transition-all active:scale-95"
                        >
                            {showHistory ? <ChevronLeft className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
                        </button>

                        <div className="flex-1 min-w-0">
                            <h2 className="font-bold text-gray-800 truncate">
                                {showHistory ? 'Lịch sử Chat' : (activeConversation?.title || 'Cuộc hội thoại mới')}
                            </h2>
                            {!showHistory && (
                                <div className="flex items-center gap-1 text-xs text-arduino-teal">
                                    <ModeIcon className="w-3 h-3" />
                                    <span>{activeConversation ? modeConfig[activeConversation.mode].label : 'Tutor'}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {!embedded && (
                        <button
                            onClick={closeChatSidebar}
                            className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-hidden relative flex">
                    {/* History Layer */}
                    <div className={cn(
                        "absolute inset-0 bg-white transition-opacity duration-300 z-20",
                        showHistory ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    )}>
                        <ChatHistoryPanel onClose={() => setShowHistory(false)} />
                    </div>

                    {/* Messages Layer */}
                    <div className="flex-1 flex flex-col w-full">
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 scroll-smooth scrollbar-thin scrollbar-thumb-gray-200">
                            {messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center p-8 text-gray-500 space-y-4">
                                    <div className="w-16 h-16 rounded-2xl bg-teal-50 text-arduino-teal flex items-center justify-center mb-2">
                                        <Sparkles className="w-8 h-8" />
                                    </div>
                                    <h3 className="font-bold text-gray-800">Bắt đầu trò chuyện</h3>
                                    <p className="text-sm">Hỏi tôi về bài học, kiểm tra code hoặc giải thích khái niệm.</p>
                                </div>
                            ) : (
                                messages.map((msg: Message) => (
                                    <div
                                        key={msg.id}
                                        className={cn(
                                            "flex w-full animate-fade-in-up",
                                            msg.role === 'user' ? "justify-end" : "justify-start"
                                        )}
                                    >
                                        <div className={cn(
                                            "max-w-[85%] rounded-2xl p-4 text-sm shadow-sm relative group transition-all",
                                            msg.role === 'user'
                                                ? "bg-gradient-to-br from-arduino-teal to-teal-600 text-white rounded-tr-sm shadow-arduino-teal/20"
                                                : "bg-white border border-gray-100 text-gray-800 rounded-tl-sm shadow-gray-200/50"
                                        )}>
                                            {msg.role === 'assistant' ? (
                                                <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-gray-900 prose-pre:text-gray-50">
                                                    <ReactMarkdown
                                                        remarkPlugins={[remarkMath, remarkGfm]}
                                                        rehypePlugins={[rehypeKatex]}
                                                        components={{
                                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                            code(props: any) {
                                                                const { node, inline, className, children, ...rest } = props;
                                                                const match = /language-(\w+)/.exec(className || '');
                                                                const codeText = String(children).replace(/\n$/, '');

                                                                if (!inline && match && match[1] === 'mermaid') {
                                                                    return <MermaidDiagram code={codeText} />;
                                                                }

                                                                return !inline && match ? (
                                                                    <code className={className} {...rest}>
                                                                        {children}
                                                                    </code>
                                                                ) : (
                                                                    <code className={cn("bg-gray-100 text-teal-700 px-1 py-0.5 rounded font-mono text-xs", className)} {...rest}>
                                                                        {children}
                                                                    </code>
                                                                );
                                                            }
                                                        } as any}
                                                    >
                                                        {msg.content}
                                                    </ReactMarkdown>
                                                </div>
                                            ) : (
                                                <div className="whitespace-pre-wrap">{msg.content}</div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                            {isLoading && (
                                <div className="flex justify-start animate-fade-in pl-2">
                                    <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2 shadow-sm">
                                        <div className="flex gap-1">
                                            <span className="w-2 h-2 bg-arduino-teal/60 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                            <span className="w-2 h-2 bg-arduino-teal/60 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                            <span className="w-2 h-2 bg-arduino-teal/60 rounded-full animate-bounce"></span>
                                        </div>
                                        <span className="text-xs text-gray-400 font-medium ml-1">AI đang suy nghĩ...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <ChatInput
                            onSend={handleSendMessage}
                            isLoading={isLoading}
                            deepThink={deepThink}
                            onToggleDeepThink={() => setDeepThink(!deepThink)}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
