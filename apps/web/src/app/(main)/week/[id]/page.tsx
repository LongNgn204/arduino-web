'use client';

export const runtime = 'edge';

// Trang chi tiết tuần học
// Hiển thị lessons, labs, quizzes của tuần

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
    BookOpen, Code2, FileQuestion, Clock, Target,
    CheckCircle2, ChevronLeft, Loader2, Play
} from 'lucide-react';

interface Lesson {
    id: string;
    orderIndex: number;
    title: string;
    duration: number | null;
}

interface Lab {
    id: string;
    orderIndex: number;
    title: string;
    duration: number | null;
    simulatorUrl: string | null;
}

interface Week {
    id: string;
    weekNumber: number;
    title: string;
    overview: string;
    objectives: string[];
    examChecklist: string[];
    lessons: Lesson[];
    labs: Lab[];
}

export default function WeekPage() {
    const params = useParams();
    const weekId = params.id as string;

    const [week, setWeek] = useState<Week | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchWeek() {
            try {
                const res = await fetch(`/api/weeks/${weekId}`, { credentials: 'include' });
                const data = await res.json();
                setWeek(data.week);
            } catch (error) {
                console.error('Failed to fetch week:', error);
            } finally {
                setLoading(false);
            }
        }

        if (weekId) {
            fetchWeek();
        }
    }, [weekId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-arduino-teal" />
            </div>
        );
    }

    if (!week) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-muted-foreground">Tuần học không tồn tại</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="bg-gradient-to-r from-arduino-teal to-primary-600 text-white">
                <div className="container mx-auto px-6 py-8">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-1 text-white/80 hover:text-white mb-4 text-sm"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Quay lại Dashboard
                    </Link>

                    <div className="flex items-center gap-3 mb-2">
                        <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                            Tuần {week.weekNumber}
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold">{week.title}</h1>
                </div>
            </header>

            <main className="container mx-auto px-6 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Lessons */}
                        <section>
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-arduino-teal" />
                                Bài giảng
                            </h2>
                            <div className="space-y-3">
                                {week.lessons.map((lesson) => (
                                    <Link
                                        key={lesson.id}
                                        href={`/lesson/${lesson.id}`}
                                        className="flex items-center justify-between bg-card rounded-lg border border-border p-4 hover:border-arduino-teal/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="w-8 h-8 rounded-full bg-arduino-teal/10 text-arduino-teal flex items-center justify-center text-sm font-medium">
                                                {lesson.orderIndex}
                                            </span>
                                            <span className="font-medium">{lesson.title}</span>
                                        </div>
                                        {lesson.duration && (
                                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                                                <Clock className="h-4 w-4" />
                                                {lesson.duration} phút
                                            </span>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        </section>

                        {/* Labs */}
                        <section>
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <Code2 className="h-5 w-5 text-primary-600" />
                                Bài thực hành
                            </h2>
                            <div className="space-y-3">
                                {week.labs.map((lab) => (
                                    <Link
                                        key={lab.id}
                                        href={`/lab/${lab.id}`}
                                        className="flex items-center justify-between bg-card rounded-lg border border-border p-4 hover:border-primary-500/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="w-8 h-8 rounded-full bg-primary-500/10 text-primary-600 flex items-center justify-center text-sm font-medium">
                                                {lab.orderIndex}
                                            </span>
                                            <div>
                                                <span className="font-medium">{lab.title}</span>
                                                {lab.simulatorUrl && (
                                                    <span className="ml-2 inline-flex items-center gap-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">
                                                        <Play className="h-3 w-3" />
                                                        Simulator
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        {lab.duration && (
                                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                                                <Clock className="h-4 w-4" />
                                                {lab.duration} phút
                                            </span>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        </section>

                        {/* Quiz button */}
                        <section>
                            <Link
                                href={`/quiz/quiz-0${week.weekNumber}`}
                                className="flex items-center justify-between bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800 p-4 hover:shadow-md transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <FileQuestion className="h-6 w-6 text-yellow-600" />
                                    <div>
                                        <span className="font-medium">Quiz Tuần {week.weekNumber}</span>
                                        <p className="text-sm text-muted-foreground">Kiểm tra kiến thức</p>
                                    </div>
                                </div>
                                <span className="btn-arduino text-sm">
                                    Làm Quiz
                                </span>
                            </Link>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Objectives */}
                        {week.objectives.length > 0 && (
                            <div className="bg-card rounded-xl border border-border p-5">
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                    <Target className="h-5 w-5 text-arduino-teal" />
                                    Mục tiêu
                                </h3>
                                <ul className="space-y-2">
                                    {week.objectives.map((obj, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm">
                                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                            <span>{obj}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Exam Checklist */}
                        {week.examChecklist.length > 0 && (
                            <div className="bg-card rounded-xl border border-border p-5">
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                    <FileQuestion className="h-5 w-5 text-yellow-600" />
                                    Checklist thi
                                </h3>
                                <ul className="space-y-2">
                                    {week.examChecklist.map((item, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm">
                                            <span className="w-5 h-5 rounded bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 flex items-center justify-center text-xs shrink-0">
                                                {i + 1}
                                            </span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
