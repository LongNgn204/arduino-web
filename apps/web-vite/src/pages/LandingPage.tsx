// Landing Page - Minimalist Text Only (White Theme)
// Hiển thị giới thiệu về Arduino Hub và các tính năng

import { Link } from 'react-router-dom';

export default function LandingPage() {
    const features = [
        {
            title: '12 Tuần Học Tập',
            description: 'Giáo trình đầy đủ từ cơ bản đến nâng cao'
        },
        {
            title: 'AI Trợ Giảng',
            description: '3 chế độ: Tutor, Socratic, Grader'
        },
        {
            title: 'Simulator Online',
            description: 'Chạy code Arduino ngay trên web với Wokwi'
        },
        {
            title: 'Quiz & Labs',
            description: 'Bài tập thực hành và kiểm tra kiến thức'
        }
    ];

    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            {/* Header */}
            <header className="border-b border-border py-4">
                <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="font-bold text-xl tracking-tight text-foreground">
                        KNTT STEM
                    </Link>
                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                            Đăng nhập
                        </Link>
                        <Link to="/register" className="text-sm font-medium bg-foreground text-background px-4 py-2 rounded-md hover:opacity-90">
                            Đăng ký
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="py-24 px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="inline-block border border-border px-3 py-1 rounded-full text-xs font-medium text-muted-foreground mb-6">
                        Hành Trang Sư Phạm Số
                    </div>

                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-foreground">
                        KNTT STEM <br />
                        Ươm Mầm Giáo Viên Tương Lai
                    </h1>

                    <p className="text-lg text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
                        Nền tảng bồi dưỡng năng lực dạy học STEM/IoT dành riêng cho sinh viên sư phạm.
                        Trang bị kiến thức công nghệ vững chắc để tự tin truyền cảm hứng.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/register" className="w-full sm:w-auto">
                            <button className="w-full sm:w-auto px-8 py-3 bg-foreground text-background rounded-md font-bold hover:bg-foreground/90 transition-colors">
                                Bắt đầu học miễn phí
                            </button>
                        </Link>
                        <Link to="/login" className="w-full sm:w-auto">
                            <button className="w-full sm:w-auto px-8 py-3 border border-border bg-background text-foreground rounded-md font-bold hover:bg-muted transition-colors">
                                Xem Demo Lớp Học
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 px-4 border-t border-border">
                <div className="max-w-5xl mx-auto">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="p-6 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                                <h3 className="text-lg font-bold mb-2 text-foreground">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Curriculum Preview Section */}
            <section className="py-24 px-4 border-t border-border">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4 text-foreground">Lộ Trình Phát Triển</h2>
                        <p className="text-muted-foreground">Từng bước làm chủ công nghệ</p>
                    </div>

                    <div className="space-y-12">
                        {/* Phase 1 */}
                        <div className="border border-border p-8 rounded-lg">
                            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Giai đoạn 1</div>
                            <h3 className="text-2xl font-bold mb-3">Nền tảng Tư duy</h3>
                            <p className="text-muted-foreground text-sm mb-4">Hiểu rõ bản chất Lập trình & Điện tử để giải thích cặn kẽ cho học sinh.</p>
                            <div className="flex gap-2 flex-wrap">
                                {['Tư duy máy tính', 'Cấu trúc mạch', 'GPIO', 'Flowchart'].map(tag => (
                                    <span key={tag} className="px-2 py-1 bg-muted rounded text-xs text-muted-foreground border border-border">{tag}</span>
                                ))}
                            </div>
                        </div>

                        {/* Phase 2 */}
                        <div className="border border-border p-8 rounded-lg">
                            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Giai đoạn 2</div>
                            <h3 className="text-2xl font-bold mb-3">Ứng dụng Sư phạm</h3>
                            <p className="text-muted-foreground text-sm mb-4">Kết nối cảm biến và thiết bị hiển thị - Nguyên liệu cho các thí nghiệm trực quan.</p>
                            <div className="flex gap-2 flex-wrap">
                                {['Thí nghiệm số', 'Đo đạc môi trường', 'Hiển thị OLED', 'Sơ đồ khối'].map(tag => (
                                    <span key={tag} className="px-2 py-1 bg-muted rounded text-xs text-muted-foreground border border-border">{tag}</span>
                                ))}
                            </div>
                        </div>

                        {/* Phase 3 */}
                        <div className="border border-border p-8 rounded-lg">
                            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Giai đoạn 3</div>
                            <h3 className="text-2xl font-bold mb-3">Thiết kế Bài giảng STEM</h3>
                            <p className="text-muted-foreground text-sm mb-4">Xây dựng mô hình dạy học dự án: Nhà thông minh, Vườn IoT... theo định hướng GDPT 2018.</p>
                            <div className="flex gap-2 flex-wrap">
                                {['Dạy học Dự án', 'IoT', 'Web Server', 'Smart Home'].map(tag => (
                                    <span key={tag} className="px-2 py-1 bg-muted rounded text-xs text-muted-foreground border border-border">{tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-4 border-t border-border bg-foreground text-background">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-6">
                        Sẵn sàng đổi mới phương pháp dạy học?
                    </h2>
                    <p className="text-background/80 mb-10 max-w-xl mx-auto">
                        Tham gia cộng đồng giáo viên STEM tương lai ngay hôm nay.
                    </p>
                    <Link to="/register">
                        <button className="px-8 py-3 bg-background text-foreground rounded-md font-bold hover:bg-background/90 transition-colors">
                            Đăng Ký Tài Khoản Mới
                        </button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-4 border-t border-border">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="font-bold text-lg">KNTT STEM</div>
                    <div className="flex gap-6 text-sm font-medium text-muted-foreground">
                        <Link to="#" className="hover:text-foreground">Về chúng tôi</Link>
                        <Link to="#" className="hover:text-foreground">Điều khoản</Link>
                        <Link to="#" className="hover:text-foreground">Liên hệ</Link>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        © 2026 Developed by Nguyen Hoang Long
                    </div>
                </div>
            </footer>
        </div>
    );
}
