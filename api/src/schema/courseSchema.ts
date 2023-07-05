import { relations } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  primaryKey,
} from "drizzle-orm/sqlite-core";
import { userInfo } from "./authSchema";
import { studentToClasses } from "./studentSchema";

export const daysOfWeek = [
  "saturday",
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
] as const;

export const course = sqliteTable(
  "course",
  {
    name: text("name", { length: 50 }).notNull(),
    unit: integer("unit").notNull(),
  },
  (t) => ({ pk: primaryKey(t.name, t.unit) })
);

export const professorToCourse = sqliteTable(
  "professors_courses",
  {
    courseName: text("name", { length: 50 }).notNull(),
    courseUnit: integer("unit").notNull(),
    professorId: text("professor_id", {
      // change this when using custom user ids
      length: 10,
    }).notNull(),
    class: text("class_id", { length: 10 }).notNull(),
    firstDay: text("first_day", {
      enum: daysOfWeek,
    }).notNull(),
    secondDay: text("second_day", {
      enum: daysOfWeek,
    }),
    startDate: integer("start_date", { mode: "timestamp" }).notNull(),
    duration: text("duration", { length: 5 })
      .$type<`${number}:${number}`>()
      .default("02:00")
      .notNull(),
  },
  (t) => ({
    pk: primaryKey(
      t.courseName,
      t.professorId,
      t.class,
      t.firstDay,
      t.secondDay,
      t.startDate
    ),
  })
);

export const courseRelations = relations(course, (opt) => ({
  courseToProfessor: opt.many(professorToCourse),
}));

export const professorToCourseRelations = relations(
  professorToCourse,
  ({ one, many }) => ({
    professor: one(userInfo, {
      fields: [professorToCourse.professorId],
      references: [userInfo.id],
    }),
    course: one(course, {
      fields: [professorToCourse.courseName, professorToCourse.courseUnit],
      references: [course.name, course.unit],
    }),
    studentToClasses: many(studentToClasses),
  })
);
