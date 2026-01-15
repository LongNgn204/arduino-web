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
    });

    const getDifficultyColor = (diff: string) => {
        switch (diff) {
            case 'easy': return 'mint';
            case 'medium': return 'yellow';
            case 'hard': return 'coral';
            default: return 'gray';
        }
    };

    return (
        <div className="min-h-screen font-sans">
            <header className="mb-8">
                <h1 className="text-3xl font-black text-gray-900 mb-2 flex items-center gap-3">
                    <Cpu className="w-8 h-8 text-arduino-teal" />
                    Thư viện Dự án
                </h1>
                <p className="text-gray-500 text-lg">Khám phá và xây dựng các dự án thực tế với Arduino & IoT.</p>
            </header>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm dự án..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-arduino-teal/20 focus:border-arduino-teal/50"
                    />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                    <Filter className="w-5 h-5 text-gray-400 mr-2 shrink-0" />
                    {(['all', 'easy', 'medium', 'hard'] as const).map((lvl) => (
                        <button
                            key={lvl}
                            onClick={() => setFilter(lvl)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all whitespace-nowrap ${filter === lvl
                                ? 'bg-arduino-teal text-white shadow-lg shadow-arduino-teal/20'
                                : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            {lvl === 'all' ? 'Tất cả' : lvl}
                        </button>
                    ))}
                </div>
            </div>

            {/* Project Grid */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-10 h-10 border-4 border-arduino-teal border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => (
                        <Link to={`/projects/${project.id}`} key={project.id} className="group block h-full">
                            <Card className="h-full flex flex-col overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-gray-100">
                                <div className="h-48 bg-gray-100 relative overflow-hidden">
                                    {project.imageUrl ? (
                                        <img
                                            src={project.imageUrl}
                                            alt={project.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-arduino-mint/30 text-arduino-teal">
                                            <Cpu className="w-12 h-12 opacity-50" />
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3">
                                        <Badge variant={getDifficultyColor(project.difficulty) as any} className="shadow-sm border border-white/50 backdrop-blur-sm">
                                            {project.difficulty}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {project.tags.map(tag => (
                                            <span key={tag} className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-arduino-teal transition-colors">
                                        {project.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm line-clamp-3 mb-4 flex-1">
                                        {project.description}
                                    </p>
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                        <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                                            {project.difficulty === 'hard' ? <Zap className="w-4 h-4 text-orange-400" /> : <Signal className="w-4 h-4 text-arduino-teal" />}
                                            {project.difficulty === 'easy' ? 'Dễ thực hiện' : project.difficulty === 'medium' ? 'Trung bình' : 'Thử thách'}
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-arduino-teal group-hover:text-white transition-all">
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
    );
}
