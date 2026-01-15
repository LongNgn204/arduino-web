Kế hoạch Viết lại Giáo trình LMS - TECH476 (2026)
Mục tiêu
Tạo nội dung giáo trình phong phú, chi tiết, và hấp dẫn cho 12 tuần học Arduino. Thay vì các gạch đầu dòng ngắn gọn, mỗi tuần sẽ có:
Lý thuyết đầy đủ - Giải thích sâu, có ví dụ thực tế
Code mẫu hoàn chỉnh - Không chỉ gợi ý, mà là code chạy được
Hướng dẫn từng bước - Step-by-step với ảnh minh họa
Quiz chi tiết - Câu hỏi + đáp án + giải thích
Đề thi mẫu - Rubric chấm điểm rõ ràng

User Review Required
IMPORTANT
Phạm vi nội dung: Bạn muốn tập trung vào phần nào trước? Có thể chia làm 3 giai đoạn:
Giai đoạn 1 (Tuần 1-4): Foundation - GPIO, LED, Button, Analog
Giai đoạn 2 (Tuần 5-8): Integration - Sensors, Serial, I2C
Giai đoạn 3 (Tuần 9-12): Communication - SPI, 1-Wire, WiFi
WARNING
Độ dài dự kiến: Mỗi tuần sẽ có ~2000-3000 từ nội dung (Markdown). Toàn bộ 12 tuần ~30,000+ từ. Việc này sẽ mất nhiều thời gian để hoàn thành chất lượng cao.

Proposed Structure (Mỗi Tuần)
1. Lesson Content (Theory)
# Tuần X: [Chủ đề]
## 🎯 Mục tiêu học tập
- Sau bài này, bạn sẽ biết...
## 📚 Kiến thức nền tảng
### [Concept 1]
[Giải thích chi tiết với ví dụ thực tế]
### [Concept 2]
[Giải thích + hình ảnh minh họa]
## 💡 Nguyên lý hoạt động
[Giải thích kỹ thuật với diagram]
## 🔧 Phần cứng cần thiết
| Linh kiện | Số lượng | Ghi chú |
|-----------|----------|---------|
| LED       | 5        | Màu đỏ  |
## 📝 Code mẫu hoàn chỉnh
```cpp
// Code đầy đủ với comment tiếng Việt
⚠️ Lỗi thường gặp & Cách khắc phục
Lỗi X: Nguyên nhân... → Cách sửa...
🎓 Tóm tắt
Key point 1
Key point 2
### 2. Lab Instructions
```markdown
# Lab X.Y: [Tên bài thực hành]
## Yêu cầu đề bài
[Mô tả chi tiết yêu cầu]
## Sơ đồ mạch
[Mô tả kết nối + diagram]
## Hướng dẫn từng bước
### Bước 1: Chuẩn bị
...
### Bước 2: Kết nối mạch
...
### Bước 3: Viết code
...
### Bước 4: Chạy và kiểm tra
...
## Code gợi ý (Starter)
```cpp
// Template code
Tiêu chí đánh giá (Rubric)
Tiêu chí
Điểm
...
40%
Gợi ý nâng cao
[Thử thách thêm cho sinh viên khá]
### 3. Quiz Questions
```json
{
 "question": "...",
 "options": ["A", "B", "C", "D"],
 "correct": 0,
 "explanation": "Giải thích tại sao đáp án này đúng..."
}

Proposed Changes (File Structure)
Content Files
[NEW] 
curriculum/week-01-gpio-led.md
Lý thuyết GPIO, LED, cấu trúc Arduino
Code mẫu hoàn chỉnh cho 3 bài lab
10 câu hỏi quiz với đáp án
[NEW] 
curriculum/week-02-7segment.md
Lý thuyết LED 7 đoạn, multiplexing
Code mẫu cho LED đơn và module 4 số
Giải thích 74HC595
... (tương tự đến week-12)
Database Seeding
[MODIFY] 
scripts/generate_seed_from_md.js
Cập nhật parser để đọc Markdown structure mới
Extract code blocks, quizzes, rubrics
[MODIFY] 
apps/workers/src/db/seed.sql
Regenerate với nội dung chi tiết hơn

Verification Plan
Automated Tests
Parser script chạy thành công
Seed SQL execute không lỗi
Manual Verification
Review nội dung từng tuần (xin feedback từ bạn)
Kiểm tra hiển thị trên frontend

Timeline ước tính
Giai đoạn
Nội dung
Thời gian
1
Tuần 1-4 (Foundation)
~30-45 phút
2
Tuần 5-8 (Integration)
~30-45 phút
3
Tuần 9-12 (Communication)
~30-45 phút
4
Seed to Database
~10 phút
Tổng cộng: ~2-3 giờ nếu làm liên tục
