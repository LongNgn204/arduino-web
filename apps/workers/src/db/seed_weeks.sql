-- Seed Weeks
-- Run: npx wrangler d1 execute arduino-db --local --file=src/db/seed_weeks.sql

INSERT OR REPLACE INTO weeks (id, course_id, week_number, topic_id, title, overview, is_published) VALUES
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
