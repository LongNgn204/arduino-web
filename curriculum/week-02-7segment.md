# Tuần 2: Thiết kế Hệ thống Nhúng & LED 7 Đoạn

> **Thời lượng**: 3 tiết lý thuyết + 2 tiết thực hành  
> **Mục tiêu**: Hiểu phương pháp thiết kế, điều khiển LED 7 đoạn đơn và module 4 số

---

## 🎯 Mục tiêu học tập

Sau khi hoàn thành tuần này, bạn sẽ:

1. ✅ Hiểu phương pháp thiết kế Top-Down và Bottom-Up
2. ✅ Nắm cấu tạo LED 7 đoạn: Common Cathode vs Common Anode
3. ✅ Tạo bảng mã segment để hiển thị số 0-9
4. ✅ Điều khiển module 4 số bằng kỹ thuật Multiplexing (quét)
5. ✅ Sử dụng 74HC595 để giảm số chân điều khiển

---

## 📚 Phần 1: Lý thuyết cốt lõi

### 1.1 Phương pháp thiết kế hệ thống nhúng

#### Top-Down Design (Từ trên xuống)

Bắt đầu từ **yêu cầu tổng thể**, chia nhỏ thành các module con, rồi thiết kế từng phần.

```
[Yêu cầu] → [Thiết kế tổng thể] → [Chia module] → [Thiết kế chi tiết] → [Tích hợp] → [Test]
```

**Ưu điểm**:
- Có cái nhìn toàn cảnh trước
- Dễ quản lý dự án lớn
- Phát hiện sớm lỗi logic

#### Bottom-Up Design (Từ dưới lên)

Bắt đầu từ **module nhỏ nhất**, thử nghiệm từng phần rồi ghép lại.

```
[Module A chạy] + [Module B chạy] → [Ghép A+B] → [Thêm C] → [Hệ thống hoàn chỉnh]
```

**Ưu điểm**:
- Phù hợp học tập, thử nghiệm
- Phát hiện sớm lỗi phần cứng
- Dễ debug từng phần

#### Khi nào dùng?

| Tình huống | Phương pháp |
|------------|-------------|
| Dự án lớn, nhiều người | Top-Down |
| Học module mới | Bottom-Up |
| Thi thực hành 60 phút | Bottom-Up (test LED trước, rồi ghép logic) |

### 1.2 LED 7 đoạn - Cấu tạo và nguyên lý

**LED 7 đoạn** gồm 7 thanh LED (a-g) và 1 dấu chấm (dp), dùng để hiển thị số 0-9 và một số ký tự.

#### Sơ đồ các segment:
```
     aaaa
    f    b
    f    b
     gggg
    e    c
    e    c
     dddd   dp
```

#### Common Cathode (CC) vs Common Anode (CA)

| Loại | Chân chung | Bật segment | Tắt segment |
|------|-----------|-------------|-------------|
| **Common Cathode** | GND (0V) | HIGH | LOW |
| **Common Anode** | VCC (5V) | LOW | HIGH |

```
Common Cathode:           Common Anode:
      +5V                       +5V
       │                         │
   [220Ω]                    (Chung)
       │                         │
     (LED)                     (LED)
       │                         │
    (Chung)                   [220Ω]
       │                         │
      GND                    GPIO Pin
```

> ⚠️ **Quan trọng**: Khi mua LED 7 đoạn, hãy kiểm tra loại CC hay CA để viết code đúng logic!

### 1.3 Bảng mã Segment (Common Cathode)

Với Common Cathode, segment sáng khi nhận tín hiệu HIGH.

| Số | a | b | c | d | e | f | g | Hex | Binary |
|---|---|---|---|---|---|---|---|-----|--------|
| 0 | 1 | 1 | 1 | 1 | 1 | 1 | 0 | 0x3F | 0b00111111 |
| 1 | 0 | 1 | 1 | 0 | 0 | 0 | 0 | 0x06 | 0b00000110 |
| 2 | 1 | 1 | 0 | 1 | 1 | 0 | 1 | 0x5B | 0b01011011 |
| 3 | 1 | 1 | 1 | 1 | 0 | 0 | 1 | 0x4F | 0b01001111 |
| 4 | 0 | 1 | 1 | 0 | 0 | 1 | 1 | 0x66 | 0b01100110 |
| 5 | 1 | 0 | 1 | 1 | 0 | 1 | 1 | 0x6D | 0b01101101 |
| 6 | 1 | 0 | 1 | 1 | 1 | 1 | 1 | 0x7D | 0b01111101 |
| 7 | 1 | 1 | 1 | 0 | 0 | 0 | 0 | 0x07 | 0b00000111 |
| 8 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 0x7F | 0b01111111 |
| 9 | 1 | 1 | 1 | 1 | 0 | 1 | 1 | 0x6F | 0b01101111 |

