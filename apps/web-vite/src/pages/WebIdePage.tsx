import { useState } from 'react';
import {
    Cpu,
    Play,
    ExternalLink,
    Code2,
    Zap,
    ChevronDown,
    Loader2
} from 'lucide-react';
import { Button } from '../components/ui/Button';

// Danh sách các project Wokwi mẫu cho từng tuần học
const WOKWI_PROJECTS = [
    { id: 'blink', name: 'Blink LED (Tuần 1)', url: 'https://wokwi.com/projects/new/arduino-uno', description: 'LED nháy cơ bản' },
    { id: 'traffic', name: 'Traffic Light (Tuần 1)', url: 'https://wokwi.com/projects/new/arduino-uno', description: 'Đèn giao thông 3 màu' },
    { id: '7segment', name: '7-Segment Display (Tuần 2)', url: 'https://wokwi.com/projects/new/arduino-uno', description: 'Hiển thị số trên LED 7 đoạn' },
    { id: 'button', name: 'Button Counter (Tuần 3)', url: 'https://wokwi.com/projects/new/arduino-uno', description: 'Đếm số lần nhấn nút' },
    { id: 'potentiometer', name: 'Potentiometer LED (Tuần 4)', url: 'https://wokwi.com/projects/new/arduino-uno', description: 'Điều chỉnh độ sáng LED bằng biến trở' },
    { id: 'ultrasonic', name: 'Ultrasonic Sensor (Tuần 5)', url: 'https://wokwi.com/projects/new/arduino-uno', description: 'Đo khoảng cách với HC-SR04' },
    { id: 'servo', name: 'Servo Motor (Tuần 6)', url: 'https://wokwi.com/projects/new/arduino-uno', description: 'Điều khiển động cơ Servo' },
    { id: 'lcd', name: 'LCD Display (Tuần 7-8)', url: 'https://wokwi.com/projects/new/arduino-uno', description: 'Hiển thị chữ trên màn hình LCD' },
];

export default function WebIdePage() {
    const [selectedProject, setSelectedProject] = useState(WOKWI_PROJECTS[0]);
    const [isLoading, setIsLoading] = useState(true);
    const [showProjects, setShowProjects] = useState(false);

    const handleProjectChange = (project: typeof WOKWI_PROJECTS[0]) => {
        setSelectedProject(project);
        setIsLoading(true);
        setShowProjects(false);
    };

    return (
        <div className="h-screen bg-gray-900 flex flex-col overflow-hidden font-sans">
            {/* Header */}
            <header className="shrink-0 h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4 md:px-6 shadow-lg z-20">
                <div className="flex items-center gap-4">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
                            <Cpu className="w-5 h-5 text-white" />
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="font-bold text-white text-lg leading-tight">Wokwi IDE</h1>
                            <p className="text-xs text-gray-400">Arduino Simulator</p>
                        </div>
                    </div>

                    <div className="h-8 w-px bg-gray-700 hidden md:block" />

                    {/* Project Selector */}
                    <div className="relative">
                        <button
                            onClick={() => setShowProjects(!showProjects)}
                            className="flex items-center gap-2 bg-gray-700/50 hover:bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white transition-colors"
                        >
                            <Code2 className="w-4 h-4 text-teal-400" />
                            <span className="hidden md:inline max-w-[200px] truncate">{selectedProject.name}</span>
                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showProjects ? 'rotate-180' : ''}`} />
                        </button>

                        {showProjects && (
                            <div className="absolute top-full left-0 mt-2 w-72 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50">
                                <div className="p-2 border-b border-gray-700">
                                    <p className="text-xs text-gray-400 px-2">Chọn bài thực hành</p>
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {WOKWI_PROJECTS.map((project) => (
                                        <button
                                            key={project.id}
                                            onClick={() => handleProjectChange(project)}
                                            className={`w-full text-left px-4 py-3 hover:bg-gray-700/50 transition-colors ${selectedProject.id === project.id ? 'bg-teal-500/10 border-l-2 border-l-teal-500' : ''
                                                }`}
                                        >
                                            <p className="text-sm font-medium text-white">{project.name}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">{project.description}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Status Indicator */}
                    <div className="hidden md:flex items-center gap-2 bg-gray-700/50 rounded-lg px-3 py-1.5 border border-gray-600">
                        <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
                        <span className="text-xs text-gray-300">{isLoading ? 'Loading...' : 'Ready'}</span>
                    </div>

                    {/* Run Button (Visual only - Wokwi handles this) */}
                    <Button
                        className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 shadow-lg shadow-teal-500/20 gap-2"
                    >
                        <Play className="w-4 h-4" />
                        <span className="hidden sm:inline">Run</span>
                    </Button>

                    {/* Open in Wokwi */}
                    <a
                        href={selectedProject.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm transition-colors border border-gray-600"
                    >
                        <ExternalLink className="w-4 h-4" />
                        <span className="hidden md:inline">Mở Wokwi</span>
                    </a>
                </div>
            </header>

            {/* Main Content - Wokwi Iframe */}
            <main className="flex-1 relative bg-gray-900">
                {/* Loading Overlay */}
                {isLoading && (
                    <div className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center z-10">
                        <Loader2 className="w-12 h-12 text-teal-500 animate-spin mb-4" />
                        <p className="text-gray-400 text-sm">Đang tải Wokwi Simulator...</p>
                        <p className="text-gray-500 text-xs mt-1">Có thể mất vài giây</p>
                    </div>
                )}

                {/* Wokwi Embed */}
                <iframe
                    src={selectedProject.url}
                    title="Wokwi Arduino Simulator"
                    className="w-full h-full border-0"
                    allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
                    sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
                    onLoad={() => setIsLoading(false)}
                />

                {/* Tips Overlay - Bottom */}
                <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-gray-800/95 backdrop-blur-sm rounded-xl border border-gray-700 p-4 shadow-2xl z-10">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-teal-500/20 rounded-lg flex items-center justify-center shrink-0">
                            <Zap className="w-4 h-4 text-teal-400" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white mb-1">Mẹo sử dụng</h3>
                            <ul className="text-xs text-gray-400 space-y-1">
                                <li>• Nhấn <kbd className="bg-gray-700 px-1 rounded">▶</kbd> để chạy simulation</li>
                                <li>• Click vào linh kiện để tương tác</li>
                                <li>• Sửa code bên trái, kết quả bên phải</li>
                                <li>• Nhấn "Mở Wokwi" để xem toàn màn hình</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
