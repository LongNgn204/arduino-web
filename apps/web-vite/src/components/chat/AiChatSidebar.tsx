// AiChatSidebar.tsx - Main Wrapper Component
import { useState, useEffect, useRef } from 'react';
import {
    X,
    Sparkles,
    GraduationCap,
    ClipboardCheck,
    ChevronLeft,
    MessageSquare,
    Loader2
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

// Config
const API_BASE = import.meta.env.PROD
    ? 'https://arduino-workers.stu725114073.workers.dev'
    : '';

interface AiChatSidebarProps {
    className?: string;
}

export default function AiChatSidebar({ className }: AiChatSidebarProps) {
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
    const [showHistory, setShowHistory] = useState(false); // Mobile toggling logic or panel switching
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

        // Optimistic UI update handled by store? No, store adds message.
        // Add user message to store
        addMessage(activeConversationId, {
            role: 'user',
            content: input, // Append attachments info if logic requires
            // For now simple text. Attachments handling in backend needs to be mirrored here?
            // Simplified: just passing text. Attachments logic is complex.
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
                    stream: false // Simplified for now
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

    return (
        <>
            {/* Backdrop for mobile */}
            {isChatSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                    onClick={closeChatSidebar}
                />
            )}

            {/* Main Panel */}
            <div className={cn(
                "fixed inset-y-0 right-0 z-50 w-full sm:w-[450px] bg-white border-l border-gray-200 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col",
                isChatSidebarOpen ? "translate-x-0" : "translate-x-full",
                className
            )}>
                {/* Header */}
                <div className="h-16 border-b border-gray-100 flex items-center justify-between px-4 bg-white/80 backdrop-blur z-10 shrink-0">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <button
                            onClick={() => setShowHistory(!showHistory)}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
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

                    <button
                        onClick={closeChatSidebar}
                        className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
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
                                            "max-w-[85%] rounded-2xl p-4 text-sm shadow-sm",
                                            msg.role === 'user'
                                                ? "bg-arduino-teal text-white rounded-tr-none"
                                                : "bg-white border border-gray-200 text-gray-800 rounded-tl-none"
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
                                <div className="flex justify-start animate-fade-in">
                                    <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2 shadow-sm">
                                        <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
                                        <span className="text-xs text-gray-500">Đang suy nghĩ...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
                    </div>
                </div>
            </div>
        </>
    );
}
