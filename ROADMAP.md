# 🗺️ Arduino Learning Hub Roadmap (2026 Standard)

> **Phiên bản**: 2.0.0 (Vite + Cloudflare)  
> **Mục tiêu**: Nền tảng học tập toàn diện cho môn "Lập trình hệ thống nhúng & IoT" (TECH476) - HNUE.  
> **Cập nhật lần cuối**: 15/01/2026

---

## 📅 Tổng Quan Lộ Trình

| Giai đoạn | Mô tả | Trạng thái |
| :--- | :--- | :--- |
| **Phase 1: Foundation** | Hạ tầng, Database, Auth, Landing Page | ✅ **Hoàn thành** |
| **Phase 2: Core Learning** | Dashboard, Bài giảng, Lab + Simulator, Quiz | 🚧 **Đang triển khai** |
| **Phase 3: AI & Smart Features** | AI Tutor, Auto-grading, Exam Drills | ⏳ Chờ triển khai |
| **Phase 4: Content & Release** | Nhập liệu 12 Tuần, Kiểm thử, Public | ⏳ Chờ triển khai |

---

## 🚀 Chi Tiết Triển Khai

### ✅ Phase 1: Foundation (Đã xong)
- [x] **Tech Stack**: Migration sang Vite (Frontend) + Cloudflare Workers (Backend).
- [x] **Database**: Thiết kế Schema D1 tối ưu (Users, Courses, Progress, AI Logs).
- [x] **Authentication**: 
  - Login/Register với UI Premium (Glassmorphism).
  - Bảo mật: PBKDF2 hashing, HttpOnly Cookies, CSRF protection.
  - Sửa lỗi CORS & Whitelist domain production.
- [x] **Landing Page**: Giới thiệu môn học, hiệu ứng visual hiện đại.

### 🚧 Phase 2: Core Learning (Ưu tiên hiện tại)
Mục tiêu: Sinh viên có thể vào học, đọc bài, làm bài tập.

#### 1. Dashboard & Course UI
- [ ] **Dashboard**: Hiển thị lời chào, tiến độ tổng quan, khóa học đang học.
- [ ] **Course Outline**: Hiển thị danh sách 12 tuần (dạng cây hoặc timeline).
- [ ] **Lock/Unlock Logic**: Cơ chế mở khóa bài học tuần tiếp theo.

#### 2. Lesson & Lab Interface
- [ ] **Lesson Viewer**: Render Markdown đẹp, hỗ trợ highlight code, ảnh minh họa.
- [ ] **Lab Workspace**: 
  - Tích hợp **Monaco Editor** cho code C++.
  - Embed **Wokwi Simulator** để chạy mạch ảo ngay trên web.
  - Nút "Lưu bài" và "Nộp bài".

#### 3. Quiz System
- [ ] Giao diện làm bài trắc nghiệm.
- [ ] Đồng hồ đếm ngược.
- [ ] Chấm điểm tức thì & giải thích đáp án.

---

### ⏳ Phase 3: AI & Smart Features & Hardware
Mục tiêu: Tự động hóa việc dạy và học + Kết nối phần cứng thật.

#### 1. AI Assistant Popup
- [ ] Tích hợp **3 Chế độ** (Tutor, Socratic, Grader).
- [ ] Streaming response (SSE).

#### 2. Exam Drills
- [ ] Chế độ thi thử 60 phút mô phỏng đề thi thật.

#### 3. Component "Tự học, tự code theo ý bạn" (Web IDE & Hardware)
> **Tính năng Đặc biệt**: Code trực tiếp trên web và nạp vào mạch thật mà KHÔNG cần cài Arduino IDE.
- [ ] **Web Serial API**: Kết nối trực tiếp với Arduino Uno R3 qua cổng USB trình duyệt.
- [ ] **Cloud Compiler**: Server biên dịch code C++ thành file `.hex`.
- [ ] **Browser Flasher**: Nạp file `.hex` xuống mạch vật lý ngay trên Chrome/Edge.
- [ ] **Serial Monitor**: Xem kết quả `Serial.println` từ mạch thật ngay trên web.

---

### ⏳ Phase 4: Content Seeding (12 Tuần)
Nội dung chuẩn hóa theo giáo trình TECH476 (2026).

| Tuần | Chủ đề Chính | Nội dung Thực hành Key | Trạng thái |
| :--- | :--- | :--- | :--- |
| **01** | Tổng quan & GPIO | Blink LED theo quy luật, Hiệu ứng LED đuổi | 📝 Chờ nhập |
| **02** | Thiết kế HT & 7-Seg | LED 7 đoạn, Quét LED 4 số, Multiplexing | 📝 Chờ nhập |
| **03** | Input & Keypad | Nút nhấn chống dội, Nhập mật khẩu Keypad | 📝 Chờ nhập |
| **04** | Analog & PWM | Đọc biến trở, Điều khiển độ sáng LED (Breathing) | 📝 Chờ nhập |
| **05** | Tích hợp I/O | Hệ thống điều khiển tổng hợp (Nút + Pot + LED) | 📝 Chờ nhập |
| **06** | Cảm biến | HC-SR04, DHT11, PIR - Cảnh báo thông minh | 📝 Chờ nhập |
| **07** | Serial UART | Giao tiếp PC-Arduino, Protocol điều khiển | 📝 Chờ nhập |
| **08** | Giao tiếp I2C | LCD 1602, Master-Slave Communication | 📝 Chờ nhập |
| **09** | Giao tiếp SPI | Điều khiển 74HC595 hoặc LED Matrix | 📝 Chờ nhập |
| **10** | Giao tiếp 1-Wire | Đo nhiệt độ đa điểm DS18B20 | 📝 Chờ nhập |
| **11** | WiFi WebServer | Điều khiển thiết bị qua mạng LAN (Cơ bản) | 📝 Chờ nhập |
| **12** | Async WebServer | Hệ thống IoT Realtime, Dashboard điều khiển | 📝 Chờ nhập |

---

## 🛠️ Tech Stack & Standards

### Frontend (Vite + React)
- **Styling**: TailwindCSS v4 + Animations (Framer Motion feel).
- **State**: Zustand (Auth + UI state).
- **Routing**: React Router v7.
- **Icons**: Lucide React.

### Backend (Cloudflare Workers)
- **Framework**: Hono (Lightweight, Edge-first).
- **Database**: Drizzle ORM + D1 SQLite.
- **AI**: OpenRouter API (`xiaomi/mimo-v2-flash` model).

### Coding Conventions
- **Clean Code**: Tách biệt logic/view.
- **Comments**: Tiếng Việt 100%, giải thích rõ logic nghiệp vụ.
- **Git**: Commit rõ ràng (`feat:`, `fix:`, `docs:`).

---

## 📌 Ghi chú Deployment
- **Frontend**: Cloudflare Pages (`github-repo` -> Auto build).
- **Backend**: `wrangler deploy` (API triggers).
- **Domain Production**: `hocarduinohnue.pages.dev`.
