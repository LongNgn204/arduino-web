RULES — Arduino Learning Hub (HNUE FET)

Chủ dự án: Nguyễn Hoàng Long
Mục tiêu: sản phẩm sư phạm, dễ bảo trì, triển khai Cloudflare (Pages/Workers/D1/KV), AI hỗ trợ học tập đúng giáo trình 12 tuần.

1) Rules cho AI (BẮT BUỘC)
1.1 Nguyên tắc chung

AI phải bám sát ngữ cảnh: tuần/bài/section đang học + đoạn text được chọn + code của sinh viên + error log (nếu có).

AI không bịa thông số kỹ thuật/phần cứng; nếu thiếu dữ liệu, đưa quy trình kiểm tra và hỏi đúng điểm cần (nhưng vẫn phải trả lời được hướng xử lý).

Ưu tiên dạy tư duy:

giải thích logic trước

đưa flowchart/pseudocode

cuối cùng mới đưa code minh hoạ

Câu trả lời phải ngắn gọn nhưng đủ dùng, tránh lan man, tránh thuật ngữ khó nếu không cần.

Khi nói về lỗi thực hành Arduino, luôn kèm checklist debug theo thứ tự: nguồn/board/port → wiring → pin mapping → code → timing → Serial debug.

AI không cung cấp hướng dẫn nguy hiểm (điện lưới AC, mạch công suất…) và không giúp gian lận.

1.2 Định dạng bắt buộc theo chế độ
Mode = tutor (trợ giảng chuẩn)

AI phải trả lời đúng format:

Giải thích ngắn (≤ 6 câu)

Ví dụ Arduino C/C++ (code block ngắn, có comment tiếng Việt)

Flowchart/pseudocode (gạch đầu dòng)

Lỗi thường gặp + checklist debug

Mode = socratic (giải thích như giảng viên)

AI phải trả lời đúng format:

Giải thích ngắn, rõ ràng (như giảng viên)

3–5 câu hỏi gợi mở để sinh viên tự suy luận

1 bài tập nhỏ (mini-exercise)

Hint (chỉ gợi ý, chưa đưa đáp án đầy đủ)

Chỉ khi sinh viên yêu cầu “cho đáp án” mới cung cấp lời giải đầy đủ

Mode = grader (chấm bài)

AI phải trả lời đúng format:

Kết luận: Đạt/Chưa đạt

Lỗi chính theo mức độ: Critical / Major / Minor

Đối chiếu rubric: mục nào đạt, mục nào thiếu

Gợi ý cải thiện (≥ 3)

Minimal patch hoặc code sửa mẫu (ưu tiên sửa ít nhất có thể)

Checklist test xác nhận (các bước chạy thử để chắc đúng)

Grader bắt buộc bám rubric của Lab/Exam, không tự bịa yêu cầu ngoài đề.

1.3 Quy tắc đạo đức học thuật

AI được phép: giải thích, gợi ý, sửa lỗi, chấm bài, đưa ví dụ minh họa.

AI không hỗ trợ: “đổi tên biến để thầy không nhận ra”, “lách đạo văn”, “làm bài hộ để nộp”.

Khi người dùng yêu cầu kiểu gian lận, AI chuyển hướng sang:

hướng dẫn tư duy

template

checklist debug

luyện đề biến thể

1.4 Bảo mật AI

API key OpenRouter không được lộ ra client.

Endpoint AI phải rate limit (KV).

Lưu log AI tối thiểu (D1) phục vụ cải tiến; không lưu dữ liệu nhạy cảm.

2) Rules cho Codebase (CODE SẠCH + DỄ BẢO TRÌ)
2.1 Nguyên tắc clean code

Ưu tiên đơn giản, rõ ràng, ít ma thuật.

Một file chỉ nên có một trách nhiệm chính; không nhồi logic.

Đặt tên biến/hàm rõ nghĩa, thống nhất.

Mọi “hằng số” quan trọng phải đưa vào constants và có giải thích.

Tránh duplication: tạo helper/util và tái sử dụng.

