import auth, { db } from "./auth";
import { Elysia } from "elysia";
import { logger } from "@bogeychan/elysia-logger";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import pretty from "pino-pretty";
import { userInfo } from "./schema/authSchema";

migrate(db, { migrationsFolder: "drizzle" });

/**
 * `transport` doesn't work in bun atm
 *
 * you can get a nice console output as the following coding shows:
 */
export const stream = pretty({
  colorize: true,
});

const app = new Elysia()
  .use(logger({ stream }))
  .state("db", db)
  .use(auth)
  .get("/", () => `Hello Elysia`)
  .get("/prof", async ({ store: { db } }) => {
    return db.select().from(userInfo);
  })
  .listen(3000);

export type Server = typeof app;

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
