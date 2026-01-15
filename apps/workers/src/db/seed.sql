-- Seed data cho Arduino Learning Hub (Real Data from noidunghoc.md)
-- Admin user: admin/admin123
-- Course: TECH476 (12 Weeks)

-- ==========================================
-- CLEAR OLD DATA (để seed lại không bị lỗi UNIQUE)
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

-- WEEK 1
INSERT INTO weeks (id, course_id, week_number, title, overview, objectives, exam_checklist, is_published, created_at) VALUES 
('week-01', 'course-tech476', 1, 'Tổng quan HT nhúng & GPIO', 
'# Tuần 1: Tổng quan & GPIO\n\n## Mục tiêu\n- Hiểu hệ thống nhúng và vai trò MCU.\n- Dùng GPIO điều khiển LED blink và running LED.\n- Rèn tư duy vòng lặp và thời gian.\n\n## Lý thuyết cốt lõi\n- `pinMode`, `digitalWrite`, `delay`\n- Cấu trúc chương trình: setup, loop', 
'["Hiểu cấu trúc Arduino","Điều khiển LED cơ bản","Sử dụng vòng lặp for"]', 
'["Viết code Blink","Debug lỗi thiếu điện trở","Giải thích setup/loop"]', 1, unixepoch());

-- WEEK 2
INSERT INTO weeks (id, course_id, week_number, title, overview, objectives, exam_checklist, is_published, created_at) VALUES 
('week-02', 'course-tech476', 2, 'Thiết kế HT nhúng & LED 7 đoạn', 
'# Tuần 2: LED 7 đoạn & Tư duy thiết kế\n\n## Mục tiêu\n- Hiểu tư duy Top-Down, Bottom-Up.\n- Điều khiển LED 7 đoạn đơn và module 4 số (multiplexing).\n- Sử dụng 74HC595 (nếu có).\n\n## Lý thuyết cốt lõi\n- Multiplexing (quét led)\n- Mảng mã 7 đoạn (lookup table)', 
'["Hiểu nguyên lý Multiplexing","Hiển thị số trên 7-seg","Tạo bảng mã LED 7 đoạn"]', 
'["Viết hàm hiển thị số","Giải thích hiện tượng lưu ảnh (POV)"]', 1, unixepoch());

-- WEEK 3
INSERT INTO weeks (id, course_id, week_number, title, overview, objectives, exam_checklist, is_published, created_at) VALUES 
('week-03', 'course-tech476', 3, 'Input & Keypad', 
'# Tuần 3: Nút nhấn & Keypad\n\n## Mục tiêu\n- Đọc nút nhấn & chống dội (debounce).\n- Đếm số lần nhấn (edge detection).\n- Giao tiếp Keypad 4x4.\n\n## Lý thuyết cốt lõi\n- `INPUT_PULLUP`\n- Debounce logic\n- Ma trận phím (Matrix scanning)', 
'["Sử dụng INPUT_PULLUP","Xử lý Debounce","Đọc dữ liệu Keypad"]', 
'["Phân biệt Edge vs Level","Viết code nhập mật khẩu"]', 1, unixepoch());

-- WEEK 4
INSERT INTO weeks (id, course_id, week_number, title, overview, objectives, exam_checklist, is_published, created_at) VALUES 
('week-04', 'course-tech476', 4, 'Analog I/O (ADC & PWM)', 
'# Tuần 4: Analog & PWM\n\n## Mục tiêu\n- Đọc biến trở (ADC).\n- Điều khiển độ sáng LED (PWM).\n- Điều khiển LED bằng biến trở.\n\n## Lý thuyết cốt lõi\n- ADC 10-bit (0-1023)\n- PWM 8-bit (0-255)\n- Hàm `map()`', 
'["Đọc giá trị Analog","Sử dụng PWM","Chuyển đổi thang đo (map)"]', 
'["Tính điện áp từ giá trị ADC","Giải thích Duty Cycle"]', 1, unixepoch());

