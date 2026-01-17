import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const HERO_IMAGES = [
    {
        src: '/assets/auth/hero-1.png',
        label: 'Tương lai của Giáo dục',
        desc: 'Trải nghiệm học tập được cá nhân hóa với AI Assistant.'
    },
    {
        src: '/assets/auth/hero-2.png',
        label: 'Thực hành IoT',
        desc: 'Tiếp cận phần cứng Arduino qua các bài Labs mô phỏng chân thực.'
    },
    {
        src: '/assets/auth/hero-3.png',
        label: 'Công nghệ Lõi',
        desc: 'Nắm vững kiến thức nền tảng về Lập trình nhúng và Vi điều khiển.'
    },
    {
        src: '/assets/auth/hero-4.png',
        label: 'Người bạn đồng hành',
        desc: 'Luôn bên cạnh hỗ trợ giải đáp mọi thắc mắc của bạn 24/7.'
    }
];

export function AuthLayout({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle: string }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-12 relative overflow-hidden">
                {/* Background Decor - Subtle */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-arduino-teal/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

                <div className="w-full max-w-md relative z-10">
                    <div className="text-center mb-10">
                        <Link to="/" className="inline-flex items-center gap-2 group mb-6">
                            <div className="relative">
                                <div className="w-12 h-12 bg-gradient-to-tr from-arduino-teal to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-arduino-teal/20 group-hover:scale-110 transition-transform">
                                    <Cpu className="h-6 w-6 text-white" />
                                </div>
                                <Sparkles className="absolute -top-2 -right-2 h-5 w-5 text-yellow-400 animate-pulse" />
                            </div>
                            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 tracking-tight">
                                KNTT STEM
                            </span>
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
                        <p className="text-gray-500">{subtitle}</p>
                    </div>

                    {children}

                    <div className="mt-8 text-center">
                        <p className="text-xs text-gray-400">
                            © T1/2026 HNUE - Khoa Kỹ thuật & Công nghệ
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Carousel */}
            <div className="hidden lg:flex w-1/2 bg-gray-900 relative overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.7 }}
                        className="absolute inset-0"
                    >
                        <div className="absolute inset-0 bg-black/40 z-10" /> {/* Overlay */}
                        <img
                            src={HERO_IMAGES[currentIndex].src}
                            alt={HERO_IMAGES[currentIndex].label}
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-12 z-20 text-white bg-gradient-to-t from-black/80 via-black/50 to-transparent pt-32">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <h2 className="text-3xl font-bold mb-3 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">{HERO_IMAGES[currentIndex].label}</h2>
                            <p className="text-base text-white max-w-md leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
                                {HERO_IMAGES[currentIndex].desc}
                            </p>
                        </motion.div>
                    </AnimatePresence>

                    {/* Indicators */}
                    <div className="flex gap-2 mt-8">
                        {HERO_IMAGES.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/30 hover:bg-white/50'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
