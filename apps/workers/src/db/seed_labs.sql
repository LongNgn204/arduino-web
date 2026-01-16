-- ==========================================
-- LABS cho Tuần 1-4
-- Generated: 2026-01-16
-- Run: npx wrangler d1 execute arduino-db --remote --file=src/db/seed_labs.sql
-- ==========================================

-- Xóa dữ liệu cũ trước khi insert
DELETE FROM labs WHERE week_id IN ('week-01', 'week-02', 'week-03', 'week-04');

-- ==========================================
-- LABS TUẦN 1: GPIO & LED
-- ==========================================

INSERT INTO labs (id, week_id, order_index, title, objective, instructions, wiring, starter_code, rubric, simulator_url, duration, is_published, created_at) VALUES 
('lab-01-01', 'week-01', 1, 'Lab 1.1: Blink LED theo Pattern',
 'Viết chương trình điều khiển LED nháy theo 3 quy luật thời gian khác nhau.',
 '## 🎯 Mục tiêu

Sau bài lab này, bạn sẽ:
- Thành thạo cấu trúc `setup()` và `loop()`
- Sử dụng đúng `pinMode()`, `digitalWrite()`, `delay()`
- Viết hàm tái sử dụng `blinkN()`

## 📋 Yêu cầu

1. LED nối vào chân D2, nháy theo 3 quy luật:
   - **Pattern 1**: Bật 1s, tắt 1s, lặp 5 lần
   - **Pattern 2**: Bật 3s, tắt 0.5s, lặp 5 lần
   - **Pattern 3**: Bật 0.5s, tắt 3s, lặp 5 lần

2. Viết hàm `blinkN(int tOnMs, int tOffMs, int n)` để tái sử dụng

3. In thông báo qua Serial khi bắt đầu mỗi pattern

## 💡 Gợi ý

- Dùng `for` loop trong hàm `blinkN()`
- Nhớ gọi `Serial.begin(9600)` trong `setup()`
- Delay giữa các pattern để dễ quan sát

## ✅ Tiêu chí hoàn thành

- LED nháy đúng 3 pattern theo đề bài
- Code có hàm `blinkN()` riêng biệt
- Serial Monitor hiển thị log rõ ràng',
 '## Sơ đồ kết nối

```
Arduino D2 ----[220Ω]----[+]LED[-]---- GND
```

| Arduino | Component |
|---------|-----------|
| D2 | LED Anode (+) qua điện trở 220Ω |
| GND | LED Cathode (-) |',
 '/*
 * Lab 1.1: Blink LED theo Pattern
 * TODO: Sinh viên hoàn thành code
 */

const int LED_PIN = 2;

// TODO: Viết hàm blinkN(tOnMs, tOffMs, n)
// Hàm nháy LED n lần với thời gian bật/tắt tùy chỉnh
void blinkN(int tOnMs, int tOffMs, int n) {
    // Viết code ở đây
}

void setup() {
    Serial.begin(9600);
    pinMode(LED_PIN, OUTPUT);
    Serial.println("=== Lab 1.1: LED Patterns ===");
}

void loop() {
    // Pattern 1: 1s ON / 1s OFF x 5
    Serial.println("Pattern 1: 1s ON / 1s OFF x 5");
    // TODO: Gọi blinkN với tham số đúng

    delay(2000); // Nghỉ giữa các pattern

    // Pattern 2: 3s ON / 0.5s OFF x 5
    Serial.println("Pattern 2: 3s ON / 0.5s OFF x 5");
    // TODO: Gọi blinkN với tham số đúng

    delay(2000);

    // Pattern 3: 0.5s ON / 3s OFF x 5
    Serial.println("Pattern 3: 0.5s ON / 3s OFF x 5");
    // TODO: Gọi blinkN với tham số đúng

    delay(2000);
    Serial.println("=== Restart ===\n");
}',
 '{"criteria":[{"name":"LED nháy đúng pattern","points":40,"description":"3 pattern hoạt động đúng timing"},{"name":"Hàm blinkN() hoạt động","points":30,"description":"Hàm tái sử dụng, có tham số"},{"name":"Serial log","points":15,"description":"In thông báo mỗi pattern"},{"name":"Code style","points":15,"description":"Comment, đặt tên biến rõ ràng"}],"total":100}',
 'https://wokwi.com/projects/new/arduino-uno',
 45, 1, unixepoch()),

