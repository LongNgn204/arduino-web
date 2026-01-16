# Arduino Learning Hub 🚀

[![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg)](LICENSE)
[![Deploy: Cloudflare](https://img.shields.io/badge/Deploy-Cloudflare-orange.svg)](https://pages.cloudflare.com/)
[![Node: 20+](https://img.shields.io/badge/Node-20+-green.svg)](https://nodejs.org/)

> **Nền tảng học tập "Lập trình hệ thống nhúng & IoT"** dành cho sinh viên Khoa Kỹ thuật & Công nghệ - ĐH Sư phạm Hà Nội.

---

## ✨ Tính năng nổi bật

| Tính năng | Mô tả |
|-----------|-------|
| 🎓 **13 Tuần Giáo Trình** | Lộ trình từ Week 0 (Điện tử cơ bản) đến Week 12 (Dự án IoT) |
| 🔌 **Dual-Board Support** | Hỗ trợ cả Arduino Uno và ESP32 |
| 💻 **Web IDE Tích hợp** | Code editor với Syntax Highlighting, Auto-save |
| 🎮 **Simulator Online** | Tích hợp Wokwi Simulator chạy code trên trình duyệt |
| 🤖 **AI Agent** | Trợ lý AI hỗ trợ debug code và giải đáp thắc mắc |
| 📝 **Quiz System** | Hệ thống quiz 12 tuần với review đáp án |
| 🏆 **Gamification** | Leaderboard và challenges hàng tuần |

---

## 🛠️ Tech Stack

### Frontend (`apps/web-vite`)
- **Framework**: Vite + React 19 + TypeScript
- **Styling**: TailwindCSS v4 + Framer Motion
- **AI UI**: React Markdown + KaTeX (LaTeX)
- **State**: Zustand

### Backend (`apps/workers`)
- **Runtime**: Cloudflare Workers (Edge)
- **Framework**: Hono
- **Database**: Cloudflare D1 (SQLite) + Drizzle ORM
- **AI**: OpenRouter API

---

## 🚀 Quick Start

### Yêu cầu
- Node.js 20+
- npm hoặc pnpm

### 1. Clone & Install

```bash
git clone https://github.com/LongNgn204/arduino-web.git
cd arduino-web
```

### 2. Chạy Frontend

```bash
cd apps/web-vite
npm install
npm run dev
```
→ Truy cập: `http://localhost:5173`

### 3. Chạy Backend (tuỳ chọn)

```bash
cd apps/workers
npm install
npm run dev
```
→ API: `http://localhost:8787`

### 4. Seed Database (local)

```bash
cd apps/workers
npx wrangler d1 execute arduino-db --local --file=src/db/seed_lms_2026.sql
```

---

## 📁 Project Structure

```
arduino-web/
├── apps/
│   ├── web-vite/          # Frontend (Vite + React)
│   │   ├── src/
│   │   │   ├── components/  # UI Components
│   │   │   ├── pages/       # Route pages
│   │   │   └── stores/      # Zustand stores
│   │   └── package.json
│   │
│   └── workers/           # Backend (Cloudflare Workers)
│       ├── src/
│       │   ├── db/          # SQL schemas & seeds
│       │   └── index.ts     # API routes (Hono)
│       └── wrangler.toml
│
├── curriculum/            # Nội dung giáo trình (.md)
│   ├── week-00-intro.md   # Nhập môn Điện tử (BẮT BUỘC)
│   ├── week-01-gpio-led.md
│   └── ...
│
└── scripts/               # Utility scripts
```

---

## 📚 Curriculum Overview

| Week | Chủ đề | Nội dung chính |
|------|--------|----------------|
| **0** | Nhập môn Điện tử ⚡ | Định luật Ohm, Điện trở, LED, Breadboard **(BẮT BUỘC)** |
| 1-4 | Foundation | GPIO, Digital I/O, Analog/PWM, LED 7 đoạn |
| 5-6 | Sensors & Logic | Cảm biến DHT11, LDR, Servo, Relay |
| 7-8 | Communication | UART, I2C, SPI |
| 9-11 | IoT & Cloud | WiFi, MQTT, Web Server, App |
| 12 | Capstone | Dự án cuối khóa |

---

## 🌍 Deployment

Chi tiết tại [DEPLOY.md](./DEPLOY.md)

- **Frontend**: Cloudflare Pages
- **Backend**: Cloudflare Workers  
- **Database**: Cloudflare D1

---

## 🧪 Testing

```bash
cd apps/web-vite
npm run test          # Unit tests
npm run test:coverage # Coverage report
```

---

## 📝 License

MIT © 2024 [Nguyễn Hoàng Long](https://github.com/LongNgn204)

**Đơn vị**: Khoa Kỹ thuật & Công nghệ - HNUE
