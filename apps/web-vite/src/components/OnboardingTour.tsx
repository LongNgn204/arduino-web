import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { cn } from './ui/Card';
import { Button } from './ui/Button';

interface TourStep {
    targetId: string;
    title: string;
    content: string;
    position: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

const TOUR_STEPS: TourStep[] = [
    {
        targetId: 'dashboard-welcome',
        title: 'Chào mừng bạn! 👋',
        content: 'Đây là không gian học tập cá nhân của bạn. Tại đây bạn có thể theo dõi tiến độ, xem bài học và tham gia thử thách.',
        position: 'bottom'
    },
    {
        targetId: 'dashboard-courses',
        title: 'Khóa học của bạn 📚',
        content: 'Truy cập chương trình học Arduino/ESP32 từ cơ bản đến nâng cao. Nhấn "Tiếp tục học" để vào bài ngay.',
        position: 'top'
    },
    {
        targetId: 'dashboard-stats',
        title: 'Thống kê & Thành tích 🏆',
        content: 'Theo dõi điểm XP, số bài Lab đã hoàn thành và vị trí của bạn trên bảng xếp hạng.',
        position: 'bottom'
    },
    {
        targetId: 'dashboard-challenges',
        title: 'Thử thách hàng tuần ⚡',
        content: 'Đừng quên kiểm tra các nhiệm vụ mới mỗi tuần để nhận huy hiệu và điểm thưởng đặc biệt!',
        position: 'left'
    },
    // Adding a virtual step for AI (doesn't point to id, just center)
    {
        targetId: 'center-screen',
        title: 'Trợ lý AI Thông minh 🤖',
        content: 'Bôi đen bất kỳ đoạn văn bản nào trong bài học để nhờ AI giải thích, hoặc chat trực tiếp để hỏi về code & lỗi.',
        position: 'center'
    }
];

export default function OnboardingTour() {
    const [isVisible, setIsVisible] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [stepData, setStepData] = useState<TourStep | null>(null);
    const [coords, setCoords] = useState<{ x: number, y: number, w: number, h: number } | null>(null);

    useEffect(() => {
        // Check if tour has been seen
        const hasSeen = localStorage.getItem('arduino_tour_completed');
        if (!hasSeen) {
            // Delay slightly to confirm UI loaded
            setTimeout(() => {
                setIsVisible(true);
            }, 1000);
        }
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        const step = TOUR_STEPS[currentStep];
        setStepData(step);

        if (step.position === 'center') {
            setCoords({ x: window.innerWidth / 2, y: window.innerHeight / 2, w: 0, h: 0 });
            return;
        }

        const el = document.getElementById(step.targetId);
        if (el) {
            const rect = el.getBoundingClientRect();
            // Add scroll if needed (basic)
            if (rect.top < 0 || rect.bottom > window.innerHeight) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            setCoords({
                x: rect.left,
                y: rect.top,
                w: rect.width,
                h: rect.height
            });
        }
    }, [currentStep, isVisible]);

    const handleNext = () => {
        if (currentStep < TOUR_STEPS.length - 1) {
            setCurrentStep(c => c + 1);
        } else {
            handleComplete();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(c => c - 1);
        }
    };

    const handleComplete = () => {
        setIsVisible(false);
        localStorage.setItem('arduino_tour_completed', 'true');
    };

    if (!isVisible || !stepData || !coords) return null;

    // Overlay mask is tricky with pure CSS z-indexes. 
    // We'll use a mixed verification: 
    // 1. Dark background
    // 2. High z-index tooltip
    // 3. Highlight box on top of element

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed inset-0 z-[99999] pointer-events-none">
                    {/* Dark Overlay with Hole - Using borders trick or just opaque div with cutout? 
                        Simpler: Just dark overlay with transparency
                    */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 pointer-events-auto"
                        onClick={handleComplete} // Click outside to skip? Maybe too aggressive.
                    />

                    {/* Highlight Box */}
                    {stepData.position !== 'center' && (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                top: coords.y - 8,
                                left: coords.x - 8,
                                width: coords.w + 16,
                                height: coords.h + 16
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="absolute border-2 border-white/50 bg-white/5 rounded-xl shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] pointer-events-none"
                            style={{ boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)' }} // Use box-shadow for "cutout" effect
                        />
                    )}

                    {/* Tooltip Content */}
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: 0.2 }}
                        className={cn(
                            "absolute pointer-events-auto w-80 md:w-96 bg-white p-6 rounded-2xl shadow-2xl border border-gray-100 flex flex-col gap-4",
                            stepData.position === 'center' && "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
                            // Dynamic positioning based on target
                            stepData.position === 'bottom' && "mt-4",
                            stepData.position === 'top' && "mb-4 -translate-y-full",
                            // Fallback static overrides if needed
                        )}
                        style={{
                            // Basic positioning calculation logic
                            top: stepData.position === 'center' ? '50%' :
                                stepData.position === 'bottom' ? coords.y + coords.h + 16 :
                                    stepData.position === 'top' ? coords.y - 16 :
                                        stepData.position === 'left' ? coords.y : coords.y,
                            left: stepData.position === 'center' ? '50%' :
                                stepData.position === 'left' ? coords.x - 340 :
                                    stepData.position === 'right' ? coords.x + coords.w + 16 :
                                        Math.max(16, Math.min(window.innerWidth - 350, coords.x)) // Clamp to screen
                        }}
                    >
                        <button
                            onClick={handleComplete}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-arduino-teal font-bold uppercase tracking-wider text-xs">
                                <Sparkles className="w-4 h-4" />
                                Hướng dẫn ({currentStep + 1}/{TOUR_STEPS.length})
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">
                                {stepData.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed text-sm">
                                {stepData.content}
                            </p>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleComplete}
                                className="text-gray-400 hover:text-gray-600 font-normal"
                            >
                                Bỏ qua
                            </Button>

                            <div className="flex gap-2">
                                {currentStep > 0 && (
                                    <Button variant="secondary" size="sm" onClick={handlePrev}>
                                        <ChevronLeft className="w-4 h-4 mr-1" /> Trước
                                    </Button>
                                )}
                                <Button
                                    size="sm"
                                    onClick={handleNext}
                                    className="bg-arduino-teal hover:bg-teal-600 text-white"
                                >
                                    {currentStep >= TOUR_STEPS.length - 1 ? (
                                        <>Hoàn tất <CheckCircle2 className="w-4 h-4 ml-1" /></>
                                    ) : (
                                        <>Tiếp theo <ChevronRight className="w-4 h-4 ml-1" /></>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
