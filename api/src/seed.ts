import { schema } from "./schema/schema";
import Lucia from "@elysiajs/lucia-auth";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { betterSqlite3 } from "@lucia-auth/adapter-sqlite";

const sqlite = new Database(process.env.DATABASE_URL);

const db = drizzle(sqlite, { schema });

migrate(db, { migrationsFolder: "drizzle" });

const lucia = Lucia({
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

const superUser = db.query.user.findFirst({
  where(fields, operators) {
    return operators.eq(fields.role, "admin");
  },
});

if (superUser) {
  console.log("Super User Exists");
  process.exit(0);
}

await lucia.createUser({
  primaryKey: {
    password: "randomPassword",
    providerId: "personnel_id",
    providerUserId: "adminuser1",
  },
  attributes: { personnel_id: "adminuser1", role: "admin" },
});

console.log("Created Super User");
process.exit(0);
