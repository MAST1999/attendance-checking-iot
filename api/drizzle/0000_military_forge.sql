CREATE TABLE IF NOT EXISTS "auth_key" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(15) NOT NULL,
	"primary_key" boolean NOT NULL,
	"hashed_password" varchar(255),
	"expires" bigint
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth_session" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"user_id" varchar(15) NOT NULL,
	"active_expires" bigint NOT NULL,
	"idle_expires" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth_user" (
	"id" varchar(15) PRIMARY KEY NOT NULL,
	"personnel_id" varchar(10) NOT NULL,
	"role" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_info" (
	"id" varchar(10) PRIMARY KEY NOT NULL,
	"user_id" varchar(15) NOT NULL,
	"firstname" varchar(50) NOT NULL,
	"lastname" varchar(50) NOT NULL,
	"is_professor" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "course" (
	"id" varchar(10) PRIMARY KEY NOT NULL,
	"name" varchar(50),
	"unit" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "professors_courses" (
	"course_id" varchar(10) NOT NULL,
	"group_id" varchar(10) NOT NULL,
	"session_length" interval[],
	"course_date" time[],
	"class_id" varchar(10)
);
--> statement-breakpoint
ALTER TABLE "professors_courses" ADD CONSTRAINT "professors_courses_course_id_group_id_course_date_class_id_session_length" PRIMARY KEY("course_id","group_id","course_date","class_id","session_length");
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "student_info" (
	"id" varchar(10) PRIMARY KEY NOT NULL,
	"firstname" varchar(50) NOT NULL,
	"lastname" varchar(50) NOT NULL,
	"personnel_id" varchar(10) NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth_key" ADD CONSTRAINT "auth_key_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth_session" ADD CONSTRAINT "auth_session_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_info" ADD CONSTRAINT "user_info_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "professors_courses" ADD CONSTRAINT "professors_courses_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "professors_courses" ADD CONSTRAINT "professors_courses_group_id_user_info_id_fk" FOREIGN KEY ("group_id") REFERENCES "user_info"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
