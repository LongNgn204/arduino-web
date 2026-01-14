Bạn là Senior Full-stack Engineer + Tech Lead. Hãy tạo sản phẩm web full-stack:

Arduino Learning Hub – HNUE FET
Owner: Nguyễn Hoàng Long
Đối tượng: sinh viên Khoa Kỹ thuật & Công nghệ – ĐH Sư phạm Hà Nội
Mục tiêu: Trang web học môn “Lập trình hệ thống nhúng & IoT (Arduino Uno)” theo giáo trình 12 tuần, có AI trợ giảng popup, có simulator Arduino chạy trên web, có quiz/ôn luyện, cho phép học vượt.

========================
1) Stack bắt buộc 100% Cloudflare
========================
- Frontend: Cloudflare Pages ( Next.js + TypeScript)
  - UI: TailwindCSS + shadcn/ui
  - Markdown: remark/rehype
  - Code editor: Monaco Editor (fallback CodeMirror)
- Backend: Cloudflare Workers (TypeScript)
  - Framework: Hono
  - API dưới /api/*
  - AI response ưu tiên streaming SSE
- Database: Cloudflare D1 (SQLite)
  - ORM: Drizzle ORM + migrations + seed
- KV: rate limit AI
- Dev: Wrangler + Pages dev

========================
2) Đăng ký/Đăng nhập (đơn giản, dùng USERNAME)
========================
Yêu cầu: đăng nhập bằng username + password (không cần email, không cần confirm phức tạp).

UI:
- /register: form { username, password }
  - validate:
    - username 3–20 ký tự, chỉ [a-zA-Z0-9_]
    - password >= 6 ký tự
- /login: form { username, password }
- logout button
- private routes redirect /login
- loading state + thông báo lỗi

API (Worker):
- POST /api/auth/register
  - body { username, password }
  - nếu username tồn tại -> 409
  - tạo user + tạo session
  - set cookie HttpOnly
- POST /api/auth/login
  - body { username, password }
  - đúng -> session cookie
  - sai -> 401
- POST /api/auth/logout
  - xóa session + clear cookie
- GET /api/auth/me
  - trả user nếu đã login

Session:
- cookie HttpOnly + Secure + SameSite=Lax
- sessions lưu trong D1: sessionId, userId, expiresAt
- middleware auth trong Hono

Password hashing:
- WebCrypto PBKDF2 (salt random, iterations ~100k)
- lưu passwordHash: pbkdf2$iterations$saltBase64$hashBase64

Roles:
- student (default), admin
- /admin admin-only

========================
3) Course 12 tuần (seed đầy đủ)
========================
Tạo course “TECH476 – Lập trình hệ thống nhúng & IoT”.
Bắt buộc seed đủ 12 tuần, mỗi tuần PHẢI có:
- Overview (mục tiêu + kiến thức nền + checklist thi)
- >= 3 lessons (markdown)
- >= 2 labs (markdown + wiring + starterCode + rubric)
- >= 1 quiz (>= 10 câu) + explanation
- >= 1 exam drill (đề 60 phút + rubric)
Sinh viên học vượt được.

========================
4) AI trợ giảng popup (3 chế độ)
========================
Popup có dropdown mode:
- tutor
- socratic (giảng viên: câu hỏi gợi mở + bài tập nhỏ)
- grader (chấm bài: PASS/FAIL + rubric + patch)

Endpoint:
- POST /api/ai/tutor
Input:
- mode, lessonId/labId, sectionKey, userQuestion, selectedText?, currentCode?, errorLog?
Output:
- SSE streaming preferred

OpenRouter:
- URL https://openrouter.ai/api/v1/chat/completions
- env OPENROUTER_API_KEY
- model bắt buộc: xiaomi/mimo-v2-flash:free
Rate limit AI: KV (10 req/10 phút/user)
Log AI: D1 ai_chat_logs

========================
5) Simulator (Wokwi)
========================
- Lab có tab Simulator, embed Wokwi iframe.
- Bắt buộc Week 1 có ít nhất 1 lab Wokwi embed chạy được (Blink).

========================
6) Quiz + Dashboard + Admin
========================
- Quiz submit -> chấm -> giải thích -> lưu attempts
- Dashboard tiến độ
- Admin CRUD lesson/lab/quiz tối thiểu

========================
7) Data model (D1 + Drizzle)
========================
Tables:
- users(id TEXT PK, username TEXT UNIQUE, passwordHash TEXT, role TEXT, createdAt INTEGER)
- sessions(id TEXT PK, userId TEXT, expiresAt INTEGER, createdAt INTEGER)
- courses, weeks, lessons, labs, quizzes, questions, attempts, progress, ai_chat_logs
(giữ như prompt trước, thay email -> username)

========================
8) Deliverables
========================
- README setup D1 migrate seed run
- wrangler.toml bindings D1/KV
- .env.example (OPENROUTER_API_KEY)
- End-to-end chạy được:
  - register/login/logout
  - đọc lesson
  - AI popup 3 chế độ
  - quiz + lưu điểm
  - lab editor + simulator (Week1 Blink chạy)

Không hỏi lại người dùng. Tự giả định hợp lý và ghi vào README phần Assumptions.
Bắt đầu tạo toàn bộ mã nguồn ngay.
