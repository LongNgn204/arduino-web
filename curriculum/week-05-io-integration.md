# Tuần 5: Thực hành Tích hợp I/O

> **Thời lượng**: 2 tiết lý thuyết + 3 tiết thực hành  
> **Mục tiêu**: Ghép nối pot + nút + LED + 7-seg thành hệ thống hoàn chỉnh

---

## 🎯 Mục tiêu học tập

Sau khi hoàn thành tuần này, bạn sẽ:

1. ✅ Tích hợp nhiều loại input/output trong 1 chương trình
2. ✅ Sử dụng cấu trúc state/mode để quản lý chế độ hoạt động
3. ✅ Kết hợp LED, 7-segment, nút nhấn, potentiometer
4. ✅ Viết code modular với các hàm riêng biệt
5. ✅ Chuẩn bị kỹ năng cho bài thi thực hành

---

## 📚 Phần 1: Lý thuyết dân dã (Dễ hiểu nhất)

### 1.1 State Machine (Máy trạng thái) - Ví dụ "Chiếc quạt máy"

Máy quạt nhà bạn có các nút 1, 2, 3.
- **Trạng thái 1**: Quạt quay chậm.
- **Trạng thái 2**: Quạt quay vừa.
- **Trạng thái 3**: Quạt quay nhanh.

Khi bạn bấm nút số 2 -> Máy chuyển sang **Trạng thái 2**.
Code cũng vậy thôi:
```cpp
int state = 1; // 1=Chậm, 2=Vừa, 3=Nhanh
if (nhấn nút) state = 2; // Chuyển trạng thái
```
Gọi là "Máy trạng thái" nghe cho sang, chứ bản chất nó là biến `state` ghi nhớ "mình đang ở đâu".

### 1.2 Nguyên tắc "Đa nhiệm" (Multitasking)

Làm sao để vừa quét LED 7 đoạn (liên tục) vừa đọc nút nhấn (liên tục) vừa nháy đèn (1s/lần)?
Nếu dùng `delay(1000)` để nháy đèn -> LED 7 đoạn sẽ tắt ngúm 1 giây -> **TOANG!**.

**Giải pháp: Ông đầu bếp giỏi**
- Ông ta KHÔNG bao giờ đứng nhìn nồi canh sôi 10 phút (`delay`).
- Ông ta đảo nồi thịt -> Ngó nồi canh -> Thái hành -> Quay lại đảo thịt.
- Mỗi việc chỉ tốn 1 tích tắc.

Trong Code:
- Dùng `millis()` (cái đồng hồ treo tường) để canh giờ.
- "Bây giờ là 10h00, thái hành. 10h01, đảo thịt".
- Không ai được phép dừng lại (`delay`) cả.

### 1.3 Quy trình chuẩn: IPO (Input - Process - Output)

Để đỡ loạn code, hãy chia việc ra 3 khâu:

1.  **INPUT (Đi chợ)**: Đọc hết các cảm biến, nút bấm, biến trở... cất vào biến.
2.  **PROCESS (Nấu ăn)**: Tính toán xem đèn nào cần sáng, số nào cần hiện, dựa trên nguyên liệu vừa mua.
3.  **OUTPUT (Dọn món)**: Ra lệnh cho đèn sáng, màn hình hiện.

Đừng vừa đi chợ vừa nấu ăn, sẽ rất rối!

### 1.1 State Machine (Máy trạng thái)

**State Machine** là cách tổ chức code theo các **trạng thái** và **sự kiện chuyển đổi**.

```
┌─────────┐  Nhấn nút   ┌─────────┐
│ STATE_A │ ──────────► │ STATE_B │
│ (Mode 1)│             │ (Mode 2)│
└─────────┘ ◄────────── └─────────┘
              Nhấn nút
```

**Ví dụ code**:
```cpp
enum State { MODE_1, MODE_2, MODE_3 };
State currentState = MODE_1;

void loop() {
    if (buttonPressed()) {
        currentState = (State)((currentState + 1) % 3);
    }
    
    switch (currentState) {
        case MODE_1: runMode1(); break;
        case MODE_2: runMode2(); break;
        case MODE_3: runMode3(); break;
    }
}
```

### 1.2 Nguyên tắc tích hợp I/O

1. **Chia module**: Mỗi chức năng 1 hàm riêng
2. **Non-blocking**: Dùng `millis()` thay `delay()`
3. **Tách đọc/xử lý/xuất**: Input → Logic → Output
4. **Debug từng phần**: Test riêng trước khi ghép

