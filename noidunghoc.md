# 0) Chuẩn chung cho toàn khoá (LMS Global)

## 0.1 Chuẩn đầu ra (Learning Outcomes)
Sau 12 tuần, sinh viên có thể:
1) Hiểu cấu trúc hệ thống nhúng (MCU, bộ nhớ, I/O, ngoại vi).  
2) Lập trình Arduino Uno điều khiển GPIO/ADC/PWM và hiển thị.  
3) Giao tiếp UART/I2C/SPI/1-Wire để kết nối ngoại vi.  
4) Đọc cảm biến và xử lý ngưỡng, tạo hệ thống cảnh báo/điều khiển.  
5) (IoT) Điều khiển thiết bị qua WiFi WebServer/Async WebServer.  
6) Hoàn thành bài thi 60 phút: **lắp mạch đúng + code đúng + Serial output đúng format**.

## 0.2 Quy định nộp bài (Submission Rules)
- Mỗi bài thực hành nộp:
  - File code `.ino` (hoặc paste code)  
  - Ảnh mạch/Video ngắn chứng minh chạy đúng (nếu LMS yêu cầu)  
  - Log Serial Monitor (copy/paste) nếu đề yêu cầu format  
- Code phải có:
  - Comment tiếng Việt ngắn gọn tại các khối logic  
  - Tên biến đơn giản, dễ đọc (không “phô trương”)

## 0.3 Rubric chấm bài thực hành (áp dụng chung)
- 60%: đúng chức năng theo đề  
- 20%: đúng thời gian/đúng format Serial/ổn định không treo  
- 10%: sơ đồ nối dây đúng, an toàn (LED có điện trở, GND chung)  
- 10%: code sạch (tách hàm, comment, không copy/paste quá nhiều)

## 0.4 Checklist debug chuẩn (dành cho SV)
1) Cáp USB có dữ liệu?  
2) Chọn đúng Board/Port trong Arduino IDE?  
3) Mạch có GND chung? LED có điện trở?  
4) Dùng Serial để kiểm tra input có đọc đúng?  
5) Nếu lỗi: test tối thiểu (blink LED 13) → rồi ghép dần.

---

# 1) TUẦN 01 — Tổng quan hệ thống nhúng & GPIO (LED)  
*(Theo LMS: “Tổng quan về hệ thống nhúng - Điều khiển led”) — (5/1 - 11/1/2026)*

## 1.1 Mục tiêu tuần
- Biết Arduino Uno là gì, cấu trúc `setup()` và `loop()`.  
- Điều khiển LED đơn và nhiều LED theo quy luật thời gian.  
- Rèn tư duy vòng lặp, mảng pin, tách hàm.

## 1.2 Lý thuyết cốt lõi (Theory)
- Khái niệm hệ thống nhúng; vai trò MCU.  
- GPIO digital output: `pinMode`, `digitalWrite`.  
- LED + điện trở hạn dòng (220Ω/330Ω).  
- `delay(ms)` và tính “blocking” (tuần sau sẽ học cách tốt hơn).

### Mini-lecture (giọng giảng viên)
- “Arduino là MCU chạy vòng lặp vô hạn. `setup()` chạy đúng 1 lần để khởi tạo, còn `loop()` chạy mãi.”  
- “Trong nhúng, ta mô tả: **Input** (nút/cảm biến) → **Process** (logic) → **Output** (LED/relay/màn hình).”

## 1.3 Pin map & mạch
- LED1..LED5: D2, D3, D4, D5, D6 (mỗi LED có điện trở).  
- Chân còn lại LED về GND.

## 1.4 Thực hành (Drills & Lab)
### Drills: Khởi động
- Bật/tắt LED thủ công (Hello World).
- Điều khiển tốc độ nháy qua biến.

### Bài 1-1: Điều khiển LED theo quy luật thời gian
**Yêu cầu:**
1) Bật 1s, tắt 1s, lặp 5 lần.  
2) Bật 3s, tắt 0,5s, lặp 5 lần.  
3) Bật 0,5s, tắt 3s, lặp 5 lần.  

**Gợi ý chuẩn hoá code:** viết hàm `blinkN(tOnMs, tOffMs, n)` và gọi 3 lần.

**Tiêu chí PASS:** đúng số lần lặp, đúng khoảng thời gian (sai số nhỏ do chạy thực tế).

---

