-- Seed Quizzes for 12 Weeks (Arduino Starter 2026)

-- Week 1: Foundation
INSERT OR REPLACE INTO quizzes (id, week_id, title, description, time_limit, passing_score, is_published) VALUES 
('quiz-week-01', 'week-01', 'Quiz 1: Nhập môn & Phần cứng', 'Kiểm tra kiến thức về Uno R3 vs ESP32, Pinout và IDE.', 15, 80, 1);

INSERT OR REPLACE INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points) VALUES 
('quiz-week-01-q1', 'quiz-week-01', 1, 'single', 'Arduino Uno sử dụng vi điều khiển nào?', '["ATmega328P","ESP32","STM32","8051"]', '["ATmega328P"]', 'Arduino Uno R3 sử dụng chip ATmega328P 8-bit.', 10),
('quiz-week-01-q2', 'quiz-week-01', 2, 'single', 'Điện áp logic của ESP32 là bao nhiêu?', '["5V","3.3V","12V","1.8V"]', '["3.3V"]', 'ESP32 hoạt động ở mức logic 3.3V, khác với Uno là 5V.', 10),
('quiz-week-01-q3', 'quiz-week-01', 3, 'truefalse', 'Chân VIN dùng để cấp nguồn pin 9V cho mạch Uno?', '["True","False"]', '["True"]', 'Đúng, chân VIN chấp nhận đầu vào 7-12V.', 10),
('quiz-week-01-q4', 'quiz-week-01', 4, 'single', 'Chân nào có chức năng PWM trên Uno?', '["3, 5, 6, 9, 10, 11","1, 2, 4","A0-A5","Chỉ chân 13"]', '["3, 5, 6, 9, 10, 11"]', 'Các chân có dấu ngã (~) hỗ trợ PWM.', 10),
('quiz-week-01-q5', 'quiz-week-01', 5, 'single', 'Hàm nào chạy 1 lần khi khởi động?', '["loop()","setup()","main()","start()"]', '["setup()"]', 'setup() chạy duy nhất 1 lần đầu tiên để cài đặt.', 10);

-- Week 2: GPIO
INSERT OR REPLACE INTO quizzes (id, week_id, title, description, time_limit, passing_score, is_published) VALUES 
('quiz-week-02', 'week-02', 'Quiz 2: GPIO & Logic', 'Kiểm tra kiến thức về Digital I/O, Pull-up resistor và Lập trình cơ bản.', 15, 80, 1);

INSERT OR REPLACE INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points) VALUES 
('quiz-week-02-q1', 'quiz-week-02', 1, 'single', 'INPUT_PULLUP làm gì?', '["Treo chân lên 5V/3.3V","Nối đất","Tăng dòng điện","Chống rung"]', '["Treo chân lên 5V/3.3V"]', 'Nó kích hoạt điện trở nội nối lên nguồn để tránh trạng thái thả nổi (floating).', 10),
('quiz-week-02-q2', 'quiz-week-02', 2, 'truefalse', 'delay(1000) dừng chương trình trong 1 giây?', '["True","False"]', '["True"]', 'Đúng, nó chặn (block) CPU trong 1000ms.', 10),
('quiz-week-02-q3', 'quiz-week-02', 3, 'single', 'LED chân dài là cực gì?', '["Dương (Anode)","Âm (Cathode)","Mass","Tín hiệu"]', '["Dương (Anode)"]', 'Chân dài là Anode (+), chân ngắn là Cathode (-).', 10),
('quiz-week-02-q4', 'quiz-week-02', 4, 'single', 'Để xuất tín hiệu ra chân 13, dùng lệnh gì trước?', '["pinMode(13, OUTPUT)","digitalWrite(13, HIGH)","Serial.begin(9600)","delay(100)"]', '["pinMode(13, OUTPUT)"]', 'Phải cấu hình chiều (Mode) là OUTPUT trước khi ghi.', 10),
('quiz-week-02-q5', 'quiz-week-02', 5, 'single', 'Logic 1 (HIGH) trên ESP32 tương đương mấy Volt?', '["5V","3.3V","0V","12V"]', '["3.3V"]', 'ESP32 dùng mức logic 3.3V.', 10);

