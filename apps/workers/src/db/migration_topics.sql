-- Migration: Add Topic-Based Structure and Board Support
-- Chú thích: Hỗ trợ cấu trúc modules/topics thay vì linear weeks, và dual-board (Uno/ESP32)

-- 1. Create Topics Table (Cấp độ cao hơn modules)
DROP TABLE IF EXISTS topics;
CREATE TABLE topics (
    id TEXT PRIMARY KEY,
    course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT, -- Lucide icon name (e.g., 'cpu', 'wifi', 'layers')
    created_at INTEGER DEFAULT (unixepoch())
);

-- Seed Topics (5 chủ đề chính)
INSERT INTO topics (id, course_id, order_index, title, description, icon) VALUES
('topic-01', 'course-01', 1, 'Nền tảng (Foundation)', 'Làm quen với GPIO, LED và tư duy lập trình nhúng.', 'layers'),
('topic-02', 'course-01', 2, 'Giao tiếp (Communication)', 'Kết nối thiết bị qua Serial, I2C, SPI, WiFi và Bluetooth.', 'wifi'),
('topic-03', 'course-01', 3, 'Cảm biến & Actuators', 'Đọc dữ liệu môi trường và điều khiển động cơ.', 'activity'),
('topic-04', 'course-01', 4, 'IoT & Cloud', 'Xây dựng hệ thống IoT hoàn chỉnh với MQTT và Dashboard.', 'cloud'),
('topic-05', 'course-01', 5, 'Dự án Thực tế (Capstone)', 'Tự tay xây dựng sản phẩm công nghệ từ A-Z.', 'box');


-- 2. Create Modules Table (Thay thế Weeks hoặc map Weeks vào modules)
-- Note: Để tương thích ngược, ta giữ bảng Weeks nhưng thêm cột topic_id
ALTER TABLE weeks ADD COLUMN topic_id TEXT REFERENCES topics(id);

-- Map Weeks to Topics (Data Migration)
UPDATE weeks SET topic_id = 'topic-01' WHERE week_number BETWEEN 1 AND 5;
UPDATE weeks SET topic_id = 'topic-02' WHERE week_number BETWEEN 6 AND 8;
UPDATE weeks SET topic_id = 'topic-03' WHERE week_number = 9;
UPDATE weeks SET topic_id = 'topic-04' WHERE week_number BETWEEN 10 AND 11;
UPDATE weeks SET topic_id = 'topic-05' WHERE week_number = 12;

-- 3. Add Board Support to Learning Items
-- Support: 'uno' | 'esp32' | 'both'
ALTER TABLE lessons ADD COLUMN board_support TEXT DEFAULT 'both';
ALTER TABLE labs ADD COLUMN board_support TEXT DEFAULT 'both';
ALTER TABLE projects ADD COLUMN board_support TEXT DEFAULT 'both';

-- 4. Create Board-Specific Content Table (Optional enhancement)
-- Để lưu nội dung riêng cho từng board nếu khác biệt quá lớn
CREATE TABLE board_specific_content (
    id TEXT PRIMARY KEY,
    parent_id TEXT NOT NULL, -- lesson_id or lab_id
    board_type TEXT NOT NULL, -- 'uno' or 'esp32'
    content TEXT NOT NULL, -- Markdown content override
    code_snippet TEXT,
    wiring_diagram_url TEXT,
    created_at INTEGER DEFAULT (unixepoch())
);