> 💡 **Mẹo nhớ**: Số 8 bật tất cả (0x7F), số 1 chỉ bật b và c (0x06)

### 1.4 Kỹ thuật Multiplexing (Quét LED)

Khi có **4 LED 7 đoạn** (module 4 số), nếu điều khiển trực tiếp cần 4×8 = 32 chân! 

**Giải pháp**: Dùng kỹ thuật **quét (multiplexing)** - bật từng digit luân phiên rất nhanh, mắt người không nhận ra.

```
Thời gian:  |--D1--|--D2--|--D3--|--D4--|--D1--|...
            
Digit 1:    ████                        ████
Digit 2:          ████                  
Digit 3:                ████            
Digit 4:                      ████      
```

**Nguyên lý**:
1. Bật digit 1, xuất mã segment cho số cần hiển thị
2. Tắt digit 1, bật digit 2, xuất mã mới
3. Lặp lại với tốc độ > 50Hz (mỗi digit < 5ms)

**Sơ đồ kết nối module 4 số**:
```
Arduino          Module 4 LED 7 đoạn
   D2 ──────────── Segment a
   D3 ──────────── Segment b
   D4 ──────────── Segment c
   D5 ──────────── Segment d
   D6 ──────────── Segment e
   D7 ──────────── Segment f
   D8 ──────────── Segment g
   
   D9 ──────────── Digit 1 (hàng nghìn)
   D10 ─────────── Digit 2 (hàng trăm)
   D11 ─────────── Digit 3 (hàng chục)
   D12 ─────────── Digit 4 (hàng đơn vị)
```

### 1.5 IC 74HC595 - Shift Register

**74HC595** là IC thanh ghi dịch 8-bit, cho phép điều khiển 8 output chỉ với 3 chân Arduino.

#### Chân quan trọng:

| Chân | Tên | Chức năng |
|------|-----|-----------|
| 14 | DS (SER) | Data Serial Input |
| 11 | SHCP (SRCLK) | Shift Register Clock |
| 12 | STCP (RCLK) | Storage Register Clock (Latch) |
| Q0-Q7 | | 8 Output pins |

#### Nguyên lý hoạt động:
1. Đẩy 8 bit dữ liệu vào DS theo nhịp SHCP
2. Xung STCP "chốt" dữ liệu ra các chân Q0-Q7
3. Arduino chỉ cần 3 chân: Data, Clock, Latch

```
Arduino            74HC595
   D2 ─────────── DS (Data)
   D3 ─────────── SHCP (Clock)
   D4 ─────────── STCP (Latch)
                  
                  Q0 ── Segment a
                  Q1 ── Segment b
                  Q2 ── Segment c
                  Q3 ── Segment d
                  Q4 ── Segment e
                  Q5 ── Segment f
                  Q6 ── Segment g
                  Q7 ── Segment dp
```

---

## 💻 Phần 2: Code mẫu hoàn chỉnh

### 2.1 LED 7 đoạn đơn - Đếm 0→9

```cpp
/*
 * Bài 2-1a: LED 7 đoạn đếm 0→9
 * Hiển thị số 0 đến 9, trễ 2 giây mỗi số
 * 
 * Phần cứng: LED 7 đoạn Common Cathode
 * - Segment a-g: D2-D8
 * - Common: GND
 * - Mỗi segment qua điện trở 220Ω
 */

// Chân segment a-g (thứ tự: a, b, c, d, e, f, g)
const int SEG_PINS[] = {2, 3, 4, 5, 6, 7, 8};
const int NUM_SEGS = 7;

// Bảng mã segment cho số 0-9 (Common Cathode)
// Bit order: gfedcba (bit 0 = a, bit 6 = g)
const byte DIGITS[] = {
    0b00111111,  // 0: a,b,c,d,e,f ON
    0b00000110,  // 1: b,c ON
    0b01011011,  // 2: a,b,d,e,g ON
    0b01001111,  // 3: a,b,c,d,g ON
    0b01100110,  // 4: b,c,f,g ON
    0b01101101,  // 5: a,c,d,f,g ON
    0b01111101,  // 6: a,c,d,e,f,g ON
    0b00000111,  // 7: a,b,c ON
    0b01111111,  // 8: all ON
    0b01101111   // 9: a,b,c,d,f,g ON
};

// Hàm hiển thị 1 số (0-9)
void displayDigit(int num) {
    if (num < 0 || num > 9) return;
    
    byte pattern = DIGITS[num];
    for (int i = 0; i < NUM_SEGS; i++) {
        digitalWrite(SEG_PINS[i], (pattern >> i) & 1);
    }
}

// Hàm tắt tất cả segment
void clearDisplay() {
    for (int i = 0; i < NUM_SEGS; i++) {
        digitalWrite(SEG_PINS[i], LOW);
    }
}

void setup() {
    Serial.begin(9600);
    
    // Cấu hình tất cả chân segment làm OUTPUT
    for (int i = 0; i < NUM_SEGS; i++) {
        pinMode(SEG_PINS[i], OUTPUT);
    }
    clearDisplay();
    
    Serial.println("=== LED 7 Segment: Count 0-9 ===");
}

void loop() {
    // Đếm từ 0 đến 9
    for (int i = 0; i <= 9; i++) {
        displayDigit(i);
        Serial.print("Displaying: ");
        Serial.println(i);
        delay(2000);  // Chờ 2 giây
    }
    
    Serial.println("--- Restart ---\n");
}
```

