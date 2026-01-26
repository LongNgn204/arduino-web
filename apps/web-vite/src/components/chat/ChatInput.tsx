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
        <div className={cn("bg-background border-t border-border p-4", className)}>
            {/* Attachments Preview */}
            {attachments.length > 0 && (
                <div className="flex gap-2 overflow-x-auto py-2 mb-2">
                    {attachments.map((file, idx) => (
                        <div key={idx} className="relative group flex-shrink-0">
                            <div className="w-12 h-12 rounded border border-border bg-muted flex items-center justify-center overflow-hidden">
                                {file.type === 'image' ? (
                                    <img src={file.content} alt={file.name} className="w-full h-full object-cover" />
                                ) : (
                                    <FileText className="w-5 h-5 text-muted-foreground" />
                                )}
                            </div>
                            <button
                                onClick={() => removeAttachment(idx)}
                                className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground rounded-full p-0.5"
                            >
                                <X className="w-3 h-3" />
                            </button>
                            <p className="text-[9px] text-muted-foreground truncate w-12 text-center mt-0.5">{file.name}</p>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex items-end gap-2 bg-background border border-input rounded-md p-2 focus-within:ring-1 focus-within:ring-ring transition-shadow">
                <label className="p-2 text-muted-foreground hover:text-foreground cursor-pointer transition-colors rounded hover:bg-muted flex-shrink-0">
                    <Paperclip className="w-4 h-4" />
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
                            "p-2 rounded transition-colors flex-shrink-0 relative",
                            deepThink
                                ? "text-primary bg-primary/10"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                        title={deepThink ? "Tắt Suy nghĩ sâu" : "Bật Suy nghĩ sâu (Reasoning)"}
                    >
                        <BrainCircuit className={cn("w-4 h-4", deepThink && "animate-pulse")} />
                    </button>
                )}

                <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    rows={1}
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-1 max-h-32 resize-none placeholder:text-muted-foreground leading-relaxed"
                    disabled={isLoading}
                />

                <button
                    onClick={handleSubmit}
                    disabled={(!input.trim() && attachments.length === 0) || isLoading}
                    className="p-2 bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-opacity flex-shrink-0"
                >
                    <Send className="w-4 h-4" />
                </button>
            </div>

            <div className="text-[10px] text-muted-foreground text-center mt-2">
                AI có thể mắc lỗi. Hãy kiểm tra thông tin quan trọng.
            </div>
        </div>
    );
}
