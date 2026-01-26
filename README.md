# 🌏 HoiNhap Translate Live 2026 - Community Edition

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-Active-success.svg)
![Stack](https://img.shields.io/badge/stack-Cloudflare-orange)

> **"Hội nhập Quốc tế - Học tập suốt đời"**
> Dự án cộng đồng mã nguồn mở, hỗ trợ học tập Arduino, lập trình và dịch thuật trực tiếp.
> **Phiên bản Cộng đồng (Community Edition)**: Tập trung vào tính năng, sự ổn định và khả năng vận hành chi phí thấp.

## 📋 Giới thiệu

**HoiNhap Translate Live** là một nền tảng học tập và dịch thuật phi lợi nhuận. Dự án được xây dựng với triết lý:
*   **Minimalist UI**: Giao diện tối giản, tập trung vào nội dung (Text-first). Không hiệu ứng rườm rà, không gradient lòe loẹt.
*   **Community-First**: Không tính năng doanh nghiệp (SSO, Team Admin, Invoice). Mọi tính năng đều phục vụ người dùng cuối miễn phí.
*   **High Performance**: Chạy hoàn toàn trên Edge Network của Cloudflare để đảm bảo tốc độ cao nhất cho người dùng Việt Nam.

## 🛠 Tech Stack (Bắt buộc)

Dự án tuân thủ nghiêm ngặt stack công nghệ sau để đảm bảo tính đồng bộ và dễ bảo trì cho cộng đồng:

### Frontend
*   **Host**: Cloudflare Pages
*   **Core**: React + TypeScript + Vite
*   **UI Library**: Tailwind CSS (với cấu hình White/Gray/Black strict)
*   **Component**: Headless UI / Radix Primitives (Tự custom, không dùng thư viện nặng)

### Backend
*   **Host**: Cloudflare Workers (Serverless)
*   **Language**: TypeScript
*   **Database**: Cloudflare D1 (SQLite at Edge)
*   **Cache/Limit**: Cloudflare KV
*   **AI Engine**: OpenRouter (Kết nối model mở như Llama 3, Mistral, DeepSeek)

## ✨ Tính năng Chính

1.  **Hệ thống Bài học (LMS)**:
    *   Cấu trúc tuần học, bài giảng Text-only dễ đọc.
    *   Hỗ trợ Markdown, LaTeX (Toán/Lý) và Mermaid (Sơ đồ).
    *   Tích hợp trình mô phỏng Wokwi cho bài Lab Arduino.

2.  **AI Tutor (Trợ giảng ảo)**:
    *   Giao diện chat tối giản bên cạnh bài học.
    *   Hỗ trợ 3 chế độ: Tutor (Giảng bài), Socratic (Gợi mở), và Grader (Chấm code).
    *   **Lưu ý**: Chỉ text, không voice, không avatar động.

3.  **Công cụ Cộng đồng**:
    *   Dịch thuật trực tiếp (Live Translate) hỗ trợ người học.
    *   Thư viện tra cứu nhanh API/Document.

## 📂 Cấu trúc Source Code

```bash
arduino-web/
├── apps/
│   ├── web-vite/          # Frontend (React + Vite)
│   │   ├── src/
│   │   │   ├── components/# Các thành phần UI tối giản (Button, Card...)
│   │   │   ├── pages/     # Các trang màn hình chính
│   │   │   └── stores/    # Quản lý state (Zustand)
│   │   └── ...
│   └── workers/           # Backend (Cloudflare Workers)
│       ├── src/
│       │   ├── db/        # Drizzle ORM Schema & Migrations
│       │   └── routes/    # API Controllers
│       └── ...
└── ...
```

## 🚀 Hướng dẫn Chạy Local

### Yêu cầu
*   Node.js v18 trở lên.
*   Tài khoản Cloudflare (để dev backend).
*   Wrangler CLI (`npm i -g wrangler`).

### 1. Khởi chạy Backend
```bash
cd apps/workers
npm install
# Tạo database local
npx wrangler d1 execute arduino-db --local --file=./src/db/schema.sql
# Chạy server development
npm run dev
```

### 2. Khởi chạy Frontend
```bash
cd apps/web-vite
npm install
# Tạo file .env nếu cần thiết
cp .env.example .env
# Chạy vite server
npm run dev
```
Truy cập: `http://localhost:5173`

## 🤝 Quy tắc Đóng góp (Contribution)

1.  **Tuân thủ UI**: Không thêm màu sắc lạ, animation không cần thiết. Giữ UI "Trắng/Đen/Xám".
2.  **Bảo mật**: Không bao giờ commit API Key. Dùng `.dev.vars` cho local development.
3.  **Code Style**: Giữ code sạch, TypeScript strictly typed.

## 📝 License

Dự án phát hành dưới giấy phép **MIT**.
Code vì cộng đồng, bởi cộng đồng.

---
*Dự án nằm trong hệ sinh thái HoiNhap 2026*
