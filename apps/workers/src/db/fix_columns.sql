ALTER TABLE `weeks` ADD `topic_id` text REFERENCES topics(id);
ALTER TABLE `labs` ADD `board_support` text DEFAULT 'both';
ALTER TABLE `lessons` ADD `board_support` text DEFAULT 'both';