```cpp
void loop() {
    // 1. Đọc input
    int potValue = analogRead(A0);
    bool buttonState = readButton();
    
    // 2. Xử lý logic
    int mode = calculateMode(potValue);
    if (buttonState) changeMode();
    
    // 3. Xuất output
    updateLEDs(mode);
    updateDisplay(value);
}
```

### 1.3 Quản lý nhiều định thời

Khi có nhiều việc cần timing khác nhau:

```cpp
unsigned long lastLedUpdate = 0;
unsigned long lastDisplayUpdate = 0;
const int LED_INTERVAL = 100;
const int DISPLAY_INTERVAL = 500;

void loop() {
    unsigned long now = millis();
    
    if (now - lastLedUpdate >= LED_INTERVAL) {
        lastLedUpdate = now;
        updateLEDs();
    }
    
    if (now - lastDisplayUpdate >= DISPLAY_INTERVAL) {
        lastDisplayUpdate = now;
        refreshDisplay();
    }
}
```

---

## 🔌 Chuẩn bị phần cứng (Hardware Setup)

Bài này cần nhiều đồ chơi hơn. Hãy cắm sẵn lên breadboard:

**1. Input:**
- **Nút nhấn**: Pin 2 (GND ── Nút ── Pin 2).
- **Biến trở**: Chân giữa vào Pin A0.

**2. Output:**
- **LED đơn**: Pin 13 (Qua trở 220Ω).
- **LED 7 đoạn (nếu có bài dùng)**: Đấu nối như tuần 2.

*Dùng breadboard chia đôi nguồn 5V và GND dọc theo 2 thanh rail xanh đỏ để dễ cắm.*

---

## 🧱 Phần 2: Bài tập khởi động (Warm-up)

### 2.1 Drill 1: Nháy LED không dùng delay (Blink without Delay)
**Mục tiêu**: Làm quen với `millis()`.

```cpp
unsigned long thoiGianCu = 0;

void setup() {
    pinMode(13, OUTPUT);
}

void loop() {
    // Kiểm tra đồng hồ, nếu trôi qua 1000ms thì làm việc
    if (millis() - thoiGianCu >= 1000) {
        thoiGianCu = millis(); // Cập nhật lại thời gian cũ
        
        // Đảo trạng thái đèn (đang tắt thành bật, đang bật thành tắt)
        digitalWrite(13, !digitalRead(13));
    }
}
```

### 2.2 Drill 2: Công tắc bật đèn (State Variable)
**Mục tiêu**: Dùng biến để nhớ trạng thái.

```cpp
int trangThaiDen = 0; // 0: Tắt, 1: Bật

void setup() {
    pinMode(2, INPUT_PULLUP); // Nút nhấn
    pinMode(13, OUTPUT);      // Đèn
}

void loop() {
    if (digitalRead(2) == LOW) { // Nếu nhấn nút
        trangThaiDen = 1 - trangThaiDen; // Đảo 0 thành 1, 1 thành 0
        digitalWrite(13, trangThaiDen);
        delay(200); // Chống dội phím đơn giản
    }
}
```

---

## 💻 Phần 3: Code mẫu hoàn chỉnh

### 2.1 LED trang trí theo pot

