# Tuần 4: Phần mềm Hệ thống Nhúng - Analog Input/Output (ADC & PWM)

> **Thời lượng**: 3 tiết lý thuyết + 2 tiết thực hành  
> **Mục tiêu**: Đọc tín hiệu analog từ potentiometer, điều khiển LED bằng PWM

---

## 🎯 Mục tiêu học tập

Sau khi hoàn thành tuần này, bạn sẽ:

1. ✅ Hiểu ADC (Analog to Digital Converter) và độ phân giải 10-bit
2. ✅ Đọc giá trị từ potentiometer: raw, điện áp (V), phần trăm (%)
3. ✅ Hiểu PWM (Pulse Width Modulation) và khái niệm Duty Cycle
4. ✅ Điều khiển độ sáng LED bằng PWM
5. ✅ Sử dụng hàm map() để chuyển đổi dải giá trị

---

## 📚 Phần 1: Lý thuyết cốt lõi

### 1.1 Tín hiệu Analog vs Digital

| Đặc điểm | Digital | Analog |
|----------|---------|--------|
| Giá trị | Chỉ 0 hoặc 1 (HIGH/LOW) | Vô số giá trị liên tục |
| Ví dụ | Nút nhấn, LED on/off | Độ sáng, nhiệt độ, âm lượng |
| Arduino | Digital pins (D0-D13) | Analog pins (A0-A5) |

```
Digital:     Analog:
   5V ___     5V  ╱╲  
     │   │       ╱  ╲
     │   │      ╱    ╲
   0V ───┘    0V ─────── 
```

### 1.2 ADC - Analog to Digital Converter

**ADC** chuyển đổi tín hiệu analog (0-5V) thành số digital mà vi điều khiển hiểu được.

#### Thông số ADC của Arduino Uno:

| Thông số | Giá trị |
|----------|---------|
| Độ phân giải | 10-bit |
| Dải giá trị | 0 - 1023 |
| Điện áp đầu vào | 0V - 5V |
| Số chân analog | 6 (A0-A5) |

#### Công thức chuyển đổi:

```
raw = analogRead(A0);           // 0-1023

voltage = raw * 5.0 / 1023;     // 0.0V - 5.0V

percent = raw * 100.0 / 1023;   // 0% - 100%
```

**Giải thích**:
- 0V → raw = 0
- 2.5V → raw = 512 (khoảng giữa)
- 5V → raw = 1023

> [!WARNING]
> **Đối với ESP32**:
> - **ADC Resolution**: 12-bit (0 - 4095).
> - **Điện áp tham chiếu**: 3.3V (Uno là 5V).
> - **Công thức**: `voltage = raw * 3.3 / 4095.0`
> - **Lưu ý**: Không dùng ADC2 khi đang bật WiFi (gây nhiễu/lỗi).


### 1.3 Potentiometer (Biến trở)

**Potentiometer** (pot) là biến trở điều chỉnh được, dùng để thay đổi điện áp analog.

#### Sơ đồ kết nối:

```
        +5V
         │
       ┌─┴─┐
       │POT│  ← Vặn núm để thay đổi điện áp
       └─┬─┘
         │
         ├──── A0 (Arduino analog input)
         │
        GND
```

- **Chân 1**: Nối VCC (5V)
- **Chân 2**: Nối Arduino A0 (chân giữa, output)
- **Chân 3**: Nối GND

### 1.4 PWM - Pulse Width Modulation

**PWM** tạo tín hiệu "analog giả" bằng cách bật/tắt digital rất nhanh.

#### Duty Cycle (Chu kỳ làm việc):

```
Duty Cycle minh họa:

100% Duty:  ████████████████  (LED sáng tối đa)
            
 50% Duty:  ████    ████      (LED sáng trung bình)
            
 25% Duty:  ██      ██        (LED sáng yếu)

Thời gian →
```

> [!NOTE]
> PWM bật/tắt rất nhanh (490-980Hz) nên mắt người thấy LED sáng "mờ" thay vì nhấp nháy.



**Công thức**:
```
Duty Cycle (%) = (Thời gian HIGH / Chu kỳ) × 100
```

#### Arduino PWM:

