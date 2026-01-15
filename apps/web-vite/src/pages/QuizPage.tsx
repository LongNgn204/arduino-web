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

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-arduino-teal animate-spin" />
                    <p className="text-gray-500 animate-pulse">Đang tải bài quiz...</p>
                </div>
            </div>
        );
    }

    if (!quiz || !quiz.questions || quiz.questions.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-gray-500 mb-4">Không tìm thấy bài quiz hoặc chưa có câu hỏi.</p>
                    <Link to="/dashboard" className="text-arduino-teal hover:underline font-medium">
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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full text-center bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                    <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${score.passed ? 'bg-green-100' : 'bg-red-100'}`}>
                        {score.passed ? (
                            <Trophy className="w-12 h-12 text-green-600 animate-bounce" />
                        ) : (
                            <XCircle className="w-12 h-12 text-red-500" />
                        )}
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {score.passed ? 'Chúc mừng! 🎉' : 'Chưa đạt 😢'}
                    </h2>
                    <p className="text-gray-500 mb-8">
                        {score.passed
                            ? 'Bạn đã vượt qua bài kiểm tra!'
                            : 'Hãy ôn tập lại và thử lại nhé!'}
                    </p>

                    <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
                        <div className="text-5xl font-bold text-gray-900 mb-2">{percentage}%</div>
                        <p className="text-gray-500 font-medium">{score.earned}/{score.total} điểm</p>
                        <div className="mt-4 h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-1000 ${score.passed ? 'bg-green-500' : 'bg-red-500'}`}
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Điểm chuẩn: {quiz.passingScore}%</p>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            variant="secondary"
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
                            className="flex-1 bg-arduino-teal hover:bg-teal-600"
                        >
                            Làm lại
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <Link
                                to="/dashboard"
                                className="p-2 -ml-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <h1 className="text-sm font-bold text-gray-900">{quiz.title}</h1>
                                <p className="text-xs text-gray-500">Câu {currentIndex + 1}/{quiz.questions.length}</p>
                            </div>
                        </div>

                        {timeLeft !== null && (
                            <Badge
                                variant="outline"
                                className={`font-mono text-sm py-1 ${timeLeft < 60 ? 'bg-red-50 text-red-600 border-red-200 animate-pulse' : 'bg-gray-100 text-gray-700 border-gray-200'}`}
                            >
                                <Clock className="w-4 h-4 mr-2" />
                                {formatTime(timeLeft)}
                            </Badge>
                        )}
                    </div>
                </div>
                {/* Progress Bar Container - Absolute bottom */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-100">
                    <div
                        className="h-full bg-arduino-teal transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </header>

            {/* Question */}
            <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8 flex flex-col justify-center">
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg shadow-gray-200/50 mb-8 relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-arduino-teal/5 to-transparent rounded-bl-full -mr-16 -mt-16 pointer-events-none" />

                    <div className="relative">
                        <div className="flex items-start gap-5 mb-8">
                            <span className="flex-shrink-0 w-12 h-12 rounded-2xl bg-arduino-teal/10 text-arduino-teal flex items-center justify-center font-bold text-lg shadow-sm border border-arduino-teal/20">
                                {currentIndex + 1}
                            </span>
                            <div>
                                <p className="text-gray-900 text-xl font-medium leading-relaxed">{currentQuestion.content}</p>
                                <div className="flex items-center gap-3 mt-3">
                                    <Badge variant="secondary" className="text-gray-600 bg-gray-100">
                                        {currentQuestion.points} điểm
                                    </Badge>
                                    <Badge variant="outline" className="text-gray-500 border-gray-200">
                                        {currentQuestion.type === 'single' ? 'Chọn 1 đáp án' :
                                            currentQuestion.type === 'multiple' ? 'Chọn nhiều đáp án' :
                                                currentQuestion.type === 'truefalse' ? 'Đúng/Sai' : 'Điền từ'}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        {/* Options */}
                        {/* Options or Input */}
                        <div className="space-y-3 pl-0 md:pl-16">
                            {currentQuestion.type === 'fill_in_blank' ? (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Câu trả lời của bạn:</label>
                                    <input
                                        type="text"
                                        value={(answers[currentQuestion.id] as string) || ''}
                                        onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                                        disabled={submitted}
                                        placeholder="Nhập câu trả lời..."
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-arduino-teal/20 focus:border-arduino-teal/50 transition-all font-medium text-gray-800"
                                    />
                                    {submitted && (
                                        <div className="mt-2 text-sm">
                                            <span className="font-bold text-gray-600">Đáp án đúng: </span>
                                            <span className="text-green-600 font-medium">{currentQuestion.correctAnswer}</span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                currentQuestion.options?.map((option, index) => {
                                    const isSelected = answers[currentQuestion.id] === index;

                                    // Logic hiển thị đúng sai sau khi nộp (chỉ làm màu, logic thật ở server)
                                    // Vì answers lưu index, correctAnswer cũng lưu index (string '0', '1') cho MCQ

                                    return (
                                        <button
                                            key={index}
                                            onClick={() => handleAnswer(currentQuestion.id, index)}
                                            disabled={submitted}
                                            className={`w-full text-left p-4 rounded-xl border-2 transition-all group relative ${isSelected
                                                ? 'border-arduino-teal bg-arduino-teal/5 shadow-md shadow-arduino-teal/10'
                                                : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-colors ${isSelected
                                                    ? 'bg-arduino-teal text-white'
                                                    : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                                                    }`}>
                                                    {String.fromCharCode(65 + index)}
                                                </span>
                                                <span className={`text-base ${isSelected ? 'text-arduino-teal font-medium' : 'text-gray-600'}`}>{option}</span>
                                            </div>
                                        </button>
                                    );
                                })
                            )}
                        </div>
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
                            className="bg-arduino-teal hover:bg-teal-600 shadow-lg shadow-arduino-teal/20 px-8"
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
                            className="bg-gray-900 hover:bg-black text-white px-6"
                        >
                            Câu tiếp
                            <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    )}
                </div>

                {/* Question Navigator */}
                <div className="mt-12">
                    <div className="flex items-center gap-2 mb-4">
                        <HelpCircle className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-500">Danh sách câu hỏi</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {quiz.questions.map((q, i) => (
                            <button
                                key={q.id}
                                onClick={() => setCurrentIndex(i)}
                                className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${i === currentIndex
                                    ? 'bg-gray-900 text-white shadow-lg'
                                    : answers[q.id] !== undefined
                                        ? 'bg-arduino-teal/10 text-arduino-teal border border-arduino-teal/30'
                                        : 'bg-white border border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600'
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