### 2.2 LED 7 đoạn - Đếm lên xuống + Số chẵn/lẻ

```cpp
/*
 * Bài 2-1b: LED 7 đoạn với nhiều chế độ
 * 
 * Yêu cầu:
 * 1) 0→9, trễ 2s
 * 2) 0→9 rồi 9→0, trễ 2s
 * 3) Số chẵn: 0,2,4,6,8 và số lẻ: 1,3,5,7,9
 */

const int SEG_PINS[] = {2, 3, 4, 5, 6, 7, 8};
const int NUM_SEGS = 7;

const byte DIGITS[] = {
    0b00111111,  // 0
    0b00000110,  // 1
    0b01011011,  // 2
    0b01001111,  // 3
    0b01100110,  // 4
    0b01101101,  // 5
    0b01111101,  // 6
    0b00000111,  // 7
    0b01111111,  // 8
    0b01101111   // 9
};

void displayDigit(int num) {
    if (num < 0 || num > 9) return;
    byte pattern = DIGITS[num];
    for (int i = 0; i < NUM_SEGS; i++) {
        digitalWrite(SEG_PINS[i], (pattern >> i) & 1);
    }
}

void clearDisplay() {
    for (int i = 0; i < NUM_SEGS; i++) {
        digitalWrite(SEG_PINS[i], LOW);
    }
}

void setup() {
    Serial.begin(9600);
    for (int i = 0; i < NUM_SEGS; i++) {
        pinMode(SEG_PINS[i], OUTPUT);
    }
    clearDisplay();
    Serial.println("=== LED 7 Segment Multi-Mode ===");
}

void loop() {
    // Chế độ 1: Đếm 0→9
    Serial.println("\n[Mode 1] Count UP: 0 -> 9");
    for (int i = 0; i <= 9; i++) {
        displayDigit(i);
        Serial.println(i);
        delay(2000);
    }
    
    delay(1000);  // Nghỉ giữa các chế độ
    
    // Chế độ 2: Đếm 0→9 rồi 9→0
    Serial.println("\n[Mode 2] Count UP then DOWN");
    for (int i = 0; i <= 9; i++) {
        displayDigit(i);
        Serial.print("UP: ");
        Serial.println(i);
        delay(2000);
    }
    for (int i = 9; i >= 0; i--) {
        displayDigit(i);
        Serial.print("DOWN: ");
        Serial.println(i);
        delay(2000);
    }
    
    delay(1000);
    
    // Chế độ 3: Số chẵn
    Serial.println("\n[Mode 3a] EVEN numbers: 0,2,4,6,8");
    for (int i = 0; i <= 8; i += 2) {
        displayDigit(i);
        Serial.println(i);
        delay(2000);
    }
    
    delay(1000);
    
    // Chế độ 3: Số lẻ
    Serial.println("\n[Mode 3b] ODD numbers: 1,3,5,7,9");
    for (int i = 1; i <= 9; i += 2) {
        displayDigit(i);
        Serial.println(i);
        delay(2000);
    }
    
    Serial.println("\n=== Cycle Complete ===");
    delay(2000);
}
```

### 2.3 Module 4 LED 7 đoạn - Đếm 0→9999

