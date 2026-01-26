
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
        if (rank === 1) return <Crown className="w-8 h-8 text-yellow-500 animate-bounce" />;
        if (rank === 2) return <Medal className="w-6 h-6 text-muted-foreground" />;
        if (rank === 3) return <Medal className="w-6 h-6 text-amber-700" />;
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    };

    const getRowStyle = (rank: number) => {
        if (rank === 1) return "bg-accent/50 border-accent/20 border shadow-sm z-10";
        return "bg-card border-border border hover:bg-muted/50";
    };

    return (
        <div className="min-h-screen bg-background p-4 md:p-6 pb-20 font-sans">
            {/* Header */}
            <div className="max-w-4xl mx-auto text-center mb-8 md:mb-12 animate-fade-in">
                <div className="inline-flex items-center justify-center p-4 bg-muted rounded-full mb-4 border border-border">
                    <Trophy className="w-8 h-8 md:w-10 md:h-10 text-foreground" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                    Bảng Xếp Hạng
                </h1>
                <p className="text-muted-foreground text-sm md:text-base">Vinh danh những sinh viên xuất sắc nhất tuần này</p>
            </div>

            {/* List */}
            <div className="max-w-3xl mx-auto space-y-3 animate-slide-up">
                {loading ? (
                    <div className="flex flex-col gap-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-20 bg-muted rounded-md animate-pulse" />
                        ))}
                    </div>
                ) : data.length === 0 ? (
                    <Card className="p-8 text-center bg-card border-border">
                        <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">Chưa có dữ liệu xếp hạng.</p>
                    </Card>
                ) : (
                    data.map((item) => (
                        <div
                            key={item.id}
                            className={`relative flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-md transition-all duration-300 ${getRowStyle(item.rank)}`}
                        >
                            {/* Rank */}
                            <div className="w-8 md:w-12 flex justify-center shrink-0">
                                {getRankIcon(item.rank)}
                            </div>

                            {/* Avatar */}
                            <img
                                src={item.avatar}
                                alt={item.displayName}
                                className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-border bg-muted object-cover"
                            />

                            {/* Name & Stats */}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-base md:text-lg text-foreground truncate">
                                    {item.displayName}
                                </h3>
                                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-1">
                                    <Badge variant="outline" className="gap-1 font-normal">
                                        <TrendingUp className="w-3 h-3" />
                                        {item.stats.quizzes} Quiz pts
                                    </Badge>
                                    <Badge variant="outline" className="gap-1 font-normal">
                                        <Search className="w-3 h-3" />
                                        {item.stats.labs} Labs
                                    </Badge>
                                </div>
                            </div>

                            {/* Total XP */}
                            <div className="text-right shrink-0">
                                <div className="text-2xl font-bold text-foreground leading-none">
                                    {item.xp.toLocaleString()} <span className="text-sm font-medium text-muted-foreground">XP</span>
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
                    className="text-muted-foreground hover:text-foreground"
                >
                    &larr; Quay lại Dashboard
                </Button>
            </div>
        </div>
    );
}
