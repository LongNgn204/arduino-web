#!/usr/bin/env python3
"""
Curriculum Parser for Arduino Learning Hub
Parses markdown files from curriculum/ and generates seed.sql with full content.
"""

import os
import re
import json
from pathlib import Path

CURRICULUM_DIR = Path("curriculum")
OUTPUT_FILE = Path("apps/workers/src/db/seed.sql")

def escape_sql(text):
    """Escape single quotes for SQL"""
    if text is None:
        return ""
    return text.replace("'", "''")

def extract_section(content, pattern, end_pattern=r'^## '):
    """Extract content between pattern and next heading"""
    match = re.search(pattern, content, re.MULTILINE)
    if not match:
        return None
    
    start = match.end()
    end_match = re.search(end_pattern, content[start:], re.MULTILINE)
    if end_match:
        return content[start:start + end_match.start()].strip()
    return content[start:].strip()

def extract_objectives(content):
    """Extract learning objectives as list"""
    section = extract_section(content, r'^## 🎯 Mục tiêu học tập\s*\n')
    if not section:
        return []
    
    objectives = []
    for line in section.split('\n'):
        # Match numbered items like "1. ✅ Hiểu Arduino..."
        match = re.match(r'^\d+\.\s*[✅✓]?\s*(.+)$', line.strip())
        if match:
            objectives.append(match.group(1).strip())
    
    return objectives

def extract_theory_sections(content):
    """Extract theory/lesson content sections"""
    lessons = []
    
    # Pattern for main theory sections
    theory_pattern = r'^## 📚 Phần (\d+): (.+?)$'
    matches = list(re.finditer(theory_pattern, content, re.MULTILINE))
    
    if not matches:
        # Try alternative pattern
        theory_pattern = r'^### (\d+\.\d+) (.+?)$'
        matches = list(re.finditer(theory_pattern, content, re.MULTILINE))
    
    for i, match in enumerate(matches):
        start = match.start()
        # Find end (next section or end of file)
        if i + 1 < len(matches):
            end = matches[i + 1].start()
        else:
            # Find next major section
            next_section = re.search(r'^## [💻⚠️🎓📋🔬🏆]', content[start + 100:], re.MULTILINE)
            if next_section:
                end = start + 100 + next_section.start()
            else:
                end = len(content)
        
        section_content = content[start:end].strip()
        title = match.group(2).strip() if len(match.groups()) > 1 else match.group(1).strip()
        
        lessons.append({
            'title': title,
            'content': section_content
        })
    
    return lessons

def extract_code_examples(content):
    """Extract code blocks section"""
    section = extract_section(content, r'^## 💻 Phần \d+: Code mẫu')
    return section

def extract_labs(content):
    """Extract lab assignments"""
    labs = []
    
    # Find lab sections
    lab_pattern = r'^### Lab (\d+-\d+): (.+?)$'
    matches = list(re.finditer(lab_pattern, content, re.MULTILINE))
    
    for i, match in enumerate(matches):
        start = match.start()
        # Find end
        if i + 1 < len(matches):
            end = matches[i + 1].start()
        else:
            next_section = re.search(r'^## ', content[start + 50:], re.MULTILINE)
            if next_section:
                end = start + 50 + next_section.start()
            else:
                end = len(content)
        
        lab_content = content[start:end].strip()
        lab_id = match.group(1)
        title = match.group(2).strip()
        
        # Extract objective
        obj_match = re.search(r'\*\*Mục tiêu\*\*:\s*(.+?)(?:\n|$)', lab_content)
        objective = obj_match.group(1) if obj_match else f"Hoàn thành {title}"
        
        # Extract requirements
        req_match = re.search(r'\*\*Yêu cầu\*\*:\s*([\s\S]+?)(?=\*\*Rubric\*\*|\Z)', lab_content)
        instructions = req_match.group(1).strip() if req_match else lab_content
        
        # Extract rubric
        rubric = {'criteria': [], 'total': 100}
        rubric_pattern = r'\|\s*(.+?)\s*\|\s*(\d+)%?\s*\|'
        for rm in re.finditer(rubric_pattern, lab_content):
            criteria = rm.group(1).strip()
            if criteria and criteria != 'Tiêu chí' and criteria != '---':
                rubric['criteria'].append({
                    'name': criteria,
                    'points': int(rm.group(2)),
                    'description': f"Đánh giá: {criteria}"
                })
        
        labs.append({
            'id': lab_id,
            'title': title,
            'objective': objective,
            'instructions': instructions,
            'rubric': rubric
        })
    
    return labs