```cpp
/*
 * Bài 2-2: Module 4 LED 7 đoạn - Đếm 0→9999
 * 
 * Phần cứng: Module 4 digit 7-segment (Common Cathode)
 * - Segment a-g: D2-D8
 * - Digit 1-4: D9-D12 (điều khiển transistor hoặc trực tiếp)
 * 
 * Kỹ thuật: Multiplexing (quét nhanh 4 digit)
 */

// Chân segment
const int SEG_PINS[] = {2, 3, 4, 5, 6, 7, 8};  // a-g
const int NUM_SEGS = 7;

// Chân điều khiển digit (Common Cathode: HIGH = bật digit)
const int DIGIT_PINS[] = {9, 10, 11, 12};  // D1-D4
const int NUM_DIGITS = 4;

// Bảng mã segment
const byte DIGITS_CODE[] = {
    0b00111111,  // 0
    0b00000110,  // 1
    0b01011011,  // 2
    0b01001111,  // 3
    0b01100110,  // 4
    0b01101101,  // 5
    0b01111101,  // 6
    0b00000111,  // 7
    0b01111111,  // 8
    0b01101111   // 9
};

// Số cần hiển thị (0-9999)
int displayNumber = 0;

// Hàm xuất mã segment cho 1 số
void setSegments(int num) {
    if (num < 0 || num > 9) num = 0;
    byte pattern = DIGITS_CODE[num];
    for (int i = 0; i < NUM_SEGS; i++) {
        digitalWrite(SEG_PINS[i], (pattern >> i) & 1);
    }
}

// Hàm tắt tất cả digit
void allDigitsOff() {
    for (int i = 0; i < NUM_DIGITS; i++) {
        digitalWrite(DIGIT_PINS[i], LOW);
    }
}

// Hàm quét hiển thị 4 digit (gọi liên tục trong loop)
void refreshDisplay(int number) {
    // Tách số thành 4 chữ số
    int digits[4];
    digits[3] = number % 10;          // Hàng đơn vị
    digits[2] = (number / 10) % 10;   // Hàng chục
    digits[1] = (number / 100) % 10;  // Hàng trăm
    digits[0] = (number / 1000) % 10; // Hàng nghìn
    
    // Quét từng digit
    for (int d = 0; d < NUM_DIGITS; d++) {
        allDigitsOff();           // Tắt tất cả digit
        setSegments(digits[d]);   // Chuẩn bị segment
        digitalWrite(DIGIT_PINS[d], HIGH);  // Bật digit hiện tại
        delay(5);                 // Giữ 5ms (tốc độ quét ~50Hz)
    }
}

void setup() {
    Serial.begin(9600);
    
    // Cấu hình chân segment
    for (int i = 0; i < NUM_SEGS; i++) {
        pinMode(SEG_PINS[i], OUTPUT);
    }
    
    // Cấu hình chân digit
    for (int i = 0; i < NUM_DIGITS; i++) {
        pinMode(DIGIT_PINS[i], OUTPUT);
    }
    
    allDigitsOff();
    Serial.println("=== 4-Digit Counter 0-9999 ===");
}

// Biến đếm thời gian không dùng delay()
unsigned long previousMillis = 0;
const long interval = 300;  // 0.3 giây mỗi lần tăng

void loop() {
    // Luôn gọi refreshDisplay để quét LED
    refreshDisplay(displayNumber);
    
    // Kiểm tra thời gian để tăng số
    unsigned long currentMillis = millis();
    if (currentMillis - previousMillis >= interval) {
        previousMillis = currentMillis;
        
        displayNumber++;
        if (displayNumber > 9999) {
            displayNumber = 0;
            Serial.println("Reset to 0");
        }
        
        // In ra Serial mỗi 100 số
        if (displayNumber % 100 == 0) {
            Serial.print("Count: ");
            Serial.println(displayNumber);
        }
    }
}
```

### 2.4 Module 4 digit với 74HC595

