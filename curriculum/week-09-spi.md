# Tuần 9: Giao thức Kết nối SPI

> **Thời lượng**: 3 tiết lý thuyết + 2 tiết thực hành  
> **Mục tiêu**: Hiểu SPI và điều khiển thiết bị qua shift register

---

## 🎯 Mục tiêu học tập

Sau khi hoàn thành tuần này, bạn sẽ:

1. ✅ Hiểu giao thức SPI: MOSI, MISO, SCK, SS
2. ✅ So sánh SPI với I2C và UART
3. ✅ Điều khiển 74HC595 để mở rộng output
4. ✅ Tạo pattern LED qua shift register

---

## 📚 Phần 1: Lý thuyết dân dã (Dễ hiểu nhất)

### 1.1 SPI = "Dây chuyền sản xuất siêu tốc"

Nếu I2C là lớp học (giơ tay phát biểu), thì **SPI** là một dây chuyền nhà máy.
- Tốc độ cực nhanh (nhanh hơn I2C rất nhiều).
- Không cần "gọi tên" ai cả, cứ đến lượt là làm.

### 1.2 Bốn sợi dây thần thánh

1.  **MOSI (Master Out Slave In)**: Băng chuyền chở hàng từ Tổ trưởng (Master) xuống Công nhân (Slave).
2.  **MISO (Master In Slave Out)**: Băng chuyền chở hàng thành phẩm từ Công nhân (Slave) về Tổ trưởng (Master).
3.  **SCK (Clock)**: Tiếng còi hiệu "Tuýt... tuýt...". Cứ 1 tiếng tuýt là băng chuyền nhích 1 bước.
4.  **SS (Slave Select)**: Cái gậy chỉ huy của Tổ trưởng.
    - Tổ trưởng chỉ gậy vào ai, người đó phải làm việc.
    - Ai không bị chỉ gậy vào thì đứng im, bịt tai mắt lại (thả nổi chân tín hiệu).

> **Ưu điểm**: Nhanh, không lo trùng địa chỉ (vì dùng dây SS riêng cho mỗi người).
> **Nhược điểm**: Tốn dây (mỗi slave tốn thêm 1 dây SS riêng).

### 1.3 IC 74HC595: "Người chia bài" (Nhắc lại)

Trong bài này, chúng ta dùng giao thức SPI để nói chuyện với IC 74HC595.
- Bạn đưa cho nó 1 byte (8 bit) qua đường SPI.
- Nó sẽ chia 8 bit đó ra 8 chân để bật/tắt 8 đèn LED.
- Giúp bạn tiết kiệm chân Arduino (chỉ tốn 3 chân điều khiển được vô số LED nếu mắc nối tiếp).

### 1.1 SPI là gì?

**SPI (Serial Peripheral Interface)** là giao thức đồng bộ 4 dây, tốc độ cao.

```
Arduino (Master)     Thiết bị SPI (Slave)
     MOSI ──────────────► MOSI (Data In)
     MISO ◄────────────── MISO (Data Out)
      SCK ──────────────► SCK  (Clock)
       SS ──────────────► CS   (Chip Select)
```

### 1.2 Chân SPI của Arduino Uno

| Chân | Tên | Chức năng |
|------|-----|-----------|
| D11 | MOSI | Master Out Slave In |
| D12 | MISO | Master In Slave Out |
| D13 | SCK | Serial Clock |
| D10 | SS | Slave Select (có thể dùng pin khác) |

### 1.3 So sánh SPI vs I2C vs UART

| Đặc điểm | SPI | I2C | UART |
|----------|-----|-----|------|
| Số dây | 4 | 2 | 2 |
| Tốc độ | Rất nhanh (MHz) | Trung bình (kHz) | Thấp |
| Multi-slave | Cần thêm dây SS | Dùng địa chỉ | Không |
| Full-duplex | Có | Không | Có |

### 1.4 74HC595 - Shift Register

**74HC595** là IC thanh ghi dịch 8-bit, mở rộng 3 chân thành 8 output.

