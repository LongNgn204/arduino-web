-- Seed data cho Arduino Learning Hub
-- Admin user: admin/admin123 (CHỈĐỂ DEV)
-- Course 12 tuần đầy đủ

-- ==========================================
-- ADMIN USER (password: admin123)
-- Hash format: pbkdf2$iterations$salt_base64$hash_base64
-- Đây là hash test, production cần generate mới
-- ==========================================

INSERT INTO users (id, username, password_hash, role, display_name, created_at, updated_at)
VALUES (
  'admin-001',
  'admin',
  'pbkdf2$100000$c2FsdF9hZG1pbl90ZXN0$WkYxR2FEbG1iSEZ3WVhOemQyOXlaQT09',
  'admin',
  'Administrator',
  unixepoch(),
  unixepoch()
);

-- Test student
INSERT INTO users (id, username, password_hash, role, display_name, created_at, updated_at)
VALUES (
  'student-001',
  'sinhvien',
  'pbkdf2$100000$c2FsdF9zdHVkZW50X3Rlc3Q$dGVzdHBhc3N3b3JkMTIz',
  'student',
  'Sinh Viên Test',
  unixepoch(),
  unixepoch()
);

-- ==========================================
-- COURSE: TECH476 - Lập trình hệ thống nhúng & IoT
-- ==========================================

INSERT INTO courses (id, code, title, description, total_weeks, is_published, created_at)
VALUES (
  'course-tech476',
  'TECH476',
  'Lập trình hệ thống nhúng & IoT',
  'Học lập trình Arduino Uno từ cơ bản đến nâng cao. Khóa học 12 tuần dành cho sinh viên Khoa Kỹ thuật & Công nghệ, ĐH Sư phạm Hà Nội.',
  12,
  1,
  unixepoch()
);

-- ==========================================
-- WEEK 1: Giới thiệu Arduino
-- ==========================================

INSERT INTO weeks (id, course_id, week_number, title, overview, objectives, exam_checklist, is_published, created_at)
VALUES (
  'week-01',
  'course-tech476',
  1,
  'Giới thiệu Arduino và môi trường phát triển',
  '# Tuần 1: Giới thiệu Arduino

## Mục tiêu
Làm quen với Arduino Uno, Arduino IDE và viết chương trình đầu tiên.

## Nội dung chính
- Arduino là gì? Cấu tạo board Arduino Uno
- Cài đặt Arduino IDE
- Cấu trúc chương trình Arduino (setup, loop)
- Bài Blink LED cơ bản

## Tài liệu cần đọc
- Datasheet ATmega328P (phần giới thiệu)
- Arduino Reference: pinMode, digitalWrite, delay',
  '["Hiểu cấu tạo board Arduino Uno","Biết cài đặt và sử dụng Arduino IDE","Viết được chương trình Blink LED","Hiểu cấu trúc setup() và loop()"]',
  '["Nêu được các thành phần chính của Arduino Uno","Giải thích được chức năng của hàm setup() và loop()","Viết được code điều khiển LED bật/tắt","Debug được lỗi upload code thường gặp"]',
  1,
  unixepoch()
);

