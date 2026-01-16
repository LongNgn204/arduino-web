-- ==========================================
-- LMS CONTENT SEED 2026 (DUAL-BOARD)
-- Chú thích: 12 Weeks, 5 Topics, Support Uno & ESP32, Beginner Friendly
-- Run: npx wrangler d1 execute arduino-db --local --file=src/db/seed_lms_2026.sql
-- ==========================================

-- Clean up old content
DELETE FROM lessons;
DELETE FROM labs;
DELETE FROM weeks;
DELETE FROM topics;
DELETE FROM courses;

-- 1. SEED COURSE
INSERT INTO courses (id, code, title, description, is_published) 
VALUES ('course-01', 'IOT2026', 'Lập trình IoT & Hệ thống nhúng (2026 Update)', 'Khóa học toàn diện từ cơ bản đến nâng cao với Arduino Uno và ESP32.', true);

-- 2. SEED TOPICS (5 Pillars)
INSERT INTO topics (id, course_id, order_index, title, description, icon) VALUES
('topic-01', 'course-01', 1, 'Nền tảng (Foundation)', 'Làm quen với GPIO, LED và tư duy lập trình nhúng.', 'layers'),
('topic-02', 'course-01', 2, 'Cảm biến & Logic', 'Đọc dữ liệu môi trường, xử lý tín hiệu và điều khiển động cơ.', 'activity'),
('topic-03', 'course-01', 3, 'Giao tiếp (Communication)', 'Kết nối thiết bị qua Serial, I2C, SPI.', 'cpu'),
('topic-04', 'course-01', 4, 'IoT & Cloud (Advanced)', 'Kết nối WiFi, MQTT, App điều khiển và Dashboard.', 'wifi'),
('topic-05', 'course-01', 5, 'Dự án (Capstone)', 'Xây dựng sản phẩm hoàn chỉnh.', 'box');

-- 3. SEED WEEKS (Mapped to Topics)
INSERT INTO weeks (id, course_id, week_number, topic_id, title, overview, is_published) VALUES
-- Topic 1: Foundation
('week-01', 'course-01', 1, 'topic-01', 'Hello World & GPIO', 'Làm quen với Arduino IDE, Cấu trúc Code, và Điều khiển LED đơn.', true),
('week-02', 'course-01', 2, 'topic-01', 'Digital I/O & Logic', 'Nút nhấn, Điện trở treo (Pull-up) và Tư duy Logic.', true),
('week-03', 'course-01', 3, 'topic-01', 'Analog & PWM', 'Đọc biến trở (ADC) và Điều khiển độ sáng LED (Fading).', true),
('week-04', 'course-01', 4, 'topic-01', 'Hiển thị cơ bản', 'LED 7 đoạn và Màn hình LCD 1602.', true),
-- Topic 2: Sensors & Logic
('week-05', 'course-01', 5, 'topic-02', 'Cảm biến Môi trường', 'Nhiệt độ (DHT11), Ánh sáng (LDR), Khoảng cách (Ultrasonic).', true),
('week-06', 'course-01', 6, 'topic-02', 'Động cơ & Actuators', 'Servo Motor, Động cơ bước và Relay.', true),
-- Topic 3: Communication
('week-07', 'course-01', 7, 'topic-03', 'Giao tiếp Serial (UART)', 'Gửi nhận dữ liệu giữa Arduino và Máy tính.', true),
('week-08', 'course-01', 8, 'topic-03', 'Giao thức I2C & SPI', 'Kết nối nhiều thiết bị: OLED, RTC, Thẻ nhớ.', true),
-- Topic 4: IoT (ESP32 Focus)
('week-09', 'course-01', 9, 'topic-04', 'WiFi & Web Server', 'Biến ESP32 thành Website điều khiển thiết bị.', true),
('week-10', 'course-01', 10, 'topic-04', 'Giao thức MQTT', 'Kết nối Broker, Pub/Sub thời gian thực.', true),
('week-11', 'course-01', 11, 'topic-04', 'IoT App & Dashboard', 'Điều khiển từ điện thoại qua App (Blynk/Custom).', true),
-- Topic 5: Capstone
('week-12', 'course-01', 12, 'topic-05', 'Dự án Cuối khóa', 'Thiết kế và xây dựng hệ thống IoT hoàn chỉnh.', true);

-- 4. SEED LESSONS (Rich Content with Visual Metaphors)
INSERT INTO lessons (id, week_id, order_index, title, content, board_support, is_published) VALUES

