# Tuần 10: Giao thức 1-Wire (DS18B20)

> **Thời lượng**: 3 tiết lý thuyết + 2 tiết thực hành  
> **Mục tiêu**: Đọc cảm biến nhiệt độ DS18B20 qua giao thức 1-Wire

---

## 🎯 Mục tiêu học tập

Sau khi hoàn thành tuần này, bạn sẽ:

1. ✅ Hiểu giao thức 1-Wire: 1 dây data, nhiều thiết bị
2. ✅ Đọc nhiệt độ từ DS18B20
3. ✅ Xây dựng hệ thống cảnh báo nhiệt độ
4. ✅ Sử dụng nhiều cảm biến trên 1 bus

---

## 📚 Phần 1: Lý thuyết dân dã (Dễ hiểu nhất)

### 1.1 1-Wire = "Đường dây điện thoại chung cư"

Nếu I2C cần 2 dây, SPI cần 4 dây, thì **1-Wire** bá đạo nhất: chỉ cần **1 dây duy nhất** để truyền dữ liệu (+ dây đất).
Nó giống hệt đường dây điện thoại nội bộ trong chung cư cũ:
- Tất cả các căn hộ (cảm biến DS18B20) đều nối chung vào 1 sợi dây đồng.
- Mỗi căn hộ có một **số nhà duy nhất** (ROM Code 64-bit).
- Bảo vệ muốn gọi căn nào thì bấm số căn đó. Chỉ căn đó nhấc máy trả lời.

👉 **Ưu điểm**: Tiết kiệm dây tối đa. Kéo 1 sợi dây dài 100 mét, gắn 50 cái cảm biến vào cũng được.

### 1.2 Kẻ ký sinh (Parasite Power)

Bá đạo hơn nữa, cảm biến này có thể "ký sinh", hút năng lượng từ chính dây dữ liệu để sống.
- Không cần dây nguồn VCC đỏ đỏ.
- Chỉ cần dây Đen (GND) và dây Vàng (Data).

Nhưng thôi, người mới thì cứ cắm đủ 3 dây cho lành, chế độ ký sinh hơi khó tính.

### 1.3 Tại sao lại là 85°C?

Khi bạn vừa bật cảm biến lên, nếu thấy nó báo **85°C**, đừng hoảng hốt.
- Đó không phải nhiệt độ thật.
- Đó là mã thông báo: "Tôi đang khởi động, chưa đo xong!".
- Giống như màn hình Loading trong game vậy. Hãy đợi nó đo xong (khoảng 0.75 giây) rồi mới lấy kết quả.

### 1.4 Điện trở kéo 4.7kΩ (Lại là cái lò xo)

Giống I2C, dây Data của 1-Wire cũng lỏng lẻo.
- Bắt buộc phải có 1 điện trở 4.7kΩ nối dây Data lên 5V.
- Nếu không có? Arduino sẽ chẳng nghe thấy gì, hoặc nghe tiếng "xè xè" (nhiễu).

### 1.1 1-Wire là gì?

**1-Wire** là giao thức của Dallas Semiconductor (nay là Maxim), chỉ cần **1 dây data** + GND.

```
Arduino              DS18B20
   D2 ──────┬──────── DQ (Data)
            │
          [4.7kΩ]    (Pull-up resistor)
            │
           +5V
   GND ─────────────── GND
   5V ──────────────── VCC
```

### 1.2 Đặc điểm 1-Wire

| Đặc điểm | Mô tả |
|----------|-------|
| Số dây | 1 dây data (+ GND + VCC) |
| Bus | Nhiều thiết bị trên 1 bus |
| Địa chỉ | Mỗi thiết bị có ROM 64-bit duy nhất |
| Parasite Power | Có thể cấp nguồn qua data line |

### 1.3 DS18B20 - Cảm biến nhiệt độ

| Thông số | Giá trị |
|----------|---------|
| Dải đo | -55°C đến +125°C |
| Độ chính xác | ±0.5°C (ở -10°C đến +85°C) |
| Độ phân giải | 9-12 bit (mặc định 12-bit) |
| Thời gian đo | ~750ms (12-bit) |
| Điện áp | 3.0V - 5.5V |

