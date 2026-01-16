-- ==========================================
-- QUIZZES & QUESTIONS cho Tuần 1-4
-- Generated: 2026-01-16
-- Run: npx wrangler d1 execute arduino-db --remote --file=src/db/seed_quizzes.sql
-- ==========================================

-- Xóa dữ liệu cũ trước khi insert (để có thể chạy lại)
DELETE FROM questions WHERE quiz_id IN ('quiz-01', 'quiz-02', 'quiz-03', 'quiz-04');
DELETE FROM quizzes WHERE id IN ('quiz-01', 'quiz-02', 'quiz-03', 'quiz-04');

-- ==========================================
-- QUIZ TUẦN 1: GPIO & LED
-- ==========================================
INSERT INTO quizzes (id, week_id, title, description, time_limit, passing_score, is_published, created_at) VALUES 
('quiz-01', 'week-01', 'Quiz Tuần 1: GPIO & Điều khiển LED', 
 'Kiểm tra kiến thức về Arduino Uno, GPIO, pinMode, digitalWrite và điều khiển LED.',
 15, 70, 1, unixepoch());

-- 10 câu hỏi tuần 1
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES 
-- Q1: Easy - Definition
('q01-01', 'quiz-01', 1, 'single', 
 'Hàm `pinMode(13, OUTPUT)` có tác dụng gì?',
 '["Đọc giá trị từ chân 13","Cấu hình chân 13 làm đầu ra","Bật LED ở chân 13","Tắt LED ở chân 13"]',
 '1',
 '`pinMode()` dùng để cấu hình chế độ của chân GPIO. Tham số OUTPUT nghĩa là chân này sẽ xuất tín hiệu ra ngoài (ví dụ: điều khiển LED). Hàm này chỉ cấu hình, không bật/tắt LED.',
 10, unixepoch()),

-- Q2: Easy - Definition
('q01-02', 'quiz-01', 2, 'single', 
 'Arduino Uno sử dụng vi điều khiển nào?',
 '["ESP32","ATmega328P","STM32","Raspberry Pi"]',
 '1',
 'Arduino Uno sử dụng chip ATmega328P với tần số 16MHz, 32KB Flash, 2KB SRAM. Đây là MCU phổ biến nhất cho người mới bắt đầu học lập trình nhúng.',
 10, unixepoch()),

-- Q3: Easy - TrueFalse
('q01-03', 'quiz-01', 3, 'truefalse', 
 'Hàm `setup()` được gọi lặp đi lặp lại vô hạn trong chương trình Arduino.',
 '["Đúng","Sai"]',
 '1',
 'SAI. `setup()` chỉ chạy MỘT LẦN DUY NHẤT khi Arduino khởi động. Hàm `loop()` mới là hàm chạy lặp lại vô hạn.',
 10, unixepoch()),

-- Q4: Medium - Code Analysis
('q01-04', 'quiz-01', 4, 'single', 
 'Đoạn code sau sẽ làm LED nháy với tần số bao nhiêu?\n```cpp\ndigitalWrite(LED, HIGH);\ndelay(500);\ndigitalWrite(LED, LOW);\ndelay(500);\n```',
 '["0.5 Hz","1 Hz","2 Hz","500 Hz"]',
 '1',
 'Một chu kỳ = 500ms ON + 500ms OFF = 1000ms = 1 giây. Tần số f = 1/T = 1/1s = 1 Hz (1 lần nháy mỗi giây).',
 10, unixepoch()),

-- Q5: Medium - Calculation
('q01-05', 'quiz-01', 5, 'single', 
 'Với LED đỏ (Vled = 2V) và nguồn 5V, dòng mong muốn 20mA, điện trở hạn dòng cần dùng là bao nhiêu?',
 '["100Ω","150Ω","220Ω","330Ω"]',
 '1',
 'Áp dụng công thức: R = (Vnguồn - Vled) / I = (5V - 2V) / 0.02A = 3V / 0.02A = 150Ω. Trong thực tế thường dùng 220Ω để an toàn hơn.',
 10, unixepoch()),