2.2 Quy tắc comment & tài liệu (TIẾNG VIỆT)

Tất cả comment quan trọng phải bằng tiếng Việt, mục tiêu: sinh viên/giảng viên đọc hiểu ngay.

Comment phải trả lời được ít nhất một trong các câu:

“Vì sao làm vậy?”

“Đầu vào/đầu ra là gì?”

“Nếu sai thì thường sai ở đâu?”

Tránh comment kiểu mô tả lại code (ví dụ “increase i by 1”). Chỉ comment phần ý nghĩa/logic.

Mỗi API endpoint cần doc ngắn (JSDoc) bằng tiếng Việt:

mục đích

request/response

status code lỗi thường gặp

2.3 Coding conventions (TypeScript)

Bật strict TS. Không dùng any trừ trường hợp bất khả kháng (phải có comment lý do).

Dùng zod (hoặc tương đương) để validate input API:

request body

query params

Không để “logic nghiệp vụ” rải rác trong UI components:

UI gọi service

service gọi API

Tách lớp:

db/ (schema + queries)

services/ (OpenRouter client, auth helpers)

routes/ (Hono route handlers)

ui/ (components)

2.4 Quy tắc API (Workers/Hono)

Mọi endpoint trả lỗi phải thống nhất JSON:

{ "error": { "code": "SOME_CODE", "message": "..." } }


Status codes chuẩn:

200 OK

201 Created

400 Bad Request (validate)

401 Unauthorized

403 Forbidden

409 Conflict (username tồn tại)

429 Too Many Requests (rate limit)

500 Internal Error (có log)

Không trả stack trace ra client trong production.

2.5 Auth (username/password)

Username normalize (khuyến nghị lowercase) để tránh trùng “Long” và “long”.

Password hash dùng PBKDF2 qua WebCrypto; không lưu plain text.

Session cookie:

HttpOnly, Secure, SameSite=Lax

Có expiresAt

Logout phải xóa session ở server

Middleware requireAuth và requireAdmin phải dùng lại được, có comment tiếng Việt.

2.6 Database (D1/Drizzle)

Migrations phải chạy được qua wrangler.

Seed dữ liệu:

tạo course 12 tuần đầy đủ

tạo admin seed sẵn (ví dụ: username admin, password admin123) và ghi rõ trong README (chỉ dev)

Mọi query phải đặt trong db/queries/*.ts, tránh gọi SQL trực tiếp trong UI.

2.7 UI/UX Rules

Trang /register và /login phải tối giản, ít lỗi.

Route private bắt buộc redirect nếu chưa đăng nhập.

AI popup phải:

có dropdown mode

có loading state

có nút copy câu trả lời

hiển thị lỗi rate limit rõ ràng

Code editor:

autosave localStorage theo labId

nút “Khôi phục starter code”

Quiz:

sau submit hiển thị giải thích từng câu.

2.8 Simulator Rules

Lab có tab Simulator.

Week 1 phải có ít nhất 1 Wokwi embed chạy thật (Blink).

Nếu thiếu embed URL: hiển thị fallback “chạy trên kit thật” + hướng dẫn wiring.

3) Quy tắc nội dung giáo trình (12 tuần)

Mỗi tuần phải có:

overview + checklist thi

≥ 3 lessons

≥ 2 labs

≥ 1 quiz (≥10 câu)

≥ 1 exam drill (60 phút + rubric)

Nội dung phải ưu tiên:

flowchart

tư duy phân rã bài toán

lỗi thực hành thường gặp

rubric chấm điểm rõ ràng

4) Quality Gates (tiêu chí “đạt” trước khi merge)

Đăng ký/đăng nhập hoạt động (session cookie OK).

Mở lesson đọc markdown OK.

AI popup 3 mode hoạt động (có rate limit).

Quiz nộp bài, chấm, lưu attempt OK.

Lab editor autosave OK.

Week 1 Blink simulator embed chạy thật.

README hướng dẫn chạy local đầy đủ, người khác clone về chạy được.