-- Lessons Week 1
INSERT INTO lessons (id, week_id, order_index, title, content, duration, is_published, created_at)
VALUES 
  ('lesson-01-01', 'week-01', 1, 'Arduino là gì?', 
  '# Arduino là gì?

## Định nghĩa
Arduino là nền tảng phần cứng và phần mềm mã nguồn mở dành cho việc xây dựng các dự án điện tử.

## Tại sao chọn Arduino?
- **Dễ học**: Ngôn ngữ dựa trên C/C++ đơn giản hóa
- **Cộng đồng lớn**: Hàng triệu dự án mẫu và thư viện
- **Giá rẻ**: Board chính hãng ~25$, board clone ~3-5$
- **Đa dạng**: Nhiều loại board cho nhiều mục đích

## Board Arduino Uno
![Arduino Uno](https://images.unsplash.com/photo-1518770660439-4636190af475?w=400)

### Thông số kỹ thuật:
| Thành phần | Thông số |
|------------|----------|
| Vi điều khiển | ATmega328P |
| Tần số | 16 MHz |
| Digital I/O | 14 chân (6 PWM) |
| Analog Input | 6 chân (A0-A5) |
| Flash | 32 KB |
| SRAM | 2 KB |
| EEPROM | 1 KB |

## Sơ đồ chân Arduino Uno

```
         +----[USB]----+
         |             |
    D13 -|  []    []   |- GND
    D12 -|  []    []   |- AREF
    D11 -|  []    []   |- A0
    D10 -|  []    []   |- A1
     D9 -|  []    []   |- A2
     D8 -|  []    []   |- A3
         |             |
     D7 -|  []    []   |- A4
     D6 -|  []    []   |- A5
     D5 -|  []    []   |- VCC
     D4 -|  []    []   |- GND
     D3 -|  []    []   |- RST
     D2 -|  []    []   |- 3.3V
     D1 -|  []    []   |- 5V
     D0 -|  []    []   |- VIN
         +-------------+
```

## Lỗi thường gặp khi mới bắt đầu
1. **Không chọn đúng board**: Tools → Board → Arduino Uno
2. **Không chọn đúng port**: Tools → Port → COMx
3. **Thiếu driver**: Cài driver CH340 nếu dùng board clone', 
  15, 1, unixepoch()),
  
  ('lesson-01-02', 'week-01', 2, 'Cài đặt Arduino IDE',
  '# Cài đặt Arduino IDE

## Tải về
Truy cập [arduino.cc/software](https://www.arduino.cc/en/software) và tải phiên bản phù hợp:
- Windows: Arduino IDE 2.x (khuyên dùng)
- MacOS: Arduino IDE 2.x
- Linux: AppImage hoặc cài từ package manager

## Cài đặt trên Windows

### Bước 1: Tải file cài đặt
- Click "Windows Win 10 and newer, 64 bit"
- Chờ download hoàn tất (~500MB)

### Bước 2: Cài đặt
```
1. Double-click file .exe
2. Chấp nhận License Agreement
3. Next → Next → Install
4. Đợi cài đặt driver USB
5. Finish
```

### Bước 3: Kết nối board
1. Cắm cáp USB vào Arduino Uno
2. Cắm đầu còn lại vào máy tính
3. Đợi Windows nhận driver

### Bước 4: Cấu hình IDE
1. Mở Arduino IDE
2. **Tools → Board → Arduino Uno**
3. **Tools → Port → COMx** (số COM tùy máy)

## Kiểm tra kết nối

```cpp
// Chương trình test kết nối
void setup() {
  Serial.begin(9600);
  Serial.println("Arduino da ket noi!");
}

void loop() {
  // Không làm gì
}
```

Upload code, mở Tools → Serial Monitor (Ctrl+Shift+M), nếu thấy chữ "Arduino da ket noi!" là thành công.

## Troubleshooting

| Lỗi | Nguyên nhân | Cách sửa |
|-----|-------------|----------|
| avrdude: ser_open(): can''t open device | Sai port | Chọn lại port trong Tools |
| Board not recognized | Thiếu driver | Cài driver CH340/CH341 |
| Access denied | Port bị chiếm | Đóng Serial Monitor, thử lại |',
  20, 1, unixepoch()),
  
  ('lesson-01-03', 'week-01', 3, 'Cấu trúc chương trình Arduino',
  '# Cấu trúc chương trình Arduino

## Hai hàm bắt buộc

Mọi chương trình Arduino đều phải có 2 hàm:

```cpp
void setup() {
  // Chạy MỘT LẦN khi khởi động
  // Dùng để cấu hình ban đầu
}

void loop() {
  // Chạy LẶP LẠI LIÊN TỤC
  // Chứa logic chính của chương trình
}
```

## Flowchart thực thi

```
[Cấp nguồn/Reset]
       ↓
    setup()
       ↓
       ↓←←←←←←←←←←←←
       ↓            ↑
    loop() ────────→
```

## Ví dụ phân tích

```cpp
// Khai báo biến toàn cục
int ledPin = 13;     // LED tích hợp trên board
int delayTime = 500; // 500ms = 0.5 giây

void setup() {
  // Cấu hình chân 13 là OUTPUT
  pinMode(ledPin, OUTPUT);
}

void loop() {
  // Bật LED
  digitalWrite(ledPin, HIGH);
  delay(delayTime);
  
  // Tắt LED
  digitalWrite(ledPin, LOW);
  delay(delayTime);
}
```

## Các hàm cơ bản

### pinMode(pin, mode)
Cấu hình chân là INPUT hoặc OUTPUT.

```cpp
pinMode(13, OUTPUT);  // Chân 13 là đầu ra
pinMode(2, INPUT);    // Chân 2 là đầu vào
```

### digitalWrite(pin, value)
Ghi giá trị HIGH/LOW ra chân digital.

```cpp
digitalWrite(13, HIGH);  // Bật chân 13 (5V)
digitalWrite(13, LOW);   // Tắt chân 13 (0V)
```

### delay(ms)
Tạm dừng chương trình trong khoảng thời gian (milliseconds).

```cpp
delay(1000);  // Chờ 1 giây
delay(500);   // Chờ 0.5 giây
```

## Checklist debug

Khi code không chạy:
- [ ] Đã chọn đúng board?
- [ ] Đã chọn đúng port?
- [ ] Đã upload thành công (không có lỗi đỏ)?
- [ ] LED TX/RX có nhấp nháy khi upload?
- [ ] Thử nhấn nút Reset trên board',
  25, 1, unixepoch());

-- Labs Week 1
INSERT INTO labs (id, week_id, order_index, title, objective, instructions, wiring, starter_code, solution_code, rubric, simulator_url, duration, is_published, created_at)
VALUES 
  ('lab-01-01', 'week-01', 1, 'Lab 1.1: Blink LED (Hello World Arduino)',
  'Viết chương trình đầu tiên điều khiển LED nhấp nháy',
  '# Lab 1.1: Blink LED

## Mục tiêu
- Upload thành công chương trình đầu tiên
- Hiểu cách điều khiển LED onboard (chân 13)
- Thay đổi tốc độ nhấp nháy

## Yêu cầu
1. Upload code Blink mẫu
2. Thay đổi delay thành 100ms và quan sát
3. Thay đổi delay thành 2000ms và quan sát
4. Tự viết code LED sáng 0.3s, tắt 0.7s

## Hướng dẫn từng bước

### Bước 1: Mở ví dụ Blink
```
File → Examples → 01.Basics → Blink
```

### Bước 2: Upload code
```
- Click nút Upload (→) hoặc Ctrl+U
- Chờ "Done uploading"
- Quan sát LED trên board
```

### Bước 3: Thí nghiệm với delay khác nhau
Thay đổi giá trị `delay()` và quan sát sự thay đổi.

## Câu hỏi kiểm tra
1. Tại sao LED không cần kết nối dây riêng?
2. Điều gì xảy ra nếu bỏ cả hai hàm delay()?
3. HIGH tương ứng với mức điện áp bao nhiêu?',
  '# Kết nối
Không cần kết nối thêm! LED tích hợp sẵn trên board ở chân D13.',
  '// Lab 1.1: Blink LED
// TODO: Hoàn thành code bên dưới

int ledPin = 13;

void setup() {
  // Cấu hình chân ledPin là OUTPUT
  
}

void loop() {
  // Bật LED
  
  // Chờ một khoảng thời gian
  
  // Tắt LED
  
  // Chờ một khoảng thời gian
  
}',
  '// Lời giải Lab 1.1
int ledPin = 13;

void setup() {
  pinMode(ledPin, OUTPUT);
}

void loop() {
  // Bật LED sáng 0.3s
  digitalWrite(ledPin, HIGH);
  delay(300);
  
  // Tắt LED 0.7s
  digitalWrite(ledPin, LOW);
  delay(700);
}',
  '{"criteria":[{"name":"Upload thành công","points":2,"description":"Code compile và upload không lỗi"},{"name":"LED nhấp nháy","points":2,"description":"LED sáng/tắt đúng chu kỳ"},{"name":"Thay đổi delay","points":3,"description":"Thực hiện đúng các yêu cầu thay đổi delay"},{"name":"Code sáng 0.3s tắt 0.7s","points":3,"description":"Tự viết code với timing chính xác"}],"total":10}',
  'https://wokwi.com/projects/new/arduino-uno',
  30, 1, unixepoch()),
  
  ('lab-01-02', 'week-01', 2, 'Lab 1.2: Nhiều LED nháy theo pattern',
  'Điều khiển nhiều LED với các pattern khác nhau',
  '# Lab 1.2: Nhiều LED nháy theo pattern

## Mục tiêu
- Kết nối LED ngoài với breadboard
- Điều khiển nhiều LED
- Tạo hiệu ứng chạy đuổi (running lights)

## Linh kiện cần
- 4 LED (màu tùy chọn)
- 4 điện trở 220Ω
- Dây jumper
- Breadboard

## Yêu cầu
1. Kết nối 4 LED vào chân D2, D3, D4, D5
2. Tạo hiệu ứng LED chạy từ trái qua phải
3. Tạo hiệu ứng LED chạy qua lại (ping-pong)

## Sơ đồ kết nối
```
Arduino    Breadboard
D2 ────── LED1 ────┐
                   │
D3 ────── LED2 ────┤
                   ├── GND
D4 ────── LED3 ────┤
                   │
D5 ────── LED4 ────┘

Chú ý: LED nối qua điện trở 220Ω
Chân dài LED (+) nối Arduino
Chân ngắn LED (-) nối GND
```',
  '{"components":[{"name":"LED","count":4},{"name":"Resistor 220Ω","count":4},{"name":"Jumper wires","count":8}],"diagram":"D2-D5 → LED → 220Ω → GND"}',
  '// Lab 1.2: Running LEDs
// TODO: Hoàn thành code

int leds[] = {2, 3, 4, 5};
int numLeds = 4;
int delayTime = 200;

void setup() {
  // Cấu hình tất cả chân LED là OUTPUT
  for (int i = 0; i < numLeds; i++) {
    // TODO: pinMode cho từng LED
  }
}

void loop() {
  // TODO: Tạo hiệu ứng chạy từ trái qua phải
  
}',
  '// Lời giải Lab 1.2
int leds[] = {2, 3, 4, 5};
int numLeds = 4;
int delayTime = 200;

void setup() {
  for (int i = 0; i < numLeds; i++) {
    pinMode(leds[i], OUTPUT);
  }
}

void loop() {
  // Chạy từ trái qua phải
  for (int i = 0; i < numLeds; i++) {
    digitalWrite(leds[i], HIGH);
    delay(delayTime);
    digitalWrite(leds[i], LOW);
  }
  
  // Chạy từ phải qua trái
  for (int i = numLeds - 2; i > 0; i--) {
    digitalWrite(leds[i], HIGH);
    delay(delayTime);
    digitalWrite(leds[i], LOW);
  }
}',
  '{"criteria":[{"name":"Kết nối đúng","points":3,"description":"4 LED kết nối đúng sơ đồ"},{"name":"Chạy trái→phải","points":3,"description":"LED chạy tuần tự từ D2 đến D5"},{"name":"Ping-pong","points":4,"description":"LED chạy qua lại mượt mà"}],"total":10}',
  'https://wokwi.com/projects/new/arduino-uno',
  45, 1, unixepoch());

-- Quiz Week 1
INSERT INTO quizzes (id, week_id, title, description, time_limit, passing_score, is_published, created_at)
VALUES (
  'quiz-01',
  'week-01',
  'Quiz Tuần 1: Arduino cơ bản',
  'Kiểm tra kiến thức cơ bản về Arduino và chương trình đầu tiên',
  15,
  70,
  1,
  unixepoch()
);

-- Questions for Quiz 1
INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at)
VALUES 
  ('q-01-01', 'quiz-01', 1, 'single', 
  'Arduino Uno sử dụng vi điều khiển nào?',
  '["ATmega328P","ATmega2560","ESP32","STM32F4"]',
  '0',
  'Arduino Uno sử dụng vi điều khiển ATmega328P của Atmel (nay thuộc Microchip). ATmega2560 dùng cho Arduino Mega.',
  1, unixepoch()),
  
  ('q-01-02', 'quiz-01', 2, 'single',
  'Hàm nào được gọi MỘT LẦN khi Arduino khởi động?',
  '["loop()","main()","setup()","init()"]',
  '2',
  'Hàm setup() chạy một lần duy nhất khi Arduino khởi động hoặc reset. Hàm loop() chạy lặp lại liên tục sau đó.',
  1, unixepoch()),
  
  ('q-01-03', 'quiz-01', 3, 'single',
  'Lệnh nào dùng để cấu hình chân 13 làm đầu ra?',
  '["digitalWrite(13, OUTPUT);","pinMode(13, OUTPUT);","setPin(13, OUTPUT);","configPin(13, OUTPUT);"]',
  '1',
  'pinMode(pin, mode) là hàm cấu hình chế độ hoạt động của chân. digitalWrite() dùng để ghi giá trị HIGH/LOW.',
  1, unixepoch()),
  
  ('q-01-04', 'quiz-01', 4, 'single',
  'Giá trị HIGH tương ứng với mức điện áp nào trên Arduino Uno?',
  '["0V","3.3V","5V","12V"]',
  '2',
  'Arduino Uno hoạt động ở mức logic 5V. HIGH = 5V, LOW = 0V. Các board 3.3V như ESP32 thì HIGH = 3.3V.',
  1, unixepoch()),
  
  ('q-01-05', 'quiz-01', 5, 'single',
  'delay(1000) có nghĩa là gì?',
  '["Chờ 1 giây","Chờ 1 phút","Chờ 1000 giây","Chờ 1 micro giây"]',
  '0',
  'delay() nhận tham số là milliseconds. 1000ms = 1 giây.',
  1, unixepoch()),
  
  ('q-01-06', 'quiz-01', 6, 'truefalse',
  'LED tích hợp trên Arduino Uno được kết nối với chân D13.',
  '["Đúng","Sai"]',
  '0',
  'Đúng. Arduino Uno có LED onboard kết nối với chân D13, nên có thể test ngay mà không cần LED ngoài.',
  1, unixepoch()),
  
  ('q-01-07', 'quiz-01', 7, 'single',
  'Arduino Uno có bao nhiêu chân Digital I/O?',
  '["6 chân","14 chân","20 chân","54 chân"]',
  '1',
  'Arduino Uno có 14 chân Digital (D0-D13), trong đó 6 chân (D3,5,6,9,10,11) hỗ trợ PWM.',
  1, unixepoch()),
  
  ('q-01-08', 'quiz-01', 8, 'single',
  'Khi upload code, lỗi "avrdude: ser_open(): can''t open device" thường do nguyên nhân gì?',
  '["Code sai cú pháp","Chọn sai COM port","Board bị hỏng","IDE phiên bản cũ"]',
  '1',
  'Lỗi này xảy ra khi chọn sai cổng COM hoặc cổng đang bị ứng dụng khác chiếm (ví dụ: Serial Monitor).',
  1, unixepoch()),
  
  ('q-01-09', 'quiz-01', 9, 'multiple',
  'Chọn TẤT CẢ các thành phần có trên board Arduino Uno:',
  '["Cổng USB","Vi điều khiển ATmega328P","Module WiFi tích hợp","Crystal 16MHz","Bluetooth tích hợp","Jack nguồn DC"]',
  '[0,1,3,5]',
  'Arduino Uno có USB, ATmega328P, crystal 16MHz và jack DC. KHÔNG có WiFi hay Bluetooth tích hợp (cần module riêng).',
  2, unixepoch()),
  
  ('q-01-10', 'quiz-01', 10, 'single',
  'Điện trở cần dùng khi nối LED với Arduino là bao nhiêu?',
  '["Không cần điện trở","10Ω","220Ω - 330Ω","10kΩ"]',
  '2',
  'LED thường cần điện trở 220Ω-330Ω để hạn dòng. Không có điện trở có thể làm cháy LED. 10kΩ thì LED sẽ quá tối.',
  1, unixepoch());

-- Exam Drill Week 1
INSERT INTO exam_drills (id, week_id, title, description, content, rubric, sample_solution, time_limit, is_published, created_at)
VALUES (
  'exam-01',
  'week-01',
  'Đề ôn tập Tuần 1: Arduino cơ bản',
  'Ôn tập kiến thức tuần 1 - Thời gian 60 phút',
  '# Đề ôn tập Tuần 1

## Phần 1: Lý thuyết (4 điểm)

### Câu 1 (2 điểm)
Trình bày cấu trúc cơ bản của một chương trình Arduino. Giải thích chức năng của hàm `setup()` và `loop()`.

### Câu 2 (2 điểm)
Cho biết sự khác nhau giữa `pinMode()` và `digitalWrite()`. Cho ví dụ minh họa.

## Phần 2: Thực hành (6 điểm)

### Câu 3 (3 điểm)
Viết chương trình điều khiển 1 LED theo yêu cầu:
- LED sáng 500ms
- LED tắt 200ms
- LED sáng 500ms
- LED tắt 1000ms
- Lặp lại vô hạn

### Câu 4 (3 điểm)
Viết chương trình điều khiển 3 LED (D2, D3, D4) tạo hiệu ứng đèn giao thông:
- LED đỏ (D2) sáng 5 giây
- LED vàng (D3) sáng 2 giây
- LED xanh (D4) sáng 5 giây
- Lặp lại',
  '{"part1":{"total":4,"details":"Câu 1: 2đ (setup 1đ, loop 1đ). Câu 2: 2đ (giải thích 1đ, ví dụ 1đ)"},"part2":{"total":6,"details":"Câu 3: 3đ (cấu trúc 1đ, timing 1đ, hoạt động 1đ). Câu 4: 3đ (khai báo 1đ, logic 1đ, timing 1đ)"}}',
  '// Câu 3
int led = 13;

void setup() {
  pinMode(led, OUTPUT);
}

void loop() {
  digitalWrite(led, HIGH);
  delay(500);
  digitalWrite(led, LOW);
  delay(200);
  digitalWrite(led, HIGH);
  delay(500);
  digitalWrite(led, LOW);
  delay(1000);
}

// Câu 4
int red = 2;
int yellow = 3;
int green = 4;

void setup() {
  pinMode(red, OUTPUT);
  pinMode(yellow, OUTPUT);
  pinMode(green, OUTPUT);
}

void loop() {
  // Đỏ
  digitalWrite(red, HIGH);
  delay(5000);
  digitalWrite(red, LOW);
  
  // Vàng
  digitalWrite(yellow, HIGH);
  delay(2000);
  digitalWrite(yellow, LOW);
  
  // Xanh
  digitalWrite(green, HIGH);
  delay(5000);
  digitalWrite(green, LOW);
}',
  60, 1, unixepoch()
);

-- ==========================================
-- WEEK 2: Digital I/O nâng cao
-- ==========================================

INSERT INTO weeks (id, course_id, week_number, title, overview, objectives, exam_checklist, is_published, created_at)
VALUES (
  'week-02',
  'course-tech476',
  2,
  'Digital I/O và nút nhấn',
  '# Tuần 2: Digital Input và nút nhấn

## Mục tiêu
- Đọc tín hiệu từ nút nhấn
- Hiểu pullup/pulldown resistor
- Xử lý debounce

## Nội dung chính
- digitalRead() để đọc input
- Internal pullup resistor
- Debounce bằng delay và millis()
- State machine đơn giản',
  '["Đọc được tín hiệu từ nút nhấn","Hiểu và sử dụng INPUT_PULLUP","Xử lý được nhiễu nút nhấn (debounce)","Sử dụng millis() thay cho delay()"]',
  '["Giải thích pullup và pulldown resistor","Viết code đọc nút nhấn không bị nhiễu","Phân biệt blocking và non-blocking code","Tạo toggle LED bằng nút nhấn"]',
  1,
  unixepoch()
);

-- ==========================================
-- WEEK 3: PWM và điều khiển độ sáng
-- ==========================================

INSERT INTO weeks (id, course_id, week_number, title, overview, objectives, exam_checklist, is_published, created_at)
VALUES (
  'week-03',
  'course-tech476',
  3,
  'PWM và điều khiển độ sáng LED',
  '# Tuần 3: PWM (Pulse Width Modulation)

## Mục tiêu
- Hiểu nguyên lý PWM
- Điều khiển độ sáng LED
- Điều khiển tốc độ motor DC

## Nội dung chính
- analogWrite() và duty cycle
- Các chân hỗ trợ PWM (3, 5, 6, 9, 10, 11)
- Fading LED
- Điều khiển motor cơ bản',
  '["Hiểu nguyên lý hoạt động của PWM","Sử dụng analogWrite() đúng cách","Tạo hiệu ứng fade LED","Điều khiển được tốc độ motor DC"]',
  '["Giải thích duty cycle là gì","Nêu các chân hỗ trợ PWM trên Arduino Uno","Viết code fade LED mượt mà","Tính giá trị PWM cho % duty cycle mong muốn"]',
  1,
  unixepoch()
);

-- ==========================================
-- WEEK 4-12: Placeholder weeks
-- ==========================================

INSERT INTO weeks (id, course_id, week_number, title, overview, objectives, exam_checklist, is_published, created_at)
VALUES 
  ('week-04', 'course-tech476', 4, 'Analog Input và cảm biến', '# Tuần 4: Analog Input\n\n- analogRead()\n- Potentiometer\n- LDR sensor\n- Mapping values', '["Đọc giá trị analog 0-1023","Kết nối biến trở","Sử dụng hàm map()"]', '["Giải thích ADC 10-bit","Tính điện áp từ giá trị analog"]', 1, unixepoch()),
  
  ('week-05', 'course-tech476', 5, 'Serial Communication', '# Tuần 5: Giao tiếp Serial\n\n- Serial.begin(), print(), read()\n- Serial Monitor\n- Serial Plotter\n- Giao tiếp với máy tính', '["Gửi/nhận dữ liệu qua Serial","Debug bằng Serial Monitor","Vẽ đồ thị với Serial Plotter"]', '["Cấu hình đúng baud rate","Parse dữ liệu từ Serial"]', 1, unixepoch()),
  
  ('week-06', 'course-tech476', 6, 'LCD và hiển thị', '# Tuần 6: LCD 16x2\n\n- Thư viện LiquidCrystal\n- Giao tiếp 4-bit mode\n- I2C LCD\n- Custom characters', '["Kết nối LCD 16x2","Hiển thị text và số","Tạo ký tự tùy chỉnh"]', '["Giải thích giao tiếp LCD","Tạo menu đơn giản trên LCD"]', 1, unixepoch()),
  
  ('week-07', 'course-tech476', 7, 'I2C Communication', '# Tuần 7: Giao thức I2C\n\n- Wire library\n- Địa chỉ I2C\n- RTC DS1307\n- OLED I2C', '["Hiểu giao thức I2C","Sử dụng I2C Scanner","Đọc thời gian từ RTC"]', '["Giải thích SDA/SCL","Tìm địa chỉ I2C của module"]', 1, unixepoch()),
  
  ('week-08', 'course-tech476', 8, 'Servo và động cơ bước', '# Tuần 8: Điều khiển động cơ\n\n- Servo motor\n- Stepper motor\n- Thư viện Servo.h\n- Driver motor', '["Điều khiển servo chính xác","Điều khiển stepper motor","Sử dụng driver L298N"]', '["Giải thích nguyên lý servo","Tính bước của stepper motor"]', 1, unixepoch()),
  
  ('week-09', 'course-tech476', 9, 'Cảm biến môi trường', '# Tuần 9: Cảm biến\n\n- DHT11/DHT22 (nhiệt độ, độ ẩm)\n- HC-SR04 (siêu âm)\n- PIR motion sensor\n- Cảm biến ánh sáng', '["Đọc cảm biến DHT","Đo khoảng cách với HC-SR04","Phát hiện chuyển động"]', '["Giải thích nguyên lý siêu âm","Tính khoảng cách từ thời gian","Xử lý dữ liệu cảm biến"]', 1, unixepoch()),
  
  ('week-10', 'course-tech476', 10, 'SPI và module RF', '# Tuần 10: Giao thức SPI\n\n- SPI basics\n- NRF24L01 module\n- SD Card module\n- Giao tiếp không dây', '["Hiểu giao thức SPI","Gửi/nhận dữ liệu RF","Lưu trữ dữ liệu SD card"]', '["Giải thích MOSI/MISO/SCK/SS","Cấu hình NRF24L01"]', 1, unixepoch()),
  
  ('week-11', 'course-tech476', 11, 'IoT và WiFi (ESP8266)', '# Tuần 11: IoT cơ bản\n\n- ESP8266 module\n- Kết nối WiFi\n- HTTP requests\n- ThingSpeak/Blynk', '["Kết nối WiFi","Gửi dữ liệu lên cloud","Điều khiển từ xa qua app"]', '["Cấu hình AT commands","Gửi GET/POST request","Parse JSON response"]', 1, unixepoch()),
  
  ('week-12', 'course-tech476', 12, 'Final Project', '# Tuần 12: Dự án cuối khóa\n\n- Tổng hợp kiến thức\n- Thiết kế hệ thống\n- Tài liệu kỹ thuật\n- Trình bày demo', '["Thiết kế hệ thống hoàn chỉnh","Viết tài liệu kỹ thuật","Demo sản phẩm"]', '["Áp dụng kiến thức 11 tuần","Giải quyết vấn đề thực tế","Trình bày chuyên nghiệp"]', 1, unixepoch());
