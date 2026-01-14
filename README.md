# Arduino Learning Hub - HNUE FET

Nền tảng học lập trình Arduino 12 tuần cho sinh viên Khoa Kỹ thuật & Công nghệ, ĐH Sư phạm Hà Nội.

**Chủ dự án**: Nguyễn Hoàng Long

## ✨ Tính năng

- 📚 **Giáo trình 12 tuần** - Lessons, Labs, Quizzes đầy đủ
- 🤖 **AI trợ giảng 3 chế độ** - Tutor, Socratic, Grader
- 🎮 **Simulator online** - Wokwi embed chạy ngay trên web
- 💾 **Code editor** - Monaco Editor với autosave
- 📊 **Dashboard** - Theo dõi tiến độ học tập

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, TailwindCSS, Monaco Editor |
| Backend | Cloudflare Workers, Hono |
| Database | Cloudflare D1 (SQLite), Drizzle ORM |
| AI | OpenRouter (xiaomi/mimo-v2-flash:free) |
| Rate Limit | Cloudflare KV |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+
- Cloudflare account

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/arduino-web.git
cd arduino-web
pnpm install
```

### 2. Setup Cloudflare D1

```bash
cd apps/workers

# Tạo D1 database
wrangler d1 create arduino-db

# Copy database_id vào wrangler.toml

# Tạo KV namespace
wrangler kv:namespace create AI_RATE_LIMIT
# Copy id vào wrangler.toml
```

### 3. Run migrations & seed

```bash
# Chạy migrations
pnpm db:migrate

# Seed dữ liệu (12 tuần + admin user)
pnpm seed
```

### 4. Setup secrets

```bash
# Set OpenRouter API key
wrangler secret put OPENROUTER_API_KEY
```

### 5. Run dev servers

```bash
# Từ root folder
pnpm dev

# Hoặc chạy riêng:
# Terminal 1 - Backend
cd apps/workers && pnpm dev

# Terminal 2 - Frontend
cd apps/web && pnpm dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:8787

## 📁 Project Structure

```
arduino-web/
├── apps/
│   ├── web/                 # Next.js Frontend
│   │   ├── src/
│   │   │   ├── app/         # App Router pages
│   │   │   ├── components/  # React components
│   │   │   └── stores/      # Zustand stores
│   │   └── package.json
│   │
│   └── workers/             # Cloudflare Workers Backend
│       ├── src/
│       │   ├── routes/      # API routes (Hono)
│       │   ├── db/          # Drizzle schema
│       │   ├── middleware/  # Auth middleware
│       │   └── services/    # Crypto, OpenRouter
│       ├── drizzle/         # Migrations
│       └── wrangler.toml
│
└── package.json             # Root package.json
```

## 👤 Test Accounts

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin123 |
| Student | sinhvien | password123 |

> ⚠️ **Chỉ dùng cho development!** Production phải đổi mật khẩu.

## 🔑 Environment Variables

### Workers (wrangler.toml)

```toml
[[d1_databases]]
binding = "DB"
database_name = "arduino-db"
database_id = "your-database-id"

[[kv_namespaces]]
binding = "AI_RATE_LIMIT"
id = "your-kv-namespace-id"
```

### Secrets

```bash
wrangler secret put OPENROUTER_API_KEY
```

## 📝 API Endpoints

### Auth
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất
- `GET /api/auth/me` - Lấy user hiện tại

### Courses
- `GET /api/courses` - Danh sách khóa học
- `GET /api/weeks/:id` - Chi tiết tuần
- `GET /api/lessons/:id` - Chi tiết lesson
- `GET /api/labs/:id` - Chi tiết lab

### AI
- `POST /api/ai/tutor` - Gọi AI trợ giảng (SSE streaming)
- `POST /api/ai/feedback` - Gửi feedback cho câu trả lời AI

### Labs
- `GET /api/labs/:id` - Chi tiết lab + code đã lưu
- `POST /api/labs/:id/save` - Lưu code (autosave/submit)
- `GET /api/labs/:id/submissions` - Lịch sử nộp bài

### Progress & Drills
- `GET /api/progress` - Tiến độ tổng thể
- `GET /api/progress/week/:id` - Tiến độ tuần
- `GET /api/drills/:id` - Lấy đề thi thử
- `POST /api/drills/:id/submit` - Nộp bài thi thử

### Quiz
- `GET /api/quizzes/:id` - Lấy quiz
- `POST /api/quizzes/:id/submit` - Nộp bài

## 🚢 Deployment

### Frontend (Cloudflare Pages)

```bash
cd apps/web
pnpm build
# Deploy via Cloudflare Pages dashboard
```

### Backend (Cloudflare Workers)

```bash
cd apps/workers
pnpm deploy
```

## 📖 Assumptions

1. Sử dụng **pnpm** làm package manager
2. Frontend/Backend deploy riêng biệt
3. Admin seed: `admin/admin123` (dev only)
4. Rate limit AI: 10 requests/10 phút/user
5. AI model: `xiaomi/mimo-v2-flash:free`

## 📄 License

MIT
