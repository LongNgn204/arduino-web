import { useState, useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';

interface TextSelectionHandlerProps {
    onAskAi: (text: string) => void;
}

export default function TextSelectionHandler({ onAskAi }: TextSelectionHandlerProps) {
    const [selection, setSelection] = useState<{ text: string; x: number; y: number } | null>(null);
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleSelectionChange = () => {
            const selectedText = window.getSelection()?.toString().trim();

            if (selectedText && selectedText.length > 5) {
                const range = window.getSelection()?.getRangeAt(0);
                const rect = range?.getBoundingClientRect();

                if (rect) {
                    setSelection({
                        text: selectedText,
                        x: rect.left + rect.width / 2, // Center horizontally
                        y: rect.top - 10 // Position above
                    });
                }
            } else {
                setSelection(null);
            }
        };

        document.addEventListener('mouseup', handleSelectionChange);
        document.addEventListener('keyup', handleSelectionChange); // Handle keyboard selection

        return () => {
            document.removeEventListener('mouseup', handleSelectionChange);
            document.removeEventListener('keyup', handleSelectionChange);
        };
    }, []);

    // Close popup if clicking outside (handled by logic: clicking outside usually clears selection)
    // But we need to handle mousedown on the popup itself so it doesn't clear selection immediately before action
    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent clearing selection
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
            className="fixed z-[9999] mb-2 cursor-pointer animate-fade-in"
            onMouseDown={handleMouseDown}
            onClick={() => {
                onAskAi(selection.text);
                window.getSelection()?.removeAllRanges(); // Clear selection after asking
                setSelection(null);
            }}
        >
            <div className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all text-sm font-semibold">
                <Sparkles className="w-4 h-4 animate-pulse" />
                Hỏi AI
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-teal-500"></div>
            </div>
        </div>
    );
}
