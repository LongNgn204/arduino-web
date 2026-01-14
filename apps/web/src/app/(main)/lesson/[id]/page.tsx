'use client';

// Trang chi tiết bài giảng
// Render Markdown content với AI popup

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Clock, Loader2, Bot } from 'lucide-react';
import { remark } from 'remark';
import html from 'remark-html';
import AIPopup from '@/components/ai/AIPopup';

interface Lesson {
    id: string;
    title: string;
    content: string;
    duration: number | null;
}

interface Week {
    id: string;
    weekNumber: number;
    title: string;
}

export default function LessonPage() {
    const params = useParams();
    const lessonId = params.id as string;

    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [week, setWeek] = useState<Week | null>(null);
    const [htmlContent, setHtmlContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [showAI, setShowAI] = useState(false);
    const [selectedText, setSelectedText] = useState('');

    useEffect(() => {
        async function fetchLesson() {
            try {
                const res = await fetch(`/api/lessons/${lessonId}`, { credentials: 'include' });
                const data = await res.json();
                setLesson(data.lesson);
                setWeek(data.week);

                // Render Markdown to HTML
                if (data.lesson?.content) {
                    const result = await remark().use(html).process(data.lesson.content);
                    setHtmlContent(result.toString());
                }
            } catch (error) {
                console.error('Failed to fetch lesson:', error);
            } finally {
                setLoading(false);
            }
        }

        if (lessonId) {
            fetchLesson();
        }
    }, [lessonId]);

    // Bắt text được select để gửi cho AI
    const handleTextSelection = () => {
        const selection = window.getSelection();
        if (selection && selection.toString().trim()) {
            setSelectedText(selection.toString().trim());
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-arduino-teal" />
            </div>
        );
    }

    if (!lesson) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-muted-foreground">Bài giảng không tồn tại</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            {week && (
                                <Link
                                    href={`/week/${week.id}`}
                                    className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm mb-1"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    Tuần {week.weekNumber}: {week.title}
                                </Link>
                            )}
                            <h1 className="text-xl font-semibold">{lesson.title}</h1>
                        </div>

                        <div className="flex items-center gap-4">
                            {lesson.duration && (
                                <span className="text-sm text-muted-foreground flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {lesson.duration} phút
                                </span>
                            )}
                            <button
                                onClick={() => setShowAI(true)}
                                className="btn-arduino text-sm flex items-center gap-1.5"
                            >
                                <Bot className="h-4 w-4" />
                                Hỏi AI
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="container mx-auto px-6 py-8">
                <article
                    className="prose prose-lg dark:prose-invert max-w-4xl mx-auto"
                    onMouseUp={handleTextSelection}
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
            </main>

            {/* AI Popup */}
            {showAI && (
                <AIPopup
                    lessonId={lesson.id}
                    selectedText={selectedText}
                    onClose={() => {
                        setShowAI(false);
                        setSelectedText('');
                    }}
                />
            )}
        </div>
    );
}