-- Week 3: Analog & PWM
INSERT OR REPLACE INTO quizzes (id, week_id, title, description, time_limit, passing_score, is_published) VALUES 
('quiz-week-03', 'week-03', 'Quiz 3: Analog & PWM', 'Kiểm tra kiến thức về ADC, PWM và xử lý tín hiệu.', 15, 80, 1);

INSERT OR REPLACE INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points) VALUES 
('quiz-week-03-q1', 'quiz-week-03', 1, 'single', 'Hàm analogRead() trên Uno trả về giá trị bao nhiêu?', '["0-1023","0-255","0-4095","TRUE/FALSE"]', '["0-1023"]', 'Uno có ADC 10-bit (2^10 = 1024 giá trị).', 10),
('quiz-week-03-q2', 'quiz-week-03', 2, 'single', 'Hàm ledcWrite() dùng cho board nào?', '["Uno","ESP32","Nano","Mega"]', '["ESP32"]', 'ESP32 dùng LEDC để tạo PWM, khác với analogWrite của Uno.', 10),
('quiz-week-03-q3', 'quiz-week-03', 3, 'truefalse', 'Biến trở (Potentiometer) là linh kiện Digital?', '["True","False"]', '["False"]', 'Biến trở là linh kiện Analog, thay đổi điện trở liên tục.', 10),
('quiz-week-03-q4', 'quiz-week-03', 4, 'single', 'Độ phân giải ADC của ESP32 mặc định là bao nhiêu?', '["8-bit","10-bit","12-bit","16-bit"]', '["12-bit"]', 'ESP32 có ADC 12-bit, giá trị từ 0-4095.', 10),
('quiz-week-03-q5', 'quiz-week-03', 5, 'single', 'PWM dùng để làm gì?', '["Điều chỉnh độ sáng LED","Đọc nhiệt độ","Giao tiếp WiFi","Cấp nguồn"]', '["Điều chỉnh độ sáng LED"]', 'Pulse Width Modulation thay đổi độ rộng xung để giả lập điện áp trung bình.', 10);

-- Week 4: Displays
INSERT OR REPLACE INTO quizzes (id, week_id, title, description, time_limit, passing_score, is_published) VALUES 
('quiz-week-04', 'week-04', 'Quiz 4: Hiển thị LED 7 đoạn', 'Kiểm tra kiến thức về điều khiển hiển thị số.', 15, 80, 1);

INSERT OR REPLACE INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points) VALUES 
('quiz-week-04-q1', 'quiz-week-04', 1, 'single', 'LED 7 đoạn có mấy thanh LED đơn?', '["7","8 (tính cả dấu chấm)","10","16"]', '["8 (tính cả dấu chấm)"]', 'Gồm a,b,c,d,e,f,g và dp (dot point).', 10),
('quiz-week-04-q2', 'quiz-week-04', 2, 'single', 'Loại Anode chung (Common Anode) nối chân chung vào đâu?', '["VCC","GND","Chân tín hiệu","Không nối"]', '["VCC"]', 'Anode chung nối lên nguồn, các chân a-g nối đất (LOW) để sáng.', 10),
('quiz-week-04-q3', 'quiz-week-04', 3, 'truefalse', 'Có thể quét LED (Multiplexing) để tiết kiệm chân?', '["True","False"]', '["True"]', 'Đúng, quét nhanh từng LED để mắt người thấy như đang sáng cùng lúc.', 10),
('quiz-week-04-q4', 'quiz-week-04', 4, 'single', 'IC nào hay dùng để mở rộng chân cho LED 7 đoạn?', '["74HC595","LM358","NE555","TL072"]', '["74HC595"]', 'Shift Register 74HC595 rất phổ biến để điều khiển nhiều LED.', 10),
('quiz-week-04-q5', 'quiz-week-04', 5, 'single', 'Mỗi thanh LED cần gì để bảo vệ?', '["Điện trở hạn dòng","Tụ điện","Cuộn cảm","Transistor"]', '["Điện trở hạn dòng"]', 'Cần điện trở nối tiếp để tránh cháy LED.', 10);