```cpp
/*
 * Bài 5-1: LED trang trí theo pot
 * 
 * - pot <25%: LED1→LED8, lặp 3 lần
 * - pot >75%: LED8→LED1, lặp 3 lần
 * - 25–75%: sáng từ 2 phía (LED1→LED4 và LED8→LED5)
 */

const int LED_PINS[] = {2, 3, 4, 5, 6, 7, 8, 9};
const int NUM_LEDS = 8;
const int POT_PIN = A0;

int currentLed = 0;
int loopCount = 0;
unsigned long lastUpdate = 0;
const int SPEED = 150;

void allOff() {
    for (int i = 0; i < NUM_LEDS; i++) {
        digitalWrite(LED_PINS[i], LOW);
    }
}

void setup() {
    Serial.begin(9600);
    for (int i = 0; i < NUM_LEDS; i++) {
        pinMode(LED_PINS[i], OUTPUT);
    }
    allOff();
    Serial.println("=== LED Decoration by Pot ===");
}

void loop() {
    int raw = analogRead(POT_PIN);
    float percent = raw * 100.0 / 1023.0;
    
    if (millis() - lastUpdate < SPEED) return;
    lastUpdate = millis();
    
    allOff();
    
    if (percent < 25) {
        // Chế độ 1: 1→8, lặp 3 lần
        digitalWrite(LED_PINS[currentLed], HIGH);
        currentLed++;
        if (currentLed >= NUM_LEDS) {
            currentLed = 0;
            loopCount++;
            if (loopCount >= 3) loopCount = 0;
        }
        Serial.println("Mode: 1→8 (pot < 25%)");
        
    } else if (percent > 75) {
        // Chế độ 2: 8→1, lặp 3 lần
        digitalWrite(LED_PINS[NUM_LEDS - 1 - currentLed], HIGH);
        currentLed++;
        if (currentLed >= NUM_LEDS) {
            currentLed = 0;
            loopCount++;
            if (loopCount >= 3) loopCount = 0;
        }
        Serial.println("Mode: 8→1 (pot > 75%)");
        
    } else {
        // Chế độ 3: từ 2 phía
        static int left = 0, right = 7;
        digitalWrite(LED_PINS[left], HIGH);
        digitalWrite(LED_PINS[right], HIGH);
        left++;
        right--;
        if (left > 3) {
            left = 0;
            right = 7;
        }
        Serial.println("Mode: 2 phía (25-75%)");
    }
}
```

### 2.2 Số lượng LED sáng theo pot (10% mỗi LED)

```cpp
/*
 * Bài 5-2: Số lượng LED sáng theo pot
 * 
 * - Chia 10% mỗi LED
 * - pot >=20%: LED1 sáng
 * - Mỗi +10% thêm 1 LED
 */

const int LED_PINS[] = {2, 3, 4, 5, 6, 7, 8, 9};
const int NUM_LEDS = 8;
const int POT_PIN = A0;

void setLEDs(int count) {
    for (int i = 0; i < NUM_LEDS; i++) {
        digitalWrite(LED_PINS[i], i < count ? HIGH : LOW);
    }
}

void setup() {
    Serial.begin(9600);
    for (int i = 0; i < NUM_LEDS; i++) {
        pinMode(LED_PINS[i], OUTPUT);
    }
    Serial.println("=== LED Bar Graph ===");
}

void loop() {
    int raw = analogRead(POT_PIN);
    float percent = raw * 100.0 / 1023.0;
    
    // Tính số LED sáng: 0% = 0LED, 20% = 1LED, 30% = 2LED, ...
    int ledCount = 0;
    if (percent >= 20) {
        ledCount = min((int)((percent - 10) / 10), NUM_LEDS);
    }
    
    setLEDs(ledCount);
    
    static unsigned long lastPrint = 0;
    if (millis() - lastPrint > 500) {
        lastPrint = millis();
        Serial.print("Pot: ");
        Serial.print(percent, 1);
        Serial.print("% | LEDs: ");
        Serial.println(ledCount);
    }
}
```

### 2.3 LED trang trí theo số lần nhấn

```cpp
/*
 * Bài 5-3: LED trang trí theo số lần nhấn
 * 
 * - Nhấn 1 lần: chạy 1→8
 * - Nhấn 2 lần: chạy 8→1
 * - Nhấn 3 lần: như nhấn 1...
 */

const int LED_PINS[] = {2, 3, 4, 5, 6, 7, 8, 9};
const int NUM_LEDS = 8;
const int BUTTON_PIN = 10;

int mode = 1;  // 1 hoặc 2
int currentLed = 0;
int pressCount = 0;

bool lastButtonState = HIGH;
unsigned long lastDebounce = 0;
unsigned long lastLedUpdate = 0;

void allOff() {
    for (int i = 0; i < NUM_LEDS; i++) {
        digitalWrite(LED_PINS[i], LOW);
    }
}

void setup() {
    Serial.begin(9600);
    for (int i = 0; i < NUM_LEDS; i++) {
        pinMode(LED_PINS[i], OUTPUT);
    }
    pinMode(BUTTON_PIN, INPUT_PULLUP);
    allOff();
    Serial.println("=== LED by Button Press ===");
}

void loop() {
    // Đọc nút với debounce
    bool buttonState = digitalRead(BUTTON_PIN);
    if (buttonState != lastButtonState) {
        lastDebounce = millis();
    }
    if (millis() - lastDebounce > 50) {
        static bool stableState = HIGH;
        if (buttonState != stableState) {
            stableState = buttonState;
            if (stableState == LOW) {
                pressCount++;
                mode = (pressCount % 2 == 1) ? 1 : 2;
                Serial.print("Nhấn lần ");
                Serial.print(pressCount);
                Serial.print(" -> Mode ");
                Serial.println(mode);
            }
        }
    }
    lastButtonState = buttonState;
    
    // Update LED
    if (millis() - lastLedUpdate >= 200) {
        lastLedUpdate = millis();
        allOff();
        
        if (mode == 1) {
            // Chạy 1→8
            digitalWrite(LED_PINS[currentLed], HIGH);
            currentLed++;
            if (currentLed >= NUM_LEDS) currentLed = 0;
        } else {
            // Chạy 8→1
            digitalWrite(LED_PINS[NUM_LEDS - 1 - currentLed], HIGH);
            currentLed++;
            if (currentLed >= NUM_LEDS) currentLed = 0;
        }
    }
}
```

