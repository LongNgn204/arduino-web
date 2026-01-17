// chatStore.ts - Zustand store quản lý lịch sử chat AI (Sync with Backend)
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const API_BASE = import.meta.env.PROD
    ? 'https://arduino-workers.stu725114073.workers.dev'
    : '';

// ==========================================
// INTERFACES
// ==========================================

export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
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
    isLoadingHistory: boolean;

    // Actions
    openChatSidebar: () => void;
    closeChatSidebar: () => void;
    toggleChatSidebar: () => void;

    createConversation: (mode?: 'tutor' | 'socratic' | 'grader') => string;
    setActiveConversation: (id: string | null) => void;

    // API Actions
    fetchConversations: () => Promise<void>;
    loadConversationDetails: (id: string) => Promise<void>;
    deleteConversation: (id: string) => Promise<void>;

    // Local/Optimistic Actions
    addMessage: (conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => void;
    updateConversationTitle: (id: string, title: string) => void;

    // Helpers
    getActiveMessages: () => Message[];
    getConversationById: (id: string) => Conversation | undefined;
}

// ==========================================
// UTILS
// ==========================================

const generateId = () => `conv_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
const generateMessageId = () => `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

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
            isLoadingHistory: false,

            // Sidebar controls
            openChatSidebar: () => {
                set({ isChatSidebarOpen: true });
                get().fetchConversations(); // Sync on open
            },
            closeChatSidebar: () => set({ isChatSidebarOpen: false }),
            toggleChatSidebar: () => {
                const isOpen = !get().isChatSidebarOpen;
                set({ isChatSidebarOpen: isOpen });
                if (isOpen) get().fetchConversations();
            },

            // API Actions
            fetchConversations: async () => {
                set({ isLoadingHistory: true });
                try {
                    const res = await fetch(`${API_BASE}/api/ai/history`);
                    if (res.ok) {
                        const { data } = await res.json();
                        // Parse dates
                        const parsed = data.map((c: any) => ({
                            ...c,
                            createdAt: new Date(c.createdAt),
                            updatedAt: new Date(c.updatedAt)
                        }));
                        set({ conversations: parsed, isLoadingHistory: false });
                    }
                } catch (e) {
                    console.error('Failed to fetch conversations', e);
                    set({ isLoadingHistory: false });
                }
            },

            loadConversationDetails: async (id) => {
                const { messages } = get();
                if (messages[id] && messages[id].length > 0) return; // Cache hit

                try {
                    const res = await fetch(`${API_BASE}/api/ai/history/${id}`);
                    if (res.ok) {
                        const { data } = await res.json();
                        const parsedMessages = data.messages.map((m: any) => ({
                            id: m.id,
                            role: m.role,
                            content: m.content,
                            timestamp: new Date(m.createdAt)
                        }));
                        set((state) => ({
                            messages: { ...state.messages, [id]: parsedMessages }
                        }));
                    }
                } catch (e) {
                    console.error('Failed to load conversation details', e);
                }
            },

            deleteConversation: async (id) => {
                // Optimistic UI
                set((state) => ({
                    conversations: state.conversations.filter(c => c.id !== id),
                    activeConversationId: state.activeConversationId === id ? null : state.activeConversationId
                }));

                try {
                    await fetch(`${API_BASE}/api/ai/history/${id}`, { method: 'DELETE' });
                } catch (e) {
                    console.error('Failed to delete conversation', e);
                    get().fetchConversations(); // Rollback/Sync on error
                }
            },

            // Conversation management
            createConversation: (mode = 'tutor') => {
                const id = generateId(); // Temp ID, backend sync later? 
                // Note: For now we use local ID, backend will create entry on first message sync.
                // Or better: we let backend create ID. But to be fast, we use local ID.

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
                if (id) get().loadConversationDetails(id);
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

                    // Optimistic update title if first message
                    let updatedConversations = state.conversations;
                    if (messageData.role === 'user' && existingMessages.length === 0) {
                        const maxLen = 40;
                        const cleaned = messageData.content.replace(/\n/g, ' ').trim();
                        const title = cleaned.length <= maxLen ? cleaned : cleaned.slice(0, maxLen) + '...';

                        updatedConversations = state.conversations.map((conv) =>
                            conv.id === conversationId ? { ...conv, title, updatedAt: new Date() } : conv
                        );
                    }

                    return {
                        messages: { ...state.messages, [conversationId]: newMessages },
                        conversations: updatedConversations,
                    };
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
            name: 'arduino-chat-store-v2', // New key to avoid conflict
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                // Only persist UI preference, data comes from API
                isChatSidebarOpen: state.isChatSidebarOpen
            }),
        }
    )
);
