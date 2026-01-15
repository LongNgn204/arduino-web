# Tuần 3: Phần cứng Hệ thống Nhúng - Nút nhấn & Keypad

> **Thời lượng**: 3 tiết lý thuyết + 2 tiết thực hành  
> **Mục tiêu**: Đọc nút nhấn chính xác, xử lý debounce, điều khiển bằng keypad

---

## 🎯 Mục tiêu học tập

Sau khi hoàn thành tuần này, bạn sẽ:

1. ✅ Hiểu INPUT_PULLUP và tại sao nút nhấn thường đảo logic
2. ✅ Xử lý hiện tượng dội phím (bouncing) với debounce
3. ✅ Bắt cạnh (edge detection) để đếm số lần nhấn
4. ✅ Đọc ký tự từ keypad ma trận 4x4
5. ✅ Xây dựng hệ thống mật khẩu đơn giản

---

## 📚 Phần 1: Lý thuyết cốt lõi

### 1.1 Nút nhấn và cách nối mạch

**Nút nhấn** (push button) là công tắc tạm thời: nhấn = nối mạch, nhả = hở mạch.

#### Hai cách nối phổ biến:

**Cách 1: Pull-down (Điện trở kéo xuống)**
```
    +5V
     │
   [Nút]
     │
     ├──── Arduino Pin (D2)
     │
   [10kΩ]
     │
    GND
```
- Không nhấn: Pin đọc LOW (bị kéo xuống GND qua điện trở)
- Nhấn: Pin đọc HIGH (nối trực tiếp 5V)

**Cách 2: Pull-up (Điện trở kéo lên)**
```
    +5V
     │
   [10kΩ]
     │
     ├──── Arduino Pin (D2)
     │
   [Nút]
     │
    GND
```
- Không nhấn: Pin đọc HIGH (bị kéo lên 5V qua điện trở)
- Nhấn: Pin đọc LOW (nối trực tiếp GND)

### 1.2 INPUT_PULLUP - Điện trở nội bên trong Arduino

Arduino có **điện trở pull-up nội** (~20kΩ). Dùng `INPUT_PULLUP` là cách đơn giản nhất:

```cpp
pinMode(2, INPUT_PULLUP);  // Bật điện trở pull-up nội
```

Kết nối đơn giản:
```
Arduino Pin (D2) ──┬── [Nút] ── GND
                   │
              (Pull-up nội ~20kΩ)
                   │
                  +5V
```

| Trạng thái | digitalRead() | Logic thực tế |
|------------|---------------|---------------|
| Không nhấn | HIGH (1) | Chưa nhấn |
| Nhấn | LOW (0) | Đang nhấn |

> ⚠️ **Lưu ý**: Logic **đảo ngược** so với trực giác! HIGH = không nhấn, LOW = nhấn.

### 1.3 Hiện tượng Bounce (Dội phím)

Khi nhấn nút, tiếp điểm cơ khí **nảy lên xuống** nhiều lần trong vài mili-giây:

```
Tín hiệu thực tế khi nhấn 1 lần:
     ┌───────────────
     │ ┌─┐ ┌─┐ ┌─┐
─────┘ └─┘ └─┘ └─┘
     |← Bounce ~10-50ms →|

Mong muốn:
     ┌───────────────────
─────┘
```

Arduino đọc mỗi "nảy" thành 1 lần nhấn → sai lệch!

#### Debounce - Chống dội phím

**Nguyên lý**: Sau khi phát hiện thay đổi, chờ 20-50ms rồi mới xác nhận.

```cpp
const int BUTTON_PIN = 2;
const unsigned long DEBOUNCE_TIME = 50;  // ms

bool lastState = HIGH;
unsigned long lastDebounceTime = 0;

bool readButtonDebounced() {
    bool currentState = digitalRead(BUTTON_PIN);
    
    if (currentState != lastState) {
        lastDebounceTime = millis();
    }
    
    if (millis() - lastDebounceTime > DEBOUNCE_TIME) {
        lastState = currentState;
        return currentState;
    }
    
    return lastState;
}
```

### 1.4 Edge Detection - Bắt cạnh

Để **đếm số lần nhấn** (không phải trạng thái), cần phát hiện **thời điểm chuyển đổi**:

- **Cạnh xuống (Falling Edge)**: HIGH → LOW (bắt đầu nhấn)
- **Cạnh lên (Rising Edge)**: LOW → HIGH (nhả nút)