### 2.4 Hiển thị % pot trên 4 LED 7 đoạn

```cpp
/*
 * Bài 5-4: Hiển thị % pot (00→99) bằng 4 LED 7 đoạn
 * 
 * Chỉ dùng 2 digit cuối để hiển thị 00-99%
 */

// Segment pins (a-g)
const int SEG_PINS[] = {2, 3, 4, 5, 6, 7, 8};
const int DIGIT_PINS[] = {9, 10, 11, 12};  // D1-D4
const int NUM_SEGS = 7;
const int NUM_DIGITS = 4;
const int POT_PIN = A0;

const byte DIGITS_CODE[] = {
    0b00111111, 0b00000110, 0b01011011, 0b01001111, 0b01100110,
    0b01101101, 0b01111101, 0b00000111, 0b01111111, 0b01101111
};

void setSegments(int num) {
    byte pattern = DIGITS_CODE[num % 10];
    for (int i = 0; i < NUM_SEGS; i++) {
        digitalWrite(SEG_PINS[i], (pattern >> i) & 1);
    }
}

void allDigitsOff() {
    for (int i = 0; i < NUM_DIGITS; i++) {
        digitalWrite(DIGIT_PINS[i], LOW);
    }
}

void displayPercent(int percent) {
    int d1 = percent / 10;  // Chục
    int d2 = percent % 10;  // Đơn vị
    
    // Chỉ hiện 2 digit phải (digit 3 và 4)
    for (int d = 2; d < 4; d++) {
        allDigitsOff();
        if (d == 2) setSegments(d1);
        else setSegments(d2);
        digitalWrite(DIGIT_PINS[d], HIGH);
        delay(5);
    }
}

void setup() {
    Serial.begin(9600);
    for (int i = 0; i < NUM_SEGS; i++) pinMode(SEG_PINS[i], OUTPUT);
    for (int i = 0; i < NUM_DIGITS; i++) pinMode(DIGIT_PINS[i], OUTPUT);
    allDigitsOff();
    Serial.println("=== Pot % Display ===");
}

void loop() {
    int raw = analogRead(POT_PIN);
    int percent = map(raw, 0, 1023, 0, 99);
    
    displayPercent(percent);
    
    static unsigned long lastPrint = 0;
    if (millis() - lastPrint > 500) {
        lastPrint = millis();
        Serial.print("Pot: ");
        Serial.print(percent);
        Serial.println("%");
    }
}
```

### 2.5 Hiển thị số lần nhấn trên 7-segment

