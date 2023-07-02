import { relations } from "drizzle-orm";
import { professorToCourse } from "./courseSchema";
import { userInfo } from "./authSchema";

export const professorRelations = relations(userInfo, ({ many }) => ({
  courseToProfessor: many(professorToCourse),
}));