```
Arduino            74HC595           LEDs
   D11 ─────────── DS (14)           
   D13 ─────────── SHCP (11)         Q0 ──[R]── LED0
   D10 ─────────── STCP (12)         Q1 ──[R]── LED1
                                     Q2 ──[R]── LED2
   5V ──────────── VCC (16)          Q3 ──[R]── LED3
   5V ──────────── MR (10)           Q4 ──[R]── LED4
                                     Q5 ──[R]── LED5
   GND ─────────── GND (8)           Q6 ──[R]── LED6
   GND ─────────── OE (13)           Q7 ──[R]── LED7
```

| Chân 74HC595 | Chức năng |
|--------------|-----------|
| DS (14) | Data Serial Input |
| SHCP (11) | Shift Register Clock |
| STCP (12) | Storage Register Clock (Latch) |
| OE (13) | Output Enable (nối GND để enable) |
| MR (10) | Master Reset (nối VCC để không reset) |
| Q0-Q7 | 8 Output pins |

---

## 🔌 Chuẩn bị phần cứng (Hardware Setup)

**IC 74HC595 (Shift Register)** có 16 chân, khá rắc rối. Hãy cắm cẩn thận:

**Nối nguồn & Điều khiển:**
```
[Pin 16 (VCC)] ── [5V]
[Pin 10 (MR)]  ── [5V]  (Reset, nối 5V để không reset)
[Pin 8 (GND)]  ── [GND]
[Pin 13 (OE)]  ── [GND] (Output Enable, nối đất để bật)
```

**Nối với Arduino:**
```
[Pin 14 (DS - Data)]   ── [Pin 11 Arduino]
[Pin 11 (SHCP - Clock)] ── [Pin 13 Arduino]
[Pin 12 (STCP - Latch)] ── [Pin 10 Arduino]
```

**Nối với LED (Output):**
- Từ chân **Q0 đến Q7** (Pin 15, 1, 2, 3, 4, 5, 6, 7) nối ra 8 LED (qua trở).

---

## 🧱 Phần 2: Bài tập khởi động (Warm-up)

### 2.1 Drill 1: Dịch thủ công (Manual Shift)
**Mục tiêu**: Hiểu bit nó trôi đi đâu.

```cpp
// Nối: DS-11, STCP-10, SHCP-13
void setup() {
    pinMode(11, OUTPUT); pinMode(10, OUTPUT); pinMode(13, OUTPUT);
}

void loop() {
    digitalWrite(10, LOW); // Mở chốt
    
    // Gửi số 1 (00000001) -> Chỉ đèn cuối sáng
    shiftOut(11, 13, MSBFIRST, 1); 
    
    digitalWrite(10, HIGH); // Đóng chốt -> Đèn sáng
    delay(1000);
}
```

### 2.2 Drill 2: Đếm nhị phân (Binary Count)
**Mục tiêu**: Xem đèn nhấp nháy theo số đếm.

```cpp
void setup() {
    pinMode(11, OUTPUT); pinMode(10, OUTPUT); pinMode(13, OUTPUT);
}

void loop() {
    for (int i=0; i<256; i++) {
        digitalWrite(10, LOW);
        shiftOut(11, 13, MSBFIRST, i);
        digitalWrite(10, HIGH);
        delay(100);
    }
}
```

---

## 💻 Phần 3: Code mẫu hoàn chỉnh

### 2.1 Binary count 0→255 qua 74HC595