### 1.4 Sơ đồ chân DS18B20

```
      ┌─────┐
      │ DS  │
      │18B20│
      └┬─┬─┬┘
       │ │ │
      GND DQ VCC
       1  2  3
```

> 💡 **Mẹo phân biệt**: Mặt phẳng hướng về bạn, từ trái sang: GND, DQ, VCC

### 1.5 Thư viện cần thiết

```cpp
#include <OneWire.h>
#include <DallasTemperature.h>
```

Cài đặt: Sketch > Include Library > Manage Libraries > Tìm "OneWire" và "DallasTemperature"

---

## 🔌 Chuẩn bị phần cứng (Hardware Setup)

**Cảm biến nhiệt độ DS18B20:**
Đây là loại cảm biến "chân dài" giống như con sò 3 chân.
- **Chân 1 (GND)**: Nối đất.
- **Chân 2 (DQ/Data - Ở giữa)**: Nối vào **Pin 2**.
- **Chân 3 (VCC)**: Nối 5V.

> **QUAN TRỌNG**: Bạn phải nối thêm **1 điện trở 4.7kΩ** (Vàng-Tím-Đỏ) nằm vắt ngang giữa chân **DQ** và chân **VCC**. Nếu không có điện trở này, cảm biến sẽ không chạy!

*(Mẹo: Nếu mua module có sẵn mạch in PCB thì họ đã hàn điện trở này rồi, cứ cắm 3 dây là chạy).*

---

## 🧱 Phần 2: Bài tập khởi động (Warm-up)

### 2.1 Drill 1: Điều tra dân số (Sensor Count)
**Mục tiêu**: Xem có bao nhiêu cảm biến đang nối vào.

```cpp
#include <OneWire.h>
#include <DallasTemperature.h>

OneWire oneWire(2); // Nối chân Data vào pin 2
DallasTemperature sensors(&oneWire);

void setup() {
    Serial.begin(9600);
    sensors.begin();
    
    int soLuong = sensors.getDeviceCount();
    Serial.print("Tim thay: ");
    Serial.println(soLuong);
}

void loop() {}
```

### 2.2 Drill 2: Đọc nhiệt độ thô
**Mục tiêu**: Đọc nhanh nhất có thể.

```cpp
// (Khai báo như trên...)

void loop() {
    sensors.requestTemperatures(); // Ra lệnh "đo đi!"
    float t = sensors.getTempCByIndex(0); // Lấy kết quả con số 0
    Serial.println(t);
    delay(1000);
}
```

---

## 💻 Phần 3: Code mẫu hoàn chỉnh

### 2.1 Đọc nhiệt độ cơ bản

```cpp
/*
 * Bài 10-1: Đọc nhiệt độ DS18B20
 * 
 * Serial format: "T=__°C"
 */

#include <OneWire.h>
#include <DallasTemperature.h>

const int ONE_WIRE_BUS = 2;  // Data pin

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

void setup() {
    Serial.begin(9600);
    sensors.begin();
    
    Serial.println("=== DS18B20 Temperature Sensor ===");
    Serial.print("Found ");
    Serial.print(sensors.getDeviceCount());
    Serial.println(" sensor(s)");
    Serial.println();
}

void loop() {
    // Yêu cầu đọc nhiệt độ
    sensors.requestTemperatures();
    
    // Lấy nhiệt độ của sensor đầu tiên (index 0)
    float tempC = sensors.getTempCByIndex(0);
    
    // Kiểm tra lỗi (-127 = lỗi đọc)
    if (tempC == DEVICE_DISCONNECTED_C) {
        Serial.println("Error: Sensor disconnected!");
        delay(1000);
        return;
    }
    
    // In kết quả
    Serial.print("T=");
    Serial.print(tempC, 1);  // 1 số thập phân
    Serial.println("°C");
    
    delay(1000);  // Đọc mỗi giây
}
```

### 2.2 Cảnh báo 3 mức nhiệt độ

