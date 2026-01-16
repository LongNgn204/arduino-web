CREATE TABLE `lab_submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`lab_id` text NOT NULL,
	`code` text NOT NULL,
	`is_submitted` integer DEFAULT false NOT NULL,
	`grade` text,
	`feedback` text,
	`graded_at` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`lab_id`) REFERENCES `labs`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `lab_submissions_user_lab_idx` ON `lab_submissions` (`user_id`,`lab_id`);
