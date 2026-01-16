-- Arduino Knowledge Base - FTS5 Full-Text Search Setup
-- Chú thích: Tạo virtual table FTS5 để tìm kiếm nội dung khóa học

-- 1. FTS5 virtual table cho lessons
DROP TABLE IF EXISTS lessons_fts;
CREATE VIRTUAL TABLE lessons_fts USING fts5(
    id,
    title,
    content,
    content_rowid=id,
    tokenize='unicode61 remove_diacritics 2'
);

-- Populate FTS từ lessons table
INSERT INTO lessons_fts(id, title, content)
SELECT id, title, content FROM lessons;

-- 2. FTS5 virtual table cho labs
DROP TABLE IF EXISTS labs_fts;
CREATE VIRTUAL TABLE labs_fts USING fts5(
    id,
    title,
    instructions,
    content_rowid=id,
    tokenize='unicode61 remove_diacritics 2'
);

-- Populate FTS từ labs table  
INSERT INTO labs_fts(id, title, instructions)
SELECT id, title, instructions FROM labs;

-- 3. FTS5 virtual table cho weeks overview
DROP TABLE IF EXISTS weeks_fts;
CREATE VIRTUAL TABLE weeks_fts USING fts5(
    id,
    title,
    overview,
    content_rowid=id,
    tokenize='unicode61 remove_diacritics 2'
);

INSERT INTO weeks_fts(id, title, overview)
SELECT id, title, COALESCE(overview, '') FROM weeks;

-- 4. Knowledge snippets table - kiến thức Arduino curated
DROP TABLE IF EXISTS knowledge_snippets;
CREATE TABLE knowledge_snippets (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL, -- 'arduino_basics', 'electronics', 'sensors', 'communication', 'programming'
    topic TEXT NOT NULL,
    content TEXT NOT NULL,
    keywords TEXT, -- JSON array for enhanced matching
    priority INTEGER DEFAULT 0,
    created_at INTEGER DEFAULT (unixepoch())
);

-- FTS5 cho knowledge snippets
DROP TABLE IF EXISTS knowledge_fts;
CREATE VIRTUAL TABLE knowledge_fts USING fts5(
    id,
    topic,
    content,
    keywords,
    tokenize='unicode61 remove_diacritics 2'
);

-- Seed knowledge snippets (Arduino fundamentals)
INSERT INTO knowledge_snippets (id, category, topic, content, keywords, priority) VALUES

-- ARDUINO BASICS
('kb-001', 'arduino_basics', 'Arduino là gì?', 
'Arduino là một nền tảng mã nguồn mở (open-source) cho việc xây dựng các dự án điện tử. Nó bao gồm:
- **Phần cứng**: Bo mạch vi điều khiển (Arduino Uno, Mega, Nano...)
- **Phần mềm**: Arduino IDE để lập trình
- **Ngôn ngữ**: Dựa trên C/C++ với thư viện đơn giản hóa

Arduino Uno sử dụng chip ATmega328P:
- 14 chân digital I/O (6 chân hỗ trợ PWM)
- 6 chân analog input
- Bộ nhớ Flash: 32KB
- SRAM: 2KB
- Tốc độ: 16MHz', 
'["arduino","uno","atmega328p","vi điều khiển","microcontroller"]', 10),

('kb-002', 'arduino_basics', 'Cấu trúc chương trình Arduino',
'Mọi chương trình Arduino có 2 hàm bắt buộc:

```cpp
void setup() {
    // Chạy 1 lần khi khởi động
    // Cấu hình chân, khởi tạo Serial, LCD...
}

void loop() {
    // Chạy lặp lại liên tục
    // Code chính của chương trình
}
```

**Các hàm cơ bản:**
- `pinMode(pin, mode)`: Cấu hình chân (INPUT/OUTPUT)
- `digitalWrite(pin, value)`: Xuất HIGH/LOW ra chân digital
- `digitalRead(pin)`: Đọc trạng thái chân digital
- `analogRead(pin)`: Đọc giá trị analog (0-1023)
- `analogWrite(pin, value)`: Xuất PWM (0-255)
- `delay(ms)`: Tạm dừng (milliseconds)', 
'["setup","loop","pinmode","digitalwrite","digitalread","analogread"]', 10),