```cpp
/*
 * Bài 5-5: Hiển thị số lần nhấn (00→99) bằng 4 LED 7 đoạn
 */

const int SEG_PINS[] = {2, 3, 4, 5, 6, 7, 8};
const int DIGIT_PINS[] = {9, 10, 11, 12};
const int BUTTON_PIN = A0;  // Dùng A0 làm digital
const int NUM_SEGS = 7;

const byte DIGITS_CODE[] = {
    0b00111111, 0b00000110, 0b01011011, 0b01001111, 0b01100110,
    0b01101101, 0b01111101, 0b00000111, 0b01111111, 0b01101111
};

int pressCount = 0;
bool lastButtonState = HIGH;
unsigned long lastDebounce = 0;

void setSegments(int num) {
    byte pattern = DIGITS_CODE[num % 10];
    for (int i = 0; i < NUM_SEGS; i++) {
        digitalWrite(SEG_PINS[i], (pattern >> i) & 1);
    }
}

void allDigitsOff() {
    for (int i = 0; i < 4; i++) digitalWrite(DIGIT_PINS[i], LOW);
}

void displayNumber(int num) {
    int d1 = (num / 10) % 10;
    int d2 = num % 10;
    
    // Digit 3 (chục)
    allDigitsOff();
    setSegments(d1);
    digitalWrite(DIGIT_PINS[2], HIGH);
    delay(5);
    
    // Digit 4 (đơn vị)
    allDigitsOff();
    setSegments(d2);
    digitalWrite(DIGIT_PINS[3], HIGH);
    delay(5);
}

void setup() {
    Serial.begin(9600);
    for (int i = 0; i < NUM_SEGS; i++) pinMode(SEG_PINS[i], OUTPUT);
    for (int i = 0; i < 4; i++) pinMode(DIGIT_PINS[i], OUTPUT);
    pinMode(BUTTON_PIN, INPUT_PULLUP);
    allDigitsOff();
    Serial.println("=== Button Counter Display ===");
}

void loop() {
    // Đọc nút
    bool buttonState = digitalRead(BUTTON_PIN);
    if (buttonState != lastButtonState) {
        lastDebounce = millis();
    }
    if (millis() - lastDebounce > 50) {
        static bool stableState = HIGH;
        if (buttonState != stableState) {
            stableState = buttonState;
            if (stableState == LOW) {
                pressCount++;
                if (pressCount > 99) pressCount = 0;
                Serial.print("Count: ");
                Serial.println(pressCount);
            }
        }
    }
    lastButtonState = buttonState;
    
    // Hiển thị
    displayNumber(pressCount);
}
```

### 2.6 7-segment với 2 nút: đếm tăng/giảm

```cpp
/*
 * Bài 5-6: 4 LED 7 đoạn theo nút
 * - Nhấn 1 lần: đếm tăng 00→99
 * - Nhấn 2 lần: đếm giảm 99→00
 */

const int SEG_PINS[] = {2, 3, 4, 5, 6, 7, 8};
const int DIGIT_PINS[] = {9, 10, 11, 12};
const int BUTTON_PIN = A0;
const int NUM_SEGS = 7;

const byte DIGITS_CODE[] = {
    0b00111111, 0b00000110, 0b01011011, 0b01001111, 0b01100110,
    0b01101101, 0b01111101, 0b00000111, 0b01111111, 0b01101111
};

int displayValue = 0;
int mode = 1;  // 1=tăng, 2=giảm
int pressCount = 0;

bool lastButtonState = HIGH;
unsigned long lastDebounce = 0;
unsigned long lastCountUpdate = 0;

void setSegments(int num) {
    byte pattern = DIGITS_CODE[num % 10];
    for (int i = 0; i < NUM_SEGS; i++) {
        digitalWrite(SEG_PINS[i], (pattern >> i) & 1);
    }
}

void allDigitsOff() {
    for (int i = 0; i < 4; i++) digitalWrite(DIGIT_PINS[i], LOW);
}

void displayNumber(int num) {
    int d1 = (num / 10) % 10;
    int d2 = num % 10;
    
    allDigitsOff();
    setSegments(d1);
    digitalWrite(DIGIT_PINS[2], HIGH);
    delay(5);
    
    allDigitsOff();
    setSegments(d2);
    digitalWrite(DIGIT_PINS[3], HIGH);
    delay(5);
}

void setup() {
    Serial.begin(9600);
    for (int i = 0; i < NUM_SEGS; i++) pinMode(SEG_PINS[i], OUTPUT);
    for (int i = 0; i < 4; i++) pinMode(DIGIT_PINS[i], OUTPUT);
    pinMode(BUTTON_PIN, INPUT_PULLUP);
    allDigitsOff();
    Serial.println("=== Up/Down Counter ===");
    Serial.println("Nhấn 1 lần: đếm tăng | Nhấn 2 lần: đếm giảm");
}

void loop() {
    // Đọc nút đổi mode
    bool buttonState = digitalRead(BUTTON_PIN);
    if (buttonState != lastButtonState) {
        lastDebounce = millis();
    }
    if (millis() - lastDebounce > 50) {
        static bool stableState = HIGH;
        if (buttonState != stableState) {
            stableState = buttonState;
            if (stableState == LOW) {
                pressCount++;
                mode = (pressCount % 2 == 1) ? 1 : 2;
                Serial.print("Mode: ");
                Serial.println(mode == 1 ? "Đếm tăng" : "Đếm giảm");
            }
        }
    }
    lastButtonState = buttonState;
    
    // Đếm tự động
    if (millis() - lastCountUpdate >= 300) {
        lastCountUpdate = millis();
        
        if (mode == 1) {
            displayValue++;
            if (displayValue > 99) displayValue = 0;
        } else {
            displayValue--;
            if (displayValue < 0) displayValue = 99;
        }
    }
    
    // Hiển thị
    displayNumber(displayValue);
}
```