-- Q6: Medium - Code Analysis
('q01-06', 'quiz-01', 6, 'single', 
 'Lệnh `digitalWrite(LED_PIN, HIGH)` làm gì?',
 '["Đọc trạng thái LED","Xuất điện áp 5V ra chân LED_PIN","Xuất điện áp 0V ra chân","Cấu hình chân làm OUTPUT"]',
 '1',
 '`digitalWrite(pin, HIGH)` xuất mức logic CAO (5V với Arduino Uno) ra chân được chỉ định. HIGH = 5V, LOW = 0V. Đây là cách bật LED (nếu nối đúng).',
 10, unixepoch()),

-- Q7: Medium - Debugging
('q01-07', 'quiz-01', 7, 'multiple', 
 'LED không sáng dù code đúng. Chọn TẤT CẢ nguyên nhân có thể:',
 '["LED cắm ngược chiều","Quên gọi pinMode()","Thiếu điện trở hạn dòng","Dùng delay() quá lâu"]',
 '[0,1,2]',
 'LED cắm ngược, quên pinMode(), hoặc thiếu điện trở đều có thể khiến LED không sáng. delay() dù bao lâu cũng không ảnh hưởng việc LED có sáng hay không.',
 10, unixepoch()),

-- Q8: Medium - Code
('q01-08', 'quiz-01', 8, 'single', 
 'Để điều khiển 5 LED (D2-D6), cách nào hiệu quả nhất?',
 '["Dùng 5 biến riêng: led1, led2...","Dùng mảng: int leds[] = {2,3,4,5,6}","Dùng 5 hàm khác nhau","Không cần khai báo biến"]',
 '1',
 'Dùng MẢNG giúp code gọn, dễ mở rộng, và có thể dùng vòng lặp for để xử lý. Đây là best practice khi điều khiển nhiều thiết bị cùng loại.',
 10, unixepoch()),

-- Q9: Hard - Troubleshooting
('q01-09', 'quiz-01', 9, 'single', 
 'LED nháy đúng 1 lần rồi tắt hẳn. Nguyên nhân có thể là gì?',
 '["Code nằm trong setup() thay vì loop()","Điện trở quá lớn","Thiếu GND chung","Chân không hỗ trợ PWM"]',
 '0',
 'Nếu code điều khiển LED nằm trong `setup()`, nó chỉ chạy 1 lần rồi dừng. Code cần đặt trong `loop()` để lặp liên tục. Các lỗi khác không gây ra hiện tượng này.',
 10, unixepoch()),

-- Q10: Hard - Design
('q01-10', 'quiz-01', 10, 'truefalse', 
 'Hàm `delay()` có nhược điểm là "blocking" - CPU không thể làm việc khác trong lúc chờ.',
 '["Đúng","Sai"]',
 '0',
 'ĐÚNG. delay() là blocking - CPU hoàn toàn tạm dừng, không thể đọc nút nhấn, cảm biến hay xử lý Serial trong lúc delay. Tuần sau sẽ học millis() để khắc phục.',
 10, unixepoch());

-- ==========================================
-- QUIZ TUẦN 2: LED 7 ĐOẠN & THIẾT KẾ
-- ==========================================
INSERT INTO quizzes (id, week_id, title, description, time_limit, passing_score, is_published, created_at) VALUES 
('quiz-02', 'week-02', 'Quiz Tuần 2: LED 7 Đoạn & Phương pháp Thiết kế', 
 'Kiểm tra kiến thức về phương pháp Top-Down/Bottom-Up, LED 7 đoạn, Multiplexing và 74HC595.',
 15, 70, 1, unixepoch());

-- 10 câu hỏi tuần 2
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES 
-- Q1: Easy
('q02-01', 'quiz-02', 1, 'single', 
 'Phương pháp thiết kế nào bắt đầu từ yêu cầu tổng thể rồi chia nhỏ thành module?',
 '["Bottom-Up","Top-Down","Waterfall","Agile"]',
 '1',
 'Top-Down bắt đầu từ bức tranh tổng thể, chia nhỏ dần thành các module. Bottom-Up ngược lại: làm từng module nhỏ rồi ghép lại.',
 10, unixepoch()),