-- WEEK 1: Hello World
('l-01-01', 'week-01', 1, 'Giới thiệu Arduino & ESP32', 
'# 1. Phần cứng: Uno vs ESP32
Hãy tưởng tượng **Vi điều khiển** giống như bộ não của robot.
- **Arduino Uno**: Giống như "bộ não cơ bản", bền bỉ, dễ học, dùng 5V. Thích hợp để bắt đầu.
- **ESP32**: Giống như "bộ não thiên tài" có tích hợp WiFi/Bluetooth, dùng 3.3V, nhanh hơn gấp 10 lần.

## Sơ đồ chân (Pinout)
### Arduino Uno
- **Chân Nguồn (Power)**: 5V (Dây đỏ), GND (Dây đen - Cực âm).
- **Digital (0-13)**: Chỉ hiểu 2 trạng thái BẬT/TẮT.
- **Analog (A0-A5)**: Đo được điện áp thay đổi (như volume).

### ESP32
- Lưu ý quan trọng: ESP32 dùng điện áp **3.3V**. Cắm vào 5V có thể làm hỏng chip!
- Chân GPIO linh hoạt hơn nhiều.', 'both', true),

('l-01-02', 'week-01', 2, 'Cài đặt Môi trường (IDE)', 
'# 2. Cài đặt Arduino IDE 2.0
Chúng ta sẽ dùng phần mềm Arduino IDE để viết mã ("ra lệnh") cho bo mạch.

1. Tải về từ arduino.cc
2. Cài đặt Driver CH340 (nếu dùng chip nạp giá rẻ).
3. **Cài đặt ESP32 Board Manager**:
   - Vào Preferences → Additional Boards Manager URLs.
   - Dán link package ESP32.
   - Vào Board Manager → Tìm "esp32" → Install.

## Chọn cổng COM
Khi cắm bo mạch vào, máy tính sẽ nhận diện một cổng COM (VD: COM3).
Chọn đúng: Tools → Port → COM...', 'both', true),

('l-01-03', 'week-01', 3, 'Bài học đầu tiên: Blink LED', 
'# 3. Hello World: Nhấp nháy đèn LED
Đây là bài học "vỡ lòng" của mọi lập trình viên nhúng.

## Nguyên lý (Ẩn dụ dòng nước)
- **Pin Digital**: Giống cái van nước.
  - `HIGH` (Mở van): Điện 5V chảy ra → Đèn sáng.
  - `LOW` (Đóng van): Ngắt điện (0V) → Đèn tắt.
- **Delay**: Giữ nguyên trạng thái van trong một khoảng thời gian.

## Code mẫu (Chung cho cả 2)
```cpp
// Dùng chân LED có sẵn trên bo mạch (thường là 13 hoặc 2)
#define LED_PIN 2 

void setup() {
  pinMode(LED_PIN, OUTPUT); // Cấu hình chân là "Cổng ra"
}

void loop() {
  digitalWrite(LED_PIN, HIGH); // Bật đèn
  delay(1000);                 // Chờ 1 giây
  digitalWrite(LED_PIN, LOW);  // Tắt đèn
  delay(1000);                 // Chờ 1 giây
}
```', 'both', true),

-- WEEK 2: Digital I/O
('l-02-01', 'week-02', 1, 'Input: Nút nhấn', 
'# 1. Nút nhấn (Button)
Nếu đèn LED là cái miệng để nói, thì Nút nhấn là cái tai để nghe.

## Vấn đề "thả nổi" (Floating)
Khi chưa nhấn nút, chân tín hiệu ở trạng thái "lơ lửng", không phải 0V cũng không phải 5V. Nó giống như cái ăng-ten thu nhiễu, làm đèn nhấp nháy loạn xạ.

## Giải pháp: Điện trở treo (Pull-up/Pull-down)
- **INPUT_PULLUP**: Arduino có sẵn điện trở bên trong để "kéo" tín hiệu lên 5V khi chưa nhấn nút.
- Khi nhấn nút nối đất (GND), tín hiệu sẽ tụt xuống LOW (0V).

```cpp
void setup() {
  pinMode(2, INPUT_PULLUP); // Chân nút nhấn
  pinMode(13, OUTPUT);      // Chân đèn
}

void loop() {
  int trang_thai = digitalRead(2);
  if (trang_thai == LOW) { // Nút ĐANG ĐƯỢC NHẤN (do nối GND)
    digitalWrite(13, HIGH);
  } else {
    digitalWrite(13, LOW);
  }
}
```', 'both', true),

-- WEEK 3: Analog & PWM
('l-03-01', 'week-03', 1, 'ADC: Đọc tín hiệu Analog', 
'# 1. Analog vs Digital
- **Digital**: Cầu thang bộ (Bước 1, Bước 2...). Chỉ có các nấc cố định.
- **Analog**: Dốc trượt. Mượt mà, liên tục.

## ADC (Analog to Digital Converter)
Bo mạch cần bộ ADC để chuyển tín hiệu mượt (Analog) thành các con số (Digital) để xử lý.
- **Uno (10-bit)**: Giá trị từ 0 đến 1023 (0 -> 5V).
- **ESP32 (12-bit)**: Giá trị từ 0 đến 4095 (0 -> 3.3V).

## Đọc biến trở
```cpp
void loop() {
  int giatri = analogRead(A0);
  // Uno: 0-1023
  // ESP32: 0-4095
  Serial.println(giatri);
  delay(100);
}
```', 'both', true),

('l-03-02', 'week-03', 2, 'PWM: Giả lập Analog', 
'# 2. PWM (Pulse Width Modulation)
Làm sao để làm đèn sáng mờ (2.5V) khi chân Digital chỉ có 0V và 5V?
→ Chúng ta BẬT/TẮT cực nhanh!

- **Duty Cycle**: Tỷ lệ thời gian BẬT trong một chu kỳ.
  - 50% Bật / 50% Tắt → Đèn sáng trung bình (giống 2.5V).
  - 10% Bật / 90% Tắt → Đèn sáng mờ.

## Lệnh analogWrite
- **Uno**: `analogWrite(pin, 0-255)`
- **ESP32**: Dùng `ledcWrite` (phức tạp hơn chút, nhưng mạnh hơn).

```cpp
// Code Uno
analogWrite(3, 127); // Độ sáng 50%
```', 'both', true),

-- WEEK 9: WiFi & Web Server (ESP32 Focus)
('l-09-01', 'week-09', 1, 'Kết nối WiFi (ESP32)', 
'# 1. Station Mode vs AP Mode
- **Station (STA)**: ESP32 kết nối vào wifi nhà bạn (như điện thoại).
- **Access Point (AP)**: ESP32 tự phát wifi riêng (như cục router).

## Code kết nối WiFi cơ bản
```cpp
#include <WiFi.h>

const char* ssid = "Ten_Wifi";
const char* password = "Mat_Khau";

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("Da ket noi WiFi!");
  Serial.println(WiFi.localIP());
}
```', 'esp32', true),

('l-09-02', 'week-09', 2, 'Tạo Web Server điều khiển LED', 
'# 2. Web Server đơn giản
Biến ESP32 thành một trang web có nút BẬT/TẮT đèn. Bạn có thể truy cập bằng điện thoại cùng mạng wifi.

1. ESP32 lắng nghe cổng 80 (HTTP).
2. Khi có ai truy cập IP, ESP32 gửi lại mã HTML (giao diện web).
3. Khi bấm nút trên web, trình duyệt gửi yêu cầu `/on` hoặc `/off`.
4. ESP32 nhận yêu cầu và điều khiển LED.', 'esp32', true),

-- WEEK 10: MQTT (IoT Protocol)
('l-10-01', 'week-10', 1, 'MQTT là gì?', 
'# 1. Giao thức MQTT
HTTP (Web) giống như gửi thư tín: Phải gửi yêu cầu mới có trả lời. Rất chậm cho IoT.
MQTT giống như **Group Chat**:
- **Broker**: Ông chủ phòng chat (Server trung gian).
- **Publish (Gửi tin)**: Cảm biến gửi nhiệt độ lên.
- **Subscribe (Đăng ký)**: Điện thoại đăng ký nhận tin nhiệt độ.

Khi nhiệt độ thay đổi, Broker báo ngay cho điện thoại. Rất nhẹ và nhanh.', 'esp32', true);

-- 5. SEED LABS (Hands-on)
INSERT INTO labs (id, week_id, order_index, title, objective, instructions, wiring, duration, board_support, is_published) VALUES

-- Week 1 Lab
('lab-01', 'week-01', 1, 'Lab 1: Blink & SOS', 
'Lập trình đèn LED nhấp nháy theo tín hiệu SOS.', 
'# Hướng dẫn
1. Kết nối LED với chân D13 (hoặc dùng LED tích hợp).
2. Viết hàm `dot()`: nháy ngắn (200ms).
3. Viết hàm `dash()`: nháy dài (600ms).
4. Trong loop: 3 dot - 3 dash - 3 dot (S-O-S).

> Gợi ý: Dùng `delay()` để chỉnh thời gian.',
'Nối chân Dương (Dài) của LED vào D13, chân Âm (Ngắn) vào GND.', 
30, 'both', true),

-- Week 5 Lab (Sensors)
('lab-05', 'week-05', 1, 'Lab 5: Trạm đo nhiệt độ', 
'Đọc cảm biến DHT11 và hiển thị lên Serial Monitor.',
'# Hướng dẫn
1. Cài thư viện "DHT sensor library".
2. Khai báo đối tượng `DHT dht(DHTPIN, DHTTYPE);`.
3. Trong loop, dùng `dht.readTemperature()` và `dht.readHumidity()`.
4. In kết quả đẹp mắt ra Serial Monitor.

## Thử thách
Nếu nhiệt độ > 30 độ, bật đèn LED cảnh báo đỏ.',
'VCC -> 5V/3.3V, GND -> GND, DATA -> D2 (kèm điện trở 10k nếu cần).',
45, 'both', true),

-- Week 9 Lab (WiFi)
('lab-09', 'week-09', 1, 'Lab 9: Điều khiển LED qua WiFi',
'Tạo Web Server có 2 nút ON/OFF để điều khiển LED từ điện thoại.',
'# Hướng dẫn
1. Copy code mẫu Web Server.
2. Thay đổi SSID/Pass wifi của bạn.
3. Upload code và mở Serial Monitor xem IP.
4. Nhập IP vào trình duyệt điện thoại.
5. Thử bấm nút và quan sát LED.',
'LED nối chân GPIO 2 (LED tích hợp trên board ESP32).',
60, 'esp32', true);
