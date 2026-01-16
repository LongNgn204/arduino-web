import { useState, useEffect, useRef } from 'react';
import { Sparkles, X, Loader2, ArrowRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ContextualAiAssistantProps {
    onOpenFullChat: (initialQuestion: string) => void;
}

const API_BASE = import.meta.env.PROD
    ? 'https://arduino-workers.stu725114073.workers.dev'
    : '';

export default function ContextualAiAssistant({ onOpenFullChat }: ContextualAiAssistantProps) {
    const [selection, setSelection] = useState<{ text: string; x: number; y: number } | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [answer, setAnswer] = useState<string | null>(null);
    const popupRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Handle text selection
    useEffect(() => {
        const handleSelectionChange = () => {
            if (isOpen) return; // Don't move if already open

            // Clear previous timeout to debounce
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                const sel = window.getSelection();
                const selectedText = sel?.toString().trim();

                // REQUIREMENTS:
                // 1. Text length > 10 chars (ignore random clicks)
                // 2. Not inside input/textarea
                // 3. Optional: Inside specific containers (e.g. #lesson-content)
                //    (Skipping specific container for now to allow asking about UI, but checking input)

                if (selectedText && selectedText.length > 10) {
                    // Check if inside input
                    const anchorNode = sel?.anchorNode;
                    const isInput = anchorNode instanceof HTMLElement && (anchorNode.tagName === 'INPUT' || anchorNode.tagName === 'TEXTAREA');
                    if (isInput) return;

                    const range = sel?.getRangeAt(0);
                    const rect = range?.getBoundingClientRect();

                    if (rect && rect.width > 0) {
                        // Calculate position ensuring it stays on screen
                        const x = rect.left + rect.width / 2;
                        const y = rect.top - 10;

                        setSelection({
                            text: selectedText,
                            x: Math.min(Math.max(x, 50), window.innerWidth - 50), // Clamp X
                            y: Math.max(y, 20) // Clamp Y
                        });
                    }
                } else {
                    if (!isOpen) setSelection(null);
                }
            }, 600); // 600ms debounce (wait for user to stop selecting)
        };

        const handleMouseUp = (e: MouseEvent) => {
            // Check if clicking inside our popup
            if (popupRef.current && popupRef.current.contains(e.target as Node)) {
                return;
            }
            handleSelectionChange();
        };

        const handleKeyUp = () => {
            // Often needed for keyboard selection (Shift+Arrows)
            handleSelectionChange();
        };

        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('keyup', handleKeyUp);

        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('keyup', handleKeyUp);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [isOpen]);

    const handleAskAi = async () => {
        if (!selection) return;
        setIsOpen(true);
        setIsLoading(true);
        setAnswer(null);

        try {
            const res = await fetch(`${API_BASE}/api/ai/tutor`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    mode: 'tutor', // Default to tutor for quick explain
                    userQuestion: `Giải thích ngắn gọn đoạn này: "${selection.text}"`,
                    stream: false
                }),
            });

            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setAnswer(data.response || 'Không thể giải thích.');
        } catch (error) {
            console.error(error);
            setAnswer('Lỗi kết nối AI. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    const closePopup = () => {
        setIsOpen(false);
        setSelection(null);
        setAnswer(null);
        window.getSelection()?.removeAllRanges();
    };

    if (!selection) return null;

    return (
        <div
            ref={popupRef}
            style={{
                top: selection.y,
                left: selection.x,
                transform: 'translate(-50%, -100%)',
            }}
            className="fixed z-[9999] mb-4 animate-fade-in"
        >
            {!isOpen ? (
                // Ask Button
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault(); // Prevent text deselection on touch
                        handleAskAi();
                    }}
                    className="flex items-center gap-2 bg-arduino-teal text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all text-sm font-bold ring-2 ring-white/50"
                >
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    Hỏi AI
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-arduino-teal"></div>
                </button>
            ) : (
                // Popup Content
                <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-80 md:w-96 overflow-hidden flex flex-col max-h-[80vh]">
                    {/* Header */}
                    <div className="flex items-center justify-between p-3 border-b border-gray-100 bg-gray-50">
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                            <Sparkles className="w-4 h-4 text-arduino-teal" />
                            AI Giải thích
                        </div>
                        <button onClick={closePopup} className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-gray-100">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-4 overflow-y-auto text-sm text-gray-700 leading-relaxed min-h-[100px] max-h-60 scrollbar-thin">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-4 gap-2 text-gray-400">
                                <Loader2 className="w-6 h-6 animate-spin text-arduino-teal" />
                                <span className="text-xs">Đang đọc & suy nghĩ...</span>
                            </div>
                        ) : (
                            <div className="prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2 prose-pre:bg-gray-50">
                                <ReactMarkdown>{answer || ''}</ReactMarkdown>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {!isLoading && (
                        <div className="p-2 border-t border-gray-100 bg-gray-50 flex justify-end gap-2">
                            <button
                                onClick={closePopup}
                                className="px-3 py-1.5 text-xs font-semibold text-gray-500 hover:text-gray-700"
                            >
                                Đóng
                            </button>
                            <button
                                onClick={() => onOpenFullChat(selection.text)}
                                className="flex items-center gap-1 text-xs font-semibold text-white bg-arduino-teal px-3 py-1.5 rounded-lg hover:bg-teal-600 transition-colors shadow-sm"
                            >
                                Chat chi tiết <ArrowRight className="w-3 h-3" />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
