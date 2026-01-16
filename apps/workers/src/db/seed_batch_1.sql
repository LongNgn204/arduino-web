-- Batch 1: Weeks 1-4 (Foundation)
-- Run: npx wrangler d1 execute arduino-db --local --file=src/db/seed_batch_1.sql

INSERT OR REPLACE INTO weeks (id, course_id, week_number, topic_id, title, overview, is_published) VALUES
('week-01', 'course-01', 1, 'topic-01', 'Hello World & GPIO', 'Làm quen với Arduino IDE, Cấu trúc Code, và Điều khiển LED đơn.', 1),
('week-02', 'course-01', 2, 'topic-01', 'Digital I/O & Logic', 'Nút nhấn, Điện trở treo (Pull-up) và Tư duy Logic.', 1),
('week-03', 'course-01', 3, 'topic-01', 'Analog & PWM', 'Đọc biến trở (ADC) và Điều khiển độ sáng LED (Fading).', 1),
('week-04', 'course-01', 4, 'topic-01', 'Hiển thị cơ bản', 'LED 7 đoạn và Màn hình LCD 1602.', 1);

INSERT OR REPLACE INTO lessons (id, week_id, order_index, title, content, board_support, is_published) VALUES
-- WEEK 1
('l-01-01', 'week-01', 1, 'Giới thiệu Arduino & ESP32', 
'# 1. Phần cứng: Uno vs ESP32
Hãy tưởng tượng **Vi điều khiển** giống như bộ não của robot.
- **Arduino Uno**: Giống như "bộ não cơ bản", bền bỉ, dễ học, dùng 5V.
- **ESP32**: Giống như "bộ não thiên tài" có WiFi/Bluetooth, dùng 3.3V.

## Sơ đồ chân (Pinout)
- **Arduino Uno**: Chân nguồn 5V, GND. Digital 0-13. Analog A0-A5.
- **ESP32**: Dùng điện áp 3.3V. Chân GPIO linh hoạt.', 'both', 1),

('l-01-02', 'week-01', 2, 'Cài đặt Môi trường (IDE)', 
'# 2. Cài đặt Arduino IDE 2.0
1. Tải từ arduino.cc
2. Cài đặt ESP32 Board Manager.
3. Chọn đúng cổng COM.', 'both', 1),

('l-01-03', 'week-01', 3, 'Bài học đầu tiên: Blink LED', 
'# 3. Hello World
Nguyên lý dòng nước.
Code `digitalWrite`.', 'both', 1),

-- WEEK 2
('l-02-01', 'week-02', 1, 'Nút nhấn (Input)', 
'# Nút nhấn & Pull-up Resistor
Tránh hiện tượng floating (thả nổi).
Dùng `INPUT_PULLUP`.', 'both', 1),

-- WEEK 3
('l-03-01', 'week-03', 1, 'ADC & Biến trở', 
'# Analog to Digital
Đọc giá trị liên tục từ 0-5V.
- Uno: 0-1023
- ESP32: 0-4095
Hàm `analogRead(pin)`.', 'both', 1),

('l-03-02', 'week-03', 2, 'PWM & Fading LED', 
'# Pulse Width Modulation
Bật tắt nhanh để giả lập Analog.
Điều khiển độ sáng LED.', 'both', 1),

-- WEEK 4
('l-04-01', 'week-04', 1, 'LED 7 Đoạn', 
'# Hiển thị số
Cấu tạo LED 7 đoạn.
Cách điều khiển từng thanh a,b,c,d,e,f,g.', 'both', 1);

INSERT OR REPLACE INTO labs (id, week_id, order_index, title, objective, instructions, wiring, duration, board_support, is_published) VALUES
('lab-01', 'week-01', 1, 'Lab 1: Blink & SOS', 'Lập trình LED nhấp nháy.', 'Hướng dẫn...', 'Nối D13', 30, 'both', 1);
