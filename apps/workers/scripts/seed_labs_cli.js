const { execSync } = require('child_process');

/* Escape helper */
const esc = (str) => str.replace(/'/g, "''").replace(/\n/g, "\\n");

const labs = [
    // LAB 1 (Week 1)
    {
        id: 'lab-01', week_id: 'week-01', order_index: 1, title: 'Lab 1: Blink & SOS',
        objective: 'Lập trình tín hiệu SOS giải cứu robot.',
        instructions: '# Nhiệm vụ\\n1. Kết nối LED vào D13 (Uno) hoặc GPIO 2 (ESP32).\\n2. Lập trình 3 ngắn - 3 dài - 3 ngắn.\\n\\n> Lưu ý: `delay(200)` cho ngắn, `delay(600)` cho dài.',
        wiring: 'LED Chân dài -> Pin, Chân ngắn -> GND.',
        duration: 30, board_support: 'both', simulator_url: 'https://wokwi.com/projects/new/arduino-uno'
    },

    // LAB 2 (Week 2)
    {
        id: 'lab-02', week_id: 'week-02', order_index: 1, title: 'Lab 2: Button & Pull-up',
        objective: 'Đọc trạng thái nút nhấn điều khiển LED.',
        instructions: '# Nhiệm vụ\\nNhấn nút -> Đèn sáng. Thả nút -> Đèn tắt.\\nSử dụng `INPUT_PULLUP` để không cần điện trở ngoài.',
        wiring: 'Button nối chân 4 và GND.',
        duration: 30, board_support: 'both', simulator_url: 'https://wokwi.com/projects/new/arduino-uno'
    },

    // LAB 5 (Sensors)
    {
        id: 'lab-05', week_id: 'week-05', order_index: 1, title: 'Lab 5: Trạm đo Nhiệt độ',
        objective: 'Hiển thị nhiệt độ từ DHT11 lên Serial Monitor.',
        instructions: '# Hướng dẫn\\n1. Cài thư viện "DHT sensor library".\\n2. Kết nối DATA vào D2.\\n3. Nếu nhiệt độ > 30, Alert "NONG QUA!"',
        wiring: 'VCC->5V/3V3, GND->GND, DATA->D2.',
        duration: 45, board_support: 'both', simulator_url: 'https://wokwi.com/projects/new/esp32'
    },

    // LAB 9 (WiFi)
    {
        id: 'lab-09', week_id: 'week-09', order_index: 1, title: 'Lab 9: WiFi Toggle LED',
        objective: 'Điều khiển LED qua trình duyệt web.',
        instructions: '# ESP32 Web Server\\n1. Nhập SSID/Pass.\\n2. Upload code.\\n3. Vào IP hiển thị trên Serial Monitor.\\n4. Bấm nút ON/OFF trên điện thoại.',
        wiring: 'LED tích hợp (GPIO 2).',
        duration: 60, board_support: 'esp32', simulator_url: 'https://wokwi.com/projects/new/esp32'
    },

    // LAB 12 (Capstone)
    {
        id: 'lab-12', week_id: 'week-12', order_index: 1, title: 'Capstone: Smart Home IoT',
        objective: 'Hệ thống nhà thông minh hoàn chỉnh.',
        instructions: '# Yêu cầu\\n- Đọc DHT11 (Nhiệt độ).\\n- Gửi dữ liệu lên Dashboard (Blynk/MQTT).\\n- Tự động bật quạt (LED xanh) khi nóng > 30 độ.',
        wiring: 'DHT11, Relay/LED, ESP32.',
        duration: 120, board_support: 'esp32', simulator_url: 'https://wokwi.com/projects/new/esp32'
    }
];

console.log('Seeding Labs...');
for (const l of labs) {
    const cmd = `npx wrangler d1 execute arduino-db --local --command "INSERT OR REPLACE INTO labs (id, week_id, order_index, title, objective, instructions, wiring, duration, board_support, simulator_url, is_published) VALUES ('${l.id}', '${l.week_id}', ${l.order_index}, '${esc(l.title)}', '${esc(l.objective)}', '${esc(l.instructions)}', '${esc(l.wiring)}', ${l.duration}, '${l.board_support}', '${l.simulator_url}', 1)"`;
    try {
        execSync(cmd, { stdio: 'inherit' });
        console.log(`Initialized ${l.id}`);
    } catch (e) {
        console.error(`Failed ${l.id}`);
    }
}
