// chatStore.ts - Zustand store quản lý lịch sử chat AI với localStorage sync
// Chú thích: Store này quản lý nhiều cuộc hội thoại, mỗi conversation có danh sách messages riêng

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ==========================================
// INTERFACES
// ==========================================

export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    // Chú thích: Có thể mở rộng thêm attachments, reactions, etc.
}

export interface Conversation {
    id: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
    mode: 'tutor' | 'socratic' | 'grader';
}

interface ChatState {
    // State
    conversations: Conversation[];
    messages: Record<string, Message[]>; // conversationId -> messages[]
    activeConversationId: string | null;
    isChatSidebarOpen: boolean;

    // Actions
    openChatSidebar: () => void;
    closeChatSidebar: () => void;
    toggleChatSidebar: () => void;

    createConversation: (mode?: 'tutor' | 'socratic' | 'grader') => string;
    setActiveConversation: (id: string | null) => void;
    updateConversationTitle: (id: string, title: string) => void;

    addMessage: (conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => void;
    deleteConversation: (id: string) => void;
    clearAllHistory: () => void;

    // Helpers
    getActiveMessages: () => Message[];
    getConversationById: (id: string) => Conversation | undefined;
}

// ==========================================
// UTILS
// ==========================================

// Chú thích: Generate ID đơn giản, có thể thay bằng uuid nếu cần
const generateId = () => `conv_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
const generateMessageId = () => `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

// Chú thích: Tạo tiêu đề tự động từ nội dung tin nhắn đầu tiên
const generateTitle = (content: string): string => {
    const maxLen = 40;
    const cleaned = content.replace(/\n/g, ' ').trim();
    if (cleaned.length <= maxLen) return cleaned;
    return cleaned.slice(0, maxLen) + '...';
};

// ==========================================
// STORE
// ==========================================

export const useChatStore = create<ChatState>()(
    persist(
        (set, get) => ({
            // Initial state
            conversations: [],
            messages: {},
            activeConversationId: null,
            isChatSidebarOpen: false,

            // Sidebar controls
            openChatSidebar: () => set({ isChatSidebarOpen: true }),
            closeChatSidebar: () => set({ isChatSidebarOpen: false }),
            toggleChatSidebar: () => set((state) => ({ isChatSidebarOpen: !state.isChatSidebarOpen })),

            // Conversation management
            createConversation: (mode = 'tutor') => {
                const id = generateId();
                const now = new Date();
                const newConversation: Conversation = {
                    id,
                    title: 'Cuộc hội thoại mới',
                    createdAt: now,
                    updatedAt: now,
                    mode,
                };

                set((state) => ({
                    conversations: [newConversation, ...state.conversations],
                    messages: { ...state.messages, [id]: [] },
                    activeConversationId: id,
                }));

                return id;
            },

            setActiveConversation: (id) => {
                set({ activeConversationId: id });
            },

            updateConversationTitle: (id, title) => {
                set((state) => ({
                    conversations: state.conversations.map((conv) =>
                        conv.id === id ? { ...conv, title, updatedAt: new Date() } : conv
                    ),
                }));
            },

            addMessage: (conversationId, messageData) => {
                const message: Message = {
                    id: generateMessageId(),
                    ...messageData,
                    timestamp: new Date(),
                };

                set((state) => {
                    const existingMessages = state.messages[conversationId] || [];
                    const newMessages = [...existingMessages, message];

                    // Chú thích: Tự động cập nhật title từ tin nhắn đầu tiên của user
                    let updatedConversations = state.conversations;
                    if (messageData.role === 'user' && existingMessages.length === 0) {
                        updatedConversations = state.conversations.map((conv) =>
                            conv.id === conversationId
                                ? { ...conv, title: generateTitle(messageData.content), updatedAt: new Date() }
                                : conv
                        );
                    } else {
                        // Cập nhật updatedAt
                        updatedConversations = state.conversations.map((conv) =>
                            conv.id === conversationId ? { ...conv, updatedAt: new Date() } : conv
                        );
                    }

                    return {
                        messages: { ...state.messages, [conversationId]: newMessages },
                        conversations: updatedConversations,
                    };
                });
            },

            deleteConversation: (id) => {
                set((state) => {
                    const { [id]: removed, ...restMessages } = state.messages;
                    const newConversations = state.conversations.filter((c) => c.id !== id);

                    // Chú thích: Nếu đang xem conversation bị xóa, reset về null hoặc conversation khác
                    let newActiveId = state.activeConversationId;
                    if (state.activeConversationId === id) {
                        newActiveId = newConversations.length > 0 ? newConversations[0].id : null;
                    }

                    return {
                        conversations: newConversations,
                        messages: restMessages,
                        activeConversationId: newActiveId,
                    };
                });
            },

            clearAllHistory: () => {
                set({
                    conversations: [],
                    messages: {},
                    activeConversationId: null,
                });
            },

            // Helpers
            getActiveMessages: () => {
                const state = get();
                if (!state.activeConversationId) return [];
                return state.messages[state.activeConversationId] || [];
            },

            getConversationById: (id) => {
                return get().conversations.find((c) => c.id === id);
            },
        }),
        {
            name: 'arduino-chat-history', // localStorage key
            storage: createJSONStorage(() => localStorage),
            // Chú thích: Chỉ persist những field cần thiết, bỏ qua UI state
            partialize: (state) => ({
                conversations: state.conversations,
                messages: state.messages,
            }),
            // Chú thích: Deserialize dates từ JSON
            onRehydrateStorage: () => (state) => {
                if (state) {
                    // Convert date strings back to Date objects
                    state.conversations = state.conversations.map((conv) => ({
                        ...conv,
                        createdAt: new Date(conv.createdAt),
                        updatedAt: new Date(conv.updatedAt),
                    }));

                    Object.keys(state.messages).forEach((convId) => {
                        state.messages[convId] = state.messages[convId].map((msg) => ({
                            ...msg,
                            timestamp: new Date(msg.timestamp),
                        }));
                    });
                }
            },
        }
    )
);
