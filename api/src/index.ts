import auth, { db } from "./auth";
import { Elysia } from "elysia";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import pretty from "pino-pretty";
import cors from "@elysiajs/cors";

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
  .use(cors())
  .state("db", db)
  .use(auth)
  .get("/", () => `Hello Elysia`)
  .listen(3000);

export type Server = typeof app;

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
