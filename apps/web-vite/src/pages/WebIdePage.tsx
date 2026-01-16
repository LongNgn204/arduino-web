import { useState } from 'react';
import {
    Cpu,
    Play,
    ExternalLink,
    Code2,
    Zap,
    ChevronDown,
    Loader2,
    Layout
} from 'lucide-react';
import { Button } from '../components/ui/Button';

// Danh sách các project Wokwi mẫu cho từng tuần học
const WOKWI_PROJECTS = [
    { id: 'intro', name: 'Lab 0: Basic LED (Tuần 0)', url: 'https://wokwi.com/projects/new/arduino-uno', description: 'Mạch LED cơ bản' },
    { id: 'blink', name: 'Lab 1: Blink (Tuần 1)', url: 'https://wokwi.com/projects/new/arduino-uno', description: 'LED nháy cơ bản' },
    { id: 'traffic', name: 'Lab 1b: Traffic Light', url: 'https://wokwi.com/projects/new/arduino-uno', description: 'Đèn giao thông 3 màu' },
    { id: '7segment', name: 'Lab 2: 7-Segment (Tuần 2)', url: 'https://wokwi.com/projects/new/arduino-uno', description: 'Hiển thị số trên LED 7 đoạn' },
    { id: 'button', name: 'Lab 3: Button (Tuần 3)', url: 'https://wokwi.com/projects/new/arduino-uno', description: 'Đếm số lần nhấn nút' },
    { id: 'potentiometer', name: 'Lab 4: Analog (Tuần 4)', url: 'https://wokwi.com/projects/new/arduino-uno', description: 'Điều chỉnh độ sáng LED' },
    { id: 'ultrasonic', name: 'Lab 5: Sensors (Tuần 6)', url: 'https://wokwi.com/projects/new/arduino-uno', description: 'Đo khoảng cách HC-SR04' },
    { id: 'lcd', name: 'Lab 7: LCD Display (Tuần 8)', url: 'https://wokwi.com/projects/new/arduino-uno', description: 'Hiển thị chữ trên màn hình LCD' },
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
        <div className="h-screen bg-arduino-base flex flex-col overflow-hidden font-sans">
            {/* Header */}
            <header className="shrink-0 h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-6 shadow-sm z-20">
                <div className="flex items-center gap-4">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-arduino-teal to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
                            <Cpu className="w-5 h-5 text-white" />
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="font-bold text-gray-800 text-lg leading-tight">Web IDE</h1>
                            <p className="text-xs text-gray-400">Powered by Wokwi</p>
                        </div>
                    </div>

                    <div className="h-8 w-px bg-gray-100 hidden md:block" />

                    {/* Project Selector */}
                    <div className="relative">
                        <button
                            onClick={() => setShowProjects(!showProjects)}
                            className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors"
                        >
                            <Code2 className="w-4 h-4 text-arduino-teal" />
                            <span className="hidden md:inline max-w-[200px] truncate font-medium">{selectedProject.name}</span>
                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showProjects ? 'rotate-180' : ''}`} />
                        </button>

                        {showProjects && (
                            <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden z-50 animate-fade-in">
                                <div className="p-3 bg-gray-50 border-b border-gray-100">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Chọn bài thực hành</p>
                                </div>
                                <div className="max-h-80 overflow-y-auto py-2">
                                    {WOKWI_PROJECTS.map((project) => (
                                        <button
                                            key={project.id}
                                            onClick={() => handleProjectChange(project)}
                                            className={`w-full text-left px-4 py-3 hover:bg-arduino-mint/30 transition-colors border-l-2 ${selectedProject.id === project.id ? 'bg-arduino-mint/50 border-arduino-teal' : 'border-transparent'
                                                }`}
                                        >
                                            <p className={`text-sm font-medium ${selectedProject.id === project.id ? 'text-arduino-teal' : 'text-gray-700'}`}>{project.name}</p>
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
                    <div className="hidden md:flex items-center gap-2 bg-gray-50 rounded-full px-3 py-1.5 border border-gray-100">
                        <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-amber-400 animate-pulse' : 'bg-green-500'}`} />
                        <span className="text-xs font-medium text-gray-500">{isLoading ? 'Loading...' : 'Ready'}</span>
                    </div>

                    {/* Run Button (Visual only - Wokwi handles this) */}
                    <Button
                        className="bg-arduino-teal hover:bg-teal-600 shadow-lg shadow-arduino-teal/20 gap-2"
                    >
                        <Play className="w-4 h-4" />
                        <span className="hidden sm:inline">Chạy Code</span>
                    </Button>

                    {/* Open in Wokwi */}
                    <a
                        href={selectedProject.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-600 px-3 py-2 rounded-lg text-sm transition-colors border border-gray-200 shadow-sm"
                    >
                        <ExternalLink className="w-4 h-4" />
                        <span className="hidden md:inline">Mở Wokwi</span>
                    </a>
                </div>
            </header>

            {/* Main Content - Wokwi Iframe */}
            <main className="flex-1 relative bg-white">
                {/* Loading Overlay */}
                {isLoading && (
                    <div className="absolute inset-0 bg-white flex flex-col items-center justify-center z-10">
                        <Loader2 className="w-12 h-12 text-arduino-teal animate-spin mb-4" />
                        <p className="text-gray-500 text-sm font-medium">Đang khởi động Simulator...</p>
                        <p className="text-xs text-gray-400 mt-2">Powered by Wokwi</p>
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
                <div className="absolute bottom-6 left-6 max-w-sm bg-white/90 backdrop-blur-md rounded-2xl border border-white/50 p-5 shadow-2xl z-10 animate-slide-up">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-arduino-mint rounded-xl flex items-center justify-center shrink-0">
                            <Zap className="w-5 h-5 text-arduino-teal" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 mb-1">Mẹo hay</h3>
                            <ul className="text-xs text-gray-600 space-y-1.5 leading-relaxed">
                                <li className="flex items-center gap-2">
                                    <kbd className="bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 font-mono text-[10px]">▶</kbd>
                                    Nhấn Play để chạy mạch ảo
                                </li>
                                <li>• Click vào linh kiện để tương tác (nhấn nút, vặn biến trở)</li>
                                <li>• Code editor bên trái tự động lưu</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
