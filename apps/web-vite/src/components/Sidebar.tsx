import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import {
    Home,
    BookOpen,
    Trophy,
    Award,
    Zap,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Cpu,
    Menu,
    X,
    Terminal,
    ClipboardCheck,
    Bookmark
} from 'lucide-react';
import { cn } from './ui/Card'; // Use utility

interface SidebarProps {
    children: React.ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout, isAuthenticated } = useAuthStore();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    // Navigation Items
    const navItems = [
        { icon: Home, label: 'Dashboard', href: '/dashboard' },
        { icon: BookOpen, label: 'Tuần 1', href: '/weeks/week-01' },
        { icon: BookOpen, label: 'Tuần 2', href: '/weeks/week-02' },
        { icon: BookOpen, label: 'Tuần 3', href: '/weeks/week-03' },
        { icon: BookOpen, label: 'Tuần 4', href: '/weeks/week-04' },
        { type: 'divider' },
        { icon: Bookmark, label: 'Đã lưu', href: '/saved', color: 'purple' },
        { icon: Cpu, label: 'Thư viện dự án', href: '/projects', color: 'blue' },
        { icon: Terminal, label: 'Web IDE', href: '/ide', color: 'green' },
        { icon: Zap, label: 'Exam Drill', href: '/drills/drill-01', color: 'cyan' },
        { icon: ClipboardCheck, label: 'Quiz Tuần 1', href: '/quizzes/quiz-01', color: 'orange' },
        { icon: Trophy, label: 'Bảng xếp hạng', href: '/leaderboard', color: 'yellow' },
        { icon: Award, label: 'Chứng nhận', href: '/certificate', color: 'purple' },
    ];

    const isActive = (href: string) => location.pathname === href || location.pathname.startsWith(href + '/');

    if (!isAuthenticated) {
        return <>{children}</>;
    }

    return (
        <div className="flex h-screen bg-arduino-base text-arduino-text-primary font-sans">
            {/* Mobile Menu Button */}
            <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden fixed top-4 left-4 z-[60] p-2 bg-white rounded-xl text-arduino-teal shadow-lg border border-gray-100"
            >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Mobile Overlay */}
            {mobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed lg:relative inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-gray-200 shadow-xl lg:shadow-none transition-all duration-300 ease-in-out",
                collapsed ? 'w-20' : 'w-72',
                mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            )}>
                {/* Logo Header */}
                <div className="flex items-center justify-between h-20 px-6 border-b border-gray-100/50 relative">
                    <Link to="/dashboard" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-arduino-teal rounded-xl flex items-center justify-center shadow-lg shadow-arduino-teal/20 group-hover:scale-105 transition-transform">
                            <Cpu className="w-6 h-6 text-white" />
                        </div>
                        {!collapsed && (
                            <div className="animate-fade-in flex flex-col">
                                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-arduino-teal to-teal-600">
                                    ArduinoHub
                                </h1>
                                <span className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">Learning System</span>
                            </div>
                        )}
                    </Link>
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="hidden lg:flex absolute -right-3 top-8 bg-white border border-gray-100 p-1 rounded-full shadow-md hover:bg-gray-50 text-gray-400 hover:text-arduino-teal transition-colors"
                    >
                        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
                    {navItems.map((item, index) => {
                        if (item.type === 'divider') {
                            return <div key={index} className="h-px bg-gray-100 my-4 mx-2" />;
                        }

                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const Icon = (item as any).icon;
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
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                                    active
                                        ? "bg-arduino-mint text-arduino-teal font-semibold shadow-sm"
                                        : "text-gray-500 hover:bg-gray-50 hover:text-arduino-teal",
                                    collapsed ? "justify-center px-2" : ""
                                )}
                                title={collapsed ? label : undefined}
                            >
                                <Icon className={cn(
                                    "w-5 h-5 shrink-0 transition-colors",
                                    active ? "text-arduino-teal" : "text-gray-400 group-hover:text-arduino-teal"
                                )} />
                                {!collapsed && (
                                    <span className="text-sm truncate">{label}</span>
                                )}
                                {active && !collapsed && (
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-arduino-teal rounded-l-full" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Section */}
                <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                    <div className={cn("flex items-center gap-3", collapsed ? "justify-center" : "")}>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-arduino-coral to-pink-300 flex items-center justify-center text-white font-bold shadow-md shrink-0 border-2 border-white">
                            {user?.displayName?.[0] || user?.username?.[0] || 'U'}
                        </div>
                        {!collapsed && (
                            <div className="flex-1 min-w-0 animate-fade-in">
                                <p className="text-sm font-bold text-gray-700 truncate">
                                    {user?.displayName || user?.username}
                                </p>
                                <p className="text-xs text-gray-500 capitalize bg-gray-200/50 inline-block px-2 py-0.5 rounded-full mt-0.5">
                                    {user?.role}
                                </p>
                            </div>
                        )}
                        {!collapsed && (
                            <button
                                onClick={handleLogout}
                                className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                                title="Đăng xuất"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-arduino-base p-4 lg:p-8">
                <div className="max-w-7xl mx-auto animate-fade-in">
                    {children}
                </div>
            </main>
        </div>
    );
}

