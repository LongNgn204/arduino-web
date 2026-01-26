// AiChatSidebar.tsx - Main Wrapper Component
import { useState, useEffect, useRef } from 'react';
import {
    X,
    Sparkles,
    GraduationCap,
    ClipboardCheck,
    ChevronLeft,
    MessageSquare,
    ArrowDown
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
    const [showScrollButton, setShowScrollButton] = useState(false); // State nút cuộn
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const activeConversation = activeConversationId ? getConversationById(activeConversationId) : null;

    // Scroll handlers
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        setShowScrollButton(false);
    };

    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
        // Show button if scrolled up more than 100px from bottom
        const isBottom = scrollHeight - scrollTop - clientHeight < 100;
        setShowScrollButton(!isBottom);
    };

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
                    stream: true,
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
        tutor: { icon: Sparkles, color: 'text-foreground', label: 'Tutor' },
        socratic: { icon: GraduationCap, color: 'text-foreground', label: 'Socratic' },
        grader: { icon: ClipboardCheck, color: 'text-foreground', label: 'Grader' },
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
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
                    onClick={closeChatSidebar}
                />
            )}

            {/* Main Panel */}
            <div className={cn(
                "bg-background border-l border-border flex flex-col transition-transform duration-300 ease-in-out",
                embedded
                    ? "relative w-full h-full border-none z-0 translate-x-0"
                    : "fixed inset-y-0 right-0 z-50 w-full sm:w-[500px] transform shadow-lg",
                !embedded && (isChatSidebarOpen ? "translate-x-0" : "translate-x-full"),
                className
            )}>
                {/* Header */}
                <div className="h-14 border-b border-border flex items-center justify-between px-4 bg-background z-10 shrink-0 sticky top-0">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <button
                            onClick={() => setShowHistory(!showHistory)}
                            className="p-2 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center"
                        >
                            {showHistory ? <ChevronLeft className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
                        </button>

                        <div className="flex-1 min-w-0">
                            <h2 className="font-semibold text-foreground truncate text-sm">
                                {showHistory ? 'Lịch sử' : (activeConversation?.title || 'Hội thoại mới')}
                            </h2>
                            {!showHistory && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <ModeIcon className="w-3 h-3" />
                                    <span>{activeConversation ? modeConfig[activeConversation.mode].label : 'Tutor'}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {!embedded && (
                        <button
                            onClick={closeChatSidebar}
                            className="p-2 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-hidden relative flex">
                    {/* History Layer */}
                    <div className={cn(
                        "absolute inset-0 bg-background transition-opacity duration-300 z-20",
                        showHistory ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    )}>
                        <ChatHistoryPanel onClose={() => setShowHistory(false)} />
                    </div>

                    {/* Messages Layer */}
                    <div className="flex-1 flex flex-col w-full relative">
                        <div
                            ref={scrollContainerRef}
                            onScroll={handleScroll}
                            className="flex-1 overflow-y-auto p-4 space-y-6 bg-background scroll-smooth"
                        >
                            {messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center p-8 text-muted-foreground space-y-2">
                                    <div className="w-12 h-12 rounded border border-border flex items-center justify-center mb-2">
                                        <Sparkles className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-medium text-foreground">Bắt đầu trò chuyện</h3>
                                    <p className="text-sm">Hỏi tôi về bài học code.</p>
                                </div>
                            ) : (
                                messages.map((msg: Message) => (
                                    <div
                                        key={msg.id}
                                        className={cn(
                                            "flex w-full",
                                            msg.role === 'user' ? "justify-end" : "justify-start"
                                        )}
                                    >
                                        <div className={cn(
                                            "max-w-[85%] rounded px-3 py-2 text-sm border",
                                            msg.role === 'user'
                                                ? "bg-foreground text-background border-foreground"
                                                : "bg-muted text-foreground border-border"
                                        )}>
                                            {msg.role === 'assistant' ? (
                                                <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-stone-900 prose-pre:text-stone-50">
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
                                                                    <code className={cn("bg-stone-200 text-stone-800 px-1 py-0.5 rounded font-mono text-xs", className)} {...rest}>
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
                                <div className="flex justify-start pl-2">
                                    <div className="bg-muted border border-border rounded px-4 py-3 flex items-center gap-2 text-xs text-muted-foreground">
                                        <span className="animate-pulse">AI đang suy nghĩ...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Scroll to Bottom Button */}
                        {showScrollButton && (
                            <button
                                onClick={scrollToBottom}
                                className="absolute bottom-20 right-1/2 translate-x-1/2 bg-background border border-border text-muted-foreground hover:text-foreground p-2 rounded-full transition-colors z-10 shadow-sm"
                            >
                                <ArrowDown className="w-4 h-4" />
                            </button>
                        )}

                        {/* Input Area */}
                        <div className="border-t border-border p-4 bg-background">
                            <ChatInput
                                onSend={handleSendMessage}
                                isLoading={isLoading}
                                deepThink={deepThink}
                                onToggleDeepThink={() => setDeepThink(!deepThink)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