```cpp
bool lastButtonState = HIGH;
int pressCount = 0;

void loop() {
    bool currentState = digitalRead(BUTTON_PIN);
    
    // Phát hiện cạnh xuống (lần nhấn mới)
    if (lastButtonState == HIGH && currentState == LOW) {
        pressCount++;
        Serial.print("Nhấn lần: ");
        Serial.println(pressCount);
    }
    
    lastButtonState = currentState;
}
```

### 1.5 Keypad ma trận 4x4

**Keypad** có 16 phím nhưng chỉ cần 8 chân (4 hàng + 4 cột):

```
        C1   C2   C3   C4
        ↓    ↓    ↓    ↓
R1 → [ 1 ][ 2 ][ 3 ][ A ]
R2 → [ 4 ][ 5 ][ 6 ][ B ]
R3 → [ 7 ][ 8 ][ 9 ][ C ]
R4 → [ * ][ 0 ][ # ][ D ]
```

**Nguyên lý quét**:
1. Đặt R1 = LOW, R2-R4 = HIGH
2. Đọc C1-C4: nếu có cột = LOW → phím ở giao R1 và cột đó được nhấn
3. Lặp lại với R2, R3, R4

**Thư viện Keypad.h**:
```cpp
#include <Keypad.h>

const byte ROWS = 4;
const byte COLS = 4;

char keys[ROWS][COLS] = {
    {'1','2','3','A'},
    {'4','5','6','B'},
    {'7','8','9','C'},
    {'*','0','#','D'}
};

byte rowPins[ROWS] = {9, 8, 7, 6};  // Nối với R1-R4
byte colPins[COLS] = {5, 4, 3, 2};  // Nối với C1-C4

Keypad keypad = Keypad(makeKeymap(keys), rowPins, colPins, ROWS, COLS);
```

---

## 💻 Phần 2: Code mẫu hoàn chỉnh

### 2.1 Nút nhấn điều khiển LED (Nhấn bật, nhả tắt)

```cpp
/*
 * Bài 3-1: Nhấn → LED bật, Nhả → LED tắt
 * 
 * Phần cứng:
 * - Nút nhấn: D2 với INPUT_PULLUP (nối D2 → Nút → GND)
 * - LED: D13
 * 
 * Serial format bắt buộc:
 * - Trạng thái nút ấn: (1 - nhấn, 0 - không nhấn)
 * - Trạng thái led: (bật / tắt)
 */

const int BUTTON_PIN = 2;
const int LED_PIN = 13;

void setup() {
    Serial.begin(9600);
    pinMode(BUTTON_PIN, INPUT_PULLUP);  // Bật pull-up nội
    pinMode(LED_PIN, OUTPUT);
    
    Serial.println("=== Button Control LED ===");
    Serial.println("Nhấn nút để bật LED, nhả để tắt");
}

void loop() {
    // Đọc trạng thái nút (LOW = đang nhấn với INPUT_PULLUP)
    bool buttonPressed = (digitalRead(BUTTON_PIN) == LOW);
    
    // Điều khiển LED theo nút
    if (buttonPressed) {
        digitalWrite(LED_PIN, HIGH);
    } else {
        digitalWrite(LED_PIN, LOW);
    }
    
    // In ra Serial theo format yêu cầu
    static bool lastPrintState = false;
    if (buttonPressed != lastPrintState) {
        Serial.print("Trạng thái nút ấn: ");
        Serial.println(buttonPressed ? "1 - nhấn" : "0 - không nhấn");
        
        Serial.print("Trạng thái led: ");
        Serial.println(buttonPressed ? "bật" : "tắt");
        Serial.println();
        
        lastPrintState = buttonPressed;
    }
    
    delay(10);  // Debounce đơn giản
}
```

### 2.2 Đếm số lần nhấn - Lẻ bật, chẵn tắt

