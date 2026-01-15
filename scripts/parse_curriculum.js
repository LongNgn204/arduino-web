#!/usr/bin/env node
/**
 * Curriculum Parser for Arduino Learning Hub - Complete Version
 * Imports full markdown content with labs, drills, and proper week overview.
 * 
 * Usage: node scripts/parse_curriculum.js
 */

const fs = require('fs');
const path = require('path');

const CURRICULUM_DIR = path.join(__dirname, '..', 'curriculum');
const OUTPUT_FILE = path.join(__dirname, '..', 'apps', 'workers', 'src', 'db', 'seed.sql');

function escapeSql(text) {
    if (text == null) return '';
    return String(text).replace(/'/g, "''");
}

function extractObjectives(content) {
    const match = content.match(/## 🎯 Mục tiêu học tập\s*\n([\s\S]+?)(?=\n---|\n## )/);
    if (!match) return [];

    const objectives = [];
    const lines = match[1].split('\n');
    for (const line of lines) {
        const objMatch = line.match(/^\d+\.\s*[✅✓]?\s*(.+)$/);
        if (objMatch) {
            objectives.push(objMatch[1].trim());
        }
    }
    return objectives;
}

function extractLabs(content) {
    const labs = [];

    // Find all lab sections using multiple patterns
    const labPatterns = [
        /### Lab (\d+-?\d*): (.+?)\n([\s\S]+?)(?=\n### Lab |\n## 🏆|\n---\n\n## |\n$)/gi,
        /### Bài thực hành (\d+): (.+?)\n([\s\S]+?)(?=\n### |\n## |\n$)/gi
    ];

    for (const pattern of labPatterns) {
        let match;
        while ((match = pattern.exec(content)) !== null) {
            const labId = match[1];
            const title = match[2].trim();
            const labContent = match[3].trim();

            // Extract objective
            const objMatch = labContent.match(/\*\*Mục tiêu\*\*[:\s]*(.+?)(?:\n|$)/i);
            const objective = objMatch ? objMatch[1].trim() : `Hoàn thành: ${title}`;

            // Extract rubric
            const rubric = { criteria: [], total: 100 };
            const rubricMatches = labContent.matchAll(/\|\s*([^|]+?)\s*\|\s*(\d+)%?\s*\|/g);
            for (const rm of rubricMatches) {
                const criteria = rm[1].trim();
                if (criteria && !criteria.includes('Tiêu chí') && !criteria.includes('---') && !criteria.includes('Điểm')) {
                    rubric.criteria.push({
                        name: criteria,
                        points: parseInt(rm[2]),
                        description: `Đánh giá: ${criteria}`
                    });
                }
            }

            labs.push({
                id: labId.replace('-', ''),
                title: title,
                objective: objective,
                instructions: labContent,
                rubric: rubric
            });
        }
    }

    return labs;
}

function extractQuestions(content) {
    const questions = [];

    // Find Quiz section
    const quizMatch = content.match(/## 📋.*Quiz[\s\S]+?(### Câu \d+)/);
    if (!quizMatch) return questions;

    const quizContent = content.slice(quizMatch.index);

    // Find each question
    const questionMatches = quizContent.matchAll(/### Câu (\d+):\s*\n(.+?)\n([\s\S]+?)(?=### Câu \d+:|## 🏆|$)/g);

    for (const match of questionMatches) {
        const questionText = match[2].trim();
        const qContent = match[3].trim();

        // Extract options
        const options = [];
        const optionMatches = qContent.matchAll(/^-\s*([A-D])\.\s*(.+)$/gm);
        for (const om of optionMatches) {
            options.push(om[2].trim());
        }

        // Find correct answer in details
        let correct = 0;
        const answerMatch = qContent.match(/\*\*([A-D])\./);
        if (answerMatch) {
            correct = answerMatch[1].charCodeAt(0) - 'A'.charCodeAt(0);
        }

        // Extract explanation
        let explanation = '';
        const expMatch = qContent.match(/<summary>.*?<\/summary>\s*\n\s*\*\*[A-D]\..+\*\*\s*\n([\s\S]+?)(?:<\/details>|$)/);
        if (expMatch) {
            explanation = expMatch[1].trim();
        }

        if (options.length >= 2) {
            questions.push({
                content: questionText,
                options: options,
                correct: correct,
                explanation: explanation,
                points: 10
            });
        }
    }

    return questions;
}

function parseCurriculumFile(filepath) {
    const content = fs.readFileSync(filepath, 'utf-8');

    // Extract week number and title
    const titleMatch = content.match(/^# Tuần (\d+)[:\s]+(.+?)$/m);
    if (!titleMatch) {
        console.log(`  ⚠️ Could not parse title from ${filepath}`);
        return null;
    }

    const weekNum = parseInt(titleMatch[1]);
    const weekTitle = titleMatch[2].trim();

    // Extract overview - everything between title and first ## section
    let overview = '';
    const overviewMatch = content.match(/^# .+?\n([\s\S]+?)(?=\n## 🎯)/m);
    if (overviewMatch) {
        overview = overviewMatch[1].trim();
    }

    // Get objectives
    const objectives = extractObjectives(content);

    // Exam checklist from Key Points section
    const examChecklist = [];
    const keyMatch = content.match(/### Key Points[:\s]*([\s\S]+?)(?=### |## |$)/i);
    if (keyMatch) {
        const lines = keyMatch[1].split('\n');
        for (const line of lines) {
            const m = line.match(/^\d+\.\s*\*\*(.+?)\*\*/);
            if (m) examChecklist.push(m[1].trim());
        }
    }

    // === LESSONS: Get full content sections ===
    const lessons = [];

    // Get all major content (everything except labs and quiz)
    const mainContent = content.match(/## 🎯[\s\S]+?(?=## 🔬|## 📋.*Quiz|## 🏆|$)/);
    if (mainContent) {
        lessons.push({
            title: weekTitle,
            content: mainContent[0].trim()
        });
    }

    // Get labs
    const labs = extractLabs(content);

    // Get quiz questions
    const questions = extractQuestions(content);

    console.log(`     ✓ Week ${weekNum}: ${lessons.length} lessons, ${labs.length} labs, ${questions.length} questions`);

    return {
        weekNum,
        title: weekTitle,
        overview,
        objectives,
        examChecklist,
        lessons,
        labs,
        questions
    };
}

function generateSql(weeksData) {
    let sql = `-- Seed data cho Arduino Learning Hub
-- Generated from curriculum/ markdown files
-- Run: cd apps/workers && npx wrangler d1 execute arduino-db --remote --file=src/db/seed.sql

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

-- ==========================================
-- COURSE
-- ==========================================
INSERT INTO courses (id, code, title, description, total_weeks, is_published, created_at) VALUES 
('course-tech476', 'TECH476', 'Lập trình hệ thống nhúng & IoT', 
 'Khóa học Arduino Uno 12 tuần: Từ GPIO cơ bản đến WiFi & IoT. Học lý thuyết chi tiết, thực hành với simulator Wokwi, và làm dự án thực tế.', 
 12, 1, unixepoch());

-- ==========================================
-- WEEKS (with full overview)
-- ==========================================
`;

    for (const week of weeksData) {
        const wId = `week-${String(week.weekNum).padStart(2, '0')}`;
        const objectivesJson = JSON.stringify(week.objectives);
        const examJson = JSON.stringify(week.examChecklist);

        sql += `INSERT INTO weeks (id, course_id, week_number, title, overview, objectives, exam_checklist, is_published, created_at) VALUES 
('${wId}', 'course-tech476', ${week.weekNum}, '${escapeSql(week.title)}', 
 '${escapeSql(week.overview)}', 
 '${escapeSql(objectivesJson)}', 
 '${escapeSql(examJson)}', 1, unixepoch());

`;
    }

    sql += `-- ==========================================
-- LESSONS (Full content from curriculum)
-- ==========================================
`;

    for (const week of weeksData) {
        const wId = `week-${String(week.weekNum).padStart(2, '0')}`;
        for (let i = 0; i < week.lessons.length; i++) {
            const lesson = week.lessons[i];
            const lId = `lesson-${String(week.weekNum).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`;

            sql += `INSERT INTO lessons (id, week_id, order_index, title, content, duration, is_published, created_at) VALUES 
('${lId}', '${wId}', ${i + 1}, '${escapeSql(lesson.title)}', 
 '${escapeSql(lesson.content)}', 
 30, 1, unixepoch());

`;
        }
    }

    sql += `-- ==========================================
-- LABS (from curriculum)
-- ==========================================
`;

    for (const week of weeksData) {
        const wId = `week-${String(week.weekNum).padStart(2, '0')}`;

        // If no labs found from parsing, create default labs
        let labsToInsert = week.labs;
        if (labsToInsert.length === 0) {
            labsToInsert = [{
                title: `Thực hành tuần ${week.weekNum}`,
                objective: `Áp dụng kiến thức tuần ${week.weekNum}`,
                instructions: `# Bài thực hành\n\nÁp dụng kiến thức đã học trong tuần ${week.weekNum}.`,
                rubric: { criteria: [{ name: 'Hoàn thành yêu cầu', points: 100, description: 'Đánh giá tổng hợp' }], total: 100 }
            }];
        }

        for (let i = 0; i < labsToInsert.length; i++) {
            const lab = labsToInsert[i];
            const labId = `lab-${String(week.weekNum).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`;
            const rubricJson = JSON.stringify(lab.rubric);
            const simUrl = week.weekNum >= 11 ? 'https://wokwi.com/projects/new/esp32' : 'https://wokwi.com/projects/new/arduino-uno';

            sql += `INSERT INTO labs (id, week_id, order_index, title, objective, instructions, wiring, starter_code, solution_code, rubric, simulator_url, duration, is_published, created_at) VALUES 
('${labId}', '${wId}', ${i + 1}, '${escapeSql(lab.title)}', 
 '${escapeSql(lab.objective)}', 
 '${escapeSql(lab.instructions)}', 
 'Xem sơ đồ trong hướng dẫn', 
 '// Viết code của bạn ở đây\\n\\nvoid setup() {\\n  \\n}\\n\\nvoid loop() {\\n  \\n}', 
 '', 
 '${escapeSql(rubricJson)}', 
 '${simUrl}', 45, 1, unixepoch());

`;
        }
    }

    sql += `-- ==========================================
-- QUIZZES & QUESTIONS
-- ==========================================
`;

    for (const week of weeksData) {
        const wId = `week-${String(week.weekNum).padStart(2, '0')}`;
        const qId = `quiz-${String(week.weekNum).padStart(2, '0')}`;

        sql += `INSERT INTO quizzes (id, week_id, title, description, time_limit, passing_score, is_published, created_at) VALUES 
('${qId}', '${wId}', 'Quiz Tuần ${week.weekNum}: ${escapeSql(week.title)}', 
 'Kiểm tra kiến thức tuần ${week.weekNum}', 15, 60, 1, unixepoch());

`;

        let questionsToInsert = week.questions;
        // Add placeholder questions if none found
        if (questionsToInsert.length === 0) {
            questionsToInsert = [
                { content: `Câu hỏi 1 tuần ${week.weekNum}?`, options: ['Đáp án A', 'Đáp án B', 'Đáp án C', 'Đáp án D'], correct: 0, explanation: '', points: 10 },
                { content: `Câu hỏi 2 tuần ${week.weekNum}?`, options: ['Đáp án A', 'Đáp án B', 'Đáp án C', 'Đáp án D'], correct: 0, explanation: '', points: 10 },
                { content: `Câu hỏi 3 tuần ${week.weekNum}?`, options: ['Đáp án A', 'Đáp án B', 'Đáp án C', 'Đáp án D'], correct: 0, explanation: '', points: 10 }
            ];
        }

        for (let j = 0; j < questionsToInsert.length; j++) {
            const q = questionsToInsert[j];
            const questionId = `q-${String(week.weekNum).padStart(2, '0')}-${String(j + 1).padStart(2, '0')}`;
            const optionsJson = JSON.stringify(q.options);

            sql += `INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES 
('${questionId}', '${qId}', ${j + 1}, 'single', '${escapeSql(q.content)}', 
 '${escapeSql(optionsJson)}', '${q.correct}', 
 '${escapeSql(q.explanation || '')}', ${q.points}, unixepoch());

`;
        }
    }

    sql += `-- ==========================================
-- EXAM DRILLS (one per week)
-- ==========================================
`;

    for (const week of weeksData) {
        const wId = `week-${String(week.weekNum).padStart(2, '0')}`;
        const drillId = `drill-${String(week.weekNum).padStart(2, '0')}`;
        const rubric = JSON.stringify({
            items: [
                { name: 'Hoàn thành yêu cầu', points: 50, description: 'Đáp ứng đầy đủ yêu cầu đề bài' },
                { name: 'Code quality', points: 30, description: 'Code sạch, có comment' },
                { name: 'Debug & Testing', points: 20, description: 'Có Serial log, test kỹ' }
            ]
        });
        const drillContent = `# Bài thi thực hành Tuần ${week.weekNum}\\n\\n## Đề bài\\nÁp dụng kiến thức tuần ${week.weekNum}: ${week.title}\\n\\n## Yêu cầu\\n1. Hoàn thành bài tập trong thời gian quy định\\n2. Code chạy đúng yêu cầu\\n3. Có comment giải thích logic`;

        sql += `INSERT INTO exam_drills (id, week_id, title, description, content, rubric, time_limit, is_published, created_at) VALUES 
('${drillId}', '${wId}', 'Exam Drill Tuần ${week.weekNum}', 
 'Ôn tập kiến thức tuần ${week.weekNum} - ${escapeSql(week.title)}',
 '${escapeSql(drillContent)}',
 '${escapeSql(rubric)}',
 30, 1, unixepoch());

`;
    }

    return sql;
}

function main() {
    console.log('🔍 Parsing curriculum files...');

    const weeksData = [];

    // Find all curriculum files
    const files = fs.readdirSync(CURRICULUM_DIR)
        .filter(f => f.match(/^week-\d+.*\.md$/))
        .sort();

    for (const file of files) {
        const filepath = path.join(CURRICULUM_DIR, file);
        console.log(`  📄 ${file}`);

        const data = parseCurriculumFile(filepath);
        if (data) {
            weeksData.push(data);
        }
    }

    console.log('\n📝 Generating SQL...');
    const sql = generateSql(weeksData);

    // Write to file
    fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
    fs.writeFileSync(OUTPUT_FILE, sql, 'utf-8');

    const totalLessons = weeksData.reduce((sum, w) => sum + w.lessons.length, 0);
    const totalLabs = weeksData.reduce((sum, w) => sum + w.labs.length, 0);
    const totalQuestions = weeksData.reduce((sum, w) => sum + w.questions.length, 0);

    console.log(`\n✅ Generated ${OUTPUT_FILE}`);
    console.log(`   📚 ${weeksData.length} weeks`);
    console.log(`   📖 ${totalLessons} lessons`);
    console.log(`   🔬 ${totalLabs} labs parsed (+ defaults)`);
    console.log(`   📋 ${totalQuestions} questions parsed (+ defaults)`);
    console.log(`   🎯 ${weeksData.length} exam drills`);
    console.log('\n🚀 To apply changes, run:');
    console.log('   cd apps/workers');
    console.log('   npx wrangler d1 execute arduino-db --remote --file=src/db/seed.sql');
}

main();