-- WEEK 5
INSERT INTO weeks (id, course_id, week_number, title, overview, objectives, exam_checklist, is_published, created_at) VALUES 
('week-05', 'course-tech476', 5, 'Thực hành tích hợp I/O', 
'# Tuần 5: Tích hợp hệ thống\n\n## Mục tiêu\n- Kết hợp Analog + Digital + Hiển thị (7-seg).\n- Viết code theo module (State Machine cơ bản).\n- Tránh sử dụng `delay()` dài.\n\n## Bài tập\n- Điều khiển hệ thống đèn theo biến trở\n- Đếm số lần nhấn nút hiển thị lên 7-seg', 
'["Kết hợp nhiều IO","Tư duy State Machine","Quản lý thời gian với millis"]', 
'["Thiết kế Flowchart tổng hợp","Viết code đa nhiệm đơn giản"]', 1, unixepoch());

-- WEEK 6
INSERT INTO weeks (id, course_id, week_number, title, overview, objectives, exam_checklist, is_published, created_at) VALUES 
('week-06', 'course-tech476', 6, 'Cảm biến (Sensors)', 
'# Tuần 6: Cảm biến\n\n## Mục tiêu\n- Đọc cảm biến siêu âm (HC-SR04), Nhiệt ẩm (DHT11), Chuyển động (PIR).\n- Xử lý tín hiệu theo ngưỡng.\n\n## Lý thuyết\n- Nguyên lý đo khoảng cách siêu âm\n- Thư viện cảm biến', 
'["Đo khoảng cách HC-SR04","Đọc nhiệt độ DHT11","Xử lý tín hiệu cảm biến"]', 
'["Viết logic cảnh báo theo ngưỡng","In giá trị cảm biến ra Serial"]', 1, unixepoch());

-- WEEK 7
INSERT INTO weeks (id, course_id, week_number, title, overview, objectives, exam_checklist, is_published, created_at) VALUES 
('week-07', 'course-tech476', 7, 'Giao tiếp Serial (UART)', 
'# Tuần 7: UART\n\n## Mục tiêu\n- Hiểu giao thức UART.\n- Giao tiếp PC <-> Arduino.\n- Giao tiếp 2 board Arduino.\n\n## Lý thuyết\n- Baudrate\n- ASCII\n- Serial Buffer', 
'["Gửi nhận dữ liệu Serial","Tạo giao thức lệnh đơn giản","Debug qua Serial Monitor"]', 
'["Xử lý chuỗi từ Serial","Điều khiển thiết bị qua lệnh text"]', 1, unixepoch());

-- WEEK 8
INSERT INTO weeks (id, course_id, week_number, title, overview, objectives, exam_checklist, is_published, created_at) VALUES 
('week-08', 'course-tech476', 8, 'Giao tiếp I2C & LCD', 
'# Tuần 8: I2C\n\n## Mục tiêu\n- Hiểu Bus I2C (SDA/SCL).\n- Sử dụng LCD 1602 I2C.\n- Giao tiếp Master-Slave.\n\n## Lý thuyết\n- Địa chỉ I2C\n- Pull-up resistor I2C', 
'["Quét địa chỉ I2C","Hiển thị lên LCD I2C","Giao tiếp 2 Arduino qua I2C"]', 
'["Viết hàm hiển thị LCD","Giải thích SDA/SCL"]', 1, unixepoch());

-- WEEK 9
INSERT INTO weeks (id, course_id, week_number, title, overview, objectives, exam_checklist, is_published, created_at) VALUES 
('week-09', 'course-tech476', 9, 'Giao tiếp SPI', 
'# Tuần 9: SPI\n\n## Mục tiêu\n- Hiểu giao thức SPI (MOSI/MISO/SCK/SS).\n- Điều khiển Shift Register (74HC595) hoặc LED Matrix.\n\n## Lý thuyết\n- Master/Slave SPI\n- Clock polarity/phase', 
'["Kết nối thiết bị SPI","Sử dụng thư viện SPI","Điều khiển 74HC595"]', 
'["Phân biệt SPI và I2C","Giải thích các chân SPI"]', 1, unixepoch());

