# 🚀 Arduino AI Learning System (Next-Gen LMS)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-Active-success.svg)
![AI](https://img.shields.io/badge/AI-DeepSeek%20%26%20Gemini-purple)

> **"Siêu Trí Tuệ Bách Khoa & Chuyên Gia Top 1"** - Hệ thống học tập thông minh tích hợp AI Trợ giảng hàng đầu, hỗ trợ Arduino, lập trình, và khoa học đa lĩnh vực.

## 📖 Giới thiệu

Đây là nền tảng **Learning Management System (LMS)** thế hệ mới, được thiết kế tối ưu cho việc học lập trình nhúng (Arduino/ESP32) và các môn khoa học tự nhiên. Hệ thống tích hợp **AI Agent mạnh mẽ** đóng vai trò là một gia sư riêng (Personal Tutor), có khả năng giải đáp thắc mắc, chấm bài code, và hướng dẫn theo phương pháp Socratic.

Hệ thống không chỉ dừng lại ở Arduino mà còn mở rộng ra "Bách khoa toàn thư", hỗ trợ render công thức Toán/Lý chuẩn LaTeX và nhận diện ngữ cảnh thông minh.

## ✨ Tính năng Nổi bật

### 🤖 1. AI Trợ giảng "Top 1 Expert"
-   **Context Awareness**: Tự động nhận diện chủ đề (Code, Toán, Lý, Đời sống) để trả lời phù hợp.
-   **Encyclopedia Identity**: Kiến thức sâu rộng, giải thích cặn kẽ bản chất vấn đề.
-   **Deep Reasoning**: Chế độ "Suy nghĩ sâu" (Brain Mode) cho các vấn đề phức tạp.
-   **LaTeX Rendering**: Hiển thị công thức Toán/Lý đẹp mắt ($E=mc^2$).
-   **Streaming Response**: Phản hồi mượt mà thời gian thực.

### 📚 2. Hệ thống LMS Toàn diện
-   **Lộ trình học tập**: Bài học (Video/Text), Bài thực hành (Lab), Quiz trắc nghiệm.
-   **Luyện thi (Drill)**: Ngân hàng câu hỏi trắc nghiệm với giải thích chi tiết.
-   **Thư viện (Library)**: Tra cứu nhanh linh kiện, hàm Arduino, và tài liệu tham khảo.
-   **Tiến độ học tập**: Theo dõi % hoàn thành, bảng xếp hạng (Leaderboard).

### 💻 3. Công cụ Mạnh mẽ
-   **Web IDE**: Code và biên dịch giả lập ngay trên trình duyệt (tương lai).
-   **Mermaid Diagrams**: Tự động vẽ sơ đồ nguyên lý hoặc lưu đồ thuật toán từ lời giải thích của AI.
-   **Onboarding Tour**: Hướng dẫn người dùng mới làm quen hệ thống.
-   **AI Dashboard**: Giao diện làm việc chuyên sâu với AI (Fullscreen mode).

## 🛠️ Tech Stack

Dự án sử dụng công nghệ hiện đại nhất để đảm bảo hiệu năng và trải nghiệm người dùng:

### **Frontend (Apps/Web-Vite)**
-   **Framework**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
-   **Language**: TypeScript
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Animation**: CSS Animations & Transitions
-   **Markdown/Math**: `react-markdown`, `remark-math`, `rehype-katex`, `mermaid`

### **Backend (Apps/Workers)**
-   **Runtime**: [Cloudflare Workers](https://workers.cloudflare.com/) (Serverless & Edge)
-   **Framework**: [Hono](https://hono.dev/) (Siêu nhẹ, siêu nhanh)
-   **Database**: [Cloudflare D1](https://developers.cloudflare.com/d1/) (SQLite at Edge)
-   **Cache/Session**: Cloudflare KV
-   **AI Integration**: OpenRouter (DeepSeek, Gemini, Llama), Google AI Studio.

## 📂 Cấu trúc Dự án

```bash
arduino-web/
├── apps/
│   ├── web-vite/          # Frontend Application
│   │   ├── src/
│   │   │   ├── components/# React Components (UI, Chat, Sidebar...)
│   │   │   ├── pages/     # Page Components (Dashboard, Quiz, AI...)
│   │   │   ├── stores/    # Zustand State Management
│   │   │   └── ...
│   │   └── ...
│   └── workers/           # Backend API Service
│       ├── src/
│       │   ├── db/        # Database Schemas (Drizzle ORM)
│       │   ├── routes/    # API Endpoints (Auth, AI, Courses...)
│       │   ├── services/  # Business Logic (AI, Crypto, Intent...)
│       │   └── ...
│       ├── wrangler.toml  # Cloudflare Config
│       └── ...
├── scripts/               # Utility scripts (Hash gen, deploy helper)
└── ...
```

## 🚀 Hướng dẫn Cài đặt & Chạy Local

### Yêu cầu
-   Node.js (v18+)
-   npm hoặc pnpm
-   Tài khoản Cloudflare (để deploy backend)

### 1. Backend (Workers)

```bash
cd apps/workers
npm install

# Setup local database (D1)
npx wrangler d1 execute arduino-db --local --file=./src/db/schema.sql

# Chạy backend local
npm run dev
```

### 2. Frontend (Web-Vite)

```bash
cd apps/web-vite
npm install

# Tạo file .env nếu cần
# VITE_API_URL=http://localhost:8787/api

# Chạy frontend local
npm run dev
```

Truy cập `http://localhost:5173` để trải nghiệm.

## ☁️ Deployment

Hệ thống được thiết kế để deploy hoàn toàn trên hệ sinh thái Cloudflare.

### Deploy Backend
```bash
cd apps/workers
npx wrangler deploy
# Chạy migration DB trên production (lần đầu)
npx wrangler d1 execute arduino-db --remote --file=./src/db/schema.sql
```

### Deploy Frontend
```bash
cd apps/web-vite
npm run build
npx wrangler pages deploy dist --project-name=arduino-web
```

## 🤝 Contributing

Mọi đóng góp đều được hoan nghênh! Vui lòng tạo Pull Request hoặc tra cứu Issues để biết thêm chi tiết.

## 📝 License

Dự án này thuộc bản quyền **MIT License**.
Copyright © 2026 Nguyen Hoang Long (HNUE).

---
*Built with ❤️ & ☕ by LongNgn204*