```cpp
/*
 * Bài 3-2: Đếm số lần nhấn, lẻ bật LED, chẵn tắt
 * 
 * Serial format bắt buộc:
 * - Số lần nhấn nút: xx
 * - Trạng thái led: (bật / tắt)
 */

const int BUTTON_PIN = 2;
const int LED_PIN = 13;

int pressCount = 0;
bool lastButtonState = HIGH;
unsigned long lastDebounceTime = 0;
const unsigned long DEBOUNCE_DELAY = 50;

void setup() {
    Serial.begin(9600);
    pinMode(BUTTON_PIN, INPUT_PULLUP);
    pinMode(LED_PIN, OUTPUT);
    
    Serial.println("=== Press Counter ===");
    Serial.println("Nhấn nút để đếm. Lẻ = bật, Chẵn = tắt");
    Serial.println();
}

void loop() {
    bool currentState = digitalRead(BUTTON_PIN);
    
    // Debounce check
    if (currentState != lastButtonState) {
        lastDebounceTime = millis();
    }
    
    if ((millis() - lastDebounceTime) > DEBOUNCE_DELAY) {
        // Phát hiện cạnh xuống (bắt đầu nhấn)
        static bool stableState = HIGH;
        if (currentState != stableState) {
            stableState = currentState;
            
            if (stableState == LOW) {  // Vừa nhấn xuống
                pressCount++;
                
                // Lẻ = bật, Chẵn = tắt
                bool ledState = (pressCount % 2 == 1);
                digitalWrite(LED_PIN, ledState ? HIGH : LOW);
                
                // In theo format yêu cầu
                Serial.print("Số lần nhấn nút: ");
                Serial.println(pressCount);
                Serial.print("Trạng thái led: ");
                Serial.println(ledState ? "bật" : "tắt");
                Serial.println();
            }
        }
    }
    
    lastButtonState = currentState;
}
```

### 2.3 Keypad đọc 1 ký tự

```cpp
/*
 * Bài 3-3: Keypad đọc 1 ký tự
 * 
 * Phần cứng: Keypad 4x4
 * - Hàng (R1-R4): D9, D8, D7, D6
 * - Cột (C1-C4): D5, D4, D3, D2
 * 
 * Serial format: Kí tự vừa nhập: ____
 */

#include <Keypad.h>

const byte ROWS = 4;
const byte COLS = 4;

char keys[ROWS][COLS] = {
    {'1','2','3','A'},
    {'4','5','6','B'},
    {'7','8','9','C'},
    {'*','0','#','D'}
};

byte rowPins[ROWS] = {9, 8, 7, 6};
byte colPins[COLS] = {5, 4, 3, 2};

Keypad keypad = Keypad(makeKeymap(keys), rowPins, colPins, ROWS, COLS);

void setup() {
    Serial.begin(9600);
    Serial.println("=== Keypad Reader ===");
    Serial.println("Nhấn phím bất kỳ...");
    Serial.println();
}

void loop() {
    char key = keypad.getKey();
    
    if (key) {
        Serial.print("Kí tự vừa nhập: ");
        Serial.println(key);
    }
}
```

### 2.4 Keypad điều khiển 5 LED

```cpp
/*
 * Bài 3-4: Keypad điều khiển 5 LED theo mapping
 * 
 * Mapping:
 * - 1/2: bật/tắt LED1
 * - 3/4: bật/tắt LED2
 * - 5/6: bật/tắt LED3
 * - 7/8: bật/tắt LED4
 * - 9/0: bật/tắt LED5
 */

#include <Keypad.h>

const byte ROWS = 4;
const byte COLS = 4;

char keys[ROWS][COLS] = {
    {'1','2','3','A'},
    {'4','5','6','B'},
    {'7','8','9','C'},
    {'*','0','#','D'}
};

byte rowPins[ROWS] = {9, 8, 7, 6};
byte colPins[COLS] = {5, 4, 3, 2};

Keypad keypad = Keypad(makeKeymap(keys), rowPins, colPins, ROWS, COLS);

// LED pins (A0-A4 vì D2-D9 dùng cho keypad)
const int LED_PINS[] = {A0, A1, A2, A3, A4};
const int NUM_LEDS = 5;

void setup() {
    Serial.begin(9600);
    
    for (int i = 0; i < NUM_LEDS; i++) {
        pinMode(LED_PINS[i], OUTPUT);
        digitalWrite(LED_PINS[i], LOW);
    }
    
    Serial.println("=== Keypad LED Control ===");
    Serial.println("1/2: LED1 | 3/4: LED2 | 5/6: LED3");
    Serial.println("7/8: LED4 | 9/0: LED5");
    Serial.println();
}

void loop() {
    char key = keypad.getKey();
    
    if (key) {
        Serial.print("Phím nhấn: ");
        Serial.print(key);
        Serial.print(" -> ");
        
        switch (key) {
            case '1':
                digitalWrite(LED_PINS[0], HIGH);
                Serial.println("LED1 ON");
                break;
            case '2':
                digitalWrite(LED_PINS[0], LOW);
                Serial.println("LED1 OFF");
                break;
            case '3':
                digitalWrite(LED_PINS[1], HIGH);
                Serial.println("LED2 ON");
                break;
            case '4':
                digitalWrite(LED_PINS[1], LOW);
                Serial.println("LED2 OFF");
                break;
            case '5':
                digitalWrite(LED_PINS[2], HIGH);
                Serial.println("LED3 ON");
                break;
            case '6':
                digitalWrite(LED_PINS[2], LOW);
                Serial.println("LED3 OFF");
                break;
            case '7':
                digitalWrite(LED_PINS[3], HIGH);
                Serial.println("LED4 ON");
                break;
            case '8':
                digitalWrite(LED_PINS[3], LOW);
                Serial.println("LED4 OFF");
                break;
            case '9':
                digitalWrite(LED_PINS[4], HIGH);
                Serial.println("LED5 ON");
                break;
            case '0':
                digitalWrite(LED_PINS[4], LOW);
                Serial.println("LED5 OFF");
                break;
            default:
                Serial.println("(không mapping)");
        }
    }
}
```

