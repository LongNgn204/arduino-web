# Tuần 0: Nhập môn Điện tử & Linh kiện cơ bản

> **Thời lượng**: 2 tiết lý thuyết + 1 tiết thực hành  
> **Mục tiêu**: Hiểu kiến thức điện tử cơ bản trước khi bắt đầu lập trình Arduino

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

---

## 🔬 Phần 5: Bài thực hành

### Lab 0-1: Tính điện trở cho LED

**Bài toán thực tế:**
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
```

### Lab 0-2: Đọc giá trị điện trở

**Bài tập:** Đọc giá trị các điện trở sau:

1. Vàng - Tím - Đỏ - Vàng kim = ?
2. Nâu - Đen - Cam - Bạc = ?
3. Xanh lá - Xanh dương - Nâu - Vàng kim = ?

<details>
<summary>📝 Đáp án</summary>

1. **Vàng(4) - Tím(7) - Đỏ(x100)** = 4700Ω = **4.7kΩ**
2. **Nâu(1) - Đen(0) - Cam(x1000)** = 10000Ω = **10kΩ**
3. **Xanh lá(5) - Xanh dương(6) - Nâu(x10)** = **560Ω**
</details>

---

## 📋 Phần 6: Quiz tự kiểm tra

### Câu 1:
Công thức định luật Ohm là gì?
- A. V = I / R
- B. V = I × R
- C. I = V × R
- D. R = V × I

<details>
<summary>Đáp án</summary>

**B. V = I × R**
</details>

### Câu 2:
Điện trở có vạch màu: Đỏ - Đỏ - Đỏ - Vàng kim có giá trị bao nhiêu?
- A. 22Ω
- B. 220Ω
- C. 2.2kΩ
- D. 22kΩ

<details>
<summary>Đáp án</summary>

**C. 2.2kΩ**

Giải thích: Đỏ(2) - Đỏ(2) - Đỏ(x100) = 22 × 100 = 2200Ω = 2.2kΩ
</details>

### Câu 3:
LED cắm ngược chiều sẽ như thế nào?
- A. Sáng bình thường
- B. Sáng yếu hơn
- C. Không sáng
- D. Cháy ngay lập tức

<details>
<summary>Đáp án</summary>

**C. Không sáng**

LED là diode, chỉ dẫn điện một chiều. Cắm ngược sẽ không có dòng điện chạy qua.
</details>

---

## 🎓 Tóm tắt kiến thức

| Công thức | Ý nghĩa |
|-----------|---------|
| **V = I × R** | Định luật Ohm |
| **R = (V_nguồn - V_LED) / I** | Tính điện trở hạn dòng LED |

| Màu điện trở | Số |
|--------------|-----|
| Đen, Nâu, Đỏ, Cam, Vàng | 0, 1, 2, 3, 4 |
| Xanh lá, Xanh dương, Tím, Xám, Trắng | 5, 6, 7, 8, 9 |

---

> **Tuần tiếp theo**: Arduino Uno & GPIO - Điều khiển LED bằng code!