-- Q2: Easy
('q02-02', 'quiz-02', 2, 'single', 
 'LED 7 đoạn Common Cathode cần tín hiệu gì để bật một segment?',
 '["LOW (0V)","HIGH (5V)","PWM 50%","Analog"]',
 '1',
 'Common Cathode = chân chung nối GND. Để bật segment, cần đưa tín hiệu HIGH (5V) vào chân đó. Common Anode thì ngược lại: bật bằng LOW.',
 10, unixepoch()),

-- Q3: Easy - TrueFalse
('q02-03', 'quiz-02', 3, 'truefalse', 
 'LED 7 đoạn có tổng cộng 7 segment không tính dấu chấm (dp).',
 '["Đúng","Sai"]',
 '0',
 'ĐÚNG. LED 7 đoạn có 7 segment (a, b, c, d, e, f, g) để hiển thị số 0-9. Dấu chấm (dp) là segment thứ 8 tùy chọn.',
 10, unixepoch()),

-- Q4: Medium - Code
('q02-04', 'quiz-02', 4, 'single', 
 'Mã segment `0b00111111` (hex: 0x3F) hiển thị số nào trên LED 7 đoạn Common Cathode?',
 '["Số 0","Số 6","Số 8","Số 9"]',
 '0',
 '0b00111111 bật segments a,b,c,d,e,f (6 segment, g tắt) → hiển thị số 0. Số 8 cần bật cả 7 segment (0x7F).',
 10, unixepoch()),

-- Q5: Medium
('q02-05', 'quiz-02', 5, 'single', 
 'Kỹ thuật Multiplexing trong LED 7 đoạn 4 số hoạt động như thế nào?',
 '["Bật tất cả 4 số cùng lúc","Bật từng số luân phiên rất nhanh","Dùng 4 Arduino khác nhau","Chỉ hiển thị 1 số"]',
 '1',
 'Multiplexing bật từng digit luân phiên với tốc độ >50Hz. Mắt người không nhận ra sự nhấp nháy, tưởng như 4 số sáng cùng lúc.',
 10, unixepoch()),

-- Q6: Medium
('q02-06', 'quiz-02', 6, 'single', 
 'IC 74HC595 giúp giảm số chân Arduino cần dùng bằng cách nào?',
 '["Tăng điện áp","Chuyển 3 chân thành 8 output","Giảm dòng tiêu thụ","Tăng tốc độ xử lý"]',
 '1',
 '74HC595 là shift register 8-bit. Chỉ cần 3 chân Arduino (Data, Clock, Latch) để điều khiển 8 output. Có thể nối nhiều IC liên tiếp.',
 10, unixepoch()),

-- Q7: Medium
('q02-07', 'quiz-02', 7, 'single', 
 'Khi nào nên dùng phương pháp Bottom-Up?',
 '["Dự án lớn, nhiều người","Học module mới, thử nghiệm","Viết tài liệu","Họp brainstorm"]',
 '1',
 'Bottom-Up phù hợp khi học module mới, thử nghiệm từng phần trước khi ghép. Top-Down phù hợp dự án lớn, cần nhìn tổng thể.',
 10, unixepoch()),

-- Q8: Multiple
('q02-08', 'quiz-02', 8, 'multiple', 
 'Chọn TẤT CẢ thông tin đúng về 74HC595:',
 '["Là IC shift register 8-bit","Cần 8 chân Arduino để điều khiển","Có thể nối nhiều IC liên tiếp","Output là analog"]',
 '[0,2]',
 '74HC595 là shift register 8-bit, chỉ cần 3 chân Arduino, có thể cascade nhiều IC. Output là digital (HIGH/LOW), không phải analog.',
 10, unixepoch()),

-- Q9: Hard
('q02-09', 'quiz-02', 9, 'single', 
 'Module 4 LED 7 đoạn nếu điều khiển trực tiếp (không multiplexing) cần bao nhiêu chân?',
 '["8 chân","12 chân","28 chân","32 chân"]',
 '3',
 '4 số × 8 segment (a-g + dp) = 32 chân. Quá nhiều! Vì vậy phải dùng Multiplexing: 8 chân segment chung + 4 chân digit = 12 chân.',
 10, unixepoch()),