-- WEEK 10
INSERT INTO weeks (id, course_id, week_number, title, overview, objectives, exam_checklist, is_published, created_at) VALUES 
('week-10', 'course-tech476', 10, 'Giao tiếp 1-Wire', 
'# Tuần 10: 1-Wire\n\n## Mục tiêu\n- Hiểu giao thức 1-Wire.\n- Đọc cảm biến nhiệt độ DS18B20.\n\n## Lý thuyết\n- Địa chỉ ROM 64-bit\n- Kéo trở 4.7k', 
'["Đọc nhiệt độ DS18B20","Hiểu cơ chế 1-Wire","Kết nối đa điểm"]', 
'["Lấy địa chỉ thiết bị 1-Wire","Đọc dữ liệu chính xác"]', 1, unixepoch());

-- WEEK 11
INSERT INTO weeks (id, course_id, week_number, title, overview, objectives, exam_checklist, is_published, created_at) VALUES 
('week-11', 'course-tech476', 11, 'WiFi & WebServer (Cơ bản)', 
'# Tuần 11: WiFi Basic\n\n## Mục tiêu\n- Kết nối WiFi (ESP8266/ESP32).\n- Tạo WebServer cơ bản điều khiển LED.\n- Hiểu HTTP Request/Response.\n\n## Lý thuyết\n- IP Address, Station Mode\n- HTML cơ bản cho giao diện điều khiển', 
'["Kết nối WiFi","Tạo WebServer bật/tắt LED","Tùy biến giao diện HTML"]', 
'["Giải thích Client/Server","Xử lý GET Request"]', 1, unixepoch());

-- WEEK 12
INSERT INTO weeks (id, course_id, week_number, title, overview, objectives, exam_checklist, is_published, created_at) VALUES 
('week-12', 'course-tech476', 12, 'Async WebServer & IoT Project', 
'# Tuần 12: Async WebServer & IoT\n\n## Mục tiêu\n- Sử dụng AsyncWebServer (không chặn).\n- Cập nhật trạng thái AJAX/Fetch API.\n- Hoàn thiện hệ thống IoT đầy đủ.\n\n## Lý thuyết\n- Asynchronous Programming\n- JSON API\n- Websocket (mở rộng)', 
'["Tạo Async WebServer","Cập nhật UI không reload","Xây dựng API trả về JSON"]', 
'["So sánh Sync vs Async Server","Thiết kế hệ thống IoT hoàn chỉnh"]', 1, unixepoch());


-- ==========================================
-- LESSONS (Sample for Key Weeks)
-- ==========================================

-- Lesson Week 1
INSERT INTO lessons (id, week_id, order_index, title, content, duration, is_published, created_at) VALUES 
('lesson-01-01', 'week-01', 1, 'Hệ thống nhúng là gì?', '# Hệ thống nhúng (Embedded Systems)\n\nKhái niệm hệ thống nhúng: thiết bị điện tử “chuyên nhiệm”, chạy nhiệm vụ cụ thể, tài nguyên hạn chế.\nKiến trúc: CPU/MCU + Bộ nhớ + I/O.\n\n## Arduino Uno\nVi điều khiển ATmega328P, 5V logic, 16MHz.', 15, 1, unixepoch()),
('lesson-01-02', 'week-01', 2, 'GPIO: Output', '# Digital Output\n\n`pinMode(pin, OUTPUT)`\n`digitalWrite(pin, HIGH/LOW)`\n`delay(ms)`\n\nChú ý: LED cần điện trở hạn dòng (220-330 Ohm).', 20, 1, unixepoch());

-- Lesson Week 2
INSERT INTO lessons (id, week_id, order_index, title, content, duration, is_published, created_at) VALUES 
('lesson-02-01', 'week-02', 1, 'Tư duy thiết kế', '# Top-Down vs Bottom-Up\n\n- **Top-Down**: Từ yêu cầu -> chia nhỏ module -> chi tiết.\n- **Bottom-Up**: Từ linh kiện/module có sẵn -> ghép thành hệ thống.', 15, 1, unixepoch()),
('lesson-02-02', 'week-02', 2, 'LED 7 đoạn', '# LED 7 đoạn\n\nCấu tạo: 8 LED đơn (A-G + DP).\nPhân loại: Common Anode (Dương chung) vs Common Cathode (Âm chung).\n\n## Multiplexing (Quét LED)\nBật tắt nhanh từng LED để đánh lừa thị giác (POV).', 25, 1, unixepoch());