```cpp
/*
 * Bài 2-3: Module 4 LED 7 đoạn + 74HC595
 * 
 * Phần cứng:
 * - 74HC595 điều khiển 8 segment (a-g + dp)
 * - D9-D12 điều khiển 4 digit
 * 
 * Yêu cầu:
 * - Hiển thị 0-9 trên tất cả chữ số
 * - Đếm tăng 0→9999, trễ 0.2s
 * - Đếm giảm 9999→0, trễ 0.2s
 * - Nháy cả 4 led 4 lần, chu kỳ 2s
 */

// Chân 74HC595
const int DATA_PIN = 2;   // DS (SER)
const int CLOCK_PIN = 3;  // SHCP (SRCLK)
const int LATCH_PIN = 4;  // STCP (RCLK)

// Chân điều khiển digit
const int DIGIT_PINS[] = {9, 10, 11, 12};
const int NUM_DIGITS = 4;

// Bảng mã segment (bit order: dp-g-f-e-d-c-b-a)
const byte DIGITS_CODE[] = {
    0b00111111,  // 0
    0b00000110,  // 1
    0b01011011,  // 2
    0b01001111,  // 3
    0b01100110,  // 4
    0b01101101,  // 5
    0b01111101,  // 6
    0b00000111,  // 7
    0b01111111,  // 8
    0b01101111   // 9
};

// Hàm gửi byte qua 74HC595
void shiftOutByte(byte data) {
    digitalWrite(LATCH_PIN, LOW);
    shiftOut(DATA_PIN, CLOCK_PIN, MSBFIRST, data);
    digitalWrite(LATCH_PIN, HIGH);
}

// Hàm tắt tất cả digit
void allDigitsOff() {
    for (int i = 0; i < NUM_DIGITS; i++) {
        digitalWrite(DIGIT_PINS[i], LOW);
    }
}

// Hàm quét hiển thị 4 digit
void refreshDisplay(int number) {
    int digits[4];
    digits[3] = number % 10;
    digits[2] = (number / 10) % 10;
    digits[1] = (number / 100) % 10;
    digits[0] = (number / 1000) % 10;
    
    for (int d = 0; d < NUM_DIGITS; d++) {
        allDigitsOff();
        shiftOutByte(DIGITS_CODE[digits[d]]);
        digitalWrite(DIGIT_PINS[d], HIGH);
        delay(4);  // 4ms mỗi digit
    }
}

// Hàm hiển thị liên tục trong khoảng thời gian ms
void displayFor(int number, unsigned long durationMs) {
    unsigned long start = millis();
    while (millis() - start < durationMs) {
        refreshDisplay(number);
    }
}

// Hàm nháy tất cả digit
void blinkAll(int times, int periodMs) {
    int halfPeriod = periodMs / 2;
    
    for (int i = 0; i < times; i++) {
        // Sáng tất cả digit (hiện 8888)
        unsigned long start = millis();
        while (millis() - start < halfPeriod) {
            refreshDisplay(8888);
        }
        
        // Tắt tất cả
        allDigitsOff();
        shiftOutByte(0x00);
        delay(halfPeriod);
    }
}

void setup() {
    Serial.begin(9600);
    
    pinMode(DATA_PIN, OUTPUT);
    pinMode(CLOCK_PIN, OUTPUT);
    pinMode(LATCH_PIN, OUTPUT);
    
    for (int i = 0; i < NUM_DIGITS; i++) {
        pinMode(DIGIT_PINS[i], OUTPUT);
    }
    
    allDigitsOff();
    Serial.println("=== 74HC595 + 4-Digit Display ===");
}

void loop() {
    // Phần 1: Hiển thị 0-9 trên tất cả chữ số
    Serial.println("\n[Part 1] Show 0-9 on all digits");
    for (int i = 0; i <= 9; i++) {
        int num = i * 1000 + i * 100 + i * 10 + i;  // 0000, 1111, 2222...
        Serial.println(num);
        displayFor(num, 1000);  // Hiển thị 1 giây
    }
    
    // Phần 2: Đếm tăng 0→9999
    Serial.println("\n[Part 2] Count UP 0 -> 9999");
    for (int i = 0; i <= 9999; i++) {
        displayFor(i, 200);  // 0.2s mỗi số
        if (i % 500 == 0) {
            Serial.print("UP: ");
            Serial.println(i);
        }
    }
    
    // Phần 3: Đếm giảm 9999→0
    Serial.println("\n[Part 3] Count DOWN 9999 -> 0");
    for (int i = 9999; i >= 0; i--) {
        displayFor(i, 200);
        if (i % 500 == 0) {
            Serial.print("DOWN: ");
            Serial.println(i);
        }
    }
    
    // Phần 4: Nháy 4 lần, chu kỳ 2s
    Serial.println("\n[Part 4] Blink 4 times, period 2s");
    blinkAll(4, 2000);
    
    Serial.println("\n=== Cycle Complete ===");
    delay(2000);
}
```

---

## ⚠️ Phần 3: Lỗi thường gặp & Cách khắc phục

### 3.1 LED 7 đoạn hiển thị sai số

| Nguyên nhân | Cách kiểm tra | Cách sửa |
|-------------|---------------|----------|
| Nhầm loại CC/CA | Test 1 segment riêng | Đảo logic trong code |
| Sai thứ tự segment | Kiểm tra từng segment a-g | Sắp xếp lại SEG_PINS[] |
| Bảng mã sai | So sánh với datasheet | Sửa mảng DIGITS_CODE[] |

### 3.2 Module 4 số nhấp nháy hoặc mờ

