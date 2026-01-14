-- Migration 0001: Tạo tất cả tables cho Arduino Learning Hub
-- Run: wrangler d1 migrations apply arduino-db --local (hoặc --remote)

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student',
  display_name TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS users_username_idx ON users(username);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions(user_id);
CREATE INDEX IF NOT EXISTS sessions_expires_idx ON sessions(expires_at);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  total_weeks INTEGER NOT NULL DEFAULT 12,
  is_published INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- Weeks table
CREATE TABLE IF NOT EXISTS weeks (
  id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  overview TEXT,
  objectives TEXT,
  exam_checklist TEXT,
  is_published INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS weeks_course_week_idx ON weeks(course_id, week_number);

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id TEXT PRIMARY KEY,
  week_id TEXT NOT NULL REFERENCES weeks(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  duration INTEGER,
  is_published INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS lessons_week_order_idx ON lessons(week_id, order_index);

-- Labs table
CREATE TABLE IF NOT EXISTS labs (
  id TEXT PRIMARY KEY,
  week_id TEXT NOT NULL REFERENCES weeks(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  title TEXT NOT NULL,
  objective TEXT,
  instructions TEXT NOT NULL,
  wiring TEXT,
  starter_code TEXT,
  solution_code TEXT,
  rubric TEXT,
  simulator_url TEXT,
  duration INTEGER,
  is_published INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS labs_week_order_idx ON labs(week_id, order_index);

-- Quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
  id TEXT PRIMARY KEY,
  week_id TEXT NOT NULL REFERENCES weeks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  time_limit INTEGER,
  passing_score INTEGER NOT NULL DEFAULT 60,
  is_published INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  quiz_id TEXT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  type TEXT NOT NULL DEFAULT 'single',
  content TEXT NOT NULL,
  options TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  points INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS questions_quiz_order_idx ON questions(quiz_id, order_index);

-- Exam drills table
CREATE TABLE IF NOT EXISTS exam_drills (
  id TEXT PRIMARY KEY,
  week_id TEXT NOT NULL REFERENCES weeks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  rubric TEXT,
  sample_solution TEXT,
  time_limit INTEGER NOT NULL DEFAULT 60,
  is_published INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- Progress table
CREATE TABLE IF NOT EXISTS progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id TEXT REFERENCES lessons(id) ON DELETE CASCADE,
  lab_id TEXT REFERENCES labs(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'not_started',
  completed_at INTEGER,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS progress_user_lesson_idx ON progress(user_id, lesson_id);
CREATE INDEX IF NOT EXISTS progress_user_lab_idx ON progress(user_id, lab_id);

-- Quiz attempts table
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  quiz_id TEXT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  answers TEXT NOT NULL,
  score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  passed INTEGER NOT NULL,
  started_at INTEGER NOT NULL,
  submitted_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS quiz_attempts_user_quiz_idx ON quiz_attempts(user_id, quiz_id);

-- Lab submissions table
CREATE TABLE IF NOT EXISTS lab_submissions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lab_id TEXT NOT NULL REFERENCES labs(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  is_submitted INTEGER NOT NULL DEFAULT 0,
  grade TEXT,
  feedback TEXT,
  graded_at INTEGER,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS lab_submissions_user_lab_idx ON lab_submissions(user_id, lab_id);

-- AI chat logs table
CREATE TABLE IF NOT EXISTS ai_chat_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mode TEXT NOT NULL,
  lesson_id TEXT REFERENCES lessons(id) ON DELETE SET NULL,
  lab_id TEXT REFERENCES labs(id) ON DELETE SET NULL,
  user_question TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  context_data TEXT,
  tokens_used INTEGER,
  latency_ms INTEGER,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS ai_chat_logs_user_idx ON ai_chat_logs(user_id);
CREATE INDEX IF NOT EXISTS ai_chat_logs_created_idx ON ai_chat_logs(created_at);
