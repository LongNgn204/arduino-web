// Landing Page - Trang chủ với premium UI (Light Theme)
// Hiển thị giới thiệu về Arduino Hub và các tính năng

import { Link } from 'react-router-dom';
import {
    Cpu, BookOpen, Code, Brain, Zap,
    ChevronRight, Sparkles, Play, CheckCircle2
} from 'lucide-react';
import { Button } from '../components/ui/Button';

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



    return (
        <div className="min-h-screen bg-white text-arduino-text-primary font-sans overflow-hidden">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center justify-center px-4 overflow-hidden pt-20 md:pt-0">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[#F8FAFCA0] opacity-80" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

                <div className="relative z-10 max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="text-center md:text-left">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-arduino-teal/20 mb-8 animate-fade-in shadow-sm mx-auto md:mx-0">
                            <Sparkles className="w-4 h-4 text-arduino-teal" />
                            <span className="text-sm font-medium text-arduino-teal">HNUE - Khoa Kỹ thuật & Công nghệ</span>
                        </div>

                        {/* Heading */}
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up text-gray-900 tracking-tight leading-tight" style={{ animationDelay: '0.1s' }}>
                            Arduino<span className="text-arduino-teal">Hub</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-600 mb-8 animate-slide-up font-medium leading-relaxed" style={{ animationDelay: '0.2s' }}>
                            Nền tảng học lập trình hệ thống nhúng & IoT thông minh với AI trợ giảng.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center md:justify-start justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                            <Link to="/register">
                                <Button size="lg" className="rounded-full px-8 py-4 text-lg shadow-xl shadow-arduino-teal/20 hover:shadow-2xl hover:shadow-arduino-teal/30 hover:-translate-y-1 transition-all">
                                    Bắt đầu học miễn phí
                                    <ChevronRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                            <Link to="/login">
                                <Button variant="secondary" size="lg" className="rounded-full px-8 py-4 text-lg bg-white/80 backdrop-blur-sm border-2 border-gray-100 hover:bg-white hover:border-arduino-teal/30">
                                    <Play className="w-5 h-5 mr-2" />
                                    Đăng nhập
                                </Button>
                            </Link>
                        </div>

                        {/* Mini Stats */}
                        <div className="mt-12 flex items-center justify-center md:justify-start gap-8 text-gray-500 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                <span>Miễn phí 100%</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                <span>Chứng chỉ HNUE</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Visual */}
                    <div className="relative animate-slide-up hidden md:block" style={{ animationDelay: '0.3s' }}>
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition-all duration-500">
                            <img
                                src="https://images.unsplash.com/photo-1555421689-d68471e189f2?auto=format&fit=crop&q=80&w=1000"
                                alt="Arduino Coding Workspace"
                                className="w-full object-cover h-[500px]"
                            />
                            {/* Floating UI Card Mockup */}
                            <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-100">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-arduino-mint/30 rounded-xl">
                                        <Code className="w-6 h-6 text-arduino-teal" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Bài tập tuần 1: Blink LED</h3>
                                        <p className="text-sm text-gray-500 mt-1">Viết chương trình điều khiển đèn LED nhấp nháy...</p>
                                        <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full w-2/3 bg-arduino-teal rounded-full" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Decorative Blob */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-arduino-yellow rounded-full blur-3xl opacity-50 -z-10" />
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-arduino-teal rounded-full blur-3xl opacity-30 -z-10" />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="relative py-24 px-4 bg-arduino-base/50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-block p-3 rounded-full bg-arduino-mint/30 mb-4">
                            <Code className="w-6 h-6 text-arduino-teal" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
                            Tại sao chọn <span className="text-arduino-teal">ArduinoHub</span>?
                        </h2>
                        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                            Nền tảng học tập hiện đại với đầy đủ công cụ giúp bạn thành thạo Arduino từ con số 0
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-arduino-mint/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-arduino-teal">
                                    <feature.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
                                <p className="text-gray-500 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* AI Section */}
            <section className="relative py-24 px-4 bg-white overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-arduino-base -skew-x-12 translate-x-32 z-0" />

                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="order-2 md:order-1">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-arduino-mint/50 border border-arduino-teal/20 mb-6">
                                <Brain className="w-4 h-4 text-arduino-teal" />
                                <span className="text-sm font-semibold text-arduino-teal">AI Trợ Giảng Thế Hệ Mới</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 leading-tight">
                                Học nhanh hơn với <br /><span className="text-arduino-teal">Trí tuệ nhân tạo</span>
                            </h2>
                            <p className="text-gray-500 mb-8 text-lg leading-relaxed">
                                Không còn lo mắc kẹt khi code. AI tutor sẽ luôn ở bên cạnh để giải thích, gợi ý sửa lỗi và chấm bài cho bạn 24/7.
                            </p>

                            <div className="space-y-4">
                                {[
                                    'Tutor Mode - Giải thích chi tiết từng dòng code',
                                    'Socratic Mode - Gợi mở tư duy thay vì chỉ đưa đáp án',
                                    'Grader Mode - Chấm bài tự động và đưa ra lời khuyên'
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                                        <div className="w-6 h-6 rounded-full bg-arduino-teal/10 flex items-center justify-center shrink-0">
                                            <CheckCircle2 className="w-4 h-4 text-arduino-teal" />
                                        </div>
                                        <span className="text-gray-700 font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative order-1 md:order-2">
                            <div className="relative bg-white rounded-3xl border border-gray-100 shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                                <div className="absolute -top-6 -right-6 w-20 h-20 bg-arduino-yellow rounded-full blur-2xl opacity-50" />
                                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-arduino-teal rounded-full blur-2xl opacity-50" />

                                <div className="flex items-center gap-4 mb-6 border-b border-gray-50 pb-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-arduino-teal to-teal-600 flex items-center justify-center shadow-lg">
                                        <Brain className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <span className="block font-bold text-gray-800">AI Tutor</span>
                                        <span className="text-xs text-green-500 font-medium flex items-center gap-1">
                                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Online
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-4 text-sm">
                                    <div className="flex gap-3">
                                        <div className="bg-gray-100 rounded-2xl rounded-tl-none p-4 text-gray-700 max-w-[85%]">
                                            <p>Em chưa hiểu về hàm <code className="text-arduino-teal font-mono font-bold">digitalWrite()</code> ạ? 🤔</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 flex-row-reverse">
                                        <div className="bg-arduino-mint/30 rounded-2xl rounded-tr-none p-4 text-gray-800 max-w-[90%]">
                                            <p className="mb-2">Chào em! Hàm này dùng để điều khiển điện áp tại chân digital:</p>
                                            <ul className="list-disc list-inside space-y-1 text-gray-600">
                                                <li><strong>HIGH (1)</strong>: Mức cao (5V)</li>
                                                <li><strong>LOW (0)</strong>: Mức thấp (0V)</li>
                                            </ul>
                                            <div className="mt-3 p-3 bg-white rounded-xl border border-arduino-teal/10 font-mono text-xs text-gray-600">
                                                digitalWrite(LED_BUILTIN, HIGH); <span className="text-gray-400">// Bật LED</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-24 px-4">
                <div className="max-w-5xl mx-auto text-center">
                    <div className="relative p-12 md:p-20 rounded-[3rem] bg-gradient-to-br from-arduino-teal to-teal-700 overflow-hidden shadow-2xl">
                        {/* Background pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white blur-3xl" />
                            <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-arduino-yellow blur-3xl" />
                        </div>

                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
                                Sẵn sàng bắt đầu hành trình?
                            </h2>
                            <p className="text-teal-100 mb-10 max-w-2xl mx-auto text-lg">
                                Tham gia cùng hàng trăm sinh viên HNUE đang học lập trình Arduino mỗi ngày. Hoàn toàn miễn phí.
                            </p>
                            <Link to="/register">
                                <Button size="lg" className="bg-white text-arduino-teal hover:bg-gray-50 border-none shadow-xl text-lg px-10 py-4 h-auto rounded-full font-bold">
                                    Đăng ký ngay bây giờ
                                    <ChevronRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-100 py-12 px-4 bg-gray-50 text-gray-500">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
                            <Cpu className="w-6 h-6 text-arduino-teal" />
                        </div>
                        <span className="font-bold text-gray-800 text-lg">ArduinoHub</span>
                    </div>
                    <div className="text-center md:text-right text-sm">
                        <p className="font-medium text-gray-700">© 2026 Khoa Kỹ thuật & Công nghệ - HNUE</p>
                        <p className="mt-1">Project Lead: Nguyễn Hoàng Long</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