| Thông số | Giá trị |
|----------|---------|
| Hàm | analogWrite(pin, value) |
| Dải giá trị | 0 - 255 |
| Chân PWM (Uno) | 3, 5, 6, 9, 10, 11 |
| Tần số | ~490 Hz (pin 3,9,10,11) hoặc ~980 Hz (pin 5,6) |

> [!TIP]
> **ESP32 PWM**:
> ESP32 sử dụng bộ điều khiển LEDC chuyên dụng, nhưng bạn vẫn có thể dùng hàm `analogWrite()` quen thuộc trên các chân GPIO hỗ trợ output.

```cpp
analogWrite(9, 0);    // 0% duty → LED tắt
analogWrite(9, 127);  // 50% duty → LED sáng 50%
analogWrite(9, 255);  // 100% duty → LED sáng tối đa
```

### 1.5 Hàm map() - Chuyển đổi dải giá trị

```cpp
map(value, fromLow, fromHigh, toLow, toHigh);
```

**Ví dụ**:
```cpp
int raw = analogRead(A0);          // 0-1023
int pwm = map(raw, 0, 1023, 0, 255); // → 0-255
```

**Công thức nội bộ**:
```
output = (value - fromLow) * (toHigh - toLow) / (fromHigh - fromLow) + toLow
```

### 1.6 Constrain - Giới hạn giá trị

```cpp
constrain(value, min, max);
```

Đảm bảo giá trị nằm trong khoảng [min, max]:
```cpp
int safe = constrain(value, 0, 255);  // Giới hạn 0-255
```

---

## 💻 Phần 2: Code mẫu hoàn chỉnh

### 2.1 Đọc điện áp Potentiometer - 3 dạng

```cpp
/*
 * Bài 4-1: Đọc điện áp pot — 3 dạng
 * 
 * Phần cứng:
 * - Potentiometer: VCC→5V, GND→GND, Signal→A0
 * 
 * Output:
 * - Raw (0-1023)
 * - Điện áp (V)
 * - Phần trăm (%)
 */

const int POT_PIN = A0;

void setup() {
    Serial.begin(9600);
    Serial.println("=== Potentiometer Reader ===");
    Serial.println("Vặn pot để thay đổi giá trị\n");
}

void loop() {
    // Đọc giá trị raw
    int raw = analogRead(POT_PIN);
    
    // Chuyển sang điện áp (V)
    // Lưu ý: Với ESP32 (3.3V, 12-bit), công thức là: raw * 3.3 / 4095.0
    float voltage = raw * 5.0 / 1023.0;
    
    // Chuyển sang phần trăm (%)
    float percent = raw * 100.0 / 1023.0;
    
    // In ra Serial
    Serial.print("Raw: ");
    Serial.print(raw);
    Serial.print(" | Voltage: ");
    Serial.print(voltage, 2);  // 2 chữ số thập phân
    Serial.print(" V | Percent: ");
    Serial.print(percent, 1);  // 1 chữ số thập phân
    Serial.println(" %");
    
    delay(200);  // Đọc 5 lần/giây
}
```

### 2.2 PWM điều khiển độ sáng LED

```cpp
/*
 * Bài 4-2: PWM độ sáng LED theo pot
 * 
 * Phần cứng:
 * - Potentiometer: A0
 * - LED: D9 (chân PWM) qua điện trở 220Ω
 * 
 * Serial bắt buộc:
 * - Raw
 * - % đã xử lý
 * - Vout tính theo V
 */

const int POT_PIN = A0;
const int LED_PIN = 9;  // Phải là chân PWM!

void setup() {
    Serial.begin(9600);
    pinMode(LED_PIN, OUTPUT);
    
    Serial.println("=== PWM LED Brightness Control ===");
    Serial.println("Vặn pot để điều chỉnh độ sáng\n");
}

void loop() {
    // Đọc pot
    int raw = analogRead(POT_PIN);
    
    // Map từ 0-1023 sang 0-255 (PWM)
    int pwmValue = map(raw, 0, 1023, 0, 255);
    
    // Xuất PWM ra LED
    analogWrite(LED_PIN, pwmValue);
    
    // Tính toán cho Serial
    float percent = raw * 100.0 / 1023.0;
    float vout = pwmValue * 5.0 / 255.0;  // Điện áp trung bình PWM
    
    // In theo format yêu cầu
    Serial.print("Raw: ");
    Serial.print(raw);
    Serial.print(" | %: ");
    Serial.print(percent, 1);
    Serial.print(" | Vout: ");
    Serial.print(vout, 2);
    Serial.println(" V");
    
    delay(100);
}
```

