const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '../curriculum');
const OUT = path.join(__dirname, '../apps/workers/src/db/seed_lms_2026.sql');

function escapeSql(str) {
    if (!str) return 'NULL';
    return "'" + str.replace(/'/g, "''") + "'";
}

const STATIC_SQL = `-- Generated Seed Data
-- Date: ${new Date().toISOString()}

-- RESET TABLES
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
DELETE FROM topics;
DELETE FROM sessions;
DELETE FROM courses;
DELETE FROM users;

-- USERS
INSERT INTO users (id, username, password_hash, role, display_name, created_at, updated_at) VALUES 
('admin-001', 'admin', 'pbkdf2$100000$c2FsdF9hZG1pbl90ZXN0$WkYxR2FEbG1iSEZ3WVhOemQyOXlaQT09', 'admin', 'Administrator', unixepoch(), unixepoch()),
('student-001', 'sinhvien', 'pbkdf2$100000$c2FsdF9zdHVkZW50X3Rlc3Q$dGVzdHBhc3N3b3JkMTIz', 'student', 'Nguyen Hoang Long', unixepoch(), unixepoch());

-- TOPICS
INSERT INTO topics (id, name, slug, description) VALUES
('topic-01', 'Nhập môn', 'intro', 'Kiến thức cơ bản'),
('topic-02', 'GPIO', 'gpio', 'Input/Output'),
('topic-03', 'Cảm biến', 'sensors', 'Đọc dữ liệu môi trường'),
('topic-04', 'Giao tiếp', 'comms', 'UART, I2C, SPI'),
('topic-05', 'IoT', 'iot', 'Internet of Things');

-- COURSE
INSERT INTO courses (id, code, title, description, total_weeks, is_published, created_at) VALUES 
('course-01', 'IOT101', 'Lập trình hệ thống nhúng & IoT', 'Khóa học Arduino/ESP32 toàn diện.', 13, 1, unixepoch());
`;

function getTopicId(weekNum) {
    if (weekNum <= 1) return 'topic-01';
    if (weekNum <= 4) return 'topic-02';
    if (weekNum <= 6) return 'topic-03';
    if (weekNum <= 8) return 'topic-04';
    return 'topic-05';
}

function parseFile(content) {
    const lines = content.split('\n');
    let title = '';
    let overview = '';
    let sections = { theory: [], labs: [], quizzes: [] };
    let currentLab = null;
    let currentQuiz = null;
    let mode = 'theory';

    // Parse Title
    const h1 = lines.find(l => l.startsWith('# '));
    if (h1) title = h1.replace('# ', '').trim();

    // Parse Overview (Blockquote)
    const quote = lines.filter(l => l.startsWith('> ')).map(l => l.replace('> ', '').trim()).join(' ');
    if (quote) overview = quote;

    for (const line of lines) {
        // Detect Sections
        if (line.match(/^## .*Phần.*Thực hành|Lab/i) || line.match(/^### Lab/)) {
            mode = 'lab';
            if (line.startsWith('### Lab')) {
                if (currentLab) sections.labs.push(currentLab);
                currentLab = { title: line.replace(/### /, '').trim(), content: [] };
            }
            continue;
        } else if (line.match(/^## .*Quiz/i)) {
            mode = 'quiz';
            if (currentLab) { sections.labs.push(currentLab); currentLab = null; }
            continue;
        }

        // Collect Content
        if (mode === 'theory' && !line.startsWith('# ')) {
            sections.theory.push(line);
        } else if (mode === 'lab' && currentLab) {
            currentLab.content.push(line);
        } else if (mode === 'quiz') {
            sections.quizzes.push(line);
        }
    }
    if (currentLab) sections.labs.push(currentLab);

    return { title, overview, ...sections };
}

function main() {
    let sql = STATIC_SQL;

    try {
        const files = fs.readdirSync(DIR).filter(f => f.endsWith('.md')).sort();
        console.log(`Found ${files.length} curriculum files.`);

        files.forEach((file, idx) => {
            const content = fs.readFileSync(path.join(DIR, file), 'utf-8');
            const match = file.match(/week-(\d+)/);
            // Default to index if no number found, but files are named week-00, week-01...
            const weekNum = match ? parseInt(match[1]) : idx;
            const weekId = `week-${String(weekNum).padStart(2, '0')}`;
            const topicId = getTopicId(weekNum);

            console.log(`Processing Week ${weekNum}: ${file}`);

            const data = parseFile(content);

            // Generate SQL
            sql += `\n-- WEEK ${weekNum}: ${data.title}\n`;
            sql += `INSERT INTO weeks (id, course_id, week_number, topic_id, title, overview, is_published) VALUES
('${weekId}', 'course-01', ${weekNum}, '${topicId}', ${escapeSql(data.title)}, ${escapeSql(data.overview)}, 1);\n`;

            // ONE LESSON containing all theory
            const lId = `l-${String(weekNum).padStart(2, '0')}-01`;
            const theoryContent = data.theory.join('\n').trim();
            sql += `INSERT INTO lessons (id, week_id, order_index, title, content, is_published) VALUES
('${lId}', '${weekId}', 1, 'Lý thuyết & Bài học', ${escapeSql(theoryContent)}, 1);\n`;

            // LABS
            data.labs.forEach((lab, i) => {
                const labId = `lab-${String(weekNum).padStart(2, '0')}-${i + 1}`;
                const instructions = lab.content.join('\n').trim();
                sql += `INSERT INTO labs (id, week_id, order_index, title, instructions, wiring, is_published) VALUES
('${labId}', '${weekId}', ${i + 1}, ${escapeSql(lab.title)}, ${escapeSql(instructions)}, 'See instructions', 1);\n`;
            });
        });

        fs.writeFileSync(OUT, sql);
        console.log('Successfully generated seed_lms_2026.sql');

    } catch (e) {
        console.error('Error generating seed:', e);
    }
}

main();
