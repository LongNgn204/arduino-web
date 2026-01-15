# 🗺️ Arduino Learning Hub Roadmap (2026 Standard)

> **Phiên bản**: 2.1.0 (Vite + Cloudflare + Web Serial)  
> **Mục tiêu**: Nền tảng học tập toàn diện cho môn "Lập trình hệ thống nhúng & IoT" (TECH476) - HNUE.  
> **Tình trạng**: Đang giai đoạn hoàn thiện tính năng cao cấp & Nội dung.  
> **Cập nhật lần cuối**: 15/01/2026

---

## 📅 Tổng Quan Lộ Trình

| Giai đoạn | Mô tả | Trạng thái |
| :--- | :--- | :--- |
| **Phase 1: Foundation** | Hạ tầng, Database, Auth, Landing Page | ✅ **Hoàn thành** |
| **Phase 2: Core Learning** | Dashboard, Bài giảng, Lab + Simulator, Quiz | ✅ **Hoàn thành** |
| **Phase 3: Engagement** | Gamification, Leaderboard, Certificate, Exam Drill | ✅ **Hoàn thành** |
| **Phase 4: UI Polish** | Nâng cấp giao diện Premium (LMS, Sidebar, Glassmorphism) | ✅ **Hoàn thành** |
| **Phase 5: Web IDE** | Web Serial, Serial Monitor, Code Editor (Mock Upload) | ✅ **Hoàn thành** |
| **Phase 6: Advanced AI** | AI Tutor, Smart Grading, Adaptive Learning | ⏳ Chờ triển khai |
| **Phase 7: Content & Release** | Nhập liệu 12 Tuần, Kiểm thử, Public | ⏳ Chờ triển khai |

---

## 🚀 Chi Tiết Triển Khai

### ✅ Phase 1: Foundation
- [x] **Tech Stack**: Migration sang Vite (Frontend) + Cloudflare Workers (Backend).
- [x] **Database**: Thiết kế Schema D1 tối ưu (Users, Courses, Progress, AI Logs).
- [x] **Authentication**: 
  - Login/Register với UI Premium (Glassmorphism).
  - Bảo mật: PBKDF2 hashing, HttpOnly Cookies, CSRF protection.
  - Sửa lỗi CORS & Whitelist domain production.
- [x] **Landing Page**: Giới thiệu môn học, hiệu ứng visual hiện đại.

### ✅ Phase 2: Core Learning
- [x] **Dashboard**: Hiển thị khóa học, tiến độ tổng quan, Quick Links.
- [x] **Course Structure**: Tuần học -> Bài giảng / Thực hành.
- [x] **Lesson Viewer**:
  - Giao diện đọc bài hiện đại với Reading Progress Bar.
  - Enhanced Markdown Renderer (Gradient Headings, macOS-style Code Blocks).
- [x] **Lab Workspace**:
  - IDE-style Layout (Full height).
  - Tích hợp Wokwi Simulator.
  - Chấm điểm theo Rubric.

### ✅ Phase 3: Engagement & Retention
- [x] **Leaderboard**: Bảng xếp hạng Real-time dựa trên XP (Quiz, Lab, Drill).
- [x] **Exam Drill (Boss Battle)**:
  - Chế độ thi áp lực cao (Timer, Zen Mode).
  - One-time Submission.
- [x] **Certificate**: Hệ thống cấp chứng chỉ tự động khi hoàn thành khóa học.

### ✅ Phase 4: UI/UX & Navigation
- [x] **Premium UI**: Glassmorphism, Gradient Text, Animations (`animate-fadeIn`).
- [x] **Sidebar Navigation**:
  - Responsive & Collapsible.
  - Truy cập nhanh mọi tính năng (Tuần học, IDE, Leaderboard...).
- [x] **Auth Persistence**: Giữ đăng nhập khi F5, tự động check session.

### ✅ Phase 5: Web IDE & Hardware Interface
- [x] **Web Serial API**: Kết nối trực tiếp với Arduino Uno R3 qua USB.
- [x] **Web IDE UI**: Giao diện Split View (Code Editor tràii / Serial Monitor phải).
- [x] **Serial Monitor**:
  - Gửi/Nhận dữ liệu thời gian thực.
  - Syntax Highlighting cho log (TX/RX).
- [x] **Mock Workflow**: Mô phỏng quá trình Verify/Upload để demo flow.

---

### ⏳ Phase 6: AI & Smart Features (Next Steps)
Mục tiêu: Tự động hóa việc dạy và học.

#### 1. AI Assistant Popup (Hoàn thiện)
- [ ] Tích hợp **3 Chế độ** (Tutor, Socratic, Grader).
- [ ] Streaming response (SSE) - Đã có UI, cần đấu nối API thật sâu hơn.

#### 2. Hardware Compilation (Advanced)
- [ ] **Cloud Compiler**: Dựng Server chạy `avr-gcc` để biên dịch code C++ thật.
- [ ] **Real Flashing**: Nhận file `.hex` từ Cloud và nạp xuống mạch thật qua Web Serial.

---

### ⏳ Phase 7: Content Seeding (12 Tuần)
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
- **Styling**: TailwindCSS v4 + Custom Animations.
- **State**: Zustand (Persisted Auth Store).
- **Routing**: React Router v7.
- **Hardware**: Web Serial API.

### Backend (Cloudflare Workers)
- **Framework**: Hono (Lightweight, Edge-first).
- **Database**: Drizzle ORM + D1 SQLite.

### Conventions
- **UI**: Premium, Glassmorphism, Dark Mode default.
- **Code**: TypeScript strict mode, Clean Architecture.
