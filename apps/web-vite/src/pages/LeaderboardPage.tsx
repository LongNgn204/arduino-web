
import { useEffect, useState } from 'react';
import { Trophy, Medal, Crown, TrendingUp, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

const API_BASE = import.meta.env.PROD
    ? 'https://arduino-workers.stu725114073.workers.dev'
    : '';

interface LeaderboardItem {
    rank: number;
    id: string;
    displayName: string;
    avatar: string;
    xp: number;
    stats: {
        quizzes: number;
        labs: number;
    };
}

export function LeaderboardPage() {
    const [data, setData] = useState<LeaderboardItem[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${API_BASE}/api/leaderboard`)
            .then(res => res.json())
            .then(res => {
                setData(res.leaderboard || []);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const getRankIcon = (rank: number) => {
        if (rank === 1) return <Crown className="w-8 h-8 text-yellow-500 drop-shadow-md animate-bounce" />;
        if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
        if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />;
        return <span className="text-lg font-bold text-gray-400">#{rank}</span>;
    };

    const getRowStyle = (rank: number) => {
        if (rank === 1) return "bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200 shadow-lg shadow-yellow-500/10 scale-105 z-10";
        if (rank === 2) return "bg-white border-gray-100 shadow-sm";
        if (rank === 3) return "bg-white border-gray-100 shadow-sm";
        return "bg-white border-transparent hover:border-gray-100 hover:shadow-sm";
    };

    return (
        <div className="min-h-screen bg-arduino-base text-arduino-text-primary p-6 pb-20 font-sans">
            {/* Header */}
            <div className="max-w-4xl mx-auto text-center mb-12 animate-fade-in">
                <div className="inline-flex items-center justify-center p-4 bg-yellow-100 rounded-full mb-4 border border-yellow-200 shadow-sm">
                    <Trophy className="w-10 h-10 text-yellow-600" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent mb-2">
                    Bảng Xếp Hạng
                </h1>
                <p className="text-arduino-text-secondary">Vinh danh những sinh viên xuất sắc nhất tuần này</p>
            </div>

            {/* List */}
            <div className="max-w-3xl mx-auto space-y-3 animate-slide-up">
                {loading ? (
                    <div className="flex flex-col gap-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-20 bg-white rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : data.length === 0 ? (
                    <Card className="p-8 text-center text-arduino-text-secondary">
                        <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p>Chưa có dữ liệu xếp hạng.</p>
                    </Card>
                ) : (
                    data.map((item) => (
                        <div
                            key={item.id}
                            className={`relative flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 ${getRowStyle(item.rank)}`}
                        >
                            {/* Rank */}
                            <div className="w-12 flex justify-center shrink-0">
                                {getRankIcon(item.rank)}
                            </div>

                            {/* Avatar */}
                            <img
                                src={item.avatar}
                                alt={item.displayName}
                                className="w-12 h-12 rounded-full border-2 border-white shadow-md bg-gray-100 object-cover"
                            />

                            {/* Name & Stats */}
                            <div className="flex-1 min-w-0">
                                <h3 className={`font-bold text-lg truncate ${item.rank === 1 ? 'text-arduino-text-primary' : 'text-arduino-text-secondary'}`}>
                                    {item.displayName}
                                </h3>
                                <div className="flex gap-4 text-xs text-arduino-text-muted mt-1">
                                    <Badge variant="secondary" className="gap-1 bg-gray-50 hover:bg-gray-100 text-arduino-text-muted border-gray-100">
                                        <TrendingUp className="w-3 h-3" />
                                        {item.stats.quizzes} Quiz pts
                                    </Badge>
                                    <Badge variant="secondary" className="gap-1 bg-gray-50 hover:bg-gray-100 text-arduino-text-muted border-gray-100">
                                        <Search className="w-3 h-3" />
                                        {item.stats.labs} Labs
                                    </Badge>
                                </div>
                            </div>

                            {/* Total XP */}
                            <div className="text-right shrink-0">
                                <div className="text-2xl font-bold text-arduino-teal leading-none">
                                    {item.xp.toLocaleString()} <span className="text-sm font-medium text-arduino-text-muted">XP</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="max-w-3xl mx-auto mt-12 text-center">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/dashboard')}
                    className="text-arduino-text-secondary hover:text-arduino-teal"
                >
                    &larr; Quay lại Dashboard
                </Button>
            </div>
        </div>
    );
}
