-- Real Quiz Questions for Arduino Learning Hub
-- Run: cd apps/workers && npx wrangler d1 execute arduino-db --remote --file=src/db/quiz_questions.sql

-- Update Week 1 Quiz Questions
DELETE FROM questions WHERE quiz_id = 'quiz-01';

INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES
('q-01-01', 'quiz-01', 1, 'single', 
 'Hàm nào được gọi MỘT LẦN duy nhất khi Arduino khởi động?',
 '["loop()", "setup()", "main()", "init()"]',
 '1', 
 'setup() chạy 1 lần khi khởi động, dùng để cấu hình pin, khởi tạo Serial.', 
 10, unixepoch());

INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES
('q-01-02', 'quiz-01', 2, 'single', 
 'Để cấu hình chân số 13 làm OUTPUT, sử dụng lệnh nào?',
 '["digitalWrite(13, OUTPUT)", "pinMode(13, OUTPUT)", "setPin(13, OUTPUT)", "pin(13, OUTPUT)"]',
 '1', 
 'pinMode(pin, mode) dùng để cấu hình chế độ của chân (INPUT hoặc OUTPUT).', 
 10, unixepoch());

INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES
('q-01-03', 'quiz-01', 3, 'single', 
 'Điện trở giới hạn dòng cho LED thường có giá trị bao nhiêu?',
 '["10Ω", "100Ω", "220Ω - 330Ω", "1kΩ"]',
 '2', 
 'LED thường dùng điện trở 220Ω-330Ω để giới hạn dòng khoảng 10-20mA.', 
 10, unixepoch());

INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES
('q-01-04', 'quiz-01', 4, 'single', 
 'Hàm delay(1000) sẽ dừng chương trình trong bao lâu?',
 '["1 giây", "1 phút", "100ms", "10 giây"]',
 '0', 
 'delay() nhận tham số là milliseconds. 1000ms = 1 giây.', 
 10, unixepoch());

INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES
('q-01-05', 'quiz-01', 5, 'single', 
 'GPIO là viết tắt của từ nào?',
 '["General Port Input/Output", "General Purpose Input/Output", "Global Pin Input/Output", "Ground Pin I/O"]',
 '1', 
 'GPIO = General Purpose Input/Output - Chân đa năng vào/ra.', 
 10, unixepoch());

INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES
('q-01-06', 'quiz-01', 6, 'single', 
 'Để bật LED nối với chân 13, sử dụng lệnh nào?',
 '["digitalWrite(13, HIGH)", "digitalRead(13, HIGH)", "analogWrite(13, HIGH)", "pinWrite(13, 1)"]',
 '0', 
 'digitalWrite(pin, value) dùng để ghi giá trị HIGH/LOW ra chân digital.', 
 10, unixepoch());

INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES
('q-01-07', 'quiz-01', 7, 'single', 
 'Arduino Uno có bao nhiêu chân Digital I/O?',
 '["6 chân", "8 chân", "14 chân", "20 chân"]',
 '2', 
 'Arduino Uno có 14 chân Digital (D0-D13), trong đó D0, D1 dùng cho Serial.', 
 10, unixepoch());

INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES
('q-01-08', 'quiz-01', 8, 'single', 
 'Hàm loop() có đặc điểm gì?',
 '["Chạy 1 lần duy nhất", "Chạy lặp lại vô hạn", "Chạy khi nhấn nút Reset", "Không bao giờ chạy"]',
 '1', 
 'loop() chạy lặp đi lặp lại liên tục sau khi setup() hoàn thành.', 
 10, unixepoch());

INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES
('q-01-09', 'quiz-01', 9, 'single', 
 'Điện áp hoạt động của Arduino Uno là bao nhiêu?',
 '["3.3V", "5V", "9V", "12V"]',
 '1', 
 'Arduino Uno hoạt động ở 5V logic. Điện áp cấp nguồn có thể 7-12V qua jack.', 
 10, unixepoch());

INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES
('q-01-10', 'quiz-01', 10, 'single', 
 'Trong LED, chân dài hơn là chân gì?',
 '["Cathode (âm)", "Anode (dương)", "Ground", "NC"]',
 '1', 
 'Chân dài = Anode (+), chân ngắn = Cathode (-). Nhớ: dài = dương.', 
 10, unixepoch());

-- Update Week 2 Quiz Questions
DELETE FROM questions WHERE quiz_id = 'quiz-02';

INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES
('q-02-01', 'quiz-02', 1, 'single', 
 '7-Segment có tổng cộng bao nhiêu LED?',
 '["5 LED", "7 LED", "8 LED (gồm dấu chấm)", "10 LED"]',
 '2', 
 '7-segment có 7 đoạn (a-g) + 1 dấu chấm thập phân (dp) = 8 LED.', 
 10, unixepoch());

INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES
('q-02-02', 'quiz-02', 2, 'single', 
 'Để hiển thị số 8 trên 7-segment, cần bật bao nhiêu đoạn?',
 '["5 đoạn", "6 đoạn", "7 đoạn (tất cả)", "4 đoạn"]',
 '2', 
 'Số 8 cần bật tất cả 7 đoạn (a, b, c, d, e, f, g) để hiển thị.', 
 10, unixepoch());

INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES
('q-02-03', 'quiz-02', 3, 'single', 
 '7-segment Common Cathode nghĩa là gì?',
 '["Các anode nối chung", "Các cathode nối chung với GND", "Dùng điện áp âm", "Tất cả LED nối song song"]',
 '1', 
 'Common Cathode: tất cả cathode nối chung vào GND, muốn sáng đoạn nào thì cấp HIGH cho anode đó.', 
 10, unixepoch());

-- Update Week 3 Quiz Questions
DELETE FROM questions WHERE quiz_id = 'quiz-03';

INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES
('q-03-01', 'quiz-03', 1, 'single', 
 'Điện trở pull-up nội của Arduino có giá trị khoảng bao nhiêu?',
 '["1kΩ", "10kΩ", "20-50kΩ", "100kΩ"]',
 '2', 
 'Arduino có internal pull-up khoảng 20-50kΩ, kích hoạt bằng INPUT_PULLUP.', 
 10, unixepoch());

INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES
('q-03-02', 'quiz-03', 2, 'single', 
 'Khi dùng INPUT_PULLUP, trạng thái mặc định của chân là gì?',
 '["LOW", "HIGH", "Không xác định", "0V"]',
 '1', 
 'Pull-up kéo chân lên HIGH khi không có tác động. Nhấn nút (nối GND) → LOW.', 
 10, unixepoch());

INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES
('q-03-03', 'quiz-03', 3, 'single', 
 'Hiện tượng \"bounce\" của nút nhấn là gì?',
 '["Nút bị kẹt", "Tín hiệu dao động khi nhấn/nhả", "Nút nhảy ra ngoài", "Điện áp cao bất thường"]',
 '1', 
 'Bounce: tiếp điểm dao động nhiều lần khi nhấn/nhả, gây nhiều xung giả trong 10-50ms.', 
 10, unixepoch());
