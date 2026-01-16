// Landing Page - Trang chủ với premium UI (Light Theme)
// Hiển thị giới thiệu về Arduino Hub và các tính năng

import { Link } from 'react-router-dom';
import {
    Cpu, BookOpen, Code, Brain, Zap,
    ChevronRight, Play
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
        <div className="min-h-screen bg-arduino-base/30 text-arduino-text-primary font-sans overflow-hidden">
            {/* Hero Section */}
            <section className="relative min-h-[95vh] flex items-center justify-center px-4 overflow-hidden pt-24 md:pt-0">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

                {/* Ambient Blobs */}
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-arduino-mint/40 rounded-full blur-3xl opacity-50 -z-10 animate-pulse-soft" />
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-100/40 rounded-full blur-3xl opacity-50 -z-10 animate-pulse-soft" style={{ animationDelay: '1s' }} />

                <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left Content */}
                    <div className="text-center lg:text-left order-2 lg:order-1">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-teal-100 shadow-sm mb-8 animate-fade-in hover:scale-105 transition-transform cursor-default">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
                            </span>
                            <span className="text-sm font-semibold text-gray-1000">Nền tảng học IoT cho sinh viên</span>
                        </div>

                        {/* Heading */}
                        <h1 className="text-5xl lg:text-7xl font-bold mb-6 animate-slide-up text-gray-900 tracking-tight leading-[1.1]">
                            Chinh Phục <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-500">Arduino</span> <br />
                            Với AI Trợ Giảng
                        </h1>

                        <p className="text-lg lg:text-xl text-gray-600 mb-10 animate-slide-up font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0" style={{ animationDelay: '0.2s' }}>
                            Không còn lo bí code. Học lập trình nhúng qua các dự án thực tế, được AI sửa lỗi và giải thích chi tiết từng dòng code 24/7.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center lg:justify-start justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                            <Link to="/register" className="w-full sm:w-auto">
                                <Button size="lg" className="w-full sm:w-auto rounded-2xl px-8 py-6 text-lg bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 shadow-xl shadow-teal-500/20 hover:shadow-teal-500/30 hover:-translate-y-1 transition-all border-none">
                                    Bắt đầu học miễn phí
                                    <ChevronRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                            <Link to="/login" className="w-full sm:w-auto">
                                <Button variant="secondary" size="lg" className="w-full sm:w-auto rounded-2xl px-8 py-6 text-lg bg-white border-2 border-gray-100 hover:border-teal-200 hover:bg-teal-50/50 text-gray-700">
                                    <Play className="w-5 h-5 mr-2 fill-current" />
                                    Xem Demo Lớp Học
                                </Button>
                            </Link>
                        </div>

                        {/* Tech Stack Icons */}
                        <div className="mt-12 pt-8 border-t border-gray-100 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                            <p className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">Được tin dùng bởi sinh viên</p>
                            <div className="flex items-center justify-center lg:justify-start gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                                <img src="/assets/logo.png" alt="HNUE" className="h-8 object-contain" />
                                {/* Add more partner logos here if available */}
                            </div>
                        </div>
                    </div>

                    {/* Right Visual - 3D Robot & Interactive Elements */}
                    <div className="relative animate-slide-up hidden lg:block order-1 lg:order-2 h-[600px]" style={{ animationDelay: '0.3s' }}>
                        {/* Main Robot Image with Floating Animation */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] z-20 animate-float drop-shadow-2xl">
                            <img
                                src="/assets/robot_mascot.png"
                                alt="AI Tutor Robot"
                                className="w-full h-full object-contain filter drop-shadow-[0_20px_50px_rgba(20,184,166,0.3)] hover:scale-105 transition-transform duration-500"
                            />
                            {/* Sparkling Eyes Effect (Simulated via overlay if needed, but image has glow) */}
                            <div className="absolute top-[30%] left-[35%] w-3 h-3 bg-white rounded-full blur-[2px] animate-ping" style={{ animationDuration: '3s' }}></div>
                            <div className="absolute top-[30%] right-[35%] w-3 h-3 bg-white rounded-full blur-[2px] animate-ping" style={{ animationDuration: '3s', animationDelay: '0.5s' }}></div>
                        </div>

                        {/* Floating Cards - Background Elements */}
                        <div className="absolute top-20 right-10 bg-white/90 backdrop-blur p-4 rounded-2xl shadow-xl border border-white/50 animate-float" style={{ animationDelay: '1s', animationDuration: '7s' }}>
                            <Code className="w-6 h-6 text-purple-500 mb-2" />
                            <div className="space-y-2 w-32">
                                <div className="h-2 bg-purple-100 rounded-full w-3/4"></div>
                                <div className="h-2 bg-purple-100 rounded-full w-full"></div>
                            </div>
                        </div>

                        <div className="absolute bottom-32 left-0 bg-white/90 backdrop-blur p-4 rounded-2xl shadow-xl border border-white/50 animate-float z-30" style={{ animationDelay: '2s', animationDuration: '6s' }}>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                <span className="text-xs font-bold text-gray-700">System Online</span>
                            </div>
                            <div className="text-xs text-gray-500">AI Tutor is active...</div>
                        </div>

                        {/* Orbiting Elements */}
                        <div className="absolute inset-0 border border-dashed border-teal-200/50 rounded-full w-[600px] h-[600px] animate-spin-slow opacity-30 -z-10" />
                    </div>
                </div>
            </section>

            {/* Curriculum Preview Section */}
            <section className="py-24 px-4 bg-white relative">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900">Lộ Trình Học Tinh Gọn</h2>
                        <p className="text-gray-500 text-lg max-w-2xl mx-auto">Đi từ con số 0 đến tự tay làm thiết bị IoT trong 12 tuần</p>
                    </div>

                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute hidden lg:block left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-500/20 via-teal-500/50 to-teal-500/20 rounded-full" />

                        <div className="space-y-12 lg:space-y-24">
                            {/* Phase 1 */}
                            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 relative">
                                <div className="flex-1 text-center lg:text-right">
                                    <h3 className="text-2xl font-bold text-teal-600 mb-2">Phase 1: Foundation</h3>
                                    <p className="text-gray-600 mb-4">Làm chủ Arduino Uno, GPIO, LED và các linh kiện cơ bản.</p>
                                    <div className="inline-flex gap-2 flex-wrap justify-center lg:justify-end">
                                        {['Tuần 1-4', 'LED', 'Keypad', 'LCD'].map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-medium border border-teal-100">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-teal-500 border-4 border-white shadow-xl flex items-center justify-center relative z-10 shrink-0">
                                    <span className="text-white font-bold">1</span>
                                </div>
                                <div className="flex-1">
                                    <div className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all h-48 bg-gray-100">
                                        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-transparent z-10" />
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 group-hover:scale-105 transition-transform">
                                            {/* Placeholder for project image */}
                                            <Cpu className="w-16 h-16 opacity-50" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Phase 2 */}
                            <div className="flex flex-col lg:flex-row-reverse items-center gap-8 lg:gap-16 relative">
                                <div className="flex-1 text-center lg:text-left">
                                    <h3 className="text-2xl font-bold text-purple-600 mb-2">Phase 2: Sensors & Display</h3>
                                    <p className="text-gray-600 mb-4">Đọc cảm biến, hiển thị thông tin và xử lý tín hiệu Analog.</p>
                                    <div className="inline-flex gap-2 flex-wrap justify-center lg:justify-start">
                                        {['Tuần 5-8', 'Temp Sensor', 'OLED', 'Motor'].map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium border border-purple-100">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-purple-500 border-4 border-white shadow-xl flex items-center justify-center relative z-10 shrink-0">
                                    <span className="text-white font-bold">2</span>
                                </div>
                                <div className="flex-1">
                                    <div className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all h-48 bg-gray-100">
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent z-10" />
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 group-hover:scale-105 transition-transform">
                                            <Zap className="w-16 h-16 opacity-50" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Phase 3 */}
                            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 relative">
                                <div className="flex-1 text-center lg:text-right">
                                    <h3 className="text-2xl font-bold text-amber-500 mb-2">Phase 3: Final Project</h3>
                                    <p className="text-gray-600 mb-4">Kết hợp tất cả kiến thức để xây dựng hệ thống IoT hoàn chỉnh.</p>
                                    <div className="inline-flex gap-2 flex-wrap justify-center lg:justify-end">
                                        {['Tuần 9-12', 'IoT', 'WiFi', 'Smart Home'].map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium border border-amber-100">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-amber-500 border-4 border-white shadow-xl flex items-center justify-center relative z-10 shrink-0">
                                    <span className="text-white font-bold">3</span>
                                </div>
                                <div className="flex-1">
                                    <div className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all h-48 bg-gray-100">
                                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent z-10" />
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 group-hover:scale-105 transition-transform">
                                            <Brain className="w-16 h-16 opacity-50" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-24 px-4 bg-arduino-base/50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900">Sinh Viên Nói Gì?</h2>
                        <p className="text-gray-500 text-lg">Cộng đồng hàng nghìn sinh viên đang học tập hiệu quả</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                name: "Nguyễn Văn A",
                                role: "Sinh viên K72 - CNTT",
                                content: "Nhờ AI Tutor mà mình hiểu rõ bản chất của ngắt (interrupt) thay vì chỉ copy code. Rất đáng học!",
                                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                            },
                            {
                                name: "Trần Thị B",
                                role: "Sinh viên K73 - Sư phạm Lý",
                                content: "Giao diện đẹp, bài giảng chi tiết. Phần thực hành trên Wokwi giúp mình test mạch ngay trên web.",
                                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka"
                            },
                            {
                                name: "Lê Văn C",
                                role: "Sinh viên K71 - Điện tử",
                                content: "Tính năng chấm điểm code giúp mình tối ưu thuật toán rất nhiều. 10 điểm cho team phát triển!",
                                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Milo"
                            }
                        ].map((testimonial, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
                                <div className="flex items-center gap-4 mb-6">
                                    <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full bg-gray-100" />
                                    <div>
                                        <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                                        <p className="text-xs text-gray-500">{testimonial.role}</p>
                                    </div>
                                </div>
                                <div className="flex gap-1 mb-4">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <span key={star} className="text-amber-400 text-sm">★</span>
                                    ))}
                                </div>
                                <p className="text-gray-600 italic">"{testimonial.content}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section (Simplified) */}
            <section className="relative py-24 px-4 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-teal-600">
                                    <feature.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
                                <p className="text-gray-500 leading-relaxed text-sm">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* AI Highlight Section - Keeping existing logic but restyled */}
            <section className="relative py-24 px-4 bg-white overflow-hidden border-t border-gray-100">
                {/* ... (Keep AI Section content or simplify if desired. Using existing logic for now but updating styles handled by general replace if overlaps, otherwise relying on structure) */}
                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="order-2 md:order-1">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 leading-tight">
                                Học nhanh hơn gấp 2 lần với <br /><span className="text-teal-500">AI Personal Tutor</span>
                            </h2>
                            <p className="text-gray-500 mb-8 text-lg leading-relaxed">
                                Thử bôi đen bất kỳ đoạn văn nào trên web và chọn "Hỏi AI" để được giải thích ngay lập tức!
                            </p>
                            {/* ... */}
                        </div>
                        {/* ... */}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-24 px-4">
                <div className="max-w-5xl mx-auto text-center">
                    <div className="relative p-12 md:p-24 rounded-[3rem] bg-gray-900 overflow-hidden shadow-2xl">
                        <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

                        {/* Glowing Orbs */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500 rounded-full blur-[100px] opacity-30" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-[100px] opacity-30" />

                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white tracking-tight">
                                Sẵn sàng trở thành Master IoT?
                            </h2>
                            <p className="text-gray-300 mb-10 max-w-2xl mx-auto text-lg">
                                Tham gia cộng đồng học tập thông minh ngay hôm nay.
                            </p>
                            <Link to="/register">
                                <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 border-none shadow-xl text-lg px-10 py-5 h-auto rounded-2xl font-bold hover:scale-105 transition-transform">
                                    Đăng Ký Tài Khoản Mới
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-100 py-12 px-4 bg-white text-gray-500">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <img src="/assets/logo.png" alt="Logo" className="h-8 opacity-80" />
                        <span className="font-bold text-gray-800 text-lg">ArduinoHub</span>
                    </div>
                    <div className="flex gap-6 text-sm font-medium">
                        <Link to="#" className="hover:text-teal-600">Về chúng tôi</Link>
                        <Link to="#" className="hover:text-teal-600">Điều khoản</Link>
                        <Link to="#" className="hover:text-teal-600">Liên hệ</Link>
                    </div>
                    <div className="text-center md:text-right text-sm">
                        <p className="font-medium text-gray-400">© 2026 Developed by Nguyen Hoang Long</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