-- ==========================================
-- LABS (Real Exercises from noidunghoc.md)
-- ==========================================

-- Lab Week 1
INSERT INTO labs (id, week_id, order_index, title, objective, instructions, wiring, starter_code, solution_code, rubric, simulator_url, duration, is_published, created_at) VALUES 
('lab-01-01', 'week-01', 1, 'Blink 3 quy luật', 'LED blink theo 3 quy luật thời gian khác nhau', 
'# Bài 1-1: Blink theo 3 quy luật\n\n1. Quy luật 1: Sáng 1s, Tắt 1s (lặp 5 lần)\n2. Quy luật 2: Sáng 0.5s, Tắt 0.2s (lặp 5 lần)\n3. Quy luật 3: Sáng 0.1s, Tắt 0.1s (lặp 5 lần)',
'LED chân D13 (hoặc LED ngoài chân D2)', 
'void blinkN(int tOn, int tOff, int n) {\n  // TODO: Viết hàm blink n lần\n}\n\nvoid setup() {\n  pinMode(13, OUTPUT);\n}\n\nvoid loop() {\n  // Gọi hàm blinkN cho 3 quy luật\n}',
'// Solution hidden', '{"criteria":[{"name":"Đúng 3 quy luật","points":5},{"name":"Dùng hàm","points":5}],"total":10}', 
'https://wokwi.com/projects/new/arduino-uno', 30, 1, unixepoch()),
('lab-01-02', 'week-01', 2, 'Running LEDs', 'Hiệu ứng LED chạy đuổi', 
'# Bài 1-2: 5 LED chạy tuần tự\n\n- 5 LED (D2-D6) sáng lần lượt 1->5 (1s)\n- Giữ sáng tất cả 5s\n- Tắt lần lượt 5->1 (1s)',
'5 LED nối vào D2, D3, D4, D5, D6', 
'int pins[] = {2,3,4,5,6};\nvoid setup() {\n  // Init output\n}\nvoid loop() {\n  // TODO: Logic\n}',
'// Solution hidden', '{"criteria":[{"name":"Chạy đúng chiều","points":5},{"name":"Timing đúng","points":5}],"total":10}', 
'https://wokwi.com/projects/new/arduino-uno', 45, 1, unixepoch());

-- Lab Week 2
INSERT INTO labs (id, week_id, order_index, title, objective, instructions, wiring, starter_code, solution_code, rubric, simulator_url, duration, is_published, created_at) VALUES 
('lab-02-01', 'week-02', 1, 'LED 7 đoạn cơ bản', 'Hiển thị số trên LED 7 đoạn', 
'# Bài 2-1: Đếm số\n\n- Hiển thị 0->9 (trễ 1s)\n- Đếm ngược 9->0',
'LED 7 đoạn nối vào PORT D (D0-D7) hoặc D2-D9', 
'byte numbers[10] = {0x3F, ...}; // Mã LED 7 đoạn\nvoid setup() {\n  // pinMode\n}\nvoid loop() {\n  // Display 0-9\n}',
'// Solution hidden', '{"criteria":[{"name":"Hiển thị đúng số","points":5},{"name":"Mã hex đúng","points":5}],"total":10}', 
'https://wokwi.com/projects/new/arduino-uno', 40, 1, unixepoch());

