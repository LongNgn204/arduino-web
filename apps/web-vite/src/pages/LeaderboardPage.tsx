
import { useEffect, useState } from 'react';
import { Trophy, Medal, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
                setData(res.leaderboard);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const getRankIcon = (rank: number) => {
        if (rank === 1) return <Crown className="w-8 h-8 text-yellow-400 drop-shadow-lg animate-bounce" />;
        if (rank === 2) return <Medal className="w-6 h-6 text-slate-300" />;
        if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />;
        return <span className="text-xl font-bold text-slate-500">#{rank}</span>;
    };

    const getRowStyle = (rank: number) => {
        if (rank === 1) return "bg-gradient-to-r from-yellow-500/20 to-amber-500/10 border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.2)] scale-105 z-10";
        if (rank === 2) return "bg-slate-800/80 border-slate-600";
        if (rank === 3) return "bg-slate-800/60 border-amber-900/50";
        return "bg-slate-900/50 border-slate-800 hover:bg-slate-800";
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-6 pb-20">
            {/* Header */}
            <div className="max-w-4xl mx-auto text-center mb-12">
                <div className="inline-flex items-center justify-center p-4 bg-yellow-500/10 rounded-full mb-4 border border-yellow-500/20">
                    <Trophy className="w-12 h-12 text-yellow-400" />
                </div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-yellow-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent mb-2">
                    Bảng Xếp Hạng Học Tập
                </h1>
                <p className="text-slate-400">Top 10 sinh viên xuất sắc nhất tuần này</p>
            </div>

            {/* List */}
            <div className="max-w-3xl mx-auto space-y-4">
                {loading ? (
                    <div className="text-center text-slate-500 py-10">Đang tải dữ liệu...</div>
                ) : data.length === 0 ? (
                    <div className="text-center text-slate-500 py-10">Chưa có dữ liệu xếp hạng.</div>
                ) : (
                    data.map((item) => (
                        <div
                            key={item.id}
                            className={`relative flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${getRowStyle(item.rank)}`}
                        >
                            {/* Rank */}
                            <div className="w-12 flex justify-center shrink-0">
                                {getRankIcon(item.rank)}
                            </div>

                            {/* Avatar */}
                            <img
                                src={item.avatar}
                                alt={item.displayName}
                                className="w-12 h-12 rounded-full border-2 border-slate-700 shadow-sm bg-slate-800"
                            />

                            {/* Name & Stats */}
                            <div className="flex-1 min-w-0">
                                <h3 className={`font-bold text-lg truncate ${item.rank === 1 ? 'text-yellow-300' : 'text-slate-200'}`}>
                                    {item.displayName}
                                </h3>
                                <div className="flex gap-4 text-xs text-slate-400">
                                    <span className="flex items-center gap-1">
                                        🎮 {item.stats.quizzes} Quiz pts
                                    </span>
                                    <span className="flex items-center gap-1">
                                        🧪 {item.stats.labs} Labs
                                    </span>
                                </div>
                            </div>

                            {/* Total XP */}
                            <div className="text-right shrink-0">
                                <div className="text-2xl font-black text-white leading-none">
                                    {item.xp.toLocaleString()} <span className="text-sm font-medium text-yellow-500">XP</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="max-w-3xl mx-auto mt-8 text-center">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="text-slate-400 hover:text-white underline transition-colors"
                >
                    &larr; Quay lại Dashboard
                </button>
            </div>
        </div>
    );
}
