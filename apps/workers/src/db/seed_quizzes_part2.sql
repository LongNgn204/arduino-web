-- ==========================================
-- QUIZZES & QUESTIONS cho Tuần 5-12
-- Generated: 2026-01-16
-- Run: npx wrangler d1 execute arduino-db --remote --file=src/db/seed_quizzes_part2.sql
-- ==========================================

-- Xóa dữ liệu cũ nếu có
DELETE FROM questions WHERE quiz_id IN ('quiz-05', 'quiz-06', 'quiz-07', 'quiz-08', 'quiz-09', 'quiz-10', 'quiz-11', 'quiz-12');
DELETE FROM quizzes WHERE id IN ('quiz-05', 'quiz-06', 'quiz-07', 'quiz-08', 'quiz-09', 'quiz-10', 'quiz-11', 'quiz-12');

-- ==========================================
-- TUẦN 5: CẢM BIẾN (SENSORS)
-- ==========================================
INSERT INTO quizzes (id, week_id, title, description, time_limit, passing_score, is_published, created_at) VALUES 
('quiz-05', 'week-05', 'Quiz Tuần 5: Cảm biến & Môi trường', 'Kiểm tra kiến thức về cảm biến ánh sáng, nhiệt độ, khoảng cách và cách đọc tín hiệu Analog.', 15, 70, 1, unixepoch());

INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES 
('q05-01', 'quiz-05', 1, 'single', 'Cảm biến siêu âm HC-SR04 đo khoảng cách bằng cách nào?', '["Đo cường độ ánh sáng phản xạ","Đo thời gian sóng âm đi và về","Đo nhiệt độ môi trường","Đo điện trở thay đổi"]', '1', 'HC-SR04 phát ra sóng siêu âm và đo thời gian sóng phản xạ lại để tính khoảng cách: d = (time * speed)/2.', 10, unixepoch()),
('q05-02', 'quiz-05', 2, 'single', 'Chân Trig trên HC-SR04 dùng để làm gì?', '["Nhận tín hiệu phản hồi","Phát xung kích hoạt","Cấp nguồn","Nối đất"]', '1', 'Chân Trig (Trigger) dùng để nhận xung kích hoạt từ Arduino để bắt đầu phát sóng siêu âm.', 10, unixepoch()),
('q05-03', 'quiz-05', 3, 'truefalse', 'Cảm biến quang trở (LDR) có điện trở tăng khi ánh sáng tăng.', '["Đúng","Sai"]', '1', 'SAI. Quang trở (LDR) có điện trở GIẢM khi cường độ ánh sáng TĂNG.', 10, unixepoch()),
('q05-04', 'quiz-05', 4, 'single', 'Để đọc giá trị từ cảm biến nhiệt độ LM35 (Analog), ta dùng hàm nào?', '["digitalRead()","analogRead()","analogWrite()","Serial.read()"]', '1', 'LM35 xuất ra điện áp tương tự (Analog) nên cần dùng analogRead() để đọc.', 10, unixepoch()),
('q05-05', 'quiz-05', 5, 'single', 'Giá trị trả về của hàm pulseIn() có đơn vị là gì?', '["Mili giây (ms)","Micro giây (us)","Giây (s)","Hertz (Hz)"]', '1', 'pulseIn() trả về độ dài xung tính bằng micro giây (us).', 10, unixepoch());

-- ==========================================
-- TUẦN 6: ĐỘNG CƠ & CHẤP HÀNH
-- ==========================================
INSERT INTO quizzes (id, week_id, title, description, time_limit, passing_score, is_published, created_at) VALUES 
('quiz-06', 'week-06', 'Quiz Tuần 6: Động cơ Servo & DC', 'Điều khiển chuyển động với Servo, động cơ bước và động cơ DC thông qua driver.', 15, 70, 1, unixepoch());

INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES 
('q06-01', 'quiz-06', 1, 'single', 'Động cơ Servo thường có góc quay giới hạn trong khoảng nào?', '["0 - 360 độ","0 - 180 độ","Quay liên tục vô hạn","0 - 90 độ"]', '1', 'Servo tiêu chuẩn (SG90) thường quay trong khoảng 0 đến 180 độ.', 10, unixepoch()),
('q06-02', 'quiz-06', 2, 'single', 'Thư viện nào phổ biến nhất để điều khiển Servo trên Arduino?', '["Motor.h","Servo.h","Stepper.h","Wire.h"]', '1', 'Thư viện chuẩn có sẵn trong Arduino IDE là Servo.h.', 10, unixepoch()),
('q06-03', 'quiz-06', 3, 'truefalse', 'Có thể nối trực tiếp động cơ DC 12V vào chân GPIO của Arduino.', '["Đúng","Sai"]', '1', 'SAI. Chân GPIO chỉ chịu được 5V/40mA. Nối motor 12V trực tiếp sẽ làm cháy Arduino. Cần dùng Transistor hoặc Driver (L298N).', 10, unixepoch()),
('q06-04', 'quiz-06', 4, 'single', 'Mạch cầu H (H-Bridge) dùng để làm gì?', '["Tăng tốc độ động cơ","Đảo chiều quay động cơ DC","Đo tốc độ động cơ","Giảm nhiễu"]', '1', 'Mạch cầu H cho phép dòng điện chạy qua động cơ theo 2 chiều, giúp đảo chiều quay.', 10, unixepoch()),
('q06-05', 'quiz-06', 5, 'single', 'Lệnh `servo.write(90)` sẽ làm gì?', '["Quay servo đến góc 90 độ","Quay servo với tốc độ 90%","Dừng servo","Quay servo 90 vòng"]', '0', 'Với servo tiêu chuẩn, write(90) điều khiển trục động cơ quay đến vị trí góc 90 độ.', 10, unixepoch());

-- ==========================================
-- TUẦN 7: HIỂN THỊ (DISPLAY)
-- ==========================================
INSERT INTO quizzes (id, week_id, title, description, time_limit, passing_score, is_published, created_at) VALUES 
('quiz-07', 'week-07', 'Quiz Tuần 7: Màn hình LCD & I2C', 'Giao tiếp với màn hình LCD 16x2 sử dụng giao thức I2C để tiết kiệm chân.', 15, 70, 1, unixepoch());

INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES 
('q07-01', 'quiz-07', 1, 'single', 'Giao thức I2C sử dụng bao nhiêu dây tín hiệu?', '["1 dây","2 dây (SDA, SCL)","3 dây (MISO, MOSI, SCK)","4 dây"]', '1', 'I2C (Inter-Integrated Circuit) sử dụng 2 dây tín hiệu: SDA (Serial Data) và SCL (Serial Clock).', 10, unixepoch()),
('q07-02', 'quiz-07', 2, 'single', 'Chân SDA của Arduino Uno là chân nào?', '["A4","A5","D13","D2"]', '0', 'Trên Arduino Uno, SDA là chân A4, SCL là chân A5.', 10, unixepoch()),
('q07-03', 'quiz-07', 3, 'single', 'Để sử dụng LCD I2C, cần thư viện nào?', '["LiquidCrystal.h","LiquidCrystal_I2C.h","Wire.h","Cả 2 và 3"]', '3', 'Cần `Wire.h` cho giao tiếp I2C và `LiquidCrystal_I2C.h` để điều khiển màn hình.', 10, unixepoch()),
('q07-04', 'quiz-07', 4, 'single', 'Hàm `lcd.setCursor(0, 1)` có ý nghĩa gì?', '["Đặt con trỏ tại cột 0, hàng 0","Đặt con trỏ tại cột 0, hàng 1 (hàng dưới)","Xóa màn hình","Bật đèn nền"]', '1', 'setCursor(col, row). Hàng 1 là hàng thứ hai (index bắt đầu từ 0).', 10, unixepoch()),
('q07-05', 'quiz-07', 5, 'truefalse', 'Màn hình OLED 0.96 inch thường dùng giao tiếp SPI hoặc I2C.', '["Đúng","Sai"]', '0', 'ĐÚNG. Các module OLED phổ biến hỗ trợ cả I2C và SPI.', 10, unixepoch());

