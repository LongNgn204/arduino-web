
const fs = require('fs');

function generateSeed() {
    let sql = `-- Seed data cho Arduino Learning Hub (Generated Standard)
-- Admin user: admin/admin123
-- Course: TECH476 (13 Weeks including Week 0)

-- ==========================================
-- CLEAR OLD DATA
-- ==========================================
DELETE FROM lab_submissions;
DELETE FROM quiz_attempts;
DELETE FROM progress;
DELETE FROM ai_chat_logs;
DELETE FROM questions;
DELETE FROM quizzes;
DELETE FROM exam_drills;
DELETE FROM labs;
DELETE FROM lessons;
DELETE FROM weeks;
DELETE FROM courses;
DELETE FROM sessions;
DELETE FROM users;

-- ==========================================
-- USERS
-- ==========================================
INSERT INTO users (id, username, password_hash, role, display_name, created_at, updated_at) VALUES 
('admin-001', 'admin', 'pbkdf2$100000$c2FsdF9hZG1pbl90ZXN0$WkYxR2FEbG1iSEZ3WVhOemQyOXlaQT09', 'admin', 'Administrator', unixepoch(), unixepoch()),
('student-001', 'sinhvien', 'pbkdf2$100000$c2FsdF9zdHVkZW50X3Rlc3Q$dGVzdHBhc3N3b3JkMTIz', 'student', 'Nguyen Hoang Long', unixepoch(), unixepoch());

-- ==========================================
-- COURSE
-- ==========================================
INSERT INTO courses (id, code, title, description, total_weeks, is_published, created_at) VALUES 
('course-tech476', 'TECH476', 'Lập trình hệ thống nhúng & IoT', 'Khóa học Arduino Uno 13 tuần: Từ nhập môn điện tử đến IoT. Học lý thuyết, thực hành simulator, và làm dự án thực tế.', 13, 1, unixepoch());

-- ==========================================
-- WEEKS (0-12)
-- ==========================================
`;

    const path = require('path');

    // Function to read markdown file content
    function readCurriculumFile(filename) {
        try {
            const filePath = path.join(__dirname, 'curriculum', filename);
            if (fs.existsSync(filePath)) {
                return fs.readFileSync(filePath, 'utf8').replace(/'/g, "''"); // Escape single quotes for SQL
            }
        } catch (e) {
            console.warn(`Warning: Could not read ${filename}`);
        }
        return "Nội dung đang cập nhật...";
    }

    // Dynamic Weeks Data from Files
    const weeksData = [
        ["week-00", 0, "Nhập môn Điện tử & Linh kiện", "week-00-intro.md"],
        ["week-01", 1, "Tổng quan HT nhúng & GPIO", "week-01-gpio-led.md"],
        ["week-02", 2, "Thiết kế HT nhúng & LED 7 đoạn", "week-02-7segment.md"],
        ["week-03", 3, "Input & Keypad", "week-03-button-keypad.md"],
        ["week-04", 4, "Analog I/O (ADC & PWM)", "week-04-analog-adc-pwm.md"],
        ["week-05", 5, "Thực hành tích hợp I/O", "week-05-io-integration.md"],
        ["week-06", 6, "Cảm biến (Sensors)", "week-06-sensors.md"],
        ["week-07", 7, "Giao tiếp Serial (UART)", "week-07-serial-uart.md"],
        ["week-08", 8, "Giao tiếp I2C & LCD", "week-08-i2c-lcd.md"],
        ["week-09", 9, "Giao tiếp SPI", "week-09-spi.md"],
        ["week-10", 10, "Giao tiếp 1-Wire", "week-10-1wire-ds18b20.md"],
        ["week-11", 11, "WiFi & WebServer (Cơ bản)", "week-11-wifi-webserver.md"],
        ["week-12", 12, "IoT Project & Async Server", "week-12-async-webserver.md"],
    ];

    weeksData.forEach(([w_id, w_num, w_title, filename]) => {
        // Read content from file
        const content = readCurriculumFile(filename);

        // Split content for overview/objectives if possible, or just use full content for now
        // Simple heuristic: First H1/H2 is overview.
        const overview = content.substring(0, 500) + "...";

        // Placeholder JSONs for now as they are structural
        const w_obj = '["Mục tiêu 1", "Mục tiêu 2"]';
        const w_exam = '["Checklist 1", "Checklist 2"]';

        sql += `INSERT INTO weeks (id, course_id, week_number, title, overview, objectives, exam_checklist, is_published, created_at) VALUES \n('${w_id}', 'course-tech476', ${w_num}, '${w_title}', '${content}', '${w_obj}', '${w_exam}', 1, unixepoch());\n`;
    });

    sql += "\n-- ==========================================\n-- LESSONS (Dynamic content mapping simplified)\n-- ==========================================\n";


    const lessons = [
        // WEEK 0
        ["lesson-00-01", "week-00", 1, "Điện tử cơ bản & Định luật Ohm",
            "# Khái niệm cơ bản\\n\\nĐể bắt đầu với Arduino, bạn cần hiểu 3 đại lượng cơ bản nhất của điện:\\n\\n1. **Hiệu điện thế (Voltage - V):** Đơn vị Volt (V). Là áp lực đẩy dòng điện đi.\\n2. **Dòng điện (Current - I):** Đơn vị Ampe (A). Là dòng chảy của các electron.\\n3. **Điện trở (Resistance - R):** Đơn vị Ohm (Ω). Là sự cản trở dòng điện.\\n\\n### Định luật Ohm\\nĐây là công thức quan trọng nhất:\\n$$ V = I \\times R $$(\\n\\n![Tam giác định luật Ohm](https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/OhmsLaw.png/640px-OhmsLaw.png)"],

        ["lesson-00-02", "week-00", 2, "Nhận biết linh kiện điện tử",
            "# Linh kiện thường gặp\\n\\n## 1. Điện trở (Resistor)\\nLàm giảm dòng điện. Không phân cực (cắm chiều nào cũng được).\\n\\n![Điện trở](https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Resistor_symbol_America.svg/320px-Resistor_symbol_America.svg.png)\\n\\n## 2. Diode phát quang (LED)\\nChỉ cho dòng điện đi qua 1 chiều. Chân dài là Dương (+), chân ngắn là Âm (-).\\n\\n![LED](https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/LED_circuit_elements.svg/320px-LED_circuit_elements.svg.png)\\n\\n## 3. Breadboard\\nDùng để lắp mạch thử nghiệm mà không cần hàn.\\n\\n![Cấu tạo Breadboard](https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Breadboard_scheme.svg/640px-Breadboard_scheme.svg.png)"],

        ["lesson-00-03", "week-00", 3, "Cách đọc điện trở",
            "# Đọc vòng màu điện trở\\n\\n![Bảng màu điện trở](https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Resistor_Color_Code.svg/640px-Resistor_Color_Code.svg.png)\\n\\n### Cách tính (Loại 4 vòng):\\n1. Vòng 1: Số thứ nhất\\n2. Vòng 2: Số thứ hai\\n3. Vòng 3: Số mũ (10^n) - Số lượng số 0 thêm vào sau\\n4. Vòng 4: Sai số (Vàng kim 5%)\\n\\n**Ví dụ:** Nâu - Đen - Đỏ - Vàng kim = 1 - 0 - 00 (thêm 2 số 0) = 1000 Ohm = 1 kΩ."],

        // WEEK 1
        ["lesson-01-01", "week-01", 1, "Hệ thống nhúng là gì?", "# Hệ thống nhúng (Embedded Systems)\n\nKhái niệm hệ thống nhúng: thiết bị điện tử chuyên nhiệm, chạy nhiệm vụ cụ thể, tài nguyên hạn chế."],
        ["lesson-01-02", "week-01", 2, "GPIO: Output", "# Digital Output\n\n- pinMode(pin, OUTPUT)\n- digitalWrite(pin, HIGH/LOW)"],

        // WEEK 2
        ["lesson-02-01", "week-02", 1, "Tư duy thiết kế", "# Top-Down vs Bottom-Up"],
        ["lesson-02-02", "week-02", 2, "LED 7 đoạn", "# Multiplexing"],

        // WEEK 3
        ["lesson-03-01", "week-03", 1, "Input & INPUT_PULLUP", "# Digital Input"],
        ["lesson-03-02", "week-03", 2, "Debounce (Chống dội)", "# Debounce Logic"],

        // WEEK 4
        ["lesson-04-01", "week-04", 1, "ADC (Analog to Digital)", "# ADC Converter"],
        ["lesson-04-02", "week-04", 2, "PWM (Pulse Width Modulation)", "# PWM Control"],

        // WEEK 5
        ["lesson-05-01", "week-05", 1, "Tư duy Module hóa", "# Functions"],
        ["lesson-05-02", "week-05", 2, "Tránh delay()", "# Millis()"],

        // WEEK 6
        ["lesson-06-01", "week-06", 1, "Cảm biến siêu âm HC-SR04", "# HC-SR04"],
        ["lesson-06-02", "week-06", 2, "Nhiệt độ & Độ ẩm DHT11", "# DHT11"],

        // WEEK 7
        ["lesson-07-01", "week-07", 1, "Giao thức UART", "# UART Serial"],
        ["lesson-07-02", "week-07", 2, "Xử lý chuỗi Serial", "# Serial Parsing"],

        // WEEK 8
        ["lesson-08-01", "week-08", 1, "Giao thức I2C", "# I2C Bus"],
        ["lesson-08-02", "week-08", 2, "LCD 1602 I2C", "# LCD Display"],

        // WEEK 9
        ["lesson-09-01", "week-09", 1, "Giao thức SPI", "# SPI Bus"],
        ["lesson-09-02", "week-09", 2, "Shift Register 74HC595", "# 74HC595 IC"],

        // WEEK 10
        ["lesson-10-01", "week-10", 1, "Giao thức 1-Wire", "# OneWire Bus"],
        ["lesson-10-02", "week-10", 2, "DS18B20 Temp Sensor", "# DS18B20 Sensor"],

        // WEEK 11
        ["lesson-11-01", "week-11", 1, "ESP8266/ESP32 Intro", "# ESP Platform"],
        ["lesson-11-02", "week-11", 2, "Simple WebServer", "# HTTP Server"],

        // WEEK 12
        ["lesson-12-01", "week-12", 1, "Async WebServer", "# ESPAsyncWebServer"],
        ["lesson-12-02", "week-12", 2, "AJAX & Fetch API", "# Fetch API"],
    ];

    lessons.forEach(([l_id, w_id, l_idx, l_title, l_content]) => {
        sql += `INSERT INTO lessons (id, week_id, order_index, title, content, duration, is_published, created_at) VALUES ('${l_id}', '${w_id}', ${l_idx}, '${l_title}', '${l_content.replace(/'/g, "''")}', 20, 1, unixepoch());\n`;
    });

    sql += "\n-- ==========================================\n-- LABS\n-- ==========================================\n";

    const labs = [
        ["lab-00-01", "week-00", 1, "Mô phỏng mạch LED cơ bản", "https://wokwi.com/projects/new/arduino-uno"],
        ["lab-01-01", "week-01", 1, "Blink 3 quy luật", "https://wokwi.com/projects/new/arduino-uno"],
        ["lab-02-01", "week-02", 1, "LED 7 đoạn cơ bản", "https://wokwi.com/projects/new/arduino-uno"],
        ["lab-03-01", "week-03", 1, "Nút nhấn & LED", "https://wokwi.com/projects/new/arduino-uno"],
        ["lab-04-01", "week-04", 1, "Đọc biến trở", "https://wokwi.com/projects/new/arduino-uno"],
        ["lab-05-01", "week-05", 1, "Đèn giao thông (millis)", "https://wokwi.com/projects/new/arduino-uno"],
        ["lab-06-01", "week-06", 1, "Cảm biến khoảng cách", "https://wokwi.com/projects/new/arduino-uno"],
        ["lab-07-01", "week-07", 1, "Serial Command", "https://wokwi.com/projects/new/arduino-uno"],
        ["lab-08-01", "week-08", 1, "LCD Hello World", "https://wokwi.com/projects/new/arduino-uno"],
        ["lab-09-01", "week-09", 1, "Shift Register LED", "https://wokwi.com/projects/new/arduino-uno"],
        ["lab-10-01", "week-10", 1, "Đọc nhiệt độ DS18B20", "https://wokwi.com/projects/new/arduino-uno"],
        ["lab-11-01", "week-11", 1, "WiFi Connect", "https://wokwi.com/projects/new/esp32"],
        ["lab-12-01", "week-12", 1, "IoT Dashboard", "https://wokwi.com/projects/new/esp32"],
    ];

    labs.forEach(([lab_id, w_id, order, title, sim_url]) => {
        sql += `INSERT INTO labs (id, week_id, order_index, title, objective, instructions, wiring, starter_code, solution_code, rubric, simulator_url, duration, is_published, created_at) VALUES ('${lab_id}', '${w_id}', ${order}, '${title}', 'Objective', '# Instructions', 'Wiring', '// Starter Code', '// Solution', '{"total":10}', '${sim_url}', 45, 1, unixepoch());\n`;
    });

    sql += "\n-- ==========================================\n-- QUIZZES\n-- ==========================================\n";

    // Quiz for Week 0
    let w_str_0 = '00';
    let qid_0 = `quiz-${w_str_0}`;
    let wid_0 = `week-${w_str_0}`;
    sql += `INSERT INTO quizzes (id, week_id, title, description, time_limit, passing_score, is_published, created_at) VALUES ('${qid_0}', '${wid_0}', 'Trắc nghiệm Linh kiện cơ bản', 'Kiểm tra kiến thức về R, C, LED và định luật Ohm', 10, 80, 1, unixepoch());\n`;
    sql += `INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES 
('q-00-01', '${qid_0}', 1, 'single', 'Công thức định luật Ohm là gì?', '["V = I / R", "I = V * R", "V = I * R", "R = V * I"]', '2', 'V = I * R là đáp án đúng.', 10, unixepoch()),
('q-00-02', '${qid_0}', 2, 'single', 'Linh kiện nào dùng để cản trở dòng điện?', '["Tụ điện", "Điện trở", "Transistor", "LED"]', '1', 'Điện trở có chức năng cản trở dòng điện.', 10, unixepoch());\n`;

    // Quizzes for Weeks 1-12
    for (let i = 1; i <= 12; i++) {
        let w_str = i.toString().padStart(2, '0');
        let qid = `quiz-${w_str}`;
        let wid = `week-${w_str}`;
        sql += `INSERT INTO quizzes (id, week_id, title, description, time_limit, passing_score, is_published, created_at) VALUES ('${qid}', '${wid}', 'Quiz Week ${w_str}', 'Test knowledge', 15, 60, 1, unixepoch());\n`;

        for (let k = 1; k <= 5; k++) {
            let q_id = `q-${w_str}-0${k}`;
            sql += `INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES ('${q_id}', '${qid}', ${k}, 'single', 'Question ${k} for Week ${w_str}?', '["Option A", "Option B", "Option C", "Option D"]', '0', 'Explanation.', 10, unixepoch());\n`;
        }
    }

    fs.writeFileSync('apps/workers/src/db/seed.sql', sql);
    console.log("Successfully generated seed.sql");
}

generateSeed();
