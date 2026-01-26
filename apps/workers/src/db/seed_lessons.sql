-- Lessons Seed
INSERT OR REPLACE INTO lessons (id, week_id, order_index, title, content, is_published) VALUES ('l-00-01', 'week-00', 1, 'Lý thuyết & Bài học', '> **Thời lượng**: 2 tiết lý thuyết + 1 tiết thực hành  
> **Mục tiêu**: Hiểu kiến thức điện tử cơ bản trước khi bắt đầu lập trình Arduino

---

![Banner Nhập Môn](https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=1200&q=80)

---

## 🎯 Mục tiêu học tập

Sau khi hoàn thành tuần này, bạn sẽ:

1. ✅ Hiểu định luật Ohm và mối quan hệ V-I-R
2. ✅ Nhận biết các linh kiện: Điện trở, LED, Tụ điện
3. ✅ **Đọc giá trị điện trở bằng vạch màu thành thạo**
4. ✅ Sử dụng Breadboard để lắp mạch thử nghiệm
5. ✅ Tính toán điện trở hạn dòng cho LED

---

## 📚 Phần 1: Điện tử cơ bản & Định luật Ohm

### 1.1 Ba đại lượng cơ bản

Điện tử có thể hiểu đơn giản như nước chảy trong ống:

| Đại lượng | Ký hiệu | Đơn vị | So sánh với nước |
|-----------|---------|--------|------------------|
| **Hiệu điện thế** | V | Volt (V) | Áp suất nước - đẩy nước chảy |
| **Dòng điện** | I | Ampe (A) | Lưu lượng nước chảy qua ống |
| **Điện trở** | R | Ohm (Ω) | Kích thước ống - cản trở dòng chảy |

![Minh họa V-I-R như nước](https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Ohm%27s_law_triangle.svg/300px-Ohm%27s_law_triangle.svg.png)

### 1.2 Định luật Ohm - Công thức quan trọng nhất

**Công thức thần thánh:**

$$V = I \times R$$

Từ công thức này, ta có thể suy ra:
- **Tìm dòng điện**: $I = \frac{V}{R}$
- **Tìm điện trở**: $R = \frac{V}{I}$

> **💡 Mẹo nhớ**: Dùng **tam giác VIR** - che đại lượng cần tìm, còn lại là công thức!

### 1.3 Ví dụ thực tế

**Bài toán:** Bạn có nguồn 5V và muốn thắp sáng 1 đèn LED đỏ (cần 2V, 20mA). Cần điện trở bao nhiêu?

**Giải:**
```
Bước 1: Tính điện áp rơi trên điện trở
V_R = V_nguồn - V_LED = 5V - 2V = 3V

Bước 2: Áp dụng định luật Ohm
R = V_R / I = 3V / 0.02A = 150Ω

→ Dùng điện trở 150Ω hoặc 220Ω (an toàn hơn)
```

---

## 📚 Phần 2: Điện trở & Cách đọc vạch màu

### 2.1 Điện trở là gì?

**Điện trở (Resistor)** là linh kiện điện tử thụ động dùng để:
- 🔋 Hạn chế dòng điện trong mạch
- ⚡ Chia điện áp
- 🔥 Bảo vệ linh kiện khỏi quá tải

![Điện trở thực tế](https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Resistors.jpg/320px-Resistors.jpg)

### 2.2 Bảng màu điện trở - Cực kỳ quan trọng!

Điện trở sử dụng **vạch màu** để biểu thị giá trị. Mỗi màu tương ứng với một số:

| Màu | Số | Màu | Số |
|-----|----|----|-----|
| ⬛ **Đen (Black)** | 0 | 🟢 **Xanh lá (Green)** | 5 |
| 🟤 **Nâu (Brown)** | 1 | 🔵 **Xanh dương (Blue)** | 6 |
| 🔴 **Đỏ (Red)** | 2 | 🟣 **Tím (Violet)** | 7 |
| 🟠 **Cam (Orange)** | 3 | ⚫ **Xám (Gray)** | 8 |
| 🟡 **Vàng (Yellow)** | 4 | ⬜ **Trắng (White)** | 9 |

### 2.3 Câu thần chú ghi nhớ màu

> **"Bà Nâu Đi Ra Cầu Vàng Xem Xanh Tím Xám Trắng"**

Hoặc tiếng Anh:
> **"Bad Boys Ravish Our Young Girls But Violet Gives Willingly"**

### 2.4 Cách đọc điện trở 4 vạch màu

Điện trở 4 vạch là loại phổ biến nhất:

```
┌────────────────────────────────────────┐
│  [Vạch 1] [Vạch 2] [Vạch 3] [Vạch 4]   │
│   Số 1     Số 2    Hệ số    Sai số    │
└────────────────────────────────────────┘
```

| Vạch | Ý nghĩa | Cách tính |
|------|---------|-----------|
| **Vạch 1** | Chữ số thứ nhất | Số đầu tiên |
| **Vạch 2** | Chữ số thứ hai | Số thứ hai |
| **Vạch 3** | Hệ số nhân (10^n) | Số lượng số 0 thêm vào |
| **Vạch 4** | Sai số | Vàng kim ±5%, Bạc ±10% |

### 2.5 Ví dụ đọc điện trở

**Ví dụ 1: Nâu - Đen - Đỏ - Vàng kim**
```
Vạch 1 (Nâu)  = 1
Vạch 2 (Đen)  = 0
Vạch 3 (Đỏ)  = x100 (thêm 2 số 0)
Vạch 4 (Vàng kim) = ±5%

→ Giá trị: 10 x 100 = 1000Ω = 1kΩ ± 5%
```

**Ví dụ 2: Đỏ - Đỏ - Nâu - Vàng kim**
```
Vạch 1 (Đỏ)  = 2
Vạch 2 (Đỏ)  = 2
Vạch 3 (Nâu) = x10 (thêm 1 số 0)
Vạch 4 (Vàng kim) = ±5%

→ Giá trị: 22 x 10 = 220Ω ± 5%
```

**Ví dụ 3: Cam - Cam - Cam - Vàng kim**
```
Vạch 1 (Cam) = 3
Vạch 2 (Cam) = 3
Vạch 3 (Cam) = x1000 (thêm 3 số 0)

→ Giá trị: 33 x 1000 = 33000Ω = 33kΩ
```

### 2.6 Bảng tra nhanh điện trở thông dụng

| Vạch màu | Giá trị | Dùng cho |
|----------|---------|----------|
| Nâu-Đen-Nâu | 100Ω | LED siêu sáng |
| Đỏ-Đỏ-Nâu | 220Ω | LED thông thường |
| Cam-Cam-Nâu | 330Ω | LED an toàn |
| Nâu-Đen-Đỏ | 1kΩ | Điện trở kéo (pull-up) |
| Nâu-Đen-Cam | 10kΩ | Cảm biến, phân áp |

---

## 📚 Phần 3: LED - Diode phát quang

### 3.1 LED là gì?

**LED (Light Emitting Diode)** là diode phát sáng khi có dòng điện chạy qua.

![Cấu tạo LED](https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/LED_circuit_elements.svg/320px-LED_circuit_elements.svg.png)

### Sơ đồ mạch LED cơ bản (Mermaid)

```mermaid
graph LR
    P[Nguồn 5V] -->|Dòng điện| R[Điện Trở R]
    R -->|Hạn dòng| L[LED Anode +]
    L -->|Phát sáng| G[GND -]
    style P fill:#ff9999,stroke:#333,stroke-width:2px
    style R fill:#ffcc99,stroke:#333
    style L fill:#99ff99,stroke:#333
    style G fill:#99ccff,stroke:#333
```

### 3.2 Đặc điểm quan trọng của LED

| Đặc điểm | Mô tả |
|----------|-------|
| **Phân cực** | Chỉ dẫn điện MỘT CHIỀU |
| **Chân dài (+)** | Anode - nối với nguồn dương |
| **Chân ngắn (-)** | Cathode - nối với GND |
| **Điện áp thuận** | 1.8V-3.3V tùy màu |
| **Dòng điện** | 10mA-20mA |

### 3.3 Điện áp LED theo màu

| Màu LED | Điện áp (V) | Bước sóng (nm) |
|---------|-------------|----------------|
| 🔴 Đỏ | 1.8 - 2.2V | 620-750 |
| 🟠 Cam | 2.0 - 2.2V | 590-620 |
| 🟡 Vàng | 2.0 - 2.2V | 570-590 |
| 🟢 Xanh lá | 2.0 - 3.0V | 495-570 |
| 🔵 Xanh dương | 3.0 - 3.5V | 450-495 |
| ⚪ Trắng | 3.0 - 3.5V | - |

> ⚠️ **CẢNH BÁO**: LED LUÔN CẦN ĐIỆN TRỞ HẠN DÒNG! Không có điện trở → LED cháy!

---

## 📚 Phần 4: Breadboard - Bảng mạch thử nghiệm

### 4.1 Breadboard là gì?

**Breadboard** là bảng mạch cho phép lắp ráp mạch điện mà không cần hàn.

![Cấu tạo Breadboard](https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Breadboard_scheme.svg/400px-Breadboard_scheme.svg.png)

### 4.2 Cấu trúc Breadboard

```
┌─────────────────────────────────────────┐
│  + + + + + + + + + + + + + + + + + + +  │ ← Thanh nguồn (+)
│  - - - - - - - - - - - - - - - - - - -  │ ← Thanh GND (-)
├─────────────────────────────────────────┤
│  a b c d e     f g h i j                │
│  ═ ═ ═ ═ ═     ═ ═ ═ ═ ═  ← Hàng 1     │
│  ═ ═ ═ ═ ═     ═ ═ ═ ═ ═  ← Hàng 2     │
│  ...                                    │
│  ═ ═ ═ ═ ═     ═ ═ ═ ═ ═  ← Hàng 30    │
├─────────────────────────────────────────┤
│  + + + + + + + + + + + + + + + + + + +  │
│  - - - - - - - - - - - - - - - - - - -  │
└─────────────────────────────────────────┘
```

### 4.3 Quy tắc nối dây

| Vùng | Cách nối | Dùng cho |
|------|----------|----------|
| **Thanh dọc (+/-)** | Nối theo chiều DỌC | Cấp nguồn, GND |
| **Hàng ngang (a-e, f-j)** | Nối theo chiều NGANG | Cắm linh kiện |
| **Rãnh giữa** | KHÔNG nối | Chia đôi board |

---', 1);
INSERT OR REPLACE INTO lessons (id, week_id, order_index, title, content, is_published) VALUES ('l-01-01', 'week-01', 1, 'Lý thuyết & Bài học', '> [!IMPORTANT]
> **Thời lượng**: 3 tiết lý thuyết + 2 tiết thực hành  
> **Mục tiêu**: Làm quen Arduino Uno/ESP32, hiểu cấu trúc chương trình, điều khiển LED cơ bản

---

## 🎯 Mục tiêu học tập

Sau khi hoàn thành tuần này, bạn sẽ:

1. ✅ Hiểu Arduino Uno là gì và vai trò trong hệ thống nhúng
2. ✅ Nắm vững cấu trúc chương trình Arduino: `setup()` và `loop()`
3. ✅ Sử dụng thành thạo `pinMode()`, `digitalWrite()`, `delay()`
4. ✅ Điều khiển LED đơn và nhiều LED theo quy luật thời gian
5. ✅ Viết code sạch với mảng, vòng lặp, và tách hàm

---

## 📚 Phần 1: Lý thuyết dân dã (Dễ hiểu nhất)

### 1.1 Hệ thống nhúng là gì? (Tưởng tượng cái máy giặt)

Hãy nhìn cái **máy giặt** hay cái **nồi cơm điện** nhà bạn.
- Chúng có "bộ não" không? **Có**, vì chúng biết đếm giờ, biết khi nào nước đầy thì dừng, biết nấu xong thì tít tít.
- Chúng có lướt Facebook hay chơi game được không? **Không**.

👉 **Hệ thống nhúng** chính là những "bộ não" nhỏ bé đó. Chúng chỉ sinh ra để làm **một việc duy nhất** (như giặt đồ, nấu cơm) nhưng làm cực tốt và bền bỉ.

> **Khác với Laptop**: Laptop là "đa năng" (làm gì cũng được). Hệ thống nhúng là "chuyên biệt" (chỉ làm 1 việc).

### 1.2 Arduino Uno là gì?

Thực ra con chip (vi điều khiển) rất khó dùng. Người ta tạo ra cái bo mạch **Arduino Uno** để giúp những người mới học (như bạn) có thể "giao tiếp" với con chip đó dễ dàng hơn.

- **Con chip ATmega328P**: Là "bộ não".
- **Các chân cắm (Hàng lỗ đen đen)**: Là "tay chân". Bạn cắm đèn vào đó, bộ não sẽ điều khiển đèn. Bạn cắm nút bấm vào đó, bộ não sẽ cảm nhận được nút bấm.

### 1.3 Cấu trúc Code: "Ông đầu bếp" và "Công việc hàng ngày"

Code Arduino luôn có 2 phần chính. Hãy tưởng tượng bạn mở một quán phở:

1.  **`void setup()` - Khâu chuẩn bị (Chỉ làm 1 lần lúc mở cửa)**
    - Bạn lau bàn, xếp ghế, bật bếp.
    - Trong code cũng vậy: Bạn bảo Arduino "Chân này nối đèn nhé", "Chân kia nối nút bấm nhé".
    - Nó chỉ chạy **đúng 1 lần** khi bạn cấp điện.

2.  **`void loop()` - Phục vụ khách (Lặp đi lặp lại mãi mãi)**
    - Có khách -> Làm phở -> Bưng ra -> Thu tiền. Rồi lại có khách...
    - Trong code: Kiểm tra nút bấm -> Bật đèn -> Tắt đèn... Cứ thế lặp lại siêu nhanh (hàng nghìn lần mỗi giây) cho đến khi... mất điện.

### 1.4 GPIO (Tay chân của Arduino)

Tên tiếng Anh nghe kêu (Global Purpose Input/Output) nhưng thực ra nó chỉ là các cái **Cổng (Pin)**:
- **OUTPUT (Xuất ra)**: Arduino ra lệnh.
    - *Ví dụ*: Bật đèn, còi kêu, động cơ quay. (Arduino là sếp, thiết bị phải nghe).
- **INPUT (Nhập vào)**: Arduino lắng nghe.
    - *Ví dụ*: Đọc nút bấm, đọc cảm biến nhiệt độ. (Thiết bị báo cáo, Arduino nghe).

### 1.5 Tại sao LED cần điện trở? (Nguyên lý Ống nước)

Hãy tưởng tượng dòng điện như **nước chảy trong ống**:
- **Pin 5V**: Là cái máy bơm cực mạnh.
- **Đèn LED**: Là cái cánh quạt giấy mỏng manh.

Nếu bạn nối thẳng máy bơm vào cánh quạt -> **RÁCH (Cháy LED)**.
👉 Bạn cần bóp ống nước lại một chút để nước chảy từ từ thôi. Cái chỗ "bóp ống" đó chính là **Điện trở**.

> **Quy tắc sống còn**: Luôn nối tiếp LED với điện trở 220Ω (đỏ-đỏ-nâu) hoặc 330Ω (cam-cam-nâu).

### 1.6 `delay()` - Đi ngủ đông

Lệnh `delay(1000)` nghĩa là: "Này Arduino, hãy ngủ 1000 mili-giây (1 giây) đi, đừng làm gì cả".
- **Ưu điểm**: Dễ dùng. Muốn nháy đèn thì cứ Bật -> Ngủ -> Tắt -> Ngủ.
- **Nhược điểm**: Lúc nó đang ngủ, nếu có trộm vào nhà (bạn nhấn nút), nó sẽ **không biết gì cả**. (Tuần sau ta sẽ học cách "vừa canh nhà vừa nghỉ ngơi" sau).

### 1.1 Hệ thống nhúng là gì?

**Hệ thống nhúng (Embedded System)** là một hệ thống máy tính được thiết kế để thực hiện một hoặc một vài chức năng chuyên biệt, thường nằm bên trong một thiết bị lớn hơn.

#### Ví dụ thực tế:
- 🚗 **Ô tô**: Hệ thống ABS, túi khí, điều hòa tự động
- 🏠 **Nhà thông minh**: Đèn cảm biến, khóa cửa vân tay
- 📱 **Điện thoại**: Cảm biến vân tay, gyroscope
- 🎮 **Game console**: Điều khiển tay cầm, xử lý đồ họa

#### Đặc điểm của hệ thống nhúng:
| Đặc điểm | Mô tả |
|----------|-------|
| **Chuyên biệt** | Làm một việc và làm tốt |
| **Thời gian thực** | Phản hồi nhanh, đúng deadline |
| **Tài nguyên hạn chế** | RAM ít, CPU chậm hơn PC |
| **Tiêu thụ điện thấp** | Chạy pin, tiết kiệm năng lượng |

### 1.2 Arduino Uno - Board học tập lý tưởng

**Arduino Uno** là board vi điều khiển phổ biến nhất cho người mới (chip ATmega328P, 5V).
**ESP32** là dòng chip mạnh mẽ hơn, tích hợp WiFi/Bluetooth (chip 32-bit, 3.3V).

> [!CAUTION]
> **Lưu ý Quan trọng về Điện áp**:
> - **Arduino Uno**: Logic **5V**.
> - **ESP32**: Logic **3.3V**. Cấp 5V vào chân GPIO của ESP32 có thể làm cháy chip!

#### Thông số kỹ thuật:
| Thông số | Giá trị |
|----------|---------|
| **Vi xử lý** | ATmega328P |
| **Điện áp hoạt động** | 5V |
| **Tần số xung nhịp** | 16 MHz |
| **Flash Memory** | 32 KB (chứa chương trình) |
| **SRAM** | 2 KB (biến runtime) |
| **EEPROM** | 1 KB (lưu dữ liệu khi tắt nguồn) |
| **Digital I/O Pins** | 14 (6 có PWM) |
| **Analog Input Pins** | 6 |

#### Sơ đồ chân Arduino Uno:
```
                    +-----[USB]-----+
                    |               |
              RESET |[ ]   [ ][ ][ ]| D13 (LED_BUILTIN)
               3.3V |[ ]   [ ][ ][ ]| D12 
                 5V |[ ]   [ ][ ][ ]| D11 (PWM)
                GND |[ ]   [ ][ ][ ]| D10 (PWM)
                GND |[ ]   [ ][ ][ ]| D9  (PWM)
                Vin |[ ]   [ ][ ][ ]| D8
                    |               |
                 A0 |[ ]       [ ][ ]| D7
                 A1 |[ ]       [ ][ ]| D6  (PWM)
                 A2 |[ ]       [ ][ ]| D5  (PWM)
                 A3 |[ ]       [ ][ ]| D4
            SDA/A4  |[ ]       [ ][ ]| D3  (PWM)
            SCL/A5  |[ ]       [ ][ ]| D2
                    |               |
                    +---------------+
```

### 1.3 Cấu trúc chương trình Arduino

Mọi chương trình Arduino đều có **hai hàm bắt buộc**:

```cpp
void setup() {
    // Chạy MỘT LẦN DUY NHẤT khi khởi động
    // Dùng để: cấu hình pin, khởi tạo Serial, thiết lập ban đầu
}

void loop() {
    // Chạy LẶP LẠI VÔ HẠN sau khi setup() hoàn tất
    // Dùng để: logic chính của chương trình
}
```

#### Luồng thực thi:

```mermaid
flowchart TD
    start(["Cấp nguồn / Reset"]) --> setup["Chạy setup<br/>(1 lần duy nhất)"]
    setup --> loop{"Vòng lặp loop"}
    loop -->|Lần 1| logic["Thực thi Code chính"]
    logic -->|Lặp lại| loop
```

### 1.4 GPIO - General Purpose Input/Output

**GPIO** là các chân đa năng, có thể cấu hình làm **INPUT** (đọc tín hiệu) hoặc **OUTPUT** (xuất tín hiệu).

#### Các hàm GPIO cơ bản:

```cpp
// 1. Cấu hình chế độ chân
pinMode(pin, mode);
// - pin: số chân (2-13 hoặc A0-A5)
// - mode: INPUT, OUTPUT, hoặc INPUT_PULLUP

// 2. Xuất tín hiệu số
digitalWrite(pin, value);
// - value: HIGH (5V) hoặc LOW (0V)

// 3. Đọc tín hiệu số
int state = digitalRead(pin);
// - state: HIGH hoặc LOW
```

### 1.5 LED và điện trở hạn dòng

#### Tại sao LED cần điện trở?

LED (Light Emitting Diode) có đặc tính: khi có điện áp thuận, dòng điện tăng **rất nhanh** và có thể làm cháy LED nếu không giới hạn.

**Công thức tính điện trở hạn dòng:**
```
R = (Vnguồn - Vled) / Iled

Với Arduino 5V và LED đỏ (Vled ≈ 2V, Iled = 20mA):
R = (5V - 2V) / 0.02A = 150Ω

→ Thường dùng 220Ω hoặc 330Ω để an toàn
```

#### Sơ đồ kết nối LED cơ bản:
```
Arduino Pin D2 ──[220Ω]──┐
                         │
                       (+)LED(-)
                         │
                        GND
```

### 1.6 Hàm delay() và nhược điểm

```cpp
delay(ms);  // Tạm dừng chương trình trong ms mili-giây
```

**Ưu điểm**: Đơn giản, dễ dùng  
**Nhược điểm**: 
- ⚠️ **Blocking** - CPU không làm gì khác trong lúc chờ
- ⚠️ Không phản hồi được nút nhấn, cảm biến trong lúc delay
- ⚠️ Tuần sau sẽ học cách tốt hơn với `millis()`

---

## 🧱 Phần 2: Bài tập khởi động (Warm-up)

Trước khi làm các bài phức tạp, hãy làm các bài nhỏ này để hiểu cơ bản.

### 2.1 Drill 1: Bật LED sáng mãi mãi (Hello LED)
**Mục tiêu**: Kiểm tra mạch và lệnh `digitalWrite`.

```cpp
void setup() {
    pinMode(13, OUTPUT);     // Cấu hình chân 13 là OUTPUT
    digitalWrite(13, HIGH);  // Bật LED (cấp điện 5V)
}

void loop() {
    // Không làm gì cả, LED vẫn sáng vì đã bật ở setup
}
```
**Thử thách**: Sửa `HIGH` thành `LOW` để tắt LED.

### 2.2 Drill 2: Nháy LED chậm (Manual Blink)
**Mục tiêu**: Hiểu luồng chạy của `loop()`.

```cpp
void setup() {
    pinMode(13, OUTPUT);
}

void loop() {
    digitalWrite(13, HIGH);  // Bật
    delay(2000);             // Chờ 2 giây
    digitalWrite(13, LOW);   // Tắt
    delay(2000);             // Chờ 2 giây
    // Hết loop, nó sẽ quay lại dòng đầu của loop -> Lặp vô hạn
}
```
**Thử thách**: Sửa code để LED bật 0.1 giây (nháy siêu nhanh) và tắt 1 giây.

### 2.3 Drill 3: Sử dụng biến (Variable)
**Mục tiêu**: Hiểu tại sao cần biến.

```cpp
int timeOn = 1000;   // Biến lưu thời gian bật
int timeOff = 500;   // Biến lưu thời gian tắt

void setup() {
    pinMode(13, OUTPUT);
}

void loop() {
    digitalWrite(13, HIGH);
    delay(timeOn);          // Dùng giá trị của biến timeOn
    digitalWrite(13, LOW);
    delay(timeOff);         // Dùng giá trị của biến timeOff
}
```
**Thử thách**: Sửa `timeOn` thành 5000 (5 giây) ở dòng khai báo biến.

---

## 💻 Phần 3: Code mẫu nâng cao

### 2.1 Blink LED cơ bản (Hello World của Arduino)

```cpp
/*
 * Bài 1: Blink LED - Chương trình đầu tiên
 * LED nháy 1 giây bật, 1 giây tắt
 * 
 * Phần cứng:
 * - LED đỏ nối từ D13 qua điện trở 220Ω xuống GND
 * - Hoặc dùng LED_BUILTIN (LED trên board)
 */

const int LED_PIN = 13;  // Chân kết nối LED

void setup() {
    pinMode(LED_PIN, OUTPUT);  // Cấu hình chân làm OUTPUT
}

void loop() {
    digitalWrite(LED_PIN, HIGH);  // Bật LED (5V)
    delay(1000);                   // Chờ 1 giây (1000ms)
    
    digitalWrite(LED_PIN, LOW);   // Tắt LED (0V)
    delay(1000);                   // Chờ 1 giây
}
```

### 2.2 Hàm blinkN() - Nháy LED theo số lần

```cpp
/*
 * Bài 1-1: Điều khiển LED theo quy luật thời gian
 * 
 * Yêu cầu:
 * 1) Bật 1s, tắt 1s, lặp 5 lần
 * 2) Bật 3s, tắt 0.5s, lặp 5 lần  
 * 3) Bật 0.5s, tắt 3s, lặp 5 lần
 */

const int LED_PIN = 2;  // LED nối vào chân D2

// Hàm nháy LED n lần với thời gian bật và tắt tùy chỉnh
void blinkN(int tOnMs, int tOffMs, int n) {
    for (int i = 0; i < n; i++) {
        digitalWrite(LED_PIN, HIGH);
        delay(tOnMs);
        
        digitalWrite(LED_PIN, LOW);
        delay(tOffMs);
    }
}

void setup() {
    pinMode(LED_PIN, OUTPUT);
    Serial.begin(9600);  // Bật Serial để theo dõi
    
    Serial.println("=== Bắt đầu chương trình ===");
}

void loop() {
    // Quy luật 1: Bật 1s, tắt 1s, lặp 5 lần
    Serial.println("Quy luật 1: 1s ON / 1s OFF x 5");
    blinkN(1000, 1000, 5);
    delay(2000);  // Nghỉ 2s giữa các quy luật
    
    // Quy luật 2: Bật 3s, tắt 0.5s, lặp 5 lần
    Serial.println("Quy luật 2: 3s ON / 0.5s OFF x 5");
    blinkN(3000, 500, 5);
    delay(2000);
    
    // Quy luật 3: Bật 0.5s, tắt 3s, lặp 5 lần
    Serial.println("Quy luật 3: 0.5s ON / 3s OFF x 5");
    blinkN(500, 3000, 5);
    delay(2000);
    
    Serial.println("=== Lặp lại từ đầu ===\n");
}
```

### 2.3 Điều khiển 5 LED tuần tự

```cpp
/*
 * Bài 1-2: Điều khiển 5 LED (D2–D6) theo quy tắc
 * 
 * Yêu cầu:
 * - Bật tuần tự LED1→LED5, cách 1s giữa các LED
 * - Giữ tất cả LED sáng 5s
 * - Tắt tuần tự LED5→LED1, cách 1s
 */

// Sử dụng mảng để quản lý nhiều LED
const int LED_PINS[] = {2, 3, 4, 5, 6};
const int NUM_LEDS = 5;

void setup() {
    Serial.begin(9600);
    
    // Cấu hình tất cả LED pins làm OUTPUT
    for (int i = 0; i < NUM_LEDS; i++) {
        pinMode(LED_PINS[i], OUTPUT);
        digitalWrite(LED_PINS[i], LOW);  // Tắt hết ban đầu
    }
    
    Serial.println("=== 5 LED Sequential Control ===");
}

void loop() {
    // Phase 1: Bật tuần tự từ LED1 → LED5
    Serial.println("Phase 1: Bật tuần tự →");
    for (int i = 0; i < NUM_LEDS; i++) {
        digitalWrite(LED_PINS[i], HIGH);
        Serial.print("LED ");
        Serial.print(i + 1);
        Serial.println(" ON");
        delay(1000);
    }
    
    // Phase 2: Giữ tất cả sáng 5 giây
    Serial.println("Phase 2: Giữ sáng 5s...");
    delay(5000);
    
    // Phase 3: Tắt tuần tự từ LED5 → LED1
    Serial.println("Phase 3: Tắt tuần tự ←");
    for (int i = NUM_LEDS - 1; i >= 0; i--) {
        digitalWrite(LED_PINS[i], LOW);
        Serial.print("LED ");
        Serial.print(i + 1);
        Serial.println(" OFF");
        delay(1000);
    }
    
    Serial.println("=== Hoàn thành 1 chu kỳ ===\n");
    delay(2000);  // Nghỉ trước khi lặp lại
}
```

### 2.4 Hiệu ứng LED đuổi (Knight Rider / Running LEDs)

```cpp
/*
 * Bài 1-3: Điều khiển 5 LED "duy nhất một LED sáng"
 * 
 * Yêu cầu:
 * - Duy nhất 1 LED sáng chạy 1→5, trễ 1s
 * - Duy nhất 1 LED sáng chạy 5→1, trễ 0.5s
 */

const int LED_PINS[] = {2, 3, 4, 5, 6};
const int NUM_LEDS = 5;

// Hàm tắt tất cả LED
void allOff() {
    for (int i = 0; i < NUM_LEDS; i++) {
        digitalWrite(LED_PINS[i], LOW);
    }
}

// Hàm bật duy nhất 1 LED tại vị trí index
void onlyOne(int index) {
    allOff();
    digitalWrite(LED_PINS[index], HIGH);
}

void setup() {
    Serial.begin(9600);
    
    for (int i = 0; i < NUM_LEDS; i++) {
        pinMode(LED_PINS[i], OUTPUT);
    }
    allOff();
    
    Serial.println("=== Knight Rider Effect ===");
}

void loop() {
    // Chạy từ trái sang phải (LED1 → LED5), delay 1s
    Serial.println("→ Forward (1s delay)");
    for (int i = 0; i < NUM_LEDS; i++) {
        onlyOne(i);
        delay(1000);
    }
    
    // Chạy từ phải sang trái (LED5 → LED1), delay 0.5s
    Serial.println("← Backward (0.5s delay)");
    for (int i = NUM_LEDS - 1; i >= 0; i--) {
        onlyOne(i);
        delay(500);
    }
}
```

---

## ⚠️ Phần 4: Lỗi thường gặp & Cách khắc phục

### 3.1 LED không sáng

| Nguyên nhân | Cách kiểm tra | Cách sửa |
|-------------|---------------|----------|
| LED ngược chiều | Đổi chiều chân LED | Chân dài (+) vào pin, chân ngắn (-) vào GND |
| Quên điện trở | LED cháy hoặc quá tối | Thêm điện trở 220Ω |
| Sai số chân | `pinMode` không đúng pin | Kiểm tra lại số chân trong code |
| Thiếu GND chung | Mạch hở | Nối GND của breadboard vào GND Arduino |

### 3.2 LED sáng nhưng không nháy

- **Nguyên nhân**: Quên gọi `pinMode()` trong `setup()`
- **Cách sửa**: Thêm `pinMode(LED_PIN, OUTPUT);`

### 3.3 Chương trình không upload được

| Lỗi | Nguyên nhân | Cách sửa |
|-----|-------------|----------|
| "Port not found" | Chưa cắm cable / driver lỗi | Cài driver CH340 hoặc CP2102 |
| "avrdude: stk500_recv" | Sai board/port | Tools → Board: Arduino Uno |
| "Compilation error" | Lỗi cú pháp | Đọc kỹ thông báo lỗi |

### 3.4 Checklist debug nhanh

1. ✅ Cáp USB có truyền **dữ liệu** (không phải cáp sạc)?
2. ✅ Chọn đúng **Board**: Arduino Uno?
3. ✅ Chọn đúng **Port**: COM3, COM4...?
4. ✅ LED có **điện trở** 220Ω-330Ω?
5. ✅ Các GND đã **nối chung**?
6. ✅ Code có lỗi **typo** (viết sai tên hàm)?

---

## 🎓 Phần 5: Tóm tắt kiến thức

### Key Points:

1. **Arduino Uno** là board vi điều khiển ATmega328P, hoạt động ở 5V/16MHz
2. Mọi chương trình có 2 hàm: `setup()` (chạy 1 lần) và `loop()` (lặp vô hạn)
3. **GPIO**: `pinMode(pin, OUTPUT)` → `digitalWrite(pin, HIGH/LOW)`
4. LED cần **điện trở hạn dòng** 220Ω để không cháy
5. `delay(ms)` tạm dừng chương trình nhưng **blocking** (CPU không làm gì khác)
6. Dùng **mảng + vòng lặp** để quản lý nhiều LED hiệu quả
7. **Tách hàm** giúp code gọn, dễ đọc, tái sử dụng

### Công thức cần nhớ:

```
R = (Vnguồn - Vled) / Iled
```

### Thuật ngữ quan trọng:

| Thuật ngữ | Ý nghĩa |
|-----------|---------|
| GPIO | Chân vào/ra đa năng |
| MCU | Vi điều khiển (Microcontroller Unit) |
| Blocking | CPU không làm gì trong lúc chờ |
| HIGH/LOW | Mức logic 5V / 0V |
| OUTPUT/INPUT | Chế độ xuất / nhập tín hiệu |

---', 1);
INSERT OR REPLACE INTO lessons (id, week_id, order_index, title, content, is_published) VALUES ('l-02-01', 'week-02', 1, 'Lý thuyết & Bài học', '> **Thời lượng**: 3 tiết lý thuyết + 2 tiết thực hành  
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

## 📚 Phần 1: Lý thuyết dân dã (Dễ hiểu nhất)

### 1.1 Thiết kế hệ thống: "Xây nhà" vs "Xếp hình Lego"

Khi làm dự án, người ta có 2 cách tư duy:

1.  **Top-Down (Xây nhà)**: 
    - Có bản vẽ kiến trúc sư trước (Tổng thể).
    - Móng, Cột, Tường, Mái (Chi tiết).
    - **Áp dụng**: Khi làm đồ án môn học lớn. "Mình cần làm hệ thống tưới cây -> Cần bơm, cảm biến -> Mua bơm loại nào..."

2.  **Bottom-Up (Xếp hình Lego)**:
    - Có cục gạch nào xếp cục đó (Từ nhỏ đến lớn).
    - Lấy module LED ra vọc thử -> Lấy nút bấm ra vọc thử -> Ghép 2 cái lại thành cái đèn pin.
    - **Áp dụng**: Khi học môn này. Ta cứ làm từng bài nhỏ (LED, Nút, Sensor) rành rọt, rồi sau này ghép lại.

### 1.2 LED 7 đoạn: "8 bóng đèn trong một cái hộp"

Đừng sợ cái tên "7 đoạn". Thực chất nó chỉ là **8 cái đèn LED bình thường** được đóng gói chung vào 1 cái vỏ nhựa.
- 7 thanh sáng hình số 8 (a, b, c, d, e, f, g).
- 1 cái dấu chấm (dp).

**Vấn đề**: 8 đèn thì phải có 16 chân (8 dương, 8 âm)? Quá nhiều chân!
**Giải pháp**: Nối chung lại.
- **Common Cathode (GND chung)**: Tất cả chân Âm (-) nối chung. Muốn đèn nào sáng thì **cấp Dương (+)** (HIGH) vào chân đó. (Dễ hiểu, phổ biến nhất).
- **Common Anode (VCC chung)**: Tất cả chân Dương (+) nối chung. Muốn đèn nào sáng thì **nối Âm (-)** (LOW) vào chân đó. (Hơi ngược não).

### 1.3 Multiplexing (Quét LED) - Ảo thuật thị giác

Nếu bạn có 4 con số (4 LED 7 đoạn), bạn cần 4 x 8 = 32 chân Arduino? **Không ai làm thế cả**.
Chúng ta dùng kỹ thuật **"Quét" (Multiplexing)**.

**Tưởng tượng**: Bạn có 4 bức tranh nhưng chỉ có 1 cái khung ảnh.
1. Bạn bỏ tranh 1 vào -> Khán giả thấy tranh 1.
2. Bạn rút ra bỏ tranh 2 vào -> Khán giả thấy tranh 2.
3. Nếu bạn thay tranh cực nhanh (50 lần/giây) -> Mắt khán giả sẽ thấy **cả 4 tranh hiện lên cùng lúc**.

**Áp dụng vào LED**:
- Thời điểm 1: Bật số hàng nghìn lên, tắt 3 số kia.
- Thời điểm 2: Bật số hàng trăm lên, tắt 3 số kia.
- ...
Làm siêu nhanh, mắt người sẽ thấy cả 4 số đều sáng. Đây gọi là hiện tượng **lưu ảnh của mắt**.

### 1.4 IC 74HC595: "Người phụ tá chia bài"

Arduino của bạn ít chân quá? Cần một "người phụ tá".
**74HC595** chính là người đó (gọi là Shift Register).
- Bạn chỉ cần **3 sợi dây** (3 chân) nói chuyện với nó.
- Nó sẽ điều khiển **8 cái đèn** giúp bạn.

Cách nó làm việc giống như xếp hàng vào lớp:
- **DS (Data)**: Bạn đứng cửa hô "Vào!" hoặc "Đứng lại!".
- **SHCP (Clock)**: Tiếng còi "Tuýt!". Mỗi lần tuýt, một học sinh bước vào hàng.
- **STCP (Latch)**: Tiếng trống "Tùng!". Cả hàng bước đều ra sân (xuất ra LED).

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

## 🧱 Phần 2: Bài tập khởi động (Warm-up)
### 2.1 Drill 1: Sáng 1 thanh LED (Segment A)
**Mục tiêu**: Xác định chân kết nối đúng.

```cpp
void setup() {
    // Giả sử Segment A nối vào D2
    pinMode(2, OUTPUT);
    
    // Nếu là Common Cathode (GND chung) -> HIGH là sáng
    digitalWrite(2, HIGH); 
}

void loop() {}
```
**Thử thách**: Sửa code để sáng thanh B (Pin 3).

### 2.2 Drill 2: Hiển thị số "1"
**Mục tiêu**: Bật cùng lúc 2 segment B và C.

```cpp
void setup() {
    pinMode(3, OUTPUT); // Segment B
    pinMode(4, OUTPUT); // Segment C
    
    digitalWrite(3, HIGH);
    digitalWrite(4, HIGH);
}
void loop() {}
```
**Thử thách**: Thêm code để hiển thị số "7" (A, B, C sáng).

### 2.3 Drill 3: Nhấp nháy số "8"
**Mục tiêu**: Kết hợp Week 1 (blink) và Week 2 (7-seg).

```cpp
void setup() {
    // Khai báo từ D2 đến D8 (a-g)
    for (int i = 2; i <= 8; i++) {
        pinMode(i, OUTPUT);
    }
}

void loop() {
    // Bật hết (số 8)
    for (int i = 2; i <= 8; i++) digitalWrite(i, HIGH);
    delay(1000);
    
    // Tắt hết
    for (int i = 2; i <= 8; i++) digitalWrite(i, LOW);
    delay(1000);
}
```

---

## 💻 Phần 3: Code mẫu nâng cao

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

## ⚠️ Phần 4: Lỗi thường gặp & Cách khắc phục

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

## 🎓 Phần 5: Tóm tắt kiến thức

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

---', 1);
INSERT OR REPLACE INTO lessons (id, week_id, order_index, title, content, is_published) VALUES ('l-03-01', 'week-03', 1, 'Lý thuyết & Bài học', '> **Thời lượng**: 3 tiết lý thuyết + 2 tiết thực hành  
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

## 📚 Phần 1: Lý thuyết dân dã (Dễ hiểu nhất)

### 1.1 Nút nhấn & INPUT_PULLUP (Tại sao ngược đời?)

Bình thường ta nghĩ: Nhấn = 1 (HIGH), Không nhấn = 0 (LOW).
Nhưng trong Arduino, dân chuyên nghiệp hay dùng **INPUT_PULLUP** (Điện trở kéo lên). Nó hoạt động ngược lại:
- **Không nhấn = HIGH (5V)**: Luôn có "lực kéo" lên 5V.
- **Nhấn = LOW (0V)**: Nối thẳng xuống đất (GND).

> **Tưởng tượng**: Bạn cầm chùm bóng bay (tín hiệu).
> - **Chưa ai kéo**: Bóng bay lơ lửng trên cao (**HIGH**).
> - **Có người kéo dây (Nhấn nút)**: Bóng bị kéo tuột xuống đất (**LOW**).

👉 Nhớ câu thần chú: **"Nhấn là THẤP, Nhả là CAO"** (với INPUT_PULLUP).

### 1.2 Dội phím (Bounce): "Quả bóng nảy"

Khi bạn nhấn nút một cái "tách", bạn nghĩ tín hiệu nó đẹp đẽ như này:
`_________|---------` (0 lên 1 dứt khoát)

Thực tế, cái lò xo kim loại bên trong nó **rung bần bật** như quả bóng tennis rơi xuống đất:
`____|-|-|_|----------` (Rung rung vài lần rồi mới yên).

**Hậu quả**: Bạn bấm 1 lần, Arduino tưởng bạn bấm 10 lần! Đèn bật tắt loạn xạ.
**Cách chữa (Debounce)**: "Từ từ đã!". Khi thấy tín hiệu đổi, Arduino chờ khoảng 50ms cho lò xo hết rung rồi mới chốt hạ.

### 1.3 Bắt cạnh (Edge Detection): "Khoảnh khắc" vs "Trạng thái"

- **Trạng thái (State)**: Là việc bạn **đang** ngồi. (Kéo dài lâu).
- **Cạnh (Edge)**: Là khoảnh khắc bạn **bắt đầu** ngồi xuống. (Chỉ 1 tích tắc).

Tại sao quan trọng?
- Nếu muốn **đèn sáng khi giữ nút**: Dùng Trạng thái.
- Nếu muốn **đếm số lần nhấn**: Phải dùng Cạnh (nếu không, 1 lần nhấn dài 1s sẽ bị đếm thành 1000 lần vì vòng lặp chạy quá nhanh).

### 1.4 Keypad 4x4: "Trò chơi tìm tọa độ"

Keypad có 16 nút, nếu nối từng nút thì mất 16 chân Arduino? Hết chỗ!
Người ta xếp nó thành lưới (Ma trận): 4 Hàng (Row) x 4 Cột (Col).
-> Chỉ tốn 4 + 4 = 8 chân.

**Cách Arduino đọc**: Giống trò chơi tàu chiến.
1. Quét Hàng 1: "Có ai ở Hàng 1 bấm không?".
2. Nếu Cột 2 kêu "Có!": Suy ra phím số 2 (Giao điểm H1-C2) đang được nhấn.
3. Quét tiếp Hàng 2, 3, 4...

Quy trình này nhanh đến mức bạn nhấn cái nào nó biết ngay cái đó.

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
    {''1'',''2'',''3'',''A''},
    {''4'',''5'',''6'',''B''},
    {''7'',''8'',''9'',''C''},
    {''*'',''0'',''#'',''D''}
};

byte rowPins[ROWS] = {9, 8, 7, 6};  // Nối với R1-R4
byte colPins[COLS] = {5, 4, 3, 2};  // Nối với C1-C4

Keypad keypad = Keypad(makeKeymap(keys), rowPins, colPins, ROWS, COLS);
```

---

## 🧱 Phần 2: Bài tập khởi động (Warm-up)
### 2.1 Drill 1: Mắt thấy tay sờ (Serial Monitor)
**Mục tiêu**: Xem giá trị thực tế của nút nhấn (0 hoặc 1).

```cpp
void setup() {
    Serial.begin(9600);
    pinMode(2, INPUT_PULLUP);
}

void loop() {
    int sensorVal = digitalRead(2);
    Serial.println(sensorVal);  // In ra 1 (không nhấn) hoặc 0 (nhấn)
    delay(100); // Đọc chậm để dễ nhìn
}
```
**Thử thách**: Nhấn thật nhanh và xem Serial có bắt kịp không.

### 2.2 Drill 2: Đèn PIN (Nhấn giữ = Sáng)
**Mục tiêu**: Logic điều khiển trực tiếp.

```cpp
void setup() {
    pinMode(2, INPUT_PULLUP);
    pinMode(13, OUTPUT);
}

void loop() {
    if (digitalRead(2) == LOW) { // Đang nhấn
        digitalWrite(13, HIGH);
    } else {
        digitalWrite(13, LOW);
    }
}
```

### 2.3 Drill 3: Công tắc (Toggle) - Phiên bản lỗi
**Mục tiêu**: Hiểu tại sao cần debounce (Bài này sẽ chạy "lúc được lúc không").

```cpp
// Thử nạp code này và nhấn nút. Bạn sẽ thấy đèn sáng/tắt không theo ý muốn.
// Đó là do "Dội phím" (Bounce)
int ledState = LOW;

void setup() {
    pinMode(2, INPUT_PULLUP);
    pinMode(13, OUTPUT);
}

void loop() {
    if (digitalRead(2) == LOW) { // Nếu nhấn
        ledState = !ledState;    // Đảo trạng thái
        digitalWrite(13, ledState);
        // Không có delay -> dội phím làm đảo liên tục
    }
}
```

---

## 💻 Phần 3: Code mẫu nâng cao

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
    {''1'',''2'',''3'',''A''},
    {''4'',''5'',''6'',''B''},
    {''7'',''8'',''9'',''C''},
    {''*'',''0'',''#'',''D''}
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
    {''1'',''2'',''3'',''A''},
    {''4'',''5'',''6'',''B''},
    {''7'',''8'',''9'',''C''},
    {''*'',''0'',''#'',''D''}
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
            case ''1'':
                digitalWrite(LED_PINS[0], HIGH);
                Serial.println("LED1 ON");
                break;
            case ''2'':
                digitalWrite(LED_PINS[0], LOW);
                Serial.println("LED1 OFF");
                break;
            case ''3'':
                digitalWrite(LED_PINS[1], HIGH);
                Serial.println("LED2 ON");
                break;
            case ''4'':
                digitalWrite(LED_PINS[1], LOW);
                Serial.println("LED2 OFF");
                break;
            case ''5'':
                digitalWrite(LED_PINS[2], HIGH);
                Serial.println("LED3 ON");
                break;
            case ''6'':
                digitalWrite(LED_PINS[2], LOW);
                Serial.println("LED3 OFF");
                break;
            case ''7'':
                digitalWrite(LED_PINS[3], HIGH);
                Serial.println("LED4 ON");
                break;
            case ''8'':
                digitalWrite(LED_PINS[3], LOW);
                Serial.println("LED4 OFF");
                break;
            case ''9'':
                digitalWrite(LED_PINS[4], HIGH);
                Serial.println("LED5 ON");
                break;
            case ''0'':
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
        if (key == ''#'') {
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
            
        } else if (key == ''*'') {
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

## ⚠️ Phần 4: Lỗi thường gặp & Cách khắc phục

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

## 🎓 Phần 5: Tóm tắt kiến thức

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

---', 1);
INSERT OR REPLACE INTO lessons (id, week_id, order_index, title, content, is_published) VALUES ('l-04-01', 'week-04', 1, 'Lý thuyết & Bài học', '> **Thời lượng**: 3 tiết lý thuyết + 2 tiết thực hành  
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

## 📚 Phần 1: Lý thuyết dân dã (Dễ hiểu nhất)

### 1.1 Analog vs Digital (Cầu thang bộ vs Dốc trượt)

- **Digital (Số)**: Giống cái **Cầu thang bộ**. Bạn chỉ có thể đứng ở bậc 1 hoặc bậc 2 (HIGH hoặc LOW), không đứng lơ lửng ở giữa được.
- **Analog (Tương tự)**: Giống cái **Dốc trượt**. Bạn có thể đứng ở bất kỳ độ cao nào (0V, 1.2V, 2.75V, 5V...).

### 1.2 ADC (Thước đo của Arduino)

Arduino là đồ kỹ thuật số, nó không hiểu "một chút", "hơi hơi". Nó cần con số.
**ADC (Analog to Digital Converter)** chính là cái **thước đo** giúp Arduino "số hóa" điện áp.

- **Thước 10-bit**: Nghĩa là nó chia 5V thành **1024 vạch nhỏ** (từ 0 đến 1023).
- **0V** -> Đo được số **0**.
- **5V** -> Đo được số **1023**.
- **2.5V** -> Đo được số **512**.

> **Công thức thần thánh**: `Giá trị = (Điện áp / 5.0) * 1023`

### 1.3 Potentiometer (Vòi nước điều chỉnh)

**Biến trở (Nút vặn)** giống hệt cái **vòi nước**.
- Bạn vặn trái hết cỡ -> Khóa nước (0V).
- Bạn vặn phải hết cỡ -> Mở hết nước (5V).
- Bạn vặn lửng lơ -> Nước chảy vừa vừa (0-5V).

Arduino dùng chân Analog (A0-A5) để "hứng" lượng nước này và đo xem nó nhiều hay ít.

### 1.4 PWM (Giả vờ Analog) - "Bật tắt siêu tốc"

Arduino Uno không thể xuất ra 2.5V thật (nó chỉ có 0V hoặc 5V). Vậy làm sao để đèn sáng mờ (giống như đang chạy 2.5V)?
Nó dùng chiêu **PWM**: Bật tắt đèn siêu nhanh.

- **Sáng 100%**: Bật luôn, không tắt.
- **Sáng 50%**: Bật 1 nửa thời gian, Tắt 1 nửa thời gian. (Mắt ta thấy đèn sáng mờ).
- **Sáng 10%**: Bật 1 tẹo, Tắt lâu. (Mắt ta thấy đèn tối thui).

> **Lưu ý**: Chỉ những chân có dấu ngã `~` (3, 5, 6, 9, 10, 11) mới làm được trò này.

### 1.5 Hàm `map()` - Quy đổi đơn vị

Bạn đo được số **0-1023** (đầu vào), nhưng bạn lại muốn điều khiển đèn **0-255** (đầu ra PWM).
Bạn cần một cái máy quy đổi. Đó là hàm `map()`.

```cpp
val = map(value, 0, 1023, 0, 255);
```
Dịch: "Hãy đổi `value` từ thang 0-1023 sang thang 0-255 cho tôi". Giống như đổi tiền Đô sang tiền Việt vậy.

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

## 🧱 Phần 2: Bài tập khởi động (Warm-up)

### 2.1 Drill 1: Xem giá trị Biến trở (Pot Value)
**Mục tiêu**: Thấy tận mắt số từ 0 đến 1023.

```cpp
void setup() {
    Serial.begin(9600);
}

void loop() {
    int val = analogRead(A0);
    Serial.println(val); // Vặn núm xoay và nhìn số nhảy
    delay(100);
}
```
**Thử thách**: Xoay về tận cùng bên trái xem có phải là 0 không? Bên phải có phải 1023 không?

### 2.2 Drill 2: Làm mờ đèn (Fading)
**Mục tiêu**: Hiểu PWM bằng cách chỉnh tay.

```cpp
void setup() {
    pinMode(9, OUTPUT); // Chân 9 có dấu ~
}

void loop() {
    analogWrite(9, 10);  // Sáng mờ
    delay(1000);
    analogWrite(9, 255); // Sáng rực
    delay(1000);
}
```

### 2.3 Drill 3: Máy tính map()
**Mục tiêu**: Hiểu hàm map() hoạt động thế nào.

```cpp
void setup() {
    Serial.begin(9600);
    
    int x = 512; // Giả sử đọc được một nửa
    int y = map(x, 0, 1023, 0, 100); // Đổi sang thang 100
    
    Serial.print("Đầu vào: "); Serial.print(x);
    Serial.print(" -> Đầu ra: "); Serial.println(y);
}

void loop() {}
```

---

## 💻 Phần 3: Code mẫu hoàn chỉnh

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

## ⚠️ Phần 4: Lỗi thường gặp & Cách khắc phục

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

## 🎓 Phần 5: Tóm tắt kiến thức

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

---', 1);
INSERT OR REPLACE INTO lessons (id, week_id, order_index, title, content, is_published) VALUES ('l-05-01', 'week-05', 1, 'Lý thuyết & Bài học', '> **Thời lượng**: 2 tiết lý thuyết + 3 tiết thực hành  
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

---', 1);
INSERT OR REPLACE INTO lessons (id, week_id, order_index, title, content, is_published) VALUES ('l-06-01', 'week-06', 1, 'Lý thuyết & Bài học', '> **Thời lượng**: 3 tiết lý thuyết + 2 tiết thực hành  
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

## 📚 Phần 1: Lý thuyết dân dã (Dễ hiểu nhất)

### 1.1 Cảm biến siêu âm HC-SR04 (Nguyên lý tiếng vọng)

Bạn đứng trước vách núi và hét "A lô!". Một lúc sau bạn nghe thấy tiếng vọng lại.
- Nếu vách núi gần -> Tiếng vọng về nhanh.
- Nếu vách núi xa -> Tiếng vọng về lâu.

**HC-SR04** hoạt động y hệt:
1. Nó hét ra sóng siêu âm (Tai người không nghe được).
2. Nó chờ sóng đập vào vật cản và dội lại.
3. Nó bấm giờ.
-> Suy ra khoảng cách.

### 1.2 DHT11 (Ông thủ thư già chậm chạp)

DHT11 đo nhiệt độ và độ ẩm, giá rất rẻ nhưng... rất chậm.
Ông ta cần **ít nhất 2 giây** để đọc xong trang sách (đo xong).
- Nếu bạn cứ 0.1 giây hỏi ông ấy "Nhiêu độ rồi?", ông ấy sẽ nổi cáu (trả về lỗi hoặc giá trị cũ).
- **Quy tắc**: Cho ông ấy nghỉ ngơi ít nhất 2s mỗi lần đo.

### 1.3 PIR (Cảm biến chuyển động) - "Mắt mèo dò nhiệt"

Mọi vật sống (người, chó, mèo) đều tỏa nhiệt. PIR không "nhìn" bằng ánh sáng mà "nhìn" bằng nhiệt (hồng ngoại).
- Khi bạn đi ngang qua, thân nhiệt của bạn làm thay đổi bức tranh hồng ngoại mà nó đang nhìn -> Nó báo động.
- **Lưu ý**: Khi mới cấp điện, nó cần **30-60 giây để "khởi động mắt"** (làm quen môi trường). Đừng vội kết luận nó hỏng nếu vừa bật lên nó báo lung tung.

### 1.4 Cảm biến chạm TTP223 (Nút bấm tàng hình)

Nó giống nút bấm trên bếp từ.
- Không cần nhấn mạnh, chỉ cần **chạm nhẹ** ngón tay.
- Nguyên lý: Cơ thể người là một tụ điện lớn, khi chạm vào nó làm thay đổi điện dung -> Chip nhận biết được.
- Ưu điểm: Đẹp, không mòn như nút cơ, có thể đặt dưới kính/nhựa mỏng.

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

## 🧱 Phần 2: Bài tập khởi động (Warm-up)

### 2.1 Drill 1: Đo nhịp tim siêu âm (Check Pulse)
**Mục tiêu**: Xem HC-SR04 trả về con số gì (Raw duration).

```cpp
void setup() {
    Serial.begin(9600);
    pinMode(9, OUTPUT); // TRIG
    pinMode(10, INPUT); // ECHO
}

void loop() {
    // 1. Phát xung
    digitalWrite(9, LOW); delayMicroseconds(2);
    digitalWrite(9, HIGH); delayMicroseconds(10);
    digitalWrite(9, LOW);
    
    // 2. Đo thời gian phản hồi
    long duration = pulseIn(10, HIGH);
    
    Serial.println(duration); // In ra số mili-giây
    delay(500);
}
```

### 2.2 Drill 2: Cảm biến chạm thần thánh
**Mục tiêu**: Test nút cảm ứng TTP223 (Nó hoạt động y hệt nút thường).

```cpp
void setup() {
    Serial.begin(9600);
    pinMode(2, INPUT); // Không cần PULLUP vì module có sẵn chip rồi
}

void loop() {
    int cham = digitalRead(2);
    if (cham == HIGH) {
        Serial.println("ĐANG CHẠM!");
    } else {
        Serial.println(".......");
    }
    delay(100);
}
```

---

## 💻 Phần 3: Code mẫu hoàn chỉnh

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

## ⚠️ Phần 4: Lỗi thường gặp & Cách khắc phục

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

## 🎓 Phần 5: Tóm tắt kiến thức

### Key Points:

1. **HC-SR04**: Đo khoảng cách = (pulseIn × 0.034) / 2
2. **DHT11**: Cần 2s giữa các lần đọc, dùng thư viện DHT.h
3. **PIR**: Cần warm-up 30-60s, output HIGH khi có chuyển động
4. **TTP223**: Cảm biến chạm điện dung, thay thế nút nhấn

### Công thức:
```
Khoảng cách (cm) = duration × 0.034 / 2
```

---', 1);
INSERT OR REPLACE INTO lessons (id, week_id, order_index, title, content, is_published) VALUES ('l-07-01', 'week-07', 1, 'Lý thuyết & Bài học', '> **Thời lượng**: 3 tiết lý thuyết + 2 tiết thực hành  
> **Mục tiêu**: Giao tiếp UART giữa Arduino và PC, Arduino với Arduino

---

## 🎯 Mục tiêu học tập

Sau khi hoàn thành tuần này, bạn sẽ:

1. ✅ Hiểu giao thức UART và khái niệm baudrate
2. ✅ Gửi dữ liệu từ Arduino lên PC qua Serial Monitor
3. ✅ Nhận lệnh từ PC điều khiển Arduino
4. ✅ Thiết kế giao thức lệnh đơn giản
5. ✅ Giao tiếp UART giữa 2 Arduino

---

## 📚 Phần 1: Lý thuyết dân dã (Dễ hiểu nhất)

### 1.1 UART: "Mỗi người một đầu dây" (Trò chơi điện thoại ống bơ)

Ngày xưa bạn chơi trò nối 2 cái ống bơ bằng 1 sợi dây.
- Bạn nói vào lon này (TX - Miệng).
- Bạn kia ghé tai vào lon kia (RX - Tai).

**Giao thức UART** y hệt vậy:
- **TX (Transmit)**: Chân để "Nói".
- **RX (Receive)**: Chân để "Nghe".
- **GND (Dây đất)**: Để 2 bên có cùng mức điện áp (hiểu nhau).

> **Quy tắc vàng**: **TX ông này nối RX ông kia**. (Miệng tôi nói, tai bạn nghe).
> Đừng bao giờ nối TX với TX (2 cái miệng cùng nói, không ai nghe).

### 1.2 Baudrate: "Tốc độ nói"

- Nếu bạn nói quá nhanh ("Blahblahblah..."), người kia nghe không kịp.
- Nếu bạn nói quá chậm ("A... lô..."), người kia ngủ gật.
- Vì thế, 2 bên phải thống nhất **Baudrate** (Tốc độ truyền).

Ví dụ: `Serial.begin(9600)` nghĩa là "Này anh bạn, tôi sẽ nói 9600 từ mỗi giây nhé".
Nếu máy tính cài 115200 mà Arduino cài 9600 -> Hai bên sẽ nghe ra tiếng "lào xào" (ký tự lạ).

### 1.3 Hardware Serial vs Software Serial

- **Hardware Serial (Cổng cứng)**: Là cái miệng "xịn" có sẵn của Arduino (chân 0, 1). Nó nói rất nhanh, không tốn sức (CPU rảnh rang). Nhưng Arduino Uno chỉ có 1 cái thôi (nối ra USB).
- **Software Serial (Cổng mềm)**: Là cái miệng "giả" do bạn ép Arduino dùng chân khác (ví dụ chân 10, 11) để nói.
    - **Ưu điểm**: Thích tạo bao nhiêu cũng được.
    - **Nhược điểm**: Tốn sức (CPU phải thức canh), nói chậm hơn, dễ lỗi.

### 1.4 Gửi và Nhận

- **`Serial.print("Hello")`**: Giống gửi tin nhắn SMS đi.', 1);
INSERT OR REPLACE INTO lessons (id, week_id, order_index, title, content, is_published) VALUES ('l-08-01', 'week-08', 1, 'Lý thuyết & Bài học', '> **Thời lượng**: 3 tiết lý thuyết + 2 tiết thực hành  
> **Mục tiêu**: Sử dụng I2C để giao tiếp với LCD và các thiết bị khác

---

## 🎯 Mục tiêu học tập

Sau khi hoàn thành tuần này, bạn sẽ:

1. ✅ Hiểu giao thức I2C: SDA, SCL, địa chỉ slave
2. ✅ Quét và phát hiện địa chỉ thiết bị I2C
3. ✅ Hiển thị nội dung lên LCD1602 qua I2C
4. ✅ Giao tiếp I2C Master-Slave giữa 2 Arduino

---

## 📚 Phần 1: Lý thuyết dân dã (Dễ hiểu nhất)

### 1.1 I2C = "Lớp học có 1 giáo viên và nhiều học sinh"

Nếu UART là cuộc điện thoại 1-1, thì **I2C** là một lớp học.
- **Master (Arduino)**: Giáo viên.
- **Slave (Cảm biến, Màn hình)**: Học sinh.
- **Dây SDA (Data)**: Tiếng nói của giáo viên/học sinh.
- **Dây SCL (Clock)**: Tiếng nhịp thước kẻ gõ xuống bàn (Cạch... cạch... cạch...).

Giáo viên muốn gọi ai thì gọi tên người đó (Địa chỉ).
- "Trò Màn Hình!" -> Màn hình: "Dạ có em".
- "Hiển thị chữ Hello!" -> Màn hình làm theo.
- Các trò khác (Cảm biến nhiệt độ, La bàn...) thấy không phải tên mình thì im lặng.

👉 **Ưu điểm**: Chỉ cần **2 dây** (SDA, SCL) mà nối được cả trăm thiết bị.

### 1.2 Địa chỉ "Nhà riêng"

Mỗi thiết bị I2C khi xuất xưởng đều được dán sẵn một con số gọi là **Địa chỉ (Address)**.
- Màn hình LCD thường ở nhà số `0x27`.
- Cảm biến MPU6050 ở nhà số `0x68`.

Trước khi code, phải biết "nhà nó ở đâu". Dùng code **I2C Scanner** để đi gõ cửa từng nhà xem ai trả lời.

### 1.3 Màn hình I2C (LCD 1602) - "Bảng đen điện tử"

Ngày xưa nối màn hình LCD cần tới 16 dây -> Hết sạch chân Arduino.
Người ta gắn thêm 1 con chip thông minh (bộ chuyển đổi I2C) vào sau lưng màn hình.
-> Bây giờ chỉ cần **4 dây**:
1.  **VCC**: Ăn (5V).
2.  **GND**: Uống (Đất).
3.  **SDA**: Nghe (Dữ liệu).
4.  **SCL**: Nhịp (Đồng hồ).

### 1.4 Pull-up Resistor (Cái lò xo kéo lên)

Dây I2C giống như cái chuông dây ngày xưa. Để giật chuông, cần một cái lò xo kéo dây lên cao.
- Nếu không có **điện trở kéo lên (Pull-up)**, dây tín hiệu sẽ bị chùng (nhiễu), không ai nghe thấy gì.
- May mắn là: Hầu hết các module bán sẵn (như màn hình LCD) đã gắn sẵn cái "lò xo" này rồi. Bạn chỉ việc cắm là chạy.

### 1.1 I2C là gì?

**I2C (Inter-Integrated Circuit)** là giao thức truyền thông **đồng bộ** 2 dây, phát minh bởi Philips.

```mermaid
graph TD
    subgraph Arduino["Arduino Uno - Master"]
        A4["SDA / A4"]
        A5["SCL / A5"]
        GND1["GND"]
    end
    
    subgraph Slave["I2C Device - Slave"]
        SDA_S["SDA"]
        SCL_S["SCL"]
        GND2["GND"]
    end
    
    VCC("+5V") -- "4.7kΩ Pull-up" --> A4
    VCC -- "4.7kΩ Pull-up" --> A5
    
    A4 <--> SDA_S
    A5 --> SCL_S
    GND1 --- GND2
    
    style Arduino fill:#00979C,stroke:#005f63,color:white
    style Slave fill:#E5AD24,stroke:#cf9500,color:white
    style VCC fill:#FF5733,stroke:#c42500,color:white
```

> [!TIP]
> **Điện trở Pull-up**: Rất quan trọng! Nếu module I2C (như màn hình LCD) đã tích hợp sẵn điện trở này thì bạn không cần mắc thêm. Nếu dùng chip trần (như DS1307 rời), bắt buộc phải có.


### 1.2 Đặc điểm I2C

| Đặc điểm | Mô tả |
|----------|-------|
| Số dây | 2 (SDA - Data, SCL - Clock) |
| Đồng bộ | Có clock chung (SCL) |
| Multi-device | Nhiều slave trên 1 bus |
| Địa chỉ | Mỗi slave có địa chỉ 7-bit duy nhất |
| Tốc độ | Standard 100kHz, Fast 400kHz |

### 1.3 So sánh I2C vs UART vs SPI

| Đặc điểm | I2C | UART | SPI |
|----------|-----|------|-----|
| Số dây | 2 | 2 | 4 |
| Đồng bộ | Có | Không | Có |
| Multi-device | Có | Không | Có (cần thêm SS) |
| Tốc độ | Trung bình | Thấp | Cao |
| Độ phức tạp | Trung bình | Đơn giản | Đơn giản-phức tạp |

### 1.4 Địa chỉ I2C thường gặp

| Thiết bị | Địa chỉ |
|----------|---------|
| LCD1602 I2C (PCF8574) | 0x27 hoặc 0x3F |
| OLED SSD1306 | 0x3C hoặc 0x3D |
| BMP180/BMP280 | 0x76 hoặc 0x77 |
| MPU6050 | 0x68 hoặc 0x69 |
| DS3231 RTC | 0x68 |

### 1.5 Arduino Uno I2C Pins

| Chân | Chức năng |
|------|-----------|
| A4 | SDA (Data) |
| A5 | SCL (Clock) |

> 💡 **Lưu ý**: Cần điện trở pull-up 4.7kΩ từ SDA và SCL lên VCC. Nhiều module I2C đã có sẵn.

---

## 🧱 Phần 2: Bài tập khởi động (Warm-up)

### 2.1 Drill 1: Điểm danh (I2C Scanner Mini)
**Mục tiêu**: Tìm xem cái màn hình LCD đang trốn ở địa chỉ nào (thường là 0x27 hoặc 0x3F).

```cpp
#include <Wire.h>

void setup() {
    Wire.begin();
    Serial.begin(9600);
}

void loop() {
    Serial.println("Dang quet...");
    for (byte i = 1; i < 127; i++) {
        Wire.beginTransmission(i);
        if (Wire.endTransmission() == 0) {
            Serial.print("Thay thiet bi tai: 0x");
            Serial.println(i, HEX);
        }
    }
    delay(3000);
}
```

### 2.2 Drill 2: Xin chào (Hello LCD)
**Mục tiêu**: Hiện chữ lên màn hình. (Nhớ thay 0x27 bằng địa chỉ tìm được ở trên).

```cpp
#include <LiquidCrystal_I2C.h>
LiquidCrystal_I2C lcd(0x27, 16, 2);

void setup() {
    lcd.init();
    lcd.backlight();
    lcd.print("Chao ban!");
    lcd.setCursor(0, 1); // Xuống dòng
    lcd.print("Arduino de ot");
}

void loop() {}
```

---

## 💻 Phần 3: Code mẫu hoàn chỉnh

### 2.1 I2C Scanner - Quét địa chỉ

```cpp
/*
 * Bài 8-1: Quét và xác định địa chỉ thiết bị I2C
 * 
 * Kết quả: In ra tất cả địa chỉ thiết bị tìm thấy
 */

#include <Wire.h>

void setup() {
    Wire.begin();  // Khởi tạo I2C (Master mode)
    Serial.begin(9600);
    
    Serial.println("=== I2C Scanner ===");
    Serial.println("Scanning...\n");
}

void loop() {
    int deviceCount = 0;
    
    for (byte address = 1; address < 127; address++) {
        Wire.beginTransmission(address);
        byte error = Wire.endTransmission();
        
        if (error == 0) {
            Serial.print("Device found at address 0x");
            if (address < 16) Serial.print("0");
            Serial.print(address, HEX);
            
            // Nhận dạng thiết bị phổ biến
            if (address == 0x27 || address == 0x3F) {
                Serial.print(" (LCD1602 I2C)");
            } else if (address == 0x3C || address == 0x3D) {
                Serial.print(" (OLED SSD1306)");
            } else if (address == 0x68) {
                Serial.print(" (MPU6050 / DS3231)");
            } else if (address == 0x76 || address == 0x77) {
                Serial.print(" (BMP180/280)");
            }
            Serial.println();
            deviceCount++;
        }
    }
    
    Serial.println();
    if (deviceCount == 0) {
        Serial.println("No I2C devices found!");
        Serial.println("Check wiring: SDA=A4, SCL=A5");
    } else {
        Serial.print("Found ");
        Serial.print(deviceCount);
        Serial.println(" device(s)\n");
    }
    
    delay(5000);  // Quét lại sau 5 giây
}
```

### 2.2 LCD1602 I2C - Hiển thị cơ bản

```cpp
/*
 * Bài 8-2: Hiển thị nội dung trên LCD1602 I2C
 * 
 * Thư viện: LiquidCrystal_I2C
 * Cài: Sketch > Include Library > Manage Libraries > "LiquidCrystal I2C"
 */

#include <Wire.h>
#include <LiquidCrystal_I2C.h>

// Địa chỉ thường là 0x27 hoặc 0x3F (chạy I2C Scanner để xác định)
LiquidCrystal_I2C lcd(0x27, 16, 2);  // Địa chỉ, số cột, số hàng

void setup() {
    lcd.init();       // Khởi tạo LCD
    lcd.backlight();  // Bật đèn nền
    
    lcd.setCursor(0, 0);  // Cột 0, hàng 0
    lcd.print("Hello Arduino!");
    
    lcd.setCursor(0, 1);  // Cột 0, hàng 1
    lcd.print("I2C LCD Demo");
}

void loop() {
    // Đếm giây
    static unsigned long lastUpdate = 0;
    static int seconds = 0;
    
    if (millis() - lastUpdate >= 1000) {
        lastUpdate = millis();
        seconds++;
        
        lcd.setCursor(14, 1);  // Góc phải hàng 2
        if (seconds < 10) lcd.print("0");
        lcd.print(seconds % 60);
    }
}
```

### 2.3 LCD hiển thị sensor với nút đổi mode

```cpp
/*
 * Bài 8-2b: LCD hiển thị pot với nút đổi mode
 * 
 * Mode 1: Hiển thị phần trăm
 * Mode 2: Hiển thị giá trị raw
 * Mode 3: Hiển thị điện áp
 */

#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);

const int POT_PIN = A0;
const int BUTTON_PIN = 2;

int mode = 1;  // 1=Percent, 2=Raw, 3=Voltage

bool lastButtonState = HIGH;
unsigned long lastDebounce = 0;

void setup() {
    lcd.init();
    lcd.backlight();
    pinMode(BUTTON_PIN, INPUT_PULLUP);
    
    Serial.begin(9600);
    updateModeDisplay();
}

void updateModeDisplay() {
    lcd.setCursor(0, 0);
    lcd.print("Mode: ");
    switch (mode) {
        case 1: lcd.print("Percent   "); break;
        case 2: lcd.print("Raw       "); break;
        case 3: lcd.print("Voltage   "); break;
    }
}

void loop() {
    // Đọc nút đổi mode
    bool buttonState = digitalRead(BUTTON_PIN);
    if (buttonState != lastButtonState) {
        lastDebounce = millis();
    }
    if ((millis() - lastDebounce) > 50) {
        static bool stableState = HIGH;
        if (buttonState != stableState) {
            stableState = buttonState;
            if (stableState == LOW) {
                mode = (mode % 3) + 1;  // Xoay vòng 1→2→3→1
                updateModeDisplay();
                Serial.print("Mode changed to: ");
                Serial.println(mode);
            }
        }
    }
    lastButtonState = buttonState;
    
    // Đọc pot và hiển thị
    int raw = analogRead(POT_PIN);
    float voltage = raw * 5.0 / 1023.0;
    int percent = map(raw, 0, 1023, 0, 100);
    
    lcd.setCursor(0, 1);
    lcd.print("Value: ");
    
    switch (mode) {
        case 1:
            lcd.print(percent);
            lcd.print("%      ");
            break;
        case 2:
            lcd.print(raw);
            lcd.print("      ");
            break;
        case 3:
            lcd.print(voltage, 2);
            lcd.print("V    ");
            break;
    }
    
    delay(100);
}
```

### 2.4 I2C Master-Slave giữa 2 Arduino

**Master:**
```cpp
/*
 * Bài 8-3a: I2C Master
 * Gửi lệnh đến Slave, nhận phản hồi
 */

#include <Wire.h>

const int SLAVE_ADDRESS = 8;

void setup() {
    Wire.begin();  // Master mode (không có địa chỉ)
    Serial.begin(9600);
    
    Serial.println("=== I2C Master ===");
    Serial.println("Commands: LED=ON, LED=OFF, STATUS");
}

void loop() {', 1);
INSERT OR REPLACE INTO lessons (id, week_id, order_index, title, content, is_published) VALUES ('l-09-01', 'week-09', 1, 'Lý thuyết & Bài học', '> **Thời lượng**: 3 tiết lý thuyết + 2 tiết thực hành  
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
    // Check Serial commands', 1);
INSERT OR REPLACE INTO lessons (id, week_id, order_index, title, content, is_published) VALUES ('l-10-01', 'week-10', 1, 'Lý thuyết & Bài học', '> **Thời lượng**: 3 tiết lý thuyết + 2 tiết thực hành  
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

---', 1);
INSERT OR REPLACE INTO lessons (id, week_id, order_index, title, content, is_published) VALUES ('l-11-01', 'week-11', 1, 'Lý thuyết & Bài học', '> **Thời lượng**: 3 tiết lý thuyết + 2 tiết thực hành  
> **Mục tiêu**: Điều khiển LED từ xa qua web browser

---

## 🎯 Mục tiêu học tập

Sau khi hoàn thành tuần này, bạn sẽ:

1. ✅ Hiểu WiFi Station vs Access Point mode
2. ✅ Tạo WebServer cơ bản điều khiển LED
3. ✅ Thiết kế giao diện web ON/OFF đẹp mắt
4. ✅ Xử lý HTTP request/response

---

## 📚 Phần 1: Lý thuyết dân dã (Dễ hiểu nhất)

### 1.1 ESP8266/ESP32: "Arduino mọc thêm cánh"

Arduino Uno giống như một chiếc xe đạp: rẻ, bền, dễ đi, nhưng không bay được (không có Internet).
**ESP8266** và **ESP32** giống như xe đạp được lắp thêm **đôi cánh WiFi**.
- Bạn vẫn code y hệt như Arduino (setup, loop, digitalWrite...).
- Nhưng nó có thêm khả năng kết nối mạng để gửi tin nhắn, nhận lệnh từ xa.

### 1.2 Hai chế độ WiFi (Ở nhờ vs Tự lập)

- **Station Mode (STA - Ở nhờ)**: ESP đóng vai trò như cái điện thoại của bạn. Nó xin kết nối vào modem WiFi nhà bạn (phải biết tên WiFi và Pass).
    - *Ưu điểm*: Truy cập được Internet toàn cầu.
- **Access Point Mode (AP - Tự lập)**: ESP tự phát ra một sóng WiFi riêng (như "ESP_FREE_WIFI"). Bạn lấy điện thoại kết nối vào nó.
    - *Ưu điểm*: Không cần modem mạng, mang ra giữa đồng hoang vẫn điều khiển được.

### 1.3 Web Server (Người phục vụ bàn)

Khi bạn lập trình ESP làm **Web Server**, nó biến thành một anh bồi bàn.
1. Bạn (Khách hàng - Client) mở trình duyệt, gõ địa chỉ IP của nó (ví dụ 192.168.1.100).
2. Bạn gọi món: "Cho tôi xem trang chủ" (`GET /`).
3. Anh bồi bàn ESP chạy vào bếp, lấy tờ thực đơn (file HTML) mang ra cho bạn xem.
4. Bạn bấm nút "Bật đèn" trên màn hình -> Trình duyệt gửi lệnh `GET /led/on`.
5. Anh bồi bàn nhận lệnh -> Chạy đi bật đèn thật -> Quay lại báo "Xong rồi sếp!".

### 1.4 IP Address (Số nhà)

Trong mạng WiFi, mỗi thiết bị phải có một **số nhà riêng** (IP Address) để bưu điện biết đường giao thư.
- Ví dụ: `192.168.1.5`.
- Bạn phải biết số nhà này thì mới truy cập vào Website của ESP được. Code xong mở Serial Monitor lên xem nó in ra số mấy nhé.

### 1.1 Lưu ý phần cứng

> ⚠️ **Arduino Uno KHÔNG có WiFi**. Cần dùng **ESP8266** hoặc **ESP32**.

| Board | WiFi | Giá | Phổ biến |
|-------|------|-----|----------|
| ESP8266 (NodeMCU) | Có | Rẻ | Rất phổ biến |
| ESP32 | Có + BLE | Trung bình | Mạnh hơn |
| Arduino Uno + Shield | Cần module | Đắt | Ít dùng |

### 1.2 ESP8266 & ESP32 Pinout

#### ESP8266 NodeMCU:
```
        ┌─────USB─────┐
     D0 │ 16 ●   ● A0 │ ADC
     D1 │  5 ●   ● GND│
     D2 │  4 ●   ● VV │ 3.3V
     D3 │  0 ●   ● S3 │ D8-10
     D4 │  2 ●   ● S2 │ D8-9-10
    3V3 │    ●   ● S1 │ D8-9-10-MISO
    GND │    ●   ● SC │ SCK
     D5 │ 14 ●   ● S0 │ MOSI
     D6 │ 12 ●   ● G  │ GND
     D7 │ 13 ●   ● 3V │ 3.3V
     D8 │ 15 ●   ● EN │
     RX │  3 ●   ● RST│
     TX │  1 ●   ● GND│
        └─────────────┘
```

#### ESP32 DevKit V1:
```
        ┌─────USB─────┐
     EN │ ●         ● │ 23 (MOSI)
     VP │ ●         ● │ 22 (SCL)
     VN │ ●         ● │  1 (TX0)
     34 │ ●         ● │  3 (RX0)
     35 │ ●         ● │ 21 (SDA)
     32 │ ●         ● │ GND
     33 │ ●         ● │ 19 (MISO)
     25 │ ●         ● │ 18 (SCK)
     26 │ ●         ● │  5 (SS)
     27 │ ●         ● │ 17 (TX2)
     14 │ ●         ● │ 16 (RX2)
     12 │ ●         ● │  4
    GND │ ●         ● │  0
     13 │ ●         ● │  2 (LED)
     D2 │ ●         ● │ 15
     D3 │ ●         ● │ D1
CMD(11) │ ●         ● │ D0
    5V  │ ●         ● │ 3.3V
        └─────────────┘
```

### 1.3 WiFi Modes

| Mode | Mô tả |
|------|-------|
| Station (STA) | Kết nối vào WiFi có sẵn |
| Access Point (AP) | Tạo WiFi riêng |
| STA + AP | Cả hai đồng thời |

### 1.4 HTTP Request/Response

```
Browser                     ESP8266
   │                           │
   │ ── GET /led/on ─────────► │  Request
   │                           │  Process: digitalWrite(LED, HIGH)
   │ ◄────── 200 OK ────────── │  Response + HTML
   │                           │
```

#### Cấu trúc xử lý:

```mermaid
classDiagram
    class WebServer {
        +on(path, handler)
        +begin()
        +handleClient()
        +send(code, type, content)
    }
    class CallbackFunctions {
        +handleRoot()
        +handleOn()
        +handleOff()
    }
    WebServer ..> CallbackFunctions : triggers
```


---

## 🧱 Phần 2: Bài tập khởi động (Warm-up)

### 2.1 Drill 1: Kết nối WiFi
**Mục tiêu**: Bắt cho bằng được WiFi nhà bạn.

```cpp
#include <ESP8266WiFi.h> // Hoặc WiFi.h nếu dùng ESP32

void setup() {
    Serial.begin(115200);
    WiFi.begin("TenWiFi", "MatKhau"); // Thay đổi ở đây
    
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("\nDa ket noi!");
    Serial.println(WiFi.localIP()); // In ra số nhà (IP)
}

void loop() {}
```

### 2.2 Drill 2: Web "Hello World"
**Mục tiêu**: Vào trình duyệt thấy chữ Hello.

```cpp
#include <ESP8266WebServer.h>
ESP8266WebServer server(80);

void setup() {
    // (Kết nối WiFi như bài trên...)
    
    server.on("/", []() {
        server.send(200, "text/plain", "Hello from ESP!");
    });
    server.begin();
}

void loop() {
    server.handleClient(); // Đừng quên dòng này!
}
```

---

## 💻 Phần 3: Code mẫu hoàn chỉnh

### 2.1 WebServer điều khiển 1 LED

```cpp
/*
 * Bài 11.1: WebServer bật/tắt 1 LED
 * 
 * Tiêu đề: "Hệ thống bật / tắt Led – WebServer cấu hình cơ bản"
 * 
 * Board: ESP8266 (NodeMCU/Wemos D1)
 */

#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>

// ========== CẤU HÌNH WIFI ==========
const char* ssid = "TEN_WIFI_CUA_BAN";
const char* password = "MAT_KHAU_WIFI";

// ========== HARDWARE ==========
const int LED_PIN = LED_BUILTIN;  // GPIO2, active LOW
bool ledState = false;

ESP8266WebServer server(80);

// ========== HTML PAGE ==========
String getHTML() {
    String html = R"(
<!DOCTYPE html>
<html>
<head>
    <meta charset=''UTF-8''>
    <meta name=''viewport'' content=''width=device-width, initial-scale=1''>
    <title>LED Control</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: ''Segoe UI'', Arial, sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 40px 20px;
            color: #fff;
        }
        h1 {
            color: #00d4ff;
            margin-bottom: 30px;
            text-align: center;
            font-size: 24px;
        }
        .status {
            font-size: 28px;
            margin: 30px 0;
            padding: 20px 40px;
            border-radius: 15px;
            text-transform: uppercase;
            font-weight: bold;
            transition: all 0.3s ease;
        }
        .status-on {
            background: linear-gradient(135deg, #4CAF50, #45a049);
            box-shadow: 0 0 30px rgba(76, 175, 80, 0.5);
        }
        .status-off {
            background: #555;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
        }
        .btn-container { margin-top: 20px; }
        .btn {
            padding: 18px 50px;
            font-size: 20px;
            margin: 10px;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            transition: transform 0.2s, box-shadow 0.2s;
            font-weight: bold;
        }
        .btn:hover { transform: scale(1.05); }
        .btn-on {
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
        }
        .btn-off {
            background: linear-gradient(135deg, #f44336, #da190b);
            color: white;
        }
        .ip-info {
            margin-top: 40px;
            padding: 15px;
            background: rgba(255,255,255,0.1);
            border-radius: 10px;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <h1>Hệ thống bật / tắt Led<br>WebServer cấu hình cơ bản</h1>
    
    <div class=''status )";
    
    html += ledState ? "status-on''>LED ĐANG BẬT" : "status-off''>LED ĐANG TẮT";
    html += R"(</div>
    
    <div class=''btn-container''>
        <a href=''/on'' class=''btn btn-on''>ON</a>
        <a href=''/off'' class=''btn btn-off''>OFF</a>
    </div>
    
    <div class=''ip-info''>
        IP: )";
    html += WiFi.localIP().toString();
    html += R"(
    </div>
</body>
</html>
)";
    return html;
}

// ========== HANDLERS ==========
void handleRoot() {
    server.send(200, "text/html", getHTML());
}

void handleOn() {
    ledState = true;
    digitalWrite(LED_PIN, LOW);  // LED_BUILTIN active LOW
    Serial.println("LED ON");
    server.send(200, "text/html", getHTML());
}

void handleOff() {
    ledState = false;
    digitalWrite(LED_PIN, HIGH);
    Serial.println("LED OFF");
    server.send(200, "text/html", getHTML());
}

// ========== SETUP ==========
void setup() {
    Serial.begin(115200);
    pinMode(LED_PIN, OUTPUT);
    digitalWrite(LED_PIN, HIGH);  // OFF
    
    // Kết nối WiFi
    Serial.println();
    Serial.print("Connecting to ");
    Serial.println(ssid);
    
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    
    Serial.println();
    Serial.println("WiFi connected!");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
    
    // Setup routes
    server.on("/", handleRoot);
    server.on("/on", handleOn);
    server.on("/off", handleOff);
    
    server.begin();
    Serial.println("HTTP server started!");
    Serial.println("Open browser and go to: http://" + WiFi.localIP().toString());
}

// ========== LOOP ==========
void loop() {
    server.handleClient();
}
```

### 2.2 WebServer điều khiển 2 LED

```cpp
/*
 * Bài 11.2: WebServer bật/tắt 2 LED
 * 
 * Tiêu đề: "Hệ thống bật / tắt 2 Led – WebServer cấu hình cơ bản"
 * Nút hiển thị BAT/TAT đúng trạng thái
 */

#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>

const char* ssid = "TEN_WIFI";
const char* password = "MAT_KHAU";

const int LED1_PIN = D1;  // GPIO5
const int LED2_PIN = D2;  // GPIO4
bool led1State = false;
bool led2State = false;

ESP8266WebServer server(80);

String getHTML() {
    String html = R"(
<!DOCTYPE html>
<html>
<head>
    <meta charset=''UTF-8''>
    <meta name=''viewport'' content=''width=device-width, initial-scale=1''>
    <title>2 LED Control</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #0f0f23, #1a1a3e);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 30px;
            color: #fff;
        }
        h1 { color: #00d4ff; margin-bottom: 30px; text-align: center; }
        .led-box {
            background: rgba(255,255,255,0.05);
            padding: 25px;
            margin: 15px;
            border-radius: 20px;
            width: 280px;
            text-align: center;
        }
        .led-title {
            font-size: 22px;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .indicator {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            margin-left: 10px;
        }
        .ind-on { background: #4CAF50; box-shadow: 0 0 15px #4CAF50; }
        .ind-off { background: #555; }
        .btn {
            padding: 15px 40px;
            font-size: 18px;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            min-width: 100px;
            font-weight: bold;
        }
        .btn-bat { background: #4CAF50; color: white; }
        .btn-tat { background: #f44336; color: white; }
    </style>
</head>
<body>
    <h1>Hệ thống bật / tắt 2 Led<br>WebServer cấu hình cơ bản</h1>
    
    <div class=''led-box''>
        <div class=''led-title''>
            LED 1 <span class=''indicator )";
    html += led1State ? "ind-on" : "ind-off";
    html += R"(''></span>
        </div>
        <a href=''/led1/toggle'' class=''btn )";
    html += led1State ? "btn-tat''>TAT" : "btn-bat''>BAT";
    html += R"(''></a>
    </div>
    
    <div class=''led-box''>
        <div class=''led-title''>
            LED 2 <span class=''indicator )";
    html += led2State ? "ind-on" : "ind-off";
    html += R"(''></span>
        </div>
        <a href=''/led2/toggle'' class=''btn )";
    html += led2State ? "btn-tat''>TAT" : "btn-bat''>BAT";
    html += R"(''></a>
    </div>
</body>
</html>
)";
    return html;
}

void handleRoot() {
    server.send(200, "text/html", getHTML());
}

void handleLed1Toggle() {
    led1State = !led1State;
    digitalWrite(LED1_PIN, led1State);
    Serial.print("LED1: ");
    Serial.println(led1State ? "ON" : "OFF");
    server.send(200, "text/html", getHTML());
}

void handleLed2Toggle() {
    led2State = !led2State;
    digitalWrite(LED2_PIN, led2State);
    Serial.print("LED2: ");
    Serial.println(led2State ? "ON" : "OFF");
    server.send(200, "text/html", getHTML());
}

void setup() {
    Serial.begin(115200);
    pinMode(LED1_PIN, OUTPUT);
    pinMode(LED2_PIN, OUTPUT);
    digitalWrite(LED1_PIN, LOW);
    digitalWrite(LED2_PIN, LOW);
    
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println();
    Serial.println(WiFi.localIP());
    
    server.on("/", handleRoot);
    server.on("/led1/toggle", handleLed1Toggle);
    server.on("/led2/toggle", handleLed2Toggle);
    
    server.begin();
}

void loop() {
    server.handleClient();
}
```

---

## ⚠️ Phần 4: Lỗi thường gặp

| Lỗi | Nguyên nhân | Cách sửa |
|-----|-------------|----------|
| Không kết nối WiFi | Sai SSID/password | Kiểm tra và sửa |
| Không truy cập được web | Sai IP | Xem Serial Monitor để lấy IP |
| Trang trắng | HTML lỗi | Kiểm tra cặp tag |
| LED không sáng | Sai chân hoặc logic | Kiểm tra GPIO và active HIGH/LOW |

### Checklist:
1. ✅ Cài board ESP8266/ESP32 trong Arduino IDE?
2. ✅ SSID và password đúng?
3. ✅ Cùng mạng WiFi với máy tính/điện thoại?
4. ✅ Đúng GPIO (D1=GPIO5, D2=GPIO4)?

---

## 🎓 Phần 5: Tóm tắt

1. **ESP8266/ESP32**: Board WiFi thay thế Arduino cho IoT
2. **WebServer**: Lắng nghe HTTP request, trả HTML
3. **Route**: server.on("/path", handler)
4. **handleClient()**: Phải gọi trong loop()

---', 1);
INSERT OR REPLACE INTO lessons (id, week_id, order_index, title, content, is_published) VALUES ('l-12-01', 'week-12', 1, 'Lý thuyết & Bài học', '> **Thời lượng**: 3 tiết lý thuyết + 2 tiết thực hành  
> **Mục tiêu**: Xây dựng WebServer không đồng bộ, responsive và realtime

---

## 🎯 Mục tiêu học tập

Sau khi hoàn thành tuần này, bạn sẽ:

1. ✅ Hiểu sự khác biệt giữa Sync và Async WebServer
2. ✅ Sử dụng ESPAsyncWebServer library
3. ✅ Tạo API endpoint trả JSON cho JavaScript
4. ✅ Xây dựng dashboard IoT với auto-refresh

---

## 📚 Phần 1: Lý thuyết dân dã (Dễ hiểu nhất)

### 1.1 Sync vs Async WebServer (Xếp hàng vs Lấy số)

- **Sync WebServer (Tuần 11)**: Giống việc **xếp hàng mua trà sữa**.
    - Khách A đang order thì Khách B phải đứng chờ.
    - Nếu Khách A order lâu (xử lý chậm) -> Cả hàng kẹt cứng.
    - Lúc nhân viên đang pha nước (loop bận) -> Không ai order được.

- **Async WebServer (Tuần 12)**: Giống việc **lấy số thứ tự ở ngân hàng**.
    - Khách A vào lấy số, ra ghế ngồi chờ.
    - Khách B vào lấy số ngay lập tức, không phải chờ Khách A.
    - Nhân viên xử lý xong cho ai thì gọi số người đó.
    - **Ưu điểm**: Phục vụ được cực nhiều khách cùng lúc, không ai bị chặn (non-blocking).

### 1.2 "API" và "JSON" (Ngôn ngữ của máy)

Ở tuần trước, WebServer trả về cả trang HTML (gồm màu sắc, chữ nghĩa...). Việc này rất nặng nề.
Tuần này, chúng ta dùng cách chuyên nghiệp hơn:
1. Trình duyệt tải trang web 1 lần duy nhất (HTML/CSS).
2. Sau đó, nó chỉ hỏi ESP những câu ngắn gọn: "Đèn nhân viên 1 tắt hay bật?"
3. ESP trả lời ngắn gọn: `{"den1": "bat"}`. (Đây là **JSON**).
4. Trình duyệt nhận tin -> Tự tô màu cái nút trên màn hình.

### 1.3 `fetch()` - Người đưa thư thầm lặng

Trong JavaScript, lệnh `fetch()` giống như một **người đưa thư thầm lặng**.
- Nó chạy ngầm bên dưới, không làm tải lại trang web (reload).
- Bạn bấm nút -> `fetch()` chạy đi gửi lệnh -> nhận kết quả -> cập nhật màu nút.
- Người dùng cảm thấy web chạy "mượt như app", không bị chớp giật màn hình.

### 1.1 Sync vs Async WebServer

| Đặc điểm | Sync (ESP8266WebServer) | Async (ESPAsyncWebServer) |
|----------|------------------------|---------------------------|
| Xử lý request | Từng cái một, blocking | Đồng thời, non-blocking |
| handleClient() | Phải gọi trong loop() | KHÔNG cần |
| Performance | Thấp | Cao |
| Nhiều client | Chậm | Nhanh |

```
Client 1 ─► ┌─────────────┐
            │   Async     │ ─► LED Control
Client 2 ─► │  WebServer  │ ─► Send JSON
            │             │ ─► Sensor Read
Client 3 ─► └─────────────┘
                  ↑
          Event-driven (không block)
```

### Sơ đồ tuần tự xử lý Async (Mermaid)

```mermaid
sequenceDiagram
    participant C as Client (Browser)
    participant S as ESP32 (Async Server)
    participant L as LED Hardware
    
    Note over C,S: Non-blocking Request
    C->>S: GET /toggle/1
    S-->>C: Trả về JSON {"status": "ok"} ngay lập tức
    
    par Xử lý phần cứng
        S->>L: Đảo trạng thái LED
    and Cập nhật UI
        C->>C: Đổi màu nút bấm
    end
```

### 1.3 Thư viện cần cài

**ESP8266:**
- ESPAsyncWebServer
- ESPAsyncTCP

**ESP32:**
- ESPAsyncWebServer
- AsyncTCP

### 1.4 JSON API Pattern

```
Browser                     ESP8266
   │                           │
   │ ── fetch(''/api/state'') ─► │  GET request
   │ ◄─ {"led1":true,"led2": ─ │  JSON response
   │     false}                │
   │                           │
   │ (JavaScript cập nhật UI)  │
```

---

## 🧱 Phần 2: Bài tập khởi động (Warm-up)

### 2.1 Drill 1: Trả về JSON (API Test)
**Mục tiêu**: Vào trình duyệt thấy chuỗi JSON.

```cpp
#include <ESPAsyncWebServer.h>
AsyncWebServer server(80);

void setup() {
    // (Kết nối WiFi...)
    
    server.on("/api/hello", HTTP_GET, [](AsyncWebServerRequest *request){
        // Trả về JSON chuẩn
        request->send(200, "application/json", "{\"message\":\"Xin chao!\"}");
    });
    server.begin();
}

void loop() {}
```
**Thử thách**: Mở trình duyệt gõ `IP/api/hello`.

### 2.2 Drill 2: Async LED (Bật tắt không chặn)
**Mục tiêu**: Bật đèn xong trả lời ngay lập tức.

```cpp
    server.on("/led/on", HTTP_GET, [](AsyncWebServerRequest *request){
        digitalWrite(2, LOW); // Bật đèn (hoặc HIGH tùy board)
        request->send(200, "text/plain", "OK");
    });
```

---

## 💻 Phần 3: Code mẫu hoàn chỉnh

### 2.1 Async WebServer điều khiển 1 LED

```cpp
/*
 * Bài 12.1: Async WebServer bật/tắt 1 LED
 * 
 * Tiêu đề: "Hệ thống bật / tắt Led – WebServer cấu hình không đồng bộ"
 */

#ifdef ESP8266
  #include <ESP8266WiFi.h>
  #include <ESPAsyncTCP.h>
#else
  #include <WiFi.h>
  #include <AsyncTCP.h>
#endif

#include <ESPAsyncWebServer.h>

const char* ssid = "TEN_WIFI";
const char* password = "MAT_KHAU";

const int LED_PIN = LED_BUILTIN;
bool ledState = false;

AsyncWebServer server(80);

// ========== HTML với JavaScript Fetch ==========
const char index_html[] PROGMEM = R"rawliteral(
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Async LED Control</title>
    <style>
        * { box-sizing: border-box; }
        body {
            font-family: ''Segoe UI'', Arial, sans-serif;
            background: linear-gradient(135deg, #1a1a2e, #16213e);
            min-height: 100vh;
            margin: 0;
            padding: 40px 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            color: #fff;
        }
        h1 {
            color: #00d4ff;
            text-align: center;
            margin-bottom: 30px;
        }
        .status {
            font-size: 32px;
            font-weight: bold;
            padding: 25px 50px;
            border-radius: 20px;
            margin: 30px 0;
            transition: all 0.3s ease;
            text-transform: uppercase;
        }
        .status-on {
            background: linear-gradient(135deg, #4CAF50, #45a049);
            box-shadow: 0 0 40px rgba(76, 175, 80, 0.5);
        }
        .status-off {
            background: #444;
        }
        .btn-container { margin-top: 20px; }
        .btn {
            padding: 20px 60px;
            font-size: 24px;
            margin: 10px;
            border: none;
            border-radius: 15px;
            cursor: pointer;
            font-weight: bold;
            transition: transform 0.2s;
        }
        .btn:hover { transform: scale(1.05); }
        .btn:active { transform: scale(0.98); }
        .btn-on { background: #4CAF50; color: white; }
        .btn-off { background: #f44336; color: white; }
        .auto-status {
            margin-top: 30px;
            font-size: 12px;
            color: #888;
        }
    </style>
</head>
<body>
    <h1>Hệ thống bật / tắt Led<br>WebServer cấu hình không đồng bộ</h1>
    
    <div id="status" class="status status-off">LED ĐANG TẮT</div>
    
    <div class="btn-container">
        <button class="btn btn-on" onclick="setLED(''on'')">ON</button>
        <button class="btn btn-off" onclick="setLED(''off'')">OFF</button>
    </div>
    
    <div class="auto-status">Tự động cập nhật mỗi 2 giây</div>

    <script>
        function setLED(state) {
            fetch(''/led/'' + state)
                .then(response => response.json())
                .then(data => updateUI(data.state))
                .catch(err => console.error(''Error:'', err));
        }
        
        function updateUI(isOn) {
            const statusEl = document.getElementById(''status'');
            statusEl.className = ''status '' + (isOn ? ''status-on'' : ''status-off'');
            statusEl.textContent = ''LED ĐANG '' + (isOn ? ''BẬT'' : ''TẮT'');
        }
        
        // Auto refresh every 2 seconds
        setInterval(() => {
            fetch(''/state'')
                .then(r => r.json())
                .then(d => updateUI(d.state))
                .catch(err => console.error(''Fetch error:'', err));
        }, 2000);
        
        // Initial fetch
        fetch(''/state'').then(r => r.json()).then(d => updateUI(d.state));
    </script>
</body>
</html>
)rawliteral";

// ========== SETUP ==========
void setup() {
    Serial.begin(115200);
    pinMode(LED_PIN, OUTPUT);
    digitalWrite(LED_PIN, HIGH);  // OFF (active LOW)
    
    // Connect WiFi
    WiFi.begin(ssid, password);
    Serial.print("Connecting");
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println();
    Serial.print("IP: ");
    Serial.println(WiFi.localIP());
    
    // Route: Serve HTML page
    server.on("/", HTTP_GET, [](AsyncWebServerRequest *request) {
        request->send_P(200, "text/html", index_html);
    });
    
    // API: Get current state
    server.on("/state", HTTP_GET, [](AsyncWebServerRequest *request) {
        String json = "{\"state\":" + String(ledState ? "true" : "false") + "}";
        request->send(200, "application/json", json);
    });
    
    // API: Turn ON
    server.on("/led/on", HTTP_GET, [](AsyncWebServerRequest *request) {
        ledState = true;
        digitalWrite(LED_PIN, LOW);  // Active LOW
        Serial.println("LED ON");
        request->send(200, "application/json", "{\"state\":true}");
    });
    
    // API: Turn OFF
    server.on("/led/off", HTTP_GET, [](AsyncWebServerRequest *request) {
        ledState = false;
        digitalWrite(LED_PIN, HIGH);
        Serial.println("LED OFF");
        request->send(200, "application/json", "{\"state\":false}");
    });
    
    server.begin();
    Serial.println("Async WebServer started!");
}

// ========== LOOP ==========
void loop() {
    // Không cần handleClient()!
    // Có thể làm việc khác ở đây
    
    // Ví dụ: đọc sensor, xử lý logic khác...
}
```

### 2.2 Async WebServer điều khiển 2 LED

```cpp
/*
 * Bài 12.2: Async WebServer 2 LED với UI realtime
 * 
 * Tiêu đề: "Hệ thống bật / tắt 2 Led – WebServer cấu hình không đồng bộ"
 */

#ifdef ESP8266
  #include <ESP8266WiFi.h>
  #include <ESPAsyncTCP.h>
#else
  #include <WiFi.h>
  #include <AsyncTCP.h>
#endif

#include <ESPAsyncWebServer.h>

const char* ssid = "TEN_WIFI";
const char* password = "MAT_KHAU";

const int LED1_PIN = D1;  // GPIO5
const int LED2_PIN = D2;  // GPIO4
bool led1State = false;
bool led2State = false;

AsyncWebServer server(80);

const char index_html[] PROGMEM = R"rawliteral(
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>2 LED Async Control</title>
    <style>
        body {
            font-family: ''Segoe UI'', Arial, sans-serif;
            background: linear-gradient(135deg, #0f0f23, #1a1a3e);
            min-height: 100vh;
            margin: 0;
            padding: 30px;
            display: flex;
            flex-direction: column;
            align-items: center;
            color: #fff;
        }
        h1 { color: #00d4ff; margin-bottom: 30px; text-align: center; }
        .container { display: flex; flex-wrap: wrap; justify-content: center; }
        .led-card {
            background: rgba(255,255,255,0.05);
            padding: 30px;
            margin: 15px;
            border-radius: 20px;
            width: 260px;
            text-align: center;
            backdrop-filter: blur(10px);
            transition: transform 0.3s;
        }
        .led-card:hover { transform: translateY(-5px); }
        .led-title {
            font-size: 24px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .indicator {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            margin-left: 12px;
            transition: all 0.3s;
        }
        .ind-on { 
            background: #4CAF50; 
            box-shadow: 0 0 20px #4CAF50; 
        }
        .ind-off { background: #555; }
        .btn {
            padding: 18px 0;
            width: 100%;
            font-size: 20px;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.2s;
            margin-top: 10px;
        }
        .btn:hover { transform: scale(1.03); }
        .btn-bat { background: #4CAF50; color: white; }
        .btn-tat { background: #f44336; color: white; }
        .info { margin-top: 30px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <h1>Hệ thống bật / tắt 2 Led<br>WebServer cấu hình không đồng bộ</h1>
    
    <div class="container">
        <div class="led-card">
            <div class="led-title">
                LED 1 <span id="ind1" class="indicator ind-off"></span>
            </div>
            <button id="btn1" class="btn btn-bat" onclick="toggle(1)">BAT</button>
        </div>
        
        <div class="led-card">
            <div class="led-title">
                LED 2 <span id="ind2" class="indicator ind-off"></span>
            </div>
            <button id="btn2" class="btn btn-bat" onclick="toggle(2)">BAT</button>
        </div>
    </div>
    
    <div class="info">Auto-sync mỗi 2 giây • Không mất trạng thái khi refresh</div>

    <script>
        function toggle(led) {
            fetch(''/toggle/'' + led)
                .then(r => r.json())
                .then(d => updateUI(d));
        }
        
        function updateUI(data) {
            // LED 1
            document.getElementById(''btn1'').textContent = data.led1 ? ''TAT'' : ''BAT'';
            document.getElementById(''btn1'').className = ''btn '' + (data.led1 ? ''btn-tat'' : ''btn-bat'');
            document.getElementById(''ind1'').className = ''indicator '' + (data.led1 ? ''ind-on'' : ''ind-off'');
            
            // LED 2
            document.getElementById(''btn2'').textContent = data.led2 ? ''TAT'' : ''BAT'';
            document.getElementById(''btn2'').className = ''btn '' + (data.led2 ? ''btn-tat'' : ''btn-bat'');
            document.getElementById(''ind2'').className = ''indicator '' + (data.led2 ? ''ind-on'' : ''ind-off'');
        }
        
        // Auto refresh
        setInterval(() => {
            fetch(''/state'').then(r => r.json()).then(d => updateUI(d));
        }, 2000);
        
        // Initial state
        fetch(''/state'').then(r => r.json()).then(d => updateUI(d));
    </script>
</body>
</html>
)rawliteral";

void setup() {
    Serial.begin(115200);
    pinMode(LED1_PIN, OUTPUT);
    pinMode(LED2_PIN, OUTPUT);
    digitalWrite(LED1_PIN, LOW);
    digitalWrite(LED2_PIN, LOW);
    
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
    }
    Serial.println(WiFi.localIP());
    
    // Serve HTML
    server.on("/", HTTP_GET, [](AsyncWebServerRequest *request) {
        request->send_P(200, "text/html", index_html);
    });
    
    // Get state
    server.on("/state", HTTP_GET, [](AsyncWebServerRequest *request) {
        String json = "{\"led1\":" + String(led1State ? "true" : "false");
        json += ",\"led2\":" + String(led2State ? "true" : "false") + "}";
        request->send(200, "application/json", json);
    });
    
    // Toggle LED1
    server.on("/toggle/1", HTTP_GET, [](AsyncWebServerRequest *request) {
        led1State = !led1State;
        digitalWrite(LED1_PIN, led1State);
        String json = "{\"led1\":" + String(led1State ? "true" : "false");
        json += ",\"led2\":" + String(led2State ? "true" : "false") + "}";
        request->send(200, "application/json", json);
    });
    
    // Toggle LED2
    server.on("/toggle/2", HTTP_GET, [](AsyncWebServerRequest *request) {
        led2State = !led2State;
        digitalWrite(LED2_PIN, led2State);
        String json = "{\"led1\":" + String(led1State ? "true" : "false");
        json += ",\"led2\":" + String(led2State ? "true" : "false") + "}";
        request->send(200, "application/json", json);
    });
    
    server.begin();
}

void loop() {
    // Free for other tasks!
    // Đọc sensor, xử lý logic khác không bị block bởi WebServer
}
```

---

## ⚠️ Phần 4: Lỗi thường gặp

| Lỗi | Nguyên nhân | Cách sửa |
|-----|-------------|----------|
| Compile error | Thiếu thư viện ESPAsync | Cài từ GitHub hoặc PlatformIO |
| Crash/reset | Quá nhiều request | Tối ưu HTML, cache |
| CORS error | Cross-origin request | Thêm header CORS nếu cần |
| JSON parse error | Escape character sai | Kiểm tra chuỗi JSON |

### Cách cài ESPAsyncWebServer:
1. Vào https://github.com/me-no-dev/ESPAsyncWebServer
2. Download ZIP → Sketch > Include Library > Add .ZIP Library

---

## 🎓 Phần 5: Tóm tắt

1. **Async WebServer**: Non-blocking, không cần handleClient()
2. **JSON API**: Trả data cho JavaScript xử lý
3. **fetch()**: JavaScript gọi API không reload trang
4. **setInterval()**: Auto-refresh UI định kỳ
5. **PROGMEM**: Lưu HTML trong Flash, tiết kiệm RAM

---', 1);