-- Week 5: Sensors
INSERT OR REPLACE INTO quizzes (id, week_id, title, description, time_limit, passing_score, is_published) VALUES 
('quiz-week-05', 'week-05', 'Quiz 5: Cảm biến & Thư viện', 'Kiểm tra kiến thức về sử dụng thư viện và cảm biến môi trường.', 15, 80, 1);

INSERT OR REPLACE INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points) VALUES 
('quiz-week-05-q1', 'quiz-week-05', 1, 'single', 'DHT11 đo được gì?', '["Nhiệt độ & Độ ẩm","Ánh sáng","Khoảng cách","Âm thanh"]', '["Nhiệt độ & Độ ẩm"]', 'Digital Humidity & Temperature sensor.', 10),
('quiz-week-05-q2', 'quiz-week-05', 2, 'single', 'Chân DATA của DHT11 cần nối gì?', '["Điện trở kéo lên (Pull-up)","Điện trở kéo xuống","Nối thẳng GND","Tụ điện"]', '["Điện trở kéo lên (Pull-up)"]', 'Để đảm bảo tín hiệu ổn định khi không truyền.', 10),
('quiz-week-05-q3', 'quiz-week-05', 3, 'single', 'Hàm dht.readTemperature() trả về kiểu dữ liệu gì?', '["float","int","String","char"]', '["float"]', 'Trả về số thực (ví dụ 28.5 độ).', 10),
('quiz-week-05-q4', 'quiz-week-05', 4, 'truefalse', 'Cảm biến siêu âm HC-SR04 dùng tia laser?', '["True","False"]', '["False"]', 'Nó dùng sóng âm tần số cao (ultrasonic).', 10),
('quiz-week-05-q5', 'quiz-week-05', 5, 'single', 'Thư viện giúp ích gì?', '["Tiết kiệm thời gian code","Làm code chạy chậm","Tốn bộ nhớ","Bắt buộc dùng"]', '["Tiết kiệm thời gian code"]', 'Thư viện đóng gói các chức năng phức tạp để tái sử dụng dễ dàng.', 10);

-- Week 6: Motors
INSERT OR REPLACE INTO quizzes (id, week_id, title, description, time_limit, passing_score, is_published) VALUES 
('quiz-week-06', 'week-06', 'Quiz 6: Động cơ & Servo', 'Kiểm tra kiến thức về điều khiển chuyển động.', 15, 80, 1);

INSERT OR REPLACE INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points) VALUES 
('quiz-week-06-q1', 'quiz-week-06', 1, 'single', 'Servo Motor quay được góc bao nhiêu?', '["0-180 độ","360 độ liên tục","Vô tận","Chỉ 90 độ"]', '["0-180 độ"]', 'Servo thông thường (SG90) quay góc giới hạn 0-180.', 10),
('quiz-week-06-q2', 'quiz-week-06', 2, 'single', 'Chân tín hiệu Servo thường màu gì?', '["Cam/Vàng","Đỏ","Nâu/Đen","Xanh"]', '["Cam/Vàng"]', 'Cam/Vàng: Signal, Đỏ: VCC, Nâu/Đen: GND.', 10),
('quiz-week-06-q3', 'quiz-week-06', 3, 'single', 'Để điều khiển động cơ DC dòng lớn, cần gì?', '["Mạch cầu H (H-Bridge)","Nối trực tiếp vi điều khiển","Điện trở","Tụ điện"]', '["Mạch cầu H (H-Bridge)"]', 'Vi điều khiển không đủ dòng, cần Driver như L298N.', 10),
('quiz-week-06-q4', 'quiz-week-06', 4, 'truefalse', 'Động cơ bước (Stepper) có độ chính xác cao hơn DC?', '["True","False"]', '["True"]', 'Đúng, nó di chuyển theo từng bước (step) chính xác.', 10),
('quiz-week-06-q5', 'quiz-week-06', 5, 'single', 'Relay dùng để làm gì?', '["Đóng ngắt thiết bị điện áp cao","Lọc nhiễu","Tăng áp","Đo dòng điện"]', '["Đóng ngắt thiết bị điện áp cao"]', 'Dùng tín hiệu nhỏ để điều khiển công tắc điện lớn.', 10);