```cpp
/*
 * Bài 9-A1: 8 LED binary count qua 74HC595
 * Đếm nhị phân từ 0 đến 255
 */

const int DATA_PIN = 11;   // DS
const int CLOCK_PIN = 13;  // SHCP
const int LATCH_PIN = 10;  // STCP

void setup() {
    pinMode(DATA_PIN, OUTPUT);
    pinMode(CLOCK_PIN, OUTPUT);
    pinMode(LATCH_PIN, OUTPUT);
    
    Serial.begin(9600);
    Serial.println("=== 74HC595 Binary Counter ===");
}

void shiftOutByte(byte data) {
    // Latch LOW để chuẩn bị
    digitalWrite(LATCH_PIN, LOW);
    // Dịch data ra
    shiftOut(DATA_PIN, CLOCK_PIN, MSBFIRST, data);
    // Latch HIGH để cập nhật output
    digitalWrite(LATCH_PIN, HIGH);
}

void loop() {
    for (int i = 0; i <= 255; i++) {
        shiftOutByte(i);
        
        // In ra dạng binary
        Serial.print(i);
        Serial.print(" = ");
        for (int b = 7; b >= 0; b--) {
            Serial.print((i >> b) & 1);
        }
        Serial.println();
        
        delay(200);
    }
    
    Serial.println("=== Restart ===\n");
    delay(1000);
}
```

### 2.2 LED đuổi (Knight Rider)

```cpp
/*
 * Bài 9-A2: LED chạy đuổi 1→8→1 qua 74HC595
 */

const int DATA_PIN = 11;
const int CLOCK_PIN = 13;
const int LATCH_PIN = 10;

void shiftOutByte(byte data) {
    digitalWrite(LATCH_PIN, LOW);
    shiftOut(DATA_PIN, CLOCK_PIN, MSBFIRST, data);
    digitalWrite(LATCH_PIN, HIGH);
}

void setup() {
    pinMode(DATA_PIN, OUTPUT);
    pinMode(CLOCK_PIN, OUTPUT);
    pinMode(LATCH_PIN, OUTPUT);
    
    Serial.begin(9600);
    Serial.println("=== Knight Rider LED ===");
}

void loop() {
    // Forward: LED 0→7
    for (int i = 0; i < 8; i++) {
        byte pattern = 1 << i;  // Bit shift: 00000001, 00000010, ...
        shiftOutByte(pattern);
        Serial.println(pattern, BIN);
        delay(100);
    }
    
    // Backward: LED 6→1 (bỏ 2 đầu để không lặp)
    for (int i = 6; i >= 1; i--) {
        byte pattern = 1 << i;
        shiftOutByte(pattern);
        Serial.println(pattern, BIN);
        delay(100);
    }
}
```

### 2.3 Đổi pattern qua Serial command

```cpp
/*
 * Bài 9-A3: Lệnh Serial đổi pattern
 * 
 * Commands:
 * PATTERN=1: Knight Rider
 * PATTERN=2: Binary Count
 * PATTERN=3: All Blink
 * SPEED=50..500: Đổi tốc độ
 */

const int DATA_PIN = 11;
const int CLOCK_PIN = 13;
const int LATCH_PIN = 10;

int pattern = 1;
int speed = 100;
int counter = 0;
int direction = 1;

void shiftOutByte(byte data) {
    digitalWrite(LATCH_PIN, LOW);
    shiftOut(DATA_PIN, CLOCK_PIN, MSBFIRST, data);
    digitalWrite(LATCH_PIN, HIGH);
}

void setup() {
    pinMode(DATA_PIN, OUTPUT);
    pinMode(CLOCK_PIN, OUTPUT);
    pinMode(LATCH_PIN, OUTPUT);
    
    Serial.begin(9600);
    Serial.println("=== SPI Pattern Controller ===");
    Serial.println("Commands: PATTERN=1/2/3, SPEED=50..500");
}

void loop() {
    // Check Serial commands
    if (Serial.available()) {
        String cmd = Serial.readStringUntil('\n');
        cmd.trim();
        cmd.toUpperCase();
        
        if (cmd.startsWith("PATTERN=")) {
            int p = cmd.substring(8).toInt();
            if (p >= 1 && p <= 3) {
                pattern = p;
                counter = 0;
                Serial.print("OK Pattern=");
                Serial.println(pattern);
            }
        } 
        else if (cmd.startsWith("SPEED=")) {
            int s = cmd.substring(6).toInt();
            if (s >= 50 && s <= 500) {
                speed = s;
                Serial.print("OK Speed=");
                Serial.println(speed);
            }
        }
    }
    
    // Execute pattern
    byte output = 0;
    
    switch (pattern) {
        case 1:  // Knight Rider
            output = 1 << counter;
            counter += direction;
            if (counter >= 7) direction = -1;
            if (counter <= 0) direction = 1;
            break;
            
        case 2:  // Binary Count
            output = counter % 256;
            counter++;
            break;
            
        case 3:  // All Blink
            output = (counter % 2 == 0) ? 0xFF : 0x00;
            counter++;
            break;
    }
    
    shiftOutByte(output);
    delay(speed);
}
```

