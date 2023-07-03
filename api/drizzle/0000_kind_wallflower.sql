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
	`role` text
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
	`id` text(10) PRIMARY KEY NOT NULL,
	`name` text(50) NOT NULL,
	`unit` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `professors_courses` (
	`course_id` text(10) NOT NULL,
	`group_id` text(10) NOT NULL,
	`class_id` text(10) NOT NULL,
	`first_session` integer NOT NULL,
	`second_session` integer,
	PRIMARY KEY(`class_id`, `course_id`, `first_session`, `group_id`, `second_session`)
);
--> statement-breakpoint
CREATE TABLE `student_info` (
	`id` text(10) PRIMARY KEY NOT NULL,
	`firstname` text(50) NOT NULL,
	`lastname` text(50) NOT NULL,
	`personnel_id` text(10) NOT NULL
);