('lab-01-02', 'week-01', 2, 'Lab 1.2: Điều khiển 5 LED tuần tự (Knight Rider)',
 'Điều khiển 5 LED (D2-D6) theo hiệu ứng đuổi như đèn xe Knight Rider.',
 '## 🎯 Mục tiêu

- Sử dụng mảng để quản lý nhiều LED
- Viết code gọn với vòng lặp `for`
- Tạo hiệu ứng "chạy" LED

## 📋 Yêu cầu

1. Nối 5 LED vào D2, D3, D4, D5, D6

2. **Hiệu ứng 1**: Chạy từ trái → phải (LED1→LED5), delay 200ms mỗi LED

3. **Hiệu ứng 2**: Chạy từ phải → trái (LED5→LED1), delay 200ms

4. Duy nhất 1 LED sáng tại mỗi thời điểm

5. Lặp liên tục

## 💡 Gợi ý

```cpp
const int LED_PINS[] = {2, 3, 4, 5, 6};
const int NUM_LEDS = 5;

void onlyOne(int index) {
    // Tắt tất cả, bật LED tại index
}
```

## ✅ Tiêu chí

- Hiệu ứng chạy đúng 2 chiều
- Chỉ 1 LED sáng tại mỗi thời điểm
- Code dùng mảng + for loop',
 '## Sơ đồ kết nối

```
D2 ----[220Ω]----LED1---- GND
D3 ----[220Ω]----LED2---- GND
D4 ----[220Ω]----LED3---- GND
D5 ----[220Ω]----LED4---- GND
D6 ----[220Ω]----LED5---- GND
```',
 '/*
 * Lab 1.2: Knight Rider Effect
 * TODO: Hoàn thành code
 */

const int LED_PINS[] = {2, 3, 4, 5, 6};
const int NUM_LEDS = 5;
const int DELAY_MS = 200;

void setup() {
    Serial.begin(9600);
    for (int i = 0; i < NUM_LEDS; i++) {
        pinMode(LED_PINS[i], OUTPUT);
        digitalWrite(LED_PINS[i], LOW);
    }
    Serial.println("=== Knight Rider ===");
}

// TODO: Viết hàm allOff() - tắt tất cả LED
void allOff() {
    // Code ở đây
}

// TODO: Viết hàm onlyOne(int index) - bật duy nhất 1 LED
void onlyOne(int index) {
    // Code ở đây
}

void loop() {
    // Chạy trái → phải
    for (int i = 0; i < NUM_LEDS; i++) {
        // TODO: Gọi onlyOne và delay
    }

    // Chạy phải → trái
    for (int i = NUM_LEDS - 1; i >= 0; i--) {
        // TODO: Gọi onlyOne và delay
    }
}',
 '{"criteria":[{"name":"Hiệu ứng đuổi 2 chiều","points":40,"description":"Chạy đúng L→R và R→L"},{"name":"Duy nhất 1 LED sáng","points":25,"description":"allOff() trước khi bật"},{"name":"Dùng mảng + for","points":20,"description":"Không hardcode từng LED"},{"name":"Code style","points":15,"description":"Comment, readable"}],"total":100}',
 'https://wokwi.com/projects/new/arduino-uno',
 45, 1, unixepoch());

-- ==========================================
-- LABS TUẦN 2: LED 7 ĐOẠN
-- ==========================================