-- Lab Week 3
INSERT INTO labs (id, week_id, order_index, title, objective, instructions, wiring, starter_code, solution_code, rubric, simulator_url, duration, is_published, created_at) VALUES 
('lab-03-01', 'week-03', 1, 'Nút nhấn & LED', 'Điều khiển LED bằng nút nhấn', 
'# Bài 3-1: Nhấn giữ\n\n- Nhấn nút -> LED sáng\n- Nhả nút -> LED tắt\n- In trạng thái ra Serial',
'Nút nhấn D2 (INPUT_PULLUP), LED D13', 
'void setup() {\n  pinMode(2, INPUT_PULLUP);\n  pinMode(13, OUTPUT);\n  Serial.begin(9600);\n}',
'// Solution hidden', '{"criteria":[{"name":"Logic đúng","points":5},{"name":"Serial log","points":5}],"total":10}', 
'https://wokwi.com/projects/new/arduino-uno', 20, 1, unixepoch()),
('lab-03-02', 'week-03', 2, 'Đếm số lần nhấn', 'Phát hiện cạnh lên/xuống', 
'# Bài 3-2: Toggle LED\n\n- Đếm số lần nhấn nút.\n- Số lần lẻ -> LED Sáng.\n- Số lần chẵn -> LED Tắt.\n- Chống dội (Debounce).',
'Nút nhấn D2, LED D3', 
'int count = 0;\nint lastState = HIGH;\nvoid loop() {\n  // TODO: Edge detection & debounce\n}',
'// Solution hidden', '{"criteria":[{"name":"Chống dội tốt","points":5},{"name":"Logic chẵn lẻ","points":5}],"total":10}', 
'https://wokwi.com/projects/new/arduino-uno', 40, 1, unixepoch());

-- Lab Week 4
INSERT INTO labs (id, week_id, order_index, title, objective, instructions, wiring, starter_code, solution_code, rubric, simulator_url, duration, is_published, created_at) VALUES 
('lab-04-01', 'week-04', 1, 'Đọc biến trở', 'Đọc ADC và tính toán điện áp', 
'# Bài 4-1: Đọc ADC\n\n- Đọc giá trị biến trở (A0).\n- In ra Serial: Raw (0-1023), Voltage (0-5V), Percent (0-100%).',
'Biến trở vào A0', 
'void loop() {\n  int val = analogRead(A0);\n  // TODO: Calculate V, %\n  Serial.print("Raw: "); Serial.println(val);\n}',
'// Solution hidden', '{"criteria":[{"name":"Tính toán đúng","points":5},{"name":"Format in ra","points":5}],"total":10}', 
'https://wokwi.com/projects/new/arduino-uno', 20, 1, unixepoch()),
('lab-04-02', 'week-04', 2, 'PWM LED', 'Điều khiển độ sáng bằng biến trở', 
'# Bài 4-2: Dimmer\n\n- Đọc biến trở A0.\n- Điều khiển độ sáng LED (D3 - PWM) tương ứng.\n- In % ra Serial.',
'Biến trở A0, LED D3', 
'void loop() {\n  int val = analogRead(A0);\n  int pwm = map(val, 0, 1023, 0, 255);\n  // TODO: analogWrite\n}',
'// Solution hidden', '{"criteria":[{"name":"Map đúng range","points":5},{"name":"LED sáng dần","points":5}],"total":10}', 
'https://wokwi.com/projects/new/arduino-uno', 30, 1, unixepoch());

-- Lab Week 6
INSERT INTO labs (id, week_id, order_index, title, objective, instructions, wiring, starter_code, solution_code, rubric, simulator_url, duration, is_published, created_at) VALUES 
('lab-06-01', 'week-06', 1, 'Cảm biến khoảng cách', 'Đo khoảng cách với HC-SR04', 
'# Bài 6-1: Cảnh báo khoảng cách\n\n- Đọc cảm biến HC-SR04.\n- <30cm: Chương trình LED 1.\n- >80cm: Chương trình LED 2.\n- 30-80cm: Chương trình LED 3.\n- In khoảng cách ra Serial.',
'HC-SR04 (Trig D9, Echo D10), 8 LED', 
'void loop() {\n  // TODO: Measure distance\n  // TODO: If/Else logic\n}',
'// Solution hidden', '{"criteria":[{"name":"Đo đúng cm","points":5},{"name":"Logic ngưỡng đúng","points":5}],"total":10}', 
'https://wokwi.com/projects/new/arduino-uno', 45, 1, unixepoch());

