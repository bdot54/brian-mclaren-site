CREATE TABLE `newsletter_signups` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`first_name` text NOT NULL,
	`consent` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `newsletter_signups_email_unique` ON `newsletter_signups` (`email`);--> statement-breakpoint
CREATE TABLE `speaking_inquiries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`organization` text NOT NULL,
	`proposed_dates` text NOT NULL,
	`audience` text NOT NULL,
	`format` text NOT NULL,
	`topics` text DEFAULT '' NOT NULL,
	`message` text DEFAULT '' NOT NULL,
	`consent` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL
);