-- Week 7: Serial
INSERT OR REPLACE INTO quizzes (id, week_id, title, description, time_limit, passing_score, is_published) VALUES 
('quiz-week-07', 'week-07', 'Quiz 7: Giao tiếp UART', 'Kiểm tra kiến thức về giao tiếp nối tiếp.', 15, 80, 1);

INSERT OR REPLACE INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points) VALUES 
('quiz-week-07-q1', 'quiz-week-07', 1, 'single', 'UART viết tắt của gì?', '["Universal Asynchronous Receiver/Transmitter","USB Arduino Real Time","Unified Auto Radio","Không có nghĩa"]', '["Universal Asynchronous Receiver/Transmitter"]', 'Giao thức truyền nhận không đồng bộ đa năng.', 10),
('quiz-week-07-q2', 'quiz-week-07', 2, 'single', 'Tốc độ baud rate phổ biến nhất là bao nhiêu?', '["9600","115200","300","1000000"]', '["9600"]', '9600 bps là mặc định trong nhiều ví dụ Arduino.', 10),
('quiz-week-07-q3', 'quiz-week-07', 3, 'single', 'Chân TX của board này nối với chân nào board kia?', '["RX","TX","VCC","GND"]', '["RX"]', 'Truyền (TX) phải nối với Nhận (RX).', 10),
('quiz-week-07-q4', 'quiz-week-07', 4, 'truefalse', 'Serial.print() gửi dữ liệu dạng nhị phân?', '["True","False"]', '["False"]', 'Nó gửi dạng ASCII (văn bản) dễ đọc.', 10),
('quiz-week-07-q5', 'quiz-week-07', 5, 'single', 'Serial Plotter dùng để làm gì?', '["Vẽ đồ thị dữ liệu","Viết code","Nạp code","Gỡ lỗi"]', '["Vẽ đồ thị dữ liệu"]', 'Công cụ vẽ đồ thị thời gian thực tích hợp trong IDE.', 10);

-- Week 8: I2C
INSERT OR REPLACE INTO quizzes (id, week_id, title, description, time_limit, passing_score, is_published) VALUES 
('quiz-week-08', 'week-08', 'Quiz 8: Giao thức I2C', 'Kiểm tra kiến thức về Bus I2C.', 15, 80, 1);

INSERT OR REPLACE INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points) VALUES 
('quiz-week-08-q1', 'quiz-week-08', 1, 'single', 'I2C cần bao nhiêu dây tín hiệu?', '["2 (SDA, SCL)","1 (OneWire)","4 (SPI)","3 (UART)"]', '["2 (SDA, SCL)"]', 'Serial Data (SDA) và Serial Clock (SCL).', 10),
('quiz-week-08-q2', 'quiz-week-08', 2, 'single', 'Mỗi thiết bị I2C phân biệt nhau bằng gì?', '["Địa chỉ (Address)","Màu sắc","Thứ tự dây","Điện áp"]', '["Địa chỉ (Address)"]', 'Ví dụ LCD thường là 0x27 hoặc 0x3F.', 10),
('quiz-week-08-q3', 'quiz-week-08', 3, 'single', 'Chân SDA của Uno là chân nào?', '["A4","A5","D2","D13"]', '["A4"]', 'Uno: A4 (SDA), A5 (SCL).', 10),
('quiz-week-08-q4', 'quiz-week-08', 4, 'truefalse', 'I2C nhanh hơn SPI?', '["True","False"]', '["False"]', 'SPI thường nhanh hơn nhiều so với I2C.', 10),
('quiz-week-08-q5', 'quiz-week-08', 5, 'single', 'Màn hình OLED SSD1306 thường dùng giao tiếp gì?', '["I2C","UART","Analog","PWM"]', '["I2C"]', 'Phổ biến nhất là phiên bản I2C 4 chân.', 10);