```cpp
/*
 * Bài 10-2: 3 mức LED theo nhiệt độ
 * 
 * <25°C: LED xanh (lạnh)
 * 25-35°C: LED vàng (bình thường)
 * >35°C: LED đỏ (nóng)
 */

#include <OneWire.h>
#include <DallasTemperature.h>

const int ONE_WIRE_BUS = 2;
const int LED_GREEN = 3;
const int LED_YELLOW = 4;
const int LED_RED = 5;

const float COLD_THRESHOLD = 25.0;
const float HOT_THRESHOLD = 35.0;

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

void setLED(int g, int y, int r) {
    digitalWrite(LED_GREEN, g);
    digitalWrite(LED_YELLOW, y);
    digitalWrite(LED_RED, r);
}

void setup() {
    Serial.begin(9600);
    sensors.begin();
    
    pinMode(LED_GREEN, OUTPUT);
    pinMode(LED_YELLOW, OUTPUT);
    pinMode(LED_RED, OUTPUT);
    
    Serial.println("=== Temperature Warning System ===");
    Serial.print("Cold: <");
    Serial.print(COLD_THRESHOLD);
    Serial.print("°C | Hot: >");
    Serial.print(HOT_THRESHOLD);
    Serial.println("°C");
    Serial.println();
}

void loop() {
    sensors.requestTemperatures();
    float temp = sensors.getTempCByIndex(0);
    
    if (temp == DEVICE_DISCONNECTED_C) {
        setLED(LOW, LOW, LOW);
        Serial.println("Sensor Error!");
        delay(1000);
        return;
    }
    
    String status;
    
    if (temp < COLD_THRESHOLD) {
        setLED(HIGH, LOW, LOW);
        status = "COLD";
    } else if (temp <= HOT_THRESHOLD) {
        setLED(LOW, HIGH, LOW);
        status = "NORMAL";
    } else {
        setLED(LOW, LOW, HIGH);
        status = "HOT!";
    }
    
    Serial.print("Temp: ");
    Serial.print(temp, 1);
    Serial.print("°C - ");
    Serial.println(status);
    
    delay(1000);
}
```

### 2.3 Nhiều cảm biến trên 1 bus

```cpp
/*
 * Bài 10-3: Đọc nhiều DS18B20 trên 1 bus
 * 
 * Mỗi sensor có địa chỉ ROM 64-bit duy nhất
 */

#include <OneWire.h>
#include <DallasTemperature.h>

const int ONE_WIRE_BUS = 2;

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

// Mảng lưu địa chỉ các sensor
DeviceAddress sensorAddresses[8];
int sensorCount = 0;

void printAddress(DeviceAddress addr) {
    for (int i = 0; i < 8; i++) {
        if (addr[i] < 16) Serial.print("0");
        Serial.print(addr[i], HEX);
    }
}

void setup() {
    Serial.begin(9600);
    sensors.begin();
    
    sensorCount = sensors.getDeviceCount();
    
    Serial.println("=== Multi-Sensor System ===");
    Serial.print("Found ");
    Serial.print(sensorCount);
    Serial.println(" sensor(s):\n");
    
    // Lấy địa chỉ của tất cả sensor
    for (int i = 0; i < sensorCount; i++) {
        if (sensors.getAddress(sensorAddresses[i], i)) {
            Serial.print("Sensor ");
            Serial.print(i);
            Serial.print(": ");
            printAddress(sensorAddresses[i]);
            Serial.println();
        }
    }
    Serial.println();
}

void loop() {
    sensors.requestTemperatures();
    
    Serial.println("--- Readings ---");
    for (int i = 0; i < sensorCount; i++) {
        float temp = sensors.getTempC(sensorAddresses[i]);
        
        Serial.print("Sensor ");
        Serial.print(i);
        Serial.print(": ");
        
        if (temp == DEVICE_DISCONNECTED_C) {
            Serial.println("DISCONNECTED");
        } else {
            Serial.print(temp, 1);
            Serial.println("°C");
        }
    }
    Serial.println();
    
    delay(2000);
}
```

### 2.4 Hiển thị nhiệt độ lên LCD I2C

