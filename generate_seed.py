
import os
import time

def get_unix_epoch():
    return "unixepoch()"

def generate_seed():
    # Header
    sql = """-- Seed data cho Arduino Learning Hub (Generated Standard)
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
"""

    weeks_data = [
        # Week 1
        ("week-01", 1, "Tổng quan HT nhúng & GPIO", 
         "# Tuần 1: Tổng quan & GPIO\\n\\n## Mục tiêu\\n- Hiểu hệ thống nhúng và vai trò MCU.\\n- Dùng GPIO điều khiển LED blink và running LED.\\n- Rèn tư duy vòng lặp và thời gian.",
         '["Hiểu cấu trúc Arduino","Điều khiển LED cơ bản","Sử dụng vòng lặp for"]',
         '["Viết code Blink","Debug lỗi thiếu điện trở","Giải thích setup/loop"]'),
        
        # Week 2
        ("week-02", 2, "Thiết kế HT nhúng & LED 7 đoạn",
         "# Tuần 2: LED 7 đoạn & Tư duy thiết kế\\n\\n## Mục tiêu\\n- Hiểu tư duy Top-Down, Bottom-Up.\\n- Điều khiển LED 7 đoạn đơn và module 4 số (multiplexing).",
         '["Hiểu nguyên lý Multiplexing","Hiển thị số trên 7-seg","Tạo bảng mã LED 7 đoạn"]',
         '["Viết hàm hiển thị số","Giải thích hiện tượng lưu ảnh (POV)"]'),

        # Week 3
        ("week-03", 3, "Input & Keypad",
         "# Tuần 3: Nút nhấn & Keypad\\n\\n## Mục tiêu\\n- Đọc nút nhấn & chống dội (debounce).\\n- Đếm số lần nhấn (edge detection).\\n- Giao tiếp Keypad 4x4.",
         '["Sử dụng INPUT_PULLUP","Xử lý Debounce","Đọc dữ liệu Keypad"]',
         '["Phân biệt Edge vs Level","Viết code nhập mật khẩu"]'),

        # Week 4
        ("week-04", 4, "Analog I/O (ADC & PWM)",
         "# Tuần 4: Analog & PWM\\n\\n## Mục tiêu\\n- Đọc biến trở (ADC).\\n- Điều khiển độ sáng LED (PWM).\\n- Điều khiển LED bằng biến trở.",
         '["Đọc giá trị Analog","Sử dụng PWM","Chuyển đổi thang đo (map)"]',
         '["Tính điện áp từ giá trị ADC","Giải thích Duty Cycle"]'),

        # Week 5
        ("week-05", 5, "Thực hành tích hợp I/O",
         "# Tuần 5: Tích hợp hệ thống\\n\\n## Mục tiêu\\n- Kết hợp Analog + Digital + Hiển thị (7-seg).\\n- Viết code theo module (State Machine cơ bản).",
         '["Kết hợp nhiều IO","Tư duy State Machine","Quản lý thời gian với millis"]',
         '["Thiết kế Flowchart tổng hợp","Viết code đa nhiệm đơn giản"]'),

        # Week 6
        ("week-06", 6, "Cảm biến (Sensors)",
         "# Tuần 6: Cảm biến\\n\\n## Mục tiêu\\n- Đọc cảm biến siêu âm (HC-SR04), Nhiệt ẩm (DHT11), Chuyển động (PIR).\\n- Xử lý tín hiệu theo ngưỡng.",
         '["Đo khoảng cách HC-SR04","Đọc nhiệt độ DHT11","Xử lý tín hiệu cảm biến"]',
         '["Viết logic cảnh báo theo ngưỡng","In giá trị cảm biến ra Serial"]'),

        # Week 7
        ("week-07", 7, "Giao tiếp Serial (UART)",
         "# Tuần 7: UART\\n\\n## Mục tiêu\\n- Hiểu giao thức UART.\\n- Giao tiếp PC <-> Arduino.\\n- Giao tiếp 2 board Arduino.",
         '["Gửi nhận dữ liệu Serial","Tạo giao thức lệnh đơn giản","Debug qua Serial Monitor"]',
         '["Xử lý chuỗi từ Serial","Điều khiển thiết bị qua lệnh text"]'),

        # Week 8
        ("week-08", 8, "Giao tiếp I2C & LCD",
         "# Tuần 8: I2C\\n\\n## Mục tiêu\\n- Hiểu Bus I2C (SDA/SCL).\\n- Sử dụng LCD 1602 I2C.\\n- Giao tiếp Master-Slave.",
         '["Quét địa chỉ I2C","Hiển thị lên LCD I2C","Giao tiếp 2 Arduino qua I2C"]',
         '["Viết hàm hiển thị LCD","Giải thích SDA/SCL"]'),

        # Week 9
        ("week-09", 9, "Giao tiếp SPI",
         "# Tuần 9: SPI\\n\\n## Mục tiêu\\n- Hiểu giao thức SPI (MOSI/MISO/SCK/SS).\\n- Điều khiển Shift Register (74HC595) hoặc LED Matrix.",
         '["Kết nối thiết bị SPI","Sử dụng thư viện SPI","Điều khiển 74HC595"]',
         '["Phân biệt SPI và I2C","Giải thích các chân SPI"]'),

        # Week 10
        ("week-10", 10, "Giao tiếp 1-Wire",
         "# Tuần 10: 1-Wire\\n\\n## Mục tiêu\\n- Hiểu giao thức 1-Wire.\\n- Đọc cảm biến nhiệt độ DS18B20.",
         '["Đọc nhiệt độ DS18B20","Hiểu cơ chế 1-Wire","Kết nối đa điểm"]',
         '["Lấy địa chỉ thiết bị 1-Wire","Đọc dữ liệu chính xác"]'),

        # Week 11
        ("week-11", 11, "WiFi & WebServer (Cơ bản)",
         "# Tuần 11: WiFi Basic\\n\\n## Mục tiêu\\n- Kết nối WiFi (ESP8266/ESP32).\\n- Tạo WebServer cơ bản điều khiển LED.",
         '["Kết nối WiFi","Tạo WebServer bật/tắt LED","Tùy biến giao diện HTML"]',
         '["Giải thích Client/Server","Xử lý GET Request"]'),

        # Week 12
        ("week-12", 12, "Async WebServer & IoT Project",
         "# Tuần 12: Async WebServer & IoT\\n\\n## Mục tiêu\\n- Sử dụng AsyncWebServer (không chặn).\\n- Cập nhật trạng thái AJAX/Fetch API.",
         '["Tạo Async WebServer","Cập nhật UI không reload","Xây dựng API trả về JSON"]',
         '["So sánh Sync vs Async Server","Thiết kế hệ thống IoT hoàn chỉnh"]'),
    ]

    for w_id, w_num, w_title, w_overview, w_obj, w_exam in weeks_data:
        sql += f"INSERT INTO weeks (id, course_id, week_number, title, overview, objectives, exam_checklist, is_published, created_at) VALUES \n('{w_id}', 'course-tech476', {w_num}, '{w_title}', '{w_overview}', '{w_obj}', '{w_exam}', 1, unixepoch());\n"

    sql += "\n-- ==========================================\n-- LESSONS\n-- ==========================================\n"
    
    # Simple Lesson Generator
    lessons = [
        # Week 1
        ("lesson-01-01", "week-01", 1, "Hệ thống nhúng là gì?", "# Hệ thống nhúng..."),
        ("lesson-01-02", "week-01", 2, "GPIO: Output", "# Digital Output..."),
        
        # Week 2
        ("lesson-02-01", "week-02", 1, "Tư duy thiết kế", "# Top-Down vs Bottom-Up..."),
        ("lesson-02-02", "week-02", 2, "LED 7 đoạn", "# LED 7 đoạn..."),

        # Week 3
        ("lesson-03-01", "week-03", 1, "Input & INPUT_PULLUP", "# Digital Input..."),
        ("lesson-03-02", "week-03", 2, "Debounce (Chống dội)", "# Debouncing..."),

        # Week 4
        ("lesson-04-01", "week-04", 1, "ADC (Analog to Digital)", "# ADC Converter..."),
        ("lesson-04-02", "week-04", 2, "PWM (Pulse Width Modulation)", "# PWM..."),

        # Week 5
        ("lesson-05-01", "week-05", 1, "Tư duy Module hóa", "# Functions..."),
        ("lesson-05-02", "week-05", 2, "Tránh delay()", "# millis()..."),

        # Week 6
        ("lesson-06-01", "week-06", 1, "Cảm biến siêu âm HC-SR04", "# HC-SR04..."),
        ("lesson-06-02", "week-06", 2, "Nhiệt độ & Độ ẩm DHT11", "# DHT11..."),

        # Week 7
        ("lesson-07-01", "week-07", 1, "Giao thức UART", "# UART Protocol..."),
        ("lesson-07-02", "week-07", 2, "Xử lý chuỗi Serial", "# Serial Parsing..."),

        # Week 8
        ("lesson-08-01", "week-08", 1, "Giao thức I2C", "# I2C Bus..."),
        ("lesson-08-02", "week-08", 2, "LCD 1602 I2C", "# LiquidCrystal_I2C..."),

        # Week 9
        ("lesson-09-01", "week-09", 1, "Giao thức SPI", "# SPI Bus..."),
        ("lesson-09-02", "week-09", 2, "Shift Register 74HC595", "# 74HC595..."),

        # Week 10
        ("lesson-10-01", "week-10", 1, "Giao thức 1-Wire", "# OneWire..."),
        ("lesson-10-02", "week-10", 2, "DS18B20 Temp Sensor", "# DS18B20..."),

        # Week 11
        ("lesson-11-01", "week-11", 1, "ESP8266/ESP32 Intro", "# ESP Platform..."),
        ("lesson-11-02", "week-11", 2, "Simple WebServer", "# WebServer..."),

        # Week 12
        ("lesson-12-01", "week-12", 1, "Async WebServer", "# ESPAsyncWebServer..."),
        ("lesson-12-02", "week-12", 2, "AJAX & Fetch API", "# Fetch API..."),
    ]

    for l_id, w_id, l_idx, l_title, l_content in lessons:
        sql += f"INSERT INTO lessons (id, week_id, order_index, title, content, duration, is_published, created_at) VALUES ('{l_id}', '{w_id}', {l_idx}, '{l_title}', '{l_content}', 20, 1, unixepoch());\n"

    sql += "\n-- ==========================================\n-- LABS\n-- ==========================================\n"

    labs = [
        # Week 1-12 Labs (Simplified for script length, ensure valid SQL strings)
        ("lab-01-01", "week-01", 1, "Blink 3 quy luật", "https://wokwi.com/projects/new/arduino-uno"),
        ("lab-02-01", "week-02", 1, "LED 7 đoạn cơ bản", "https://wokwi.com/projects/new/arduino-uno"),
        ("lab-03-01", "week-03", 1, "Nút nhấn & LED", "https://wokwi.com/projects/new/arduino-uno"),
        ("lab-04-01", "week-04", 1, "Đọc biến trở", "https://wokwi.com/projects/new/arduino-uno"),
        ("lab-05-01", "week-05", 1, "Đèn giao thông (millis)", "https://wokwi.com/projects/new/arduino-uno"),
        ("lab-06-01", "week-06", 1, "Cảm biến khoảng cách", "https://wokwi.com/projects/new/arduino-uno"),
        ("lab-07-01", "week-07", 1, "Serial Command", "https://wokwi.com/projects/new/arduino-uno"),
        ("lab-08-01", "week-08", 1, "LCD Hello World", "https://wokwi.com/projects/new/arduino-uno"),
        ("lab-09-01", "week-09", 1, "Shift Register LED", "https://wokwi.com/projects/new/arduino-uno"),
        ("lab-10-01", "week-10", 1, "Đọc nhiệt độ DS18B20", "https://wokwi.com/projects/new/arduino-uno"),
        ("lab-11-01", "week-11", 1, "WiFi Connect", "https://wokwi.com/projects/new/esp32"),
        ("lab-12-01", "week-12", 1, "IoT Dashboard", "https://wokwi.com/projects/new/esp32"),
    ]

    for lab_id, w_id, order, title, sim_url in labs:
        sql += f"INSERT INTO labs (id, week_id, order_index, title, objective, instructions, wiring, starter_code, solution_code, rubric, simulator_url, duration, is_published, created_at) VALUES ('{lab_id}', '{w_id}', {order}, '{title}', 'Objective', '# Instructions', 'Wiring', '// Starter Code', '// Solution', '{{\"total\":10}}', '{sim_url}', 45, 1, unixepoch());\n"

    sql += "\n-- ==========================================\n-- QUIZZES\n-- ==========================================\n"

    for i in range(1, 13):
        w_str = f"{i:02d}"
        qid = f"quiz-{w_str}"
        wid = f"week-{w_str}"
        sql += f"INSERT INTO quizzes (id, week_id, title, description, time_limit, passing_score, is_published, created_at) VALUES ('{qid}', '{wid}', 'Quiz Week {w_str}', 'Test knowledge', 15, 60, 1, unixepoch());\n"
        
        # Add 5 dummy questions per quiz for robust seeding
        for k in range(1, 6):
            q_id = f"q-{w_str}-0{k}"
            sql += f"INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('{q_id}', '{qid}', {k}, 'single', 'Question {k} for Week {w_str}?', '[\"Option A\", \"Option B\", \"Option C\", \"Option D\"]', '0', 'Explanation.', 10, unixepoch());\n"

    with open("apps/workers/src/db/seed.sql", "w", encoding="utf-8") as f:
        f.write(sql)
    
    print("Successfully generated seed.sql")

if __name__ == "__main__":
    generate_seed()
