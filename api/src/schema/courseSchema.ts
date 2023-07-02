import { relations } from "drizzle-orm";
import {
  integer,
  interval,
  pgTable,
  primaryKey,
  time,
  varchar,
} from "drizzle-orm/pg-core";
import { userInfo } from "./authSchema";

export const course = pgTable("course", {
  id: varchar("id", {
    // change this when using custom user ids
    length: 10,
  }).primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  unit: integer("unit").notNull(),
});

export const professorToCourse = pgTable(
  "professors_courses",
  {
    courseId: varchar("course_id", {
      // change this when using custom user ids
      length: 10,
    })
      .notNull()
      .references(() => course.id),
    professorId: varchar("group_id", {
      // change this when using custom user ids
      length: 10,
    })
      .notNull()
      .references(() => userInfo.id),
    sessionLength: interval("session_length").array(),
    date: time("course_date").array(),
    class: varchar("class_id", { length: 10 }),
  },
  (t) => ({
    pk: primaryKey(t.courseId, t.professorId, t.date, t.class, t.sessionLength),
  })
);

export const courseRelations = relations(course, (opt) => ({
  courseToProfessor: opt.many(professorToCourse),
}));

export const professorToCourseRelations = relations(
  professorToCourse,
  ({ one }) => ({
    professor: one(userInfo, {
      fields: [professorToCourse.professorId],
      references: [userInfo.id],
    }),
    course: one(course, {
      fields: [professorToCourse.courseId],
      references: [course.id],
    }),
  })
);