-- Q10: Hard
('q02-10', 'quiz-02', 10, 'single', 
 'LED 7 đoạn hiển thị nhấp nháy (flicker). Nguyên nhân có thể là:',
 '["Tần số quét quá cao","Tần số quét quá thấp (<50Hz)","Điện trở quá nhỏ","Thiếu capacitor"]',
 '1',
 'Nếu tần số quét < 50Hz, mắt người nhận ra sự bật/tắt → nhấp nháy. Cần quét nhanh hơn (mỗi digit < 5ms delay).',
 10, unixepoch());

-- ==========================================
-- QUIZ TUẦN 3: NÚT NHẤN & KEYPAD
-- ==========================================
INSERT INTO quizzes (id, week_id, title, description, time_limit, passing_score, is_published, created_at) VALUES 
('quiz-03', 'week-03', 'Quiz Tuần 3: Nút Nhấn & Keypad', 
 'Kiểm tra kiến thức về INPUT_PULLUP, debounce, edge detection và keypad matrix.',
 15, 70, 1, unixepoch());

-- 10 câu hỏi tuần 3
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES 
-- Q1: Easy
('q03-01', 'quiz-03', 1, 'single', 
 '`pinMode(BTN, INPUT_PULLUP)` kích hoạt điện trở nội bên trong MCU. Giá trị mặc định của chân khi không nhấn nút là:',
 '["LOW (0V)","HIGH (5V)","Không xác định","Analog"]',
 '1',
 'INPUT_PULLUP kéo chân lên HIGH khi không có gì nối. Khi nhấn nút (nối xuống GND), chân trở thành LOW. Logic ĐẢO so với suy nghĩ thông thường.',
 10, unixepoch()),

-- Q2: Easy
('q03-02', 'quiz-03', 2, 'single', 
 'Hiện tượng "bouncing" của nút nhấn là gì?',
 '["Nút bị kẹt","Tín hiệu dao động nhiều lần khi nhấn/nhả","Nút không phản hồi","Nút tự động nhấn"]',
 '1',
 'Khi nhấn/nhả nút cơ học, tiếp điểm kim loại dao động (bounce) tạo ra nhiều xung ON/OFF trong vài mili-giây. Code cần debounce để lọc.',
 10, unixepoch()),

-- Q3: TrueFalse
('q03-03', 'quiz-03', 3, 'truefalse', 
 'Với INPUT_PULLUP, khi nhấn nút thì digitalRead() trả về LOW.',
 '["Đúng","Sai"]',
 '0',
 'ĐÚNG. INPUT_PULLUP = logic đảo. Không nhấn → HIGH. Nhấn (nối GND) → LOW. Đây là điều quan trọng cần nhớ khi viết code.',
 10, unixepoch()),

-- Q4: Medium
('q03-04', 'quiz-03', 4, 'single', 
 'Cách debounce đơn giản nhất là gì?',
 '["Dùng delay() sau khi đọc nút","Dùng phần cứng capacitor","Dùng interrupt","Đọc nút nhiều lần liên tục"]',
 '0',
 'Debounce đơn giản: sau khi phát hiện thay đổi, delay 10-50ms rồi đọc lại. Tuy blocking nhưng dễ hiểu. Hardware debounce dùng RC filter.',
 10, unixepoch()),

-- Q5: Medium - Code
('q03-05', 'quiz-03', 5, 'single', 
 'Edge Detection: Để phát hiện lúc NHẢ nút (rising edge với PULLUP), cần so sánh:',
 '["currentState == LOW","currentState == HIGH && lastState == LOW","currentState == LOW && lastState == HIGH","currentState != lastState"]',
 '1',
 'Rising edge = từ LOW lên HIGH. Với PULLUP: LOW = đang nhấn, HIGH = đã nhả. Điều kiện: hiện tại HIGH và trước đó LOW → vừa nhả.',
 10, unixepoch()),

