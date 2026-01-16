-- Generated Seed Data
-- Date: 2026-01-16T13:56:57.345Z

-- USERS
INSERT OR REPLACE INTO users (id, username, password_hash, role, display_name, created_at, updated_at) VALUES 
('admin-001', 'admin', 'pbkdf2$100000$c2FsdF9hZG1pbl90ZXN0$WkYxR2FEbG1iSEZ3WVhOemQyOXlaQT09', 'admin', 'Administrator', unixepoch(), unixepoch()),
('student-001', 'sinhvien', 'pbkdf2$100000$c2FsdF9zdHVkZW50X3Rlc3Q$dGVzdHBhc3N3b3JkMTIz', 'student', 'Nguyen Hoang Long', unixepoch(), unixepoch());

-- TOPICS
INSERT OR REPLACE INTO topics (id, name, slug, description) VALUES
('topic-01', 'Nhập môn', 'intro', 'Kiến thức cơ bản'),
('topic-02', 'GPIO', 'gpio', 'Input/Output'),
('topic-03', 'Cảm biến', 'sensors', 'Đọc dữ liệu môi trường'),
('topic-04', 'Giao tiếp', 'comms', 'UART, I2C, SPI'),
('topic-05', 'IoT', 'iot', 'Internet of Things');

-- COURSE
INSERT OR REPLACE INTO courses (id, code, title, description, total_weeks, is_published, created_at) VALUES 
('course-01', 'IOT101', 'Lập trình hệ thống nhúng & IoT', 'Khóa học Arduino/ESP32 toàn diện.', 13, 1, unixepoch());
