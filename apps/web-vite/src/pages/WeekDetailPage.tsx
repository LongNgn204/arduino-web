import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import {
    ArrowLeft,
    BookOpen,
    Beaker,
    FileQuestion,
    Clock,
    CheckCircle2,
    Target,
    Sparkles,
    Play,
    Loader2
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import ReactMarkdown from 'react-markdown';

const API_BASE = import.meta.env.PROD
    ? 'https://arduino-workers.stu725114073.workers.dev'
    : '';

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

interface WeekDetail {
    id: string;
    weekNumber: number;
    title: string;
    overview: string;
    objectives: string[];
    examChecklist: string[];
    lessons: Lesson[];
    labs: Lab[];
}

// Premium Grade Week Detail Component
export default function WeekDetailPage() {
    const { weekId } = useParams<{ weekId: string }>();
    const { isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    const [week, setWeek] = useState<WeekDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'lessons' | 'labs'>('overview');

    // Fallback overviews
    const WEEK_OVERVIEWS: Record<string, string> = {
        'week-01': 'Chào mừng bạn đến với tuần đầu tiên của khóa học! Trong tuần này, chúng ta sẽ làm quen với Arduino Uno - "bộ não" của hàng triệu dự án IoT trên toàn cầu. Bạn sẽ học cách thiết lập môi trường lập trình, hiểu về cấu trúc chân GPIO (General Purpose Input/Output) và viết chương trình đầu tiên để điều khiển đèn LED.',
        'week-02': 'Nâng cấp độ khó với LED 7 đoạn (7-Segment Display). Bạn sẽ học tư duy thiết kế hệ thống, kỹ thuật Multiplexing (quét led) để tiết kiệm chân vi điều khiển, và sử dụng IC ghi dịch 74HC595.',
        'week-03': 'Hệ thống nhúng không chỉ có "xuất" tín hiệu mà còn phải biết "đọc" tín hiệu. Tuần này tập trung vào xử lý đầu vào (Input) thông qua Nút nhấn và Bàn phím ma trận (Keypad 4x4).',
        'week-04': 'Khám phá bộ chuyển đổi tương tự sang số (ADC) để đọc cảm biến biến trở, và kỹ thuật PWM (Pulse Width Modulation) để giả lập tín hiệu Analog xuất ra (điều khiển độ sáng LED).',
    };

    const getOverview = () => {
        if (week?.overview && week.overview.trim()) return week.overview;
        // Mock fallback for current weekId if explicit mock missing
        return WEEK_OVERVIEWS[weekId || ''] || `Nội dung tổng quan cho ${week?.title || 'tuần học này'} đang được cập nhật bởi giảng viên.`;
    };

    useEffect(() => {
        if (!isAuthenticated) navigate('/login');
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        async function fetchWeek() {
            if (!weekId) return;
            try {
                const res = await fetch(`${API_BASE}/api/weeks/${weekId}`, { credentials: 'include' });
                const data = await res.json();
                setWeek(data.week);
            } catch (error) {
                console.error('Failed to fetch week:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchWeek();
    }, [weekId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-arduino-teal animate-spin" />
                    <p className="text-gray-500 font-medium animate-pulse">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    if (!week) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Card className="text-center p-8 max-w-md mx-auto">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Không tìm thấy tuần học</h3>
                    <Link to="/dashboard">
                        <Button variant="secondary">Quay lại Dashboard</Button>
                    </Link>
                </Card>
            </div>
        );
    }

    const currentWeekNum = parseInt(weekId?.replace('week-', '') || '1');

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-20">
            {/* Glassmorphic Hero Headers */}
            <div className="relative bg-arduino-teal overflow-hidden pb-16 lg:pb-24 pt-8 text-white">
                {/* Abstract Background Mesh */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-600 via-arduino-teal to-teal-400 opacity-90" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-yellow-400 opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                {/* Content Container */}
                <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb / Back */}
                    <div className="flex items-center gap-2 mb-8 text-teal-100 text-sm font-medium">
                        <Link to="/dashboard" className="hover:text-white transition-colors flex items-center gap-1">
                            <ArrowLeft className="w-4 h-4" /> Dashboard
                        </Link>
                        <span>/</span>
                        <span className="text-white">Tuần {week.weekNumber}</span>
                    </div>

                    {/* Timeline Navigator - Enhanced */}
                    <div className="mb-10">
                        <p className="text-xs text-teal-200 font-medium uppercase tracking-wider mb-4">Chọn tuần học</p>
                        <div className="relative">
                            {/* Connecting Line */}
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-white/15 -translate-y-1/2 rounded-full" />

                            {/* Scroll Container with Gradient Masks */}
                            <div className="relative overflow-x-auto hide-scrollbar">
                                {/* Gradient Masks */}
                                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-arduino-teal to-transparent z-10 pointer-events-none" />
                                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-arduino-teal to-transparent z-10 pointer-events-none" />

                                {/* Week Buttons */}
                                <div className="flex items-center gap-2 py-2 px-2 relative">
                                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => {
                                        const isActive = currentWeekNum === num;
                                        const isPast = currentWeekNum > num;
                                        // Chú thích: Week 0 là bắt buộc, cần style nổi bật
                                        const isRequired = num === 0;

                                        // Topic labels for tooltips
                                        const topicLabels: Record<number, string> = {
                                            0: 'Điện tử',
                                            1: 'GPIO',
                                            2: 'Logic',
                                            3: 'ADC/PWM',
                                            4: 'Hiển thị',
                                            5: 'Cảm biến',
                                            6: 'Động cơ',
                                            7: 'UART',
                                            8: 'I2C/SPI',
                                            9: 'WiFi',
                                            10: 'MQTT',
                                            11: 'App',
                                            12: 'Dự án',
                                        };

                                        return (
                                            <Link
                                                key={num}
                                                to={`/weeks/week-${num.toString().padStart(2, '0')}`}
                                                className="relative z-10 group flex-shrink-0"
                                                title={`Tuần ${num}: ${topicLabels[num]}${isRequired ? ' (Bắt buộc)' : ''}`}
                                            >
                                                <div className={`
                                                    w-12 h-12 md:w-14 md:h-14 rounded-xl flex flex-col items-center justify-center font-bold text-sm transition-all duration-300 border-2
                                                    ${isActive
                                                        ? 'bg-white text-arduino-teal border-white scale-110 shadow-lg shadow-black/20'
                                                        : isRequired
                                                            ? 'bg-amber-500/80 text-white border-amber-400 hover:bg-amber-400 hover:scale-105'
                                                            : isPast
                                                                ? 'bg-teal-600/50 text-white border-teal-500/50 hover:bg-teal-500 hover:scale-105'
                                                                : 'bg-teal-800/40 text-teal-300 border-teal-700/30 hover:bg-teal-700 hover:text-white hover:scale-105'
                                                    }
                                                `}>
                                                    {isPast ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-base md:text-lg">{num}</span>}
                                                    <span className={`text-[9px] mt-0.5 font-medium truncate max-w-[40px] ${isActive ? 'text-teal-600' : isRequired ? 'text-amber-100' : 'text-teal-300/80'}`}>
                                                        {topicLabels[num]}
                                                    </span>
                                                </div>
                                                {isActive && (
                                                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-md" />
                                                )}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hero Info */}
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="flex-1">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-teal-50 text-xs font-bold uppercase tracking-wider mb-4">
                                <Sparkles className="w-3 h-3 text-yellow-300" />
                                Fundamental Module
                            </div>
                            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight shadow-md-text">
                                {week.title}
                            </h1>
                            <p className="text-teal-50 text-lg md:text-xl max-w-2xl leading-relaxed">
                                {getOverview().split('.')[0] + '.'}
                            </p>
                        </div>

                        {/* Progress Stats Circle */}
                        <div className="hidden md:flex flex-col items-center justify-center w-32 h-32 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-inner">
                            <span className="text-3xl font-black text-white">0%</span>
                            <span className="text-xs text-teal-200 mt-1 font-medium">Hoàn thành</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Tabs */}
            <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm transition-all duration-300">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="flex items-center gap-1 py-1">
                        <TabPill
                            active={activeTab === 'overview'}
                            onClick={() => setActiveTab('overview')}
                            icon={<BookOpen className="w-4 h-4" />}
                        >
                            Tổng quan
                        </TabPill>
                        <TabPill
                            active={activeTab === 'lessons'}
                            onClick={() => setActiveTab('lessons')}
                            icon={<Play className="w-4 h-4" />}
                            count={(week.lessons || []).length}
                        >
                            Bài giảng
                        </TabPill>
                        <TabPill
                            active={activeTab === 'labs'}
                            onClick={() => setActiveTab('labs')}
                            icon={<Beaker className="w-4 h-4" />}
                            count={(week.labs || []).length}
                        >
                            Lab Thực hành
                        </TabPill>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-slide-up">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <div className="prose prose-lg prose-teal max-w-none text-gray-600">
                                <h3 className="text-gray-900 font-bold text-2xl mb-4">Giới thiệu</h3>
                                <ReactMarkdown
                                    components={{
                                        strong: ({ children }) => <strong className="font-bold text-gray-800">{children}</strong>,
                                        p: ({ children }) => <p className="mb-3 leading-relaxed">{children}</p>,
                                    }}
                                >
                                    {getOverview()}
                                </ReactMarkdown>
                            </div>

                            {/* Objectives List */}
                            {week.objectives?.length > 0 && (
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Target className="w-5 h-5 text-arduino-teal" />
                                        Mục tiêu cần đạt
                                    </h3>
                                    <ul className="space-y-3">
                                        {week.objectives.map((obj, i) => (
                                            <li key={i} className="flex gap-3 items-start">
                                                <div className="w-6 h-6 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                                                    {i + 1}
                                                </div>
                                                <span className="text-gray-600">{obj}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Sidebar / Checklist */}
                        <div className="space-y-6">
                            <Card className="p-6 border-t-4 border-t-amber-400">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <FileQuestion className="w-5 h-5 text-amber-500" />
                                    Checklist Quan Trọng
                                </h3>
                                {(week.examChecklist?.length > 0 ? week.examChecklist : ['Hoàn thành bài giảng', 'Làm bài Quiz tuần', 'Nộp bài Lab thực hành']).map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 py-2 border-b last:border-0 border-gray-50">
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${i === 0 ? 'bg-green-50 border-green-200' : 'border-gray-200'}`}>
                                            {i === 0 && <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />}
                                        </div>
                                        <span className={`text-sm ${i === 0 ? 'text-gray-800 line-through decoration-gray-300' : 'text-gray-600'}`}>{item}</span>
                                    </div>
                                ))}
                            </Card>

                            {/* CTA */}
                            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white text-center shadow-lg shadow-indigo-200">
                                <h4 className="font-bold text-lg mb-2">Sẵn sàng chưa?</h4>
                                <p className="text-indigo-100 text-sm mb-4">Bắt đầu bài học đầu tiên ngay bây giờ!</p>
                                {week.lessons?.[0]?.id && (
                                    <Link to={`/lessons/${week.lessons[0].id}`}>
                                        <Button className="w-full bg-white text-indigo-600 hover:bg-indigo-50 border-0 shadow-md font-bold">
                                            Vào học ngay <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Lesson & Lab Lists - Enhanced Cards */}
                {(activeTab === 'lessons' || activeTab === 'labs') && (
                    <div className="max-w-3xl mx-auto space-y-4">
                        {(activeTab === 'lessons' ? week.lessons : week.labs)?.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 grayscale opacity-50">
                                    {activeTab === 'lessons' ? <BookOpen className="w-10 h-10" /> : <Beaker className="w-10 h-10" />}
                                </div>
                                <h3 className="text-gray-900 font-bold text-lg">Chưa có nội dung</h3>
                                <p className="text-gray-500">Giảng viên đang cập nhật phần này.</p>
                            </div>
                        ) : (
                            (activeTab === 'lessons' ? week.lessons : week.labs)?.map((item, idx) => (
                                <Link
                                    key={item.id}
                                    to={`/${activeTab}/${item.id}`}
                                    className="group block"
                                >
                                    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-5 relative overflow-hidden">
                                        <div className={`absolute top-0 left-0 w-1 h-full transition-colors ${idx === 0 ? 'bg-green-500' : 'bg-transparent group-hover:bg-arduino-teal'}`} />

                                        {/* Status Icon */}
                                        <div className={`
                                            w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-bold text-lg transition-colors
                                            ${idx === 0
                                                ? 'bg-green-100 text-green-600'
                                                : 'bg-gray-50 text-gray-400 group-hover:text-arduino-teal group-hover:bg-teal-50'}
                                        `}>
                                            {idx === 0 ? <CheckCircle2 className="w-6 h-6" /> : idx + 1}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge variant="outline" className={`
                                                    text-xs border-0 px-2 py-0.5 
                                                    ${activeTab === 'lessons'
                                                        ? 'bg-teal-50 text-teal-700'
                                                        : 'bg-amber-50 text-amber-700'}
                                                `}>
                                                    {activeTab === 'lessons' ? 'Lý thuyết' : 'Thực hành LAB'}
                                                </Badge>
                                                {/* @ts-ignore */}
                                                {item.simulatorUrl && (
                                                    <Badge className="bg-cyan-50 text-cyan-700 border-0 text-xs px-2 py-0.5">Simulator</Badge>
                                                )}
                                            </div>
                                            <h4 className="font-bold text-gray-800 text-lg group-hover:text-arduino-teal transition-colors truncate">
                                                {item.title}
                                            </h4>
                                            {item.duration && (
                                                <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                                                    <Clock className="w-3 h-3" /> {item.duration} phút
                                                </div>
                                            )}
                                        </div>

                                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-arduino-teal group-hover:text-white transition-all opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0">
                                            <ArrowLeft className="w-5 h-5 rotate-180" />
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// Micro-component for Pill Tabs
function TabPill({ active, onClick, children, icon, count }: any) {
    return (
        <button
            onClick={onClick}
            className={`
                relative px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2
                ${active ? 'text-arduino-teal' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}
            `}
        >
            {active && (
                <div className="absolute inset-0 bg-teal-50 rounded-full border border-teal-100 -z-10 animate-fade-in" />
            )}
            {icon}
            {children}
            {count > 0 && (
                <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${active ? 'bg-teal-200 text-teal-800' : 'bg-gray-200 text-gray-600'}`}>
                    {count}
                </span>
            )}
        </button>
    );
}

