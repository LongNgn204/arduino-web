CREATE TABLE IF NOT EXISTS `topics` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`course_id` text,
	`order_index` integer,
	`icon` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);

INSERT OR REPLACE INTO topics (id, name, slug, description) VALUES
('topic-01', 'Nhập môn', 'intro', 'Kiến thức cơ bản'),
('topic-02', 'GPIO', 'gpio', 'Input/Output'),
('topic-03', 'Cảm biến', 'sensors', 'Đọc dữ liệu môi trường'),
('topic-04', 'Giao tiếp', 'comms', 'UART, I2C, SPI'),
('topic-05', 'IoT', 'iot', 'Internet of Things');