### 2.3 Điều khiển tốc độ nháy theo pot

```cpp
/*
 * Bài 4-3: Điều khiển tốc độ nháy theo pot
 * 
 * - Chu kỳ bật/tắt từ 0.1s (pot=1023) đến 1s (pot=0)
 * 
 * Serial bắt buộc:
 * - % pot
 * - Chế độ LED (bật/tắt)
 * - Chu kỳ (Ton + Toff)
 */

const int POT_PIN = A0;
const int LED_PIN = 13;

void setup() {
    Serial.begin(9600);
    pinMode(LED_PIN, OUTPUT);
    
    Serial.println("=== Blink Speed Control ===");
    Serial.println("Vặn pot để thay đổi tốc độ nháy\n");
}

unsigned long previousMillis = 0;
bool ledState = false;

void loop() {
    // Đọc pot
    int raw = analogRead(POT_PIN);
    float percent = raw * 100.0 / 1023.0;
    
    // Map: pot=0 → 1000ms, pot=1023 → 100ms
    // (Pot cao = nháy nhanh, pot thấp = nháy chậm)
    int halfPeriod = map(raw, 0, 1023, 1000, 100);
    int fullPeriod = halfPeriod * 2;
    
    // Non-blocking blink
    unsigned long currentMillis = millis();
    if (currentMillis - previousMillis >= halfPeriod) {
        previousMillis = currentMillis;
        ledState = !ledState;
        digitalWrite(LED_PIN, ledState);
        
        // In theo format yêu cầu
        Serial.print("% pot: ");
        Serial.print(percent, 1);
        Serial.print(" | LED: ");
        Serial.print(ledState ? "bật" : "tắt");
        Serial.print(" | Chu kỳ: ");
        Serial.print(fullPeriod);
        Serial.println(" ms");
    }
}
```

### 2.4 7 LED theo pot - 3 chế độ

```cpp
/*
 * Bài 4-4: 7 LED (D2→D8) theo pot, 3 chế độ
 * 
 * - <30%: chạy 2→8 (trái sang phải)
 * - >70%: chạy 8→2 (phải sang trái)
 * - 30-70%: chạy từ giữa ra hai phía (5→8 và 5→2)
 * 
 * Serial bắt buộc:
 * - % pot
 * - chế độ hiện hành
 */

const int LED_PINS[] = {2, 3, 4, 5, 6, 7, 8};  // 7 LED
const int NUM_LEDS = 7;
const int POT_PIN = A0;

int currentLed = 0;
int direction = 1;  // 1 = forward, -1 = backward
unsigned long previousMillis = 0;
const int LED_DELAY = 200;

// Biến cho chế độ 3 (từ giữa ra)
int leftLed = 3;   // Bắt đầu từ giữa (index 3 = pin 5)
int rightLed = 3;

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
    
    Serial.println("=== 7 LED Pot Control ===");
}

void loop() {
    int raw = analogRead(POT_PIN);
    float percent = raw * 100.0 / 1023.0;
    
    unsigned long currentMillis = millis();
    if (currentMillis - previousMillis < LED_DELAY) return;
    previousMillis = currentMillis;
    
    allOff();
    
    if (percent < 30) {
        // Chế độ 1: Chạy trái → phải (2→8)
        digitalWrite(LED_PINS[currentLed], HIGH);
        currentLed++;
        if (currentLed >= NUM_LEDS) currentLed = 0;
        
        static bool printed1 = false;
        if (!printed1) {
            Serial.print("% pot: ");
            Serial.print(percent, 1);
            Serial.println(" | Chế độ: Chạy trái→phải (2→8)");
            printed1 = true;
        }
        
    } else if (percent > 70) {
        // Chế độ 2: Chạy phải → trái (8→2)
        digitalWrite(LED_PINS[currentLed], HIGH);
        currentLed--;
        if (currentLed < 0) currentLed = NUM_LEDS - 1;
        
        static bool printed2 = false;
        if (!printed2) {
            Serial.print("% pot: ");
            Serial.print(percent, 1);
            Serial.println(" | Chế độ: Chạy phải→trái (8→2)");
            printed2 = true;
        }
        
    } else {
        // Chế độ 3: Từ giữa ra hai phía
        if (leftLed >= 0) digitalWrite(LED_PINS[leftLed], HIGH);
        if (rightLed < NUM_LEDS) digitalWrite(LED_PINS[rightLed], HIGH);
        
        leftLed--;
        rightLed++;
        
        if (leftLed < 0 && rightLed >= NUM_LEDS) {
            // Reset về giữa
            leftLed = 3;
            rightLed = 3;
        }
        
        static bool printed3 = false;
        if (!printed3) {
            Serial.print("% pot: ");
            Serial.print(percent, 1);
            Serial.println(" | Chế độ: Từ giữa ra hai phía");
            printed3 = true;
        }
    }
}
```

