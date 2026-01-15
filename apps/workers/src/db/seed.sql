-- Seed data cho Arduino Learning Hub (Generated Standard)
-- Admin user: admin/admin123
-- Course: TECH476 (12 Weeks)

-- ==========================================
-- CLEAR OLD DATA
-- ==========================================
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

-- ==========================================
-- USERS
-- ==========================================
INSERT INTO users (id, username, password_hash, role, display_name, created_at, updated_at) VALUES 
('admin-001', 'admin', 'pbkdf2$100000$c2FsdF9hZG1pbl90ZXN0$WkYxR2FEbG1iSEZ3WVhOemQyOXlaQT09', 'admin', 'Administrator', unixepoch(), unixepoch()),
('student-001', 'sinhvien', 'pbkdf2$100000$c2FsdF9zdHVkZW50X3Rlc3Q$dGVzdHBhc3N3b3JkMTIz', 'student', 'Nguyen Hoang Long', unixepoch(), unixepoch());

-- ==========================================
-- COURSE
-- ==========================================
INSERT INTO courses (id, code, title, description, total_weeks, is_published, created_at) VALUES 
('course-tech476', 'TECH476', 'Lập trình hệ thống nhúng & IoT', 'Khóa học Arduino Uno 12 tuần: Từ cơ bản đến IoT. Học lý thuyết, thực hành simulator, và làm dự án thực tế.', 12, 1, unixepoch());

