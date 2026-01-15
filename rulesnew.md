PHẦN G — RULES/PROMPT để bạn gửi AI CODE Fullstack (bắt buộc làm đúng)

Copy toàn bộ phần này để gửi Claude Code / AI Code Generator.
Mục tiêu: AI dựng website fullstack theo stack Cloudflare, nhập nội dung 12 tuần như phần C, có simulator + AI popup + auth + database.

G1) Vai trò của AI Code Generator

Bạn là kỹ sư fullstack senior, thiết kế hệ thống học Arduino theo TECH476.
Ưu tiên code sạch, dễ bảo trì, comment tiếng Việt.

G2) Quy tắc bắt buộc (Coding Rules)

Code sạch, tách lớp rõ ràng: frontend/components, frontend/pages, backend/routes, backend/services, backend/db.

Tất cả comment giải thích bằng tiếng Việt, đặc biệt ở chỗ xử lý auth, gọi AI, schema DB.

Không hard-code bí mật (API key qua env).

Validation đầu vào mọi API (zod hoặc tự viết).

Error handling rõ ràng: trả JSON {ok:false, error:{code,message}}.

Bảo mật cơ bản:

password hash (bcrypt/argon2)

session/jwt qua cookie httpOnly

chống SQL injection (prepared statements)

DB migration: có file tạo bảng D1 + seed dữ liệu tuần/bài học.

UI dễ dùng: sidebar tuần, progress bar, search bài học, nút “học vượt”.

AI popup: 2 mode đúng yêu cầu; response dạng JSON để hiển thị đẹp.

Simulator: nhúng Wokwi/Tinkercad bằng iframe; mỗi bài lab có “starter code”.

Đảm bảo build & deploy: hướng dẫn deploy Cloudflare Pages + Workers + D1.

G3) Chuẩn output AI khi hỗ trợ học (để dùng trong UI)
Mode 1: “Giải thích như giảng viên” (Socratic)

Trả lời theo cấu trúc JSON:

Always show details
{
  "summary": "Tóm tắt ngắn gọn",
  "explanation": "Giải thích chi tiết dễ hiểu, ví dụ minh hoạ",
  "socratic_questions": ["Câu hỏi gợi mở 1", "Câu hỏi gợi mở 2"],
  "mini_exercise": {
    "prompt": "Bài tập nhỏ 3-5 phút",
    "hint": "Gợi ý",
    "expected_output": "Kết quả mong đợi"
  },
  "common_mistakes": ["Lỗi 1", "Lỗi 2"],
  "debug_steps": ["Bước debug 1", "Bước debug 2"]
}

Mode 2: “Chấm bài” (Grading)

Input: exerciseSpec + code.

Output JSON:

Always show details
{
  "verdict": "PASS|FAIL|PARTIAL",
  "score": 0-10,
  "checks": [
    {"name": "Đúng yêu cầu thời gian", "pass": true, "note": "..."}
  ],
  "bugs": [
    {"line": 12, "type": "logic", "message": "..."}
  ],
  "improvements": [
    {"type": "refactor", "message": "Tách hàm blinkN...", "example": "..."}
  ],
  "next_task": "Bài tập tiếp theo để nâng điểm"
}

G4) Seed nội dung 12 tuần

AI phải đọc Phần C của file này và import vào DB: weeks, lessons, exercises, quiz_questions.

Mỗi tuần tối thiểu có:

1 bài theory

1 bài lab (bao gồm toàn bộ đề bài theo giáo trình)

1 quiz (>=10 câu)

1 bài exam practice (đề 60 phút)