def extract_quiz(content):
    """Extract quiz questions"""
    questions = []
    
    # Find quiz section
    quiz_section = extract_section(content, r'^## 📋 Phần \d+: Quiz')
    if not quiz_section:
        quiz_section = extract_section(content, r'^## 📋.*Quiz')
    
    if not quiz_section:
        return questions
    
    # Find each question
    q_pattern = r'^### Câu (\d+):\s*\n(.+?)(?=^### Câu|\Z)'
    matches = re.finditer(q_pattern, quiz_section, re.MULTILINE | re.DOTALL)
    
    for match in matches:
        q_num = match.group(1)
        q_content = match.group(2).strip()
        
        # Extract question text (first paragraph)
        lines = q_content.split('\n')
        question_text = lines[0].strip() if lines else ""
        
        # Extract options
        options = []
        correct = 0
        for line in lines:
            opt_match = re.match(r'^-\s*([A-D])\.\s*(.+)$', line.strip())
            if opt_match:
                options.append(opt_match.group(2).strip())
        
        # Try to find answer in details tag
        answer_match = re.search(r'\*\*([A-D])\.\s*.+\*\*', q_content)
        if answer_match:
            correct = ord(answer_match.group(1)) - ord('A')
        
        # Extract explanation
        exp_match = re.search(r'<details>[\s\S]*?<summary>.*?</summary>\s*\n\s*\*\*[A-D]\..+\*\*\s*\n(.+?)(?:</details>|$)', q_content, re.DOTALL)
        explanation = exp_match.group(1).strip() if exp_match else None
        
        if options:
            questions.append({
                'content': question_text,
                'options': options,
                'correct': correct,
                'explanation': explanation,
                'points': 10
            })
    
    return questions

def parse_curriculum_file(filepath):
    """Parse a single curriculum markdown file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract week number and title
    title_match = re.search(r'^# Tuần (\d+): (.+)$', content, re.MULTILINE)
    if not title_match:
        print(f"Warning: Could not parse title from {filepath}")
        return None
    
    week_num = int(title_match.group(1))
    week_title = title_match.group(2).strip()
    
    # Extract overview (content until first ##)
    overview_match = re.search(r'^# .+?\n([\s\S]+?)(?=^## )', content, re.MULTILINE)
    overview = overview_match.group(1).strip() if overview_match else ""
    
    # Get objectives
    objectives = extract_objectives(content)
    
    # Get exam checklist (from summary section)
    exam_checklist = []
    summary_section = extract_section(content, r'^## 🎓 Phần \d+: Tóm tắt')
    if summary_section:
        for line in summary_section.split('\n'):
            match = re.match(r'^\d+\.\s*\*\*(.+?)\*\*', line.strip())
            if match:
                exam_checklist.append(match.group(1).strip())
    
    # Get full content for lessons
    lessons = []
    
    # Lesson 1: Theory (Phần 1: Lý thuyết)
    theory = extract_section(content, r'^## 📚 Phần 1:', r'^## [💻⚠️🎓📋🔬🏆]')
    if theory:
        lessons.append({
            'title': f'Lý thuyết: {week_title}',
            'content': f"## 📚 Lý thuyết cốt lõi\n\n{theory}"
        })
    
    # Lesson 2: Code examples (Phần 2: Code mẫu)  
    code_section = extract_section(content, r'^## 💻 Phần 2:', r'^## [⚠️🎓📋🔬🏆]')
    if code_section:
        lessons.append({
            'title': f'Code mẫu: {week_title}',
            'content': f"## 💻 Code mẫu hoàn chỉnh\n\n{code_section}"
        })
    
    # Get labs
    labs = extract_labs(content)
    
    # Get quiz questions
    questions = extract_quiz(content)
    
    return {
        'week_num': week_num,
        'title': week_title,
        'overview': overview,
        'objectives': objectives,
        'exam_checklist': exam_checklist,
        'lessons': lessons,
        'labs': labs,
        'questions': questions
    }

def generate_sql(weeks_data):
    """Generate SQL seed file from parsed data"""
    
    sql = """-- Seed data cho Arduino Learning Hub
-- Generated from curriculum/ markdown files
-- Run: npx wrangler d1 execute arduino-db --remote --file=apps/workers/src/db/seed.sql

-- ==========================================
-- CLEAR OLD DATA (careful in production!)
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
 'Khóa học Arduino Uno 12 tuần: Từ GPIO cơ bản đến WiFi & IoT. Học lý thuyết, thực hành simulator Wokwi, và làm dự án thực tế.', 
 12, 1, unixepoch());