### Bài 1-2: Điều khiển 5 LED (D2–D6) theo quy tắc
**Yêu cầu:**
- Bật tuần tự LED1→LED5, cách 1s giữa các LED.  
- Giữ tất cả LED sáng 5s.  
- Tắt tuần tự LED5→LED1, cách 1s.

**Tiêu chí PASS:** đúng thứ tự, đúng delay, không bỏ sót LED.

---

### Bài 1-3: Điều khiển 5 LED (D2–D6) “duy nhất một LED sáng”
**Yêu cầu:**
- Duy nhất 1 LED sáng chạy 1→5, trễ 1s.  
- Duy nhất 1 LED sáng chạy 5→1, trễ 0,5s.

**Tiêu chí PASS:** luôn chỉ có 1 LED sáng tại mọi thời điểm.

## 1.5 Quiz (CD1 — Trắc nghiệm) — gợi ý ngân hàng 10 câu
1) `setup()` chạy mấy lần?  
2) `loop()` hoạt động thế nào?  
3) Vì sao LED cần điện trở?  
4) HIGH/LOW ứng với gì?  
5) Lỗi phổ biến khi LED không sáng?  
6) Cách dùng mảng pin giúp gì?  
7) `delay()` có nhược điểm gì?  
8) GND chung là gì?  
9) Phân biệt OUTPUT/INPUT?  
10) Vì sao nên tách hàm?

## 1.6 Ôn thi 60 phút (Exam practice)
**Đề mô phỏng:** 8 LED chạy “ping-pong” 1→8→1, tốc độ cố định.  
**Yêu cầu chấm:** đúng pattern, code gọn (mảng pin + vòng for), comment rõ.

---

# 2) TUẦN 02 — Thiết kế hệ thống nhúng & LED 7 đoạn  
*(Theo LMS: “Lý thuyết thiết kế hệ thống nhúng - Điều khiển LED 7 đoạn”)*

## 2.1 Mục tiêu tuần
- Hiểu Top-Down vs Bottom-Up, cách thiết kế bài nhúng.  
- Điều khiển LED 7 đoạn (1 số) và module 4 số (quét).  
- (Nếu có) điều khiển module 4 số qua 74HC595.

## 2.2 Lý thuyết cốt lõi
- Top-Down: yêu cầu → module → thiết kế → tích hợp → test.  
- Bottom-Up: thử nghiệm module trước rồi ghép hệ thống.  
- LED 7 đoạn: common cathode/anode (đảo logic).  
- Multiplexing: quét digit nhanh để hiển thị 4 số ổn định.  
- 74HC595: shift register, giảm số chân điều khiển.


## 2.3 Thực hành (Drills & Lab)
### Drills: Khởi động
- Sáng 1 thanh LED bất kỳ.
- Hiển thị số "1" (B+C).
- Nhấp nháy số "8".

### Bài 2-1: LED 7 đoạn (1 số)
**Yêu cầu:**
- Hiển thị 0→9, trễ 2s.  
- Hiển thị 0→9 rồi 9→0, trễ 2s.  
- Hiển thị các số chẵn: 0,2,4,6,8 và số lẻ: 1,3,5,7.

**Tiêu chí PASS:** hiển thị đúng số, không sai segment.

---

### Bài 2-2: Mô đun 4 LED 7 đoạn
**Yêu cầu:**
- Hiển thị số tự nhiên 0→9999, trễ 0,3s.  
- Hiển thị số chẵn 0→9998, trễ 0,3s.

**Tiêu chí PASS:** quét đủ nhanh (không nhấp nháy rõ), số đúng.

---

### Bài 2-3: Module 4 LED 7 đoạn + 74HC595
**Yêu cầu:**
- Hiển thị 0–9 trên tất cả chữ số.  
- Đếm tăng 0→9999, trễ 0,2s.  
- Đếm giảm 9999→0, trễ 0,2s.  
- Nháy cả 4 led 4 lần, chu kỳ nháy 2s.

**Tiêu chí PASS:** đúng logic shift + latch, hiển thị mượt.

## 2.4 Quiz (CD2 — gợi ý 10 câu)
- Multiplexing là gì?  
- Common anode/cathode khác nhau ở mức logic?  
- Vì sao cần bảng mã segment?  
- 74HC595 có tác dụng gì?  
- Nếu quét chậm sẽ thấy hiện tượng gì? …

## 2.5 Ôn thi 60 phút
**Đề mô phỏng:** hiển thị 00→99, nút nhấn tăng/giảm; nháy khi bội 5.  
**Chấm:** không miss nút (debounce), hiển thị không flicker.

