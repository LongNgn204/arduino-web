# Arduino Learning Hub - HNUE FET 🚀

Nền tảng học tập "Lập trình hệ thống nhúng & IoT" thế hệ mới dành cho sinh viên Khoa Kỹ thuật & Công nghệ - ĐH Sư phạm Hà Nội.

![AI Assistant](https://placehold.co/1200x600/1e293b/teal?text=AI+Assistant+Encyclopedia)

## ✨ Tính Năng Nổi Bật

### 🎓 Hệ Thống Học Tập Toàn Diện
- **12 Tuần Giáo Trình**: Lộ trình bài bản từ cơ bản đến nâng cao.
- **Simulator Online**: Tích hợp Wokwi Simulator chạy code ngay trên trình duyệt.
- **Web IDE Thông Minh**: Code editor với Syntax Highlighting, Auto-save.

### 🤖 AI Agent "Bách Khoa Toàn Thư" (Mới 🌟)
Trợ lý AI mạnh mẽ được nâng cấp toàn diện:
- **Kiến thức vô hạn**: Trả lời mọi câu hỏi từ Arduino đến Toán học, Khoa học, Xã hội.
- **Hỗ trợ LaTeX**: Hiển thị công thức Toán học đẹp mắt (ví dụ: $x = \frac{-b \pm \sqrt{\Delta}}{2a}$).
- **Giao diện linh hoạt**: Cửa sổ chat có thể **Kéo thả (Drag)**, **Thay đổi kích thước (Resize)** và **Phóng to toàn màn hình**.
- **Auto-Fix Agent**: Tự động tìm và sửa lỗi code trong IDE chỉ với 1 cú click.

### 🏆 Gamification
- **Leaderboard**: Bảng xếp hạng sinh viên xuất sắc.
- **Challenges**: Thử thách hàng tuần.

## 🛠️ Công Nghệ (Tech Stack)

Project sử dụng công nghệ Modern Web mới nhất:

### Frontend
- **Framework**: [Vite](https://vitejs.dev/) + React 19 + TypeScript
- **Styling**: TailwindCSS v4 + PostCSS + Animations
- **AI UI**: React Markdown + Katex (LaTeX Support)
- **State**: Zustand

### Backend (Serverless)
- **Runtime**: Cloudflare Workers
- **Framework**: Hono
- **Database**: Cloudflare D1 (SQLite) + Drizzle ORM
- **AI Integration**: OpenRouter API

## 🚀 Cài Đặt và Chạy Local

### Yêu cầu
- Node.js 20+
- npm

### Các bước
1. **Clone project:**
   ```bash
   git clone https://github.com/LongNgn204/arduino-web.git
   cd arduino-web
   ```

2. **Cài đặt dependencies:**
   ```bash
   npm install
   ```

3. **Chạy Frontend (Vite):**
   ```bash
   cd apps/web-vite
   npm run dev
   ```
   Truy cập: `http://localhost:5173`

4. **Chạy Backend (Workers):**
   ```bash
   cd apps/workers
   npm run dev
   ```
   API URL: `http://localhost:8787`

## 🌍 Deployment

Xem hướng dẫn chi tiết tại file [DEPLOY.md](./DEPLOY.md).
Backend chạy trên Cloudflare Workers (Global Edge Network).

## 📝 Credits
- **Chủ dự án**: Nguyễn Hoàng Long
- **Đơn vị**: Khoa Kỹ thuật & Công nghệ - HNUE
- **Phiên bản**: 2.1.0 (AI Agent Update)
