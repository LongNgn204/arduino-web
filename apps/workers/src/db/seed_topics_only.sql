-- Seed Topics Only
INSERT OR IGNORE INTO topics (id, course_id, order_index, title, description, icon) VALUES
('topic-01', 'course-01', 1, 'Nền tảng (Foundation)', 'Làm quen với GPIO, LED và tư duy lập trình nhúng.', 'layers'),
('topic-02', 'course-01', 2, 'Cảm biến & Logic', 'Đọc dữ liệu môi trường, xử lý tín hiệu và điều khiển động cơ.', 'activity'),
('topic-03', 'course-01', 3, 'Giao tiếp (Communication)', 'Kết nối thiết bị qua Serial, I2C, SPI.', 'cpu'),
('topic-04', 'course-01', 4, 'IoT & Cloud (Advanced)', 'Kết nối WiFi, MQTT, App điều khiển và Dashboard.', 'wifi'),
('topic-05', 'course-01', 5, 'Dự án (Capstone)', 'Xây dựng sản phẩm hoàn chỉnh.', 'box');
