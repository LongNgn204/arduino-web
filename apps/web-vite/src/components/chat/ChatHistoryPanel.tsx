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
        <div className="flex flex-col h-full bg-white border-r border-gray-200 w-full md:w-80">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <h2 className="font-bold text-gray-800 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-500" />
                    Lịch sử Chat
                </h2>
                <button
                    onClick={handleCreateNew}
                    className="p-2 bg-arduino-teal hover:bg-teal-600 text-white rounded-lg shadow-sm transition-colors"
                    title="Cuộc hội thoại mới"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>

            {/* Search (Placeholder for v2) */}
            <div className="p-3 border-b border-gray-100">
                <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-arduino-teal focus:ring-1 focus:ring-arduino-teal/20"
                    />
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-200">
                {conversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-gray-400 text-sm">
                        <MessageSquare className="w-8 h-8 mb-2 opacity-50" />
                        <p>Chưa có cuộc hội thoại nào</p>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {conversations.map((conv) => (
                            <div
                                key={conv.id}
                                onClick={() => handleSelect(conv.id)}
                                className={cn(
                                    "group flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all hover:bg-gray-50 border border-transparent",
                                    activeConversationId === conv.id ? "bg-arduino-mint border-teal-100 shadow-sm" : ""
                                )}
                            >
                                <div className={cn(
                                    "w-8 h-8 shrink-0 rounded-lg flex items-center justify-center text-xs font-bold mt-0.5",
                                    activeConversationId === conv.id ? "bg-white text-arduino-teal shadow-sm" : "bg-gray-100 text-gray-500 group-hover:bg-white group-hover:shadow-sm"
                                )}>
                                    AI
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className={cn(
                                        "font-medium truncate text-sm mb-0.5",
                                        activeConversationId === conv.id ? "text-teal-900" : "text-gray-700"
                                    )}>
                                        {conv.title}
                                    </h3>
                                    <p className="text-[10px] text-gray-400">
                                        {formatRelativeTime(new Date(conv.updatedAt))}
                                    </p>
                                </div>
                                <button
                                    onClick={(e) => handleDelete(e, conv.id)}
                                    className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer info */}
            <div className="p-3 text-[10px] text-center text-gray-400 bg-gray-50 border-t border-gray-100">
                Dữ liệu được lưu trên trình duyệt
            </div>
        </div>
    );
}
