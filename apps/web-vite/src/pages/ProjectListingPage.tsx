import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Search, Filter, Cpu, ArrowRight, Zap, Signal } from 'lucide-react';

interface Project {
    id: string;
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    imageUrl: string | null;
    tags: string[]; // JSON string in DB, parsed array here
    isPublished: boolean;
}

const API_BASE = import.meta.env.PROD
    ? 'https://arduino-workers.stu725114073.workers.dev'
    : '';

export default function ProjectListingPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
    const [search, setSearch] = useState('');

    useEffect(() => {
        async function fetchProjects() {
            try {
                // Mock data for development if API fails or is empty
                // In production, fetch from API
                const res = await fetch(`${API_BASE}/api/projects`, { credentials: 'include' });
                if (res.ok) {
                    const data = await res.json();
                    if (data.projects && data.projects.length > 0) {
                        const parsedProjects = data.projects.map((p: any) => ({
                            ...p,
                            tags: typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags
                        }));
                        setProjects(parsedProjects);
                        return;
                    }
                }

                // Fallback Mock Data
                setProjects([
                    {
                        id: 'proj-01',
                        title: 'Đèn giao thông thông minh',
                        description: 'Xây dựng hệ thống đèn giao thông ngã tư sử dụng LED và Arduino, có chế độ ưu tiên.',
                        difficulty: 'easy',
                        imageUrl: 'https://images.unsplash.com/photo-1563297769-5a02e6040828?auto=format&fit=crop&q=80&w=600',
                        tags: ['LED', 'Digital Output', 'Cơ bản'],
                        isPublished: true
                    },
                    {
                        id: 'proj-02',
                        title: 'Trạm khí tượng với LCD',
                        description: 'Đo nhiệt độ, độ ẩm dùng DHT11 và hiển thị thông số lên màn hình LCD 16x2.',
                        difficulty: 'medium',
                        imageUrl: 'https://images.unsplash.com/photo-1580983582570-h69f8d5e8e8e?auto=format&fit=crop&q=80&w=600',
                        tags: ['Sensors', 'LCD', 'DHT11'],
                        isPublished: true
                    },
                    {
                        id: 'proj-03',
                        title: 'Robot tránh vật cản',
                        description: 'Lắp ráp và lập trình xe robot tự hành sử dụng cảm biến siêu âm để tránh va chạm.',
                        difficulty: 'hard',
                        imageUrl: 'https://images.unsplash.com/photo-1535378433864-48cf104192d6?auto=format&fit=crop&q=80&w=600',
                        tags: ['Robotics', 'Motors', 'Ultrasonic'],
                        isPublished: true
                    },
                    {
                        id: 'proj-04',
                        title: 'Nhà thông minh IoT',
                        description: 'Điều khiển thiết bị trong nhà qua Wifi sử dụng ESP32 và Blynk App.',
                        difficulty: 'hard',
                        imageUrl: 'https://images.unsplash.com/photo-1558002038-1091a1661113?auto=format&fit=crop&q=80&w=600',
                        tags: ['IoT', 'ESP32', 'Wifi'],
                        isPublished: true
                    }
                ]);
            } catch (error) {
                console.error('Failed to fetch projects', error);
            } finally {
                setLoading(false);
            }
        }

        fetchProjects();
    }, []);

    const filteredProjects = projects.filter(p => {
        const matchFilter = filter === 'all' || p.difficulty === filter;
        const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.description.toLowerCase().includes(search.toLowerCase());
        return matchFilter && matchSearch;
        return matchFilter && matchSearch;
    });

    const getDifficultyColor = (diff: string) => {
        switch (diff) {
            case 'easy': return 'default';
            case 'medium': return 'secondary';
            case 'hard': return 'destructive';
            default: return 'outline';
        }
    };

    return (
        <div className="min-h-screen font-sans bg-background">
            <header className="p-8 border-b border-border">
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                    <Cpu className="w-8 h-8" />
                    Thư viện Dự án
                </h1>
                <p className="text-muted-foreground text-lg">Khám phá và xây dựng các dự án thực tế với Arduino & IoT.</p>
            </header>

            {/* Filters */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm dự án..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                        />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                        <Filter className="w-4 h-4 text-muted-foreground mr-2 shrink-0" />
                        {(['all', 'easy', 'medium', 'hard'] as const).map((lvl) => (
                            <button
                                key={lvl}
                                onClick={() => setFilter(lvl)}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium capitalize transition-all whitespace-nowrap border ${filter === lvl
                                    ? 'bg-primary text-primary-foreground border-primary'
                                    : 'bg-background text-foreground border-input hover:bg-muted'
                                    }`}
                            >
                                {lvl === 'all' ? 'Tất cả' : lvl}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Project Grid */}
                {loading ? (
                    <div className="flex justify-center py-20 text-muted-foreground">
                        Đang tải dự án...
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProjects.map((project) => (
                            <Link to={`/projects/${project.id}`} key={project.id} className="block h-full">
                                <Card className="h-full flex flex-col overflow-hidden hover:bg-muted/50 transition-colors border-border">
                                    <div className="h-48 bg-muted relative overflow-hidden border-b border-border">
                                        {project.imageUrl ? (
                                            <img
                                                src={project.imageUrl}
                                                alt={project.title}
                                                className="w-full h-full object-cover transition-opacity hover:opacity-90"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                <Cpu className="w-12 h-12 opacity-20" />
                                            </div>
                                        )}
                                        <div className="absolute top-3 right-3">
                                            <Badge variant={getDifficultyColor(project.difficulty) as any} className="shadow-sm">
                                                {project.difficulty}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="p-5 flex-1 flex flex-col">
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {project.tags.map(tag => (
                                                <span key={tag} className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-1 rounded border border-border">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <h3 className="text-xl font-bold text-foreground mb-2">
                                            {project.title}
                                        </h3>
                                        <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
                                            {project.description}
                                        </p>
                                        <div className="flex items-center justify-between pt-4 border-t border-border">
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                                                {project.difficulty === 'hard' ? <Zap className="w-4 h-4" /> : <Signal className="w-4 h-4" />}
                                                {project.difficulty === 'easy' ? 'Dễ thực hiện' : project.difficulty === 'medium' ? 'Trung bình' : 'Thử thách'}
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                                                <ArrowRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
