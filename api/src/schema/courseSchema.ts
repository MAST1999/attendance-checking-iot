import { relations } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  real,
  primaryKey,
} from "drizzle-orm/sqlite-core";
import { userInfo } from "./authSchema";

export const course = sqliteTable("course", {
  id: text("id", {
    // change this when using custom user ids
    length: 10,
  }).primaryKey(),
  name: text("name", { length: 50 }).notNull(),
  unit: integer("unit").notNull(),
});

export const professorToCourse = sqliteTable(
  "professors_courses",
  {
    courseId: text("course_id", {
      // change this when using custom user ids
      length: 10,
    }).notNull(),
    professorId: text("group_id", {
      // change this when using custom user ids
      length: 10,
    }).notNull(),
    duration: real("course_duration"),
    date: integer("course_date", { mode: "timestamp" }),
    startTime: integer("course_start_time", { mode: "timestamp" }),
    class: text("class_id", { length: 10 }),
  },
  (t) => ({
    pk: primaryKey(
      t.courseId,
      t.professorId,
      t.duration,
      t.class,
      t.date,
      t.startTime
    ),
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