---

## ⚠️ Phần 3: Lỗi thường gặp & Cách khắc phục

### 3.1 analogRead() trả về 0 hoặc 1023 liên tục

| Nguyên nhân | Cách sửa |
|-------------|----------|
| Pot nối sai chân | Kiểm tra: VCC-Signal-GND |
| Chân A0 hỏng | Thử chân A1-A5 khác |
| Pot hỏng | Đo điện trở bằng đồng hồ |

### 3.2 analogWrite() LED không sáng

| Nguyên nhân | Cách sửa |
|-------------|----------|
| Dùng chân không PWM | Chỉ dùng pin 3, 5, 6, 9, 10, 11 |
| Quên điện trở | Thêm 220Ω cho LED |
| Giá trị PWM = 0 | Kiểm tra map() hoặc raw |

### 3.3 LED nhấp nháy thay vì điều chỉnh độ sáng

| Nguyên nhân | Cách sửa |
|-------------|----------|
| Nhiễu từ pot | Thêm tụ 100nF song song pot |
| Đọc quá nhanh | Thêm delay hoặc lọc trung bình |

### 3.4 Giá trị analog "nhảy" lung tung

**Giải pháp**: Dùng bộ lọc trung bình:

```cpp
int smoothAnalogRead(int pin) {
    long sum = 0;
    for (int i = 0; i < 10; i++) {
        sum += analogRead(pin);
        delay(1);
    }
    return sum / 10;
}
```

---

## 🎓 Phần 4: Tóm tắt kiến thức

### Key Points:

1. **ADC 10-bit**: Chuyển 0-5V thành 0-1023
2. **analogRead()**: Đọc giá trị analog từ A0-A5
3. **PWM**: Tín hiệu digital bật/tắt nhanh tạo "analog giả"
4. **analogWrite()**: Xuất PWM 0-255 (chỉ chân 3,5,6,9,10,11)
5. **map()**: Chuyển đổi giữa các dải giá trị
6. **Duty Cycle**: Tỉ lệ % thời gian HIGH trong 1 chu kỳ

### Công thức quan trọng:

```
Điện áp (V) = raw × 5.0 / 1023
Phần trăm (%) = raw × 100.0 / 1023
PWM từ raw = map(raw, 0, 1023, 0, 255)
```

### Thuật ngữ quan trọng:

| Thuật ngữ | Ý nghĩa |
|-----------|---------|
| ADC | Analog to Digital Converter |
| PWM | Pulse Width Modulation |
| Duty Cycle | Chu kỳ làm việc (% HIGH) |
| Resolution | Độ phân giải (10-bit = 1024 mức) |
| Potentiometer | Biến trở xoay |

---

## 📋 Phần 5: Quiz tự kiểm tra

### Câu 1:
ADC 10-bit của Arduino cho dải giá trị nào?

- A. 0 - 255
- B. 0 - 511
- C. 0 - 1023
- D. 0 - 4095

<details>
<summary>Đáp án</summary>