### 2.5 Keypad Password (kết thúc bằng #)

```cpp
/*
 * Bài 3-5: Keypad password
 * 
 * - Nhập mật khẩu, kết thúc bằng #
 * - Mật khẩu đúng ("1234"): bật LED xanh, Serial: "Mật khẩu đúng"
 * - Mật khẩu sai: bật LED đỏ, Serial: "Mật khẩu sai"
 * - Nhấn * để xóa và nhập lại
 */

#include <Keypad.h>

const byte ROWS = 4;
const byte COLS = 4;

char keys[ROWS][COLS] = {
    {'1','2','3','A'},
    {'4','5','6','B'},
    {'7','8','9','C'},
    {'*','0','#','D'}
};

byte rowPins[ROWS] = {9, 8, 7, 6};
byte colPins[COLS] = {5, 4, 3, 2};

Keypad keypad = Keypad(makeKeymap(keys), rowPins, colPins, ROWS, COLS);

const int LED_GREEN = A0;
const int LED_RED = A1;

// Mật khẩu đúng
const String CORRECT_PASSWORD = "1234";

// Buffer nhập mật khẩu
String inputPassword = "";

void setup() {
    Serial.begin(9600);
    pinMode(LED_GREEN, OUTPUT);
    pinMode(LED_RED, OUTPUT);
    
    resetLEDs();
    
    Serial.println("=== Password System ===");
    Serial.println("Nhập mật khẩu, nhấn # để xác nhận");
    Serial.println("Nhấn * để xóa và nhập lại");
    Serial.println();
    Serial.print("Password: ");
}

void resetLEDs() {
    digitalWrite(LED_GREEN, LOW);
    digitalWrite(LED_RED, LOW);
}

void loop() {
    char key = keypad.getKey();
    
    if (key) {
        if (key == '#') {
            // Xác nhận mật khẩu
            Serial.println();
            
            if (inputPassword == CORRECT_PASSWORD) {
                digitalWrite(LED_GREEN, HIGH);
                digitalWrite(LED_RED, LOW);
                Serial.println("Mật khẩu đúng");
            } else {
                digitalWrite(LED_GREEN, LOW);
                digitalWrite(LED_RED, HIGH);
                Serial.println("Mật khẩu sai");
            }
            
            // Reset để nhập lại
            delay(2000);
            inputPassword = "";
            resetLEDs();
            Serial.println();
            Serial.print("Password: ");
            
        } else if (key == '*') {
            // Xóa và nhập lại
            inputPassword = "";
            resetLEDs();
            Serial.println();
            Serial.println("Đã xóa!");
            Serial.print("Password: ");
            
        } else {
            // Thêm ký tự vào buffer
            inputPassword += key;
            Serial.print("*");  // Ẩn ký tự thật
        }
    }
}
```

---

## ⚠️ Phần 3: Lỗi thường gặp & Cách khắc phục

### 3.1 Nút nhấn "ma" - Đọc nhiều lần khi nhấn 1 lần