-- ==========================================
-- WEEKS (1-12)
-- ==========================================
INSERT INTO weeks (id, course_id, week_number, title, overview, objectives, exam_checklist, is_published, created_at) VALUES 
('week-01', 'course-tech476', 1, 'Tổng quan HT nhúng & GPIO', '# Tuần 1: Tổng quan & GPIO\n\n## Mục tiêu\n- Hiểu hệ thống nhúng và vai trò MCU.\n- Dùng GPIO điều khiển LED blink và running LED.\n- Rèn tư duy vòng lặp và thời gian.', '["Hiểu cấu trúc Arduino","Điều khiển LED cơ bản","Sử dụng vòng lặp for"]', '["Viết code Blink","Debug lỗi thiếu điện trở","Giải thích setup/loop"]', 1, unixepoch());
INSERT INTO weeks (id, course_id, week_number, title, overview, objectives, exam_checklist, is_published, created_at) VALUES 
('week-02', 'course-tech476', 2, 'Thiết kế HT nhúng & LED 7 đoạn', '# Tuần 2: LED 7 đoạn & Tư duy thiết kế\n\n## Mục tiêu\n- Hiểu tư duy Top-Down, Bottom-Up.\n- Điều khiển LED 7 đoạn đơn và module 4 số (multiplexing).', '["Hiểu nguyên lý Multiplexing","Hiển thị số trên 7-seg","Tạo bảng mã LED 7 đoạn"]', '["Viết hàm hiển thị số","Giải thích hiện tượng lưu ảnh (POV)"]', 1, unixepoch());
INSERT INTO weeks (id, course_id, week_number, title, overview, objectives, exam_checklist, is_published, created_at) VALUES 
('week-03', 'course-tech476', 3, 'Input & Keypad', '# Tuần 3: Nút nhấn & Keypad\n\n## Mục tiêu\n- Đọc nút nhấn & chống dội (debounce).\n- Đếm số lần nhấn (edge detection).\n- Giao tiếp Keypad 4x4.', '["Sử dụng INPUT_PULLUP","Xử lý Debounce","Đọc dữ liệu Keypad"]', '["Phân biệt Edge vs Level","Viết code nhập mật khẩu"]', 1, unixepoch());
INSERT INTO weeks (id, course_id, week_number, title, overview, objectives, exam_checklist, is_published, created_at) VALUES 
('week-04', 'course-tech476', 4, 'Analog I/O (ADC & PWM)', '# Tuần 4: Analog & PWM\n\n## Mục tiêu\n- Đọc biến trở (ADC).\n- Điều khiển độ sáng LED (PWM).\n- Điều khiển LED bằng biến trở.', '["Đọc giá trị Analog","Sử dụng PWM","Chuyển đổi thang đo (map)"]', '["Tính điện áp từ giá trị ADC","Giải thích Duty Cycle"]', 1, unixepoch());
INSERT INTO weeks (id, course_id, week_number, title, overview, objectives, exam_checklist, is_published, created_at) VALUES 
('week-05', 'course-tech476', 5, 'Thực hành tích hợp I/O', '# Tuần 5: Tích hợp hệ thống\n\n## Mục tiêu\n- Kết hợp Analog + Digital + Hiển thị (7-seg).\n- Viết code theo module (State Machine cơ bản).', '["Kết hợp nhiều IO","Tư duy State Machine","Quản lý thời gian với millis"]', '["Thiết kế Flowchart tổng hợp","Viết code đa nhiệm đơn giản"]', 1, unixepoch());
INSERT INTO weeks (id, course_id, week_number, title, overview, objectives, exam_checklist, is_published, created_at) VALUES 
('week-06', 'course-tech476', 6, 'Cảm biến (Sensors)', '# Tuần 6: Cảm biến\n\n## Mục tiêu\n- Đọc cảm biến siêu âm (HC-SR04), Nhiệt ẩm (DHT11), Chuyển động (PIR).\n- Xử lý tín hiệu theo ngưỡng.', '["Đo khoảng cách HC-SR04","Đọc nhiệt độ DHT11","Xử lý tín hiệu cảm biến"]', '["Viết logic cảnh báo theo ngưỡng","In giá trị cảm biến ra Serial"]', 1, unixepoch());
INSERT INTO weeks (id, course_id, week_number, title, overview, objectives, exam_checklist, is_published, created_at) VALUES 
('week-07', 'course-tech476', 7, 'Giao tiếp Serial (UART)', '# Tuần 7: UART\n\n## Mục tiêu\n- Hiểu giao thức UART.\n- Giao tiếp PC <-> Arduino.\n- Giao tiếp 2 board Arduino.', '["Gửi nhận dữ liệu Serial","Tạo giao thức lệnh đơn giản","Debug qua Serial Monitor"]', '["Xử lý chuỗi từ Serial","Điều khiển thiết bị qua lệnh text"]', 1, unixepoch());
INSERT INTO weeks (id, course_id, week_number, title, overview, objectives, exam_checklist, is_published, created_at) VALUES 
('week-08', 'course-tech476', 8, 'Giao tiếp I2C & LCD', '# Tuần 8: I2C\n\n## Mục tiêu\n- Hiểu Bus I2C (SDA/SCL).\n- Sử dụng LCD 1602 I2C.\n- Giao tiếp Master-Slave.', '["Quét địa chỉ I2C","Hiển thị lên LCD I2C","Giao tiếp 2 Arduino qua I2C"]', '["Viết hàm hiển thị LCD","Giải thích SDA/SCL"]', 1, unixepoch());
INSERT INTO weeks (id, course_id, week_number, title, overview, objectives, exam_checklist, is_published, created_at) VALUES 
('week-09', 'course-tech476', 9, 'Giao tiếp SPI', '# Tuần 9: SPI\n\n## Mục tiêu\n- Hiểu giao thức SPI (MOSI/MISO/SCK/SS).\n- Điều khiển Shift Register (74HC595) hoặc LED Matrix.', '["Kết nối thiết bị SPI","Sử dụng thư viện SPI","Điều khiển 74HC595"]', '["Phân biệt SPI và I2C","Giải thích các chân SPI"]', 1, unixepoch());
INSERT INTO weeks (id, course_id, week_number, title, overview, objectives, exam_checklist, is_published, created_at) VALUES 
('week-10', 'course-tech476', 10, 'Giao tiếp 1-Wire', '# Tuần 10: 1-Wire\n\n## Mục tiêu\n- Hiểu giao thức 1-Wire.\n- Đọc cảm biến nhiệt độ DS18B20.', '["Đọc nhiệt độ DS18B20","Hiểu cơ chế 1-Wire","Kết nối đa điểm"]', '["Lấy địa chỉ thiết bị 1-Wire","Đọc dữ liệu chính xác"]', 1, unixepoch());
INSERT INTO weeks (id, course_id, week_number, title, overview, objectives, exam_checklist, is_published, created_at) VALUES 
('week-11', 'course-tech476', 11, 'WiFi & WebServer (Cơ bản)', '# Tuần 11: WiFi Basic\n\n## Mục tiêu\n- Kết nối WiFi (ESP8266/ESP32).\n- Tạo WebServer cơ bản điều khiển LED.', '["Kết nối WiFi","Tạo WebServer bật/tắt LED","Tùy biến giao diện HTML"]', '["Giải thích Client/Server","Xử lý GET Request"]', 1, unixepoch());
INSERT INTO weeks (id, course_id, week_number, title, overview, objectives, exam_checklist, is_published, created_at) VALUES 
('week-12', 'course-tech476', 12, 'Async WebServer & IoT Project', '# Tuần 12: Async WebServer & IoT\n\n## Mục tiêu\n- Sử dụng AsyncWebServer (không chặn).\n- Cập nhật trạng thái AJAX/Fetch API.', '["Tạo Async WebServer","Cập nhật UI không reload","Xây dựng API trả về JSON"]', '["So sánh Sync vs Async Server","Thiết kế hệ thống IoT hoàn chỉnh"]', 1, unixepoch());

