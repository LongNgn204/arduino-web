# 🗺️ Project Roadmap & Status

Dự án **Arduino Learning Hub** đang trong giai đoạn phát triển tích cực. Dưới đây là lộ trình phát triển và trạng thái hiện tại của các tính năng.

## 🚀 Giai đoạn 1: Foundation (Đã hoàn thành)
- [x] **Monorepo Setup**: Next.js (frontend) + Cloudflare Workers (backend)
- [x] **Database**: D1 (SQLite) schema & migrations
- [x] **Auth**: Session-based auth, PBKDF2 hashing, cookie HTTP-only
- [x] **Core UI**: Landing page, Course layout, Chapter navigation
- [x] **AI Foundation**: OpenRouter integration, Rate limiting

## ⚡ Giai đoạn 2: Interactive Learning (Đã hoàn thành)
- [x] **Lab & Simulator**: Tích hợp Wokwi embed
- [x] **Code Editor**: Monaco editor integration
- [x] **Lab Autosave**: Lưu code tự động lên server & localStorage
- [x] **Live AI Tutor**: 
  - [x] Streaming response (SSE)
  - [x] 3 chế độ: Tutor, Socratic, Grader
  - [x] Context-aware (đọc được code & selected text)
- [x] **Quizzes**: Trắc nghiệm với tính điểm & lịch sử làm bài

## 🛠️ Giai đoạn 3: Advanced Features (Đang triển khai)
- [x] **Progress Tracking**: Dashboard theo dõi tiến độ tổng thể & chi tiết từng tuần
- [x] **Exam Drills**: Chế độ thi thử với đồng hồ đếm ngược
- [x] **Admin Tool**: Standalone HTML dashboard để quản lý users/courses
- [ ] **AI Grader**: Chấm điểm code tự động (đã có UI, chưa có backend logic)
- [ ] **Flashcards**: Hệ thống ôn tập bài học

## 🔮 Giai đoạn 4: Future Enhancements (Q2 2026)
- [ ] **Hardware Bridge**: Kết nối với mạch thật qua WebSerial API
- [ ] **Multiplayer**: Chế độ thi đấu code thời gian thực
- [ ] **Community**: Chia sẻ project & thảo luận
- [ ] **Mobile App**: PWA với offline support

## 📝 Changelog

### Version 1.1.0 (Current)
- **New**: SSE Streaming cho AI Tutor (giảm độ trễ)
- **New**: Lab Autosave & Submit (đồng bộ server)
- **New**: Dashboard thống kê tiến độ học tập
- **New**: Exam Drill mode với timer 60 phút
- **New**: Admin Dashboard (local tool)
- **Fix**: Cải thiện Type safety và Schema validation

### Version 1.0.0
- Initial release
- Basic course content (Week 1)
- User authentication