| Nguyên nhân | Cách sửa |
|-------------|----------|
| Không debounce | Thêm delay(50) hoặc dùng millis() debounce |
| Không bắt cạnh | Lưu lastState, so sánh với currentState |

### 3.2 Nút đọc sai logic (luôn HIGH hoặc luôn LOW)

| Nguyên nhân | Cách sửa |
|-------------|----------|
| Quên INPUT_PULLUP | Thêm `pinMode(pin, INPUT_PULLUP);` |
| Nút nối sai | Kiểm tra nút nối từ pin → GND |
| Chân nối lung tung | Pin floating, thêm điện trở pull-up/down |

### 3.3 Keypad không nhận phím

| Nguyên nhân | Cách sửa |
|-------------|----------|
| Sai thứ tự chân | Đổi rowPins[] và colPins[] |
| Sai ma trận keys[][] | Map lại theo layout thực tế |
| Quên cài thư viện | Sketch → Include Library → Manage → Keypad |

### 3.4 Checklist debug nút nhấn

1. ✅ Dùng `INPUT_PULLUP`?
2. ✅ Nút nối từ pin xuống GND?
3. ✅ Có debounce (delay hoặc millis)?
4. ✅ Có bắt cạnh (lưu lastState)?
5. ✅ Serial.print() để debug trạng thái?

---

## 🎓 Phần 4: Tóm tắt kiến thức

### Key Points:

1. **INPUT_PULLUP**: Bật điện trở kéo lên nội, không cần điện trở ngoài
2. **Logic đảo**: INPUT_PULLUP → không nhấn = HIGH, nhấn = LOW
3. **Debounce**: Chống dội phím, chờ 20-50ms sau khi phát hiện thay đổi
4. **Edge Detection**: Bắt cạnh xuống/lên để đếm lần nhấn
5. **Keypad**: Quét ma trận hàng/cột, dùng thư viện Keypad.h

### Pattern code quan trọng:

```cpp
// Debounce + Edge Detection
if (currentState != lastState) {
    lastDebounceTime = millis();
}
if ((millis() - lastDebounceTime) > DEBOUNCE_DELAY) {
    if (currentState != stableState) {
        stableState = currentState;
        if (stableState == LOW) {
            // Xử lý khi nhấn
        }
    }
}
lastState = currentState;
```

### Thuật ngữ quan trọng:

| Thuật ngữ | Ý nghĩa |
|-----------|---------|
| Pull-up | Điện trở kéo lên VCC |
| Pull-down | Điện trở kéo xuống GND |
| Bounce | Hiện tượng dội phím |
| Debounce | Chống dội phím |
| Edge | Cạnh (thời điểm chuyển đổi) |
| Falling Edge | Cạnh xuống (HIGH→LOW) |
| Rising Edge | Cạnh lên (LOW→HIGH) |

---

## 📋 Phần 5: Quiz tự kiểm tra

### Câu 1:
Với `pinMode(2, INPUT_PULLUP)`, khi nút KHÔNG được nhấn, `digitalRead(2)` trả về?

- A. LOW
- B. HIGH
- C. Không xác định
- D. 0

<details>
<summary>Đáp án</summary>

**B. HIGH**

INPUT_PULLUP kéo chân lên VCC qua điện trở nội. Khi không nhấn, chân đọc HIGH. Khi nhấn (nối GND), chân đọc LOW.
</details>

### Câu 2:
Tại sao cần xử lý debounce khi đọc nút nhấn?

- A. Để LED sáng hơn
- B. Để tránh đọc nhiều lần khi nhấn 1 lần
- C. Để tiết kiệm điện
- D. Để nút bền hơn

<details>
<summary>Đáp án</summary>

**B. Để tránh đọc nhiều lần khi nhấn 1 lần**

Tiếp điểm cơ khí nảy lên xuống (bounce) trong ~10-50ms, gây ra nhiều xung. Debounce chờ ổn định rồi mới đọc.
</details>

### Câu 3:
"Edge Detection" dùng để làm gì?

- A. Đọc trạng thái nút liên tục
- B. Phát hiện thời điểm nút thay đổi trạng thái
- C. Làm đèn nhấp nháy
- D. Tăng tốc độ xử lý

<details>
<summary>Đáp án</summary>

**B. Phát hiện thời điểm nút thay đổi trạng thái**

Edge detection phát hiện khi nút chuyển từ HIGH→LOW (falling edge) hoặc LOW→HIGH (rising edge), dùng để đếm lần nhấn.
</details>

