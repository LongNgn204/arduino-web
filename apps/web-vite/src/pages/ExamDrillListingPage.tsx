import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import {
    Zap,
    Clock,
    ChevronRight,
    Target,
    Loader2,
    BookOpen,
    Trophy,
    Play
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

const API_BASE = import.meta.env.PROD
    ? 'https://arduino-workers.stu725114073.workers.dev'
    : '';

interface Drill {
    id: string;
    title: string;
    description: string | null;
    timeLimit: number | null;
    questionCount: number;
    difficulty: 'easy' | 'medium' | 'hard';
}

// Mock data if API not available
const MOCK_DRILLS: Drill[] = [
    { id: 'drill-01', title: 'Kiểm tra tổng hợp 60 phút', description: 'Bài kiểm tra mô phỏng đề thi cuối kỳ với 30 câu hỏi trắc nghiệm', timeLimit: 60, questionCount: 30, difficulty: 'hard' },
    { id: 'drill-02', title: 'GPIO & LED Basics', description: 'Ôn tập nhanh kiến thức GPIO và điều khiển LED', timeLimit: 10, questionCount: 10, difficulty: 'easy' },
    { id: 'drill-03', title: '7-Segment & Multiplexing', description: 'Bài tập về LED 7 đoạn và kỹ thuật quét', timeLimit: 15, questionCount: 15, difficulty: 'medium' },
    { id: 'drill-04', title: 'ADC & PWM Challenge', description: 'Thử thách về Analog và PWM', timeLimit: 20, questionCount: 20, difficulty: 'hard' },
    { id: 'drill-05', title: 'Serial Communication', description: 'Kiểm tra giao tiếp UART và Serial Monitor', timeLimit: 15, questionCount: 12, difficulty: 'medium' },
    { id: 'drill-06', title: 'I2C & LCD', description: 'Giao thức I2C và hiển thị LCD', timeLimit: 15, questionCount: 12, difficulty: 'medium' },
];

export default function ExamDrillListingPage() {
    const { isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    const [drills, setDrills] = useState<Drill[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) navigate('/login');
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        async function fetchDrills() {
            try {
                const res = await fetch(`${API_BASE}/api/drills`, { credentials: 'include' });
                if (res.ok) {
                    const data = await res.json();
                    setDrills(data.drills || MOCK_DRILLS);
                } else {
                    setDrills(MOCK_DRILLS);
                }
            } catch (error) {
                console.error('Failed to fetch drills:', error);
                setDrills(MOCK_DRILLS);
            } finally {
                setLoading(false);
            }
        }
        fetchDrills();
    }, []);

    const getDifficultyColor = (diff: string) => {
        switch (diff) {
            case 'easy': return 'bg-green-50 text-green-600 border-green-200';
            case 'medium': return 'bg-yellow-50 text-yellow-600 border-yellow-200';
            case 'hard': return 'bg-red-50 text-red-600 border-red-200';
            default: return 'bg-gray-50 text-gray-600 border-gray-200';
        }
    };

    const getDifficultyLabel = (diff: string) => {
        switch (diff) {
            case 'easy': return 'Dễ';
            case 'medium': return 'Trung bình';
            case 'hard': return 'Khó';
            default: return diff;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
                    <p className="text-gray-500 font-medium animate-pulse">Đang tải Exam Drills...</p>
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
                        <div className="w-20 h-20 bg-cyan-50 rounded-2xl flex items-center justify-center shadow-inner ring-4 ring-cyan-50/50">
                            <Zap className="w-10 h-10 text-cyan-500" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">
                                Exam Drills
                            </h1>
                            <p className="text-lg text-gray-500 max-w-xl">
                                Kho luyện thi với các bài thi thử theo chủ đề và tổng hợp. Sẵn sàng chinh phục mọi kỳ thi!
                            </p>
                        </div>
                    </div>
                </div>
                {/* Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-100 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/3" />
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-20">
                {/* Featured Drill */}
                {drills.length > 0 && (
                    <div className="mb-10">
                        <Link to={`/drills/${drills[0].id}`} className="block group">
                            <Card className="bg-gradient-to-br from-cyan-600 to-blue-700 text-white p-0 overflow-hidden border-0 shadow-xl shadow-cyan-200/50 hover:shadow-2xl hover:scale-[1.01] transition-all duration-300">
                                <div className="p-8 relative z-10">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-4">
                                                <Badge className="bg-white/20 text-white border-white/20 backdrop-blur-sm">
                                                    <Trophy className="w-3 h-3 mr-1" />
                                                    Bài thi nổi bật
                                                </Badge>
                                                <Badge className="bg-pink-500/20 text-pink-100 border-pink-500/30">
                                                    HOT
                                                </Badge>
                                            </div>
                                            <h3 className="text-3xl font-bold mb-3 tracking-tight">{drills[0].title}</h3>
                                            <p className="text-cyan-100 text-lg mb-6 max-w-2xl">{drills[0].description}</p>
                                            <div className="flex flex-wrap gap-3">
                                                <Badge className="bg-black/20 border-0 text-white hover:bg-black/30">
                                                    <Clock className="w-4 h-4 mr-1.5" />
                                                    {drills[0].timeLimit} phút
                                                </Badge>
                                                <Badge className="bg-black/20 border-0 text-white hover:bg-black/30">
                                                    <Target className="w-4 h-4 mr-1.5" />
                                                    {drills[0].questionCount} câu
                                                </Badge>
                                                <Badge className="bg-red-500/80 border-0 text-white">
                                                    Khó
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md group-hover:bg-white/20 transition-all">
                                            <ChevronRight className="w-8 h-8 text-white" />
                                        </div>
                                    </div>
                                    <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
                                        <span className="text-cyan-200 text-sm font-medium">Hơn 500 sinh viên đã tham gia</span>
                                        <Button className="bg-white text-cyan-700 hover:bg-cyan-50 border-0 font-bold shadow-lg">
                                            Làm bài ngay
                                        </Button>
                                    </div>
                                </div>

                                {/* Background Decor */}
                                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
                            </Card>
                        </Link>
                    </div>
                )}

                {/* Grid */}
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-cyan-600">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Luyện tập theo chủ đề</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {drills.slice(1).map((drill) => (
                            <Link key={drill.id} to={`/drills/${drill.id}`}>
                                <Card className="group hover:shadow-xl hover:-translate-y-1 hover:border-cyan-200 transition-all duration-300 h-full bg-white border-gray-100 p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-10 h-10 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-600 group-hover:bg-cyan-500 group-hover:text-white transition-all">
                                            <Target className="w-5 h-5" />
                                        </div>
                                        <Badge variant="outline" className={getDifficultyColor(drill.difficulty)}>
                                            {getDifficultyLabel(drill.difficulty)}
                                        </Badge>
                                    </div>

                                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-cyan-600 transition-colors mb-2 line-clamp-2">
                                        {drill.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 line-clamp-2 mb-6 h-10">
                                        {drill.description}
                                    </p>

                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                                        <div className="flex gap-3 text-xs text-gray-500 font-medium">
                                            <span className="flex items-center">
                                                <Clock className="w-3.5 h-3.5 mr-1" /> {drill.timeLimit}p
                                            </span>
                                            <span className="flex items-center">
                                                <Target className="w-3.5 h-3.5 mr-1" /> {drill.questionCount} câu
                                            </span>
                                        </div>
                                        <Button size="sm" variant="secondary" className="scale-0 group-hover:scale-100 transition-all opacity-0 group-hover:opacity-100">
                                            <Play className="w-3 h-3 fill-current" />
                                        </Button>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
