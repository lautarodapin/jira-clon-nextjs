CREATE TABLE `drizzle_kanban_columns` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`order` integer DEFAULT 0 NOT NULL
);

CREATE TABLE `drizzle_kanban_tickets` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	`column_id` integer,
	FOREIGN KEY (`column_id`) REFERENCES `drizzle_kanban_columns`(`id`)
);