```cpp
/*
 * Nâng cao: DS18B20 + LCD I2C
 */

#include <OneWire.h>
#include <DallasTemperature.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

const int ONE_WIRE_BUS = 2;

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);
LiquidCrystal_I2C lcd(0x27, 16, 2);

// Ký tự độ C custom
byte degreeSymbol[] = {
    B00110,
    B01001,
    B01001,
    B00110,
    B00000,
    B00000,
    B00000,
    B00000
};

void setup() {
    sensors.begin();
    lcd.init();
    lcd.backlight();
    lcd.createChar(0, degreeSymbol);
    
    lcd.setCursor(0, 0);
    lcd.print("Temperature:");
}

void loop() {
    sensors.requestTemperatures();
    float temp = sensors.getTempCByIndex(0);
    
    lcd.setCursor(0, 1);
    if (temp == DEVICE_DISCONNECTED_C) {
        lcd.print("Error!        ");
    } else {
        lcd.print(temp, 1);
        lcd.write(0);  // Ký tự độ
        lcd.print("C       ");
    }
    
    delay(500);
}
```

---

## ⚠️ Phần 4: Lỗi thường gặp

| Lỗi | Nguyên nhân | Cách sửa |
|-----|-------------|----------|
| Đọc -127°C | Sensor không kết nối | Kiểm tra dây, pull-up |
| Đọc 85°C | Sensor chưa sẵn sàng | Chờ 750ms sau requestTemperatures |
| Không tìm thấy sensor | Thiếu pull-up 4.7kΩ | Thêm resistor từ DQ lên VCC |
| Nhiệt độ sai | Chân nối sai | Kiểm tra GND-DQ-VCC |

### Checklist debug:
1. ✅ Có điện trở pull-up 4.7kΩ?
2. ✅ Đúng chân: GND (flat side left), DQ (middle), VCC (right)?
3. ✅ Đã cài thư viện OneWire và DallasTemperature?
4. ✅ Chờ đủ thời gian sau requestTemperatures()?

---

## 🎓 Phần 5: Tóm tắt

1. **1-Wire**: 1 dây data, nhiều thiết bị trên 1 bus
2. **DS18B20**: Cảm biến nhiệt độ chính xác ±0.5°C
3. **Pull-up**: Bắt buộc điện trở 4.7kΩ từ DQ lên VCC
4. **ROM Address**: Mỗi sensor có mã 64-bit duy nhất
5. **requestTemperatures()**: Yêu cầu đọc, chờ 750ms

---

## 📋 Phần 6: Quiz (5 câu)

### Câu 1:
1-Wire cần bao nhiêu dây data?
<details><summary>Đáp án</summary>**1 dây** (DQ). Cộng thêm GND và VCC nếu không dùng parasite power.</details>

### Câu 2:
Điện trở pull-up cho DS18B20 là bao nhiêu?
<details><summary>Đáp án</summary>**4.7kΩ** từ DQ lên VCC.</details>

### Câu 3:
Nếu DS18B20 trả về -127°C, nghĩa là gì?
<details><summary>Đáp án</summary>**Lỗi kết nối** - sensor không được nhận diện.</details>

### Câu 4:
Thời gian đo ở độ phân giải 12-bit là?
<details><summary>Đáp án</summary>**~750ms**</details>

### Câu 5:
Lệnh nào yêu cầu tất cả sensor đọc nhiệt độ?
<details><summary>Đáp án</summary>`sensors.requestTemperatures();`</details>

---

## 🔬 Phần 6: Labs + Rubric

### Lab 10-1: Đọc nhiệt độ
**Rubric**: Đọc đúng (40%), Serial output (30%), xử lý lỗi (20%), code (10%)

### Lab 10-2: Cảnh báo 3 mức
**Rubric**: 3 mức LED (40%), ngưỡng đúng (30%), Serial log (20%), code (10%)

### Lab 10-3: Multi-sensor
**Rubric**: Đọc nhiều sensor (40%), hiện địa chỉ (30%), format output (20%), code (10%)

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

> **Tuần tiếp theo**: Tuần 11 - WiFi WebServer
