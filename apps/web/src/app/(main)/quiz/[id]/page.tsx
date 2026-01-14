'use client';

// Trang làm quiz
// Hiển thị câu hỏi, chấm điểm, hiển thị giải thích

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ChevronLeft, Clock, Loader2, CheckCircle2, XCircle,
    Trophy, RotateCcw
} from 'lucide-react';

interface Question {
    id: string;
    orderIndex: number;
    type: 'single' | 'multiple' | 'truefalse';
    content: string;
    options: string[];
    points: number;
}

interface Quiz {
    id: string;
    title: string;
    description: string | null;
    timeLimit: number | null;
    passingScore: number;
    questions: Question[];
}

interface QuizResult {
    questionId: string;
    correct: boolean;
    userAnswer: number | number[];
    correctAnswer: number | number[];
    explanation: string | null;
    points: number;
    earnedPoints: number;
}

interface SubmitResult {
    score: number;
    maxScore: number;
    percentage: number;
    passed: boolean;
    passingScore: number;
    results: QuizResult[];
}

export default function QuizPage() {
    const params = useParams();
    const router = useRouter();
    const quizId = params.id as string;

    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // User answers: { questionId: answerIndex }
    const [answers, setAnswers] = useState<Record<string, number | number[]>>({});

    // Submit result
    const [result, setResult] = useState<SubmitResult | null>(null);

    useEffect(() => {
        async function fetchQuiz() {
            try {
                const res = await fetch(`/api/quizzes/${quizId}`, { credentials: 'include' });
                if (res.status === 401) {
                    router.push('/login');
                    return;
                }
                const data = await res.json();
                setQuiz(data.quiz);
            } catch (error) {
                console.error('Failed to fetch quiz:', error);
            } finally {
                setLoading(false);
            }
        }

        if (quizId) {
            fetchQuiz();
        }
    }, [quizId, router]);

    const handleSelectAnswer = (questionId: string, optionIndex: number, isMultiple: boolean) => {
        setAnswers(prev => {
            if (isMultiple) {
                // Multiple choice - toggle selection
                const current = (prev[questionId] as number[]) || [];
                const updated = current.includes(optionIndex)
                    ? current.filter(i => i !== optionIndex)
                    : [...current, optionIndex];
                return { ...prev, [questionId]: updated };
            } else {
                // Single choice
                return { ...prev, [questionId]: optionIndex };
            }
        });
    };

    const handleSubmit = async () => {
        if (!quiz) return;

        // Kiểm tra đã trả lời hết chưa
        const unanswered = quiz.questions.filter(q => answers[q.id] === undefined);
        if (unanswered.length > 0) {
            if (!confirm(`Bạn còn ${unanswered.length} câu chưa trả lời. Nộp bài?`)) {
                return;
            }
        }

        setSubmitting(true);

        try {
            const res = await fetch(`/api/quizzes/${quizId}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ answers }),
            });

            const data = await res.json();
            setResult(data);
        } catch (error) {
            console.error('Failed to submit quiz:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleRetry = () => {
        setAnswers({});
        setResult(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-arduino-teal" />
            </div>
        );
    }

    if (!quiz) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-muted-foreground">Quiz không tồn tại</p>
            </div>
        );
    }

    // Result view
    if (result) {
        const resultMap = Object.fromEntries(result.results.map(r => [r.questionId, r]));

        return (
            <div className="min-h-screen bg-background">
                <header className="bg-card border-b border-border">
                    <div className="container mx-auto px-6 py-4">
                        <Link href="/dashboard" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm mb-2">
                            <ChevronLeft className="h-4 w-4" />
                            Quay lại Dashboard
                        </Link>
                        <h1 className="text-xl font-semibold">{quiz.title} - Kết quả</h1>
                    </div>
                </header>

                <main className="container mx-auto px-6 py-8 max-w-3xl">
                    {/* Score card */}
                    <div className={`rounded-2xl p-8 text-center mb-8 ${result.passed
                            ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20'
                            : 'bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20'
                        }`}>
                        <Trophy className={`h-16 w-16 mx-auto mb-4 ${result.passed ? 'text-green-500' : 'text-red-500'}`} />
                        <h2 className="text-3xl font-bold mb-2">
                            {result.score}/{result.maxScore} điểm
                        </h2>
                        <p className="text-lg mb-1">
                            {result.percentage}% - {result.passed ? 'ĐẠT' : 'CHƯA ĐẠT'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Điểm cần đạt: {result.passingScore}%
                        </p>

                        <button
                            onClick={handleRetry}
                            className="mt-6 btn-arduino inline-flex items-center gap-2"
                        >
                            <RotateCcw className="h-4 w-4" />
                            Làm lại
                        </button>
                    </div>

                    {/* Questions review */}
                    <div className="space-y-6">
                        {quiz.questions.map((q, idx) => {
                            const qResult = resultMap[q.id];

                            return (
                                <div
                                    key={q.id}
                                    className={`bg-card rounded-xl border p-5 ${qResult?.correct ? 'border-green-300' : 'border-red-300'
                                        }`}
                                >
                                    <div className="flex items-start gap-3 mb-4">
                                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${qResult?.correct
                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                            }`}>
                                            {idx + 1}
                                        </span>
                                        <div className="flex-1">
                                            <p className="font-medium">{q.content}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {qResult?.earnedPoints}/{q.points} điểm
                                            </p>
                                        </div>
                                        {qResult?.correct ? (
                                            <CheckCircle2 className="h-6 w-6 text-green-500" />
                                        ) : (
                                            <XCircle className="h-6 w-6 text-red-500" />
                                        )}
                                    </div>

                                    {/* Options */}
                                    <div className="space-y-2 ml-11">
                                        {q.options.map((opt, optIdx) => {
                                            const isUserAnswer = Array.isArray(qResult?.userAnswer)
                                                ? qResult.userAnswer.includes(optIdx)
                                                : qResult?.userAnswer === optIdx;
                                            const isCorrect = Array.isArray(qResult?.correctAnswer)
                                                ? qResult.correctAnswer.includes(optIdx)
                                                : qResult?.correctAnswer === optIdx;

                                            return (
                                                <div
                                                    key={optIdx}
                                                    className={`flex items-center gap-2 p-2 rounded-lg text-sm ${isCorrect
                                                            ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300'
                                                            : isUserAnswer
                                                                ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300'
                                                                : ''
                                                        }`}
                                                >
                                                    {isCorrect && <CheckCircle2 className="h-4 w-4" />}
                                                    {!isCorrect && isUserAnswer && <XCircle className="h-4 w-4" />}
                                                    {opt}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Explanation */}
                                    {qResult?.explanation && (
                                        <div className="mt-4 ml-11 p-3 bg-muted rounded-lg text-sm">
                                            <strong>Giải thích:</strong> {qResult.explanation}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </main>
            </div>
        );
    }

    // Quiz form
    return (
        <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <Link href="/dashboard" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm">
                                <ChevronLeft className="h-4 w-4" />
                                Quay lại
                            </Link>
                            <h1 className="text-xl font-semibold">{quiz.title}</h1>
                        </div>

                        <div className="flex items-center gap-4">
                            {quiz.timeLimit && (
                                <span className="text-sm text-muted-foreground flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {quiz.timeLimit} phút
                                </span>
                            )}
                            <span className="text-sm">
                                {Object.keys(answers).length}/{quiz.questions.length} câu
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-8 max-w-3xl">
                {quiz.description && (
                    <p className="text-muted-foreground mb-6">{quiz.description}</p>
                )}

                {/* Questions */}
                <div className="space-y-6">
                    {quiz.questions.map((q, idx) => (
                        <div key={q.id} className="bg-card rounded-xl border border-border p-5">
                            <div className="flex items-start gap-3 mb-4">
                                <span className="w-8 h-8 rounded-full bg-arduino-teal/10 text-arduino-teal flex items-center justify-center text-sm font-medium">
                                    {idx + 1}
                                </span>
                                <div>
                                    <p className="font-medium">{q.content}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {q.type === 'multiple' ? 'Chọn nhiều đáp án' : 'Chọn 1 đáp án'} • {q.points} điểm
                                    </p>
                                </div>
                            </div>

                            {/* Options */}
                            <div className="space-y-2 ml-11">
                                {q.options.map((opt, optIdx) => {
                                    const isMultiple = q.type === 'multiple';
                                    const isSelected = isMultiple
                                        ? ((answers[q.id] as number[]) || []).includes(optIdx)
                                        : answers[q.id] === optIdx;

                                    return (
                                        <button
                                            key={optIdx}
                                            onClick={() => handleSelectAnswer(q.id, optIdx, isMultiple)}
                                            className={`w-full text-left flex items-center gap-3 p-3 rounded-lg border transition-colors ${isSelected
                                                    ? 'border-arduino-teal bg-arduino-teal/10'
                                                    : 'border-border hover:border-muted-foreground'
                                                }`}
                                        >
                                            <span className={`w-5 h-5 rounded-${isMultiple ? 'md' : 'full'} border-2 flex items-center justify-center ${isSelected ? 'border-arduino-teal bg-arduino-teal' : 'border-muted-foreground'
                                                }`}>
                                                {isSelected && <CheckCircle2 className="h-3 w-3 text-white" />}
                                            </span>
                                            <span className="text-sm">{opt}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Submit button */}
                <div className="mt-8 flex justify-center">
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="btn-arduino px-8 py-3 text-lg flex items-center gap-2"
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Đang chấm...
                            </>
                        ) : (
                            'Nộp bài'
                        )}
                    </button>
                </div>
            </main>
        </div>
    );
}