| Nguyên nhân | Cách sửa |
|-------------|----------|
| Quét quá chậm (delay lớn) | Giảm delay xuống 3-5ms mỗi digit |
| Không tắt digit trước khi đổi | Thêm allDigitsOff() trước setSegments() |
| Dùng delay() trong loop | Dùng millis() để không block |

### 3.3 74HC595 không hoạt động

| Nguyên nhân | Cách kiểm tra | Cách sửa |
|-------------|---------------|----------|
| Sai chân | Đo tín hiệu oscilloscope | DS=pin14, SHCP=pin11, STCP=pin12 |
| Quên nối GND | Kiểm tra chân 8 | Nối GND của 595 với Arduino |
| Quên nối VCC | Kiểm tra chân 16 | Nối VCC 5V |
| OE không LOW | Kiểm tra chân 13 | Nối OE xuống GND |

### 3.4 Checklist debug LED 7 đoạn

1. ✅ Xác định loại Common Cathode hay Common Anode?
2. ✅ Có điện trở 220Ω mỗi segment?
3. ✅ Thứ tự chân segment đúng (a-b-c-d-e-f-g)?
4. ✅ GND chung giữa Arduino và LED?
5. ✅ Với 74HC595: OE nối GND, MR nối VCC?

---

## 🎓 Phần 4: Tóm tắt kiến thức

### Key Points:

1. **Top-Down**: Thiết kế tổng thể trước, chia module sau
2. **Bottom-Up**: Test từng module nhỏ, ghép dần
3. **LED 7 đoạn**: 7 segment (a-g) + dp, có 2 loại CC và CA
4. **Common Cathode**: Chân chung = GND, HIGH = sáng
5. **Common Anode**: Chân chung = VCC, LOW = sáng
6. **Multiplexing**: Quét nhanh nhiều digit, mắt không nhận ra nhấp nháy
7. **74HC595**: Shift register 8-bit, điều khiển 8 output bằng 3 chân Arduino

### Công thức quan trọng:

```
Tần số quét tối thiểu: 50Hz
→ Mỗi digit tối đa: 1000ms / 50 / 4 = 5ms

Số 4 chữ số từ int:
  đơn vị = number % 10
  chục = (number / 10) % 10
  trăm = (number / 100) % 10
  nghìn = (number / 1000) % 10
```

### Thuật ngữ quan trọng:

| Thuật ngữ | Ý nghĩa |
|-----------|---------|
| Segment | 1 thanh LED trong LED 7 đoạn |
| Common Cathode | Chân chung nối GND |
| Common Anode | Chân chung nối VCC |
| Multiplexing | Kỹ thuật quét nhiều digit |
| Shift Register | IC dịch bit, mở rộng output |
| Latch | Chốt dữ liệu ra output |

---

## 📋 Phần 5: Quiz tự kiểm tra

### Câu 1:
LED 7 đoạn loại Common Cathode cần mức logic nào để bật 1 segment?

- A. LOW (0V)
- B. HIGH (5V)
- C. PWM
- D. Không cần tín hiệu

<details>
<summary>Đáp án</summary>

**B. HIGH (5V)**

Common Cathode có chân chung nối GND (0V). Để có dòng điện chạy qua LED, segment cần nhận mức HIGH (5V) để tạo hiệu điện thế.
</details>

### Câu 2:
Phương pháp thiết kế nào phù hợp khi bạn muốn thử nghiệm 1 module cảm biến mới?

- A. Top-Down
- B. Bottom-Up
- C. Waterfall
- D. Agile

<details>
<summary>Đáp án</summary>

**B. Bottom-Up**

Bottom-Up phù hợp khi thử nghiệm module mới vì bạn có thể test riêng từng phần, xác nhận hoạt động rồi mới ghép vào hệ thống lớn.
</details>

### Câu 3:
Với module 4 LED 7 đoạn, tại sao phải dùng kỹ thuật multiplexing?

- A. Để LED sáng hơn
- B. Để giảm số chân điều khiển
- C. Để tiết kiệm điện
- D. Để hiển thị màu sắc

<details>
<summary>Đáp án</summary>

**B. Để giảm số chân điều khiển**

Nếu điều khiển trực tiếp 4 digit × 8 segment = 32 chân. Với multiplexing, chỉ cần 8 chân segment + 4 chân digit = 12 chân.
</details>

### Câu 4:
74HC595 có thể điều khiển bao nhiêu output?

- A. 4
- B. 6
- C. 8
- D. 16

<details>
<summary>Đáp án</summary>

**C. 8**

74HC595 là shift register 8-bit, có 8 chân output Q0-Q7. Có thể nối nhiều 595 cascade để mở rộng thêm.
</details>

### Câu 5:
Để hiển thị số 8 trên LED 7 đoạn, cần bật những segment nào?

