import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import ReactMarkdown from 'react-markdown';

// API Base URL handling is moved inside the component to be dynamic
// const API_BASE = ... (removed)

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
        return WEEK_OVERVIEWS[weekId || ''] || `Nội dung tổng quan cho ${week?.title || 'tuần học này'} đang được cập nhật bởi giảng viên.`;
    };

    useEffect(() => {
        if (!isAuthenticated) navigate('/login');
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        async function fetchWeek() {
            if (!weekId) return;
            try {
                const baseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                    ? '/api'
                    : 'https://arduino-workers.stu725114073.workers.dev/api';

                const res = await fetch(`${baseUrl}/weeks/${weekId}?t=${Date.now()}`, { credentials: 'include' });
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
        return <div className="p-8 text-center text-muted-foreground">Đang tải dữ liệu...</div>;
    }

    if (!week) {
        return (
            <div className="p-8 text-center bg-background min-h-screen">
                <div className="max-w-md mx-auto p-4 border border-border rounded">
                    <h3 className="text-xl font-bold mb-2">Không tìm thấy tuần học</h3>
                    <Link to="/dashboard" className="text-foreground underline">Quay lại Dashboard</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground font-sans pb-20">
            {/* Header */}
            <div className="bg-background border-b border-border p-4">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                        <Link to="/dashboard" className="hover:text-foreground"> Dashboard </Link>
                        <span>/</span>
                        <span className="text-foreground">Tuần {week.weekNumber}</span>
                    </div>

                    {/* Simple Week Navigator */}
                    <div className="mb-8 overflow-x-auto pb-2">
                        <div className="flex gap-2 min-w-max">
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => {
                                const isActive = parseInt(weekId?.replace('week-', '') || '1') === num;
                                return (
                                    <Link
                                        key={num}
                                        to={`/weeks/week-${num.toString().padStart(2, '0')}`}
                                        className={`w-10 h-10 flex items-center justify-center border rounded text-sm ${isActive ? 'bg-foreground text-background border-foreground' : 'bg-background text-muted-foreground border-border hover:border-foreground'
                                            }`}
                                    >
                                        {num}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold mb-4">{week.title}</h1>
                    <p className="text-lg text-muted-foreground max-w-3xl border-l-4 border-foreground pl-4">
                        {getOverview().split('.')[0] + '.'}
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-border bg-background sticky top-0 z-40">
                <div className="max-w-5xl mx-auto px-4 flex gap-6">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'overview' ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Tổng quan
                    </button>
                    <button
                        onClick={() => setActiveTab('lessons')}
                        className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'lessons' ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Bài giảng <span className="ml-1 text-xs bg-muted px-1.5 py-0.5 rounded-full">{(week.lessons || []).length}</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('labs')}
                        className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'labs' ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Lab Thực hành <span className="ml-1 text-xs bg-muted px-1.5 py-0.5 rounded-full">{(week.labs || []).length}</span>
                    </button>
                </div>
            </div>

            {/* Content Body */}
            <div className="max-w-5xl mx-auto px-4 py-8">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <div className="prose prose-slate max-w-none">
                                <h3 className="text-xl font-bold mb-4">Giới thiệu</h3>
                                <ReactMarkdown>
                                    {getOverview()}
                                </ReactMarkdown>
                            </div>

                            {/* Objectives List */}
                            {week.objectives?.length > 0 && (
                                <div className="border border-border p-6 rounded bg-card">
                                    <h3 className="font-bold mb-4">Mục tiêu cần đạt</h3>
                                    <ul className="list-decimal list-inside space-y-2 text-muted-foreground text-sm">
                                        {week.objectives.map((obj, i) => (
                                            <li key={i}>{obj}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <div className="border border-border p-6 rounded bg-card">
                                <h3 className="font-bold mb-4">Checklist Quan Trọng</h3>
                                <ul className="space-y-2">
                                    {(week.examChecklist?.length > 0 ? week.examChecklist : ['Hoàn thành bài giảng', 'Làm bài Quiz tuần', 'Nộp bài Lab thực hành']).map((item, i) => (
                                        <li key={i} className="flex gap-2 items-start text-sm text-muted-foreground">
                                            <span className="w-4 h-4 border border-border flex items-center justify-center text-[10px] shrink-0">{i + 1}</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* CTA */}
                            {week.lessons?.[0]?.id && (
                                <div className="border border-foreground p-6 rounded text-center">
                                    <h4 className="font-bold mb-2">Bắt đầu học</h4>
                                    <Link to={`/lessons/${week.lessons[0].id}`}>
                                        <button className="w-full py-2 bg-foreground text-background font-medium rounded hover:opacity-90">
                                            Vào học ngay
                                        </button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Lesson & Lab Lists */}
                {(activeTab === 'lessons' || activeTab === 'labs') && (
                    <div className="max-w-3xl mx-auto space-y-4">
                        {(activeTab === 'lessons' ? week.lessons : week.labs)?.length === 0 ? (
                            <div className="text-center py-20 border border-dashed border-border rounded">
                                <h3 className="font-bold mb-2">Chưa có nội dung</h3>
                                <p className="text-muted-foreground text-sm">Giảng viên đang cập nhật phần này.</p>
                            </div>
                        ) : (
                            (activeTab === 'lessons' ? week.lessons : week.labs)?.map((item, idx) => (
                                <Link
                                    key={item.id}
                                    to={`/${activeTab}/${item.id}`}
                                    className="block p-4 border border-border rounded hover:bg-muted transition-colors group"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-8 h-8 flex items-center justify-center border border-border text-sm font-bold bg-muted group-hover:bg-foreground group-hover:text-background transition-colors">
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs uppercase border border-border px-1.5 py-0.5 rounded text-muted-foreground">
                                                    {activeTab === 'lessons' ? 'Lý thuyết' : 'Thực hành'}
                                                </span>
                                                {/* @ts-ignore */}
                                                {item.simulatorUrl && (
                                                    <span className="text-xs uppercase border border-border px-1.5 py-0.5 rounded text-muted-foreground">Simulator</span>
                                                )}
                                            </div>
                                            <h4 className="font-bold text-lg mb-1 group-hover:underline">{item.title}</h4>
                                            {item.duration && (
                                                <div className="text-xs text-muted-foreground">
                                                    {item.duration} phút
                                                </div>
                                            )}
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

