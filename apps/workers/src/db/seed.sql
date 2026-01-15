-- Generated Seed Data from noidunghoc.md
-- Date: 2026-01-15T05:10:28.181Z

-- CLEAR DATA
DELETE FROM lab_submissions;
DELETE FROM quiz_attempts;
DELETE FROM progress;
DELETE FROM ai_chat_logs;
DELETE FROM questions;
DELETE FROM quizzes;
DELETE FROM exam_drills;
DELETE FROM labs;
DELETE FROM lessons;
DELETE FROM weeks;
DELETE FROM courses;
DELETE FROM sessions;
DELETE FROM users;

-- USERS
INSERT INTO users (id, username, password_hash, role, display_name, created_at, updated_at) VALUES 
('admin-001', 'admin', 'pbkdf2$100000$c2FsdF9hZG1pbl90ZXN0$WkYxR2FEbG1iSEZ3WVhOemQyOXlaQT09', 'admin', 'Administrator', unixepoch(), unixepoch()),
('student-001', 'sinhvien', 'pbkdf2$100000$c2FsdF9zdHVkZW50X3Rlc3Q$dGVzdHBhc3N3b3JkMTIz', 'student', 'Nguyen Hoang Long', unixepoch(), unixepoch());

-- COURSE
INSERT INTO courses (id, code, title, description, total_weeks, is_published, created_at) VALUES 
('course-tech476', 'TECH476', 'Lập trình hệ thống nhúng & IoT', 'Khóa học Arduino Uno 12 tuần: Từ cơ bản đến IoT. Học lý thuyết, thực hành simulator, và làm dự án thực tế.', 12, 1, unixepoch());

