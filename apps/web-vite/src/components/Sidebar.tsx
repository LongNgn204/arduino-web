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
    ClipboardCheck
} from 'lucide-react';

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
        <div className="flex h-screen bg-slate-950">
            {/* Mobile Menu Button */}
            <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden fixed top-4 left-4 z-[60] p-2 bg-slate-800 rounded-lg text-white shadow-lg"
            >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Mobile Overlay */}
            {mobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:relative inset-y-0 left-0 z-50
                flex flex-col bg-slate-900 border-r border-slate-800
                transition-all duration-300 ease-in-out
                ${collapsed ? 'w-20' : 'w-64'}
                ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Logo Header */}
                <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800">
                    <Link to="/dashboard" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/30">
                            <Cpu className="w-6 h-6 text-white" />
                        </div>
                        {!collapsed && (
                            <div className="animate-fadeIn">
                                <h1 className="text-lg font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                                    Arduino
                                </h1>
                                <p className="text-xs text-slate-500">Learning Hub</p>
                            </div>
                        )}
                    </Link>
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="hidden lg:flex p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                    >
                        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item, index) => {
                        if (item.type === 'divider') {
                            return <div key={index} className="h-px bg-slate-800 my-4" />;
                        }

                        const Icon = item.icon!;
                        const active = isActive(item.href!);
                        const colorClass = item.color === 'cyan'
                            ? 'text-cyan-400'
                            : item.color === 'yellow'
                                ? 'text-yellow-400'
                                : item.color === 'purple'
                                    ? 'text-purple-400'
                                    : item.color === 'orange'
                                        ? 'text-orange-400'
                                        : item.color === 'green'
                                            ? 'text-green-400'
                                            : 'text-teal-400';

                        return (
                            <Link
                                key={item.href}
                                to={item.href!}
                                onClick={() => setMobileOpen(false)}
                                className={`
                                    flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all
                                    ${active
                                        ? 'bg-teal-500/10 text-teal-400 border border-teal-500/30'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                    }
                                    ${collapsed ? 'justify-center' : ''}
                                `}
                                title={collapsed ? item.label : undefined}
                            >
                                <Icon className={`w-5 h-5 shrink-0 ${active ? colorClass : ''}`} />
                                {!collapsed && (
                                    <span className="text-sm font-medium truncate">{item.label}</span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Section */}
                <div className="p-4 border-t border-slate-800">
                    <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shrink-0">
                            {user?.displayName?.[0] || user?.username?.[0] || 'U'}
                        </div>
                        {!collapsed && (
                            <div className="flex-1 min-w-0 animate-fadeIn">
                                <p className="text-sm font-medium text-white truncate">
                                    {user?.displayName || user?.username}
                                </p>
                                <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
                            </div>
                        )}
                        {!collapsed && (
                            <button
                                onClick={handleLogout}
                                className="p-2 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors"
                                title="Đăng xuất"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                    {collapsed && (
                        <button
                            onClick={handleLogout}
                            className="mt-3 w-full p-2 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors flex justify-center"
                            title="Đăng xuất"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    );
}
