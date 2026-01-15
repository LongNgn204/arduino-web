# Tuần 6: Cảm biến trong Hệ thống Nhúng

> **Thời lượng**: 3 tiết lý thuyết + 2 tiết thực hành  
> **Mục tiêu**: Đọc và xử lý dữ liệu từ các cảm biến phổ biến

---

## 🎯 Mục tiêu học tập

Sau khi hoàn thành tuần này, bạn sẽ:

1. ✅ Đo khoảng cách với cảm biến siêu âm HC-SR04
2. ✅ Đọc nhiệt độ và độ ẩm từ DHT11
3. ✅ Phát hiện chuyển động với PIR
4. ✅ Đọc cảm biến chạm TTP223
5. ✅ Xây dựng hệ thống cảnh báo theo ngưỡng

---

## 📚 Phần 1: Lý thuyết cốt lõi

### 1.1 Cảm biến siêu âm HC-SR04

**HC-SR04** đo khoảng cách bằng sóng siêu âm (40kHz).

#### Thông số kỹ thuật:
| Thông số | Giá trị |
|----------|---------|
| Điện áp | 5V DC |
| Dòng tiêu thụ | 15mA |
| Tần số | 40kHz |
| Khoảng đo | 2cm - 400cm |
| Độ phân giải | 0.3cm |

#### Nguyên lý hoạt động:
```
Arduino                HC-SR04
   │                      │
   │ ──── TRIG (10µs) ──► │ → Phát sóng siêu âm
   │                      │   ↓ (phản xạ từ vật cản)
   │ ◄─── ECHO (tPulse) ─ │ ← Nhận sóng phản hồi
   │                      │
   
Khoảng cách = Tốc độ × Thời gian / 2
           = 340 m/s × tPulse / 2
           = 0.034 cm/µs × tPulse / 2
```

#### Sơ đồ kết nối:
```
HC-SR04        Arduino
  VCC ──────── 5V
  TRIG ─────── D9
  ECHO ─────── D10
  GND ──────── GND
```

### 1.2 Cảm biến nhiệt độ/độ ẩm DHT11

**DHT11** đo nhiệt độ và độ ẩm, truyền data qua 1 dây (protocol riêng).

#### Thông số kỹ thuật:
| Thông số | Giá trị |
|----------|---------|
| Điện áp | 3.3V - 5.5V |
| Nhiệt độ | 0°C - 50°C (±2°C) |
| Độ ẩm | 20% - 90% RH (±5%) |
| Thời gian đọc | ~2 giây |

#### Sơ đồ kết nối:
```
DHT11          Arduino
  VCC ──────── 5V
  DATA ─┬───── D2
        │
      [10kΩ] ── 5V (Pull-up)
  GND ──────── GND
```

> 💡 **Mẹo**: Không đọc DHT11 quá nhanh (tối thiểu 2 giây giữa các lần đọc)

### 1.3 Cảm biến chuyển động PIR

**PIR (Passive Infrared)** phát hiện chuyển động dựa trên nhiệt độ cơ thể.

#### Thông số:
| Thông số | Giá trị |
|----------|---------|
| Điện áp | 5V - 20V |
| Góc phát hiện | 120° |
| Khoảng cách | ~7m |
| Output | HIGH khi phát hiện |

#### Sơ đồ kết nối:
```
PIR            Arduino
  VCC ──────── 5V
  OUT ──────── D3
  GND ──────── GND
```

### 1.4 Cảm biến chạm TTP223

**TTP223** là cảm biến chạm điện dung, thay thế nút nhấn cơ khí.

#### Thông số:
| Thông số | Giá trị |
|----------|---------|
| Điện áp | 2V - 5.5V |
| Output | HIGH khi chạm |
| Thời gian phản hồi | 60ms |

---

## 💻 Phần 2: Code mẫu hoàn chỉnh

### 2.1 HC-SR04 + 8 LED theo khoảng cách

