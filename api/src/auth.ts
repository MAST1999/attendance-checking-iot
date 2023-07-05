import { Elysia, t } from "elysia";
import { cookie } from "@elysiajs/cookie";

import { Lucia } from "@elysiajs/lucia-auth";
import { betterSqlite3 } from "@lucia-auth/adapter-sqlite";

import { init } from "@paralleldrive/cuid2";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { user, userInfo } from "./schema/authSchema";
import { schema } from "./schema/schema";
import { logger } from "@bogeychan/elysia-logger";
import { stream } from ".";
import { course, daysOfWeek, professorToCourse } from "./schema/courseSchema";
import { eq, ne } from "drizzle-orm";
import { Database } from "bun:sqlite";
import { student } from "./schema/studentSchema";

const sqlite = new Database(process.env.DATABASE_URL);
const createId = init({ length: 10 });

export const db = drizzle(sqlite, { schema });
const DaysOfWeek = t.Union(daysOfWeek.map((d) => t.Literal(d)));

const lucia = Lucia({
  // @ts-ignore
  adapter: betterSqlite3(sqlite),
  transformDatabaseUser: (databaseUser) => {
    return {
      userId: databaseUser.id,
      personnelId: databaseUser.personnel_id,
    };
  },
  sessionExpiresIn: {
    activePeriod: 1000 * 60 * 60 * 24,
    idlePeriod: 1000 * 60 * 60 * 4,
  },
});

const authSchema = t.Object({
  personnelId: t.String({ maxLength: 10, minLength: 10 }),
  password: t.String({
    minLength: 8,
  }),
});