-- ==========================================
-- TUẦN 8: ÂM THANH (SOUND)
-- ==========================================
INSERT INTO quizzes (id, week_id, title, description, time_limit, passing_score, is_published, created_at) VALUES 
('quiz-08', 'week-08', 'Quiz Tuần 8: Âm thanh & Tone', 'Tạo âm thanh, nhạc chuông với còi Piezo và hàm tone().', 15, 70, 1, unixepoch());

INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES 
('q08-01', 'quiz-08', 1, 'single', 'Hàm `tone(pin, frequency)` dùng để làm gì?', '["Phát âm thanh tần số frequency","Đọc tần số âm thanh","Chỉnh âm lượng","Tắt âm thanh"]', '0', 'Hàm tone() tạo ra sóng vuông với tần số xác định để phát ra âm thanh qua loa/buzzer.', 10, unixepoch()),
('q08-02', 'quiz-08', 2, 'single', 'Để dừng phát âm thanh trên một chân, ta dùng hàm nào?', '["noTone()","stopTone()","mute()","silence()"]', '0', 'noTone(pin) dùng để dừng việc phát xung âm thanh trên chân đó.', 10, unixepoch()),
('q08-03', 'quiz-08', 3, 'single', 'Active Buzzer khác Passive Buzzer ở điểm nào?', '["Active cần cấp xung để kêu","Active tự kêu khi cấp nguồn DC","Passive to hơn","Không có khác biệt"]', '1', 'Active Buzzer có mạch dao động nội, chỉ cần cấp nguồn là kêu. Passive Buzzer cần cấp xung (tone) mới kêu được.', 10, unixepoch()),
('q08-04', 'quiz-08', 4, 'single', 'Tần số 440Hz tương ứng với nốt nhạc nào?', '["Đồ (C)","La (A4)","Mi (E)","Sol (G)"]', '1', 'Theo chuẩn nhạc lý, La (A4) có tần số 440Hz.', 10, unixepoch()),
('q08-05', 'quiz-08', 5, 'truefalse', 'Hàm tone() có thể chạy trên nhiều chân cùng lúc trên Arduino Uno.', '["Đúng","Sai"]', '1', 'SAI. Arduino Uno chỉ có 1 bộ timer cho tone(), nên chỉ có thể phát 1 nốt nhạc tại 1 thời điểm.', 10, unixepoch());

-- ==========================================
-- TUẦN 9: NGẮT (INTERRUPTS)
-- ==========================================
INSERT INTO quizzes (id, week_id, title, description, time_limit, passing_score, is_published, created_at) VALUES 
('quiz-09', 'week-09', 'Quiz Tuần 9: Ngắt (Interrupts)', 'Xử lý sự kiện tức thời với ngắt phần cứng attachInterrupt.', 15, 70, 1, unixepoch());

INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES 
('q09-01', 'quiz-09', 1, 'single', 'Lợi ích chính của việc dùng Interrupt là gì?', '["Tiết kiệm pin","Không bỏ lỡ sự kiện quan trọng","Code ngắn hơn","Tăng dung lượng RAM"]', '1', 'Interrupt giúp vi điều khiển xử lý ngay lập tức sự kiện (như nút nhấn) mà không cần kiểm tra liên tục (polling), tránh bỏ lỡ tín hiệu ngắn.', 10, unixepoch()),
('q09-02', 'quiz-09', 2, 'single', 'Arduino Uno có mấy chân ngắt ngoài (hardware interrupt)?', '["1 (chân 2)","2 (chân 2 và 3)","Tất cả các chân","4 chân"]', '1', 'Uno chỉ có 2 chân ngắt ngoài là Digital 2 (INT0) và Digital 3 (INT1).', 10, unixepoch()),
('q09-03', 'quiz-09', 3, 'single', 'Chế độ ngắt `RISING` kích hoạt khi nào?', '["Khi tín hiệu ở mức CAO","Khi tín hiệu chuyển từ THẤP lên CAO","Khi tín hiệu chuyển từ CAO xuống THẤP","Khi tín hiệu thay đổi bất kỳ"]', '1', 'RISING trigger ngắt tại sườn dương (Low -> High).', 10, unixepoch()),
('q09-04', 'quiz-09', 4, 'truefalse', 'Trong hàm ngắt (ISR), nên sử dụng `delay()` để chống dội nút nhấn.', '["Đúng","Sai"]', '1', 'SAI. `delay()` dựa vào ngắt Timer, mà trong ISR các ngắt khác bị vô hiệu hóa, nên `delay()` sẽ gây treo chương trình. Không được dùng delay trong ISR.', 10, unixepoch()),
('q09-05', 'quiz-09', 5, 'single', 'Biến toàn cục dùng trong ISR cần khai báo từ khóa gì?', '["static","const","volatile","extern"]', '2', '`volatile` báo cho trình biên dịch biết biến có thể thay đổi bất ngờ (bởi ngắt), tránh việc tối ưu hóa sai.', 10, unixepoch());