-- ELECTRONICS
('kb-003', 'electronics', 'Định luật Ohm',
'**Định luật Ohm**: $V = I \times R$

Trong đó:
- $V$ = Điện áp (Volt)
- $I$ = Dòng điện (Ampere)
- $R$ = Điện trở (Ohm)

**Ứng dụng tính điện trở cho LED:**
$$R = \frac{V_{nguồn} - V_{LED}}{I_{LED}}$$

Ví dụ: Arduino 5V, LED đỏ ($V_{LED}$ = 2V), $I$ = 20mA:
$$R = \frac{5 - 2}{0.02} = 150\Omega$$', 
'["ohm","điện trở","volt","ampere","led","resistor","công thức"]', 10),

('kb-004', 'electronics', 'Chân Digital vs Analog',
'**Chân Digital (D0-D13):**
- Chỉ có 2 trạng thái: HIGH (5V) hoặc LOW (0V)
- Dùng cho: LED, Button, Relay, Servo...
- Chân có dấu `~` hỗ trợ PWM (D3, D5, D6, D9, D10, D11)

**Chân Analog (A0-A5):**
- Đọc điện áp từ 0V-5V → giá trị 0-1023 (10-bit ADC)
- Dùng cho: Cảm biến ánh sáng, nhiệt độ, biến trở...
- Cũng có thể dùng như chân digital', 
'["digital","analog","pwm","adc","input","output","chân"]', 9),

-- SENSORS
('kb-005', 'sensors', 'Cảm biến siêu âm HC-SR04',
'**HC-SR04** đo khoảng cách bằng sóng siêu âm.

**Kết nối:**
| HC-SR04 | Arduino |
|---------|---------|
| VCC     | 5V      |
| GND     | GND     |
| TRIG    | D2      |
| ECHO    | D3      |

**Công thức:**
$$Khoảng\_cách (cm) = \frac{Thời\_gian \times 0.034}{2}$$

**Code mẫu:**
```cpp
long duration, distance;
digitalWrite(trigPin, LOW);
delayMicroseconds(2);
digitalWrite(trigPin, HIGH);
delayMicroseconds(10);
digitalWrite(trigPin, LOW);
duration = pulseIn(echoPin, HIGH);
distance = duration * 0.034 / 2;
```', 
'["hc-sr04","siêu âm","ultrasonic","khoảng cách","distance","trig","echo"]', 8),

('kb-006', 'sensors', 'Cảm biến nhiệt độ DHT11/DHT22',
'**DHT11/DHT22** đo nhiệt độ và độ ẩm.

| Thông số | DHT11 | DHT22 |
|----------|-------|-------|
| Nhiệt độ | 0-50°C | -40-80°C |
| Độ ẩm | 20-80% | 0-100% |
| Độ chính xác | ±2°C | ±0.5°C |

**Kết nối:** VCC→5V, GND→GND, DATA→D2 (có điện trở kéo 10kΩ)

**Code (dùng thư viện DHT):**
```cpp
#include <DHT.h>
DHT dht(2, DHT11);

void setup() {
    dht.begin();
}

void loop() {
    float t = dht.readTemperature();
    float h = dht.readHumidity();
}
```', 
'["dht11","dht22","nhiệt độ","độ ẩm","temperature","humidity","cảm biến"]', 8),