- A. a, b, c
- B. a, b, c, d, e, f
- C. a, b, c, d, e, f, g (tất cả)
- D. b, c

<details>
<summary>Đáp án</summary>

**C. a, b, c, d, e, f, g (tất cả)**

Số 8 cần tất cả 7 segment để tạo hình đầy đủ. Mã segment = 0b01111111 = 0x7F.
</details>

### Câu 6:
Khi quét 4 digit với tần số 50Hz, mỗi digit được bật trong bao lâu?

- A. 20ms
- B. 10ms
- C. 5ms
- D. 1ms

<details>
<summary>Đáp án</summary>

**C. 5ms**

50Hz = 20ms mỗi chu kỳ. Chia cho 4 digit → 5ms mỗi digit.
</details>

### Câu 7:
Chân STCP (Latch) của 74HC595 có chức năng gì?

- A. Nhận data serial
- B. Tạo xung clock dịch bit
- C. Chốt dữ liệu ra các chân output
- D. Reset thanh ghi

<details>
<summary>Đáp án</summary>

**C. Chốt dữ liệu ra các chân output**

STCP (Storage Clock) khi nhận xung cạnh lên sẽ copy dữ liệu từ shift register sang storage register, xuất ra Q0-Q7.
</details>

### Câu 8:
Nếu LED 7 đoạn hiển thị ngược (số 2 thành số 5), nguyên nhân có thể là gì?

- A. Nhầm loại CC/CA
- B. Sai thứ tự chân segment
- C. Điện trở quá lớn
- D. Cả A và B

<details>
<summary>Đáp án</summary>

**D. Cả A và B**

Nhầm CC/CA sẽ đảo logic toàn bộ. Sai thứ tự chân segment sẽ làm sai vị trí các thanh LED.
</details>

### Câu 9:
Để tách chữ số hàng trăm từ số 4567, dùng công thức nào?

- A. 4567 % 100
- B. 4567 / 100
- C. (4567 / 100) % 10
- D. 4567 % 1000

<details>
<summary>Đáp án</summary>

**C. (4567 / 100) % 10**

4567 / 100 = 45 (integer division), 45 % 10 = 5 (chữ số hàng trăm).
</details>

### Câu 10:
Với 74HC595, nếu quên nối chân OE (Output Enable), điều gì xảy ra?

- A. LED sáng bình thường
- B. LED không sáng (output ở trạng thái high-impedance)
- C. IC bị cháy
- D. Arduino bị reset

<details>
<summary>Đáp án</summary>

**B. LED không sáng (output ở trạng thái high-impedance)**

OE cần nối LOW để enable output. Nếu để floating hoặc HIGH, các chân Q0-Q7 ở trạng thái high-impedance (không xuất tín hiệu).
</details>

---

## 🔬 Phần 6: Bài thực hành (Labs)

### Lab 2-1: LED 7 đoạn (1 số)

**Mục tiêu**: Điều khiển LED 7 đoạn đơn hiển thị số

**Yêu cầu**:
1. Hiển thị 0→9, trễ 2s
2. Hiển thị 0→9 rồi 9→0, trễ 2s
3. Hiển thị các số chẵn: 0,2,4,6,8 và số lẻ: 1,3,5,7,9

**Sơ đồ mạch**:
```
Arduino          LED 7 đoạn (CC)
   D2 ──[220Ω]── Segment a
   D3 ──[220Ω]── Segment b
   D4 ──[220Ω]── Segment c
   D5 ──[220Ω]── Segment d
   D6 ──[220Ω]── Segment e
   D7 ──[220Ω]── Segment f
   D8 ──[220Ω]── Segment g
   GND ───────── Common (chân chung)
```

**Rubric**:
| Tiêu chí | Điểm |
|----------|------|
| Hiển thị đúng số 0-9 | 30% |
| Đúng thứ tự và thời gian 2s | 30% |
| Có bảng mã segment rõ ràng | 20% |
| Code có comment tiếng Việt | 10% |
| Serial log theo dõi được | 10% |

---

### Lab 2-2: Mô đun 4 LED 7 đoạn

**Mục tiêu**: Điều khiển module 4 số bằng kỹ thuật multiplexing

**Yêu cầu**:
1. Hiển thị số tự nhiên 0→9999, trễ 0.3s
2. Hiển thị số chẵn 0→9998, trễ 0.3s

**Rubric**:
| Tiêu chí | Điểm |
|----------|------|
| Quét 4 digit không nhấp nháy | 30% |
| Đếm đúng 0-9999 | 30% |
| Dùng millis() không block | 20% |
| Tách số đúng (đơn vị/chục/trăm/nghìn) | 10% |
| Code sạch, có hàm refreshDisplay() | 10% |