```cpp
/*
 * Bài 6-1: HC-SR04 + 8 LED theo khoảng cách
 * 
 * - <30cm: chạy led1→led8
 * - >80cm: chạy led8→led1
 * - 30–80cm: bật/tắt 8 led chu kỳ 1s
 * 
 * Serial: "Khoảng cách __ cm -> Chương trình __"
 */

const int TRIG_PIN = 9;
const int ECHO_PIN = 10;
const int LED_PINS[] = {2, 3, 4, 5, 6, 7, 8, A0};
const int NUM_LEDS = 8;

int currentLed = 0;
int program = 1;
bool ledsOn = false;
unsigned long lastUpdate = 0;

long readDistanceCM() {
    digitalWrite(TRIG_PIN, LOW);
    delayMicroseconds(2);
    digitalWrite(TRIG_PIN, HIGH);
    delayMicroseconds(10);
    digitalWrite(TRIG_PIN, LOW);
    
    long duration = pulseIn(ECHO_PIN, HIGH, 30000);  // Timeout 30ms
    if (duration == 0) return -1;  // No echo
    return duration * 0.034 / 2;
}

void allOff() {
    for (int i = 0; i < NUM_LEDS; i++) {
        digitalWrite(LED_PINS[i], LOW);
    }
}

void allOn() {
    for (int i = 0; i < NUM_LEDS; i++) {
        digitalWrite(LED_PINS[i], HIGH);
    }
}

void setup() {
    Serial.begin(9600);
    pinMode(TRIG_PIN, OUTPUT);
    pinMode(ECHO_PIN, INPUT);
    
    for (int i = 0; i < NUM_LEDS; i++) {
        pinMode(LED_PINS[i], OUTPUT);
    }
    allOff();
    
    Serial.println("=== HC-SR04 Distance LED Control ===");
}

void loop() {
    long distance = readDistanceCM();
    if (distance < 0) return;  // Error reading
    
    // Xác định chương trình
    if (distance < 30) {
        program = 1;
    } else if (distance > 80) {
        program = 2;
    } else {
        program = 3;
    }
    
    // Thực hiện chương trình
    if (millis() - lastUpdate >= 200) {
        lastUpdate = millis();
        allOff();
        
        if (program == 1) {
            // Chạy 1→8
            digitalWrite(LED_PINS[currentLed], HIGH);
            currentLed = (currentLed + 1) % NUM_LEDS;
        } else if (program == 2) {
            // Chạy 8→1
            digitalWrite(LED_PINS[NUM_LEDS - 1 - currentLed], HIGH);
            currentLed = (currentLed + 1) % NUM_LEDS;
        } else {
            // Bật/tắt tất cả
            static bool toggle = false;
            if (millis() % 1000 < 500) {
                allOn();
            } else {
                allOff();
            }
        }
        
        Serial.print("Khoảng cách ");
        Serial.print(distance);
        Serial.print(" cm -> Chương trình ");
        Serial.println(program);
    }
}
```

### 2.2 HC-SR04 cảnh báo màu (xanh/vàng/đỏ)

```cpp
/*
 * Bài 6-2: HC-SR04 cảnh báo 3 mức
 * 
 * - >60cm: an toàn → LED xanh
 * - 30–60cm: cảnh báo → LED vàng
 * - <30cm: nguy hiểm → LED đỏ
 * 
 * Serial: "Khoảng cách __ cm. trạng thái __"
 */

const int TRIG_PIN = 9;
const int ECHO_PIN = 10;
const int LED_GREEN = 2;
const int LED_YELLOW = 3;
const int LED_RED = 4;

long readDistanceCM() {
    digitalWrite(TRIG_PIN, LOW);
    delayMicroseconds(2);
    digitalWrite(TRIG_PIN, HIGH);
    delayMicroseconds(10);
    digitalWrite(TRIG_PIN, LOW);
    
    long duration = pulseIn(ECHO_PIN, HIGH, 30000);
    if (duration == 0) return -1;
    return duration * 0.034 / 2;
}

void setLED(int green, int yellow, int red) {
    digitalWrite(LED_GREEN, green);
    digitalWrite(LED_YELLOW, yellow);
    digitalWrite(LED_RED, red);
}

void setup() {
    Serial.begin(9600);
    pinMode(TRIG_PIN, OUTPUT);
    pinMode(ECHO_PIN, INPUT);
    pinMode(LED_GREEN, OUTPUT);
    pinMode(LED_YELLOW, OUTPUT);
    pinMode(LED_RED, OUTPUT);
    
    Serial.println("=== Distance Warning System ===");
}

void loop() {
    long distance = readDistanceCM();
    if (distance < 0) return;
    
    String status;
    
    if (distance > 60) {
        setLED(HIGH, LOW, LOW);
        status = "an toàn";
    } else if (distance >= 30) {
        setLED(LOW, HIGH, LOW);
        status = "cảnh báo";
    } else {
        setLED(LOW, LOW, HIGH);
        status = "nguy hiểm";
    }
    
    Serial.print("Khoảng cách ");
    Serial.print(distance);
    Serial.print(" cm. trạng thái ");
    Serial.println(status);
    
    delay(200);
}
```

