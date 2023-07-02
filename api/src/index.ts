import auth, { db } from "./auth";
import { Elysia } from "elysia";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { logger } from "@bogeychan/elysia-logger";
import pretty from "pino-pretty";
import { userInfo } from "./schema/authSchema";

await migrate(db, { migrationsFolder: "drizzle" });

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
    return await db.select().from(userInfo);
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
