CREATE TABLE `drill_submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`drill_id` text NOT NULL,
	`code` text NOT NULL,
	`score` integer NOT NULL,
	`passed` integer NOT NULL,
	`feedback` text,
	`submitted_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`drill_id`) REFERENCES `exam_drills`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `drill_submissions_user_drill_idx` ON `drill_submissions` (`user_id`,`drill_id`);