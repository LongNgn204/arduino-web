const fs = require('fs');
const path = require('path');

const MD_PATH = path.join(__dirname, '../noidunghoc.md');
const OUT_PATH = path.join(__dirname, '../apps/workers/src/db/seed.sql');

const COURSE_ID = 'course-tech476';

function escapeSql(str) {
    if (str === null || str === undefined) return 'NULL';
    // Replace single quote with double single quote for SQL
    return "'" + String(str).replace(/'/g, "''") + "'";
}

function parseWeeks(mdContent) {
    // Split by Week headers: # X) TUẦN XX
    const weekChunks = mdContent.split(/^# \d+\) TUẦN/gm);

    // Remove preamble (first chunk)
    const preamble = weekChunks.shift();

    const weeks = [];

    weekChunks.forEach((chunk, index) => {
        const weekNum = index + 1;
        const lines = chunk.trim().split('\n');

        // First line is Title (after "TUẦN XX — ")
        let titleLine = lines[0].trim(); // e.g., "01 — Tổng quan hệ thống nhúng & GPIO (LED)"
        // cleanup title
        let title = titleLine.replace(/^\d+ —\s*/, '').replace(/\s*\*\(.*\)\*$/, ''); // Remove date/comment if any

        // Extract sections
        const sections = {
            objectives: [],
            theory: [],
            labs: [],
            quiz: []
        };

        let currentSection = null;
        let currentLab = null;

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];

            if (line.match(/^## \d+\.\d+ Mục tiêu/)) {
                currentSection = 'objectives';
                continue;
            } else if (line.match(/^## \d+\.\d+ Lý thuyết/)) {
                currentSection = 'theory';
                continue;
            } else if (line.match(/^## \d+\.\d+ Thực hành/)) {
                currentSection = 'labs';
                continue;
            } else if (line.match(/^### Bài/)) {
                // New Lab
                if (currentLab) sections.labs.push(currentLab);
                currentLab = {
                    title: line.replace(/^### /, '').trim(),
                    content: []
                };
                currentSection = 'inside_lab';
                continue;
            } else if (line.match(/^## \d+\.\d+ Quiz/)) {
                if (currentLab) {
                    sections.labs.push(currentLab);
                    currentLab = null;
                }
                currentSection = 'quiz';
                continue;
            } else if (line.match(/^## \d+\.\d+ Ôn thi/)) {
                if (currentLab) {
                    sections.labs.push(currentLab);
                    currentLab = null;
                }
                currentSection = 'exam';
                continue;
            } else if (line.match(/^# \d+\)/)) {
                // End of week (shouldn't happen due to split, but safety)
                break;
            }

            // Process content based on section
            if (currentSection === 'objectives') {
                if (line.trim().startsWith('-')) {
                    sections.objectives.push(line.trim().replace(/^-\s*/, ''));
                }
            } else if (currentSection === 'theory') {
                sections.theory.push(line);
            } else if (currentSection === 'inside_lab') {
                currentLab.content.push(line);
            }
        }
        // Push last lab
        if (currentLab) sections.labs.push(currentLab);

        weeks.push({
            weekNum,
            title,
            objectives: sections.objectives,
            theory: sections.theory.join('\n').trim(),
            labs: sections.labs
        });
    });

    return weeks;
}

function generateSql(weeks) {
    let sql = `-- Generated Seed Data from noidunghoc.md
-- Date: ${new Date().toISOString()}

-- CLEAR DATA
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

-- USERS
INSERT INTO users (id, username, password_hash, role, display_name, created_at, updated_at) VALUES 
('admin-001', 'admin', 'pbkdf2$100000$c2FsdF9hZG1pbl90ZXN0$WkYxR2FEbG1iSEZ3WVhOemQyOXlaQT09', 'admin', 'Administrator', unixepoch(), unixepoch()),
('student-001', 'sinhvien', 'pbkdf2$100000$c2FsdF9zdHVkZW50X3Rlc3Q$dGVzdHBhc3N3b3JkMTIz', 'student', 'Nguyen Hoang Long', unixepoch(), unixepoch());

-- COURSE
INSERT INTO courses (id, code, title, description, total_weeks, is_published, created_at) VALUES 
('${COURSE_ID}', 'TECH476', 'Lập trình hệ thống nhúng & IoT', 'Khóa học Arduino Uno 12 tuần: Từ cơ bản đến IoT. Học lý thuyết, thực hành simulator, và làm dự án thực tế.', 12, 1, unixepoch());

`;

    weeks.forEach(week => {
        const weekId = `week-${String(week.weekNum).padStart(2, '0')}`;
        const objectivesJson = JSON.stringify(week.objectives);
        const overview = escapeSql(`# ${week.title}\n\n${week.theory.substring(0, 200)}...`); // Quick overview

        sql += `-- WEEK ${week.weekNum}\n`;
        sql += `INSERT INTO weeks (id, course_id, week_number, title, overview, objectives, is_published, created_at) VALUES ('${weekId}', '${COURSE_ID}', ${week.weekNum}, ${escapeSql(week.title)}, ${overview}, ${escapeSql(objectivesJson)}, 1, unixepoch());\n`;

        // LESSON (Theory)
        if (week.theory) {
            const lessonId = `lesson-${String(week.weekNum).padStart(2, '0')}-01`;
            const content = escapeSql(week.theory);
            sql += `INSERT INTO lessons (id, week_id, order_index, title, content, duration, is_published, created_at) VALUES ('${lessonId}', '${weekId}', 1, 'Lý thuyết cốt lõi', ${content}, 30, 1, unixepoch());\n`;
        }

        // LABS
        week.labs.forEach((lab, index) => {
            const labId = `lab-${String(week.weekNum).padStart(2, '0')}-${String(index + 1).padStart(2, '0')}`;
            const instructions = escapeSql(lab.content.join('\n').trim());
            const title = escapeSql(lab.title);
            // Detect simulator URL (defaulting depending on week)
            let simUrl = 'https://wokwi.com/projects/new/arduino-uno';
            if (week.weekNum >= 11) simUrl = 'https://wokwi.com/projects/new/esp32';

            sql += `INSERT INTO labs (id, week_id, order_index, title, instructions, wiring, starter_code, rubric, simulator_url, duration, is_published, created_at) VALUES ('${labId}', '${weekId}', ${index + 1}, ${title}, ${instructions}, 'See instructions', '// Write your code here', '{"total":10}', '${simUrl}', 45, 1, unixepoch());\n`;
        });

        sql += '\n';
    });

    return sql;
}

// MAIN
try {
    const mdContent = fs.readFileSync(MD_PATH, 'utf-8');
    const weeks = parseWeeks(mdContent);
    const sqlContent = generateSql(weeks);
    fs.writeFileSync(OUT_PATH, sqlContent);
    console.log(`Successfully generated seed.sql with ${weeks.length} weeks.`);
} catch (e) {
    console.error('Error generating seed:', e);
}