---

# 3) TUẦN 03 — Input: Nút nhấn & Keypad  
*(Theo LMS: “Phần cứng hệ thống nhúng - Đọc nút nhấn và keypad”)*

## 3.1 Mục tiêu tuần
- Đọc nút nhấn đúng, chống dội, bắt cạnh.  
- Keypad đọc ký tự và chuỗi, làm bài mật khẩu.

## 3.2 Lý thuyết cốt lõi
- INPUT_PULLUP: không nhấn HIGH, nhấn LOW (đảo logic).  
- Debounce 20–50ms.  
- Edge detection (phát hiện nhấn mới) để đếm lần nhấn.  
- Keypad: quét hàng/cột, mapping phím.


## 3.3 Thực hành (Drills & Lab)
### Drills: Khởi động
- Serial Monitor xem raw signal.
- Đèn PIN (nhấn sáng, nhả tắt).
- Toggle lỗi (để thấy debounce).

### Bài 3-1: Nhấn → LED bật, nhả → LED tắt
**Serial format bắt buộc:**
- Trạng thái nút ấn: (1 - nhấn, 0 - không nhấn)  
- Trạng thái led: (bật / tắt)

---

### Bài 3-2: Đếm số lần nhấn, lẻ bật, chẵn tắt
**Serial format bắt buộc:**
- Số lần nhấn nút: xx  
- Trạng thái led: (bật / tắt)

---

### Bài 3-3: Keypad đọc 1 ký tự
**Serial format:** `Kí tự vừa nhập: ____`

---

### Bài 3-4: Keypad điều khiển 5 LED theo mapping
- nhấn 1 → bật led1; nhấn 2 → tắt led1  
- nhấn 3 → bật led2; nhấn 4 → tắt led2  
- nhấn 5 → bật led3; nhấn 6 → tắt led3  
- nhấn 7 → bật led4; nhấn 8 → tắt led4  
- nhấn 9 → bật led5; nhấn 0 → tắt led5

---

### Bài 3-5: Keypad password (kết thúc bằng `#`)
- Mật khẩu đúng: bật LED xanh; Serial: `Mật khẩu đúng`  
- Mật khẩu sai: bật LED đỏ; Serial: `Mật khẩu sai`

## 3.4 Quiz (CD3 — gợi ý 10 câu)
- Vì sao debounce cần thiết?  
- INPUT_PULLUP đảo logic ra sao?  
- “Bắt cạnh” là gì? …

## 3.5 Ôn thi 60 phút
**Đề mô phỏng:** nhập mã PIN bằng keypad, đúng mở LED xanh + buzzer ngắn, sai LED đỏ + buzzer dài.

---

# 4) TUẦN 04 — Analog input/output: ADC & PWM  
*(Theo LMS: “Phần mềm hệ thống nhúng - Nhập và xuất tín hiệu tương tự”)*

## 4.1 Mục tiêu tuần
- Đọc pot raw/V/%; PWM điều khiển độ sáng.  
- Điều khiển chu kỳ nháy theo pot.  
- Điều khiển 7 LED theo 3 chế độ %.

## 4.2 Lý thuyết cốt lõi
- ADC 10-bit: 0..1023.  
- Điện áp: `V = raw * 5.0 / 1023`.  
- PWM: `analogWrite(0..255)` trên chân PWM (3,5,6,9,10,11).  
- Map & clamp giá trị.

## 4.3 Thực hành (Lab) — đúng đề LMS
### Bài 4-1: Đọc điện áp pot — 3 dạng
- Raw (analogRead)  
- Điện áp (V)  
- %

---

### Bài 4-2: PWM độ sáng LED theo pot
Serial bắt buộc:
- Raw  
- % đã xử lý  
- Vout tính theo V

---

### Bài 4-3: Điều khiển tốc độ nháy theo pot
- Chu kỳ bật/tắt từ 0,1s (pot=1023) đến 1s (pot=0).  
Serial bắt buộc:
- % pot  
- Chế độ LED (bật/tắt hiện hành)  
- Chu kỳ (Ton + Toff)

---

### Bài 4-4: 7 LED (D2→D8) theo pot, 3 chế độ
- <30%: chạy 2→8  
- >70%: chạy 8→2  
- 31–69%: chạy từ giữa ra hai phía (5→8 và 5→2)  
Serial bắt buộc:
- % pot  
- chế độ hiện hành