-- ==========================================
-- WEEKS
-- ==========================================
"""

    for week in weeks_data:
        w_id = f"week-{week['week_num']:02d}"
        objectives_json = json.dumps(week['objectives'], ensure_ascii=False)
        exam_json = json.dumps(week['exam_checklist'], ensure_ascii=False)
        
        sql += f"""INSERT INTO weeks (id, course_id, week_number, title, overview, objectives, exam_checklist, is_published, created_at) VALUES 
('{w_id}', 'course-tech476', {week['week_num']}, '{escape_sql(week['title'])}', 
 '{escape_sql(week['overview'])}', 
 '{escape_sql(objectives_json)}', 
 '{escape_sql(exam_json)}', 1, unixepoch());

"""

    sql += "-- ==========================================\n-- LESSONS\n-- ==========================================\n"
    
    for week in weeks_data:
        w_id = f"week-{week['week_num']:02d}"
        for i, lesson in enumerate(week['lessons'], 1):
            l_id = f"lesson-{week['week_num']:02d}-{i:02d}"
            sql += f"""INSERT INTO lessons (id, week_id, order_index, title, content, duration, is_published, created_at) VALUES 
('{l_id}', '{w_id}', {i}, '{escape_sql(lesson['title'])}', 
 '{escape_sql(lesson['content'])}', 
 25, 1, unixepoch());

"""

    sql += "-- ==========================================\n-- LABS\n-- ==========================================\n"
    
    for week in weeks_data:
        w_id = f"week-{week['week_num']:02d}"
        for i, lab in enumerate(week['labs'], 1):
            lab_id = f"lab-{week['week_num']:02d}-{i:02d}"
            rubric_json = json.dumps(lab['rubric'], ensure_ascii=False)
            sim_url = "https://wokwi.com/projects/new/arduino-uno"
            
            sql += f"""INSERT INTO labs (id, week_id, order_index, title, objective, instructions, wiring, starter_code, solution_code, rubric, simulator_url, duration, is_published, created_at) VALUES 
('{lab_id}', '{w_id}', {i}, '{escape_sql(lab['title'])}', 
 '{escape_sql(lab['objective'])}', 
 '{escape_sql(lab['instructions'])}', 
 'Xem sơ đồ trong hướng dẫn', 
 '// Viết code của bạn ở đây\\n\\nvoid setup() {{\\n  \\n}}\\n\\nvoid loop() {{\\n  \\n}}', 
 '', 
 '{escape_sql(rubric_json)}', 
 '{sim_url}', 45, 1, unixepoch());

"""

    sql += "-- ==========================================\n-- QUIZZES & QUESTIONS\n-- ==========================================\n"
    
    for week in weeks_data:
        w_id = f"week-{week['week_num']:02d}"
        q_id = f"quiz-{week['week_num']:02d}"
        
        sql += f"""INSERT INTO quizzes (id, week_id, title, description, time_limit, passing_score, is_published, created_at) VALUES 
('{q_id}', '{w_id}', 'Quiz Tuần {week['week_num']}', 'Kiểm tra kiến thức tuần {week['week_num']}', 15, 60, 1, unixepoch());

"""
        
        for j, q in enumerate(week['questions'], 1):
            qid = f"q-{week['week_num']:02d}-{j:02d}"
            options_json = json.dumps(q['options'], ensure_ascii=False)
            
            sql += f"""INSERT INTO questions (id, quiz_id, order_index, type, content, options, correct_answer, explanation, points, created_at) VALUES 
('{qid}', '{q_id}', {j}, 'single', '{escape_sql(q['content'])}', 
 '{escape_sql(options_json)}', '{q['correct']}', 
 '{escape_sql(q['explanation'] or '')}', {q['points']}, unixepoch());

"""

    return sql

def main():
    print("🔍 Parsing curriculum files...")
    
    weeks_data = []
    
    # Find all curriculum files
    for filepath in sorted(CURRICULUM_DIR.glob("week-*.md")):
        print(f"  📄 {filepath.name}")
        data = parse_curriculum_file(filepath)
        if data:
            weeks_data.append(data)
            print(f"     ✓ Week {data['week_num']}: {len(data['lessons'])} lessons, {len(data['labs'])} labs, {len(data['questions'])} questions")
    
    print(f"\n📝 Generating SQL...")
    sql = generate_sql(weeks_data)
    
    # Write to file
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(sql)
    
    print(f"✅ Generated {OUTPUT_FILE}")
    print(f"   Total: {len(weeks_data)} weeks")
    print(f"\n🚀 To apply changes, run:")
    print(f"   cd apps/workers")
    print(f"   npx wrangler d1 execute arduino-db --remote --file=src/db/seed.sql")

if __name__ == "__main__":
    main()