---

## ⚠️ Phần 4: Lỗi thường gặp & Cách khắc phục

### 3.1 Chương trình "đứng" khi tích hợp

| Nguyên nhân | Cách sửa |
|-------------|----------|
| Dùng delay() trong loop | Chuyển sang millis() |
| Vòng lặp vô hạn trong hàm | Thêm điều kiện thoát |
| Blocking I/O | Đọc/ghi nhanh, không chờ |

### 3.2 Nút nhấn không phản hồi

| Nguyên nhân | Cách sửa |
|-------------|----------|
| delay() chặn đọc nút | Dùng millis() |
| Không debounce | Thêm debounce 50ms |
| Sai logic INPUT_PULLUP | LOW = nhấn, HIGH = nhả |

### 3.3 7-segment nhấp nháy

| Nguyên nhân | Cách sửa |
|-------------|----------|
| delay() quá dài | Giảm delay xuống 3-5ms |
| Quét không đều | Đảm bảo quét liên tục |

---

## 🎓 Phần 5: Tóm tắt kiến thức

### Key Points:

1. **State Machine**: Tổ chức code theo trạng thái và sự kiện
2. **Non-blocking**: Dùng millis() để không chặn
3. **Modular code**: Mỗi chức năng 1 hàm riêng
4. **Tách I/O**: Input → Logic → Output
5. **Debug từng phần**: Test riêng trước khi ghép

### Pattern quan trọng:

```cpp
// Multi-timing pattern
unsigned long lastA = 0, lastB = 0;
void loop() {
    if (millis() - lastA >= INTERVAL_A) { lastA = millis(); taskA(); }
    if (millis() - lastB >= INTERVAL_B) { lastB = millis(); taskB(); }
}
```

---

## 📋 Phần 6: Quiz tự kiểm tra

### Câu 1:
Tại sao nên dùng millis() thay vì delay() khi tích hợp nhiều I/O?

- A. millis() nhanh hơn
- B. delay() block CPU, không đọc được input
- C. millis() tiết kiệm điện
- D. delay() làm LED sáng hơn

<details>
<summary>Đáp án</summary>

**B. delay() block CPU, không đọc được input**

Trong lúc delay(), CPU không làm gì khác, không đọc nút, không quét display.
</details>

### Câu 2:
State Machine giúp gì trong lập trình nhúng?

- A. Tăng tốc độ CPU
- B. Tổ chức code theo trạng thái, dễ quản lý
- C. Giảm bộ nhớ
- D. Tăng độ sáng LED

<details>
<summary>Đáp án</summary>

**B. Tổ chức code theo trạng thái, dễ quản lý**

State machine giúp chia logic thành các trạng thái rõ ràng, dễ debug và mở rộng.
</details>

### Câu 3-10:
*(Các câu hỏi tương tự về tích hợp I/O, timing, modular code)*

---

## 🔬 Phần 6: Bài thực hành (Labs)

### Lab 5-1: LED trang trí theo pot
**Rubric**: Đúng 3 chế độ (40%), chuyển mượt (30%), Serial log (20%), code sạch (10%)

### Lab 5-2: LED bar theo pot
**Rubric**: Đúng số LED (40%), ngưỡng 10% (30%), Serial (20%), code (10%)

### Lab 5-3: LED theo số lần nhấn
**Rubric**: Đếm đúng (30%), 2 mode (40%), debounce (20%), code (10%)

### Lab 5-4: Hiển thị % pot
**Rubric**: Display đúng (40%), quét mượt (30%), pot phản hồi (20%), code (10%)

### Lab 5-5: Hiển thị số lần nhấn
**Rubric**: Đếm đúng (30%), display đúng (40%), debounce (20%), code (10%)

### Lab 5-6: Đếm tăng/giảm theo nút
**Rubric**: 2 mode (40%), auto count (30%), display (20%), code (10%)

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

> **Tuần tiếp theo**: Tuần 6 - Cảm biến trong Hệ thống Nhúng