**C. 0 - 1023**

10-bit = 2^10 = 1024 mức, từ 0 đến 1023.
</details>

### Câu 2:
Với điện áp 2.5V vào chân A0, analogRead() trả về khoảng bao nhiêu?

- A. 256
- B. 512
- C. 768
- D. 1023

<details>
<summary>Đáp án</summary>

**B. 512**

2.5V là nửa của 5V, nên raw ≈ 1023/2 ≈ 511-512.
</details>

### Câu 3:
Chân nào của Arduino Uno KHÔNG hỗ trợ PWM?

- A. D3
- B. D5
- C. D7
- D. D9

<details>
<summary>Đáp án</summary>

**C. D7**

Chân PWM trên Uno: 3, 5, 6, 9, 10, 11 (có dấu ~ trên board).
</details>

### Câu 4:
`analogWrite(9, 127)` tạo duty cycle khoảng bao nhiêu?

- A. 25%
- B. 50%
- C. 75%
- D. 100%

<details>
<summary>Đáp án</summary>

**B. 50%**

127/255 ≈ 50%. LED sáng ở mức trung bình.
</details>

### Câu 5:
Hàm `map(500, 0, 1000, 0, 100)` trả về?

- A. 25
- B. 50
- C. 75
- D. 100

<details>
<summary>Đáp án</summary>

**B. 50**

500 là nửa của dải 0-1000, nên map sang 0-100 = 50.
</details>

### Câu 6:
Potentiometer có bao nhiêu chân?

- A. 2
- B. 3
- C. 4
- D. 5

<details>
<summary>Đáp án</summary>

**B. 3**

3 chân: VCC, Signal (wiper), GND.
</details>

### Câu 7:
PWM trên Arduino Uno hoạt động ở tần số khoảng bao nhiêu?

- A. 50 Hz
- B. 490 Hz
- C. 1000 Hz
- D. 16000 Hz

<details>
<summary>Đáp án</summary>

**B. 490 Hz**

Khoảng 490 Hz (pin 3,9,10,11) hoặc 980 Hz (pin 5,6).
</details>

### Câu 8:
Tại sao PWM được gọi là "analog giả"?

- A. Vì nó dùng chân analog
- B. Vì bật/tắt nhanh tạo hiệu ứng analog trung bình
- C. Vì cần ADC
- D. Vì điện áp thay đổi liên tục

<details>
<summary>Đáp án</summary>

**B. Vì bật/tắt nhanh tạo hiệu ứng analog trung bình**

LED/motor không phản ứng kịp tần số cao, nên "thấy" điện áp trung bình.
</details>

### Câu 9:
Công thức chuyển raw sang điện áp là?

- A. V = raw × 1023 / 5
- B. V = raw × 5 / 1023
- C. V = raw + 5
- D. V = raw / 5

<details>
<summary>Đáp án</summary>

**B. V = raw × 5 / 1023**

raw = 0 → 0V, raw = 1023 → 5V.
</details>

### Câu 10:
Nếu pot nối sai (Signal vào GND thay vì wiper), đọc sẽ ra?

- A. Luôn 0
- B. Luôn 1023
- C. Giá trị random
- D. Lỗi compile

<details>
<summary>Đáp án</summary>

**A. Luôn 0**

Nếu nối thẳng vào GND, điện áp luôn = 0V → raw = 0.
</details>

---

## 🔬 Phần 6: Bài thực hành (Labs)

### Lab 4-1: Đọc điện áp pot — 3 dạng

**Mục tiêu**: Đọc và chuyển đổi giá trị analog

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

---

### Lab 4-2: PWM độ sáng LED theo pot

**Mục tiêu**: Điều khiển LED bằng PWM

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

---

### Lab 4-3: Điều khiển tốc độ nháy theo pot

**Mục tiêu**: Thay đổi timing theo analog input

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

---

### Lab 4-4: 7 LED theo pot, 3 chế độ

**Mục tiêu**: Điều khiển pattern LED theo ngưỡng

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

> **Tuần tiếp theo**: Tuần 5 - Thực hành tích hợp I/O (Ghép nút + pot + LED + 7-seg)