-- Week 9: WiFi
INSERT OR REPLACE INTO quizzes (id, week_id, title, description, time_limit, passing_score, is_published) VALUES 
('quiz-week-09', 'week-09', 'Quiz 9: WiFi & Web Server', 'Kiểm tra kiến thức về ESP32 và kết nối mạng.', 15, 80, 1);

INSERT OR REPLACE INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points) VALUES 
('quiz-week-09-q1', 'quiz-week-09', 1, 'single', 'ESP32 dùng thư viện nào để kết nối WiFi?', '["WiFi.h","ESP8266WiFi.h","Ethernet.h","Internet.h"]', '["WiFi.h"]', 'Thư viện chuẩn cho ESP32.', 10),
('quiz-week-09-q2', 'quiz-week-09', 2, 'single', 'Chế độ Station (STA) là gì?', '["Kết nối vào Router WiFi có sẵn","Tự phát WiFi","Không dùng WiFi","Chế độ ngủ"]', '["Kết nối vào Router WiFi có sẵn"]', 'Giống điện thoại kết nối vào WiFi nhà mạng.', 10),
('quiz-week-09-q3', 'quiz-week-09', 3, 'single', 'IP Address 192.168.x.x thường là loại gì?', '["IP LAn (Nội bộ)","IP Public (Toàn cầu)","MAC Address","Gateway"]', '["IP LAn (Nội bộ)"]', 'Địa chỉ mạng cục bộ.', 10),
('quiz-week-09-q4', 'quiz-week-09', 4, 'truefalse', 'Web Server trên ESP32 có thể chứa HTML?', '["True","False"]', '["True"]', 'Có thể trả về mã HTML để trình duyệt hiển thị giao diện.', 10),
('quiz-week-09-q5', 'quiz-week-09', 5, 'single', 'SSID là gì?', '["Tên mạng WiFi","Mật khẩu","Địa chỉ IP","Tên chip"]', '["Tên mạng WiFi"]', 'Service Set Identifier.', 10);

-- Week 10: MQTT
INSERT OR REPLACE INTO quizzes (id, week_id, title, description, time_limit, passing_score, is_published) VALUES 
('quiz-week-10', 'week-10', 'Quiz 10: Giao thức MQTT', 'Kiểm tra kiến thức về giao thức IoT chuẩn công nghiệp.', 15, 80, 1);

INSERT OR REPLACE INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points) VALUES 
('quiz-week-10-q1', 'quiz-week-10', 1, 'single', 'Thành phần trung gian trong MQTT gọi là gì?', '["Broker","Server","Client","Master"]', '["Broker"]', 'Broker nhận và phân phối tin nhắn.', 10),
('quiz-week-10-q2', 'quiz-week-10', 2, 'single', 'Hành động gửi tin đi gọi là gì?', '["Publish","Subscribe","Get","Post"]', '["Publish"]', 'Publish (Công bố) tin nhắn vào một Topic.', 10),
('quiz-week-10-q3', 'quiz-week-10', 3, 'single', 'Hành động đăng ký nhận tin gọi là gì?', '["Subscribe","Publish","Listen","Read"]', '["Subscribe"]', 'Subscribe (Đăng ký) để nhận tin từ Topic.', 10),
('quiz-week-10-q4', 'quiz-week-10', 4, 'single', 'QoS 0 nghĩa là gì?', '["Gửi tối đa 1 lần (Fire & Forget)","Gửi ít nhất 1 lần","Gửi chính xác 1 lần","Không gửi"]', '["Gửi tối đa 1 lần (Fire & Forget)"]', 'Nhanh nhất nhưng không đảm bảo nhận được.', 10),
('quiz-week-10-q5', 'quiz-week-10', 5, 'truefalse', 'MQTT nhẹ hơn HTTP?', '["True","False"]', '["True"]', 'Header nhỏ, tối ưu cho IoT băng thông thấp.', 10);

-- Week 11: App Control
INSERT OR REPLACE INTO quizzes (id, week_id, title, description, time_limit, passing_score, is_published) VALUES 
('quiz-week-11', 'week-11', 'Quiz 11: Ứng dụng điều khiển', 'Kiểm tra kiến thức về tạo Mobile App cho IoT.', 15, 80, 1);