---

### Lab 2-3: Module 4 LED 7 đoạn + 74HC595

**Mục tiêu**: Sử dụng shift register để giảm số chân điều khiển

**Yêu cầu**:
1. Hiển thị 0–9 trên tất cả chữ số (0000, 1111, ... 9999)
2. Đếm tăng 0→9999, trễ 0.2s
3. Đếm giảm 9999→0, trễ 0.2s
4. Nháy cả 4 led 4 lần, chu kỳ nháy 2s

**Rubric**:
| Tiêu chí | Điểm |
|----------|------|
| 74HC595 hoạt động đúng | 30% |
| Đếm tăng/giảm chính xác | 25% |
| Nháy đúng 4 lần, chu kỳ 2s | 20% |
| Sử dụng hàm shiftOut() | 15% |
| Code modular, có hàm riêng | 10% |

---

## 🏆 Đề thi mẫu 60 phút

### Đề bài:
Viết chương trình điều khiển **module 4 LED 7 đoạn** với các yêu cầu:

1. **Đếm từ 0000 đến 0059** (đếm giây 00-59), trễ 1s mỗi số
2. **Khi đạt 0059**, reset về 0000 và tăng **hàng phút** (0100, 0200...)
3. **Hiển thị định dạng MM:SS** (phút:giây)
4. Sử dụng **mảng** và **hàm riêng** cho việc quét display

### Rubric chấm điểm:

| Tiêu chí | Điểm |
|----------|------|
| Đếm giây 00-59 đúng | 30% |
| Tăng phút khi giây = 59 | 20% |
| Quét display không flicker | 20% |
| Sử dụng mảng và vòng lặp | 15% |
| Có hàm refreshDisplay() riêng | 10% |
| Code có comment tiếng Việt | 5% |

### Code tham khảo:

```cpp
/*
 * Đề thi mẫu: Đồng hồ đếm MM:SS
 * Module 4 LED 7 đoạn
 */

const int SEG_PINS[] = {2, 3, 4, 5, 6, 7, 8};
const int DIGIT_PINS[] = {9, 10, 11, 12};
const int NUM_SEGS = 7;
const int NUM_DIGITS = 4;

const byte DIGITS_CODE[] = {
    0b00111111, 0b00000110, 0b01011011, 0b01001111, 0b01100110,
    0b01101101, 0b01111101, 0b00000111, 0b01111111, 0b01101111
};

int minutes = 0;
int seconds = 0;
unsigned long previousMillis = 0;

void setSegments(int num) {
    if (num < 0 || num > 9) num = 0;
    byte pattern = DIGITS_CODE[num];
    for (int i = 0; i < NUM_SEGS; i++) {
        digitalWrite(SEG_PINS[i], (pattern >> i) & 1);
    }
}

void allDigitsOff() {
    for (int i = 0; i < NUM_DIGITS; i++) {
        digitalWrite(DIGIT_PINS[i], LOW);
    }
}

void refreshDisplay(int mins, int secs) {
    int digits[4];
    digits[0] = mins / 10;   // Chục phút
    digits[1] = mins % 10;   // Đơn vị phút
    digits[2] = secs / 10;   // Chục giây
    digits[3] = secs % 10;   // Đơn vị giây
    
    for (int d = 0; d < NUM_DIGITS; d++) {
        allDigitsOff();
        setSegments(digits[d]);
        digitalWrite(DIGIT_PINS[d], HIGH);
        delay(4);
    }
}

void setup() {
    Serial.begin(9600);
    for (int i = 0; i < NUM_SEGS; i++) pinMode(SEG_PINS[i], OUTPUT);
    for (int i = 0; i < NUM_DIGITS; i++) pinMode(DIGIT_PINS[i], OUTPUT);
    allDigitsOff();
    Serial.println("=== Clock MM:SS ===");
}

void loop() {
    refreshDisplay(minutes, seconds);
    
    if (millis() - previousMillis >= 1000) {
        previousMillis = millis();
        
        seconds++;
        if (seconds >= 60) {
            seconds = 0;
            minutes++;
            if (minutes >= 60) {
                minutes = 0;
            }
        }
        
        Serial.print(minutes < 10 ? "0" : "");
        Serial.print(minutes);
        Serial.print(":");
        Serial.print(seconds < 10 ? "0" : "");
        Serial.println(seconds);
    }
}
```

---

> **Tuần tiếp theo**: Tuần 3 - Nút nhấn & Keypad (INPUT_PULLUP, Debounce, Edge Detection)
