// ChatHistoryPanel.tsx
import { MessageSquare, Plus, Trash2, Search, Clock } from 'lucide-react';
import { useChatStore } from '../../stores/chatStore';
import { cn } from '../ui/Card'; // Assuming utility exists

// Helper format time simple
const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Vừa xong';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} ngày trước`;

    return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit' }).format(date);
};

interface ChatHistoryPanelProps {
    onClose?: () => void;
}

export default function ChatHistoryPanel({ onClose }: ChatHistoryPanelProps) {
    const {
        conversations,
        activeConversationId,
        createConversation,
        setActiveConversation,
        deleteConversation
    } = useChatStore();

    const handleCreateNew = () => {
        createConversation();
        // Mobile/Tablet UX: might want to close history panel after creating
        if (onClose) onClose();
    };

    const handleSelect = (id: string) => {
        setActiveConversation(id);
        if (onClose) onClose();
    };

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (window.confirm('Bạn có chắc muốn xóa cuộc hội thoại này?')) {
            deleteConversation(id);
        }
    };

    return (
        <div className="flex flex-col h-full bg-background border-r border-border w-full md:w-80">
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center justify-between bg-background">
                <h2 className="font-semibold text-foreground flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    Lịch sử Chat
                </h2>
                <button
                    onClick={handleCreateNew}
                    className="p-2 bg-primary text-primary-foreground hover:opacity-90 rounded-md transition-opacity"
                    title="Cuộc hội thoại mới"
                >
                    <Plus className="w-3.5 h-3.5" />
                </button>
            </div>

            {/* Search (Placeholder for v2) */}
            <div className="p-3 border-b border-border">
                <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        className="w-full pl-9 pr-3 py-1.5 text-sm bg-muted border border-border rounded focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
                {conversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-muted-foreground text-sm">
                        <MessageSquare className="w-8 h-8 mb-2 opacity-20" />
                        <p>Chưa có cuộc hội thoại nào</p>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {conversations.map((conv) => (
                            <div
                                key={conv.id}
                                onClick={() => handleSelect(conv.id)}
                                className={cn(
                                    "group flex items-start gap-3 p-3 rounded-md cursor-pointer transition-colors border border-transparent",
                                    activeConversationId === conv.id
                                        ? "bg-muted border-border"
                                        : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <div className={cn(
                                    "w-6 h-6 shrink-0 rounded flex items-center justify-center text-[10px] font-bold mt-0.5",
                                    activeConversationId === conv.id
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted text-muted-foreground border border-border"
                                )}>
                                    AI
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className={cn(
                                        "font-medium truncate text-sm mb-0.5",
                                        activeConversationId === conv.id ? "text-foreground" : "text-inherit"
                                    )}>
                                        {conv.title}
                                    </h3>
                                    <p className="text-[10px] text-muted-foreground/70">
                                        {formatRelativeTime(new Date(conv.updatedAt))}
                                    </p>
                                </div>
                                <button
                                    onClick={(e) => handleDelete(e, conv.id)}
                                    className="opacity-0 group-hover:opacity-100 p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-all"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer info */}
            <div className="p-3 text-[10px] text-center text-muted-foreground bg-muted/30 border-t border-border">
                Dữ liệu được lưu trên trình duyệt
            </div>
        </div>
    );
}