-- ==========================================
-- TUẦN 10: LƯU TRỮ & EEPROM
-- ==========================================
INSERT INTO quizzes (id, week_id, title, description, time_limit, passing_score, is_published, created_at) VALUES 
('quiz-10', 'week-10', 'Quiz Tuần 10: Bộ nhớ EEPROM', 'Lưu trữ dữ liệu vĩnh viễn ngay cả khi mất điện.', 15, 70, 1, unixepoch());

INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES 
('q10-01', 'quiz-10', 1, 'single', 'EEPROM là gì?', '["Bộ nhớ truy cập ngẫu nhiên","Bộ nhớ chỉ đọc","Bộ nhớ xóa được & ghi lại bằng điện","Bộ nhớ đệm CPU"]', '2', 'EEPROM (Electrically Erasable Programmable Read-Only Memory) là bộ nhớ non-volatile, giữ dữ liệu khi mất điện.', 10, unixepoch()),
('q10-02', 'quiz-10', 2, 'single', 'Dung lượng EEPROM của Arduino Uno là bao nhiêu?', '["32 KB","1 KB","2 KB","512 Bytes"]', '1', 'ATmega328P trên Uno có 1KB (1024 bytes) EEPROM.', 10, unixepoch()),
('q10-03', 'quiz-10', 3, 'single', 'Hàm `EEPROM.write(addr, val)` ghi được giá trị trong khoảng nào?', '["0-255 (1 byte)","0-1023 (10 bit)","Số thực","Chuỗi ký tự"]', '0', 'Hàm write chỉ ghi 1 byte (8-bit) tại một địa chỉ, giá trị từ 0 đến 255.', 10, unixepoch()),
('q10-04', 'quiz-10', 4, 'truefalse', 'EEPROM có tuổi thọ ghi/xóa vô hạn.', '["Đúng","Sai"]', '1', 'SAI. EEPROM thường có giới hạn khoảng 100,000 lần ghi/xóa per cell. Đọc thì vô hạn.', 10, unixepoch()),
('q10-05', 'quiz-10', 5, 'single', 'Để lưu số `int` (2 byte) vào EEPROM, ta nên dùng hàm nào tiện nhất?', '["EEPROM.write()","EEPROM.put()","EEPROM.update()","EEPROM.save()"]', '1', 'EEPROM.put() tự động xử lý đa byte cho các kiểu dữ liệu lớn hơn 1 byte.', 10, unixepoch());

-- ==========================================
-- TUẦN 11: GIAO TIẾP NÂNG CAO
-- ==========================================
INSERT INTO quizzes (id, week_id, title, description, time_limit, passing_score, is_published, created_at) VALUES 
('quiz-11', 'week-11', 'Quiz Tuần 11: SPI & UART', 'Các chuẩn giao tiếp dữ liệu nâng cao.', 15, 70, 1, unixepoch());

INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES 
('q11-01', 'quiz-11', 1, 'single', 'SPI nhanh hơn I2C đúng hay sai?', '["Đúng","Sai"]', '0', 'ĐÚNG. SPI là giao thức full-duplex đồng bộ tốc độ cao (MHz), nhanh hơn I2C (thường 100-400kHz).', 10, unixepoch()),
('q11-02', 'quiz-11', 2, 'single', 'Chân CS (Chip Select) trong SPI dùng để làm gì?', '["Cấp xung nhịp","Truyền dữ liệu","Chọn thiết bị slave cụ thể để giao tiếp","Nhận dữ liệu"]', '2', 'CS (hoặc SS) được Master kéo xuống LOW để chọn Slave cụ thể muốn giao tiếp.', 10, unixepoch()),
('q11-03', 'quiz-11', 3, 'single', 'Tốc độ Baud Rate 9600 nghĩa là gì?', '["9600 byte/giây","9600 bit/giây","9600 ký tự/giây","9600 xung/giây"]', '1', 'Baud rate là tốc độ truyền dẫn tính bằng bit trên giây (bps).', 10, unixepoch()),
('q11-04', 'quiz-11', 4, 'truefalse', 'UART là giao thức đồng bộ (có dây clock).', '["Đúng","Sai"]', '1', 'SAI. UART (Universal Asynchronous Receiver-Transmitter) là BẤT ĐỒNG BỘ, không có dây clock chung, hai bên phải thống nhất Baudrate.', 10, unixepoch()),
('q11-05', 'quiz-11', 5, 'single', 'MISO trong SPI là viết tắt của gì?', '["Master In Slave Out","Master Input Serial Output","Master Is Slave Owner","Mother In Son Out"]', '0', 'MISO = Master In Slave Out (Dữ liệu đi từ Slave về Master).', 10, unixepoch());

-- ==========================================
-- TUẦN 12: FINAL REVIEW
-- ==========================================
INSERT INTO quizzes (id, week_id, title, description, time_limit, passing_score, is_published, created_at) VALUES 
('quiz-12', 'week-12', 'Quiz Tuần 12: Tổng hợp kiến thức', 'Bài kiểm tra tổng hợp kiến thức toàn khóa học.', 20, 70, 1, unixepoch());

INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES 
('q12-01', 'quiz-12', 1, 'single', 'Để giảm tiêu thụ năng lượng tối đa cho Arduino dùng pin, ta nên làm gì?', '["Dùng delay()","Dùng thư viện LowPower để ngủ (Deep Sleep)","Tắt đèn LED nguồn","Cả B và C"]', '3', 'Kết hợp chế độ Deep Sleep và loại bỏ các linh kiện tiêu thụ điện thừa (như LED nguồn) là cách tối ưu nhất.', 10, unixepoch()),
('q12-02', 'quiz-12', 2, 'single', 'Watchdog Timer dùng để làm gì?', '["Đếm giờ làm việc","Tự động reset hế thống nếu bị treo","Hẹn giờ tắt máy","Đo thời gian chạy code"]', '1', 'Watchdog Timer (WDT) đếm ngược, nếu code không reset nó kịp thời (do bị treo), nó sẽ reset MCU để khôi phục hoạt động.', 10, unixepoch()),
('q12-03', 'quiz-12', 3, 'single', 'Khi dùng thư viện Serial, hai chân nào không nên dùng cho IO khác?', '["0 và 1","2 và 3","12 và 13","A4 và A5"]', '0', 'Chân 0 (RX) và 1 (TX) được nối với mạch USB-to-Serial, dùng chúng cho việc khác sẽ gây lỗi nạp code hoặc Serial Monitor.', 10, unixepoch()),
('q12-04', 'quiz-12', 4, 'single', ' millis() sẽ bị tràn (reset về 0) sau khoảng bao lâu?', '["50 phút","9 giờ","49.7 ngày","1 năm"]', '2', 'millis() trả về unsigned long (32-bit), max là ~4 tỷ ms, tương đương khoảng 49.7 ngày.', 10, unixepoch()),
('q12-05', 'quiz-12', 5, 'single', 'Điện áp tham chiếu mặc định của ADC trên Uno là bao nhiêu?', '["3.3V","5V","1.1V","12V"]', '1', 'Mặc định ADC dùng điện áp nguồn VCC (5V trên Uno) làm tham chiếu (AREF).', 10, unixepoch());
