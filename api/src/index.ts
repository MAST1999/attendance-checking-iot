import auth, { db } from "./auth";
import { Elysia } from "elysia";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import pretty from "pino-pretty";
import cors from "@elysiajs/cors";
import { staticPlugin } from "@elysiajs/static";

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
  .use(cors({ origin: true }))
  .use(staticPlugin({ prefix: "" }))
  .state("db", db)
  .use(auth)
  .get("/", () => Bun.file("public/index.html"))
  .listen(3000);

export type Server = typeof app;

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
