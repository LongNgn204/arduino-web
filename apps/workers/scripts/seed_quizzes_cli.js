const { execSync } = require('child_process');

/* Escape helper */
const esc = (str) => str.replace(/'/g, "''").replace(/\n/g, "\\n");

const quizzes = [
    {
        week_id: 'week-01', title: 'Quiz 1: Nhập môn & Phần cứng',
        questions: [
            { type: 'single', content: 'Arduino Uno sử dụng vi điều khiển nào?', options: ['ATmega328P', 'ESP32', 'STM32', '8051'], answer: 'ATmega328P', explanation: 'Arduino Uno R3 sử dụng chip ATmega328P 8-bit.' },
            { type: 'single', content: 'Điện áp logic của ESP32 là bao nhiêu?', options: ['5V', '3.3V', '12V', '1.8V'], answer: '3.3V', explanation: 'ESP32 hoạt động ở mức logic 3.3V, khác với Uno là 5V.' },
            { type: 'truefalse', content: 'Chân VIN dùng để cấp nguồn pin 9V cho mạch Uno?', options: ['True', 'False'], answer: 'True', explanation: 'Đúng, chân VIN chấp nhận đầu vào 7-12V.' },
            { type: 'single', content: 'Chân nào có chức năng PWM trên Uno?', options: ['3, 5, 6, 9, 10, 11', '1, 2, 4', 'A0-A5', 'Chỉ chân 13'], answer: '3, 5, 6, 9, 10, 11', explanation: 'Các chân có dấu ngã (~) hỗ trợ PWM.' },
            { type: 'single', content: 'Hàm nào chạy 1 lần khi khởi động?', options: ['loop()', 'setup()', 'main()', 'start()'], answer: 'setup()', explanation: 'setup() chạy duy nhất 1 lần đầu tiên để cài đặt.' },
        ]
    },
    {
        week_id: 'week-02', title: 'Quiz 2: GPIO & Logic',
        questions: [
            { type: 'single', content: 'INPUT_PULLUP làm gì?', options: ['Treo chân lên 5V/3.3V', 'Nối đất', 'Tăng dòng điện', 'Chống rung'], answer: 'Treo chân lên 5V/3.3V', explanation: 'Nó kích hoạt điện trở nội nối lên nguồn để tránh trạng thái thả nổi (floating).' },
            { type: 'truefalse', content: 'delay(1000) dừng chương trình trong 1 giây?', options: ['True', 'False'], answer: 'True', explanation: 'Đúng, nó chặn (block) CPU trong 1000ms.' },
            { type: 'single', content: 'LED chân dài là cực gì?', options: ['Dương (Anode)', 'Âm (Cathode)', 'Mass', 'Tín hiệu'], answer: 'Dương (Anode)', explanation: 'Chân dài là Anode (+), chân ngắn là Cathode (-).' },
            { type: 'single', content: 'Để xuất tín hiệu ra chân 13, dùng lệnh gì trước?', options: ['pinMode(13, OUTPUT)', 'digitalWrite(13, HIGH)', 'Serial.begin(9600)', 'delay(100)'], answer: 'pinMode(13, OUTPUT)', explanation: 'Phải cấu hình chiều (Mode) là OUTPUT trước khi ghi.' },
            { type: 'single', content: 'Logic 1 (HIGH) trên ESP32 tương đương mấy Volt?', options: ['5V', '3.3V', '0V', '12V'], answer: '3.3V', explanation: 'ESP32 dùng mức logic 3.3V.' },
        ]
    },
    // WEEK 3: ADC & PWM
    {
        week_id: 'week-03', title: 'Quiz 3: Analog & PWM',
        questions: [
            { type: 'single', content: 'Hàm analogRead() trên Uno trả về giá trị bao nhiêu?', options: ['0-1023', '0-255', '0-4095', 'TRUE/FALSE'], answer: '0-1023', explanation: 'Uno có ADC 10-bit (2^10 = 1024 giá trị).' },
            { type: 'single', content: 'Hàm ledcWrite() dùng cho board nào?', options: ['Uno', 'ESP32', 'Nano', 'Mega'], answer: 'ESP32', explanation: 'ESP32 dùng LEDC để tạo PWM, khác với analogWrite của Uno.' },
            { type: 'truefalse', content: 'Biến trở (Potentiometer) là linh kiện Digital?', options: ['True', 'False'], answer: 'False', explanation: 'Biến trở là linh kiện Analog, thay đổi điện trở liên tục.' },
            { type: 'single', content: 'Độ phân giải ADC của ESP32 mặc định là bao nhiêu?', options: ['8-bit', '10-bit', '12-bit', '16-bit'], answer: '12-bit', explanation: 'ESP32 có ADC 12-bit, giá trị từ 0-4095.' },
            { type: 'single', content: 'PWM dùng để làm gì?', options: ['Điều điều độ sáng LED', 'Đọc nhiệt độ', 'Giao tiếp WiFi', 'Cấp nguồn'], answer: 'Điều điều độ sáng LED', explanation: 'Pulse Width Modulation thay đổi độ rộng xung để giả lập điện áp trung bình.' }
        ]
    },
    // WEEK 4: Displays
    {
        week_id: 'week-04', title: 'Quiz 4: Hiển thị LED 7 đoạn',
        questions: [
            { type: 'single', content: 'LED 7 đoạn có mấy thanh LED đơn?', options: ['7', '8 (tính cả dấu chấm)', '10', '16'], answer: '8 (tính cả dấu chấm)', explanation: 'Gồm a,b,c,d,e,f,g và dp (dot point).' },
            { type: 'single', content: 'Loại Anode chung (Common Anode) nối chân chung vào đâu?', options: ['VCC', 'GND', 'Chân tín hiệu', 'Không nối'], answer: 'VCC', explanation: 'Anode chung nối lên nguồn, các chân a-g nối đất (LOW) để sáng.' },
            { type: 'truefalse', content: 'Có thể quét LED (Multiplexing) để tiết kiệm chân?', options: ['True', 'False'], answer: 'True', explanation: 'Đúng, quét nhanh từng LED để mắt người thấy như đang sáng cùng lúc.' },
            { type: 'single', content: 'IC nào hay dùng để mở rộng chân cho LED 7 đoạn?', options: ['74HC595', 'LM358', 'NE555', 'TL072'], answer: '74HC595', explanation: 'Shift Register 74HC595 rất phổ biến để điều khiển nhiều LED.' },
            { type: 'single', content: 'Mỗi thanh LED cần gì để bảo vệ?', options: ['Điện trở hạn dòng', 'Tụ điện', 'Cuộn cảm', 'Transistor'], answer: 'Điện trở hạn dòng', explanation: 'Cần điện trở nối tiếp để tránh cháy LED.' }
        ]
    },
    // WEEK 5: Sensors
    {
        week_id: 'week-05', title: 'Quiz 5: Cảm biến & Thư viện',
        questions: [
            { type: 'single', content: 'DHT11 đo được gì?', options: ['Nhiệt độ & Độ ẩm', 'Ánh sáng', 'Khoảng cách', 'Âm thanh'], answer: 'Nhiệt độ & Độ ẩm', explanation: 'Digital Humidity & Temperature sensor.' },
            { type: 'single', content: 'Chân DATA của DHT11 cần nối gì?', options: ['Điện trở kéo lên (Pull-up)', 'Điện trở kéo xuống', 'Nối thẳng GND', 'Tụ điện'], answer: 'Điện trở kéo lên (Pull-up)', explanation: 'Để đảm bảo tín hiệu ổn định khi không truyền.' },
            { type: 'single', content: 'Hàm dht.readTemperature() trả về kiểu dữ liệu gì?', options: ['float', 'int', 'String', 'char'], answer: 'float', explanation: 'Trả về số thực (ví dụ 28.5 độ).' },
            { type: 'truefalse', content: 'Cảm biến siêu âm HC-SR04 dùng tia laser?', options: ['True', 'False'], answer: 'False', explanation: 'Nó dùng sóng âm tần số cao (ultrasonic).' },
            { type: 'single', content: 'Thư viện giúp ích gì?', options: ['Tiết kiệm thời gian code', 'Làm code chạy chậm', 'Tốn bộ nhớ', 'Bắt buộc dùng'], answer: 'Tiết kiệm thời gian code', explanation: 'Thư viện đóng gói các chức năng phức tạp để tái sử dụng dễ dàng.' }
        ]
    },
    // WEEK 6: Motors
    {
        week_id: 'week-06', title: 'Quiz 6: Động cơ & Servo',
        questions: [
            { type: 'single', content: 'Servo Motor quay được góc bao nhiêu?', options: ['0-180 độ', '360 độ liên tục', 'Vô tận', 'Chỉ 90 độ'], answer: '0-180 độ', explanation: 'Servo thông thường (SG90) quay góc giới hạn 0-180.' },
            { type: 'single', content: 'Chân tín hiệu Servo thường màu gì?', options: ['Cam/Vàng', 'Đỏ', 'Nâu/Đen', 'Xanh'], answer: 'Cam/Vàng', explanation: 'Cam/Vàng: Signal, Đỏ: VCC, Nâu/Đen: GND.' },
            { type: 'single', content: 'Để điều khiển động cơ DC dòng lớn, cần gì?', options: ['Mạch cầu H (H-Bridge)', 'Nối trực tiếp vi điều khiển', 'Điện trở', 'Tụ điện'], answer: 'Mạch cầu H (H-Bridge)', explanation: 'Vi điều khiển không đủ dòng, cần Driver như L298N.' },
            { type: 'truefalse', content: 'Động cơ bước (Stepper) có độ chính xác cao hơn DC?', options: ['True', 'False'], answer: 'True', explanation: 'Đúng, nó di chuyển theo từng bước (step) chính xác.' },
            { type: 'single', content: 'Relay dùng để làm gì?', options: ['Đóng ngắt thiết bị điện áp cao', 'Lọc nhiễu', 'Tăng áp', 'Đo dòng điện'], answer: 'Đóng ngắt thiết bị điện áp cao', explanation: 'Dùng tín hiệu nhỏ để điều khiển công tắc điện lớn.' }
        ]
    },
    // WEEK 7: Serial
    {
        week_id: 'week-07', title: 'Quiz 7: Giao tiếp UART',
        questions: [
            { type: 'single', content: 'UART viết tắt của gì?', options: ['Universal Asynchronous Receiver/Transmitter', 'USB Arduino Real Time', 'Unified Auto Radio', 'Không có nghĩa'], answer: 'Universal Asynchronous Receiver/Transmitter', explanation: 'Giao thức truyền nhận không đồng bộ đa năng.' },
            { type: 'single', content: 'Tốc độ baud rate phổ biến nhất là bao nhiêu?', options: ['9600', '115200', '300', '1000000'], answer: '9600', explanation: '9600 bps là mặc định trong nhiều ví dụ Arduino.' },
            { type: 'single', content: 'Chân TX của board này nối với chân nào board kia?', options: ['RX', 'TX', 'VCC', 'GND'], answer: 'RX', explanation: 'Truyền (TX) phải nối với Nhận (RX).' },
            { type: 'truefalse', content: 'Serial.print() gửi dữ liệu dạng nhị phân?', options: ['True', 'False'], answer: 'False', explanation: 'Nó gửi dạng ASCII (văn bản) dễ đọc.' },
            { type: 'single', content: 'Serial Plotter dùng để làm gì?', options: ['Vẽ đồ thị dữ liệu', 'Viết code', 'Nạp code', 'Gỡ lỗi'], answer: 'Vẽ đồ thị dữ liệu', explanation: 'Công cụ vẽ đồ thị thời gian thực tích hợp trong IDE.' }
        ]
    },
    // WEEK 8: I2C
    {
        week_id: 'week-08', title: 'Quiz 8: Giao thức I2C',
        questions: [
            { type: 'single', content: 'I2C cần bao nhiêu dây tín hiệu?', options: ['2 (SDA, SCL)', '1 (OneWire)', '4 (SPI)', '3 (UART)'], answer: '2 (SDA, SCL)', explanation: 'Serial Data (SDA) và Serial Clock (SCL).' },
            { type: 'single', content: 'Mỗi thiết bị I2C phân biệt nhau bằng gì?', options: ['Địa chỉ (Address)', 'Màu sắc', 'Thứ tự dây', 'Điện áp'], answer: 'Địa chỉ (Address)', explanation: 'Ví dụ LCD thường là 0x27 hoặc 0x3F.' },
            { type: 'single', content: 'Chân SDA của Uno là chân nào?', options: ['A4', 'A5', 'D2', 'D13'], answer: 'A4', explanation: 'Uno: A4 (SDA), A5 (SCL).' },
            { type: 'truefalse', content: 'I2C nhanh hơn SPI?', options: ['True', 'False'], answer: 'False', explanation: 'SPI thường nhanh hơn nhiều so với I2C.' },
            { type: 'single', content: 'Màn hình OLED SSD1306 thường dùng giao tiếp gì?', options: ['I2C', 'UART', 'Analog', 'PWM'], answer: 'I2C', explanation: 'Phổ biến nhất là phiên bản I2C 4 chân.' }
        ]
    },
    // WEEK 9: WiFi
    {
        week_id: 'week-09', title: 'Quiz 9: WiFi & Web Server',
        questions: [
            { type: 'single', content: 'ESP32 dùng thư viện nào để kết nối WiFi?', options: ['WiFi.h', 'ESP8266WiFi.h', 'Ethernet.h', 'Internet.h'], answer: 'WiFi.h', explanation: 'Thư viện chuẩn cho ESP32.' },
            { type: 'single', content: 'Chế độ Station (STA) là gì?', options: ['Kết nối vào Router WiFi có sẵn', 'Tự phát WiFi', 'Không dùng WiFi', 'Chế độ ngủ'], answer: 'Kết nối vào Router WiFi có sẵn', explanation: 'Giống điện thoại kết nối vào WiFi nhà mạng.' },
            { type: 'single', content: 'IP Address 192.168.x.x thường là loại gì?', options: ['IP LAn (Nội bộ)', 'IP Public (Toàn cầu)', 'MAC Address', 'Gateway'], answer: 'IP LAn (Nội bộ)', explanation: 'Địa chỉ mạng cục bộ.' },
            { type: 'truefalse', content: 'Web Server trên ESP32 có thể chứa HTML?', options: ['True', 'False'], answer: 'True', explanation: 'Có thể trả về mã HTML để trình duyệt hiển thị giao diện.' },
            { type: 'single', content: 'SSID là gì?', options: ['Tên mạng WiFi', 'Mật khẩu', 'Địa chỉ IP', 'Tên chip'], answer: 'Tên mạng WiFi', explanation: 'Service Set Identifier.' }
        ]
    },
    // WEEK 10: MQTT
    {
        week_id: 'week-10', title: 'Quiz 10: Giao thức MQTT',
        questions: [
            { type: 'single', content: 'Thành phần trung gian trong MQTT gọi là gì?', options: ['Broker', 'Server', 'Client', 'Master'], answer: 'Broker', explanation: 'Broker nhận và phân phối tin nhắn.' },
            { type: 'single', content: 'Hành động gửi tin đi gọi là gì?', options: ['Publish', 'Subscribe', 'Get', 'Post'], answer: 'Publish', explanation: 'Publish (Công bố) tin nhắn vào một Topic.' },
            { type: 'single', content: 'Hành động đăng ký nhận tin gọi là gì?', options: ['Subscribe', 'Publish', 'Listen', 'Read'], answer: 'Subscribe', explanation: 'Subscribe (Đăng ký) để nhận tin từ Topic.' },
            { type: 'single', content: 'QoS 0 nghĩa là gì?', options: ['Gửi tối đa 1 lần (Fire & Forget)', 'Gửi ít nhất 1 lần', 'Gửi chính xác 1 lần', 'Không gửi'], answer: 'Gửi tối đa 1 lần (Fire & Forget)', explanation: 'Nhanh nhất nhưng không đảm bảo nhận được.' },
            { type: 'truefalse', content: 'MQTT nhẹ hơn HTTP?', options: ['True', 'False'], answer: 'True', explanation: 'Header nhỏ, tối ưu cho IoT băng thông thấp.' }
        ]
    },
    // WEEK 11: App Control
    {
        week_id: 'week-11', title: 'Quiz 11: Ứng dụng điều khiển',
        questions: [
            { type: 'single', content: 'Blynk là gì?', options: ['Nền tảng IoT tạo App kéo thả', 'Một loại chip', 'Ngôn ngữ lập trình', 'Cảm biến'], answer: 'Nền tảng IoT tạo App kéo thả', explanation: 'Giúp tạo giao diện điều khiển trên điện thoại dễ dàng.' },
            { type: 'single', content: 'Virtual Pin (V1, V2...) trong Blynk dùng để làm gì?', options: ['Truyền dữ liệu giữa App và Hardware', 'Nối dây thật', 'Cấp nguồn', 'Reset mạch'], answer: 'Truyền dữ liệu giữa App và Hardware', explanation: 'Pin ảo để trao đổi biến số qua Internet.' },
            { type: 'single', content: 'Độ trễ (Latency) khi điều khiển qua Cloud phụ thuộc vào gì?', options: ['Mạng Internet', 'Nguồn điện', 'Loại đèn LED', 'Nhiệt độ'], answer: 'Mạng Internet', explanation: 'Tốc độ mạng quyết định độ trễ.' },
            { type: 'truefalse', content: 'Có thể điều khiển ESP32 từ xa qua 4G bằng Blynk?', options: ['True', 'False'], answer: 'True', explanation: 'Miễn là ESP32 có WiFi và điện thoại có Internet.' },
            { type: 'single', content: 'Token là gì trong Blynk?', options: ['Khóa bảo mật xác thực thiết bị', 'Tiền ảo', 'Tên đăng nhập', 'Mã lỗi'], answer: 'Khóa bảo mật xác thực thiết bị', explanation: 'Mỗi Project có 1 Auth Token riêng.' }
        ]
    },
    // WEEK 12: Capstone
    {
        week_id: 'week-12', title: 'Quiz 12: Tổng hợp & Dự án',
        questions: [
            { type: 'single', content: 'Bước đầu tiên khi làm dự án là gì?', options: ['Xác định yêu cầu (Requirement)', 'Viết code ngay', 'Mua linh kiện bừa bãi', 'Hàn mạch'], answer: 'Xác định yêu cầu (Requirement)', explanation: 'Phải biết làm gì trước khi bắt tay vào làm.' },
            { type: 'single', content: 'Khi mạch không chạy, nên làm gì trước?', options: ['Kiểm tra nguồn & Dây nối', 'vứt bỏ', 'Mua cái mới', 'Viết lại thư viện'], answer: 'Kiểm tra nguồn & Dây nối', explanation: 'Lỗi phần cứng/nguồn dây là phổ biến nhất.' },
            { type: 'single', content: 'OTA Update nghĩa là gì?', options: ['Cập nhật firmware từ xa qua mạng', 'Nạp code qua dây USB', 'Mua mạch mới', 'Cập nhật Win'], answer: 'Cập nhật firmware từ xa qua mạng', explanation: 'Over The Air update.' },
            { type: 'single', content: 'Chuẩn giao tiếp nào dùng ít dây nhất cho cảm biến nhiệt độ DS18B20?', options: ['OneWire (1 dây)', 'I2C', 'SPI', 'UART'], answer: 'OneWire (1 dây)', explanation: 'Chỉ cần 1 dây tín hiệu.' },
            { type: 'truefalse', content: 'Học Arduino xong có thể làm sản phẩm thương mại?', options: ['True', 'False'], answer: 'True', explanation: 'Nhiều sản phẩm mẫu (Prototype) bắt đầu từ Arduino/ESP32.' }
        ]
    }
];

console.log('Seeding Quizzes...');

// Clean old quizzes first? Maybe safety check, but Replace is safer
// Batch insert per quiz to get quiz_id
// We need to fetch week IDs first? Or assume IDs match seed_weeks keys?
// Our seed_weeks used 'week-01' IDs. So we can rely on that.

async function run() {
    for (const q of quizzes) {
        const quizId = `quiz-${q.week_id}`;

        // 1. Insert Quiz
        const quizCmd = `npx wrangler d1 execute arduino-db --local --command "INSERT OR REPLACE INTO quizzes (id, week_id, title, description, time_limit, passing_score, is_published) VALUES ('${quizId}', '${q.week_id}', '${esc(q.title)}', 'Bài kiểm tra kiến thức tuần này', 15, 80, 1)"`;
        try {
            execSync(quizCmd, { stdio: 'pipe' });
            console.log(`Initialized ${q.title}`);
        } catch (e) {
            console.error(`Error quiz ${q.week_id}:`, e.message);
            continue;
        }

        // 2. Insert Questions
        let order = 1;
        for (const ques of q.questions) {
            const qId = `${quizId}-q${order}`;
            const optionsJson = JSON.stringify(ques.options).replace(/'/g, "''");
            const answerJson = JSON.stringify([ques.answer]).replace(/'/g, "''"); // Storing as JSON array for consistency or simple string? Schema says text.
            // Let's store simple string for single choice if schema allows, but schema default is JSON usually for multiple. 
            // "correctAnswer: text"
            // Let's assume frontend parses it. simplest is raw string if single.
            // But strict schema says "options: text (JSON array)".
            // "correctAnswer: text (JSON - đáp án đúng)" -> Let's use JSON array for "single" too to be safe ["A"]

            const qCmd = `npx wrangler d1 execute arduino-db --local --command "INSERT OR REPLACE INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points) VALUES ('${qId}', '${quizId}', ${order}, '${ques.type}', '${esc(ques.content)}', '${optionsJson}', '${answerJson}', '${esc(ques.explanation)}', 10)"`;

            try {
                execSync(qCmd, { stdio: 'pipe' });
            } catch (e) {
                console.error(`Error question ${qId}`);
            }
            order++;
        }
    }
}

run();