## 4.4 Quiz (CD4 — gợi ý)
- ADC là gì?  
- PWM là gì? Vì sao gọi là “analog giả”?  
- Vì sao chỉ một số chân có PWM? …

## 4.5 Ôn thi 60 phút
**Đề mô phỏng:** pot điều khiển số LED sáng + LED13 nháy theo tốc độ tỉ lệ nghịch %.

---

# 5) TUẦN 05 — Thực hành tích hợp I/O  
*(Theo LMS: “Thực hành: Lập trình điều khiển kết hợp I/O”)*

## 5.1 Mục tiêu tuần
- Ghép nút + pot + LED + 7-seg thành hệ thống.  
- Làm quen “state/mode” (cơ bản), giảm lỗi khi thi.

## 5.2 Thực hành (Lab) — đúng đề LMS
### Bài 5-1: LED trang trí theo pot
- pot <25%: LED1→LED8, lặp 3 lần  
- pot >75%: LED8→LED1, lặp 3 lần  
- 25–75%: sáng từ 2 phía (LED1→LED4 và LED8→LED5)

### Bài 5-2: Số lượng LED sáng theo pot
- chia 10%  
- pot >=20% → LED1 sáng  
- mỗi +10% thêm 1 LED

### Bài 5-3: LED trang trí theo số lần nhấn
- nhấn 1 lần: chạy 1→8  
- nhấn 2 lần: chạy 8→1  
- nhấn 3 lần: như nhấn 1…

### Bài 5-4: Hiển thị % pot (00→99) bằng 4 LED 7 đoạn  
### Bài 5-5: Hiển thị số lần nhấn (00→99) bằng 4 LED 7 đoạn  
### Bài 5-6: 4 LED 7 đoạn theo nút: nhấn 1 lần đếm tăng 00→99; nhấn 2 lần đếm giảm 99→00

## 5.3 Ôn thi 60 phút
**Đề mô phỏng:** 2 nút A/B: A đổi mode hiển thị (pot%/count), B reset; hiển thị 00–99; không miss nút.

---

# 6) TUẦN 06 — Cảm biến trong hệ thống nhúng  
*(Theo LMS: “Cảm biến trong hệ thống nhúng”)*

## 6.1 Mục tiêu tuần
- Đọc HC-SR04, DHT11, PIR, TTP223.  
- Điều khiển cảnh báo theo ngưỡng; Serial đúng format.

## 6.2 Thực hành (Lab) — đúng đề LMS
### Bài 6-1: HC-SR04 + 8 LED chọn chương trình theo khoảng cách
- <30cm: chương trình 1: chạy led1→led8  
- >80cm: chương trình 2: chạy led8→led1  
- 30–80cm: chương trình 3: bật/tắt 8 led chu kỳ 1s  
Serial: `Khoảng cách __ cm -> Chương trình __`

### Bài 6-2: HC-SR04 cảnh báo màu (xanh/vàng/đỏ)
- >60cm: an toàn, bật led xanh  
- 30–60cm: cảnh báo, bật led vàng  
- <30cm: nguy hiểm, bật led đỏ  
Serial: `Khoảng cách __ cm. trạng thái an toàn/cảnh báo/nguy hiểm`

### Bài 6-3: HC-SR04 số led bật theo khoảng cách
- 20cm bật 1 LED  
- mỗi +10cm thêm 1 LED, tối đa 8  
Serial: `Khoảng cách __ cm. Số led bật __`

### Bài 6-4: DHT11 giám sát nhiệt độ/độ ẩm theo ngưỡng
- 2 dưới ngưỡng → xanh  
- 1 vượt ngưỡng → vàng  
- 2 vượt ngưỡng → đỏ  
Serial: `Nhiệt độ: __ C. Độ ẩm: __ %. Màu led đang bật.`

### Bài 6-5: 2 TTP223 tăng/giảm (0..9) + hiển thị 7 đoạn
- chạm A tăng, chạm B giảm  
- chặn biên 0..9  
Serial: `Đã chạm cảm biến: __ , tổng số lần chạm: __ lần.`

### Bài 6-6: PIR kích hoạt LED + relay còi
- Có tín hiệu: `Có di chuyển trong phạm vi giám sát. Kích hoạt báo động`  
- Không: `An toàn`

## 6.3 Quiz (CD6 — gợi ý)
- HC-SR04 đo như thế nào?  
- DHT11 trả dữ liệu gì?  
- PIR phát hiện gì? …

