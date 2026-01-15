// Update Popup - Thông báo phiên bản mới và xóa cache/lịch sử web của user
// Khi click sẽ clear localStorage, sessionStorage và reload trang

import { useState, useEffect } from 'react';
import { X, RefreshCw, Sparkles, Trash2 } from 'lucide-react';

interface UpdatePopupProps {
    version?: string;
    onClose?: () => void;
}

// Phiên bản hiện tại của app - thay đổi khi có cập nhật
const CURRENT_VERSION = '2.0.0';

export default function UpdatePopup({ version = CURRENT_VERSION, onClose }: UpdatePopupProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [isClearing, setIsClearing] = useState(false);

    // Kiểm tra xem user đã có phiên bản cũ chưa
    useEffect(() => {
        const savedVersion = localStorage.getItem('arduino-hub-version');

        // Nếu đây là lần đầu hoặc version mới hơn -> hiện popup
        if (!savedVersion || savedVersion !== version) {
            const timer = setTimeout(() => setIsVisible(true), 2000);
            return () => clearTimeout(timer);
        }
    }, [version]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsVisible(false);
            // Chỉ lưu version, không clear data
            localStorage.setItem('arduino-hub-version', version);
            onClose?.();
        }, 300);
    };

    // Xóa toàn bộ lịch sử/cache của web app
    const handleClearAndUpdate = async () => {
        setIsClearing(true);

        try {
            // Lưu lại version mới trước
            const newVersion = version;

            // 1. Xóa toàn bộ localStorage (trừ version tag)
            const keysToRemove: string[] = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key !== 'arduino-hub-version') {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach(key => localStorage.removeItem(key));

            // 2. Xóa toàn bộ sessionStorage
            sessionStorage.clear();

            // 3. Xóa IndexedDB nếu có
            if (window.indexedDB) {
                const databases = await window.indexedDB.databases?.() || [];
                databases.forEach(db => {
                    if (db.name) {
                        window.indexedDB.deleteDatabase(db.name);
                    }
                });
            }

            // 4. Xóa cache (Service Worker)
            if ('caches' in window) {
                const cacheNames = await caches.keys();
                await Promise.all(
                    cacheNames.map(cacheName => caches.delete(cacheName))
                );
            }

            // 5. Lưu version mới
            localStorage.setItem('arduino-hub-version', newVersion);

            // 6. Reload trang sau khi xóa xong
            setTimeout(() => {
                window.location.reload();
            }, 500);

        } catch (error) {
            console.error('Error clearing data:', error);
            setIsClearing(false);
            alert('Có lỗi xảy ra khi xóa dữ liệu. Vui lòng thử lại!');
        }
    };

    if (!isVisible) return null;

    return (
        <div
            className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${isClosing ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                }`}
        >
            <div className="w-80 rounded-2xl bg-gray-900/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="relative p-4 bg-gradient-to-r from-arduino-teal/20 to-arduino-dark/20 border-b border-white/10">
                    <button
                        onClick={handleClose}
                        className="absolute top-3 right-3 p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                        disabled={isClearing}
                    >
                        <X className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-arduino-teal/20 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-arduino-teal" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">Phiên bản mới!</h3>
                            <p className="text-xs text-gray-400">v{version} đã sẵn sàng</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4">
                    <div className="text-sm text-gray-300 mb-4">
                        <p className="mb-2">✨ Có gì mới:</p>
                        <ul className="space-y-1 text-gray-400 text-xs">
                            <li>• Giao diện hoàn toàn mới</li>
                            <li>• Tốc độ nhanh hơn 10x</li>
                            <li>• Sửa lỗi đăng nhập</li>
                        </ul>
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-4">
                        <p className="text-xs text-yellow-200">
                            ⚠️ Để tránh lỗi, hãy xóa dữ liệu cũ trước khi sử dụng phiên bản mới.
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleClearAndUpdate}
                            disabled={isClearing}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium text-white bg-gradient-to-r from-arduino-teal to-arduino-dark hover:shadow-[0_0_20px_rgba(0,151,157,0.3)] transition-all disabled:opacity-50"
                        >
                            {isClearing ? (
                                <>
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                    Đang xóa...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="w-4 h-4" />
                                    Xóa & Cập nhật
                                </>
                            )}
                        </button>
                        <button
                            onClick={handleClose}
                            disabled={isClearing}
                            className="py-2.5 px-4 rounded-xl text-gray-400 border border-gray-700 hover:border-gray-500 transition-colors disabled:opacity-50"
                        >
                            Bỏ qua
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
