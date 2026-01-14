import Link from 'next/link';
import { ArrowRight, BookOpen, Code2, Cpu, Sparkles } from 'lucide-react';

// Trang chủ Arduino Learning Hub
export default function HomePage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <header className="relative overflow-hidden bg-gradient-to-br from-arduino-teal via-primary-600 to-primary-800">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                </div>

                <nav className="relative z-10 container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Cpu className="h-8 w-8 text-white" />
                            <span className="text-xl font-bold text-white">Arduino Hub</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link
                                href="/login"
                                className="text-white/90 hover:text-white transition-colors font-medium"
                            >
                                Đăng nhập
                            </Link>
                            <Link
                                href="/register"
                                className="bg-white text-arduino-teal px-4 py-2 rounded-lg font-medium 
                         hover:bg-white/90 transition-all hover:shadow-lg"
                            >
                                Đăng ký
                            </Link>
                        </div>
                    </div>
                </nav>

                <div className="relative z-10 container mx-auto px-6 py-20 md:py-32">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                            <Sparkles className="h-4 w-4 text-yellow-300" />
                            <span className="text-white/90 text-sm font-medium">Có AI trợ giảng thông minh</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 text-balance">
                            Học lập trình <span className="text-yellow-300">Arduino</span> theo giáo trình 12 tuần
                        </h1>

                        <p className="text-xl text-white/80 mb-8 max-w-2xl">
                            Dành cho sinh viên Khoa Kỹ thuật & Công nghệ - ĐH Sư phạm Hà Nội.
                            Học từ cơ bản đến nâng cao với AI trợ giảng, simulator trực tuyến và bài tập thực hành.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/register"
                                className="inline-flex items-center justify-center gap-2 bg-white text-arduino-teal 
                         px-6 py-3 rounded-xl font-semibold text-lg
                         hover:bg-yellow-300 transition-all hover:shadow-xl hover:scale-105"
                            >
                                Bắt đầu học ngay
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                            <Link
                                href="/login"
                                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white 
                         border border-white/30 px-6 py-3 rounded-xl font-semibold text-lg
                         hover:bg-white/20 transition-all backdrop-blur-sm"
                            >
                                Tôi đã có tài khoản
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Wave divider */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
                            className="fill-background"
                        />
                    </svg>
                </div>
            </header>

            {/* Features Section */}
            <section className="py-20 container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Tính năng <span className="gradient-text">nổi bật</span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Nền tảng học tập hiện đại với công nghệ AI hỗ trợ
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Feature 1 */}
                    <div className="group relative bg-card rounded-2xl p-8 border border-border card-hover">
                        <div className="absolute inset-0 bg-gradient-to-br from-arduino-teal/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative">
                            <div className="w-14 h-14 bg-arduino-teal/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Sparkles className="h-7 w-7 text-arduino-teal" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">AI Trợ giảng 3 chế độ</h3>
                            <p className="text-muted-foreground">
                                <strong>Tutor</strong> - giải thích chi tiết, <strong>Socratic</strong> - câu hỏi gợi mở,
                                <strong>Grader</strong> - chấm bài và sửa lỗi.
                            </p>
                        </div>
                    </div>

                    {/* Feature 2 */}
                    <div className="group relative bg-card rounded-2xl p-8 border border-border card-hover">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative">
                            <div className="w-14 h-14 bg-primary-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Code2 className="h-7 w-7 text-primary-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Simulator Arduino online</h3>
                            <p className="text-muted-foreground">
                                Chạy code Arduino ngay trên trình duyệt với Wokwi. Không cần kit vật lý vẫn thực hành được.
                            </p>
                        </div>
                    </div>

                    {/* Feature 3 */}
                    <div className="group relative bg-card rounded-2xl p-8 border border-border card-hover">
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative">
                            <div className="w-14 h-14 bg-yellow-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <BookOpen className="h-7 w-7 text-yellow-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Giáo trình 12 tuần</h3>
                            <p className="text-muted-foreground">
                                Bài giảng, lab, quiz đầy đủ. Học vượt thoải mái. Rubric chấm điểm rõ ràng.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Course Overview */}
            <section className="py-20 bg-muted/50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Giáo trình <span className="gradient-text">TECH476</span>
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            Lập trình hệ thống nhúng & IoT (Arduino Uno)
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-4">
                        {[
                            { week: '1-3', title: 'Cơ bản', desc: 'GPIO, Digital I/O, PWM' },
                            { week: '4-6', title: 'Giao tiếp', desc: 'Serial, I2C, SPI' },
                            { week: '7-9', title: 'Cảm biến', desc: 'Analog, Sensors, LCD' },
                            { week: '10-12', title: 'Dự án', desc: 'IoT, WiFi, Final Project' },
                        ].map((item, i) => (
                            <div key={i} className="bg-card rounded-xl p-6 border border-border hover:border-arduino-teal/50 transition-colors">
                                <div className="text-sm text-arduino-teal font-semibold mb-2">Tuần {item.week}</div>
                                <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                                <p className="text-sm text-muted-foreground">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="bg-gradient-to-br from-arduino-teal to-primary-700 rounded-3xl p-12 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Sẵn sàng bắt đầu chưa?
                        </h2>
                        <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                            Tham gia ngay để học lập trình Arduino từ cơ bản đến nâng cao
                        </p>
                        <Link
                            href="/register"
                            className="inline-flex items-center gap-2 bg-white text-arduino-teal 
                       px-8 py-4 rounded-xl font-semibold text-lg
                       hover:bg-yellow-300 transition-all hover:shadow-xl"
                        >
                            Tạo tài khoản miễn phí
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border py-8">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Cpu className="h-6 w-6 text-arduino-teal" />
                            <span className="font-semibold">Arduino Learning Hub</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            © T1/2026 Khoa Kỹ thuật & Công nghệ - ĐH Sư phạm Hà Nội.
                            Phát triển bởi Nguyễn Hoàng Long.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
