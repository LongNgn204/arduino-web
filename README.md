# Arduino Learning Hub - HNUE FET 🚀

Nền tảng học tập "Lập trình hệ thống nhúng & IoT" dành cho sinh viên Khoa Kỹ thuật & Công nghệ - ĐH Sư phạm Hà Nội.

![Landing Page](file:///C:/Users/Administrator/.gemini/antigravity/brain/f0b3c8f6-0391-42ec-b59a-2680c028fa54/landing_page_demo_1768443358930.webp)

## ✨ Tính Năng Nổi Bật

- **Premium UI/UX**: Giao diện hiện đại, Dark Mode, Animations mượt mà (Glassmorphism, Glow effects).
- **12 Tuần Giáo Trình**: Lộ trình học tập chi tiết từ cơ bản đến nâng cao.
- **AI Trợ Giảng Thông Minh**: 3 chế độ (Tutor, Socratic, Grader) hỗ trợ học tập 24/7.
- **Simulator Online**: Tích hợp Wokwi để chạy code Arduino ngay trên trình duyệt.
- **Hệ Thống Đánh Giá**: Quiz trắc nghiệm và Labs thực hành tự động chấm điểm.

## 🛠️ Công Nghệ (Tech Stack)

Project được xây dựng hoàn toàn trên nền tảng **Cloudflare** và **Vite**.

- **Frontend**: 
  - [Vite](https://vitejs.dev/) + React + TypeScript
  - TailwindCSS v4 + PostCSS
  - Zustand (State Management)
  - Lucide React (Icons)
  - React Router DOM
- **Backend (Cloudflare Workers)**:
  - Hono Framework
  - Cloudflare D1 (SQLite Database)
  - Cloudflare KV (Redis-like storage)
  - Cloudflare AI Gateway (OpenRouter integration)

## 📂 Cấu Trúc Thư Mục

```
arduino-web/
├── apps/
│   ├── web-vite/      # ✅ Frontend chính (Vite + React)
│   ├── workers/       # 🔧 Backend API (Cloudflare Workers)
│   └── web/           # 🗑️ Legacy Next.js (Cần xóa)
├── DEPLOY.md          # 📖 Hướng dẫn deploy chi tiết
└── package.json       # 📦 Workspace configurations
```

## 🚀 Cài Đặt và Chạy Local

### Yêu cầu
- Node.js 18+
- npm (hoặc pnpm)

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

Project được deploy dễ dàng lên **Cloudflare Pages** (Frontend) và **Cloudflare Workers** (Backend).

## 📝 Credits

- **Chủ dự án**: Nguyễn Hoàng Long
- **Đơn vị**: Khoa Kỹ thuật & Công nghệ - HNUE
- **Phiên bản**: 2.0.0 (Vite Migration)
