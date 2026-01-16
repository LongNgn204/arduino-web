-- 2. SEED LESSONS (Part 1 - Foundation)
DELETE FROM lessons;

INSERT INTO lessons (id, week_id, order_index, title, content, board_support, is_published) VALUES
('l-01-01', 'week-01', 1, 'Giới thiệu Arduino & ESP32', 
'# 1. Phần cứng: Uno vs ESP32
Hãy tưởng tượng **Vi điều khiển** giống như bộ não của robot.
- **Arduino Uno**: Giống như "bộ não cơ bản", bền bỉ, dễ học, dùng 5V.
- **ESP32**: Giống như "bộ não thiên tài" có WiFi/Bluetooth, dùng 3.3V.

## Sơ đồ chân (Pinout)
- **Arduino Uno**: Chân nguồn 5V, GND. Digital 0-13. Analog A0-A5.
- **ESP32**: Dùng điện áp 3.3V. Chân GPIO linh hoạt.', 'both', 1),

('l-01-02', 'week-01', 2, 'Cài đặt Môi trường (IDE)', 
'# 2. Cài đặt Arduino IDE 2.0
1. Tải từ arduino.cc
2. Cài đặt ESP32 Board Manager.
3. Chọn đúng cổng COM.', 'both', 1),

('l-01-03', 'week-01', 3, 'Bài học đầu tiên: Blink LED', 
'# 3. Hello World: Nhấp nháy đèn LED
## Nguyên lý (Ẩn dụ dòng nước)
- **Pin Digital**: Giống cái van nước.
- `HIGH`: Mở van (Đèn sáng).
- `LOW`: Đóng van (Đèn tắt).

```cpp
void setup() { pinMode(2, OUTPUT); }
void loop() { 
  digitalWrite(2, HIGH); delay(1000);
  digitalWrite(2, LOW); delay(1000);
}
```', 'both', 1);
