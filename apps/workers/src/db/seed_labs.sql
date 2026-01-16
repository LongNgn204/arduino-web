-- Labs Seed
INSERT OR REPLACE INTO labs (id, week_id, order_index, title, instructions, wiring, is_published) VALUES ('lab-00-1', 'week-00', 1, 'Lab 0-1: Tính điện trở cho LED', '**Bài toán thực tế:**
Bạn có:
- Nguồn Arduino 5V
- LED đỏ (2V, 20mA)
- Các điện trở: 100Ω, 220Ω, 330Ω, 1kΩ

**Yêu cầu:** Chọn điện trở phù hợp và giải thích.

**Lời giải:**
```
R = (5V - 2V) / 0.02A = 150Ω

→ Chọn 220Ω (gần nhất, an toàn hơn 150Ω)
→ Dòng thực tế: I = 3V / 220Ω = 13.6mA ✓
```', 'See instructions', 1);
INSERT OR REPLACE INTO labs (id, week_id, order_index, title, instructions, wiring, is_published) VALUES ('lab-00-2', 'week-00', 2, 'Lab 0-2: Đọc giá trị điện trở', '**Bài tập:** Đọc giá trị các điện trở sau:

1. Vàng - Tím - Đỏ - Vàng kim = ?
2. Nâu - Đen - Cam - Bạc = ?
3. Xanh lá - Xanh dương - Nâu - Vàng kim = ?

<details>
<summary>📝 Đáp án</summary>

1. **Vàng(4) - Tím(7) - Đỏ(x100)** = 4700Ω = **4.7kΩ**
2. **Nâu(1) - Đen(0) - Cam(x1000)** = 10000Ω = **10kΩ**
3. **Xanh lá(5) - Xanh dương(6) - Nâu(x10)** = **560Ω**
</details>

---', 'See instructions', 1);
INSERT OR REPLACE INTO labs (id, week_id, order_index, title, instructions, wiring, is_published) VALUES ('lab-01-1', 'week-01', 1, 'Lab 1-1: Điều khiển LED theo quy luật thời gian', '**Mục tiêu**: Viết hàm tái sử dụng để nháy LED

**Yêu cầu**:
1. Bật 1s, tắt 1s, lặp 5 lần
2. Bật 3s, tắt 0.5s, lặp 5 lần  
3. Bật 0.5s, tắt 3s, lặp 5 lần

**Rubric**:
| Tiêu chí | Điểm |
|----------|------|
| Đúng số lần lặp | 30% |
| Đúng thời gian bật/tắt | 30% |
| Có hàm `blinkN()` tái sử dụng | 20% |
| Code có comment rõ ràng | 10% |
| Serial log theo dõi được | 10% |

---', 'See instructions', 1);
INSERT OR REPLACE INTO labs (id, week_id, order_index, title, instructions, wiring, is_published) VALUES ('lab-01-2', 'week-01', 2, 'Lab 1-2: Điều khiển 5 LED tuần tự', '**Mục tiêu**: Sử dụng mảng và vòng lặp để quản lý nhiều LED

**Yêu cầu**:
- Bật tuần tự LED1→LED5, cách 1s
- Giữ tất cả sáng 5s
- Tắt tuần tự LED5→LED1, cách 1s

**Rubric**:
| Tiêu chí | Điểm |
|----------|------|
| Đúng thứ tự bật/tắt | 40% |
| Sử dụng mảng LED_PINS[] | 20% |
| Sử dụng vòng lặp for | 20% |
| Đúng thời gian delay | 10% |
| Code sạch, có comment | 10% |

---', 'See instructions', 1);
INSERT OR REPLACE INTO labs (id, week_id, order_index, title, instructions, wiring, is_published) VALUES ('lab-01-3', 'week-01', 3, 'Lab 1-3: Hiệu ứng LED đuổi (Knight Rider)', '**Mục tiêu**: Tạo hiệu ứng "duy nhất 1 LED sáng"

**Yêu cầu**:
- Chạy 1→5 với delay 1s
- Chạy 5→1 với delay 0.5s
- Lặp vô hạn

**Rubric**:
| Tiêu chí | Điểm |
|----------|------|
| Luôn chỉ có 1 LED sáng | 40% |
| Đúng hướng chạy | 20% |
| Đúng thời gian delay | 20% |
| Có hàm `allOff()` và `onlyOne()` | 10% |
| Hiệu ứng mượt mà | 10% |

---

## 🏆 Đề thi mẫu 60 phút

### Đề bài:
Viết chương trình điều khiển **8 LED** (D2-D9) tạo hiệu ứng **"ping-pong"**:
- LED chạy từ 1→8 rồi từ 8→1, lặp vô hạn
- Tốc độ: 200ms mỗi LED
- Yêu cầu: Dùng mảng, vòng lặp, tách hàm

### Rubric chấm điểm:
| Tiêu chí | Điểm |
|----------|------|
| Hiệu ứng ping-pong đúng | 40% |
| Sử dụng mảng chân LED | 15% |
| Có vòng lặp for | 15% |
| Tách hàm riêng cho hiệu ứng | 15% |
| Code có comment tiếng Việt | 10% |
| Không lỗi, chạy ổn định | 5% |

### Code tham khảo:

```cpp
/*
 * Đề thi mẫu: Ping-pong 8 LED
 * Hiệu ứng: LED chạy 1→8→1 lặp vô hạn
 */

const int LED_PINS[] = {2, 3, 4, 5, 6, 7, 8, 9};
const int NUM_LEDS = 8;
const int SPEED = 200;  // ms

void allOff() {
    for (int i = 0; i < NUM_LEDS; i++) {
        digitalWrite(LED_PINS[i], LOW);
    }
}

void onlyOne(int index) {
    allOff();
    digitalWrite(LED_PINS[index], HIGH);
}

void pingPong() {
    // Chạy tiến: 0 → 7
    for (int i = 0; i < NUM_LEDS; i++) {
        onlyOne(i);
        delay(SPEED);
    }
    // Chạy lùi: 6 → 1 (bỏ 2 đầu để không lặp)
    for (int i = NUM_LEDS - 2; i > 0; i--) {
        onlyOne(i);
        delay(SPEED);
    }
}

void setup() {
    for (int i = 0; i < NUM_LEDS; i++) {
        pinMode(LED_PINS[i], OUTPUT);
    }
    allOff();
}

void loop() {
    pingPong();
}
```

---

> **Tuần tiếp theo**: LED 7 đoạn & Thiết kế hệ thống nhúng', 'See instructions', 1);
INSERT OR REPLACE INTO labs (id, week_id, order_index, title, instructions, wiring, is_published) VALUES ('lab-02-1', 'week-02', 1, 'Lab 2-1: LED 7 đoạn (1 số)', '**Mục tiêu**: Điều khiển LED 7 đoạn đơn hiển thị số

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

---', 'See instructions', 1);
INSERT OR REPLACE INTO labs (id, week_id, order_index, title, instructions, wiring, is_published) VALUES ('lab-02-2', 'week-02', 2, 'Lab 2-2: Mô đun 4 LED 7 đoạn', '**Mục tiêu**: Điều khiển module 4 số bằng kỹ thuật multiplexing

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

---', 'See instructions', 1);
INSERT OR REPLACE INTO labs (id, week_id, order_index, title, instructions, wiring, is_published) VALUES ('lab-02-3', 'week-02', 3, 'Lab 2-3: Module 4 LED 7 đoạn + 74HC595', '**Mục tiêu**: Sử dụng shift register để giảm số chân điều khiển

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

> **Tuần tiếp theo**: Tuần 3 - Nút nhấn & Keypad (INPUT_PULLUP, Debounce, Edge Detection)', 'See instructions', 1);
INSERT OR REPLACE INTO labs (id, week_id, order_index, title, instructions, wiring, is_published) VALUES ('lab-03-1', 'week-03', 1, 'Lab 3-1: Nhấn → LED bật, nhả → LED tắt', '**Mục tiêu**: Đọc nút nhấn và điều khiển LED trực tiếp

**Yêu cầu**:
- Nhấn giữ nút → LED sáng
- Nhả nút → LED tắt
- Serial format: `Trạng thái nút ấn: (1/0)` và `Trạng thái led: (bật/tắt)`

**Rubric**:
| Tiêu chí | Điểm |
|----------|------|
| LED bật/tắt đúng theo nút | 40% |
| Serial output đúng format | 30% |
| Dùng INPUT_PULLUP | 20% |
| Code có comment | 10% |

---', 'See instructions', 1);
INSERT OR REPLACE INTO labs (id, week_id, order_index, title, instructions, wiring, is_published) VALUES ('lab-03-2', 'week-03', 2, 'Lab 3-2: Đếm số lần nhấn, lẻ bật, chẵn tắt', '**Mục tiêu**: Áp dụng edge detection và debounce

**Yêu cầu**:
- Đếm số lần nhấn nút
- Lẻ → LED bật, Chẵn → LED tắt
- Serial format: `Số lần nhấn nút: xx` và `Trạng thái led: (bật/tắt)`

**Rubric**:
| Tiêu chí | Điểm |
|----------|------|
| Đếm đúng số lần nhấn | 30% |
| Logic lẻ/chẵn đúng | 30% |
| Có debounce (không đếm nhảy số) | 20% |
| Serial output đúng format | 10% |
| Code có comment | 10% |

---', 'See instructions', 1);
INSERT OR REPLACE INTO labs (id, week_id, order_index, title, instructions, wiring, is_published) VALUES ('lab-03-3', 'week-03', 3, 'Lab 3-3: Keypad đọc 1 ký tự', '**Mục tiêu**: Sử dụng thư viện Keypad

**Yêu cầu**:
- Đọc phím từ keypad 4x4
- Serial format: `Kí tự vừa nhập: ____`

**Rubric**:
| Tiêu chí | Điểm |
|----------|------|
| Đọc đúng tất cả 16 phím | 50% |
| Serial output đúng format | 30% |
| Cấu hình đúng rowPins/colPins | 10% |
| Code sạch | 10% |

---', 'See instructions', 1);
INSERT OR REPLACE INTO labs (id, week_id, order_index, title, instructions, wiring, is_published) VALUES ('lab-03-4', 'week-03', 4, 'Lab 3-4: Keypad điều khiển 5 LED', '**Mục tiêu**: Mapping phím với chức năng

**Yêu cầu**:
- 1/2: bật/tắt LED1
- 3/4: bật/tắt LED2
- ... (đến 9/0: bật/tắt LED5)

**Rubric**:
| Tiêu chí | Điểm |
|----------|------|
| Mapping đúng 10 phím | 40% |
| 5 LED hoạt động độc lập | 30% |
| Serial log phím nhấn | 20% |
| Code modular (switch/case) | 10% |

---', 'See instructions', 1);
INSERT OR REPLACE INTO labs (id, week_id, order_index, title, instructions, wiring, is_published) VALUES ('lab-03-5', 'week-03', 5, 'Lab 3-5: Keypad password', '**Mục tiêu**: Xây dựng hệ thống mật khẩu

**Yêu cầu**:
- Nhập mật khẩu, # để xác nhận
- Đúng → LED xanh + "Mật khẩu đúng"
- Sai → LED đỏ + "Mật khẩu sai"
- * để xóa và nhập lại

**Rubric**:
| Tiêu chí | Điểm |
|----------|------|
| So sánh mật khẩu đúng | 30% |
| LED xanh/đỏ đúng trạng thái | 25% |
| Phím # và * hoạt động | 25% |
| Serial output đúng | 10% |
| Code có hàm riêng | 10% |

---

## 🏆 Đề thi mẫu 60 phút

### Đề bài:
Viết chương trình **nhập mã PIN bằng keypad**, với yêu cầu:

1. Mã PIN là **4 chữ số** (ví dụ: "1234")
2. Nhấn `#` để xác nhận, `*` để xóa
3. **Đúng PIN**: Bật LED xanh + buzzer ngắn (100ms) + Serial "PIN CORRECT"
4. **Sai PIN**: Bật LED đỏ + buzzer dài (500ms) + Serial "PIN INCORRECT"
5. Sau 3 lần sai liên tiếp: **khóa 10 giây**, LED đỏ nhấp nháy

### Rubric chấm điểm:

| Tiêu chí | Điểm |
|----------|------|
| Nhập và so sánh PIN đúng | 25% |
| LED xanh/đỏ theo kết quả | 20% |
| Buzzer ngắn/dài theo kết quả | 15% |
| Khóa 10s sau 3 lần sai | 20% |
| Serial output đúng format | 10% |
| Code sạch, có hàm riêng | 10% |

### Code tham khảo:

```cpp
/*
 * Đề thi mẫu: PIN Lock System
 * Keypad + LED + Buzzer
 */

#include <Keypad.h>

const byte ROWS = 4;
const byte COLS = 4;
char keys[ROWS][COLS] = {
    {''1'',''2'',''3'',''A''},
    {''4'',''5'',''6'',''B''},
    {''7'',''8'',''9'',''C''},
    {''*'',''0'',''#'',''D''}
};
byte rowPins[ROWS] = {9, 8, 7, 6};
byte colPins[COLS] = {5, 4, 3, 2};
Keypad keypad = Keypad(makeKeymap(keys), rowPins, colPins, ROWS, COLS);

const int LED_GREEN = A0;
const int LED_RED = A1;
const int BUZZER = A2;

const String CORRECT_PIN = "1234";
String inputPIN = "";
int wrongCount = 0;
bool locked = false;
unsigned long lockTime = 0;

void beepShort() {
    tone(BUZZER, 1000, 100);
}

void beepLong() {
    tone(BUZZER, 500, 500);
}

void resetLEDs() {
    digitalWrite(LED_GREEN, LOW);
    digitalWrite(LED_RED, LOW);
}

void setup() {
    Serial.begin(9600);
    pinMode(LED_GREEN, OUTPUT);
    pinMode(LED_RED, OUTPUT);
    pinMode(BUZZER, OUTPUT);
    resetLEDs();
    Serial.println("=== PIN Lock System ===");
    Serial.print("Enter PIN: ");
}

void loop() {
    // Kiểm tra khóa
    if (locked) {
        if (millis() - lockTime < 10000) {
            // Nhấp nháy LED đỏ
            digitalWrite(LED_RED, (millis() / 250) % 2);
            return;
        } else {
            locked = false;
            wrongCount = 0;
            resetLEDs();
            Serial.println("\nUnlocked! Try again.");
            Serial.print("Enter PIN: ");
        }
    }
    
    char key = keypad.getKey();
    if (!key) return;
    
    if (key == ''#'') {
        Serial.println();
        if (inputPIN == CORRECT_PIN) {
            digitalWrite(LED_GREEN, HIGH);
            beepShort();
            Serial.println("PIN CORRECT");
            wrongCount = 0;
            delay(2000);
        } else {
            digitalWrite(LED_RED, HIGH);
            beepLong();
            Serial.println("PIN INCORRECT");
            wrongCount++;
            delay(1000);
            
            if (wrongCount >= 3) {
                Serial.println("LOCKED for 10 seconds!");
                locked = true;
                lockTime = millis();
            }
        }
        resetLEDs();
        inputPIN = "";
        if (!locked) Serial.print("Enter PIN: ");
        
    } else if (key == ''*'') {
        inputPIN = "";
        Serial.println("\nCleared!");
        Serial.print("Enter PIN: ");
        
    } else if (inputPIN.length() < 4) {
        inputPIN += key;
        Serial.print("*");
    }
}
```

---

> **Tuần tiếp theo**: Tuần 4 - Analog Input/Output (ADC & PWM)', 'See instructions', 1);
INSERT OR REPLACE INTO labs (id, week_id, order_index, title, instructions, wiring, is_published) VALUES ('lab-04-1', 'week-04', 1, 'Lab 4-1: Đọc điện áp pot — 3 dạng', '**Mục tiêu**: Đọc và chuyển đổi giá trị analog

**Yêu cầu**:
- Hiển thị Raw (0-1023)
- Hiển thị Điện áp (V) với 2 số thập phân
- Hiển thị Phần trăm (%) với 1 số thập phân

**Rubric**:
| Tiêu chí | Điểm |
|----------|------|
| Raw thay đổi mượt 0-1023 | 30% |
| Điện áp tính đúng 0-5V | 30% |
| Phần trăm tính đúng 0-100% | 30% |
| Code có comment | 10% |

---', 'See instructions', 1);
INSERT OR REPLACE INTO labs (id, week_id, order_index, title, instructions, wiring, is_published) VALUES ('lab-04-2', 'week-04', 2, 'Lab 4-2: PWM độ sáng LED theo pot', '**Mục tiêu**: Điều khiển LED bằng PWM

**Yêu cầu**:
- LED sáng tỉ lệ với pot
- Serial: Raw, %, Vout

**Rubric**:
| Tiêu chí | Điểm |
|----------|------|
| LED thay đổi độ sáng mượt | 40% |
| Dùng đúng chân PWM | 20% |
| Serial output đúng format | 30% |
| Dùng map() đúng cách | 10% |

---', 'See instructions', 1);
INSERT OR REPLACE INTO labs (id, week_id, order_index, title, instructions, wiring, is_published) VALUES ('lab-04-3', 'week-04', 3, 'Lab 4-3: Điều khiển tốc độ nháy theo pot', '**Mục tiêu**: Thay đổi timing theo analog input

**Yêu cầu**:
- pot=1023 → nháy nhanh (0.1s)
- pot=0 → nháy chậm (1s)
- Serial: %, LED state, chu kỳ

**Rubric**:
| Tiêu chí | Điểm |
|----------|------|
| Tốc độ nháy thay đổi đúng | 40% |
| Dùng millis() (non-blocking) | 30% |
| Serial output đúng format | 20% |
| Code sạch | 10% |

---', 'See instructions', 1);
INSERT OR REPLACE INTO labs (id, week_id, order_index, title, instructions, wiring, is_published) VALUES ('lab-04-4', 'week-04', 4, 'Lab 4-4: 7 LED theo pot, 3 chế độ', '**Mục tiêu**: Điều khiển pattern LED theo ngưỡng

**Yêu cầu**:
- <30%: chạy 2→8
- >70%: chạy 8→2
- 30-70%: từ giữa ra

**Rubric**:
| Tiêu chí | Điểm |
|----------|------|
| 3 chế độ hoạt động đúng | 40% |
| Chuyển chế độ mượt | 20% |
| Serial output đúng chế độ | 20% |
| Pattern LED đẹp | 10% |
| Code modular | 10% |

---

## 🏆 Đề thi mẫu 60 phút

### Đề bài:
Viết chương trình với **potentiometer** và **LED13** + **7 LED (D2-D8)**:

1. **LED13 nháy** với tốc độ **tỉ lệ nghịch** với pot%
   - pot = 0% → nháy chậm (1s)
   - pot = 100% → nháy nhanh (0.1s)

2. **7 LED** hiển thị **số LED sáng tỉ lệ thuận** với pot%
   - 0-14%: 0 LED sáng
   - 15-28%: 1 LED sáng
   - 29-42%: 2 LED sáng
   - ... (mỗi 14% thêm 1 LED)
   - 86-100%: 7 LED sáng

3. Serial output: `pot=__% | LEDs=__ | Blink=__ms`

### Rubric chấm điểm:

| Tiêu chí | Điểm |
|----------|------|
| LED13 nháy đúng tốc độ | 25% |
| 7 LED sáng đúng số lượng | 30% |
| Dùng millis() (non-blocking) | 20% |
| Serial output đúng format | 15% |
| Code sạch, có hàm riêng | 10% |

### Code tham khảo:

```cpp
/*
 * Đề thi mẫu: Pot controls blink speed + LED bar
 */

const int POT_PIN = A0;
const int LED_BLINK = 13;
const int LED_PINS[] = {2, 3, 4, 5, 6, 7, 8};
const int NUM_LEDS = 7;

unsigned long previousMillis = 0;
bool blinkState = false;

void setup() {
    Serial.begin(9600);
    pinMode(LED_BLINK, OUTPUT);
    for (int i = 0; i < NUM_LEDS; i++) {
        pinMode(LED_PINS[i], OUTPUT);
    }
}

void setBarLEDs(int count) {
    for (int i = 0; i < NUM_LEDS; i++) {
        digitalWrite(LED_PINS[i], i < count ? HIGH : LOW);
    }
}

void loop() {
    int raw = analogRead(POT_PIN);
    float percent = raw * 100.0 / 1023.0;
    
    // Tốc độ nháy: tỉ lệ nghịch
    int blinkDelay = map(raw, 0, 1023, 1000, 100);
    
    // Số LED sáng: tỉ lệ thuận (0-7 LED)
    int ledCount = map(raw, 0, 1023, 0, 8);  // 0-7 LED
    if (ledCount > NUM_LEDS) ledCount = NUM_LEDS;
    
    // Non-blocking blink
    unsigned long currentMillis = millis();
    if (currentMillis - previousMillis >= blinkDelay / 2) {
        previousMillis = currentMillis;
        blinkState = !blinkState;
        digitalWrite(LED_BLINK, blinkState);
        
        // Serial output
        Serial.print("pot=");
        Serial.print(percent, 0);
        Serial.print("% | LEDs=");
        Serial.print(ledCount);
        Serial.print(" | Blink=");
        Serial.print(blinkDelay);
        Serial.println("ms");
    }
    
    // Update LED bar
    setBarLEDs(ledCount);
}
```

---

> **Tuần tiếp theo**: Tuần 5 - Thực hành tích hợp I/O (Ghép nút + pot + LED + 7-seg)', 'See instructions', 1);
INSERT OR REPLACE INTO labs (id, week_id, order_index, title, instructions, wiring, is_published) VALUES ('lab-05-1', 'week-05', 1, 'Lab 5-1: LED trang trí theo pot', '**Rubric**: Đúng 3 chế độ (40%), chuyển mượt (30%), Serial log (20%), code sạch (10%)', 'See instructions', 1);
INSERT OR REPLACE INTO labs (id, week_id, order_index, title, instructions, wiring, is_published) VALUES ('lab-05-2', 'week-05', 2, 'Lab 5-2: LED bar theo pot', '**Rubric**: Đúng số LED (40%), ngưỡng 10% (30%), Serial (20%), code (10%)', 'See instructions', 1);
INSERT OR REPLACE INTO labs (id, week_id, order_index, title, instructions, wiring, is_published) VALUES ('lab-05-3', 'week-05', 3, 'Lab 5-3: LED theo số lần nhấn', '**Rubric**: Đếm đúng (30%), 2 mode (40%), debounce (20%), code (10%)', 'See instructions', 1);
INSERT OR REPLACE INTO labs (id, week_id, order_index, title, instructions, wiring, is_published) VALUES ('lab-05-4', 'week-05', 4, 'Lab 5-4: Hiển thị % pot', '**Rubric**: Display đúng (40%), quét mượt (30%), pot phản hồi (20%), code (10%)', 'See instructions', 1);
INSERT OR REPLACE INTO labs (id, week_id, order_index, title, instructions, wiring, is_published) VALUES ('lab-05-5', 'week-05', 5, 'Lab 5-5: Hiển thị số lần nhấn', '**Rubric**: Đếm đúng (30%), display đúng (40%), debounce (20%), code (10%)', 'See instructions', 1);
INSERT OR REPLACE INTO labs (id, week_id, order_index, title, instructions, wiring, is_published) VALUES ('lab-05-6', 'week-05', 6, 'Lab 5-6: Đếm tăng/giảm theo nút', '**Rubric**: 2 mode (40%), auto count (30%), display (20%), code (10%)

---

## 🏆 Đề thi mẫu 60 phút

### Đề bài:
**2 nút A/B + 4 LED 7 đoạn + pot**:
1. Nút A đổi mode hiển thị: pot% / số lần nhấn B
2. Nút B: trong mode 2 thì đếm; trong mode 1 thì reset display về 00
3. Hiển thị 00–99, không miss nút

### Rubric:
| Tiêu chí | Điểm |
|----------|------|
| 2 mode hoạt động đúng | 30% |
| Nút B đúng chức năng theo mode | 25% |
| Display 00-99 mượt | 20% |
| Không miss nút (debounce) | 15% |
| Code sạch | 10% |

---

> **Tuần tiếp theo**: Tuần 6 - Cảm biến trong Hệ thống Nhúng', 'See instructions', 1);
INSERT OR REPLACE INTO labs (id, week_id, order_index, title, instructions, wiring, is_published) VALUES ('lab-06-1', 'week-06', 1, 'Lab 6-1 đến 6-6:', '*(Rubric cho mỗi bài như trong code mẫu)*

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

> **Tuần tiếp theo**: Tuần 7 - Serial UART (Giao tiếp nối tiếp)', 'See instructions', 1);
INSERT OR REPLACE INTO labs (id, week_id, order_index, title, instructions, wiring, is_published) VALUES ('lab-07-1', 'week-07', 1, 'Lab 7-1: Đọc pot và hiển thị trên PC', '**Mục tiêu**: Gửi telemetry từ Arduino lên PC

**Yêu cầu**:
- Đọc pot mỗi 500ms
- Gửi dạng CSV: raw,voltage,percent
- Voltage có 2 số thập phân, percent có 1 số

**Rubric**:
| Tiêu chí | Điểm |
|----------|------|
| Format CSV đúng | 40% |
| Giá trị tính toán chính xác | 30% |
| Timing 500ms | 20% |
| Code có comment | 10% |

---', 'See instructions', 1);
INSERT OR REPLACE INTO labs (id, week_id, order_index, title, instructions, wiring, is_published) VALUES ('lab-07-2', 'week-07', 2, 'Lab 7-2: Điều khiển LED từ PC', '**Mục tiêu**: Nhận lệnh từ Serial Monitor điều khiển LED

**Yêu cầu**:
- Lệnh: LED1=ON, LED1=OFF, PWM=0..255
- Response: OK hoặc ERR + message
- Có lệnh STATUS trả về trạng thái

**Rubric**:
| Tiêu chí | Điểm |
|----------|------|
| Parse lệnh đúng | 35% |
| LED hoạt động theo lệnh | 25% |
| Response đúng format | 20% |
| PWM hoạt động | 10% |
| Xử lý lỗi (lệnh sai) | 10% |

---', 'See instructions', 1);
INSERT OR REPLACE INTO labs (id, week_id, order_index, title, instructions, wiring, is_published) VALUES ('lab-07-3', 'week-07', 3, 'Lab 7-3: Giao tiếp 2 Arduino', '**Mục tiêu**: Master gửi lệnh, Slave thực hiện và phản hồi

**Yêu cầu**:
- Dùng SoftwareSerial
- Master nhận từ PC, chuyển tiếp đến Slave
- Slave thực hiện và phản hồi

**Rubric**:
| Tiêu chí | Điểm |
|----------|------|
| SoftwareSerial hoạt động | 30% |
| Master chuyển tiếp đúng | 25% |
| Slave thực hiện lệnh | 25% |
| Phản hồi về Master→PC | 10% |
| Kết nối TX-RX đúng | 10% |

---

## 🏆 Đề thi mẫu 60 phút

### Đề bài:
Viết chương trình **điều khiển 2 LED từ Serial** và **gửi telemetry pot**:

1. **Lệnh điều khiển**:
   - `LED1=ON` / `LED1=OFF`
   - `LED2=ON` / `LED2=OFF`
   - `ALL=ON` / `ALL=OFF` (bật/tắt cả 2)

2. **Telemetry**: Tự động gửi pot mỗi 1 giây
   - Format: `POT,raw,percent`
   - Ví dụ: `POT,512,50`

3. **Response**: `OK` hoặc `ERR`

### Rubric chấm điểm:

| Tiêu chí | Điểm |
|----------|------|
| Lệnh LED1/LED2 hoạt động | 25% |
| Lệnh ALL hoạt động | 15% |
| Telemetry đúng format và timing | 25% |
| Response OK/ERR đúng | 15% |
| Xử lý lệnh sai | 10% |
| Code sạch, có comment | 10% |

### Code tham khảo:

```cpp
/*
 * Đề thi mẫu: Serial LED Control + Pot Telemetry
 */

const int LED1_PIN = 13;
const int LED2_PIN = 12;
const int POT_PIN = A0;

bool led1 = false, led2 = false;
unsigned long lastTelemetry = 0;

void setup() {
    Serial.begin(9600);
    pinMode(LED1_PIN, OUTPUT);
    pinMode(LED2_PIN, OUTPUT);
    Serial.println("=== Ready ===");
}

void updateLEDs() {
    digitalWrite(LED1_PIN, led1);
    digitalWrite(LED2_PIN, led2);
}

void loop() {
    // Telemetry every 1 second
    if (millis() - lastTelemetry >= 1000) {
        lastTelemetry = millis();
        int raw = analogRead(POT_PIN);
        int percent = map(raw, 0, 1023, 0, 100);
        Serial.print("POT,");
        Serial.print(raw);
        Serial.print(",");
        Serial.println(percent);
    }
    
    // Command handling
        String cmd = Serial.readStringUntil(''\n'');
        cmd.trim();
        cmd.toUpperCase();
        
        if (cmd == "LED1=ON") { led1 = true; Serial.println("OK"); }
        else if (cmd == "LED1=OFF") { led1 = false; Serial.println("OK"); }
        else if (cmd == "LED2=ON") { led2 = true; Serial.println("OK"); }
        else if (cmd == "LED2=OFF") { led2 = false; Serial.println("OK"); }
        else if (cmd == "ALL=ON") { led1 = led2 = true; Serial.println("OK"); }
        else if (cmd == "ALL=OFF") { led1 = led2 = false; Serial.println("OK"); }
        else { Serial.println("ERR"); }
        
        updateLEDs();
    }
}
```

---

> **Tuần tiếp theo**: Tuần 8 - Giao thức I2C', 'See instructions', 1);
INSERT OR REPLACE INTO labs (id, week_id, order_index, title, instructions, wiring, is_published) VALUES ('lab-08-1', 'week-08', 1, 'Lab 8-1: I2C Scanner', '**Rubric**: Tìm đúng địa chỉ (50%), format output (30%), nhận dạng thiết bị (20%)', 'See instructions', 1);
INSERT OR REPLACE INTO labs (id, week_id, order_index, title, instructions, wiring, is_published) VALUES ('lab-08-2', 'week-08', 2, 'Lab 8-2: LCD hiển thị', '**Rubric**: LCD hiện đúng (40%), 2 dòng (30%), đếm giây (20%), code (10%)', 'See instructions', 1);
INSERT OR REPLACE INTO labs (id, week_id, order_index, title, instructions, wiring, is_published) VALUES ('lab-08-3', 'week-08', 3, 'Lab 8-3: Master-Slave', '**Rubric**: Gửi lệnh (30%), Slave thực hiện (30%), Phản hồi (30%), code (10%)

---

## 🏆 Đề thi mẫu 60 phút

**LCD hiển thị pot raw/V/% + nút đổi mode + Serial backup log**

| Tiêu chí | Điểm |
|----------|------|
| LCD hiển thị 3 mode | 30% |
| Nút đổi mode (debounce) | 25% |
| Pot đọc đúng | 20% |
| Serial log backup | 15% |
| Code sạch | 10% |

---

> **Tuần tiếp theo**: Tuần 9 - Giao thức SPI', 'See instructions', 1);
INSERT OR REPLACE INTO labs (id, week_id, order_index, title, instructions, wiring, is_published) VALUES ('lab-09-1', 'week-09', 1, 'Lab 9-1: Binary Count', '**Rubric**: Đếm đúng 0-255 (40%), hiển thị binary (30%), timing (20%), code (10%)', 'See instructions', 1);
INSERT OR REPLACE INTO labs (id, week_id, order_index, title, instructions, wiring, is_published) VALUES ('lab-09-2', 'week-09', 2, 'Lab 9-2: Knight Rider', '**Rubric**: Pattern đúng (40%), tốc độ (30%), không lặp đầu cuối (20%), code (10%)', 'See instructions', 1);
INSERT OR REPLACE INTO labs (id, week_id, order_index, title, instructions, wiring, is_published) VALUES ('lab-09-3', 'week-09', 3, 'Lab 9-3: Serial Pattern Selector', '**Rubric**: 3 pattern (40%), lệnh Serial (30%), Speed control (20%), code (10%)

---

## 🏆 Đề thi mẫu 60 phút

**74HC595 + 2 pattern + nút đổi + Serial mode**

| Tiêu chí | Điểm |
|----------|------|
| 2 pattern hoạt động | 35% |
| Nút đổi pattern | 25% |
| Serial hiện mode | 20% |
| Speed control | 10% |
| Code sạch | 10% |

---

> **Tuần tiếp theo**: Tuần 10 - Giao thức 1-Wire', 'See instructions', 1);
INSERT OR REPLACE INTO labs (id, week_id, order_index, title, instructions, wiring, is_published) VALUES ('lab-10-1', 'week-10', 1, 'Lab 10-1: Đọc nhiệt độ', '**Rubric**: Đọc đúng (40%), Serial output (30%), xử lý lỗi (20%), code (10%)', 'See instructions', 1);
INSERT OR REPLACE INTO labs (id, week_id, order_index, title, instructions, wiring, is_published) VALUES ('lab-10-2', 'week-10', 2, 'Lab 10-2: Cảnh báo 3 mức', '**Rubric**: 3 mức LED (40%), ngưỡng đúng (30%), Serial log (20%), code (10%)', 'See instructions', 1);
INSERT OR REPLACE INTO labs (id, week_id, order_index, title, instructions, wiring, is_published) VALUES ('lab-10-3', 'week-10', 3, 'Lab 10-3: Multi-sensor', '**Rubric**: Đọc nhiều sensor (40%), hiện địa chỉ (30%), format output (20%), code (10%)

---

## 🏆 Đề thi mẫu 60 phút

**DS18B20 + 3 LED cảnh báo + LCD hiển thị**

| Tiêu chí | Điểm |
|----------|------|
| Đọc nhiệt độ chính xác | 30% |
| 3 mức LED đúng ngưỡng | 25% |
| LCD hiển thị | 25% |
| Serial backup log | 10% |
| Code sạch | 10% |

---

> **Tuần tiếp theo**: Tuần 11 - WiFi WebServer', 'See instructions', 1);
INSERT OR REPLACE INTO labs (id, week_id, order_index, title, instructions, wiring, is_published) VALUES ('lab-11-1', 'week-11', 1, 'Lab 11-1: 1 LED WebServer', '**Rubric**: Web hoạt động (40%), LED đúng (30%), UI đẹp (20%), Serial log (10%)', 'See instructions', 1);
INSERT OR REPLACE INTO labs (id, week_id, order_index, title, instructions, wiring, is_published) VALUES ('lab-11-2', 'week-11', 2, 'Lab 11-2: 2 LED WebServer', '**Rubric**: 2 LED độc lập (40%), nút BAT/TAT đúng (30%), UI đẹp (20%), code (10%)

---

## 🏆 Đề thi mẫu 60 phút

**Web điều khiển 2 LED + /state endpoint trả JSON**

| Tiêu chí | Điểm |
|----------|------|
| 2 LED hoạt động | 30% |
| /state trả JSON | 25% |
| Trạng thái không mất khi refresh | 20% |
| UI đẹp | 15% |
| Code sạch | 10% |

---

> **Tuần tiếp theo**: Tuần 12 - Async WebServer', 'See instructions', 1);
INSERT OR REPLACE INTO labs (id, week_id, order_index, title, instructions, wiring, is_published) VALUES ('lab-12-1', 'week-12', 1, 'Lab 12-1: Async 1 LED', '**Rubric**: Không cần handleClient() (30%), JSON API (30%), Auto-refresh (25%), UI đẹp (15%)', 'See instructions', 1);
INSERT OR REPLACE INTO labs (id, week_id, order_index, title, instructions, wiring, is_published) VALUES ('lab-12-2', 'week-12', 2, 'Lab 12-2: Async 2 LED', '**Rubric**: 2 LED độc lập (30%), JSON state (25%), Real-time update (25%), UI đẹp (20%)

---

## 🏆 Đề thi mẫu cuối khóa

**Dashboard IoT: 2 LED + Sensor display + Auto-refresh**

| Tiêu chí | Điểm |
|----------|------|
| Async WebServer hoạt động | 20% |
| 2 LED điều khiển đúng | 20% |
| JSON API /state | 20% |
| Auto-refresh UI | 20% |
| UI đẹp, responsive | 10% |
| Code sạch, comment | 10% |

---

## 🎉 Kết thúc khóa học!

Chúc mừng bạn đã hoàn thành 12 tuần học Arduino!

### Bạn đã học được:
- ✅ GPIO, LED, Button, Keypad
- ✅ ADC, PWM, Sensors
- ✅ Communication: UART, I2C, SPI, 1-Wire
- ✅ IoT: WiFi WebServer, Async, JSON API

### Bước tiếp theo:
- 🚀 Xây dựng dự án IoT thực tế
- 🚀 Học MQTT, Firebase, Cloud
- 🚀 Tích hợp Mobile App

---

> **Chúc bạn thành công trong hành trình IoT!** 🌟', 'See instructions', 1);
