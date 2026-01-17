// ChatInput.tsx
import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, FileText, X, BrainCircuit } from 'lucide-react';
import { cn } from '../ui/Card';

interface Attachment {
    type: 'image' | 'text';
    content: string;
    name: string;
}

interface ChatInputProps {
    onSend: (message: string, attachments: Attachment[]) => Promise<void>;
    isLoading?: boolean;
    placeholder?: string;
    className?: string;
    deepThink?: boolean;
    onToggleDeepThink?: () => void;
}

export default function ChatInput({
    onSend,
    isLoading,
    placeholder = "Nhập tin nhắn...",
    className,
    deepThink = false,
    onToggleDeepThink
}: ChatInputProps) {
    const [input, setInput] = useState('');
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.style.height = 'auto';
            inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + 'px';
        }
    }, [input]);

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
                } else {
                    // Assume text
                    try {
                        const text = await file.text();
                        newAttachments.push({
                            type: 'text',
                            content: text,
                            name: file.name
                        });
                    } catch (err) {
                        console.error("Read file error", err);
                        alert(`Không thể đọc file ${file.name}`);
                    }
                }
            }
            setAttachments(prev => [...prev, ...newAttachments]);
            e.target.value = ''; // Reset input
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        if ((!input.trim() && attachments.length === 0) || isLoading) return;

        const msg = input;
        const att = [...attachments]; // Copy for callback

        // Optimistic clear
        setInput('');
        setAttachments([]);
        if (inputRef.current) inputRef.current.style.height = 'auto';

        await onSend(msg, att);
    };

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className={cn("bg-white border-t border-gray-100 p-4", className)}>
            {/* Attachments Preview */}
            {attachments.length > 0 && (
                <div className="flex gap-2 overflow-x-auto py-2 mb-2 scrollbar-thin">
                    {attachments.map((file, idx) => (
                        <div key={idx} className="relative group flex-shrink-0 animate-fade-in">
                            <div className="w-14 h-14 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
                                {file.type === 'image' ? (
                                    <img src={file.content} alt={file.name} className="w-full h-full object-cover" />
                                ) : (
                                    <FileText className="w-6 h-6 text-gray-400" />
                                )}
                            </div>
                            <button
                                onClick={() => removeAttachment(idx)}
                                className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 shadow-md hover:bg-red-600 transition-colors"
                            >
                                <X className="w-3 h-3" />
                            </button>
                            <p className="text-[9px] text-gray-500 truncate w-14 text-center mt-0.5">{file.name}</p>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex items-end gap-2 bg-gray-50/80 backdrop-blur p-2 rounded-2xl border border-gray-200 focus-within:ring-2 focus-within:ring-arduino-teal/20 focus-within:border-arduino-teal transition-all shadow-sm hover:shadow-md hover:bg-white group">
                <label className="p-2 text-gray-400 hover:text-arduino-teal cursor-pointer transition-colors rounded-xl hover:bg-indigo-50 flex-shrink-0 active:scale-95">
                    <Paperclip className="w-5 h-5" />
                    <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleFileSelect}
                    />
                </label>

                {/* Deep Think Toggle */}
                {onToggleDeepThink && (
                    <button
                        onClick={onToggleDeepThink}
                        className={cn(
                            "p-2 rounded-xl transition-all flex-shrink-0 relative active:scale-95",
                            deepThink
                                ? "text-indigo-600 bg-indigo-50 hover:bg-indigo-100 shadow-sm"
                                : "text-gray-400 hover:text-indigo-500 hover:bg-gray-100"
                        )}
                        title={deepThink ? "Tắt Suy nghĩ sâu" : "Bật Suy nghĩ sâu (Reasoning)"}
                    >
                        <BrainCircuit className={cn("w-5 h-5", deepThink && "animate-pulse")} />
                        {deepThink && (
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-white animate-bounce-in" />
                        )}
                    </button>
                )}

                <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    rows={1}
                    className="flex-1 bg-transparent border-none focus:ring-0 text-gray-800 text-sm py-2 px-1 max-h-32 resize-none placeholder:text-gray-400 leading-relaxed"
                    disabled={isLoading}
                />

                <button
                    onClick={handleSubmit}
                    disabled={(!input.trim() && attachments.length === 0) || isLoading}
                    className="p-2 bg-gradient-to-br from-arduino-teal to-teal-600 hover:from-teal-500 hover:to-teal-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-xl transition-all shadow-md shadow-arduino-teal/20 disabled:shadow-none flex-shrink-0 active:scale-95"
                >
                    <Send className="w-4 h-4" />
                </button>
            </div>

            <div className="text-[10px] text-gray-400 text-center mt-2">
                AI có thể mắc lỗi. Hãy kiểm tra thông tin quan trọng.
            </div>
        </div>
    );
}