INSERT INTO labs (id, week_id, order_index, title, objective, instructions, wiring, starter_code, rubric, simulator_url, duration, is_published, created_at) VALUES 
('lab-02-01', 'week-02', 1, 'Lab 2.1: LED 7 Đoạn đếm 0-9',
 'Hiển thị số 0-9 trên LED 7 đoạn đơn, mỗi số delay 1 giây.',
 '## 🎯 Mục tiêu

- Hiểu cấu tạo LED 7 đoạn Common Cathode
- Tạo bảng mã segment cho số 0-9
- Hiển thị số bằng cách bật/tắt các segment

## 📋 Yêu cầu

1. LED 7 đoạn CC nối: segment a-g vào D2-D8
2. Hiển thị số 0 → 9, mỗi số giữ 1 giây
3. Lặp liên tục

## 💡 Kiến thức

Bảng mã segment (CC - bật bằng HIGH):
| Số | a | b | c | d | e | f | g | Hex |
|----|---|---|---|---|---|---|---|-----|
| 0 | 1 | 1 | 1 | 1 | 1 | 1 | 0 | 0x3F |
| 1 | 0 | 1 | 1 | 0 | 0 | 0 | 0 | 0x06 |
| ... |

## ✅ Tiêu chí

- Hiển thị đúng số 0-9
- Có bảng mã dạng mảng
- Dùng hàm `displayDigit(int num)`',
 '## Sơ đồ kết nối LED 7 đoạn CC

```
Arduino    LED 7-segment
D2   ----[220Ω]---- Seg a
D3   ----[220Ω]---- Seg b
D4   ----[220Ω]---- Seg c
D5   ----[220Ω]---- Seg d
D6   ----[220Ω]---- Seg e
D7   ----[220Ω]---- Seg f
D8   ----[220Ω]---- Seg g
GND  -------------- Common (CC)
```',
 '/*
 * Lab 2.1: LED 7-Segment Count 0-9
 * TODO: Hoàn thành bảng mã và hàm display
 */

const int SEG_PINS[] = {2, 3, 4, 5, 6, 7, 8}; // a-g
const int NUM_SEGS = 7;

// TODO: Hoàn thành bảng mã segment cho số 0-9
// Bit order: gfedcba (bit 0 = a)
const byte DIGITS[] = {
    0b00111111,  // 0
    0b00000110,  // 1
    // TODO: Thêm số 2-9
};

// TODO: Viết hàm displayDigit(int num)
void displayDigit(int num) {
    if (num < 0 || num > 9) return;
    // Đọc từng bit từ DIGITS[num] và xuất ra chân tương ứng
}

void setup() {
    for (int i = 0; i < NUM_SEGS; i++) {
        pinMode(SEG_PINS[i], OUTPUT);
    }
}

void loop() {
    for (int i = 0; i <= 9; i++) {
        displayDigit(i);
        delay(1000);
    }
}',
 '{"criteria":[{"name":"Hiển thị đúng 0-9","points":40,"description":"Tất cả 10 số hiển thị chính xác"},{"name":"Bảng mã đầy đủ","points":25,"description":"Mảng DIGITS[] có 10 phần tử đúng"},{"name":"Hàm displayDigit()","points":20,"description":"Tách hàm, dùng bitwise"},{"name":"Code style","points":15,"description":"Comment, clean"}],"total":100}',
 'https://wokwi.com/projects/new/arduino-uno',
 60, 1, unixepoch()),

('lab-02-02', 'week-02', 2, 'Lab 2.2: Đồng hồ đếm giây 00-59 (Multiplexing)',
 'Hiển thị đồng hồ đếm giây 00-59 trên module 2 LED 7 đoạn bằng kỹ thuật quét.',
 '## 🎯 Mục tiêu

- Áp dụng kỹ thuật Multiplexing
- Hiển thị số có 2 chữ số
- Quản lý thời gian với millis()

## 📋 Yêu cầu

1. Module 2 LED 7 đoạn CC
2. Đếm từ 00 → 59, tăng 1 mỗi giây
3. Quét 2 digit luân phiên (tần số > 50Hz)
4. Sau 59 quay về 00

## 💡 Gợi ý

```cpp
unsigned long lastSecond = 0;
int seconds = 0;

void loop() {
    // Mỗi 1ms, quét digit
    // Mỗi 1000ms, tăng seconds
}
```

## ✅ Tiêu chí

- Đếm đúng 00-59
- Quét không nhấp nháy (>50Hz)
- Dùng millis() cho timing',
 '## Sơ đồ

```
Segments a-g: D2-D8 (chung 2 digit)
Digit 1 (hàng chục): D9
Digit 2 (hàng đơn vị): D10
```',
 '/*
 * Lab 2.2: 2-Digit Second Counter with Multiplexing
 */

const int SEG_PINS[] = {2, 3, 4, 5, 6, 7, 8};
const int DIGIT_PINS[] = {9, 10}; // D1, D2
const byte DIGITS[] = {0x3F, 0x06, 0x5B, 0x4F, 0x66, 0x6D, 0x7D, 0x07, 0x7F, 0x6F};

int seconds = 0;
unsigned long lastSecond = 0;
unsigned long lastMultiplex = 0;
int currentDigit = 0;

void setup() {
    for (int i = 0; i < 7; i++) pinMode(SEG_PINS[i], OUTPUT);
    for (int i = 0; i < 2; i++) pinMode(DIGIT_PINS[i], OUTPUT);
}

void displaySegments(byte pattern) {
    for (int i = 0; i < 7; i++) {
        digitalWrite(SEG_PINS[i], (pattern >> i) & 1);
    }
}

void loop() {
    // TODO: Implement multiplexing
    // 1. Tắt cả 2 digit
    // 2. Bật 1 digit, xuất mã số tương ứng
    // 3. Delay 2-5ms
    // 4. Đổi digit

    // TODO: Implement second counter
    // Mỗi 1000ms, tăng seconds
    // Nếu seconds > 59, reset về 0
}',
 '{"criteria":[{"name":"Đếm đúng 00-59","points":35,"description":"Tăng mỗi giây, reset sau 59"},{"name":"Multiplexing hoạt động","points":35,"description":"2 số hiển thị không nhấp nháy"},{"name":"Dùng millis()","points":15,"description":"Non-blocking timing"},{"name":"Code style","points":15,"description":"Clean, commented"}],"total":100}',
 'https://wokwi.com/projects/new/arduino-uno',
 60, 1, unixepoch());

