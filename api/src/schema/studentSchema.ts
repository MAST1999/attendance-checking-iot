import { relations } from "drizzle-orm";
import {
  blob,
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { professorToCourse } from "./courseSchema";

export const student = sqliteTable("student_info", {
  id: text("id", {
    length: 10,
  }).primaryKey(),
  firstname: text("firstname", { length: 50 }).notNull(),
  lastname: text("lastname", { length: 50 }).notNull(),
  studentId: text("personnel_id", { length: 10 }).notNull(),
});

export const studentToClasses = sqliteTable(
  "student_classes",
  {
    courseName: text("name", { length: 50 }).notNull(),
    courseUnit: integer("unit").notNull(),
    studentId: text("student_id", { length: 10 }).notNull(),
    professorId: text("professor_id", { length: 10 }).notNull(),
    class: text("class_id", { length: 10 }).notNull(),
    attendance: blob("attendance", { mode: "json" }).$type<Date[]>(),
  },
  (t) => ({ pk: primaryKey(t.class, t.courseName, t.courseUnit, t.studentId) })
);

export const studentRelations = relations(student, (opt) => ({
  studentToClasses: opt.many(studentToClasses),
}));

export const studentToClassesRelations = relations(
  studentToClasses,
  ({ one }) => ({
    student: one(student, {
      fields: [studentToClasses.studentId],
      references: [student.id],
    }),
    class: one(professorToCourse, {
      fields: [
        studentToClasses.courseName,
        studentToClasses.courseUnit,
        studentToClasses.professorId,
        studentToClasses.class,
      ],
      references: [
        professorToCourse.courseName,
        professorToCourse.courseUnit,
        professorToCourse.professorId,
        professorToCourse.class,
      ],
    }),
  })
);