### 2.4 Cascade 2 IC 74HC595 (16 LED)

```cpp
/*
 * Nâng cao: 2 IC 74HC595 nối tiếp điều khiển 16 LED
 * 
 * IC1 Q7' nối vào IC2 DS
 */

const int DATA_PIN = 11;
const int CLOCK_PIN = 13;
const int LATCH_PIN = 10;

void shiftOut16(uint16_t data) {
    digitalWrite(LATCH_PIN, LOW);
    // Gửi byte cao trước (IC2)
    shiftOut(DATA_PIN, CLOCK_PIN, MSBFIRST, data >> 8);
    // Gửi byte thấp (IC1)
    shiftOut(DATA_PIN, CLOCK_PIN, MSBFIRST, data & 0xFF);
    digitalWrite(LATCH_PIN, HIGH);
}

void setup() {
    pinMode(DATA_PIN, OUTPUT);
    pinMode(CLOCK_PIN, OUTPUT);
    pinMode(LATCH_PIN, OUTPUT);
}

void loop() {
    // Knight Rider với 16 LED
    for (int i = 0; i < 16; i++) {
        shiftOut16(1 << i);
        delay(50);
    }
    for (int i = 14; i > 0; i--) {
        shiftOut16(1 << i);
        delay(50);
    }
}
```

---

## ⚠️ Phần 4: Lỗi thường gặp

| Lỗi | Nguyên nhân | Cách sửa |
|-----|-------------|----------|
| LED không sáng | OE không nối GND | Nối pin 13 xuống GND |
| LED sáng lung tung | MR không nối VCC | Nối pin 10 lên 5V |
| Pattern ngược | MSBFIRST/LSBFIRST sai | Đổi thứ tự bit |
| Chỉ 1 LED sáng yếu | Thiếu điện trở | Thêm 220Ω mỗi LED |

---

## 🎓 Phần 5: Tóm tắt

1. **SPI**: 4 dây, tốc độ cao, đồng bộ
2. **74HC595**: Mở rộng 3 chân → 8 output
3. **shiftOut()**: Hàm Arduino gửi byte ra shift register
4. **MSBFIRST**: Bit cao nhất gửi trước
5. **Cascade**: Nối nhiều IC để mở rộng thêm

---

## 📋 Phần 6: Quiz (5 câu về SPI, 74HC595, bit shift)

### Câu 1:
SPI cần bao nhiêu dây tối thiểu?
<details><summary>Đáp án</summary>**4 dây**: MOSI, MISO, SCK, SS</details>

### Câu 2:
74HC595 có bao nhiêu output?
<details><summary>Đáp án</summary>**8 output** (Q0-Q7)</details>

### Câu 3-5:
*(Câu hỏi về MSBFIRST, Latch, cascade)*

---

## 🔬 Phần 6: Labs + Rubric

### Lab 9-1: Binary Count
**Rubric**: Đếm đúng 0-255 (40%), hiển thị binary (30%), timing (20%), code (10%)

### Lab 9-2: Knight Rider
**Rubric**: Pattern đúng (40%), tốc độ (30%), không lặp đầu cuối (20%), code (10%)

### Lab 9-3: Serial Pattern Selector
**Rubric**: 3 pattern (40%), lệnh Serial (30%), Speed control (20%), code (10%)

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

> **Tuần tiếp theo**: Tuần 10 - Giao thức 1-Wire