-- ==========================================
-- LABS TUẦN 3: NÚT NHẤN & KEYPAD
-- ==========================================

INSERT INTO labs (id, week_id, order_index, title, objective, instructions, wiring, starter_code, rubric, simulator_url, duration, is_published, created_at) VALUES 
('lab-03-01', 'week-03', 1, 'Lab 3.1: Toggle LED với nút nhấn (Debounce)',
 'Mỗi lần nhấn nút, LED đổi trạng thái (ON↔OFF) với xử lý debounce.',
 '## 🎯 Mục tiêu

- Hiểu INPUT_PULLUP và logic đảo
- Implement debounce bằng delay hoặc millis
- Detect falling edge (lúc nhấn)

## 📋 Yêu cầu

1. Nút nhấn nối D2 (với INPUT_PULLUP)
2. LED nối D13
3. Mỗi lần NHẤN nút → LED toggle
4. Có debounce (không đổi trạng thái liên tục khi giữ nút)

## 💡 Logic INPUT_PULLUP

- Không nhấn → digitalRead() = HIGH
- Nhấn → digitalRead() = LOW
- Detect falling edge: hiện tại LOW, trước đó HIGH

## ✅ Tiêu chí

- Toggle chính xác mỗi lần nhấn
- Không toggle khi giữ nút
- Debounce hoạt động',
 '## Sơ đồ

```
D2 ----[Button]---- GND (dùng PULLUP nội)
D13 ---[220Ω]---LED--- GND
```',
 '/*
 * Lab 3.1: Toggle LED with Debounce
 */

const int BTN_PIN = 2;
const int LED_PIN = 13;
const int DEBOUNCE_MS = 50;

int lastButtonState = HIGH;
int ledState = LOW;
unsigned long lastDebounceTime = 0;

void setup() {
    pinMode(BTN_PIN, INPUT_PULLUP);
    pinMode(LED_PIN, OUTPUT);
    Serial.begin(9600);
}

void loop() {
    int reading = digitalRead(BTN_PIN);

    // TODO: Implement debounce và edge detection
    // 1. Nếu reading khác lastButtonState, reset lastDebounceTime
    // 2. Nếu đủ thời gian debounce và phát hiện falling edge (HIGH→LOW)
    //    → Toggle ledState
    // 3. Cập nhật lastButtonState

    digitalWrite(LED_PIN, ledState);
}',
 '{"criteria":[{"name":"Toggle chính xác","points":35,"description":"Mỗi nhấn = 1 toggle"},{"name":"Debounce hoạt động","points":35,"description":"Không toggle liên tục khi giữ"},{"name":"Edge detection đúng","points":15,"description":"Chỉ toggle lúc nhấn, không lúc nhả"},{"name":"Code style","points":15,"description":"Readable, commented"}],"total":100}',
 'https://wokwi.com/projects/new/arduino-uno',
 45, 1, unixepoch()),

