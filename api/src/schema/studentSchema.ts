import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const student = sqliteTable("student_info", {
  id: text("id", {
    // change this when using custom user ids
    length: 10,
  }).primaryKey(),
  firstname: text("firstname", { length: 50 }).notNull(),
  lastname: text("lastname", { length: 50 }).notNull(),
  studentId: text("personnel_id", { length: 10 }).notNull(),
});
