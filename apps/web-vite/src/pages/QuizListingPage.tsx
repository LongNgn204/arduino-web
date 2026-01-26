import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import {
    ClipboardCheck,
    Clock,
    Trophy,
    Calendar,
    Play
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

const API_BASE = import.meta.env.PROD
    ? 'https://arduino-workers.stu725114073.workers.dev'
    : '';

interface Quiz {
    id: string;
    weekId: string;
    title: string;
    description: string | null;
    timeLimit: number | null;
    passingScore: number;
    questionCount: number;
}

// Mock data khi API chưa sẵn sàng
const MOCK_QUIZZES: Quiz[] = [
    { id: 'quiz-01', weekId: 'week-01', title: 'Quiz Tuần 1: GPIO & LED', description: 'Kiểm tra kiến thức về GPIO, điều khiển LED và cấu trúc chương trình Arduino', timeLimit: 15, passingScore: 70, questionCount: 10 },
    { id: 'quiz-02', weekId: 'week-02', title: 'Quiz Tuần 2: LED 7 đoạn', description: 'Hiển thị số, quét LED và IC ghi dịch 74HC595', timeLimit: 15, passingScore: 70, questionCount: 10 },
    { id: 'quiz-03', weekId: 'week-03', title: 'Quiz Tuần 3: Nút nhấn & Keypad', description: 'Xử lý input, điện trở kéo và chống dội phím', timeLimit: 15, passingScore: 70, questionCount: 10 },
    { id: 'quiz-04', weekId: 'week-04', title: 'Quiz Tuần 4: ADC & PWM', description: 'Bộ chuyển đổi Analog-Digital và điều chế xung', timeLimit: 15, passingScore: 70, questionCount: 10 },
    { id: 'quiz-05', weekId: 'week-05', title: 'Quiz Tuần 5: Cảm biến', description: 'Cảm biến ánh sáng, nhiệt độ và khoảng cách', timeLimit: 15, passingScore: 70, questionCount: 5 },
    { id: 'quiz-06', weekId: 'week-06', title: 'Quiz Tuần 6: Động cơ', description: 'Servo, động cơ DC và mạch cầu H', timeLimit: 15, passingScore: 70, questionCount: 5 },
    { id: 'quiz-07', weekId: 'week-07', title: 'Quiz Tuần 7: LCD & I2C', description: 'Giao thức I2C và hiển thị LCD 16x2', timeLimit: 15, passingScore: 70, questionCount: 5 },
    { id: 'quiz-08', weekId: 'week-08', title: 'Quiz Tuần 8: Âm thanh', description: 'Tạo âm thanh với hàm tone() và buzzer', timeLimit: 15, passingScore: 70, questionCount: 5 },
    { id: 'quiz-09', weekId: 'week-09', title: 'Quiz Tuần 9: Ngắt', description: 'Hardware Interrupts và Timer Interrupts', timeLimit: 15, passingScore: 70, questionCount: 5 },
    { id: 'quiz-10', weekId: 'week-10', title: 'Quiz Tuần 10: EEPROM', description: 'Lưu trữ dữ liệu và tiết kiệm năng lượng', timeLimit: 15, passingScore: 70, questionCount: 5 },
    { id: 'quiz-11', weekId: 'week-11', title: 'Quiz Tuần 11: SPI & UART', description: 'Các chuẩn giao tiếp nâng cao', timeLimit: 15, passingScore: 70, questionCount: 5 },
    { id: 'quiz-12', weekId: 'week-12', title: 'Quiz Tuần 12: Tổng hợp', description: 'Bài kiểm tra tổng hợp toàn khóa', timeLimit: 20, passingScore: 70, questionCount: 5 },
];

export default function QuizListingPage() {
    const { isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) navigate('/login');
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        async function fetchQuizzes() {
            try {
                const res = await fetch(`${API_BASE}/api/quizzes`, { credentials: 'include' });
                if (res.ok) {
                    const data = await res.json();
                    setQuizzes(data.quizzes?.length > 0 ? data.quizzes : MOCK_QUIZZES);
                } else {
                    setQuizzes(MOCK_QUIZZES);
                }
            } catch (error) {
                console.error('Failed to fetch quizzes:', error);
                setQuizzes(MOCK_QUIZZES);
            } finally {
                setLoading(false);
            }
        }
        fetchQuizzes();
    }, []);

    // Group quizzes by week
    const groupedByWeek = quizzes.reduce((acc, quiz) => {
        const weekNum = quiz.weekId?.replace('week-', '') || '00';
        if (!acc[weekNum]) acc[weekNum] = [];
        acc[weekNum].push(quiz);
        return acc;
    }, {} as Record<string, Quiz[]>);

    const weekNumbers = Object.keys(groupedByWeek).sort((a, b) => parseInt(a) - parseInt(b));

    if (loading) {
        return <div className="p-8 text-center text-muted-foreground">Đang tải danh sách Quiz...</div>;
    }

    return (
        <div className="min-h-screen bg-background pb-20 font-sans">
            <header className="p-8 border-b border-border">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                        <ClipboardCheck className="w-8 h-8" />
                        Thư viện Quiz
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Ôn tập kiến thức mỗi tuần với bộ câu hỏi trắc nghiệm.
                    </p>
                </div>
            </header>

            {/* Content Container */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="space-y-8">
                    {weekNumbers.map((weekNum) => {
                        const weekQuizzes = groupedByWeek[weekNum];
                        if (weekQuizzes.length === 0) return null;

                        return (
                            <div key={weekNum} className="relative">
                                {/* Week Header */}
                                <div className="flex items-center gap-3 py-4 border-b border-border mb-4">
                                    <h2 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Tuần {parseInt(weekNum)}
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {weekQuizzes.map((quiz) => (
                                        <Link key={quiz.id} to={`/quizzes/${quiz.id}`} className="block h-full">
                                            <Card className="h-full hover:bg-muted/50 transition-colors border-border p-6 flex flex-col">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="w-8 h-8 rounded bg-muted flex items-center justify-center text-foreground">
                                                        <Trophy className="w-4 h-4" />
                                                    </div>
                                                    {quiz.timeLimit && (
                                                        <Badge variant="outline" className="text-xs font-medium">
                                                            <Clock className="w-3 h-3 mr-1" />
                                                            {quiz.timeLimit}p
                                                        </Badge>
                                                    )}
                                                </div>

                                                <h3 className="font-bold text-foreground text-lg mb-2 line-clamp-2">
                                                    {quiz.title}
                                                </h3>

                                                <p className="text-sm text-muted-foreground mb-6 line-clamp-2 flex-1">
                                                    {quiz.description || 'Không có mô tả'}
                                                </p>

                                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs text-muted-foreground font-medium uppercase">Điểm qua môn</span>
                                                        <span className="text-sm font-bold">{quiz.passingScore}/100</span>
                                                    </div>
                                                    <Button size="sm" variant="secondary">
                                                        Bắt đầu <Play className="w-3 h-3 ml-1 fill-current" />
                                                    </Button>
                                                </div>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
