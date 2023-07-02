import { pgTable, varchar } from "drizzle-orm/pg-core";

export const student = pgTable("student_info", {
  id: varchar("id", {
    // change this when using custom user ids
    length: 10,
  }).primaryKey(),
  firstname: varchar("firstname", { length: 50 }).notNull(),
  lastname: varchar("lastname", { length: 50 }).notNull(),
  personnelId: varchar("personnel_id", { length: 10 }).notNull(),
});