export const auth = (app: Elysia) =>
  app.group("/auth", (app) =>
    app
      .use(logger({ stream }))
      .use(cookie())
      .model("auth", authSchema)
      .put(
        "/sign-up",
        async ({
          body: { personnelId, password, isProfessor, firstname, lastname },
          log,
        }) => {
          const user = (await lucia.createUser({
            primaryKey: {
              providerId: "personnel_id",
              providerUserId: personnelId,
              password,
            },
            attributes: {
              personnel_id: personnelId,
              role: "user",
            },
          })) as { userId: string; personnelId: string };

          db.insert(userInfo)
            .values({
              isProfessor,
              id: createId(),
              firstname,
              lastname,
              userId: user.userId,
            })
            .run();

          log.info(user, "Created New User");
          return user;
        },
        {
          body: t.Intersect([
            authSchema,
            t.Object({
              isProfessor: t.Boolean(),
              firstname: t.String(),
              lastname: t.String(),
            }),
          ]),
          error(err) {
            if (err.error.message === "AUTH_DUPLICATE_KEY_ID") {
              err.set.status = 409;
              return { message: "User Already Exists" };
            }
            return err.error.message;
          },
          beforeHandle: lucia.sessionGuard,
        }
      )
      .post(
        "/sign-in",
        async ({ log, set, setCookie, body: { personnelId, password } }) => {
          try {
            const { userId } = await lucia.useKey(
              "personnel_id",
              personnelId,
              password
            );

            const { sessionId } = await lucia.createSession(userId);
            setCookie("session", sessionId);

            const userInformation = db
              .select({
                personnelId: user.personnelId,
                role: user.role,
                firstname: userInfo.firstname,
                lastname: userInfo.lastname,
                isProfessor: userInfo.isProfessor,
              })
              .from(user)
              .where(eq(user.id, userId))
              .leftJoin(userInfo, eq(user.id, userInfo.userId))
              .limit(1)
              .all()[0];
            // const userInformation = db.query.user.findFirst({
            //   where: eq(user.id, userId),
            //   columns: { personnelId: true, role: true },
            //   with: {
            //     userInfo: {
            //       columns: {
            //         firstname: true,
            //         isProfessor: true,
            //         lastname: true,
            //       },
            //     },
            //   },
            // });

            log.info(userInformation, "User logged in");
            return userInformation;
          } catch (e) {
            log.error(e, "Sign in failed");
            set.status = 401;

            return "Invalid username or password";
          }
        },
        {
          body: "auth",
        }
      )
      .get(
        "/profile",
        async ({ cookie: { session } }) => {
          const { userId: id } = await lucia.getSession(session);
          const userInfo = db.query.user.findFirst({
            where(fields, operators) {
              return operators.eq(fields.id, id);
            },
            with: { userInfo: true },
          });
          return userInfo;
        },
        {
          beforeHandle: lucia.sessionGuard,
        }
      )
      .get(
        "/refresh",
        async ({ cookie: { session }, setCookie }) => {
          const { userId: id } = await lucia.renewSession(session);

          setCookie("session", id);

          return session;
        },
        {
          beforeHandle: lucia.sessionGuard,
        }
      )
      .get(
        "/sign-out",
        async ({ cookie: { session }, removeCookie }) => {
          await lucia.invalidateSession(session);

          removeCookie("session");

          return session;
        },
        {
          beforeHandle: lucia.sessionGuard,
        }
      )
      .delete(
        "/user",
        async ({ cookie: { session }, set }) => {
          const { userId: id } = await lucia.getSession(session);

          const user = db.query.user.findFirst({
            where(fields, operators) {
              return operators.eq(fields.id, id);
            },
          });

          if (user && user.personnelId === "adminuser1") {
            set.status = 406;
            return { message: "Access Denied" };
          }

          await lucia.deleteDeadUserSessions(session);
          await lucia.deleteUser(id);

          return id;
        },
        {
          beforeHandle: lucia.sessionGuard,
        }
      )
      .post(
        "/course",
        async ({ body, log }) => {
          const createdCourse = db
            .insert(course)
            .values({ ...body })
            .returning()
            .all()[0];

          log.info(createdCourse, "Added new course");

          return createdCourse;
        },
        {
          body: t.Object({
            name: t.String({ maxLength: 50 }),
            unit: t.Number({ maximum: 4, minimum: 1 }),
          }),
        }
      )
      .get("/course", () => {
        return db.query.course.findMany();
      })
      .post(
        "/new-class",
        ({ body, log, set }) => {
          const newBody = {
            ...body,
            startDate: new Date(body.startDate),
            duration: body.duration as `${number}:${number}`,
          };
          if (newBody.startDate.toString() === "Invalid Date") {
            set.status = 400;
            return { message: "Invalid start date" };
          }

          const newClass = db
            .insert(professorToCourse)
            .values({ ...newBody })
            .returning()
            .all()[0];

          log.info(newClass, "New Class registered");
          return newClass;
        },
        {
          body: t.Object({
            class: t.String({ maxLength: 10 }),
            professorId: t.String({ minLength: 10 }),
            courseName: t.String({ minLength: 3 }),
            courseUnit: t.Number({ minimum: 1, maximum: 4 }),
            firstDay: DaysOfWeek,
            secondDay: t.Optional(DaysOfWeek),
            startDate: t.String(),
            duration: t.TemplateLiteral([
              t.RegEx(/^([0-2][0-9])$/),
              t.Literal(":"),
              t.RegEx(/^([0-9]{2})$/),
            ]),
          }),
        }
      )
      .get("/classes", () => {
        return db.query.professorToCourse.findMany();
      })
      .patch(
        "/class",
        ({ body, log, set }) => {
          const startDate = body.startDate
            ? new Date(body.startDate)
            : undefined;
          const duration = body.duration as `${number}:${number}`;

          if (
            startDate !== undefined &&
            startDate.toString() === "Invalid Date"
          ) {
            set.status = 400;
            return { message: "Start Date is invalid" };
          }

          const updatedClass = db
            .update(professorToCourse)
            .set({ ...body, startDate, duration })
            .returning()
            .all()[0];
          log.info(updatedClass, "Updated Class");
          return updatedClass;
        },
        {
          body: t.Object({
            class: t.Optional(t.String({ maxLength: 10 })),
            professorId: t.Optional(t.String({ minLength: 10 })),
            courseId: t.Optional(t.String({ minLength: 10 })),
            firstDay: DaysOfWeek,
            startDate: t.Optional(t.String()),
            secondDay: t.Optional(DaysOfWeek),
            duration: t.Optional(
              t.TemplateLiteral([
                t.RegEx(/^([0-2][0-9])$/),
                t.Literal(":"),
                t.RegEx(/^([0-9]{2})$/),
              ])
            ),
          }),
        }
      )
      .get("/student/:studentId/classes", ({ params: { studentId } }) => {
        return db.query.student.findFirst({
          where: eq(student.studentId, studentId),
          with: { studentToClasses: { with: { class: true } } },
        });
      })
      .post(
        "/student",
        ({ body, log }) => {
          const st = db
            .insert(student)
            .values({ ...body, id: createId() })
            .returning()
            .all()[0];

          log.info(st, "Added new student");
          return st;
        },
        {
          body: t.Object({
            firstname: t.String({ maxLength: 50, minLength: 2 }),
            lastname: t.String({ maxLength: 50, minLength: 2 }),
            studentId: t.String({
              minLength: 10,
              maxLength: 10,
              pattern: `\[0-9]{10}$`,
            }),
          }),
        }
      )
      .get("/all-users", () => {
        return db.query.user.findMany({
          where: ne(user.id, "adminuser1"),
          with: { userInfo: true },
        });
      })
  );

export default auth;
