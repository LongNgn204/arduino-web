import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import {
    ArrowLeft,
    Clock,
    CheckCircle2,
    XCircle,
    ChevronRight,
    Trophy
} from 'lucide-react';

const API_BASE = import.meta.env.PROD
    ? 'https://arduino-workers.stu725114073.workers.dev'
    : '';

interface Question {
    id: string;
    orderIndex: number;
    type: 'single' | 'multiple' | 'truefalse';
    content: string;
    options: string[];
    correctAnswer: string;
    explanation: string | null;
    points: number;
}

interface QuizDetail {
    id: string;
    weekId: string;
    title: string;
    description: string | null;
    timeLimit: number | null;
    passingScore: number;
    questions: Question[];
}

export default function QuizPage() {
    const { quizId } = useParams<{ quizId: string }>();
    const { isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState<QuizDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number | number[]>>({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState<{ earned: number; total: number; passed: boolean } | null>(null);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        async function fetchQuiz() {
            if (!quizId) return;
            try {
                const res = await fetch(`${API_BASE}/api/quizzes/${quizId}`, {
                    credentials: 'include',
                });
                const data = await res.json();
                setQuiz(data.quiz);
                if (data.quiz?.timeLimit) {
                    setTimeLeft(data.quiz.timeLimit * 60);
                }
            } catch (error) {
                console.error('Failed to fetch quiz:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchQuiz();
    }, [quizId]);

    // Timer countdown
    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0 || submitted) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev && prev <= 1) {
                    handleSubmit();
                    return 0;
                }
                return prev ? prev - 1 : null;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, submitted]);

    const handleAnswer = (questionId: string, answerIndex: number) => {
        if (submitted) return;
        setAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
    };

    const [submitting, setSubmitting] = useState(false);
    const [_results, setResults] = useState<Array<{
        questionId: string;
        correct: boolean;
        explanation: string | null;
    }>>([]);

    const handleSubmit = async () => {
        if (!quiz || submitting) return;
        setSubmitting(true);

        try {
            const res = await fetch(`${API_BASE}/api/quizzes/${quizId}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ answers }),
            });

            if (!res.ok) {
                console.error('Failed to submit quiz');
                setSubmitting(false);
                return;
            }

            const data = await res.json();
            setScore({
                earned: data.score,
                total: data.maxScore,
                passed: data.passed,
            });
            setResults(data.results || []);
            setSubmitted(true);
        } catch (error) {
            console.error('Quiz submit error:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-purple-400 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!quiz) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-slate-400 mb-4">Không tìm thấy bài quiz.</p>
                    <Link to="/dashboard" className="text-teal-400 hover:underline">
                        ← Quay lại Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    const currentQuestion = quiz.questions[currentIndex];
    const progress = ((currentIndex + 1) / quiz.questions.length) * 100;

    // Results Screen
    if (submitted && score) {
        const percentage = Math.round((score.earned / score.total) * 100);

        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
                <div className="max-w-md w-full text-center">
                    <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${score.passed ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                        {score.passed ? (
                            <Trophy className="w-12 h-12 text-green-400" />
                        ) : (
                            <XCircle className="w-12 h-12 text-red-400" />
                        )}
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2">
                        {score.passed ? 'Chúc mừng! 🎉' : 'Chưa đạt 😢'}
                    </h2>
                    <p className="text-slate-400 mb-6">
                        {score.passed
                            ? 'Bạn đã vượt qua bài kiểm tra!'
                            : 'Hãy ôn tập lại và thử lại nhé!'}
                    </p>

                    <div className="bg-slate-800/50 rounded-2xl p-6 mb-6 border border-slate-700">
                        <div className="text-5xl font-bold text-white mb-2">{percentage}%</div>
                        <p className="text-slate-400">{score.earned}/{score.total} điểm</p>
                        <div className="mt-4 h-3 bg-slate-700 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full ${score.passed ? 'bg-green-500' : 'bg-red-500'}`}
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                        <p className="text-sm text-slate-500 mt-2">Điểm chuẩn: {quiz.passingScore}%</p>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            to="/dashboard"
                            className="flex-1 px-4 py-3 rounded-xl bg-slate-700 text-white hover:bg-slate-600 transition-colors"
                        >
                            Về Dashboard
                        </Link>
                        <button
                            onClick={() => {
                                setSubmitted(false);
                                setScore(null);
                                setAnswers({});
                                setCurrentIndex(0);
                                if (quiz.timeLimit) setTimeLeft(quiz.timeLimit * 60);
                            }}
                            className="flex-1 px-4 py-3 rounded-xl bg-purple-500 text-white hover:bg-purple-600 transition-colors"
                        >
                            Làm lại
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-slate-900/95 border-b border-slate-700/50 backdrop-blur-sm">
                <div className="max-w-3xl mx-auto px-4">
                    <div className="flex items-center justify-between h-14">
                        <div className="flex items-center gap-4">
                            <Link
                                to="/dashboard"
                                className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <h1 className="text-sm font-semibold text-white">{quiz.title}</h1>
                                <p className="text-xs text-slate-400">Câu {currentIndex + 1}/{quiz.questions.length}</p>
                            </div>
                        </div>

                        {timeLeft !== null && (
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-mono ${timeLeft < 60 ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-slate-300'}`}>
                                <Clock className="w-4 h-4" />
                                {formatTime(timeLeft)}
                            </div>
                        )}
                    </div>

                    {/* Progress Bar */}
                    <div className="h-1 bg-slate-800 -mx-4">
                        <div className="h-full bg-purple-500 transition-all duration-300" style={{ width: `${progress}%` }} />
                    </div>
                </div>
            </header>

            {/* Question */}
            <main className="max-w-3xl mx-auto px-4 py-8">
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 mb-6">
                    <div className="flex items-start gap-4 mb-6">
                        <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                            {currentIndex + 1}
                        </span>
                        <div>
                            <p className="text-white text-lg leading-relaxed">{currentQuestion.content}</p>
                            <p className="text-sm text-slate-500 mt-2">
                                {currentQuestion.points} điểm •
                                {currentQuestion.type === 'single' ? ' Chọn 1 đáp án' :
                                    currentQuestion.type === 'multiple' ? ' Chọn nhiều đáp án' : ' Đúng/Sai'}
                            </p>
                        </div>
                    </div>

                    {/* Options */}
                    <div className="space-y-3">
                        {currentQuestion.options.map((option, index) => {
                            const isSelected = answers[currentQuestion.id] === index;

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleAnswer(currentQuestion.id, index)}
                                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${isSelected
                                        ? 'border-purple-500 bg-purple-500/10 text-white'
                                        : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium ${isSelected ? 'bg-purple-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                                            {String.fromCharCode(65 + index)}
                                        </span>
                                        <span>{option}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentIndex === 0}
                        className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Câu trước
                    </button>

                    {currentIndex === quiz.questions.length - 1 ? (
                        <button
                            onClick={handleSubmit}
                            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 font-medium transition-colors"
                        >
                            <CheckCircle2 className="w-5 h-5" />
                            Nộp bài
                        </button>
                    ) : (
                        <button
                            onClick={() => setCurrentIndex(prev => Math.min(quiz.questions.length - 1, prev + 1))}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                        >
                            Câu tiếp
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Question Navigator */}
                <div className="mt-8 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                    <p className="text-sm text-slate-400 mb-3">Tiến độ làm bài:</p>
                    <div className="flex flex-wrap gap-2">
                        {quiz.questions.map((q, i) => (
                            <button
                                key={q.id}
                                onClick={() => setCurrentIndex(i)}
                                className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${i === currentIndex
                                    ? 'bg-purple-500 text-white'
                                    : answers[q.id] !== undefined
                                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                        : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