INSERT OR REPLACE INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points) VALUES 
('quiz-week-11-q1', 'quiz-week-11', 1, 'single', 'Blynk là gì?', '["Nền tảng IoT tạo App kéo thả","Một loại chip","Ngôn ngữ lập trình","Cảm biến"]', '["Nền tảng IoT tạo App kéo thả"]', 'Giúp tạo giao diện điều khiển trên điện thoại dễ dàng.', 10),
('quiz-week-11-q2', 'quiz-week-11', 2, 'single', 'Virtual Pin (V1, V2...) trong Blynk dùng để làm gì?', '["Truyền dữ liệu giữa App và Hardware","Nối dây thật","Cấp nguồn","Reset mạch"]', '["Truyền dữ liệu giữa App và Hardware"]', 'Pin ảo để trao đổi biến số qua Internet.', 10),
('quiz-week-11-q3', 'quiz-week-11', 3, 'single', 'Độ trễ (Latency) khi điều khiển qua Cloud phụ thuộc vào gì?', '["Mạng Internet","Nguồn điện","Loại đèn LED","Nhiệt độ"]', '["Mạng Internet"]', 'Tốc độ mạng quyết định độ trễ.', 10),
('quiz-week-11-q4', 'quiz-week-11', 4, 'truefalse', 'Có thể điều khiển ESP32 từ xa qua 4G bằng Blynk?', '["True","False"]', '["True"]', 'Miễn là ESP32 có WiFi và điện thoại có Internet.', 10),
('quiz-week-11-q5', 'quiz-week-11', 5, 'single', 'Token là gì trong Blynk?', '["Khóa bảo mật xác thực thiết bị","Tiền ảo","Tên đăng nhập","Mã lỗi"]', '["Khóa bảo mật xác thực thiết bị"]', 'Mỗi Project có 1 Auth Token riêng.', 10);

-- Week 12: Capstone
INSERT OR REPLACE INTO quizzes (id, week_id, title, description, time_limit, passing_score, is_published) VALUES 
('quiz-week-12', 'week-12', 'Quiz 12: Tổng hợp & Dự án', 'Kiểm tra kiến thức tổng hợp và kỹ năng giải quyết vấn đề.', 15, 80, 1);

INSERT OR REPLACE INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points) VALUES 
('quiz-week-12-q1', 'quiz-week-12', 1, 'single', 'Bước đầu tiên khi làm dự án là gì?', '["Xác định yêu cầu (Requirement)","Viết code ngay","Mua linh kiện bừa bãi","Hàn mạch"]', '["Xác định yêu cầu (Requirement)"]', 'Phải biết làm gì trước khi bắt tay vào làm.', 10),
('quiz-week-12-q2', 'quiz-week-12', 2, 'single', 'Khi mạch không chạy, nên làm gì trước?', '["Kiểm tra nguồn & Dây nối","vứt bỏ","Mua cái mới","Viết lại thư viện"]', '["Kiểm tra nguồn & Dây nối"]', 'Lỗi phần cứng/nguồn dây là phổ biến nhất.', 10),
('quiz-week-12-q3', 'quiz-week-12', 3, 'single', 'OTA Update nghĩa là gì?', '["Cập nhật firmware từ xa qua mạng","Nạp code qua dây USB","Mua mạch mới","Cập nhật Win"]', '["Cập nhật firmware từ xa qua mạng"]', 'Over The Air update.', 10),
('quiz-week-12-q4', 'quiz-week-12', 4, 'single', 'Chuẩn giao tiếp nào dùng ít dây nhất cho cảm biến nhiệt độ DS18B20?', '["OneWire (1 dây)","I2C","SPI","UART"]', '["OneWire (1 dây)"]', 'Chỉ cần 1 dây tín hiệu.', 10),
('quiz-week-12-q5', 'quiz-week-12', 5, 'truefalse', 'Học Arduino xong có thể làm sản phẩm thương mại?', '["True","False"]', '["True"]', 'Nhiều sản phẩm mẫu (Prototype) bắt đầu từ Arduino/ESP32.', 10);
