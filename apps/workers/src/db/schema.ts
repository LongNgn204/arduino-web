// Database schema cho Arduino Learning Hub
// Sử dụng Drizzle ORM với SQLite (Cloudflare D1)

import { sql } from 'drizzle-orm';
import { text, integer, sqliteTable, index, uniqueIndex } from 'drizzle-orm/sqlite-core';

// ==========================================
// USERS & AUTH
// ==========================================

// Bảng users - lưu thông tin người dùng
export const users = sqliteTable('users', {
    id: text('id').primaryKey(), // UUID
    username: text('username').notNull().unique(),
    passwordHash: text('password_hash').notNull(), // format: pbkdf2$iterations$salt$hash
    role: text('role', { enum: ['student', 'admin'] }).notNull().default('student'),
    displayName: text('display_name'),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (table) => ({
    usernameIdx: index('users_username_idx').on(table.username),
}));

// Bảng sessions - quản lý phiên đăng nhập
export const sessions = sqliteTable('sessions', {
    id: text('id').primaryKey(), // Session token
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (table) => ({
    userIdIdx: index('sessions_user_id_idx').on(table.userId),
    expiresIdx: index('sessions_expires_idx').on(table.expiresAt),
}));

// ==========================================
// COURSE STRUCTURE
// ==========================================

// Bảng courses - khóa học chính
export const courses = sqliteTable('courses', {
    id: text('id').primaryKey(),
    code: text('code').notNull().unique(), // e.g. "TECH476"
    title: text('title').notNull(),
    description: text('description'),
    totalWeeks: integer('total_weeks').notNull().default(12),
    isPublished: integer('is_published', { mode: 'boolean' }).notNull().default(false),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// Bảng weeks - 12 tuần học
export const weeks = sqliteTable('weeks', {
    id: text('id').primaryKey(),
    courseId: text('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
    weekNumber: integer('week_number').notNull(), // 1-12
    title: text('title').notNull(),
    overview: text('overview'), // Markdown content
    objectives: text('objectives'), // JSON array of objectives
    examChecklist: text('exam_checklist'), // JSON array - những gì cần biết để thi
    isPublished: integer('is_published', { mode: 'boolean' }).notNull().default(false),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (table) => ({
    courseWeekIdx: index('weeks_course_week_idx').on(table.courseId, table.weekNumber),
}));

// ==========================================
// LESSONS & LABS
// ==========================================

// Bảng lessons - bài giảng lý thuyết
export const lessons = sqliteTable('lessons', {
    id: text('id').primaryKey(),
    weekId: text('week_id').notNull().references(() => weeks.id, { onDelete: 'cascade' }),
    orderIndex: integer('order_index').notNull(), // Thứ tự trong tuần
    title: text('title').notNull(),
    content: text('content').notNull(), // Markdown content
    duration: integer('duration'), // Phút ước tính
    isPublished: integer('is_published', { mode: 'boolean' }).notNull().default(false),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (table) => ({
    weekOrderIdx: index('lessons_week_order_idx').on(table.weekId, table.orderIndex),
}));

// Bảng labs - bài thực hành
export const labs = sqliteTable('labs', {
    id: text('id').primaryKey(),
    weekId: text('week_id').notNull().references(() => weeks.id, { onDelete: 'cascade' }),
    orderIndex: integer('order_index').notNull(),
    title: text('title').notNull(),
    objective: text('objective'), // Mục tiêu bài lab
    instructions: text('instructions').notNull(), // Markdown - hướng dẫn chi tiết
    wiring: text('wiring'), // Markdown hoặc JSON - sơ đồ kết nối
    starterCode: text('starter_code'), // Code mẫu ban đầu
    solutionCode: text('solution_code'), // Code lời giải (chỉ admin xem)
    rubric: text('rubric'), // JSON - tiêu chí chấm điểm
    simulatorUrl: text('simulator_url'), // Wokwi embed URL
    duration: integer('duration'), // Phút ước tính
    isPublished: integer('is_published', { mode: 'boolean' }).notNull().default(false),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (table) => ({
    weekOrderIdx: index('labs_week_order_idx').on(table.weekId, table.orderIndex),
}));

// ==========================================
// QUIZZES & QUESTIONS
// ==========================================

// Bảng quizzes - bài kiểm tra
export const quizzes = sqliteTable('quizzes', {
    id: text('id').primaryKey(),
    weekId: text('week_id').notNull().references(() => weeks.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description'),
    timeLimit: integer('time_limit'), // Phút, null = không giới hạn
    passingScore: integer('passing_score').notNull().default(60), // Phần trăm
    isPublished: integer('is_published', { mode: 'boolean' }).notNull().default(false),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// Bảng questions - câu hỏi quiz
export const questions = sqliteTable('questions', {
    id: text('id').primaryKey(),
    quizId: text('quiz_id').notNull().references(() => quizzes.id, { onDelete: 'cascade' }),
    orderIndex: integer('order_index').notNull(),
    type: text('type', { enum: ['single', 'multiple', 'truefalse', 'fill_in_blank'] }).notNull().default('single'),
    content: text('content').notNull(), // Markdown - nội dung câu hỏi
    options: text('options').notNull(), // JSON array - các lựa chọn (hoặc null nếu điền từ)
    correctAnswer: text('correct_answer').notNull(), // JSON - đáp án đúng (index hoặc text)
    explanation: text('explanation'), // Giải thích đáp án
    points: integer('points').notNull().default(1),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (table) => ({
    quizOrderIdx: index('questions_quiz_order_idx').on(table.quizId, table.orderIndex),
}));

// ==========================================
// PROJECTS LIBRARY
// ==========================================

// Bảng projects - thư viện dự án IoT
export const projects = sqliteTable('projects', {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    content: text('content').notNull(), // Markdown hướng dẫn chi tiết
    difficulty: text('difficulty', { enum: ['easy', 'medium', 'hard'] }).notNull().default('medium'),
    imageUrl: text('image_url'), // Ảnh thumbnail
    simulatorUrl: text('simulator_url'), // Wokwi embed URL
    tags: text('tags'), // JSON array tags e.g. ["IoT", "ESP32", "Led"]
    isPublished: integer('is_published', { mode: 'boolean' }).notNull().default(false),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// Bảng saved_items - lưu bài học/dự án
export const savedItems = sqliteTable('saved_items', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull(), // User who saved (from Auth0/App)
    itemType: text('item_type', { enum: ['lesson', 'project'] }).notNull(),
    itemId: text('item_id').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (table) => ({
    userItemIdx: uniqueIndex('saved_items_user_item_idx').on(table.userId, table.itemType, table.itemId),
}));

// ==========================================
// EXAM DRILLS
// ==========================================

// Bảng exam_drills - đề ôn tập/thi thử
export const examDrills = sqliteTable('exam_drills', {
    id: text('id').primaryKey(),
    weekId: text('week_id').notNull().references(() => weeks.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description'),
    content: text('content').notNull(), // Markdown - đề bài
    sampleSolution: text('sample_solution'), // Lời giải mẫu (admin only)
    simulatorUrl: text('simulator_url'), // Wokwi embed URL
    difficulty: text('difficulty', { enum: ['easy', 'medium', 'hard'] }).notNull().default('medium'),
    passingScore: integer('passing_score').notNull().default(60),
    timeLimit: integer('time_limit').notNull().default(60), // Phút
    isPublished: integer('is_published', { mode: 'boolean' }).notNull().default(false),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// Bảng drill_submissions - lịch sử làm bài drill
export const drillSubmissions = sqliteTable('drill_submissions', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    drillId: text('drill_id').notNull().references(() => examDrills.id, { onDelete: 'cascade' }),
    code: text('code').notNull(), // Code nộp
    score: integer('score').notNull(), // Điểm chấm
    passed: integer('passed', { mode: 'boolean' }).notNull(),
    feedback: text('feedback'), // AI Feedback
    submittedAt: integer('submitted_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (table) => ({
    userDrillIdx: index('drill_submissions_user_drill_idx').on(table.userId, table.drillId),
}));

// ==========================================
// PROGRESS & ATTEMPTS
// ==========================================

// Bảng progress - tiến độ học tập
export const progress = sqliteTable('progress', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    lessonId: text('lesson_id').references(() => lessons.id, { onDelete: 'cascade' }),
    labId: text('lab_id').references(() => labs.id, { onDelete: 'cascade' }),
    status: text('status', { enum: ['not_started', 'in_progress', 'completed'] }).notNull().default('not_started'),
    completedAt: integer('completed_at', { mode: 'timestamp' }),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (table) => ({
    userLessonIdx: index('progress_user_lesson_idx').on(table.userId, table.lessonId),
    userLabIdx: index('progress_user_lab_idx').on(table.userId, table.labId),
}));

// Bảng quiz_attempts - lịch sử làm quiz
export const quizAttempts = sqliteTable('quiz_attempts', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    quizId: text('quiz_id').notNull().references(() => quizzes.id, { onDelete: 'cascade' }),
    answers: text('answers').notNull(), // JSON - câu trả lời của user
    score: integer('score').notNull(), // Điểm đạt được
    maxScore: integer('max_score').notNull(), // Điểm tối đa
    passed: integer('passed', { mode: 'boolean' }).notNull(),
    startedAt: integer('started_at', { mode: 'timestamp' }).notNull(),
    submittedAt: integer('submitted_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (table) => ({
    userQuizIdx: index('quiz_attempts_user_quiz_idx').on(table.userId, table.quizId),
}));

// Bảng lab_submissions - bài nộp lab (autosave)
export const labSubmissions = sqliteTable('lab_submissions', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    labId: text('lab_id').notNull().references(() => labs.id, { onDelete: 'cascade' }),
    code: text('code').notNull(), // Code của sinh viên
    isSubmitted: integer('is_submitted', { mode: 'boolean' }).notNull().default(false),
    grade: text('grade'), // PASS/FAIL hoặc điểm số
    feedback: text('feedback'), // Nhận xét từ AI hoặc giảng viên
    gradedAt: integer('graded_at', { mode: 'timestamp' }),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (table) => ({
    userLabIdx: index('lab_submissions_user_lab_idx').on(table.userId, table.labId),
}));

// ==========================================
// AI CHAT LOGS
// ==========================================

// Bảng ai_chat_logs - log tương tác với AI (phục vụ cải tiến)
export const aiChatLogs = sqliteTable('ai_chat_logs', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    mode: text('mode', { enum: ['tutor', 'socratic', 'grader'] }).notNull(),
    lessonId: text('lesson_id').references(() => lessons.id, { onDelete: 'set null' }),
    labId: text('lab_id').references(() => labs.id, { onDelete: 'set null' }),
    userQuestion: text('user_question').notNull(),
    aiResponse: text('ai_response').notNull(),
    contextData: text('context_data'), // JSON - selectedText, currentCode, errorLog
    tokensUsed: integer('tokens_used'),
    latencyMs: integer('latency_ms'),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (table) => ({
    userIdx: index('ai_chat_logs_user_idx').on(table.userId),
    createdAtIdx: index('ai_chat_logs_created_idx').on(table.createdAt),
}));

// ==========================================
// TYPE EXPORTS
// ==========================================

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type Week = typeof weeks.$inferSelect;
export type Lesson = typeof lessons.$inferSelect;
export type Lab = typeof labs.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Quiz = typeof quizzes.$inferSelect;
export type Question = typeof questions.$inferSelect;
export type QuizAttempt = typeof quizAttempts.$inferSelect;
export type LabSubmission = typeof labSubmissions.$inferSelect;
export type DrillSubmission = typeof drillSubmissions.$inferSelect;
export type AiChatLog = typeof aiChatLogs.$inferSelect;
