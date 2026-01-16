import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import {
    ClipboardCheck,
    Clock,
    Trophy,
    Loader2,
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
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-arduino-teal animate-spin" />
                    <p className="text-gray-500 font-medium animate-pulse">Đang tải danh sách Quiz...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans">
            {/* Simple Premium Header */}
            <div className="bg-white border-b border-gray-100 pt-10 pb-16 relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-4 relative z-10">
                    <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6">
                        <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center shadow-inner ring-4 ring-orange-50/50">
                            <ClipboardCheck className="w-10 h-10 text-orange-500" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">
                                Thư viện Quiz
                            </h1>
                            <p className="text-lg text-gray-500 max-w-xl">
                                Ôn tập kiến thức mỗi tuần với bộ câu hỏi trắc nghiệm. Hoàn thành để mở khóa huy hiệu và leo bảng xếp hạng.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/3" />
            </div>

            {/* Content Container */}
            <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-20">
                <div className="space-y-10">
                    {weekNumbers.map((weekNum) => {
                        // Mock emptiness: Skip week 4 if explicitly requested by user in "visual audit" but here we just render all
                        const weekQuizzes = groupedByWeek[weekNum];
                        if (weekQuizzes.length === 0) return null;

                        return (
                            <div key={weekNum} className="relative">
                                {/* Sticky Week Header */}
                                <div className="sticky top-[72px] z-30 flex items-center gap-4 py-4 bg-gray-50/95 backdrop-blur-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="h-0.5 w-8 bg-orange-200 rounded-full" />
                                        <h2 className="text-sm font-bold text-orange-600 uppercase tracking-wider flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            Tuần {parseInt(weekNum)}
                                        </h2>
                                        <div className="h-0.5 flex-1 w-full min-w-[32px] bg-orange-200 rounded-full opacity-50" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {weekQuizzes.map((quiz) => (
                                        <Link key={quiz.id} to={`/quizzes/${quiz.id}`} className="group block h-full">
                                            <Card className="h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 p-0 overflow-hidden bg-white hover:border-orange-200">
                                                <div className="p-6 flex flex-col h-full">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                                                            <Trophy className="w-5 h-5" />
                                                        </div>
                                                        {quiz.timeLimit && (
                                                            <Badge variant="gray" className="text-xs font-medium">
                                                                <Clock className="w-3 h-3 mr-1" />
                                                                {quiz.timeLimit}p
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors text-lg mb-2 line-clamp-2">
                                                        {quiz.title}
                                                    </h3>

                                                    <p className="text-sm text-gray-500 mb-6 line-clamp-2 flex-1">
                                                        {quiz.description || 'Không có mô tả'}
                                                    </p>

                                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                                                        <div className="flex flex-col">
                                                            <span className="text-xs text-gray-400 font-medium uppercase">Điểm qua môn</span>
                                                            <span className="text-sm font-bold text-gray-700">{quiz.passingScore}/100</span>
                                                        </div>
                                                        <Button size="sm" variant="secondary" className="group-hover:bg-orange-500 group-hover:text-white border-orange-200 text-orange-600 transition-all">
                                                            Bắt đầu <Play className="w-3 h-3 ml-1 fill-current" />
                                                        </Button>
                                                    </div>
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