('lab-03-02', 'week-03', 2, 'Lab 3.2: Keypad 4x4 hiển thị LED 7 đoạn',
 'Nhấn phím 0-9 trên keypad 4x4, hiển thị số đó lên LED 7 đoạn.',
 '## 🎯 Mục tiêu

- Sử dụng thư viện Keypad
- Kết hợp input (keypad) và output (7-seg)
- Xử lý ký tự từ keypad

## 📋 Yêu cầu

1. Keypad 4x4 nối D14-D21 (A0-A7)
2. LED 7 đoạn CC nối D2-D8
3. Nhấn phím 0-9 → Hiển thị số đó
4. Nhấn * → Tắt màn hình
5. Nhấn # → Hiển thị chữ E (Error)

## 💡 Thư viện

```cpp
#include <Keypad.h>

const byte ROWS = 4;
const byte COLS = 4;
char keys[ROWS][COLS] = {...};
```

## ✅ Tiêu chí

- Hiển thị đúng số 0-9
- * và # xử lý đúng
- Phản hồi nhanh',
 '## Sơ đồ

```
Keypad:
  Row 1-4: A0-A3
  Col 1-4: A4-A7

LED 7-seg:
  Seg a-g: D2-D8
  Common: GND
```',
 '/*
 * Lab 3.2: Keypad to 7-Segment Display
 */

#include <Keypad.h>

const byte ROWS = 4;
const byte COLS = 4;
char keys[ROWS][COLS] = {
    {''1'', ''2'', ''3'', ''A''},
    {''4'', ''5'', ''6'', ''B''},
    {''7'', ''8'', ''9'', ''C''},
    {''*'', ''0'', ''#'', ''D''}
};
byte rowPins[ROWS] = {A0, A1, A2, A3};
byte colPins[COLS] = {A4, A5, A6, A7};

Keypad keypad = Keypad(makeKeymap(keys), rowPins, colPins, ROWS, COLS);

const int SEG_PINS[] = {2, 3, 4, 5, 6, 7, 8};
const byte DIGITS[] = {0x3F, 0x06, 0x5B, 0x4F, 0x66, 0x6D, 0x7D, 0x07, 0x7F, 0x6F};
const byte CHAR_E = 0x79; // Chữ E cho lỗi
const byte CHAR_OFF = 0x00; // Tắt

void displayPattern(byte pattern) {
    for (int i = 0; i < 7; i++) {
        digitalWrite(SEG_PINS[i], (pattern >> i) & 1);
    }
}

void setup() {
    for (int i = 0; i < 7; i++) pinMode(SEG_PINS[i], OUTPUT);
    displayPattern(CHAR_OFF);
}

void loop() {
    char key = keypad.getKey();
    if (key) {
        // TODO: Xử lý key
        // - Nếu 0-9: displayPattern(DIGITS[key - ''0''])
        // - Nếu *: displayPattern(CHAR_OFF)
        // - Nếu #: displayPattern(CHAR_E)
    }
}',
 '{"criteria":[{"name":"Hiển thị 0-9 đúng","points":40,"description":"Nhấn số nào hiển thị số đó"},{"name":"Xử lý * và #","points":25,"description":"* tắt, # hiển thị E"},{"name":"Keypad đọc đúng","points":20,"description":"Thư viện hoạt động"},{"name":"Code style","points":15,"description":"Clean, commented"}],"total":100}',
 'https://wokwi.com/projects/new/arduino-uno',
 60, 1, unixepoch());

-- ==========================================
-- LABS TUẦN 4: ADC & PWM
-- ==========================================

INSERT INTO labs (id, week_id, order_index, title, objective, instructions, wiring, starter_code, rubric, simulator_url, duration, is_published, created_at) VALUES 
('lab-04-01', 'week-04', 1, 'Lab 4.1: Điều khiển độ sáng LED bằng biến trở',
 'Dùng biến trở (potentiometer) để điều chỉnh độ sáng LED qua PWM.',
 '## 🎯 Mục tiêu

- Sử dụng analogRead() đọc ADC
- Sử dụng analogWrite() xuất PWM
- Áp dụng hàm map() chuyển đổi giá trị

## 📋 Yêu cầu

1. Biến trở 10kΩ nối A0 (giữa), 5V, GND
2. LED nối D9 (chân PWM ~)
3. Vặn biến trở → LED thay đổi độ sáng
4. Hiển thị giá trị ADC và PWM qua Serial

## 💡 Công thức

```cpp
int sensorValue = analogRead(A0);        // 0-1023
int pwmValue = map(sensorValue, 0, 1023, 0, 255);
analogWrite(LED_PIN, pwmValue);          // 0-255
```

## ✅ Tiêu chí

- LED thay đổi độ sáng mượt
- Serial log giá trị ADC và PWM
- Dùng map() đúng cách',
 '## Sơ đồ

```
Potentiometer:
  Pin 1 ------ 5V
  Pin 2 (wiper) ---- A0
  Pin 3 ------ GND

LED:
  D9 ---[220Ω]---LED--- GND
```',
 '/*
 * Lab 4.1: LED Brightness Control with Potentiometer
 */

const int POT_PIN = A0;
const int LED_PIN = 9; // PWM pin

void setup() {
    Serial.begin(9600);
    pinMode(LED_PIN, OUTPUT);
}

void loop() {
    // TODO: Đọc giá trị ADC từ biến trở
    int sensorValue = 0; // Thay bằng analogRead()

    // TODO: Chuyển đổi 0-1023 sang 0-255 bằng map()
    int pwmValue = 0; // Thay bằng map()

    // TODO: Xuất PWM ra LED
    // analogWrite(...)

    // Log qua Serial
    Serial.print("ADC: ");
    Serial.print(sensorValue);
    Serial.print(" -> PWM: ");
    Serial.println(pwmValue);

    delay(100);
}',
 '{"criteria":[{"name":"LED sáng mượt theo biến trở","points":40,"description":"Không nhảy ngắt quãng"},{"name":"Dùng map() đúng","points":25,"description":"Chuyển 0-1023 sang 0-255"},{"name":"Serial log","points":20,"description":"Hiển thị ADC và PWM"},{"name":"Code style","points":15,"description":"Readable, commented"}],"total":100}',
 'https://wokwi.com/projects/new/arduino-uno',
 45, 1, unixepoch()),

('lab-04-02', 'week-04', 2, 'Lab 4.2: Thước đo ánh sáng với LDR',
 'Dùng cảm biến LDR đo cường độ ánh sáng, hiển thị bằng LED bar.',
 '## 🎯 Mục tiêu

- Đọc cảm biến ánh sáng LDR
- Hiển thị cường độ bằng LED bar 5 mức
- Áp dụng logic điều kiện

## 📋 Yêu cầu

1. LDR + điện trở 10kΩ tạo voltage divider nối A0
2. 5 LED nối D2-D6
3. Ánh sáng yếu → 1 LED sáng
4. Ánh sáng mạnh → 5 LED sáng
5. Serial hiển thị giá trị và mức

## 💡 Gợi ý

```cpp
int level = map(lightValue, 0, 1023, 0, 5);
for (int i = 0; i < NUM_LEDS; i++) {
    digitalWrite(LED_PINS[i], i < level ? HIGH : LOW);
}
```

## ✅ Tiêu chí

- LED bar phản ánh đúng mức sáng
- Calibrate được với môi trường
- Phản hồi nhanh',
 '## Sơ đồ

```
LDR Voltage Divider:
  5V ---- LDR ---- A0 ---- 10kΩ ---- GND

LED Bar:
  D2-D6 ---[220Ω]---LED--- GND (5 LED)
```',
 '/*
 * Lab 4.2: Light Meter with LDR and LED Bar
 */

const int LDR_PIN = A0;
const int LED_PINS[] = {2, 3, 4, 5, 6};
const int NUM_LEDS = 5;

void setup() {
    Serial.begin(9600);
    for (int i = 0; i < NUM_LEDS; i++) {
        pinMode(LED_PINS[i], OUTPUT);
    }
}

void loop() {
    // TODO: Đọc giá trị LDR
    int lightValue = 0; // analogRead()

    // TODO: Tính level (0-5) dựa trên lightValue
    // Gợi ý: dùng map() hoặc điều kiện if-else
    int level = 0;

    // TODO: Bật số LED tương ứng với level
    // LED 0 đến level-1 sáng, còn lại tắt
    for (int i = 0; i < NUM_LEDS; i++) {
        // digitalWrite(...)
    }

    // Log
    Serial.print("Light: ");
    Serial.print(lightValue);
    Serial.print(" -> Level: ");
    Serial.println(level);

    delay(100);
}',
 '{"criteria":[{"name":"LED bar phản ánh độ sáng","points":40,"description":"Càng sáng càng nhiều LED"},{"name":"5 mức hoạt động đúng","points":25,"description":"Từ 1-5 LED"},{"name":"Serial log","points":20,"description":"Hiển thị giá trị và mức"},{"name":"Code style","points":15,"description":"Clean, commented"}],"total":100}',
 'https://wokwi.com/projects/new/arduino-uno',
 45, 1, unixepoch());
