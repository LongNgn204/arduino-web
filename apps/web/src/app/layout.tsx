import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'Arduino Learning Hub - HNUE FET',
    description: 'Nền tảng học lập trình Arduino 12 tuần cho sinh viên Khoa Kỹ thuật & Công nghệ, ĐH Sư phạm Hà Nội',
    keywords: ['Arduino', 'IoT', 'Embedded Systems', 'HNUE', 'Lập trình nhúng'],
    authors: [{ name: 'Nguyễn Hoàng Long' }],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="vi" suppressHydrationWarning>
            <body className="min-h-screen bg-background antialiased">
                {children}
            </body>
        </html>
    );
}