### Câu 4:
Keypad 4x4 cần bao nhiêu chân Arduino?

- A. 4
- B. 8
- C. 12
- D. 16

<details>
<summary>Đáp án</summary>

**B. 8**

4 chân cho 4 hàng + 4 chân cho 4 cột = 8 chân. Kỹ thuật quét ma trận giúp giảm từ 16 phím xuống 8 chân.
</details>

### Câu 5:
Thời gian debounce thường dùng là?

- A. 1-5 ms
- B. 20-50 ms
- C. 100-200 ms
- D. 1-2 giây

<details>
<summary>Đáp án</summary>

**B. 20-50 ms**

Bounce thường kéo dài 10-50ms. Debounce 20-50ms đủ để ổn định mà không làm trễ phản hồi đáng kể.
</details>

### Câu 6:
Với INPUT_PULLUP, nút cần nối như thế nào?

- A. Từ pin → 5V
- B. Từ pin → GND
- C. Qua điện trở → 5V
- D. Qua điện trở → GND

<details>
<summary>Đáp án</summary>

**B. Từ pin → GND**

INPUT_PULLUP đã có sẵn pull-up nội. Chỉ cần nối nút từ pin xuống GND. Khi nhấn = nối GND = LOW.
</details>

### Câu 7:
Hàm `keypad.getKey()` trả về gì khi không có phím nào được nhấn?

- A. 0
- B. NULL
- C. NO_KEY hoặc '\0'
- D. -1

<details>
<summary>Đáp án</summary>

**C. NO_KEY hoặc '\0'**

Khi không có phím, getKey() trả về NO_KEY (= 0 = '\0'). Có thể kiểm tra bằng `if (key)` vì '\0' = false.
</details>

### Câu 8:
Falling Edge là gì?

- A. Tín hiệu đi từ LOW lên HIGH
- B. Tín hiệu đi từ HIGH xuống LOW
- C. Tín hiệu giữ ở LOW
- D. Tín hiệu giữ ở HIGH

<details>
<summary>Đáp án</summary>

**B. Tín hiệu đi từ HIGH xuống LOW**

Falling = rơi xuống. Với INPUT_PULLUP, falling edge xảy ra khi bắt đầu nhấn nút.
</details>

### Câu 9:
Điện trở pull-up nội của Arduino khoảng bao nhiêu?

- A. 100Ω
- B. 1kΩ
- C. 10kΩ
- D. 20kΩ - 50kΩ

<details>
<summary>Đáp án</summary>

**D. 20kΩ - 50kΩ**

ATmega328P có pull-up nội khoảng 20-50kΩ, đủ để hoạt động với hầu hết các nút nhấn thông thường.
</details>

### Câu 10:
Trong code password, tại sao dùng `Serial.print("*")` thay vì in ký tự thật?

- A. Tiết kiệm bộ nhớ
- B. Để ẩn mật khẩu (bảo mật)
- C. Vì Serial không hiển thị được số
- D. Để debug dễ hơn

<details>
<summary>Đáp án</summary>

**B. Để ẩn mật khẩu (bảo mật)**

Giống như nhập mật khẩu trên máy tính, hiển thị * thay vì ký tự thật để người xung quanh không thấy.
</details>

---

## 🔬 Phần 6: Bài thực hành (Labs)

### Lab 3-1: Nhấn → LED bật, nhả → LED tắt

**Mục tiêu**: Đọc nút nhấn và điều khiển LED trực tiếp

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

---

### Lab 3-2: Đếm số lần nhấn, lẻ bật, chẵn tắt

**Mục tiêu**: Áp dụng edge detection và debounce

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

---

### Lab 3-3: Keypad đọc 1 ký tự

**Mục tiêu**: Sử dụng thư viện Keypad

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

---

### Lab 3-4: Keypad điều khiển 5 LED

**Mục tiêu**: Mapping phím với chức năng

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

---

### Lab 3-5: Keypad password

**Mục tiêu**: Xây dựng hệ thống mật khẩu

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
    {'1','2','3','A'},
    {'4','5','6','B'},
    {'7','8','9','C'},
    {'*','0','#','D'}
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
    
    if (key == '#') {
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
        
    } else if (key == '*') {
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

> **Tuần tiếp theo**: Tuần 4 - Analog Input/Output (ADC & PWM)
