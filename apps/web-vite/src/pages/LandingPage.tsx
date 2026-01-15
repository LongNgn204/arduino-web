// Landing Page - Trang chủ với premium UI
// Hiển thị giới thiệu về Arduino Hub và các tính năng

import { Link } from 'react-router-dom';
import {
    Cpu, BookOpen, Code, Brain, Zap, Users,
    ChevronRight, Sparkles, Play, CheckCircle2
} from 'lucide-react';

export default function LandingPage() {
    const features = [
        {
            icon: BookOpen,
            title: '12 Tuần Học Tập',
            description: 'Giáo trình đầy đủ từ cơ bản đến nâng cao'
        },
        {
            icon: Brain,
            title: 'AI Trợ Giảng',
            description: '3 chế độ: Tutor, Socratic, Grader'
        },
        {
            icon: Code,
            title: 'Simulator Online',
            description: 'Chạy code Arduino ngay trên web với Wokwi'
        },
        {
            icon: Zap,
            title: 'Quiz & Labs',
            description: 'Bài tập thực hành và kiểm tra kiến thức'
        }
    ];

    const stats = [
        { value: '12', label: 'Tuần học' },
        { value: '36+', label: 'Bài học' },
        { value: '24+', label: 'Labs thực hành' },
        { value: '100+', label: 'Câu hỏi quiz' }
    ];

    return (
        <div className="min-h-screen bg-gray-950 text-white overflow-hidden">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center px-4">
                {/* Animated background */}
                <div className="absolute inset-0 auth-gradient-bg opacity-50" />

                {/* Floating orbs */}
                <div className="auth-orb w-[500px] h-[500px] -top-64 -left-64 animate-float" />
                <div className="auth-orb w-[400px] h-[400px] top-1/3 -right-48 animate-float" style={{ animationDelay: '2s' }} />
                <div className="auth-orb w-[300px] h-[300px] bottom-20 left-1/3 animate-float" style={{ animationDelay: '4s' }} />

                <div className="relative z-10 max-w-5xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-arduino-teal/10 border border-arduino-teal/20 mb-8 animate-fade-in">
                        <Sparkles className="w-4 h-4 text-arduino-teal" />
                        <span className="text-sm text-arduino-light">HNUE - Khoa Kỹ thuật & Công nghệ</span>
                    </div>

                    {/* Logo */}
                    <div className="flex items-center justify-center gap-4 mb-6 animate-slide-up">
                        <div className="relative">
                            <Cpu className="w-20 h-20 text-arduino-teal" />
                            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-arduino-light animate-pulse" />
                        </div>
                    </div>

                    {/* Heading */}
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        Arduino<span className="text-arduino-teal">Hub</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-300 mb-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        Nền tảng học lập trình Arduino thông minh
                    </p>

                    <p className="text-gray-400 max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                        Học môn <strong className="text-white">"Lập trình hệ thống nhúng & IoT"</strong> với
                        AI trợ giảng, simulator online và bài tập thực hành theo giáo trình 12 tuần.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                        <Link
                            to="/register"
                            className="group flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-arduino-teal to-arduino-dark hover:shadow-[0_0_40px_rgba(0,151,157,0.4)] transition-all duration-300"
                        >
                            Bắt đầu học miễn phí
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/login"
                            className="flex items-center gap-2 px-8 py-4 rounded-xl font-medium text-gray-300 border border-gray-700 hover:border-gray-500 hover:text-white transition-all duration-300"
                        >
                            <Play className="w-5 h-5" />
                            Đăng nhập
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-3xl md:text-4xl font-bold text-arduino-teal">{stat.value}</div>
                                <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 rounded-full border-2 border-gray-600 flex items-start justify-center p-2">
                        <div className="w-1 h-2 bg-gray-400 rounded-full" />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="relative py-24 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Tại sao chọn <span className="text-arduino-teal">ArduinoHub</span>?
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Nền tảng học tập hiện đại với đầy đủ công cụ giúp bạn thành thạo Arduino
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-arduino-teal/30 hover:bg-white/[0.07] transition-all duration-300"
                            >
                                <div className="w-12 h-12 rounded-xl bg-arduino-teal/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <feature.icon className="w-6 h-6 text-arduino-teal" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                                <p className="text-gray-400 text-sm">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* AI Section */}
            <section className="relative py-24 px-4 bg-gradient-to-b from-transparent to-arduino-teal/5">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-arduino-teal/10 border border-arduino-teal/20 mb-6">
                                <Brain className="w-4 h-4 text-arduino-teal" />
                                <span className="text-sm text-arduino-light">AI Trợ Giảng</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                Học với sự hỗ trợ của <span className="text-arduino-teal">Trí tuệ nhân tạo</span>
                            </h2>
                            <p className="text-gray-400 mb-8">
                                AI trợ giảng thông minh giúp bạn hiểu bài nhanh hơn, debug code hiệu quả và luyện tập theo phong cách riêng.
                            </p>

                            <div className="space-y-4">
                                {[
                                    'Tutor Mode - Giải thích chi tiết từng bước',
                                    'Socratic Mode - Đặt câu hỏi gợi mở tư duy',
                                    'Grader Mode - Chấm bài và gợi ý sửa lỗi'
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-arduino-teal flex-shrink-0" />
                                        <span className="text-gray-300">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-arduino-teal/20 blur-3xl rounded-full" />
                            <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-full bg-arduino-teal/20 flex items-center justify-center">
                                        <Brain className="w-4 h-4 text-arduino-teal" />
                                    </div>
                                    <span className="text-sm font-medium">AI Tutor</span>
                                </div>
                                <div className="space-y-3 text-sm text-gray-300">
                                    <p className="p-3 rounded-lg bg-white/5">
                                        💡 <strong>Giải thích:</strong> Hàm <code className="text-arduino-light">digitalWrite()</code> dùng để điều khiển điện áp tại một chân digital...
                                    </p>
                                    <p className="p-3 rounded-lg bg-white/5">
                                        📝 <strong>Ví dụ:</strong> <code className="text-arduino-light">digitalWrite(LED_PIN, HIGH);</code> sẽ bật LED...
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-24 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="p-12 rounded-3xl bg-gradient-to-r from-arduino-teal/10 to-arduino-dark/10 border border-arduino-teal/20">
                        <Users className="w-12 h-12 text-arduino-teal mx-auto mb-6" />
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Sẵn sàng bắt đầu?
                        </h2>
                        <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                            Tham gia cùng hàng trăm sinh viên HNUE đang học lập trình Arduino với ArduinoHub
                        </p>
                        <Link
                            to="/register"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-arduino-teal to-arduino-dark hover:shadow-[0_0_40px_rgba(0,151,157,0.4)] transition-all duration-300"
                        >
                            Đăng ký miễn phí ngay
                            <ChevronRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/10 py-8 px-4">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Cpu className="w-6 h-6 text-arduino-teal" />
                        <span className="font-semibold">ArduinoHub</span>
                    </div>
                    <p className="text-sm text-gray-500">
                        © 2026 HNUE - Khoa Kỹ thuật & Công nghệ. Chủ dự án: Nguyễn Hoàng Long
                    </p>
                </div>
            </footer>
        </div>
    );
}
