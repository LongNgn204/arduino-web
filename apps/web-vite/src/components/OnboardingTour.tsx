import { useEffect, useState } from 'react';
import ReactJoyride, { STATUS, type Step, type CallBackProps } from 'react-joyride';
import { useLocation } from 'react-router-dom';

export default function OnboardingTour() {
    const [run, setRun] = useState(false);
    const location = useLocation();

    useEffect(() => {
        // Chỉ hiện tour ở trang Dashboard
        if (location.pathname !== '/') return;

        // Check localStorage
        const hasSeenTour = localStorage.getItem('has_seen_onboarding_v1');
        if (!hasSeenTour) {
            // Delay 1 chút để UI load xong
            const timer = setTimeout(() => setRun(true), 1000);
            return () => clearTimeout(timer);
        }
    }, [location]);

    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status } = data;
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

        if (finishedStatuses.includes(status)) {
            setRun(false);
            localStorage.setItem('has_seen_onboarding_v1', 'true');
        }
    };

    const steps: Step[] = [
        {
            target: 'body',
            content: (
                <div className="text-center">
                    <div className="text-3xl mb-2">👋</div>
                    <h3 className="font-bold text-lg text-arduino-teal mb-2">Chào mừng bạn mới!</h3>
                    <p>Hãy để mình giới thiệu sơ qua về nền tảng học tập này nhé.</p>
                </div>
            ),
            placement: 'center',
            disableBeacon: true,
        },
        {
            target: '#dashboard-welcome',
            content: 'Đây là bảng tin cá nhân. Bạn có thể xem tiến độ học tập và thông báo mới nhất tại đây.',
            title: 'Tổng quan',
        },
        {
            target: '#dashboard-challenges',
            content: 'Theo dõi các chỉ số quan trọng: Số bài đã học, Labs đã làm và Điểm trung bình Quiz.',
            title: 'Thống kê',
        },
        {
            target: '#dashboard-courses',
            content: 'Danh sách khóa học của bạn. Bấm "Tiếp tục" để vào học ngay!',
            title: 'Khóa học',
        },
        {
            target: '#sidebar-library',
            content: 'Thư viện tài liệu KNTT khổng lồ với Wiki, Code mẫu và Video.',
            title: 'Thư viện',
        },
        {
            target: '#ai-chat-toggle',
            content: (
                <div>
                    <h3 className="font-bold text-indigo-600 mb-1">AI Trợ giảng 🧠</h3>
                    <p>Gặp khó khăn? Bấm nút này để hỏi AI về code, lỗi hay kiến thức Arduino bất cứ lúc nào.</p>
                </div>
            ),
            title: 'Trợ giúp AI',
        }
    ];

    return (
        <ReactJoyride
            steps={steps}
            run={run}
            continuous
            showSkipButton
            showProgress
            callback={handleJoyrideCallback}
            styles={{
                options: {
                    primaryColor: '#00979C', // Arduino Teal
                    textColor: '#333',
                    zIndex: 10000,
                },
                tooltip: {
                    borderRadius: '12px',
                    fontFamily: 'inherit',
                },
                buttonNext: {
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontWeight: 600,
                },
                buttonBack: {
                    marginRight: 10,
                }
            }}
            locale={{
                back: 'Quay lại',
                close: 'Đóng',
                last: 'Xong rồi',
                next: 'Tiếp theo',
                skip: 'Bỏ qua',
            }}
        />
    );
}
