import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import {
    ArrowLeft,
    Clock,
    CheckCircle2,
    XCircle,
    ChevronRight,
    Trophy,
    HelpCircle,
    Loader2
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

const API_BASE = import.meta.env.PROD
    ? 'https://arduino-workers.stu725114073.workers.dev'
    : '';

interface Question {
    id: string;
    orderIndex: number;
    type: 'single' | 'multiple' | 'truefalse' | 'fill_in_blank';
    content: string;
    options: string[] | null;
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
    const [answers, setAnswers] = useState<Record<string, number | number[] | string>>({});
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

    const handleAnswer = (questionId: string, value: number | number[] | string) => {
        if (submitted) return;
        setAnswers(prev => ({ ...prev, [questionId]: value }));
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

    if (submitted && score) {
        const percentage = Math.round((score.earned / score.total) * 100);

        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 gap-8 font-sans">
                <div className="max-w-md w-full text-center bg-card p-8 rounded-lg shadow-lg border border-border">
                    <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center border ${score.passed ? 'bg-green-100 border-green-200 text-green-700' : 'bg-red-100 border-red-200 text-red-700'}`}>
                        {score.passed ? (
                            <Trophy className="w-10 h-10" />
                        ) : (
                            <XCircle className="w-10 h-10" />
                        )}
                    </div>

                    <h2 className="text-2xl font-bold text-foreground mb-2">
                        {score.passed ? 'Chúc mừng! 🎉' : 'Chưa đạt 😢'}
                    </h2>
                    <p className="text-muted-foreground mb-8">
                        {score.passed
                            ? 'Bạn đã vượt qua bài kiểm tra!'
                            : 'Hãy ôn tập lại và thử lại nhé!'}
                    </p>

                    <div className="bg-muted/50 rounded-lg p-6 mb-8 border border-border">
                        <div className="text-5xl font-bold text-foreground mb-2">{percentage}%</div>
                        <p className="text-muted-foreground font-medium">{score.earned}/{score.total} điểm</p>
                        <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-1000 ${score.passed ? 'bg-green-600' : 'bg-destructive'}`}
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">Điểm chuẩn: {quiz.passingScore}%</p>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={() => navigate('/dashboard')}
                            className="flex-1"
                        >
                            Về Dashboard
                        </Button>
                        <Button
                            onClick={() => {
                                setSubmitted(false);
                                setScore(null);
                                setAnswers({});
                                setCurrentIndex(0);
                                if (quiz.timeLimit) setTimeLeft(quiz.timeLimit * 60);
                            }}
                            className="flex-1"
                        >
                            Làm lại
                        </Button>
                    </div>
                </div>

                {/* Detailed Review */}
                <div className="max-w-3xl w-full mx-auto space-y-4">
                    <h3 className="text-lg font-bold text-center mb-6 text-muted-foreground">Chi tiết bài làm</h3>
                    {quiz.questions.map((q, i) => {
                        // Logic to determine correctness from local state or API result if available
                        // Since we don't have the full result object in state (only updated in handleSubmit but not passed to full scope properly in the previous snippet),
                        // we generally rely on the API response 'results' which I see was defined as `_results` state in original file.
                        // I will assume `_results` state (renamed to `results` ideally) is available or I can use the same logic if I have the `results` state.
                        // Looking at original file, `_results` was state. I need to make sure I didn't delete the `_results` state definition. I didn't touch the top of function.

                        const result = _results.find(r => r.questionId === q.id);
                        const isCorrect = result?.correct;
                        const userAnswerIndex = answers[q.id];

                        return (
                            <div key={q.id} className={`bg-card p-6 rounded-lg border ${isCorrect ? 'border-green-200 bg-green-50/10' : 'border-destructive/20 bg-destructive/5'}`}>
                                <div className="flex items-start gap-4">
                                    <span className={`flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center font-bold text-sm border ${isCorrect ? 'bg-green-100 text-green-700 border-green-200' : 'bg-destructive/10 text-destructive border-destructive/20'}`}>
                                        {i + 1}
                                    </span>
                                    <div className="flex-1 space-y-3">
                                        <p className="font-medium text-foreground text-lg">{q.content}</p>

                                        <div className="space-y-2">
                                            {q.options?.map((opt, optIdx) => {
                                                const isSelected = userAnswerIndex === optIdx;
                                                let style = "border-transparent text-muted-foreground";

                                                if (isSelected) {
                                                    style = isCorrect
                                                        ? "border-green-500 bg-green-50 text-green-700 border"
                                                        : "border-destructive bg-destructive/10 text-destructive border";
                                                } else if (opt === q.correctAnswer && !isCorrect) {
                                                    style = "border-green-500 bg-green-50 text-green-700 border border-dashed";
                                                }

                                                return (
                                                    <div key={optIdx} className={`p-3 rounded-md flex justify-between items-center ${style}`}>
                                                        <span>{String.fromCharCode(65 + optIdx)}. {opt}</span>
                                                        {isSelected && (isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />)}
                                                        {!isSelected && opt === q.correctAnswer && !isCorrect && <CheckCircle2 className="w-4 h-4 opacity-50" />}
                                                    </div>
                                                )
                                            })}
                                        </div>

                                        {(result?.explanation || q.explanation) && (
                                            <div className="mt-4 p-3 bg-muted rounded text-sm flex gap-2 text-muted-foreground">
                                                <HelpCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                                <div>
                                                    <span className="font-bold mr-1">Giải thích:</span>
                                                    {result?.explanation || q.explanation}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans text-foreground">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-background border-b border-border px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between h-14">
                        <div className="flex items-center gap-4">
                            <Link
                                to="/dashboard"
                                className="p-2 -ml-2 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                            </Link>
                            <div>
                                <h1 className="text-sm font-bold truncate max-w-[200px]">{quiz.title}</h1>
                                <p className="text-xs text-muted-foreground">Câu {currentIndex + 1}/{quiz.questions.length}</p>
                            </div>
                        </div>

                        {timeLeft !== null && (
                            <Badge
                                variant="outline"
                                className={`font-mono text-sm py-1 ${timeLeft < 60 ? 'text-destructive border-destructive animate-pulse' : 'text-muted-foreground'}`}
                            >
                                <Clock className="w-4 h-4 mr-2" />
                                {formatTime(timeLeft)}
                            </Badge>
                        )}
                    </div>
                </div>
                {/* Progress Bar Container - Absolute bottom */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-muted">
                    <div
                        className="h-full bg-primary transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </header>

            {/* Question */}
            <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8 flex flex-col justify-center">
                <div className="bg-card rounded-lg p-6 border border-border mb-8 relative">
                    <div className="flex items-start gap-4 mb-6">
                        <span className="flex-shrink-0 w-8 h-8 rounded bg-muted text-foreground flex items-center justify-center font-bold text-sm border border-border">
                            {currentIndex + 1}
                        </span>
                        <div>
                            <p className="text-foreground text-lg font-medium leading-relaxed">{currentQuestion.content}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <Badge variant="secondary">
                                    {currentQuestion.points} điểm
                                </Badge>
                                <Badge variant="outline">
                                    {currentQuestion.type === 'single' ? 'Chọn 1 đáp án' :
                                        currentQuestion.type === 'multiple' ? 'Chọn nhiều đáp án' :
                                            currentQuestion.type === 'truefalse' ? 'Đúng/Sai' : 'Điền từ'}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Options */}
                    <div className="space-y-3 pl-0 md:pl-12">
                        {currentQuestion.type === 'fill_in_blank' ? (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Câu trả lời của bạn:</label>
                                <input
                                    type="text"
                                    value={(answers[currentQuestion.id] as string) || ''}
                                    onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                                    disabled={submitted}
                                    placeholder="Nhập câu trả lời..."
                                    className="w-full px-4 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                                />
                            </div>
                        ) : (
                            currentQuestion.options?.map((option, index) => {
                                const isSelected = answers[currentQuestion.id] === index;

                                return (
                                    <button
                                        key={index}
                                        onClick={() => handleAnswer(currentQuestion.id, index)}
                                        disabled={submitted}
                                        className={`w-full text-left p-3 rounded-md border transition-all flex items-center gap-3 ${isSelected
                                            ? 'border-primary bg-primary/10'
                                            : 'border-input hover:bg-muted'
                                            }`}
                                    >
                                        <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${isSelected
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted text-muted-foreground'
                                            }`}>
                                            {String.fromCharCode(65 + index)}
                                        </span>
                                        <span className={`text-sm ${isSelected ? 'font-medium text-primary' : 'text-foreground'}`}>{option}</span>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                    <Button
                        variant="secondary"
                        onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentIndex === 0}
                    >
                        Câu trước
                    </Button>

                    {currentIndex === quiz.questions.length - 1 ? (
                        <Button
                            onClick={handleSubmit}
                            disabled={submitting}
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Đang nộp...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Nộp bài
                                </>
                            )}
                        </Button>
                    ) : (
                        <Button
                            onClick={() => setCurrentIndex(prev => Math.min(quiz.questions.length - 1, prev + 1))}
                        >
                            Câu tiếp
                            <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    )}
                </div>

                {/* Question Navigator */}
                <div className="mt-12">
                    <div className="flex items-center gap-2 mb-4">
                        <HelpCircle className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">Danh sách câu hỏi</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {quiz.questions.map((q, i) => (
                            <button
                                key={q.id}
                                onClick={() => setCurrentIndex(i)}
                                className={`w-8 h-8 rounded text-xs font-medium transition-all ${i === currentIndex
                                    ? 'bg-primary text-primary-foreground'
                                    : answers[q.id] !== undefined
                                        ? 'bg-muted text-foreground border border-input'
                                        : 'bg-background border border-input text-muted-foreground hover:bg-muted'
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