### 2.3 HC-SR04 số LED bật theo khoảng cách

```cpp
/*
 * Bài 6-3: Số LED bật theo khoảng cách
 * 
 * - 20cm bật 1 LED
 * - Mỗi +10cm thêm 1 LED, tối đa 8
 * 
 * Serial: "Khoảng cách __ cm. Số led bật __"
 */

const int TRIG_PIN = 9;
const int ECHO_PIN = 10;
const int LED_PINS[] = {2, 3, 4, 5, 6, 7, 8, A0};
const int NUM_LEDS = 8;

long readDistanceCM() {
    digitalWrite(TRIG_PIN, LOW);
    delayMicroseconds(2);
    digitalWrite(TRIG_PIN, HIGH);
    delayMicroseconds(10);
    digitalWrite(TRIG_PIN, LOW);
    
    long duration = pulseIn(ECHO_PIN, HIGH, 30000);
    if (duration == 0) return 100;  // Default far
    return duration * 0.034 / 2;
}

void setLEDCount(int count) {
    for (int i = 0; i < NUM_LEDS; i++) {
        digitalWrite(LED_PINS[i], i < count ? HIGH : LOW);
    }
}

void setup() {
    Serial.begin(9600);
    pinMode(TRIG_PIN, OUTPUT);
    pinMode(ECHO_PIN, INPUT);
    
    for (int i = 0; i < NUM_LEDS; i++) {
        pinMode(LED_PINS[i], OUTPUT);
    }
    
    Serial.println("=== Distance LED Bar ===");
}

void loop() {
    long distance = readDistanceCM();
    
    // Tính số LED: 20cm=1, 30cm=2, 40cm=3, ...
    int ledCount = 0;
    if (distance >= 20) {
        ledCount = min((int)((distance - 10) / 10), NUM_LEDS);
    }
    
    setLEDCount(ledCount);
    
    Serial.print("Khoảng cách ");
    Serial.print(distance);
    Serial.print(" cm. Số led bật ");
    Serial.println(ledCount);
    
    delay(200);
}
```

### 2.4 DHT11 giám sát nhiệt độ/độ ẩm

```cpp
/*
 * Bài 6-4: DHT11 giám sát theo ngưỡng
 * 
 * - 2 dưới ngưỡng → xanh
 * - 1 vượt ngưỡng → vàng
 * - 2 vượt ngưỡng → đỏ
 * 
 * Ngưỡng: Nhiệt độ > 30°C, Độ ẩm > 70%
 * Serial: "Nhiệt độ: __ C. Độ ẩm: __ %. Màu led __"
 */

#include <DHT.h>

const int DHT_PIN = 2;
const int LED_GREEN = 3;
const int LED_YELLOW = 4;
const int LED_RED = 5;

const float TEMP_THRESHOLD = 30.0;
const float HUMID_THRESHOLD = 70.0;

DHT dht(DHT_PIN, DHT11);

void setLED(int green, int yellow, int red) {
    digitalWrite(LED_GREEN, green);
    digitalWrite(LED_YELLOW, yellow);
    digitalWrite(LED_RED, red);
}

void setup() {
    Serial.begin(9600);
    dht.begin();
    
    pinMode(LED_GREEN, OUTPUT);
    pinMode(LED_YELLOW, OUTPUT);
    pinMode(LED_RED, OUTPUT);
    
    Serial.println("=== DHT11 Monitor ===");
}

void loop() {
    delay(2000);  // DHT11 cần ít nhất 2s giữa các lần đọc
    
    float temperature = dht.readTemperature();
    float humidity = dht.readHumidity();
    
    if (isnan(temperature) || isnan(humidity)) {
        Serial.println("Lỗi đọc DHT11!");
        return;
    }
    
    // Đếm số ngưỡng vượt
    int overCount = 0;
    if (temperature > TEMP_THRESHOLD) overCount++;
    if (humidity > HUMID_THRESHOLD) overCount++;
    
    String ledColor;
    if (overCount == 0) {
        setLED(HIGH, LOW, LOW);
        ledColor = "xanh";
    } else if (overCount == 1) {
        setLED(LOW, HIGH, LOW);
        ledColor = "vàng";
    } else {
        setLED(LOW, LOW, HIGH);
        ledColor = "đỏ";
    }
    
    Serial.print("Nhiệt độ: ");
    Serial.print(temperature, 1);
    Serial.print(" C. Độ ẩm: ");
    Serial.print(humidity, 1);
    Serial.print(" %. Màu led ");
    Serial.println(ledColor);
}
```

