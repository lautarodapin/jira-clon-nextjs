CREATE TABLE `kanbanColumns` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`order` integer
);

CREATE TABLE `kanbanTickets` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`order` integer,
	`columnId` integer,
	FOREIGN KEY (`columnId`) REFERENCES `kanbanColumns`(`id`)
);