-- WEEK 1
INSERT INTO weeks (id, course_id, week_number, title, overview, objectives, is_published, created_at) VALUES ('week-01', 'course-tech476', 1, 'Tổng quan hệ thống nhúng & GPIO (LED)', '# Tổng quan hệ thống nhúng & GPIO (LED)

- Khái niệm hệ thống nhúng; vai trò MCU.  
- GPIO digital output: `pinMode`, `digitalWrite`.  
- LED + điện trở hạn dòng (220Ω/330Ω).  
- `delay(ms)` và tính “blocking” (tuần sau sẽ học cách tốt hơ...', '["Biết Arduino Uno là gì, cấu trúc `setup()` và `loop()`.","Điều khiển LED đơn và nhiều LED theo quy luật thời gian.","Rèn tư duy vòng lặp, mảng pin, tách hàm."]', 1, unixepoch());
INSERT INTO lessons (id, week_id, order_index, title, content, duration, is_published, created_at) VALUES ('lesson-01-01', 'week-01', 1, 'Lý thuyết cốt lõi', '- Khái niệm hệ thống nhúng; vai trò MCU.  
- GPIO digital output: `pinMode`, `digitalWrite`.  
- LED + điện trở hạn dòng (220Ω/330Ω).  
- `delay(ms)` và tính “blocking” (tuần sau sẽ học cách tốt hơn).

### Mini-lecture (giọng giảng viên)
- “Arduino là MCU chạy vòng lặp vô hạn. `setup()` chạy đúng 1 lần để khởi tạo, còn `loop()` chạy mãi.”  
- “Trong nhúng, ta mô tả: **Input** (nút/cảm biến) → **Process** (logic) → **Output** (LED/relay/màn hình).”

## 1.3 Pin map & mạch
- LED1..LED5: D2, D3, D4, D5, D6 (mỗi LED có điện trở).  
- Chân còn lại LED về GND.', 30, 1, unixepoch());
INSERT INTO labs (id, week_id, order_index, title, instructions, wiring, starter_code, rubric, simulator_url, duration, is_published, created_at) VALUES ('lab-01-01', 'week-01', 1, 'Bài 1-1: Điều khiển LED theo quy luật thời gian', '**Yêu cầu:**
1) Bật 1s, tắt 1s, lặp 5 lần.  
2) Bật 3s, tắt 0,5s, lặp 5 lần.  
3) Bật 0,5s, tắt 3s, lặp 5 lần.  

**Gợi ý chuẩn hoá code:** viết hàm `blinkN(tOnMs, tOffMs, n)` và gọi 3 lần.

**Tiêu chí PASS:** đúng số lần lặp, đúng khoảng thời gian (sai số nhỏ do chạy thực tế).

---', 'See instructions', '// Write your code here', '{"total":10}', 'https://wokwi.com/projects/new/arduino-uno', 45, 1, unixepoch());
INSERT INTO labs (id, week_id, order_index, title, instructions, wiring, starter_code, rubric, simulator_url, duration, is_published, created_at) VALUES ('lab-01-02', 'week-01', 2, 'Bài 1-2: Điều khiển 5 LED (D2–D6) theo quy tắc', '**Yêu cầu:**
- Bật tuần tự LED1→LED5, cách 1s giữa các LED.  
- Giữ tất cả LED sáng 5s.  
- Tắt tuần tự LED5→LED1, cách 1s.

**Tiêu chí PASS:** đúng thứ tự, đúng delay, không bỏ sót LED.

---', 'See instructions', '// Write your code here', '{"total":10}', 'https://wokwi.com/projects/new/arduino-uno', 45, 1, unixepoch());
INSERT INTO labs (id, week_id, order_index, title, instructions, wiring, starter_code, rubric, simulator_url, duration, is_published, created_at) VALUES ('lab-01-03', 'week-01', 3, 'Bài 1-3: Điều khiển 5 LED (D2–D6) “duy nhất một LED sáng”', '**Yêu cầu:**
- Duy nhất 1 LED sáng chạy 1→5, trễ 1s.  
- Duy nhất 1 LED sáng chạy 5→1, trễ 0,5s.

**Tiêu chí PASS:** luôn chỉ có 1 LED sáng tại mọi thời điểm.', 'See instructions', '// Write your code here', '{"total":10}', 'https://wokwi.com/projects/new/arduino-uno', 45, 1, unixepoch());

-- WEEK 2
INSERT INTO weeks (id, course_id, week_number, title, overview, objectives, is_published, created_at) VALUES ('week-02', 'course-tech476', 2, 'Thiết kế hệ thống nhúng & LED 7 đoạn', '# Thiết kế hệ thống nhúng & LED 7 đoạn

- Top-Down: yêu cầu → module → thiết kế → tích hợp → test.  
- Bottom-Up: thử nghiệm module trước rồi ghép hệ thống.  
- LED 7 đoạn: common cathode/anode (đảo logic).  
- Multiplexing: quét digit n...', '["Hiểu Top-Down vs Bottom-Up, cách thiết kế bài nhúng.","Điều khiển LED 7 đoạn (1 số) và module 4 số (quét).","(Nếu có) điều khiển module 4 số qua 74HC595."]', 1, unixepoch());
INSERT INTO lessons (id, week_id, order_index, title, content, duration, is_published, created_at) VALUES ('lesson-02-01', 'week-02', 1, 'Lý thuyết cốt lõi', '- Top-Down: yêu cầu → module → thiết kế → tích hợp → test.  
- Bottom-Up: thử nghiệm module trước rồi ghép hệ thống.  
- LED 7 đoạn: common cathode/anode (đảo logic).  
- Multiplexing: quét digit nhanh để hiển thị 4 số ổn định.  
- 74HC595: shift register, giảm số chân điều khiển.', 30, 1, unixepoch());
INSERT INTO labs (id, week_id, order_index, title, instructions, wiring, starter_code, rubric, simulator_url, duration, is_published, created_at) VALUES ('lab-02-01', 'week-02', 1, 'Bài 2-1: LED 7 đoạn (1 số)', '**Yêu cầu:**
- Hiển thị 0→9, trễ 2s.  
- Hiển thị 0→9 rồi 9→0, trễ 2s.  
- Hiển thị các số chẵn: 0,2,4,6,8 và số lẻ: 1,3,5,7.

**Tiêu chí PASS:** hiển thị đúng số, không sai segment.

---', 'See instructions', '// Write your code here', '{"total":10}', 'https://wokwi.com/projects/new/arduino-uno', 45, 1, unixepoch());
INSERT INTO labs (id, week_id, order_index, title, instructions, wiring, starter_code, rubric, simulator_url, duration, is_published, created_at) VALUES ('lab-02-02', 'week-02', 2, 'Bài 2-2: Mô đun 4 LED 7 đoạn', '**Yêu cầu:**
- Hiển thị số tự nhiên 0→9999, trễ 0,3s.  
- Hiển thị số chẵn 0→9998, trễ 0,3s.

**Tiêu chí PASS:** quét đủ nhanh (không nhấp nháy rõ), số đúng.

---', 'See instructions', '// Write your code here', '{"total":10}', 'https://wokwi.com/projects/new/arduino-uno', 45, 1, unixepoch());
INSERT INTO labs (id, week_id, order_index, title, instructions, wiring, starter_code, rubric, simulator_url, duration, is_published, created_at) VALUES ('lab-02-03', 'week-02', 3, 'Bài 2-3: Module 4 LED 7 đoạn + 74HC595', '**Yêu cầu:**
- Hiển thị 0–9 trên tất cả chữ số.  
- Đếm tăng 0→9999, trễ 0,2s.  
- Đếm giảm 9999→0, trễ 0,2s.  
- Nháy cả 4 led 4 lần, chu kỳ nháy 2s.

**Tiêu chí PASS:** đúng logic shift + latch, hiển thị mượt.', 'See instructions', '// Write your code here', '{"total":10}', 'https://wokwi.com/projects/new/arduino-uno', 45, 1, unixepoch());

-- WEEK 3
INSERT INTO weeks (id, course_id, week_number, title, overview, objectives, is_published, created_at) VALUES ('week-03', 'course-tech476', 3, 'Input: Nút nhấn & Keypad', '# Input: Nút nhấn & Keypad

- INPUT_PULLUP: không nhấn HIGH, nhấn LOW (đảo logic).  
- Debounce 20–50ms.  
- Edge detection (phát hiện nhấn mới) để đếm lần nhấn.  
- Keypad: quét hàng/cột, mapping phím....', '["Đọc nút nhấn đúng, chống dội, bắt cạnh.","Keypad đọc ký tự và chuỗi, làm bài mật khẩu."]', 1, unixepoch());
INSERT INTO lessons (id, week_id, order_index, title, content, duration, is_published, created_at) VALUES ('lesson-03-01', 'week-03', 1, 'Lý thuyết cốt lõi', '- INPUT_PULLUP: không nhấn HIGH, nhấn LOW (đảo logic).  
- Debounce 20–50ms.  
- Edge detection (phát hiện nhấn mới) để đếm lần nhấn.  
- Keypad: quét hàng/cột, mapping phím.', 30, 1, unixepoch());
INSERT INTO labs (id, week_id, order_index, title, instructions, wiring, starter_code, rubric, simulator_url, duration, is_published, created_at) VALUES ('lab-03-01', 'week-03', 1, 'Bài 3-1: Nhấn → LED bật, nhả → LED tắt', '**Serial format bắt buộc:**
- Trạng thái nút ấn: (1 - nhấn, 0 - không nhấn)  
- Trạng thái led: (bật / tắt)

---', 'See instructions', '// Write your code here', '{"total":10}', 'https://wokwi.com/projects/new/arduino-uno', 45, 1, unixepoch());
INSERT INTO labs (id, week_id, order_index, title, instructions, wiring, starter_code, rubric, simulator_url, duration, is_published, created_at) VALUES ('lab-03-02', 'week-03', 2, 'Bài 3-2: Đếm số lần nhấn, lẻ bật, chẵn tắt', '**Serial format bắt buộc:**
- Số lần nhấn nút: xx  
- Trạng thái led: (bật / tắt)

---', 'See instructions', '// Write your code here', '{"total":10}', 'https://wokwi.com/projects/new/arduino-uno', 45, 1, unixepoch());
INSERT INTO labs (id, week_id, order_index, title, instructions, wiring, starter_code, rubric, simulator_url, duration, is_published, created_at) VALUES ('lab-03-03', 'week-03', 3, 'Bài 3-3: Keypad đọc 1 ký tự', '**Serial format:** `Kí tự vừa nhập: ____`

---', 'See instructions', '// Write your code here', '{"total":10}', 'https://wokwi.com/projects/new/arduino-uno', 45, 1, unixepoch());
INSERT INTO labs (id, week_id, order_index, title, instructions, wiring, starter_code, rubric, simulator_url, duration, is_published, created_at) VALUES ('lab-03-04', 'week-03', 4, 'Bài 3-4: Keypad điều khiển 5 LED theo mapping', '- nhấn 1 → bật led1; nhấn 2 → tắt led1  
- nhấn 3 → bật led2; nhấn 4 → tắt led2  
- nhấn 5 → bật led3; nhấn 6 → tắt led3  
- nhấn 7 → bật led4; nhấn 8 → tắt led4  
- nhấn 9 → bật led5; nhấn 0 → tắt led5

---', 'See instructions', '// Write your code here', '{"total":10}', 'https://wokwi.com/projects/new/arduino-uno', 45, 1, unixepoch());
INSERT INTO labs (id, week_id, order_index, title, instructions, wiring, starter_code, rubric, simulator_url, duration, is_published, created_at) VALUES ('lab-03-05', 'week-03', 5, 'Bài 3-5: Keypad password (kết thúc bằng `#`)', '- Mật khẩu đúng: bật LED xanh; Serial: `Mật khẩu đúng`  
- Mật khẩu sai: bật LED đỏ; Serial: `Mật khẩu sai`', 'See instructions', '// Write your code here', '{"total":10}', 'https://wokwi.com/projects/new/arduino-uno', 45, 1, unixepoch());

-- WEEK 4
INSERT INTO weeks (id, course_id, week_number, title, overview, objectives, is_published, created_at) VALUES ('week-04', 'course-tech476', 4, 'Analog input/output: ADC & PWM', '# Analog input/output: ADC & PWM

- ADC 10-bit: 0..1023.  
- Điện áp: `V = raw * 5.0 / 1023`.  
- PWM: `analogWrite(0..255)` trên chân PWM (3,5,6,9,10,11).  
- Map & clamp giá trị....', '["Đọc pot raw/V/%; PWM điều khiển độ sáng.","Điều khiển chu kỳ nháy theo pot.","Điều khiển 7 LED theo 3 chế độ %."]', 1, unixepoch());
INSERT INTO lessons (id, week_id, order_index, title, content, duration, is_published, created_at) VALUES ('lesson-04-01', 'week-04', 1, 'Lý thuyết cốt lõi', '- ADC 10-bit: 0..1023.  
- Điện áp: `V = raw * 5.0 / 1023`.  
- PWM: `analogWrite(0..255)` trên chân PWM (3,5,6,9,10,11).  
- Map & clamp giá trị.', 30, 1, unixepoch());
INSERT INTO labs (id, week_id, order_index, title, instructions, wiring, starter_code, rubric, simulator_url, duration, is_published, created_at) VALUES ('lab-04-01', 'week-04', 1, 'Bài 4-1: Đọc điện áp pot — 3 dạng', '- Raw (analogRead)  
- Điện áp (V)  
- %

---', 'See instructions', '// Write your code here', '{"total":10}', 'https://wokwi.com/projects/new/arduino-uno', 45, 1, unixepoch());
INSERT INTO labs (id, week_id, order_index, title, instructions, wiring, starter_code, rubric, simulator_url, duration, is_published, created_at) VALUES ('lab-04-02', 'week-04', 2, 'Bài 4-2: PWM độ sáng LED theo pot', 'Serial bắt buộc:
- Raw  
- % đã xử lý  
- Vout tính theo V

---', 'See instructions', '// Write your code here', '{"total":10}', 'https://wokwi.com/projects/new/arduino-uno', 45, 1, unixepoch());
INSERT INTO labs (id, week_id, order_index, title, instructions, wiring, starter_code, rubric, simulator_url, duration, is_published, created_at) VALUES ('lab-04-03', 'week-04', 3, 'Bài 4-3: Điều khiển tốc độ nháy theo pot', '- Chu kỳ bật/tắt từ 0,1s (pot=1023) đến 1s (pot=0).  
Serial bắt buộc:
- % pot  
- Chế độ LED (bật/tắt hiện hành)  
- Chu kỳ (Ton + Toff)

---', 'See instructions', '// Write your code here', '{"total":10}', 'https://wokwi.com/projects/new/arduino-uno', 45, 1, unixepoch());
INSERT INTO labs (id, week_id, order_index, title, instructions, wiring, starter_code, rubric, simulator_url, duration, is_published, created_at) VALUES ('lab-04-04', 'week-04', 4, 'Bài 4-4: 7 LED (D2→D8) theo pot, 3 chế độ', '- <30%: chạy 2→8  
- >70%: chạy 8→2  
- 31–69%: chạy từ giữa ra hai phía (5→8 và 5→2)  
Serial bắt buộc:
- % pot  
- chế độ hiện hành', 'See instructions', '// Write your code here', '{"total":10}', 'https://wokwi.com/projects/new/arduino-uno', 45, 1, unixepoch());

-- WEEK 5
INSERT INTO weeks (id, course_id, week_number, title, overview, objectives, is_published, created_at) VALUES ('week-05', 'course-tech476', 5, 'Thực hành tích hợp I/O', '# Thực hành tích hợp I/O

...', '["Ghép nút + pot + LED + 7-seg thành hệ thống.","Làm quen “state/mode” (cơ bản), giảm lỗi khi thi."]', 1, unixepoch());
INSERT INTO labs (id, week_id, order_index, title, instructions, wiring, starter_code, rubric, simulator_url, duration, is_published, created_at) VALUES ('lab-05-01', 'week-05', 1, 'Bài 5-1: LED trang trí theo pot', '- pot <25%: LED1→LED8, lặp 3 lần  
- pot >75%: LED8→LED1, lặp 3 lần  
- 25–75%: sáng từ 2 phía (LED1→LED4 và LED8→LED5)', 'See instructions', '// Write your code here', '{"total":10}', 'https://wokwi.com/projects/new/arduino-uno', 45, 1, unixepoch());
INSERT INTO labs (id, week_id, order_index, title, instructions, wiring, starter_code, rubric, simulator_url, duration, is_published, created_at) VALUES ('lab-05-02', 'week-05', 2, 'Bài 5-2: Số lượng LED sáng theo pot', '- chia 10%  
- pot >=20% → LED1 sáng  
- mỗi +10% thêm 1 LED', 'See instructions', '// Write your code here', '{"total":10}', 'https://wokwi.com/projects/new/arduino-uno', 45, 1, unixepoch());
INSERT INTO labs (id, week_id, order_index, title, instructions, wiring, starter_code, rubric, simulator_url, duration, is_published, created_at) VALUES ('lab-05-03', 'week-05', 3, 'Bài 5-3: LED trang trí theo số lần nhấn', '- nhấn 1 lần: chạy 1→8  
- nhấn 2 lần: chạy 8→1  
- nhấn 3 lần: như nhấn 1…', 'See instructions', '// Write your code here', '{"total":10}', 'https://wokwi.com/projects/new/arduino-uno', 45, 1, unixepoch());
INSERT INTO labs (id, week_id, order_index, title, instructions, wiring, starter_code, rubric, simulator_url, duration, is_published, created_at) VALUES ('lab-05-04', 'week-05', 4, 'Bài 5-4: Hiển thị % pot (00→99) bằng 4 LED 7 đoạn', '', 'See instructions', '// Write your code here', '{"total":10}', 'https://wokwi.com/projects/new/arduino-uno', 45, 1, unixepoch());
INSERT INTO labs (id, week_id, order_index, title, instructions, wiring, starter_code, rubric, simulator_url, duration, is_published, created_at) VALUES ('lab-05-05', 'week-05', 5, 'Bài 5-5: Hiển thị số lần nhấn (00→99) bằng 4 LED 7 đoạn', '', 'See instructions', '// Write your code here', '{"total":10}', 'https://wokwi.com/projects/new/arduino-uno', 45, 1, unixepoch());
INSERT INTO labs (id, week_id, order_index, title, instructions, wiring, starter_code, rubric, simulator_url, duration, is_published, created_at) VALUES ('lab-05-06', 'week-05', 6, 'Bài 5-6: 4 LED 7 đoạn theo nút: nhấn 1 lần đếm tăng 00→99; nhấn 2 lần đếm giảm 99→00', '', 'See instructions', '// Write your code here', '{"total":10}', 'https://wokwi.com/projects/new/arduino-uno', 45, 1, unixepoch());

-- WEEK 6
INSERT INTO weeks (id, course_id, week_number, title, overview, objectives, is_published, created_at) VALUES ('week-06', 'course-tech476', 6, 'Cảm biến trong hệ thống nhúng', '# Cảm biến trong hệ thống nhúng

...', '["Đọc HC-SR04, DHT11, PIR, TTP223.","Điều khiển cảnh báo theo ngưỡng; Serial đúng format."]', 1, unixepoch());
INSERT INTO labs (id, week_id, order_index, title, instructions, wiring, starter_code, rubric, simulator_url, duration, is_published, created_at) VALUES ('lab-06-01', 'week-06', 1, 'Bài 6-1: HC-SR04 + 8 LED chọn chương trình theo khoảng cách', '- <30cm: chương trình 1: chạy led1→led8  
- >80cm: chương trình 2: chạy led8→led1  
- 30–80cm: chương trình 3: bật/tắt 8 led chu kỳ 1s  
Serial: `Khoảng cách __ cm -> Chương trình __`', 'See instructions', '// Write your code here', '{"total":10}', 'https://wokwi.com/projects/new/arduino-uno', 45, 1, unixepoch());
INSERT INTO labs (id, week_id, order_index, title, instructions, wiring, starter_code, rubric, simulator_url, duration, is_published, created_at) VALUES ('lab-06-02', 'week-06', 2, 'Bài 6-2: HC-SR04 cảnh báo màu (xanh/vàng/đỏ)', '- >60cm: an toàn, bật led xanh  
- 30–60cm: cảnh báo, bật led vàng  
- <30cm: nguy hiểm, bật led đỏ  
Serial: `Khoảng cách __ cm. trạng thái an toàn/cảnh báo/nguy hiểm`', 'See instructions', '// Write your code here', '{"total":10}', 'https://wokwi.com/projects/new/arduino-uno', 45, 1, unixepoch());
INSERT INTO labs (id, week_id, order_index, title, instructions, wiring, starter_code, rubric, simulator_url, duration, is_published, created_at) VALUES ('lab-06-03', 'week-06', 3, 'Bài 6-3: HC-SR04 số led bật theo khoảng cách', '- 20cm bật 1 LED  
- mỗi +10cm thêm 1 LED, tối đa 8  
Serial: `Khoảng cách __ cm. Số led bật __`', 'See instructions', '// Write your code here', '{"total":10}', 'https://wokwi.com/projects/new/arduino-uno', 45, 1, unixepoch());
INSERT INTO labs (id, week_id, order_index, title, instructions, wiring, starter_code, rubric, simulator_url, duration, is_published, created_at) VALUES ('lab-06-04', 'week-06', 4, 'Bài 6-4: DHT11 giám sát nhiệt độ/độ ẩm theo ngưỡng', '- 2 dưới ngưỡng → xanh  
- 1 vượt ngưỡng → vàng  
- 2 vượt ngưỡng → đỏ  
Serial: `Nhiệt độ: __ C. Độ ẩm: __ %. Màu led đang bật.`', 'See instructions', '// Write your code here', '{"total":10}', 'https://wokwi.com/projects/new/arduino-uno', 45, 1, unixepoch());
INSERT INTO labs (id, week_id, order_index, title, instructions, wiring, starter_code, rubric, simulator_url, duration, is_published, created_at) VALUES ('lab-06-05', 'week-06', 5, 'Bài 6-5: 2 TTP223 tăng/giảm (0..9) + hiển thị 7 đoạn', '- chạm A tăng, chạm B giảm  
- chặn biên 0..9  
Serial: `Đã chạm cảm biến: __ , tổng số lần chạm: __ lần.`', 'See instructions', '// Write your code here', '{"total":10}', 'https://wokwi.com/projects/new/arduino-uno', 45, 1, unixepoch());
INSERT INTO labs (id, week_id, order_index, title, instructions, wiring, starter_code, rubric, simulator_url, duration, is_published, created_at) VALUES ('lab-06-06', 'week-06', 6, 'Bài 6-6: PIR kích hoạt LED + relay còi', '- Có tín hiệu: `Có di chuyển trong phạm vi giám sát. Kích hoạt báo động`  
- Không: `An toàn`', 'See instructions', '// Write your code here', '{"total":10}', 'https://wokwi.com/projects/new/arduino-uno', 45, 1, unixepoch());

-- WEEK 7
INSERT INTO weeks (id, course_id, week_number, title, overview, objectives, is_published, created_at) VALUES ('week-07', 'course-tech476', 7, 'Serial UART', '# Serial UART

...', '["Hiểu UART, baudrate, Serial Monitor.","Thiết kế lệnh điều khiển đơn giản PC↔Arduino.","(Nâng cao) Arduino↔Arduino."]', 1, unixepoch());

-- WEEK 8
INSERT INTO weeks (id, course_id, week_number, title, overview, objectives, is_published, created_at) VALUES ('week-08', 'course-tech476', 8, 'I2C', '# I2C

...', '["Biết SDA/SCL (Uno: A4/A5).","Quét địa chỉ I2C, dùng LCD1602 I2C.","Uno–Uno I2C Master/Slave."]', 1, unixepoch());

-- WEEK 9
INSERT INTO weeks (id, course_id, week_number, title, overview, objectives, is_published, created_at) VALUES ('week-09', 'course-tech476', 9, 'SPI', '# SPI

- SPI truyền đồng bộ theo xung clock SCK.  
- 1 master điều khiển nhiều slave bằng SS/CS.  
- Ưu/nhược so với I2C (tốc độ vs số dây)....', '["Hiểu SPI: MOSI/MISO/SCK/SS, master–slave, tốc độ.","Điều khiển thiết bị qua SPI (thực tế thường dùng 74HC595 / MAX7219)."]', 1, unixepoch());
INSERT INTO lessons (id, week_id, order_index, title, content, duration, is_published, created_at) VALUES ('lesson-09-01', 'week-09', 1, 'Lý thuyết cốt lõi', '- SPI truyền đồng bộ theo xung clock SCK.  
- 1 master điều khiển nhiều slave bằng SS/CS.  
- Ưu/nhược so với I2C (tốc độ vs số dây).', 30, 1, unixepoch());

-- WEEK 10
INSERT INTO weeks (id, course_id, week_number, title, overview, objectives, is_published, created_at) VALUES ('week-10', 'course-tech476', 10, '1-Wire', '# 1-Wire

...', '["Hiểu 1-Wire: 1 dây data, địa chỉ ROM, nhiều thiết bị chung bus.","Thực hành DS18B20 (phổ biến nhất)."]', 1, unixepoch());

-- WEEK 11
INSERT INTO weeks (id, course_id, week_number, title, overview, objectives, is_published, created_at) VALUES ('week-11', 'course-tech476', 11, 'WiFi WebServer (Cơ bản)', '# WiFi WebServer (Cơ bản)

...', '["Bật/tắt LED từ xa qua mạng LAN bằng webserver cơ bản.","UI đúng tiêu đề + nút theo đề bài.","Arduino Uno **không có WiFi tích hợp**. Để làm WebServer ổn định, khuyến nghị dùng **ESP8266/ESP32**.","Nếu lớp yêu cầu “Uno + module WiFi AT command” thì nội dung sẽ phức tạp hơn."]', 1, unixepoch());
INSERT INTO labs (id, week_id, order_index, title, instructions, wiring, starter_code, rubric, simulator_url, duration, is_published, created_at) VALUES ('lab-11-01', 'week-11', 1, 'Bài 11.1', '- Trang web tiêu đề: `Hệ thống bật / tắt Led – WebServer cấu hình cơ bản`  
- Nút ON và OFF tương ứng trạng thái.', 'See instructions', '// Write your code here', '{"total":10}', 'https://wokwi.com/projects/new/esp32', 45, 1, unixepoch());
INSERT INTO labs (id, week_id, order_index, title, instructions, wiring, starter_code, rubric, simulator_url, duration, is_published, created_at) VALUES ('lab-11-02', 'week-11', 2, 'Bài 11.2', '- Tiêu đề: `Hệ thống bật / tắt 2 Led – WebServer cấu hình cơ bản`  
- Có khu vực LED1 và LED2  
- Nút hiển thị `BAT`/`TAT` đúng trạng thái hiện hành.', 'See instructions', '// Write your code here', '{"total":10}', 'https://wokwi.com/projects/new/esp32', 45, 1, unixepoch());

-- WEEK 12
INSERT INTO weeks (id, course_id, week_number, title, overview, objectives, is_published, created_at) VALUES ('week-12', 'course-tech476', 12, 'WiFi Async WebServer (Không đồng bộ)', '# WiFi Async WebServer (Không đồng bộ)

...', '["Hiểu sync vs async, tối ưu responsiveness.","Làm hệ thống IoT realtime hơn (cơ sở cho dashboard)."]', 1, unixepoch());
INSERT INTO labs (id, week_id, order_index, title, instructions, wiring, starter_code, rubric, simulator_url, duration, is_published, created_at) VALUES ('lab-12-01', 'week-12', 1, 'Bài 12.1', '- Tiêu đề: `Hệ thống bật / tắt Led – WebServer cấu hình không đồng bộ`  
- Nút ON/OFF.', 'See instructions', '// Write your code here', '{"total":10}', 'https://wokwi.com/projects/new/esp32', 45, 1, unixepoch());
INSERT INTO labs (id, week_id, order_index, title, instructions, wiring, starter_code, rubric, simulator_url, duration, is_published, created_at) VALUES ('lab-12-02', 'week-12', 2, 'Bài 12.2', '- Tiêu đề: `Hệ thống bật / tắt 2 Led – WebServer cấu hình không đồng bộ`  
- LED1/LED2; nút `BAT/TAT` theo trạng thái.', 'See instructions', '// Write your code here', '{"total":10}', 'https://wokwi.com/projects/new/esp32', 45, 1, unixepoch());

-- EXAM DRILLS
INSERT INTO exam_drills (id, week_id, title, description, content, sample_solution, simulator_url, difficulty, passing_score, time_limit, is_published, created_at) VALUES 
('drill-01', 'week-01', 'Kiểm tra LED cơ bản', 'Kiểm tra khả năng điều khiển LED của bạn!', 
'## Đề bài

Viết chương trình điều khiển 5 LED (D2-D6):

1. **Phase 1**: Bật tất cả LED trong 2 giây
2. **Phase 2**: Chạy LED từ trái sang phải (mỗi LED sáng 500ms)
3. **Phase 3**: Nháy tất cả LED 3 lần, chu kỳ 1s

**Yêu cầu**:
- Code sạch, có comment
- Sử dụng hàm riêng cho mỗi hiệu ứng
- Chạy vòng lặp vô hạn',
'// Sample solution code', 'https://wokwi.com/projects/new/arduino-uno', 'easy', 60, 30, 1, unixepoch());

