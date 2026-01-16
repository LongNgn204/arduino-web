-- Clean Seed with FK OFF
-- Run: npx wrangler d1 execute arduino-db --local --file=src/db/seed_structure_clean.sql

PRAGMA foreign_keys = OFF;

DELETE FROM lessons;
DELETE FROM labs;
DELETE FROM weeks;
DELETE FROM topics;
DELETE FROM courses;

PRAGMA foreign_keys = ON;

-- Course
INSERT INTO courses (id, code, title, description, is_published) 
VALUES ('course-01', 'IOT2026', 'Lập trình IoT & Hệ thống nhúng (2026 Update)', 'Khóa học toàn diện Uno & ESP32.', 1);

-- Topics
INSERT INTO topics (id, course_id, order_index, title, description, icon) VALUES
('topic-01', 'course-01', 1, 'Nền tảng (Foundation)', 'Làm quen với GPIO, LED và tư duy lập trình nhúng.', 'layers'),
('topic-02', 'course-01', 2, 'Cảm biến & Logic', 'Đọc dữ liệu môi trường, xử lý tín hiệu và điều khiển động cơ.', 'activity'),
('topic-03', 'course-01', 3, 'Giao tiếp (Communication)', 'Kết nối thiết bị qua Serial, I2C, SPI.', 'cpu'),
('topic-04', 'course-01', 4, 'IoT & Cloud (Advanced)', 'Kết nối WiFi, MQTT, App điều khiển và Dashboard.', 'wifi'),
('topic-05', 'course-01', 5, 'Dự án (Capstone)', 'Xây dựng sản phẩm hoàn chỉnh.', 'box');

-- Weeks
INSERT INTO weeks (id, course_id, week_number, topic_id, title, overview, is_published) VALUES
('week-01', 'course-01', 1, 'topic-01', 'Hello World & GPIO', 'Làm quen với Arduino IDE, Cấu trúc Code, và Điều khiển LED đơn.', 1),
('week-02', 'course-01', 2, 'topic-01', 'Digital I/O & Logic', 'Nút nhấn, Điện trở treo (Pull-up) và Tư duy Logic.', 1),
('week-03', 'course-01', 3, 'topic-01', 'Analog & PWM', 'Đọc biến trở (ADC) và Điều khiển độ sáng LED (Fading).', 1),
('week-04', 'course-01', 4, 'topic-01', 'Hiển thị cơ bản', 'LED 7 đoạn và Màn hình LCD 1602.', 1),
('week-05', 'course-01', 5, 'topic-02', 'Cảm biến Môi trường', 'Nhiệt độ (DHT11), Ánh sáng (LDR), Khoảng cách (Ultrasonic).', 1),
('week-06', 'course-01', 6, 'topic-02', 'Động cơ & Actuators', 'Servo Motor, Động cơ bước và Relay.', 1),
('week-07', 'course-01', 7, 'topic-03', 'Giao tiếp Serial (UART)', 'Gửi nhận dữ liệu giữa Arduino và Máy tính.', 1),
('week-08', 'course-01', 8, 'topic-03', 'Giao thức I2C & SPI', 'Kết nối nhiều thiết bị: OLED, RTC, Thẻ nhớ.', 1),
('week-09', 'course-01', 9, 'topic-04', 'WiFi & Web Server', 'Biến ESP32 thành Website điều khiển thiết bị.', 1),
('week-10', 'course-01', 10, 'topic-04', 'Giao thức MQTT', 'Kết nối Broker, Pub/Sub thời gian thực.', 1),
('week-11', 'course-01', 11, 'topic-04', 'IoT App & Dashboard', 'Điều khiển từ điện thoại qua App (Blynk/Custom).', 1),
('week-12', 'course-01', 12, 'topic-05', 'Dự án Cuối khóa', 'Thiết kế và xây dựng hệ thống IoT hoàn chỉnh.', 1);
