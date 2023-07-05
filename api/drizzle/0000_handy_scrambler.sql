CREATE TABLE `auth_key` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`user_id` text(15) NOT NULL,
	`primary_key` integer NOT NULL,
	`hashed_password` text(255),
	`expires` blob
);
--> statement-breakpoint
CREATE TABLE `auth_session` (
	`id` text(128) PRIMARY KEY NOT NULL,
	`user_id` text(15) NOT NULL,
	`active_expires` blob NOT NULL,
	`idle_expires` blob NOT NULL
);
--> statement-breakpoint
CREATE TABLE `auth_user` (
	`id` text(15) PRIMARY KEY NOT NULL,
	`personnel_id` text(10) NOT NULL,
	`role` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user_info` (
	`id` text(10) PRIMARY KEY NOT NULL,
	`user_id` text(15) NOT NULL,
	`firstname` text(50) NOT NULL,
	`lastname` text(50) NOT NULL,
	`is_professor` integer DEFAULT false
);
--> statement-breakpoint
CREATE TABLE `course` (
	`name` text(50) NOT NULL,
	`unit` integer NOT NULL,
	PRIMARY KEY(`name`, `unit`)
);
--> statement-breakpoint
CREATE TABLE `professors_courses` (
	`name` text(50) NOT NULL,
	`unit` integer NOT NULL,
	`professor_id` text(10) NOT NULL,
	`class_id` text(10) NOT NULL,
	`first_day` text NOT NULL,
	`second_day` text,
	`start_date` integer NOT NULL,
	`duration` text(5) DEFAULT '02:00' NOT NULL,
	PRIMARY KEY(`class_id`, `first_day`, `name`, `professor_id`, `second_day`, `start_date`)
);
--> statement-breakpoint
CREATE TABLE `student_info` (
	`id` text(10) PRIMARY KEY NOT NULL,
	`firstname` text(50) NOT NULL,
	`lastname` text(50) NOT NULL,
	`personnel_id` text(10) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `student_classes` (
	`name` text(50) NOT NULL,
	`unit` integer NOT NULL,
	`student_id` text(10) NOT NULL,
	`professor_id` text(10) NOT NULL,
	`class_id` text(10) NOT NULL,
	`attendance` blob,
	PRIMARY KEY(`class_id`, `name`, `student_id`, `unit`)
);