## 6.4 Ôn thi 60 phút
**Đề mô phỏng:** cảm biến khoảng cách + 3 mức đèn + relay còi ở mức nguy hiểm + Serial log đúng format.

---

# 7) TUẦN 07 — Serial UART  
*(Theo LMS: “Giao thức kết nối nối tiếp (serial)”)*

## 7.1 Mục tiêu tuần
- Hiểu UART, baudrate, Serial Monitor.  
- Thiết kế lệnh điều khiển đơn giản PC↔Arduino.  
- (Nâng cao) Arduino↔Arduino.

## 7.2 Thực hành (Lab) — đúng đề LMS
- **7.1**: đọc pot và hiển thị kết quả trên máy tính.  
- **7.2**: gửi dữ liệu từ PC → Arduino qua Serial Monitor để điều khiển.  
- **7.3**: giao tiếp Serial giữa 2 Arduino.

## 7.3 Chuẩn giao thức lệnh (đề xuất LMS để thống nhất lớp)
- `LED1=ON`, `LED1=OFF`  
- `PWM=0..255`  
- Arduino phản hồi: `OK` hoặc `ERR` + trạng thái

## 7.4 Ôn thi 60 phút
**Đề mô phỏng:** lệnh Serial điều khiển 2 LED + trả telemetry pot `raw,pct` dạng CSV.

---

# 8) TUẦN 08 — I2C  
*(Theo LMS: “Giao thức kết nối I2C”)*

## 8.1 Mục tiêu tuần
- Biết SDA/SCL (Uno: A4/A5).  
- Quét địa chỉ I2C, dùng LCD1602 I2C.  
- Uno–Uno I2C Master/Slave.

## 8.2 Thực hành (Lab) — đúng đề LMS
- **8-1**: xác định địa chỉ Slave LCD1602 (I2C scanner).  
- **8-2**: hiển thị nội dung trên LCD1602 (I2C).  
- **8-3**: kết nối và điều khiển Arduino Uno qua I2C.

## 8.3 Ôn thi 60 phút
**Đề mô phỏng:** hiển thị pot raw/V/% lên LCD; nút nhấn đổi chế độ hiển thị; Serial backup log.

---

# 9) TUẦN 09 — SPI  
*(Theo LMS: “Giao thức kết nối SPI” — LMS không cung cấp chi tiết bài, dưới đây là **đề xuất chuẩn hoá** để nhập nội dung.)*

## 9.1 Mục tiêu tuần
- Hiểu SPI: MOSI/MISO/SCK/SS, master–slave, tốc độ.  
- Điều khiển thiết bị qua SPI (thực tế thường dùng 74HC595 / MAX7219).

## 9.2 Lý thuyết cốt lõi
- SPI truyền đồng bộ theo xung clock SCK.  
- 1 master điều khiển nhiều slave bằng SS/CS.  
- Ưu/nhược so với I2C (tốc độ vs số dây).

## 9.3 Thực hành (Lab) — đề xuất 2 lựa chọn
> **Lựa chọn A (phổ biến, dễ kit): 74HC595 điều khiển 8 LED**  
- **9-A1**: chạy pattern 8 LED (binary count 0→255).  
- **9-A2**: “LED đuổi” 1→8→1 qua 74HC595.  
- **9-A3**: nhận lệnh Serial `PATTERN=1/2` đổi pattern.

> **Lựa chọn B (nếu có): LED Matrix/MAX7219**  
- **9-B1**: hiển thị ký tự/biểu tượng đơn giản.  
- **9-B2**: cuộn chữ (scroll) 1 dòng.

## 9.4 Ôn thi 60 phút
**Đề mô phỏng:** SPI + 74HC595: chạy 2 pattern, nút nhấn đổi pattern, Serial in mode.

---

# 10) TUẦN 10 — 1-Wire  
*(Theo LMS: “Giao thức kết nối 1-wired” — LMS không cung cấp chi tiết bài, dưới đây là **đề xuất chuẩn hoá**.)*

## 10.1 Mục tiêu tuần
- Hiểu 1-Wire: 1 dây data, địa chỉ ROM, nhiều thiết bị chung bus.  
- Thực hành DS18B20 (phổ biến nhất).

