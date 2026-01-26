import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { cn } from './ui/Card'; // Use utility
import { useChatStore } from '../stores/chatStore';

interface SidebarProps {
    children: React.ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout, isAuthenticated } = useAuthStore();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { toggleChatSidebar, isChatSidebarOpen } = useChatStore();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    // Navigation Items - Text Only
    const navItems = [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'TECH476 Lập trình nhúng', href: '/weeks/week-01' },
        { type: 'divider' },
        { label: 'Quiz', href: '/quizzes' },
        { label: 'Exam Drills', href: '/drills' },
        { type: 'divider' },
        { label: 'Đã lưu', href: '/saved' },
        { label: 'Thư viện', href: '/library' },
        { label: 'AI Studio', href: '/ai-assistant' },
        { label: 'Web IDE', href: '/ide' },
        { label: 'Bảng xếp hạng', href: '/leaderboard' },
        { label: 'Chứng nhận', href: '/certificate' },
    ];

    const isActive = (href: string) => location.pathname === href || location.pathname.startsWith(href + '/');

    if (!isAuthenticated) {
        return <>{children}</>;
    }

    return (
        <div className="flex h-screen bg-background text-foreground font-sans">
            {/* Mobile Menu Button - Text Only */}
            <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden fixed top-4 left-4 z-[60] px-4 py-2 bg-white border border-border rounded-md text-sm font-medium shadow-sm"
            >
                {mobileOpen ? 'Close' : 'Menu'}
            </button>

            {/* Mobile Overlay */}
            {mobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed lg:relative inset-y-0 left-0 z-50 flex flex-col bg-card border-r border-border transition-all duration-300 ease-in-out",
                collapsed ? 'w-20' : 'w-64',
                mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            )}>
                {/* Logo Header */}
                <div className="flex items-center justify-between h-16 px-4 border-b border-border">
                    <Link to="/dashboard" className="flex items-center gap-2 font-bold text-lg tracking-tight">
                        {!collapsed ? (
                            <span>KNTT STEM</span>
                        ) : (
                            <span>KS</span>
                        )}
                    </Link>
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="hidden lg:block text-xs text-muted-foreground hover:text-foreground"
                    >
                        {collapsed ? '>' : '<'}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
                    {navItems.map((item, index) => {
                        if (item.type === 'divider') {
                            return <div key={index} className="h-px bg-border my-2 mx-2" />;
                        }

                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const href = (item as any).href;
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const label = (item as any).label;

                        const active = isActive(href);

                        return (
                            <Link
                                key={href}
                                to={href}
                                onClick={() => setMobileOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                    active
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                    collapsed ? "justify-center" : ""
                                )}
                                title={collapsed ? label : undefined}
                            >
                                {collapsed ? (
                                    <span className="font-bold">{label.substring(0, 2).toUpperCase()}</span>
                                ) : (
                                    <span>{label}</span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* AI Chat Toggle */}
                <div className="p-2 border-t border-border">
                    <button
                        onClick={toggleChatSidebar}
                        className={cn(
                            "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                            isChatSidebarOpen
                                ? "bg-secondary text-secondary-foreground"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground",
                            collapsed ? "justify-center" : ""
                        )}
                    >
                        {collapsed ? (
                            <span className="font-bold">AI</span>
                        ) : (
                            <span>Trợ lý AI</span>
                        )}
                    </button>
                </div>

                {/* User Section */}
                <div className="p-4 border-t border-border">
                    <div className={cn("flex items-center gap-3", collapsed ? "justify-center" : "")}>
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                            {user?.displayName?.[0] || user?.username?.[0] || 'U'}
                        </div>
                        {!collapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                    {user?.displayName || user?.username}
                                </p>
                                <button
                                    onClick={handleLogout}
                                    className="text-xs text-muted-foreground hover:text-destructive mt-1"
                                >
                                    Đăng xuất
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-background p-4 lg:p-8">
                <div className="max-w-5xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}

