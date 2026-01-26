import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Bookmark, BookOpen, Cpu, Loader2, Trash2 } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

const API_BASE = import.meta.env.PROD
    ? 'https://arduino-workers.stu725114073.workers.dev'
    : '';

interface SavedItem {
    id: string; // saved_item id
    itemId: string;
    itemType: 'lesson' | 'project';
    title?: string; // Hydrated
    description?: string; // Hydrated
    imageUrl?: string; // Hydrated
    createdAt: string;
}

export default function SavedPage() {
    const { user } = useAuthStore();
    const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSaved() {
            if (!user?.id) {
                setLoading(false);
                return;
            }
            try {
                // In a real app, we would fetch saved items AND their details (join or separate calls)
                // For MVP, we will mock the "Hydration" part or assume the API returns joined data
                // Or we fetch /api/saved which gives list, then we might need to fetch details.
                // For simplicity here, I will mock the response structure as if API returns hydrated data.

                const res = await fetch(`${API_BASE}/api/saved?userId=${user.id}`, { credentials: 'include' });
                if (res.ok) {
                    const data = await res.json();
                    // Mock Hydration for demo since backend just returns raw rows currently
                    // In real implementation, backend should join with lessons/projects tables
                    const hydrated = data.saved.map((item: any) => ({
                        ...item,
                        title: item.itemType === 'lesson' ? `Bài học: ${item.itemId}` : `Dự án: ${item.itemId}`,
                        description: 'Nội dung đã lưu...',
                        imageUrl: item.itemType === 'project' ? 'https://images.unsplash.com/photo-1558002038-1091a1661113?auto=format&fit=crop&q=80&w=300' : null
                    }));
                    setSavedItems(hydrated);
                } else {
                    // Fallback Mock
                    setSavedItems([
                        {
                            id: '1',
                            itemId: 'week-01_lesson-01',
                            itemType: 'lesson',
                            title: 'Tuần 1: Giới thiệu Arduino',
                            description: 'Làm quen với board Arduino Uno R3 và môi trường IDE.',
                            createdAt: new Date().toISOString()
                        },
                        {
                            id: '2',
                            itemId: 'proj-01',
                            itemType: 'project',
                            title: 'Đèn giao thông thông minh',
                            description: 'Dự án thực hành LED cơ bản.',
                            imageUrl: 'https://images.unsplash.com/photo-1563297769-5a02e6040828?auto=format&fit=crop&q=80&w=300',
                            createdAt: new Date().toISOString()
                        }
                    ]);
                }

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchSaved();
    }, [user]);

    const handleRemove = async (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        // Optimistic UI update
        setSavedItems(prev => prev.filter(item => item.id !== id));

        // Call API to remove (toggle save with same params or specific delete endpoint)
        // Here we just simulate
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="w-8 h-8 text-muted-foreground animate-spin" /></div>;

    return (
        <div className="font-sans min-h-screen bg-background">
            <header className="mb-8 pt-8 px-4 max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
                    <Bookmark className="w-8 h-8 text-foreground" />
                    Đã lưu
                </h1>
                <p className="text-muted-foreground text-lg">Các bài học và dự án bạn đã đánh dấu để xem sau.</p>
            </header>

            <main className="px-4 max-w-6xl mx-auto pb-20">
                {savedItems.length === 0 ? (
                    <div className="text-center py-20 bg-card rounded-lg border border-border">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                            <Bookmark className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground mb-1">Chưa có mục nào được lưu</h3>
                        <p className="text-muted-foreground mb-6">Hãy khám phá bài học và dự án, sau đó nhấn nút lưu nhé!</p>
                        <Link to="/dashboard">
                            <Button variant="secondary">Khám phá ngay</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {savedItems.map(item => (
                            <Link
                                to={item.itemType === 'lesson' ? `/lessons/${item.itemId}` : `/projects/${item.itemId}`}
                                key={item.id}
                                className="group block h-full"
                            >
                                <Card className="h-full flex flex-col hover:border-primary transition-all duration-300">
                                    {item.imageUrl && (
                                        <div className="h-40 bg-muted overflow-hidden relative">
                                            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            <div className="absolute top-2 right-2">
                                                <Badge variant="secondary" className="bg-background/90 backdrop-blur shadow-sm">
                                                    {item.itemType === 'project' ? 'Project' : 'Lesson'}
                                                </Badge>
                                            </div>
                                        </div>
                                    )}
                                    <div className="p-5 flex-1 flex flex-col">
                                        {!item.imageUrl && (
                                            <div className="flex items-center gap-2 mb-3">
                                                <Badge variant={item.itemType === 'lesson' ? 'secondary' : 'outline'}>
                                                    {item.itemType === 'lesson' ? <BookOpen className="w-3 h-3 mr-1" /> : <Cpu className="w-3 h-3 mr-1" />}
                                                    {item.itemType === 'lesson' ? 'Bài học' : 'Dự án'}
                                                </Badge>
                                            </div>
                                        )}
                                        <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                            {item.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                                            {item.description}
                                        </p>
                                        <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                                            <span className="text-xs text-muted-foreground">Đã lưu {new Date(item.createdAt).toLocaleDateString('vi-VN')}</span>
                                            <button
                                                onClick={(e) => handleRemove(item.id, e)}
                                                className="p-2 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-md transition-colors"
                                                title="Bỏ lưu"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