## 10.2 Thực hành (Lab) — đề xuất chuẩn
- **10-1**: đọc nhiệt độ DS18B20, in Serial: `T=__C`.  
- **10-2**: 3 mức LED theo ngưỡng nhiệt độ (xanh/vàng/đỏ).  
- **10-3** (nâng cao): nhiều DS18B20 trên 1 bus, in ra từng sensor theo ROM.

## 10.3 Ôn thi 60 phút
**Đề mô phỏng:** đo nhiệt độ + cảnh báo 3 mức + hiển thị lên LCD I2C (nếu có).

---

# 11) TUẦN 11 — WiFi WebServer (Cơ bản)  
*(Theo LMS: “Giao tiếp WIFI - chế độ WebServer”)*

## 11.1 Mục tiêu tuần
- Bật/tắt LED từ xa qua mạng LAN bằng webserver cơ bản.  
- UI đúng tiêu đề + nút theo đề bài.

## 11.2 Ghi chú phần cứng (quan trọng để nhập LMS đúng thực tế)
- Arduino Uno **không có WiFi tích hợp**. Để làm WebServer ổn định, khuyến nghị dùng **ESP8266/ESP32**.  
- Nếu lớp yêu cầu “Uno + module WiFi AT command” thì nội dung sẽ phức tạp hơn.  
→ Khi seed LMS, nên ghi rõ thiết bị WiFi được dùng trong lớp (ESP8266/ESP32).

## 11.3 Thực hành (Lab) — đúng đề LMS
### Bài 11.1
- Trang web tiêu đề: `Hệ thống bật / tắt Led – WebServer cấu hình cơ bản`  
- Nút ON và OFF tương ứng trạng thái.

### Bài 11.2
- Tiêu đề: `Hệ thống bật / tắt 2 Led – WebServer cấu hình cơ bản`  
- Có khu vực LED1 và LED2  
- Nút hiển thị `BAT`/`TAT` đúng trạng thái hiện hành.

## 11.4 Ôn thi 60 phút
**Đề mô phỏng:** web điều khiển 2 LED + endpoint `/state` trả trạng thái; refresh không làm mất trạng thái.

---

# 12) TUẦN 12 — WiFi Async WebServer (Không đồng bộ)  
*(Theo LMS: “Giao tiếp WIFI - chế độ Asynchronous Webserver”)*

## 12.1 Mục tiêu tuần
- Hiểu sync vs async, tối ưu responsiveness.  
- Làm hệ thống IoT realtime hơn (cơ sở cho dashboard).

## 12.2 Thực hành (Lab) — đúng đề LMS
### Bài 12.1
- Tiêu đề: `Hệ thống bật / tắt Led – WebServer cấu hình không đồng bộ`  
- Nút ON/OFF.

### Bài 12.2
- Tiêu đề: `Hệ thống bật / tắt 2 Led – WebServer cấu hình không đồng bộ`  
- LED1/LED2; nút `BAT/TAT` theo trạng thái.

## 12.3 Ôn thi 60 phút
**Đề mô phỏng:** async web điều khiển 2 LED + web fetch cập nhật UI định kỳ; trạng thái realtime ổn định.

---

# 13) (MỞ RỘNG) — WiFi WebSocket / Mobile / Google App
*(LMS có mục 13, 14: WebSocket, Ứng dụng di động, Google App. Phần này có thể seed như “Optional Module”.)*

## 13.1 WebSocket
- UI realtime, push trạng thái sensor không cần refresh.

## 13.2 Ứng dụng di động
- App điều khiển/giám sát (Flutter/React Native).

## 13.3 Google App
- Google Sheet dashboard + Apps Script làm giao diện điều khiển.

---

# 14) Gợi ý “Bổ sung” để LMS/Website đạt chất lượng dạy-học tốt hơn (khuyến nghị)
1) **Trang “Driver & Port”** (Windows/macOS/Linux): CH340/CP210x, cách chọn COM/Port, lỗi cáp chỉ sạc.  
2) **Pinout Arduino Uno**: trang tra cứu nhanh (PWM, I2C, SPI, UART).  
3) **Checklists từng tuần**: “đi thi nhớ mang gì”, “test nhanh trước khi nộp”.  
4) **Mẫu báo cáo lab**: mục tiêu, mạch, thuật toán, code, kết quả, lỗi gặp & cách sửa.  
5) **Ngân hàng đề thi 60 phút**: mỗi tuần 1–2 đề mô phỏng, có rubric chấm.  
6) **Thư viện chuẩn lớp** (nếu dùng): Keypad, LiquidCrystal_I2C, DHT… (ghi version).