-- ==========================================
-- LESSONS
-- ==========================================
INSERT INTO lessons (id, week_id, order_index, title, content, duration, is_published, created_at) VALUES ('lesson-01-01', 'week-01', 1, 'Hệ thống nhúng là gì?', '# Hệ thống nhúng (Embedded Systems)

Khái niệm hệ thống nhúng: thiết bị điện tử chuyên nhiệm, chạy nhiệm vụ cụ thể, tài nguyên hạn chế.', 20, 1, unixepoch());
INSERT INTO lessons (id, week_id, order_index, title, content, duration, is_published, created_at) VALUES ('lesson-01-02', 'week-01', 2, 'GPIO: Output', '# Digital Output

- pinMode(pin, OUTPUT)
- digitalWrite(pin, HIGH/LOW)', 20, 1, unixepoch());
INSERT INTO lessons (id, week_id, order_index, title, content, duration, is_published, created_at) VALUES ('lesson-02-01', 'week-02', 1, 'Tư duy thiết kế', '# Top-Down vs Bottom-Up', 20, 1, unixepoch());
INSERT INTO lessons (id, week_id, order_index, title, content, duration, is_published, created_at) VALUES ('lesson-02-02', 'week-02', 2, 'LED 7 đoạn', '# Multiplexing', 20, 1, unixepoch());
INSERT INTO lessons (id, week_id, order_index, title, content, duration, is_published, created_at) VALUES ('lesson-03-01', 'week-03', 1, 'Input & INPUT_PULLUP', '# Digital Input', 20, 1, unixepoch());
INSERT INTO lessons (id, week_id, order_index, title, content, duration, is_published, created_at) VALUES ('lesson-03-02', 'week-03', 2, 'Debounce (Chống dội)', '# Debounce Logic', 20, 1, unixepoch());
INSERT INTO lessons (id, week_id, order_index, title, content, duration, is_published, created_at) VALUES ('lesson-04-01', 'week-04', 1, 'ADC (Analog to Digital)', '# ADC Converter', 20, 1, unixepoch());
INSERT INTO lessons (id, week_id, order_index, title, content, duration, is_published, created_at) VALUES ('lesson-04-02', 'week-04', 2, 'PWM (Pulse Width Modulation)', '# PWM Control', 20, 1, unixepoch());
INSERT INTO lessons (id, week_id, order_index, title, content, duration, is_published, created_at) VALUES ('lesson-05-01', 'week-05', 1, 'Tư duy Module hóa', '# Functions', 20, 1, unixepoch());
INSERT INTO lessons (id, week_id, order_index, title, content, duration, is_published, created_at) VALUES ('lesson-05-02', 'week-05', 2, 'Tránh delay()', '# Millis()', 20, 1, unixepoch());
INSERT INTO lessons (id, week_id, order_index, title, content, duration, is_published, created_at) VALUES ('lesson-06-01', 'week-06', 1, 'Cảm biến siêu âm HC-SR04', '# HC-SR04', 20, 1, unixepoch());
INSERT INTO lessons (id, week_id, order_index, title, content, duration, is_published, created_at) VALUES ('lesson-06-02', 'week-06', 2, 'Nhiệt độ & Độ ẩm DHT11', '# DHT11', 20, 1, unixepoch());
INSERT INTO lessons (id, week_id, order_index, title, content, duration, is_published, created_at) VALUES ('lesson-07-01', 'week-07', 1, 'Giao thức UART', '# UART Serial', 20, 1, unixepoch());
INSERT INTO lessons (id, week_id, order_index, title, content, duration, is_published, created_at) VALUES ('lesson-07-02', 'week-07', 2, 'Xử lý chuỗi Serial', '# Serial Parsing', 20, 1, unixepoch());
INSERT INTO lessons (id, week_id, order_index, title, content, duration, is_published, created_at) VALUES ('lesson-08-01', 'week-08', 1, 'Giao thức I2C', '# I2C Bus', 20, 1, unixepoch());
INSERT INTO lessons (id, week_id, order_index, title, content, duration, is_published, created_at) VALUES ('lesson-08-02', 'week-08', 2, 'LCD 1602 I2C', '# LCD Display', 20, 1, unixepoch());
INSERT INTO lessons (id, week_id, order_index, title, content, duration, is_published, created_at) VALUES ('lesson-09-01', 'week-09', 1, 'Giao thức SPI', '# SPI Bus', 20, 1, unixepoch());
INSERT INTO lessons (id, week_id, order_index, title, content, duration, is_published, created_at) VALUES ('lesson-09-02', 'week-09', 2, 'Shift Register 74HC595', '# 74HC595 IC', 20, 1, unixepoch());
INSERT INTO lessons (id, week_id, order_index, title, content, duration, is_published, created_at) VALUES ('lesson-10-01', 'week-10', 1, 'Giao thức 1-Wire', '# OneWire Bus', 20, 1, unixepoch());
INSERT INTO lessons (id, week_id, order_index, title, content, duration, is_published, created_at) VALUES ('lesson-10-02', 'week-10', 2, 'DS18B20 Temp Sensor', '# DS18B20 Sensor', 20, 1, unixepoch());
INSERT INTO lessons (id, week_id, order_index, title, content, duration, is_published, created_at) VALUES ('lesson-11-01', 'week-11', 1, 'ESP8266/ESP32 Intro', '# ESP Platform', 20, 1, unixepoch());
INSERT INTO lessons (id, week_id, order_index, title, content, duration, is_published, created_at) VALUES ('lesson-11-02', 'week-11', 2, 'Simple WebServer', '# HTTP Server', 20, 1, unixepoch());
INSERT INTO lessons (id, week_id, order_index, title, content, duration, is_published, created_at) VALUES ('lesson-12-01', 'week-12', 1, 'Async WebServer', '# ESPAsyncWebServer', 20, 1, unixepoch());
INSERT INTO lessons (id, week_id, order_index, title, content, duration, is_published, created_at) VALUES ('lesson-12-02', 'week-12', 2, 'AJAX & Fetch API', '# Fetch API', 20, 1, unixepoch());

-- ==========================================
-- LABS
-- ==========================================
INSERT INTO labs (id, week_id, order_index, title, objective, instructions, wiring, starter_code, solution_code, rubric, simulator_url, duration, is_published, created_at) VALUES ('lab-01-01', 'week-01', 1, 'Blink 3 quy luật', 'Objective', '# Instructions', 'Wiring', '// Starter Code', '// Solution', '{"total":10}', 'https://wokwi.com/projects/new/arduino-uno', 45, 1, unixepoch());
INSERT INTO labs (id, week_id, order_index, title, objective, instructions, wiring, starter_code, solution_code, rubric, simulator_url, duration, is_published, created_at) VALUES ('lab-02-01', 'week-02', 1, 'LED 7 đoạn cơ bản', 'Objective', '# Instructions', 'Wiring', '// Starter Code', '// Solution', '{"total":10}', 'https://wokwi.com/projects/new/arduino-uno', 45, 1, unixepoch());
INSERT INTO labs (id, week_id, order_index, title, objective, instructions, wiring, starter_code, solution_code, rubric, simulator_url, duration, is_published, created_at) VALUES ('lab-03-01', 'week-03', 1, 'Nút nhấn & LED', 'Objective', '# Instructions', 'Wiring', '// Starter Code', '// Solution', '{"total":10}', 'https://wokwi.com/projects/new/arduino-uno', 45, 1, unixepoch());
INSERT INTO labs (id, week_id, order_index, title, objective, instructions, wiring, starter_code, solution_code, rubric, simulator_url, duration, is_published, created_at) VALUES ('lab-04-01', 'week-04', 1, 'Đọc biến trở', 'Objective', '# Instructions', 'Wiring', '// Starter Code', '// Solution', '{"total":10}', 'https://wokwi.com/projects/new/arduino-uno', 45, 1, unixepoch());
INSERT INTO labs (id, week_id, order_index, title, objective, instructions, wiring, starter_code, solution_code, rubric, simulator_url, duration, is_published, created_at) VALUES ('lab-05-01', 'week-05', 1, 'Đèn giao thông (millis)', 'Objective', '# Instructions', 'Wiring', '// Starter Code', '// Solution', '{"total":10}', 'https://wokwi.com/projects/new/arduino-uno', 45, 1, unixepoch());
INSERT INTO labs (id, week_id, order_index, title, objective, instructions, wiring, starter_code, solution_code, rubric, simulator_url, duration, is_published, created_at) VALUES ('lab-06-01', 'week-06', 1, 'Cảm biến khoảng cách', 'Objective', '# Instructions', 'Wiring', '// Starter Code', '// Solution', '{"total":10}', 'https://wokwi.com/projects/new/arduino-uno', 45, 1, unixepoch());
INSERT INTO labs (id, week_id, order_index, title, objective, instructions, wiring, starter_code, solution_code, rubric, simulator_url, duration, is_published, created_at) VALUES ('lab-07-01', 'week-07', 1, 'Serial Command', 'Objective', '# Instructions', 'Wiring', '// Starter Code', '// Solution', '{"total":10}', 'https://wokwi.com/projects/new/arduino-uno', 45, 1, unixepoch());
INSERT INTO labs (id, week_id, order_index, title, objective, instructions, wiring, starter_code, solution_code, rubric, simulator_url, duration, is_published, created_at) VALUES ('lab-08-01', 'week-08', 1, 'LCD Hello World', 'Objective', '# Instructions', 'Wiring', '// Starter Code', '// Solution', '{"total":10}', 'https://wokwi.com/projects/new/arduino-uno', 45, 1, unixepoch());
INSERT INTO labs (id, week_id, order_index, title, objective, instructions, wiring, starter_code, solution_code, rubric, simulator_url, duration, is_published, created_at) VALUES ('lab-09-01', 'week-09', 1, 'Shift Register LED', 'Objective', '# Instructions', 'Wiring', '// Starter Code', '// Solution', '{"total":10}', 'https://wokwi.com/projects/new/arduino-uno', 45, 1, unixepoch());
INSERT INTO labs (id, week_id, order_index, title, objective, instructions, wiring, starter_code, solution_code, rubric, simulator_url, duration, is_published, created_at) VALUES ('lab-10-01', 'week-10', 1, 'Đọc nhiệt độ DS18B20', 'Objective', '# Instructions', 'Wiring', '// Starter Code', '// Solution', '{"total":10}', 'https://wokwi.com/projects/new/arduino-uno', 45, 1, unixepoch());
INSERT INTO labs (id, week_id, order_index, title, objective, instructions, wiring, starter_code, solution_code, rubric, simulator_url, duration, is_published, created_at) VALUES ('lab-11-01', 'week-11', 1, 'WiFi Connect', 'Objective', '# Instructions', 'Wiring', '// Starter Code', '// Solution', '{"total":10}', 'https://wokwi.com/projects/new/esp32', 45, 1, unixepoch());
INSERT INTO labs (id, week_id, order_index, title, objective, instructions, wiring, starter_code, solution_code, rubric, simulator_url, duration, is_published, created_at) VALUES ('lab-12-01', 'week-12', 1, 'IoT Dashboard', 'Objective', '# Instructions', 'Wiring', '// Starter Code', '// Solution', '{"total":10}', 'https://wokwi.com/projects/new/esp32', 45, 1, unixepoch());

-- ==========================================
-- QUIZZES
-- ==========================================
INSERT INTO quizzes (id, week_id, title, description, time_limit, passing_score, is_published, created_at) VALUES ('quiz-01', 'week-01', 'Quiz Week 01', 'Test knowledge', 15, 60, 1, unixepoch());
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('q-01-01', 'quiz-01', 1, 'single', 'Question 1 for Week 01?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('q-01-02', 'quiz-01', 2, 'single', 'Question 2 for Week 01?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('q-01-03', 'quiz-01', 3, 'single', 'Question 3 for Week 01?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('q-01-04', 'quiz-01', 4, 'single', 'Question 4 for Week 01?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('q-01-05', 'quiz-01', 5, 'single', 'Question 5 for Week 01?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());
INSERT INTO quizzes (id, week_id, title, description, time_limit, passing_score, is_published, created_at) VALUES ('quiz-02', 'week-02', 'Quiz Week 02', 'Test knowledge', 15, 60, 1, unixepoch());
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('q-02-01', 'quiz-02', 1, 'single', 'Question 1 for Week 02?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('q-02-02', 'quiz-02', 2, 'single', 'Question 2 for Week 02?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('q-02-03', 'quiz-02', 3, 'single', 'Question 3 for Week 02?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('q-02-04', 'quiz-02', 4, 'single', 'Question 4 for Week 02?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('q-02-05', 'quiz-02', 5, 'single', 'Question 5 for Week 02?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());
INSERT INTO quizzes (id, week_id, title, description, time_limit, passing_score, is_published, created_at) VALUES ('quiz-03', 'week-03', 'Quiz Week 03', 'Test knowledge', 15, 60, 1, unixepoch());
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('q-03-01', 'quiz-03', 1, 'single', 'Question 1 for Week 03?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('q-03-02', 'quiz-03', 2, 'single', 'Question 2 for Week 03?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('q-03-03', 'quiz-03', 3, 'single', 'Question 3 for Week 03?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('q-03-04', 'quiz-03', 4, 'single', 'Question 4 for Week 03?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('q-03-05', 'quiz-03', 5, 'single', 'Question 5 for Week 03?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());
INSERT INTO quizzes (id, week_id, title, description, time_limit, passing_score, is_published, created_at) VALUES ('quiz-04', 'week-04', 'Quiz Week 04', 'Test knowledge', 15, 60, 1, unixepoch());
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('q-04-01', 'quiz-04', 1, 'single', 'Question 1 for Week 04?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('q-04-02', 'quiz-04', 2, 'single', 'Question 2 for Week 04?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('q-04-03', 'quiz-04', 3, 'single', 'Question 3 for Week 04?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('q-04-04', 'quiz-04', 4, 'single', 'Question 4 for Week 04?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('q-04-05', 'quiz-04', 5, 'single', 'Question 5 for Week 04?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());
INSERT INTO quizzes (id, week_id, title, description, time_limit, passing_score, is_published, created_at) VALUES ('quiz-05', 'week-05', 'Quiz Week 05', 'Test knowledge', 15, 60, 1, unixepoch());
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('q-05-01', 'quiz-05', 1, 'single', 'Question 1 for Week 05?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('q-05-02', 'quiz-05', 2, 'single', 'Question 2 for Week 05?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('q-05-03', 'quiz-05', 3, 'single', 'Question 3 for Week 05?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('q-05-04', 'quiz-05', 4, 'single', 'Question 4 for Week 05?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('q-05-05', 'quiz-05', 5, 'single', 'Question 5 for Week 05?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());
INSERT INTO quizzes (id, week_id, title, description, time_limit, passing_score, is_published, created_at) VALUES ('quiz-06', 'week-06', 'Quiz Week 06', 'Test knowledge', 15, 60, 1, unixepoch());
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('q-06-01', 'quiz-06', 1, 'single', 'Question 1 for Week 06?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('q-06-02', 'quiz-06', 2, 'single', 'Question 2 for Week 06?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('q-06-03', 'quiz-06', 3, 'single', 'Question 3 for Week 06?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('q-06-04', 'quiz-06', 4, 'single', 'Question 4 for Week 06?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('q-06-05', 'quiz-06', 5, 'single', 'Question 5 for Week 06?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());
INSERT INTO quizzes (id, week_id, title, description, time_limit, passing_score, is_published, created_at) VALUES ('quiz-07', 'week-07', 'Quiz Week 07', 'Test knowledge', 15, 60, 1, unixepoch());
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('q-07-01', 'quiz-07', 1, 'single', 'Question 1 for Week 07?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('q-07-02', 'quiz-07', 2, 'single', 'Question 2 for Week 07?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('q-07-03', 'quiz-07', 3, 'single', 'Question 3 for Week 07?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('q-07-04', 'quiz-07', 4, 'single', 'Question 4 for Week 07?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('q-07-05', 'quiz-07', 5, 'single', 'Question 5 for Week 07?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());
INSERT INTO quizzes (id, week_id, title, description, time_limit, passing_score, is_published, created_at) VALUES ('quiz-08', 'week-08', 'Quiz Week 08', 'Test knowledge', 15, 60, 1, unixepoch());
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('q-08-01', 'quiz-08', 1, 'single', 'Question 1 for Week 08?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('q-08-02', 'quiz-08', 2, 'single', 'Question 2 for Week 08?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('q-08-03', 'quiz-08', 3, 'single', 'Question 3 for Week 08?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('q-08-04', 'quiz-08', 4, 'single', 'Question 4 for Week 08?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('q-08-05', 'quiz-08', 5, 'single', 'Question 5 for Week 08?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());
INSERT INTO quizzes (id, week_id, title, description, time_limit, passing_score, is_published, created_at) VALUES ('quiz-09', 'week-09', 'Quiz Week 09', 'Test knowledge', 15, 60, 1, unixepoch());
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('q-09-01', 'quiz-09', 1, 'single', 'Question 1 for Week 09?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('q-09-02', 'quiz-09', 2, 'single', 'Question 2 for Week 09?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('q-09-03', 'quiz-09', 3, 'single', 'Question 3 for Week 09?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('q-09-04', 'quiz-09', 4, 'single', 'Question 4 for Week 09?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('q-09-05', 'quiz-09', 5, 'single', 'Question 5 for Week 09?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());
INSERT INTO quizzes (id, week_id, title, description, time_limit, passing_score, is_published, created_at) VALUES ('quiz-10', 'week-10', 'Quiz Week 10', 'Test knowledge', 15, 60, 1, unixepoch());
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('q-10-01', 'quiz-10', 1, 'single', 'Question 1 for Week 10?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('q-10-02', 'quiz-10', 2, 'single', 'Question 2 for Week 10?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('q-10-03', 'quiz-10', 3, 'single', 'Question 3 for Week 10?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('q-10-04', 'quiz-10', 4, 'single', 'Question 4 for Week 10?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('q-10-05', 'quiz-10', 5, 'single', 'Question 5 for Week 10?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());
INSERT INTO quizzes (id, week_id, title, description, time_limit, passing_score, is_published, created_at) VALUES ('quiz-11', 'week-11', 'Quiz Week 11', 'Test knowledge', 15, 60, 1, unixepoch());
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('q-11-01', 'quiz-11', 1, 'single', 'Question 1 for Week 11?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('q-11-02', 'quiz-11', 2, 'single', 'Question 2 for Week 11?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('q-11-03', 'quiz-11', 3, 'single', 'Question 3 for Week 11?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('q-11-04', 'quiz-11', 4, 'single', 'Question 4 for Week 11?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('q-11-05', 'quiz-11', 5, 'single', 'Question 5 for Week 11?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());
INSERT INTO quizzes (id, week_id, title, description, time_limit, passing_score, is_published, created_at) VALUES ('quiz-12', 'week-12', 'Quiz Week 12', 'Test knowledge', 15, 60, 1, unixepoch());
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('q-12-01', 'quiz-12', 1, 'single', 'Question 1 for Week 12?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('q-12-02', 'quiz-12', 2, 'single', 'Question 2 for Week 12?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('q-12-03', 'quiz-12', 3, 'single', 'Question 3 for Week 12?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('q-12-04', 'quiz-12', 4, 'single', 'Question 4 for Week 12?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('q-12-05', 'quiz-12', 5, 'single', 'Question 5 for Week 12?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());
-- ==========================================
-- EXAM DRILLS (Seed Data)
-- ==========================================
INSERT INTO exam_drills (id, week_id, title, description, time_limit, content, simulator_url, difficulty, passing_score, is_published, created_at) VALUES 
('drill-01', 'week-04', 'Mid-term Challenge: Smart Traffic Light', 'Thiết kế hệ thống đèn giao thông thông minh có nút nhấn cho người đi bộ.', 60, 
'<h1>Đề bài: Đèn Giao Thông Thông Minh</h1>
<p>Bạn hãy thiết kế hệ thống đèn giao thông tại ngã tư với yêu cầu sau:</p>
<ul>
    <li>3 LED: Đỏ (D13), Vàng (D12), Xanh (D11).</li>
    <li>1 Nút nhấn (D2): Dành cho người đi bộ qua đường.</li>
</ul>
<h3>Yêu cầu hoạt động:</h3>
<ol>
    <li>Mặc định: Đèn Xanh sáng, các đèn khác tắt.</li>
    <li>Khi nhấn nút:
        <ul>
            <li>Đèn Xanh tắt, Đèn Vàng nhấp nháy 3 giây.</li>
            <li>Đèn Đỏ sáng 10 giây (để người đi bộ qua đường).</li>
            <li>Sau đó quay lại trạng thái Đèn Xanh.</li>
        </ul>
    </li>
</ol>
<p><strong>Lưu ý:</strong> Sử dụng <code>millis()</code> để quản lý thời gian, không dùng <code>delay()</code> chặn nút nhấn.</p>',
'https://wokwi.com/projects/new/arduino-uno', 'hard', 70, 1, unixepoch());
