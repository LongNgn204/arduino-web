CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`content` text NOT NULL,
	`difficulty` text DEFAULT 'medium' NOT NULL,
	`image_url` text,
	`simulator_url` text,
	`tags` text,
	`is_published` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `saved_items` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`item_type` text NOT NULL,
	`item_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `saved_items_user_item_idx` ON `saved_items` (`user_id`,`item_type`,`item_id`);--> statement-breakpoint
CREATE TABLE `topics` (
	`id` text PRIMARY KEY NOT NULL,
	`course_id` text NOT NULL,
	`order_index` integer NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`icon` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `labs` ADD `board_support` text DEFAULT 'both';--> statement-breakpoint
ALTER TABLE `lessons` ADD `board_support` text DEFAULT 'both';--> statement-breakpoint
ALTER TABLE `weeks` ADD `topic_id` text REFERENCES topics(id);