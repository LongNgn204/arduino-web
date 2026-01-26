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
            case 'easy': return 'default';
            case 'medium': return 'secondary';
            case 'hard': return 'destructive';
            default: return 'outline';
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
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-muted-foreground animate-spin" />
                    <p className="text-muted-foreground font-medium animate-pulse">Đang tải Exam Drills...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-20 font-sans">
            {/* Header */}
            <div className="bg-background border-b border-border pt-10 pb-16">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6">
                        <div className="w-20 h-20 bg-muted rounded-md flex items-center justify-center border border-border">
                            <Zap className="w-10 h-10 text-foreground" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-foreground mb-2 tracking-tight">
                                Exam Drills
                            </h1>
                            <p className="text-lg text-muted-foreground max-w-xl">
                                Kho luyện thi với các bài thi thử theo chủ đề và tổng hợp. Sẵn sàng chinh phục mọi kỳ thi!
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-20">
                {/* Featured Drill */}
                {drills.length > 0 && (
                    <div className="mb-10">
                        <Link to={`/drills/${drills[0].id}`} className="block group">
                            <Card className="bg-card text-card-foreground p-0 overflow-hidden border border-border hover:shadow-lg hover:border-primary transition-all duration-300">
                                <div className="p-8">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-4">
                                                <Badge variant="secondary">
                                                    <Trophy className="w-3 h-3 mr-1" />
                                                    Bài thi nổi bật
                                                </Badge>
                                                <Badge variant="destructive">
                                                    HOT
                                                </Badge>
                                            </div>
                                            <h3 className="text-3xl font-bold mb-3 tracking-tight">{drills[0].title}</h3>
                                            <p className="text-muted-foreground text-lg mb-6 max-w-2xl">{drills[0].description}</p>
                                            <div className="flex flex-wrap gap-3">
                                                <Badge variant="outline">
                                                    <Clock className="w-4 h-4 mr-1.5" />
                                                    {drills[0].timeLimit} phút
                                                </Badge>
                                                <Badge variant="outline">
                                                    <Target className="w-4 h-4 mr-1.5" />
                                                    {drills[0].questionCount} câu
                                                </Badge>
                                                <Badge variant="destructive">
                                                    Khó
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                            <ChevronRight className="w-8 h-8" />
                                        </div>
                                    </div>
                                    <div className="mt-8 pt-6 border-t border-border flex justify-between items-center">
                                        <span className="text-muted-foreground text-sm font-medium">Hơn 500 sinh viên đã tham gia</span>
                                        <Button>
                                            Làm bài ngay
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    </div>
                )}

                {/* Grid */}
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-muted rounded-md border border-border flex items-center justify-center text-foreground">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-bold text-foreground">Luyện tập theo chủ đề</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {drills.slice(1).map((drill) => (
                            <Link key={drill.id} to={`/drills/${drill.id}`}>
                                <Card className="group hover:bg-muted/50 hover:border-primary transition-all duration-300 h-full bg-card border-border p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                            <Target className="w-5 h-5" />
                                        </div>
                                        <Badge variant={getDifficultyColor(drill.difficulty) as any}>
                                            {getDifficultyLabel(drill.difficulty)}
                                        </Badge>
                                    </div>

                                    <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
                                        {drill.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-6 h-10">
                                        {drill.description}
                                    </p>

                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                                        <div className="flex gap-3 text-xs text-muted-foreground font-medium">
                                            <span className="flex items-center">
                                                <Clock className="w-3.5 h-3.5 mr-1" /> {drill.timeLimit}p
                                            </span>
                                            <span className="flex items-center">
                                                <Target className="w-3.5 h-3.5 mr-1" /> {drill.questionCount} câu
                                            </span>
                                        </div>
                                        <Button size="sm" variant="ghost" className="scale-0 group-hover:scale-100 transition-all opacity-0 group-hover:opacity-100">
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
