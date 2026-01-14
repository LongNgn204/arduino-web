-- Seed data bổ sung cho Week 2-12
-- Chạy sau 0001_init.sql và seed.sql gốc

-- =====================================================
-- WEEK 2: Digital I/O và nút nhấn
-- =====================================================

-- Lessons Week 2
INSERT OR IGNORE INTO lessons (id, week_id, order_index, title, content, duration, is_published, created_at)
VALUES 
('lesson-02-01', 'week-02', 1, 'Digital Input với nút nhấn', '# Digital Input với nút nhấn

## Giới thiệu
Nút nhấn (pushbutton) là thiết bị input đơn giản nhất để tương tác với Arduino.

## Cách hoạt động
- **Trạng thái HIGH**: Điện áp 5V
- **Trạng thái LOW**: Điện áp 0V (GND)

## Pull-up / Pull-down Resistor
- **Pull-up**: Mặc định HIGH, nhấn nút → LOW
- **Pull-down**: Mặc định LOW, nhấn nút → HIGH

Arduino có **internal pull-up** resistor tích hợp.

## Hàm quan trọng
```cpp
pinMode(pin, INPUT);         // Input thường
pinMode(pin, INPUT_PULLUP);  // Input với pull-up nội
digitalRead(pin);            // Đọc trạng thái
```

## Ví dụ: Đọc nút nhấn với Serial
```cpp
const int buttonPin = 2;

void setup() {
  Serial.begin(9600);
  pinMode(buttonPin, INPUT_PULLUP);
}

void loop() {
  int state = digitalRead(buttonPin);
  Serial.println(state == LOW ? "PRESSED" : "RELEASED");
  delay(100);
}
```', 45, 1, unixepoch()),

('lesson-02-02', 'week-02', 2, 'Debounce và xử lý nhiễu', '# Debounce - Khử nhiễu nút nhấn

## Vấn đề Bounce
Khi nhấn/nhả nút, tín hiệu không chuyển trạng thái ngay lập tức mà dao động (bounce) trong vài milliseconds.

## Hậu quả
- Một lần nhấn → Arduino đọc được nhiều lần
- Logic xử lý bị sai

## Giải pháp

### 1. Software Debounce (khuyên dùng)
```cpp
const int buttonPin = 2;
int lastState = HIGH;
int currentState;
unsigned long lastDebounceTime = 0;
const unsigned long debounceDelay = 50;

void loop() {
  int reading = digitalRead(buttonPin);
  
  if (reading != lastState) {
    lastDebounceTime = millis();
  }
  
  if ((millis() - lastDebounceTime) > debounceDelay) {
    if (reading != currentState) {
      currentState = reading;
      if (currentState == LOW) {
        // Xử lý khi nhấn nút
        Serial.println("Button pressed!");
      }
    }
  }
  
  lastState = reading;
}
```

### 2. Hardware Debounce
- Thêm tụ điện 0.1µF song song với nút nhấn
- Ít phổ biến hơn do tốn linh kiện', 30, 1, unixepoch());

-- Labs Week 2
INSERT OR IGNORE INTO labs (id, week_id, order_index, title, objective, instructions, starter_code, simulator_url, duration, is_published, created_at)
VALUES 
('lab-02-01', 'week-02', 1, 'Lab 2.1: LED điều khiển bằng nút nhấn', 
'Điều khiển LED bật/tắt bằng nút nhấn với debounce', 
'## Mục tiêu
Tạo công tắc toggle: nhấn nút lần 1 → LED bật, nhấn lần 2 → LED tắt.

## Linh kiện
- 1 LED đỏ
- 1 Điện trở 220Ω
- 1 Nút nhấn
- Breadboard + dây nối

## Đấu nối
- LED: (+) → Pin 13 qua R220Ω → GND
- Nút nhấn: Pin 2 → GND (dùng internal pull-up)

## Yêu cầu
1. Dùng `INPUT_PULLUP` cho nút nhấn
2. Implement debounce (delay 50ms)
3. Toggle LED state khi nhấn
4. Hiển thị trạng thái qua Serial',
'const int buttonPin = 2;
const int ledPin = 13;

int ledState = LOW;
int lastButtonState = HIGH;
int currentButtonState;
unsigned long lastDebounceTime = 0;
unsigned long debounceDelay = 50;

void setup() {
  Serial.begin(9600);
  pinMode(buttonPin, INPUT_PULLUP);
  pinMode(ledPin, OUTPUT);
  Serial.println("Toggle LED - Press button to toggle");
}

void loop() {
  // TODO: Đọc nút với debounce
  // TODO: Toggle LED khi phát hiện nhấn nút
  // TODO: In trạng thái LED qua Serial
}',
'https://wokwi.com/projects/new/arduino-uno', 45, 1, unixepoch());

-- Quiz Week 2
INSERT OR IGNORE INTO quizzes (id, week_id, title, description, time_limit, passing_score, is_published, created_at)
VALUES ('quiz-02', 'week-02', 'Quiz Tuần 2: Digital I/O', 'Kiểm tra kiến thức về Digital Input/Output và xử lý nút nhấn', 15, 60, 1, unixepoch());

INSERT OR IGNORE INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points)
VALUES 
('q-02-01', 'quiz-02', 1, 'single', 'Điện trở pull-up nội của Arduino có giá trị khoảng bao nhiêu?', '["1kΩ","10kΩ","20kΩ","47kΩ"]', '2', 'Arduino có internal pull-up resistor khoảng 20kΩ.', 1),
('q-02-02', 'quiz-02', 2, 'single', 'Khi dùng INPUT_PULLUP và button nối với GND, trạng thái mặc định khi không nhấn là gì?', '["LOW","HIGH","Không xác định","0"]', '1', 'Pull-up kéo điện áp lên HIGH khi không có tác động.', 1),
('q-02-03', 'quiz-02', 3, 'single', 'Thời gian debounce thường sử dụng là bao lâu?', '["1-5ms","10-50ms","100-200ms","500ms-1s"]', '1', 'Bounce thường xảy ra trong 10-50ms.', 1);

-- =====================================================
-- WEEK 3: PWM và điều khiển độ sáng LED
-- =====================================================

INSERT OR IGNORE INTO lessons (id, week_id, order_index, title, content, duration, is_published, created_at)
VALUES 
('lesson-03-01', 'week-03', 1, 'PWM là gì?', '# PWM - Pulse Width Modulation

## Khái niệm
PWM (Điều chế độ rộng xung) là kỹ thuật thay đổi **duty cycle** của tín hiệu số để mô phỏng tín hiệu analog.

## Duty Cycle
- **0%**: Tắt hoàn toàn (0V trung bình)
- **50%**: Một nửa thời gian bật (2.5V trung bình)
- **100%**: Bật hoàn toàn (5V trung bình)

## Arduino PWM
- Độ phân giải: 8-bit (0-255)
- Tần số: ~490Hz hoặc ~980Hz
- Các pin hỗ trợ: 3, 5, 6, 9, 10, 11 (có dấu ~)

## Hàm analogWrite()
```cpp
analogWrite(pin, value);  // value: 0-255
```

## Ứng dụng
- Điều khiển độ sáng LED
- Điều khiển tốc độ motor DC
- Tạo âm thanh', 40, 1, unixepoch()),

('lesson-03-02', 'week-03', 2, 'Điều khiển độ sáng LED', '# Điều khiển LED với PWM

## Nguyên lý
Thay đổi duty cycle → LED tắt/bật nhanh → Mắt cảm nhận thay đổi độ sáng

## Ví dụ: LED fade in/out
```cpp
const int ledPin = 9;  // Pin PWM

void setup() {
  pinMode(ledPin, OUTPUT);
}

void loop() {
  // Fade in
  for (int brightness = 0; brightness <= 255; brightness++) {
    analogWrite(ledPin, brightness);
    delay(10);
  }
  
  // Fade out
  for (int brightness = 255; brightness >= 0; brightness--) {
    analogWrite(ledPin, brightness);
    delay(10);
  }
}
```

## Điều khiển bằng biến trở
```cpp
const int potPin = A0;
const int ledPin = 9;

void loop() {
  int potValue = analogRead(potPin);  // 0-1023
  int brightness = map(potValue, 0, 1023, 0, 255);
  analogWrite(ledPin, brightness);
}
```', 35, 1, unixepoch());

INSERT OR IGNORE INTO labs (id, week_id, order_index, title, objective, instructions, starter_code, simulator_url, duration, is_published, created_at)
VALUES 
('lab-03-01', 'week-03', 1, 'Lab 3.1: LED Breathing Effect',
'Tạo hiệu ứng LED thở với PWM',
'## Mục tiêu
Tạo hiệu ứng "breathing" - LED sáng dần rồi tối dần liên tục như nhịp thở.

## Linh kiện
- 1 LED RGB hoặc LED đơn
- Điện trở 220Ω
- Breadboard

## Yêu cầu
1. LED fade từ tối → sáng trong 2 giây
2. Giữ sáng max 0.5 giây
3. Fade từ sáng → tối trong 2 giây
4. Giữ tối 0.5 giây
5. Lặp lại vô hạn',
'const int ledPin = 9;  // Pin PWM

void setup() {
  pinMode(ledPin, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  // TODO: Implement breathing effect
  // Fade in 2000ms
  // Hold max 500ms
  // Fade out 2000ms
  // Hold min 500ms
}',
'https://wokwi.com/projects/new/arduino-uno', 45, 1, unixepoch());

-- =====================================================
-- WEEK 4-6: Additional seed data (simplified)
-- =====================================================

INSERT OR IGNORE INTO lessons (id, week_id, order_index, title, content, duration, is_published)
VALUES 
('lesson-04-01', 'week-04', 1, 'Analog Input cơ bản', '# Analog Input\n\nArduino Uno có 6 kênh ADC 10-bit (A0-A5).\n\n## Hàm analogRead()\n```cpp\nint value = analogRead(A0);  // 0-1023\n```\n\n## Các loại cảm biến phổ biến\n- Biến trở (potentiometer)\n- LDR (cảm biến ánh sáng)\n- Thermistor (cảm biến nhiệt)\n- Cảm biến độ ẩm đất', 40, 1),
('lesson-05-01', 'week-05', 1, 'Serial Communication', '# Serial Communication\n\nGiao tiếp nối tiếp giữa Arduino và máy tính.\n\n## Các hàm quan trọng\n```cpp\nSerial.begin(9600);\nSerial.print();\nSerial.println();\nSerial.read();\nSerial.available();\n```', 35, 1),
('lesson-06-01', 'week-06', 1, 'LCD 16x2 với I2C', '# LCD 16x2 I2C\n\nMàn hình LCD 16 cột x 2 dòng với module I2C.\n\n## Thư viện\n```cpp\n#include <LiquidCrystal_I2C.h>\n\nLiquidCrystal_I2C lcd(0x27, 16, 2);\n\nvoid setup() {\n  lcd.init();\n  lcd.backlight();\n  lcd.print("Hello World!");\n}\n```', 45, 1);

-- Labs for weeks 4-6
INSERT OR IGNORE INTO labs (id, week_id, order_index, title, objective, instructions, starter_code, duration, is_published)
VALUES 
('lab-04-01', 'week-04', 1, 'Lab 4.1: Đọc cảm biến ánh sáng LDR', 'Đọc giá trị analog từ LDR và hiển thị qua Serial', '## Mục tiêu\nĐọc cường độ ánh sáng và phân loại: Tối/Trung bình/Sáng\n\n## Linh kiện\n- LDR\n- Điện trở 10kΩ', 'const int ldrPin = A0;\n\nvoid setup() {\n  Serial.begin(9600);\n}\n\nvoid loop() {\n  int value = analogRead(ldrPin);\n  // TODO: Phân loại và in ra Serial\n  delay(500);\n}', 45, 1),
('lab-05-01', 'week-05', 1, 'Lab 5.1: LED điều khiển qua Serial', 'Bật/tắt LED bằng lệnh từ Serial Monitor', '## Mục tiêu\nNhận lệnh "on"/"off" từ Serial để điều khiển LED\n\n## Linh kiện\n- LED + R220Ω', 'const int ledPin = 13;\nString command = "";\n\nvoid setup() {\n  Serial.begin(9600);\n  pinMode(ledPin, OUTPUT);\n}\n\nvoid loop() {\n  // TODO: Đọc Serial và xử lý lệnh\n}', 40, 1),
('lab-06-01', 'week-06', 1, 'Lab 6.1: Đồng hồ đếm giờ LCD', 'Hiển thị thời gian chạy trên LCD', '## Mục tiêu\nHiển thị MM:SS trên LCD, đếm từ 00:00\n\n## Linh kiện\n- LCD 16x2 I2C', '#include <LiquidCrystal_I2C.h>\n\nLiquidCrystal_I2C lcd(0x27, 16, 2);\nunsigned long startTime;\n\nvoid setup() {\n  lcd.init();\n  lcd.backlight();\n  startTime = millis();\n}\n\nvoid loop() {\n  // TODO: Tính và hiển thị MM:SS\n}', 50, 1);

-- =====================================================
-- WEEK 7-9: Additional seed data
-- =====================================================

INSERT OR IGNORE INTO lessons (id, week_id, order_index, title, content, duration, is_published)
VALUES 
('lesson-07-01', 'week-07', 1, 'Giao thức I2C', '# I2C Communication\n\n## Đặc điểm\n- 2 dây: SDA (data), SCL (clock)\n- Master-Slave architecture\n- Địa chỉ 7-bit (128 thiết bị)\n\n## Arduino\n```cpp\n#include <Wire.h>\n\nWire.begin();\nWire.beginTransmission(address);\nWire.write(data);\nWire.endTransmission();\n```', 45, 1),
('lesson-08-01', 'week-08', 1, 'Servo Motor', '# Điều khiển Servo\n\n## Loại servo\n- Standard servo: 0-180°\n- Continuous servo: Quay liên tục\n\n## Thư viện Servo\n```cpp\n#include <Servo.h>\n\nServo myServo;\nmyServo.attach(9);\nmyServo.write(90);  // 0-180°\n```', 40, 1),
('lesson-09-01', 'week-09', 1, 'Cảm biến DHT11/DHT22', '# Cảm biến nhiệt độ và độ ẩm\n\n## DHT11 vs DHT22\n| | DHT11 | DHT22 |\n|---|---|---|\n| Nhiệt độ | 0-50°C | -40-80°C |\n| Độ ẩm | 20-80% | 0-100% |\n| Độ chính xác | ±2°C | ±0.5°C |\n\n## Code\n```cpp\n#include <DHT.h>\n\nDHT dht(2, DHT11);\ndht.begin();\nfloat temp = dht.readTemperature();\nfloat humidity = dht.readHumidity();\n```', 45, 1);

INSERT OR IGNORE INTO labs (id, week_id, order_index, title, objective, instructions, starter_code, duration, is_published)
VALUES 
('lab-07-01', 'week-07', 1, 'Lab 7.1: Đọc cảm biến MPU6050', 'Đọc gia tốc kế và con quay hồi chuyển qua I2C', '## Mục tiêu\nĐọc accelX, accelY, accelZ từ MPU6050', '#include <Wire.h>\n\nconst int MPU_ADDR = 0x68;\n\nvoid setup() {\n  Wire.begin();\n  Serial.begin(9600);\n  // TODO: Khởi tạo MPU6050\n}', 60, 1),
('lab-08-01', 'week-08', 1, 'Lab 8.1: Servo điều khiển bằng biến trở', 'Map giá trị analog sang góc servo', '## Mục tiêu\nXoay servo từ 0-180° theo vị trí biến trở', '#include <Servo.h>\n\nServo myServo;\nconst int potPin = A0;\n\nvoid setup() {\n  myServo.attach(9);\n}', 45, 1),
('lab-09-01', 'week-09', 1, 'Lab 9.1: Trạm thời tiết mini', 'Đọc DHT11 và hiển thị LCD', '## Mục tiêu\nHiển thị nhiệt độ và độ ẩm trên LCD 16x2', '#include <DHT.h>\n#include <LiquidCrystal_I2C.h>\n\nDHT dht(2, DHT11);\nLiquidCrystal_I2C lcd(0x27, 16, 2);', 60, 1);

-- =====================================================
-- WEEK 10-12: IoT và Final Project
-- =====================================================

INSERT OR IGNORE INTO lessons (id, week_id, order_index, title, content, duration, is_published)
VALUES 
('lesson-10-01', 'week-10', 1, 'Giao thức SPI', '# SPI Communication\n\n## Đặc điểm\n- 4 dây: MOSI, MISO, SCK, SS\n- Tốc độ cao hơn I2C\n- Full-duplex\n\n## Ứng dụng\n- SD Card module\n- Module RF NRF24L01\n- Màn hình TFT', 45, 1),
('lesson-11-01', 'week-11', 1, 'ESP8266 WiFi Module', '# ESP8266 và Arduino\n\n## Kết nối\n- TX → RX (Arduino)\n- RX → TX qua voltage divider\n- VCC → 3.3V\n\n## AT Commands\n```\nAT+RST          // Reset\nAT+CWMODE=1     // Station mode\nAT+CWJAP="ssid","pass"\nAT+CIPSTART="TCP","api.com",80\n```\n\n## Hoặc dùng ESP8266 làm MCU chính với Arduino IDE', 50, 1),
('lesson-12-01', 'week-12', 1, 'Final Project Guidelines', '# Hướng dẫn Final Project\n\n## Yêu cầu\n1. Sử dụng ít nhất 3 loại cảm biến/actuator\n2. Có giao diện người dùng (LCD/Serial/Web)\n3. Có tính ứng dụng thực tế\n\n## Rubric\n- Functionality: 40%\n- Code quality: 25%\n- Documentation: 20%\n- Presentation: 15%\n\n## Gợi ý đề tài\n- Smart Home: Đèn tự động, nhiệt kế phòng\n- Robot: Line follower, obstacle avoider\n- IoT: Weather station kết nối web', 30, 1);

INSERT OR IGNORE INTO labs (id, week_id, order_index, title, objective, instructions, starter_code, duration, is_published)
VALUES 
('lab-10-01', 'week-10', 1, 'Lab 10.1: Đọc/ghi SD Card', 'Ghi dữ liệu cảm biến vào file CSV trên SD Card', '## Mục tiêu\nGhi timestamp và nhiệt độ vào file data.csv', '#include <SPI.h>\n#include <SD.h>\n\nconst int chipSelect = 10;\nFile dataFile;', 60, 1),
('lab-11-01', 'week-11', 1, 'Lab 11.1: Gửi dữ liệu lên ThingSpeak', 'Gửi nhiệt độ lên cloud qua HTTP', '## Mục tiêu\nKết nối WiFi và POST data lên ThingSpeak\n\n## Yêu cầu\n- Tạo channel ThingSpeak\n- Lấy Write API Key', '// Dùng ESP8266 hoặc Arduino + ESP-01\n// TODO: Implement HTTP POST to ThingSpeak', 75, 1),
('lab-12-01', 'week-12', 1, 'Lab 12.1: Final Project - Smart Plant Monitor', 'Hoàn thành dự án cuối khóa', '## Mô tả\nThiết bị theo dõi cây trồng:\n- Đo độ ẩm đất\n- Đo nhiệt độ/độ ẩm không khí\n- Hiển thị LCD\n- Cảnh báo khi cần tưới nước\n\n## Bonus\n- Gửi data lên web\n- Tự động bơm nước', '// Final Project Template\n// TODO: Implement full solution', 120, 1);

-- Exam drills cho các tuần
INSERT OR IGNORE INTO exam_drills (id, week_id, title, description, content, rubric, time_limit, is_published)
VALUES 
('drill-02', 'week-02', 'Exam Drill: Digital I/O', 'Bài thi thực hành tuần 2', 'Viết chương trình điều khiển 3 LED theo pattern sau:\n1. Nhấn nút 1: LED chạy từ trái sang phải\n2. Nhấn nút 2: LED chạy từ phải sang trái\n3. Nhấn cả 2 nút: Tất cả LED nhấp nháy\n\nYêu cầu: Dùng debounce, có Serial debug.', '{"items":[{"name":"Debounce đúng","points":20,"description":"Implement debounce cho cả 2 nút"},{"name":"Pattern trái-phải","points":25,"description":"LED chạy đúng pattern"},{"name":"Pattern phải-trái","points":25,"description":"LED chạy đúng pattern ngược"},{"name":"Xử lý cả 2 nút","points":20,"description":"Phát hiện và xử lý nhấn cả 2 nút"},{"name":"Serial debug","points":10,"description":"In trạng thái qua Serial"}]}', 45, 1),
('drill-06', 'week-06', 'Exam Drill: LCD Interface', 'Bài thi thực hành tuần 6', 'Tạo menu 3 cấp trên LCD 16x2:\n- Menu chính: 1.Settings 2.Info 3.Exit\n- Dùng 2 nút để điều hướng (Up/Down) và 1 nút Select\n- Hiển thị icon mũi tên cho mục đang chọn', '{"items":[{"name":"Hiển thị menu","points":25,"description":"3 mục menu hiển thị đúng"},{"name":"Navigation","points":30,"description":"Di chuyển lên/xuống đúng"},{"name":"Select action","points":25,"description":"Chọn mục và xử lý đúng"},{"name":"UX","points":20,"description":"Có highlight/icon cho mục đang chọn"}]}', 60, 1);