### 2.5 TTP223 tăng/giảm + 7-segment

```cpp
/*
 * Bài 6-5: 2 TTP223 tăng/giảm (0..9) + hiển thị 7 đoạn
 * 
 * - Chạm A tăng, chạm B giảm
 * - Chặn biên 0..9
 * 
 * Serial: "Đã chạm cảm biến: __, tổng số lần chạm: __ lần."
 */

const int TOUCH_A = 2;  // Tăng
const int TOUCH_B = 3;  // Giảm

const int SEG_PINS[] = {4, 5, 6, 7, 8, 9, 10};  // a-g
const int NUM_SEGS = 7;

const byte DIGITS[] = {
    0b00111111, 0b00000110, 0b01011011, 0b01001111, 0b01100110,
    0b01101101, 0b01111101, 0b00000111, 0b01111111, 0b01101111
};

int displayValue = 0;
int totalTouches = 0;

bool lastA = LOW, lastB = LOW;

void displayDigit(int num) {
    byte pattern = DIGITS[num % 10];
    for (int i = 0; i < NUM_SEGS; i++) {
        digitalWrite(SEG_PINS[i], (pattern >> i) & 1);
    }
}

void setup() {
    Serial.begin(9600);
    pinMode(TOUCH_A, INPUT);
    pinMode(TOUCH_B, INPUT);
    
    for (int i = 0; i < NUM_SEGS; i++) {
        pinMode(SEG_PINS[i], OUTPUT);
    }
    
    displayDigit(0);
    Serial.println("=== Touch Counter ===");
}

void loop() {
    bool touchA = digitalRead(TOUCH_A);
    bool touchB = digitalRead(TOUCH_B);
    
    // Phát hiện cạnh lên (chạm mới)
    if (touchA && !lastA) {
        if (displayValue < 9) displayValue++;
        totalTouches++;
        Serial.print("Đã chạm cảm biến: A, tổng số lần chạm: ");
        Serial.print(totalTouches);
        Serial.println(" lần.");
    }
    
    if (touchB && !lastB) {
        if (displayValue > 0) displayValue--;
        totalTouches++;
        Serial.print("Đã chạm cảm biến: B, tổng số lần chạm: ");
        Serial.print(totalTouches);
        Serial.println(" lần.");
    }
    
    lastA = touchA;
    lastB = touchB;
    
    displayDigit(displayValue);
    delay(50);
}
```

### 2.6 PIR kích hoạt báo động

