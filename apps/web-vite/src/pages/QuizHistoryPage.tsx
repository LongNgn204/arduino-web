import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import {
    Clock,
    Loader2,
    CheckCircle2,
    XCircle,
    ArrowLeft,
    Calendar,
    Target
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

const API_BASE = import.meta.env.PROD
    ? 'https://arduino-workers.stu725114073.workers.dev'
    : '';

interface QuizAttempt {
    id: string;
    quizId: string;
    quizTitle: string;
    score: number;
    maxScore: number;
    passed: boolean;
    submittedAt: string;
    weekNumber: number;
}

export default function QuizHistoryPage() {
    const { isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalAttempts: 0,
        passedCount: 0,
        avgScore: 0
    });

    useEffect(() => {
        if (!isAuthenticated) navigate('/login');
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        async function fetchHistory() {
            try {
                const res = await fetch(`${API_BASE}/api/quizzes/history`, {
                    credentials: 'include'
                });
                if (res.ok) {
                    const data = await res.json();
                    setAttempts(data.attempts || []);

                    // Tính thống kê
                    const attemptsData = data.attempts || [];
                    const passed = attemptsData.filter((a: QuizAttempt) => a.passed).length;
                    const totalScore = attemptsData.reduce((sum: number, a: QuizAttempt) =>
                        sum + (a.maxScore > 0 ? (a.score / a.maxScore) * 100 : 0), 0);

                    setStats({
                        totalAttempts: attemptsData.length,
                        passedCount: passed,
                        avgScore: attemptsData.length > 0 ? Math.round(totalScore / attemptsData.length) : 0
                    });
                }
            } catch (error) {
                console.error('Failed to fetch quiz history:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchHistory();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-arduino-teal animate-spin" />
                    <p className="text-gray-500 font-medium animate-pulse">Đang tải lịch sử...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans">
            {/* Header */}
            <header className="bg-background border-b border-border pt-8 pb-12">
                <div className="max-w-4xl mx-auto px-4">
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Quay lại Dashboard
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                            <Clock className="w-8 h-8 text-foreground" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">Lịch sử Quiz</h1>
                            <p className="text-muted-foreground">Xem lại các bài Quiz đã làm</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Stats */}
            <div className="max-w-4xl mx-auto px-4 -mt-6">
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <Card className="p-4 text-center bg-card border-border">
                        <div className="text-3xl font-bold text-foreground">{stats.totalAttempts}</div>
                        <div className="text-xs font-medium text-muted-foreground uppercase">Lần làm</div>
                    </Card>
                    <Card className="p-4 text-center bg-card border-border">
                        <div className="text-3xl font-bold text-green-600">{stats.passedCount}</div>
                        <div className="text-xs font-medium text-muted-foreground uppercase">Đạt</div>
                    </Card>
                    <Card className="p-4 text-center bg-card border-border">
                        <div className="text-3xl font-bold text-blue-600">{stats.avgScore}%</div>
                        <div className="text-xs font-medium text-muted-foreground uppercase">Điểm TB</div>
                    </Card>
                </div>

                {/* History List */}
                {attempts.length === 0 ? (
                    <Card className="p-12 text-center bg-card border-border">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                            <Clock className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground mb-2">Chưa có lịch sử</h3>
                        <p className="text-muted-foreground mb-6">Hãy làm quiz đầu tiên để xem lịch sử.</p>
                        <Link to="/quizzes">
                            <Button>Xem danh sách Quiz</Button>
                        </Link>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {attempts.map((attempt) => {
                            const percentage = attempt.maxScore > 0
                                ? Math.round((attempt.score / attempt.maxScore) * 100)
                                : 0;
                            const date = new Date(attempt.submittedAt);
                            const passed = attempt.passed;

                            return (
                                <Card key={attempt.id} className="p-6 bg-card border-border hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded flex items-center justify-center border ${passed
                                                ? 'bg-green-50 border-green-200 text-green-600'
                                                : 'bg-red-50 border-red-200 text-red-600'
                                                }`}>
                                                {passed
                                                    ? <CheckCircle2 className="w-6 h-6" />
                                                    : <XCircle className="w-6 h-6" />
                                                }
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-foreground">
                                                    {attempt.quizTitle || `Quiz Tuần ${attempt.weekNumber}`}
                                                </h3>
                                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {date.toLocaleDateString('vi-VN')}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <div className="flex items-center gap-2 justify-end">
                                                <Badge variant={passed ? 'default' : 'destructive'}>
                                                    {passed ? 'ĐẠT' : 'CHƯA ĐẠT'}
                                                </Badge>
                                            </div>
                                            <div className="mt-1 flex items-center gap-2 justify-end">
                                                <Target className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-lg font-bold text-foreground">
                                                    {attempt.score}/{attempt.maxScore}
                                                </span>
                                                <span className="text-sm text-muted-foreground">({percentage}%)</span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