-- COMMUNICATION
('kb-007', 'communication', 'Serial Communication',
'**Serial** dùng để giao tiếp giữa Arduino và máy tính (qua USB) hoặc các thiết bị khác.

**Khởi tạo:**
```cpp
void setup() {
    Serial.begin(9600); // Baud rate: 9600 bps
}
```

**Các hàm chính:**
- `Serial.print(data)`: In không xuống dòng
- `Serial.println(data)`: In rồi xuống dòng
- `Serial.read()`: Đọc 1 byte
- `Serial.available()`: Số byte đang chờ đọc
- `Serial.parseInt()`: Đọc số nguyên

**Debug với Serial Monitor:** Mở bằng Ctrl+Shift+M trong Arduino IDE.', 
'["serial","uart","baud","print","println","giao tiếp","debug"]', 9),

('kb-008', 'communication', 'I2C Protocol',
'**I2C** (Inter-Integrated Circuit) là giao thức 2 dây:
- **SDA** (Data): A4 trên Arduino Uno
- **SCL** (Clock): A5 trên Arduino Uno

**Đặc điểm:**
- 1 Master, nhiều Slave (địa chỉ 7-bit)
- Tốc độ: 100kHz (standard), 400kHz (fast)

**Thư viện Wire:**
```cpp
#include <Wire.h>

void setup() {
    Wire.begin(); // Master mode
}

void loop() {
    Wire.beginTransmission(0x27); // Địa chỉ slave
    Wire.write(data);
    Wire.endTransmission();
}
```

**Thiết bị I2C phổ biến:** LCD 1602 I2C, OLED, MPU6050, RTC DS3231...', 
'["i2c","wire","sda","scl","lcd","oled","địa chỉ","giao thức"]', 8),

-- PROGRAMMING
('kb-009', 'programming', 'PWM và analogWrite',
'**PWM** (Pulse Width Modulation) tạo tín hiệu xung vuông với duty cycle thay đổi.

**Công thức Duty Cycle:**
$$Duty\% = \frac{T_{ON}}{T_{ON} + T_{OFF}} \times 100$$

**Arduino PWM:**
- Chân hỗ trợ: D3, D5, D6, D9, D10, D11 (có dấu ~)
- Giá trị: 0-255 (8-bit)
- Tần số: ~490Hz (D5, D6: ~980Hz)

```cpp
analogWrite(9, 128); // 50% duty cycle
analogWrite(9, 255); // 100% (full power)
analogWrite(9, 0);   // 0% (off)
```

**Ứng dụng:** Điều khiển độ sáng LED, tốc độ motor, servo...', 
'["pwm","analogwrite","duty cycle","led dimming","motor speed"]', 9),

('kb-010', 'programming', 'Ngắt (Interrupts)',
'**Interrupt** cho phép Arduino phản hồi ngay lập tức khi có sự kiện, không cần polling.

**Chân hỗ trợ interrupt:**
| Board | Chân |
|-------|------|
| Uno | D2 (INT0), D3 (INT1) |
| Mega | D2, D3, D18, D19, D20, D21 |

**Cú pháp:**
```cpp
attachInterrupt(digitalPinToInterrupt(pin), ISR, mode);
// mode: LOW, CHANGE, RISING, FALLING
```

**Ví dụ đếm button:**
```cpp
volatile int count = 0;

void setup() {
    attachInterrupt(digitalPinToInterrupt(2), countUp, RISING);
}

void countUp() {
    count++;
}
```

**Lưu ý:** ISR phải ngắn, dùng `volatile` cho biến shared.', 
'["interrupt","ngắt","attachinterrupt","isr","volatile","rising","falling"]', 8);

-- Populate knowledge FTS
INSERT INTO knowledge_fts(id, topic, content, keywords)
SELECT id, topic, content, keywords FROM knowledge_snippets;

-- Index cho tìm kiếm nhanh
CREATE INDEX IF NOT EXISTS idx_knowledge_category ON knowledge_snippets(category);
CREATE INDEX IF NOT EXISTS idx_knowledge_priority ON knowledge_snippets(priority DESC);
