-- Migration: Add Chat History Tables

CREATE TABLE IF NOT EXISTS `chat_conversations` (
    `id` text PRIMARY KEY NOT NULL,
    `user_id` text NOT NULL REFERENCES `users`(`id`) ON DELETE CASCADE,
    `title` text NOT NULL,
    `mode` text DEFAULT 'tutor' NOT NULL,
    `created_at` integer DEFAULT (unixepoch()) NOT NULL,
    `updated_at` integer DEFAULT (unixepoch()) NOT NULL
);

CREATE INDEX IF NOT EXISTS `chat_conversations_user_idx` ON `chat_conversations` (`user_id`);
CREATE INDEX IF NOT EXISTS `chat_conversations_updated_at_idx` ON `chat_conversations` (`updated_at`);

CREATE TABLE IF NOT EXISTS `chat_messages` (
    `id` text PRIMARY KEY NOT NULL,
    `conversation_id` text NOT NULL REFERENCES `chat_conversations`(`id`) ON DELETE CASCADE,
    `role` text NOT NULL,
    `content` text NOT NULL,
    `created_at` integer DEFAULT (unixepoch()) NOT NULL
);

CREATE INDEX IF NOT EXISTS `chat_messages_conversation_id_idx` ON `chat_messages` (`conversation_id`);
CREATE INDEX IF NOT EXISTS `chat_messages_created_at_idx` ON `chat_messages` (`created_at`);