-- Q6: Medium
('q03-06', 'quiz-03', 6, 'single', 
 'Keypad 4x4 có bao nhiêu phím nhưng chỉ cần bao nhiêu chân Arduino?',
 '["16 phím - 16 chân","16 phím - 8 chân","12 phím - 7 chân","16 phím - 4 chân"]',
 '1',
 'Keypad 4x4 = 16 phím, sử dụng ma trận: 4 hàng + 4 cột = 8 chân. Keypad 4x3 (12 phím) dùng 7 chân (4 hàng + 3 cột).',
 10, unixepoch()),

-- Q7: Medium
('q03-07', 'quiz-03', 7, 'single', 
 'Keypad hoạt động theo nguyên lý nào?',
 '["Quét ma trận hàng-cột","Mỗi phím 1 chân riêng","Giao tiếp I2C","Giao tiếp UART"]',
 '0',
 'Keypad dùng ma trận: đặt từng hàng LOW, đọc các cột để xác định phím nào được nhấn. Giảm số chân từ 16 xuống 8.',
 10, unixepoch()),

-- Q8: Multiple
('q03-08', 'quiz-03', 8, 'multiple', 
 'Chọn TẤT CẢ cách debounce hiệu quả:',
 '["delay() sau khi phát hiện thay đổi","Dùng millis() kiểm tra khoảng thời gian","Đọc nút 1 lần duy nhất","Hardware RC filter"]',
 '[0,1,3]',
 'Debounce có thể bằng delay() (blocking), millis() (non-blocking), hoặc hardware RC. Đọc 1 lần không debounce được vì chưa lọc bounce.',
 10, unixepoch()),

-- Q9: Hard
('q03-09', 'quiz-03', 9, 'single', 
 'Trong State Machine xử lý nút nhấn, các trạng thái cơ bản thường là:',
 '["ON, OFF","IDLE, PRESSED, RELEASED","HIGH, LOW, MIDDLE","START, STOP"]',
 '1',
 'State Machine cho nút: IDLE (chờ), PRESSED (đang nhấn), RELEASED (đã nhả). Có thể thêm DEBOUNCE, HELD (giữ lâu).',
 10, unixepoch()),

-- Q10: Hard
('q03-10', 'quiz-03', 10, 'single', 
 'Lỗi "ghost key" trên keypad xảy ra khi:',
 '["Nhấn 1 phím mà MCU nhận nhiều phím","Không nhấn mà MCU nhận phím","Keypad bị hỏng","Thiếu debounce"]',
 '0',
 'Ghost key xảy ra khi nhấn nhiều phím cùng lúc trên keypad không có diode, tạo "đường tắt" điện khiến MCU đọc sai. Giải pháp: keypad có diode hoặc hạn chế nhấn nhiều phím.',
 10, unixepoch());

-- ==========================================
-- QUIZ TUẦN 4: ADC & PWM
-- ==========================================
INSERT INTO quizzes (id, week_id, title, description, time_limit, passing_score, is_published, created_at) VALUES 
('quiz-04', 'week-04', 'Quiz Tuần 4: ADC & PWM (Analog I/O)', 
 'Kiểm tra kiến thức về analogRead, analogWrite, PWM, duty cycle và hàm map().',
 15, 70, 1, unixepoch());

-- 10 câu hỏi tuần 4
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES 
-- Q1: Easy
('q04-01', 'quiz-04', 1, 'single', 
 'ADC trên Arduino Uno có độ phân giải bao nhiêu bit?',
 '["8-bit (0-255)","10-bit (0-1023)","12-bit (0-4095)","16-bit"]',
 '1',
 'Arduino Uno có ADC 10-bit, cho giá trị từ 0 (0V) đến 1023 (5V). Độ phân giải = 5V/1024 ≈ 4.88mV.',
 10, unixepoch()),

-- Q2: Easy
('q04-02', 'quiz-04', 2, 'single', 
 '`analogRead(A0)` trả về giá trị trong khoảng nào?',
 '["0-100","0-255","0-1023","0-5"]',
 '2',
 'analogRead() trả về giá trị 10-bit: 0 (ứng 0V) đến 1023 (ứng 5V). Đây là giá trị số nguyên, không phải điện áp.',
 10, unixepoch()),

