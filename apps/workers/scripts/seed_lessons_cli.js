const { execSync } = require('child_process');

// Escape helper
const esc = (str) => str.replace(/'/g, "''").replace(/\n/g, "\\n");

const lessons = [
    // WEEK 1
    {
        id: 'l-01-01', week_id: 'week-01', order_index: 1, title: 'Uno vs ESP32: Ai mạnh hơn?',
        content: `# 1. So sánh Phần cứng\\n\\nHãy tưởng tượng:\\n- **Arduino Uno**: Là chiếc xe đạp bền bỉ. Dễ lái, ít hỏng, chạy điện 5V.\\n- **ESP32**: Là chiếc siêu xe có WiFi/Bluetooth. Chạy nhanh, nhưng dùng điện 3.3V (cần cẩn thận).\\n\\n![Uno vs ESP32 Comparison](/images/uno_vs_esp32.png)\\n\\n## Sơ đồ chân (Pinout)\\n*Màu đỏ = Nguồn, Đen = GND, Xanh = Tín hiệu*\\n- Uno: A0-A5 là chân Analog.\\n- ESP32: GPIO linh hoạt hơn.`
    },
    {
        id: 'l-01-02', week_id: 'week-01', order_index: 2, title: 'Cài đặt IDE & Blink LED',
        content: `# 2. Hello World\\n\\n1. Cài đặt Arduino IDE.\\n2. Chọn Board: Arduino Uno hoặc DOIT ESP32 DEVKIT V1.\\n3. Chọn Port COM.\\n\\n## Code Blink\\n\`\`\`cpp\\nvoid setup() { pinMode(2, OUTPUT); }\\nvoid loop() { digitalWrite(2, HIGH); delay(1000); digitalWrite(2, LOW); delay(1000); }\\n\`\`\``
    },

    // WEEK 2
    {
        id: 'l-02-01', week_id: 'week-02', order_index: 1, title: 'Nút nhấn & Logic',
        content: `# Logic 0 và 1\\n\\nNút nhấn giống cái chuông cửa.\\n- Nhấn = 1 (HIGH) hoặc 0 (LOW) tùy cách mắc.\\n\\n## Pull-up Resistor\\nĐể tránh "nhiễu" (floating), ta dùng điện trở treo.\\n\`pinMode(BUTTON_PIN, INPUT_PULLUP);\`\\nLúc này: Chưa nhấn = 1, Nhấn = 0.`
    },

    // WEEK 3
    {
        id: 'l-03-01', week_id: 'week-03', order_index: 1, title: 'ADC & Biến trở',
        content: `# Analog: Thế giới thực\\n\\nÂm thanh, ánh sáng là Analog (liên tục).\\nVi điều khiển chỉ hiểu Digital (0/1).\\n-> Cần bộ ADC (Analog to Digital Converter).\\n\\n## Code\\n\`int val = analogRead(A0);\`\\n- Uno: 0-1023\\n- ESP32: 0-4095`
    },
    {
        id: 'l-03-02', week_id: 'week-03', order_index: 2, title: 'PWM: Dimming LED',
        content: `# Giả lập Analog\\n\\nBật tắt cực nhanh để làm mờ đèn.\\n- Uno: \`analogWrite(3, 127);\` (50%)\\n- ESP32: Dùng \`ledcWrite\`.`
    },

    // WEEK 4
    {
        id: 'l-04-01', week_id: 'week-04', order_index: 1, title: 'LED 7 Đoạn',
        content: `# Hiển thị số\\n\\nCấu tạo từ 7 thanh LED xếp hình số 8.\\nĐiều khiển từng thanh a,b,c,d,e,f,g để hiện số mong muốn.`
    },

    // WEEK 5
    {
        id: 'l-05-01', week_id: 'week-05', order_index: 1, title: 'DHT11: Nhiệt độ & Độ ẩm',
        content: `# Cảm biến môi trường\\n\\nDHT11 là cảm biến số giá rẻ.\\n\\n## Thư viện DHT\\n1. Cài thư viện "DHT sensor library".\\n2. \`dht.readTemperature();\``
    },

    // WEEK 6 (Motors)
    {
        id: 'l-06-01', week_id: 'week-06', order_index: 1, title: 'Servo Motor',
        content: `# Cánh tay robot\\n\\nServo có thể quay đến góc chính xác (0-180 độ).\\nỨng dụng: Cánh tay robot, khóa cửa tự động.\\n\\n\`myservo.write(90);\` // Quay ra giữa`
    },

    // WEEK 7 (Serial)
    {
        id: 'l-07-01', week_id: 'week-07', order_index: 1, title: 'Giao tiếp Serial (UART)',
        content: `# Chat với máy tính\\n\\nDùng dây USB để gửi dữ liệu lên màn hình.\\n\`Serial.begin(9600);\`\\n\`Serial.println("Hello");\``
    },

    // WEEK 8 (I2C)
    {
        id: 'l-08-01', week_id: 'week-08', order_index: 1, title: 'Giao thức I2C & LCD',
        content: `# 2 dây làm nên tất cả\\n\\nSDA (Data) và SCL (Clock).\\nKết nối hàng chục cảm biến chỉ với 2 dây này.\\n\\n## LCD I2C\\nHiển thị 2 dòng chữ chuyên nghiệp.`
    },

    // WEEK 9 (WiFi - ESP32)
    {
        id: 'l-09-01', week_id: 'week-09', order_index: 1, title: 'Kết nối WiFi (ESP32)',
        content: `# IoT Begins\\n\\nESP32 có thể vào mạng như điện thoại.\\n\`WiFi.begin(ssid, pass);\`.\\n\\n## Web Server\\nTạo trang web điều khiển đèn LED từ xa.`
    },

    // WEEK 10 (MQTT)
    {
        id: 'l-10-01', week_id: 'week-10', order_index: 1, title: 'MQTT Protocol',
        content: `# Giao thức của IoT\\n\\nNhẹ, nhanh, thời gian thực.\\n- **Broker**: Server trung gian.\\n- **Publish**: Gửi tin nhiệt độ.\\n- **Subscribe**: Nhận lệnh điều khiển.`
    },

    // WEEK 11 (App)
    {
        id: 'l-11-01', week_id: 'week-11', order_index: 1, title: 'Tạo App điều khiển',
        content: `# Blynk / Custom App\\n\\nKéo thả giao diện trên điện thoại để điều khiển ESP32 bất cứ đâu có mạng.`
    },

    // WEEK 12 (Capstone)
    {
        id: 'l-12-01', week_id: 'week-12', order_index: 1, title: 'Dự án: Smart Home',
        content: `# Nhà thông minh\\n\\nKết hợp:\\n- Đọc nhiệt độ (Week 5)\\n- Điều khiển đèn/quạt (Week 2, 6)\\n- Gửi lên App qua WiFi/MQTT (Week 9, 10).\\n\\nBạn đã trở thành Maker thực thụ!`
    }
];

console.log('Seeding Lessons...');
for (const l of lessons) {
    const cmd = `npx wrangler d1 execute arduino-db --local --command "INSERT OR REPLACE INTO lessons (id, week_id, order_index, title, content, board_support, is_published) VALUES ('${l.id}', '${l.week_id}', ${l.order_index}, '${esc(l.title)}', '${esc(l.content)}', 'both', 1)"`;
    try {
        execSync(cmd, { stdio: 'inherit' });
        console.log(`Initialized ${l.id}`);
    } catch (e) {
        console.error(`Failed ${l.id}`);
    }
}
