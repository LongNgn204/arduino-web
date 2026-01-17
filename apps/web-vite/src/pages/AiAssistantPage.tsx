import { useState } from 'react';
import AiChatSidebar from '../components/chat/AiChatSidebar';
import { Cpu, Maximize2, Minimize2, PanelLeftClose } from 'lucide-react';

export default function AiAssistantPage() {
    const [fullscreen, setFullscreen] = useState(false);

    // AI Dashboard này sẽ reuse logic của AiChatSidebar nhưng ở chế độ hiển thị rộng hơn
    // Tuy nhiên, AiChatSidebar hiện tại thiết kế dạng Drawer.
    // Để tối ưu, ta có thể render AiChatSidebar nhưng custom CSS để nó chiếm full màn hình
    // Hoặc refactor AiChatSidebar để tách phần Logic và Ui.
    // Tạm thời để tiết kiệm thời gian, ta sẽ wrap AiChatSidebar trong một container giả lập.
    // Nhưng AiChatSidebar hiện tại dùng fixed position.

    // Tốt hơn: Sử dụng lại component Chat nhưng override style, hoặc tạo một layout clean.

    return (
        <div className="h-[calc(100vh-theme(spacing.20))] flex flex-col bg-gray-50 rounded-3xl overflow-hidden border border-gray-200 shadow-sm relative">
            <div className="bg-white border-b border-gray-100 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-arduino-teal rounded-xl flex items-center justify-center shadow-lg shadow-arduino-teal/20">
                        <Cpu className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-gray-900 text-lg">AI Studio Assistant</h1>
                        <p className="text-xs text-gray-500">Môi trường làm việc chuyên sâu với AI</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-arduino-teal transition-colors">
                        <PanelLeftClose className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setFullscreen(!fullscreen)}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-arduino-teal transition-colors"
                    >
                        {fullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            <div className="flex-1 relative bg-white">
                {/* 
                   Ở đây ta muốn reuse Chat Interface.
                   Do AiChatSidebar đang được mount ở Layout chính (App.tsx -> Sidebar/Layout), 
                   nếu ta render thêm 1 cái ở đây sẽ bị duplicate store states.
                   
                   Giải pháp:
                   Page này sẽ đóng vai trò là "View Rộng" cho Chat.
                   Ta có thể import các component con của Chat nếu chúng được export (ChatInput, MessageList).
                   Hiện tại AiChatSidebar ôm hết logic.
                   
                   Để đơn giản cho MVP:
                   Ta sẽ hiển thị một thông báo hướng dẫn hoặc placeholder cho version sau 
                   khi refactor tách Chat logic ra khỏi Sidebar UI.
                   
                   NHƯNG user yêu cầu "hoàn thiện hết đi".
                   
                   => Hack: Render <AiChatSidebar /> với prop `embedded={true}` (cần thêm prop này) 
                   hoặc đơn giản là copy logic ra một component ChatPanel.
                   
                   Cách nhanh nhất: Import AiChatSidebar và force nó hiển thị dạng block thay vì fixed.
                   Cần sửa AiChatSidebar một chút để hỗ trợ mode 'embedded'.
                */}

                <AiChatSidebar embedded={true} />
            </div>
        </div>
    );
}