-- Q3: Easy - TrueFalse
('q04-03', 'quiz-04', 3, 'truefalse', 
 'Arduino Uno có thể xuất tín hiệu analog thực sự (DAC) qua các chân digital.',
 '["Đúng","Sai"]',
 '1',
 'SAI. Arduino Uno KHÔNG có DAC. analogWrite() thực ra xuất PWM (bật/tắt nhanh) để MÔ PHỎNG analog. LED mờ vì mắt người trung bình hóa.',
 10, unixepoch()),

-- Q4: Medium
('q04-04', 'quiz-04', 4, 'single', 
 'PWM với duty cycle 75% nghĩa là gì?',
 '["Tín hiệu HIGH 75% thời gian, LOW 25%","Tín hiệu LOW 75% thời gian","Điện áp ra 75V","Tần số 75Hz"]',
 '0',
 'Duty cycle = tỷ lệ thời gian HIGH. 75% duty = HIGH 75% thời gian, LOW 25%. Điện áp trung bình ≈ 5V × 75% = 3.75V.',
 10, unixepoch()),

-- Q5: Medium
('q04-05', 'quiz-04', 5, 'single', 
 '`analogWrite(pin, 127)` xuất xấp xỉ bao nhiêu volt trung bình?',
 '["~1.25V","~2.5V","~3.75V","~5V"]',
 '1',
 'analogWrite() nhận giá trị 0-255. 127 ≈ 50% duty cycle. Điện áp trung bình ≈ 5V × 50% = 2.5V.',
 10, unixepoch()),

-- Q6: Medium - Code
('q04-06', 'quiz-04', 6, 'single', 
 '`map(512, 0, 1023, 0, 255)` trả về giá trị nào?',
 '["128","127","256","512"]',
 '1',
 'map() chuyển đổi tuyến tính. 512/1023 ≈ 50% → 50% của 255 ≈ 127. Công thức: (512-0)×(255-0)/(1023-0) + 0 ≈ 127.',
 10, unixepoch()),

-- Q7: Medium
('q04-07', 'quiz-04', 7, 'single', 
 'Những chân nào trên Arduino Uno hỗ trợ PWM (analogWrite)?',
 '["Tất cả chân digital","Chỉ A0-A5","Chân có dấu ~ (3,5,6,9,10,11)","Chỉ chân 13"]',
 '2',
 'Arduino Uno có 6 chân PWM, đánh dấu bằng ký hiệu ~ trên board: D3, D5, D6, D9, D10, D11. Không phải tất cả chân digital đều có PWM.',
 10, unixepoch()),

-- Q8: Multiple
('q04-08', 'quiz-04', 8, 'multiple', 
 'Chọn TẤT CẢ ứng dụng thực tế của PWM:',
 '["Điều khiển độ sáng LED","Điều khiển tốc độ motor DC","Đọc giá trị cảm biến","Tạo âm thanh buzzer"]',
 '[0,1,3]',
 'PWM dùng để: điều khiển LED, motor, servo, buzzer (âm thanh). ĐỌC cảm biến dùng ADC (analogRead), không phải PWM.',
 10, unixepoch()),

-- Q9: Hard
('q04-09', 'quiz-04', 9, 'single', 
 'Biến trở (potentiometer) 10kΩ nối giữa 5V và GND, chân giữa nối A0. Khi vặn về giữa, analogRead(A0) xấp xỉ:',
 '["0","255","512","1023"]',
 '2',
 'Vặn về giữa = chia đôi điện áp = 2.5V. ADC 10-bit: 2.5V/5V × 1023 ≈ 512. Vặn hết về GND = 0, vặn hết về 5V = 1023.',
 10, unixepoch()),

-- Q10: Hard
('q04-10', 'quiz-04', 10, 'single', 
 'Để điều khiển độ sáng LED bằng biến trở, cần những gì?',
 '["analogRead() → analogWrite() trực tiếp","analogRead() → map() → analogWrite()","Chỉ cần digitalRead()","Chỉ cần digitalWrite()"]',
 '1',
 'ADC trả về 0-1023, nhưng PWM nhận 0-255. Cần dùng map(sensorValue, 0, 1023, 0, 255) để chuyển đổi trước khi analogWrite().',
 10, unixepoch());
