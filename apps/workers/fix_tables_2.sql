CREATE TABLE `ai_chat_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`mode` text NOT NULL,
	`lesson_id` text,
	`lab_id` text,
	`user_question` text NOT NULL,
	`ai_response` text NOT NULL,
	`context_data` text,
	`tokens_used` integer,
	`latency_ms` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`lesson_id`) REFERENCES `lessons`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`lab_id`) REFERENCES `labs`(`id`) ON UPDATE no action ON DELETE set null
);
CREATE INDEX `ai_chat_logs_user_idx` ON `ai_chat_logs` (`user_id`);
CREATE INDEX `ai_chat_logs_created_idx` ON `ai_chat_logs` (`created_at`);

CREATE TABLE `exam_drills` (
	`id` text PRIMARY KEY NOT NULL,
	`week_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`content` text NOT NULL,
	`sample_solution` text,
	`simulator_url` text,
	`difficulty` text DEFAULT 'medium' NOT NULL,
	`passing_score` integer DEFAULT 60 NOT NULL,
	`time_limit` integer DEFAULT 60 NOT NULL,
	`is_published` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`week_id`) REFERENCES `weeks`(`id`) ON UPDATE no action ON DELETE cascade
);

CREATE TABLE `quiz_attempts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`quiz_id` text NOT NULL,
	`answers` text NOT NULL,
	`score` integer NOT NULL,
	`max_score` integer NOT NULL,
	`passed` integer NOT NULL,
	`started_at` integer NOT NULL,
	`submitted_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`quiz_id`) REFERENCES `quizzes`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `quiz_attempts_user_quiz_idx` ON `quiz_attempts` (`user_id`,`quiz_id`);