```cpp
/*
 * Bài 6-6: PIR kích hoạt LED + relay còi
 * 
 * - Có tín hiệu: "Có di chuyển trong phạm vi giám sát. Kích hoạt báo động"
 * - Không: "An toàn"
 */

const int PIR_PIN = 2;
const int LED_PIN = 13;
const int RELAY_PIN = 3;  // Relay điều khiển còi

void setup() {
    Serial.begin(9600);
    pinMode(PIR_PIN, INPUT);
    pinMode(LED_PIN, OUTPUT);
    pinMode(RELAY_PIN, OUTPUT);
    
    digitalWrite(LED_PIN, LOW);
    digitalWrite(RELAY_PIN, LOW);
    
    Serial.println("=== PIR Alarm System ===");
    Serial.println("Đang khởi động... chờ 30s để PIR ổn định");
    delay(30000);  // PIR cần thời gian warm-up
    Serial.println("Sẵn sàng!");
}

void loop() {
    bool motion = digitalRead(PIR_PIN);
    
    if (motion) {
        digitalWrite(LED_PIN, HIGH);
        digitalWrite(RELAY_PIN, HIGH);
        Serial.println("Có di chuyển trong phạm vi giám sát. Kích hoạt báo động");
        delay(2000);  // Giữ báo động 2s
    } else {
        digitalWrite(LED_PIN, LOW);
        digitalWrite(RELAY_PIN, LOW);
        Serial.println("An toàn");
    }
    
    delay(200);
}
```

---

## ⚠️ Phần 3: Lỗi thường gặp & Cách khắc phục

### 3.1 HC-SR04 đọc sai/không ổn định

| Nguyên nhân | Cách sửa |
|-------------|----------|
| Timeout quá ngắn | Tăng timeout pulseIn() lên 30000 |
| Vật cản góc lệch | Đặt vuông góc với vật cản |
| Nhiễu | Thêm delay 50ms giữa các lần đọc |

### 3.2 DHT11 trả về NaN

| Nguyên nhân | Cách sửa |
|-------------|----------|
| Đọc quá nhanh | Chờ ít nhất 2s giữa các lần đọc |
| Thiếu pull-up | Thêm điện trở 10kΩ từ DATA lên VCC |
| Sai chân | Kiểm tra chân DATA |

### 3.3 PIR báo động giả

| Nguyên nhân | Cách sửa |
|-------------|----------|
| Chưa warm-up | Chờ 30-60s sau khi bật nguồn |
| Góc quét rộng | Điều chỉnh sensitivity/time trên PIR |

---

## 🎓 Phần 4: Tóm tắt kiến thức

### Key Points:

1. **HC-SR04**: Đo khoảng cách = (pulseIn × 0.034) / 2
2. **DHT11**: Cần 2s giữa các lần đọc, dùng thư viện DHT.h
3. **PIR**: Cần warm-up 30-60s, output HIGH khi có chuyển động
4. **TTP223**: Cảm biến chạm điện dung, thay thế nút nhấn

### Công thức:
```
Khoảng cách (cm) = duration × 0.034 / 2
```

---

## 📋 Phần 5: Quiz tự kiểm tra

### Câu 1:
HC-SR04 hoạt động ở tần số nào?

- A. 20kHz
- B. 40kHz
- C. 60kHz
- D. 100kHz

<details>
<summary>Đáp án</summary>

**B. 40kHz**

Sóng siêu âm 40kHz, nằm ngoài phạm vi nghe của con người.
</details>

### Câu 2:
DHT11 cần chờ bao lâu giữa các lần đọc?

- A. 100ms
- B. 500ms
- C. 2 giây
- D. 5 giây

<details>
<summary>Đáp án</summary>

**C. 2 giây**

DHT11 có thời gian sampling chậm, đọc nhanh hơn sẽ gây lỗi.
</details>

### Câu 3-10:
*(Các câu hỏi về nguyên lý cảm biến, kết nối, xử lý lỗi)*

---

## 🔬 Phần 6: Bài thực hành (Labs)

### Lab 6-1 đến 6-6:
*(Rubric cho mỗi bài như trong code mẫu)*

---

## 🏆 Đề thi mẫu 60 phút

### Đề bài:
**Hệ thống cảnh báo khoảng cách + 3 LED + relay còi + Serial log**

1. >60cm: an toàn, LED xanh
2. 30-60cm: cảnh báo, LED vàng
3. <30cm: nguy hiểm, LED đỏ + relay còi
4. Serial log đúng format

### Rubric:
| Tiêu chí | Điểm |
|----------|------|
| Đo khoảng cách chính xác | 25% |
| 3 mức cảnh báo đúng | 30% |
| Relay hoạt động | 20% |
| Serial output đúng | 15% |
| Code sạch | 10% |

---

> **Tuần tiếp theo**: Tuần 7 - Serial UART (Giao tiếp nối tiếp)
