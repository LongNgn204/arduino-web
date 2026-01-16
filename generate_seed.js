
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


    // Helper function to read lesson content from markdown file
    function readLessonContent(weekNum, lessonNum) {
        const weekPadded = String(weekNum).padStart(2, '0');
        const weekFileMap = {
            '00': 'week-00-intro.md',
            '01': 'week-01-gpio-led.md',
            '02': 'week-02-7segment.md',
            '03': 'week-03-button-keypad.md',
            '04': 'week-04-analog-adc-pwm.md',
            '05': 'week-05-io-integration.md',
            '06': 'week-06-sensors.md',
            '07': 'week-07-serial-uart.md',
            '08': 'week-08-i2c-lcd.md',
            '09': 'week-09-spi.md',
            '10': 'week-10-1wire-ds18b20.md',
            '11': 'week-11-wifi-webserver.md',
            '12': 'week-12-async-webserver.md',
        };

        const filename = weekFileMap[weekPadded];
        if (!filename) return 'Nội dung đang cập nhật...';

        const content = readCurriculumFile(filename);
        if (content === 'Nội dung đang cập nhật...') return content;

        // For lesson 1 of each week, return full content
        // For lesson 2, try to extract a section or return a portion
        if (lessonNum === 1) {
            return content; // Full week content for first lesson
        } else {
            // For additional lessons, extract a section if possible
            const sections = content.split(/\n## /);
            if (sections.length > lessonNum) {
                return '## ' + sections[lessonNum];
            }
            return content.substring(content.length / 2); // Return second half for lesson 2
        }
    }

    const lessons = [
        // WEEK 0
        ["lesson-00-01", "week-00", 1, "Điện tử cơ bản & Định luật Ohm"],
        ["lesson-00-02", "week-00", 2, "Nhận biết linh kiện điện tử"],
        ["lesson-00-03", "week-00", 3, "Cách đọc điện trở"],

        // WEEK 1
        ["lesson-01-01", "week-01", 1, "Hệ thống nhúng & GPIO"],
        ["lesson-01-02", "week-01", 2, "Điều khiển LED nâng cao"],

        // WEEK 2
        ["lesson-02-01", "week-02", 1, "Thiết kế hệ thống nhúng"],
        ["lesson-02-02", "week-02", 2, "LED 7 đoạn & Multiplexing"],

        // WEEK 3
        ["lesson-03-01", "week-03", 1, "Input & INPUT_PULLUP"],
        ["lesson-03-02", "week-03", 2, "Debounce (Chống dội phím)"],

        // WEEK 4
        ["lesson-04-01", "week-04", 1, "ADC (Analog to Digital)"],
        ["lesson-04-02", "week-04", 2, "PWM & Điều khiển độ sáng"],

        // WEEK 5
        ["lesson-05-01", "week-05", 1, "Tư duy Module hóa & Hàm"],
        ["lesson-05-02", "week-05", 2, "Tránh delay() với millis()"],

        // WEEK 6
        ["lesson-06-01", "week-06", 1, "Cảm biến siêu âm HC-SR04"],
        ["lesson-06-02", "week-06", 2, "Cảm biến nhiệt độ & độ ẩm"],

        // WEEK 7
        ["lesson-07-01", "week-07", 1, "Giao tiếp UART Serial"],
        ["lesson-07-02", "week-07", 2, "Xử lý chuỗi lệnh Serial"],

        // WEEK 8
        ["lesson-08-01", "week-08", 1, "Giao tiếp I2C"],
        ["lesson-08-02", "week-08", 2, "LCD 1602 I2C Display"],

        // WEEK 9
        ["lesson-09-01", "week-09", 1, "Giao tiếp SPI"],
        ["lesson-09-02", "week-09", 2, "Shift Register 74HC595"],

        // WEEK 10
        ["lesson-10-01", "week-10", 1, "Giao tiếp 1-Wire"],
        ["lesson-10-02", "week-10", 2, "Cảm biến DS18B20"],

        // WEEK 11
        ["lesson-11-01", "week-11", 1, "ESP8266/ESP32 Nhập môn"],
        ["lesson-11-02", "week-11", 2, "WebServer cơ bản"],

        // WEEK 12
        ["lesson-12-01", "week-12", 1, "Async WebServer"],
        ["lesson-12-02", "week-12", 2, "AJAX & Fetch API"],
    ];

    lessons.forEach(([l_id, w_id, l_idx, l_title]) => {
        // Extract weekNum from w_id (e.g., "week-01" -> 1)
        const weekNum = parseInt(w_id.replace('week-', ''), 10);
        const content = readLessonContent(weekNum, l_idx);
        sql += `INSERT INTO lessons (id, week_id, order_index, title, content, duration, is_published, created_at) VALUES ('${l_id}', '${w_id}', ${l_idx}, '${l_title}', '${content.replace(/'/g, "''")}', 20, 1, unixepoch());\n`;
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
