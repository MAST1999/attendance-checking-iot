import * as authSchema from "./authSchema";
import * as studentSchema from "./studentSchema";
import * as professorSchema from "./professorSchema";
import * as courseSchema from "./courseSchema";

export const schema = {
  ...authSchema,
  ...studentSchema,
  ...professorSchema,
  ...courseSchema,
};
