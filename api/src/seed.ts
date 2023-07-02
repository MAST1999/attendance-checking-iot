import { drizzle } from "drizzle-orm/node-postgres";
import postgres from "pg";
import { pg } from "@lucia-auth/adapter-postgresql";
import { schema } from "./schema/schema";
import Lucia from "@elysiajs/lucia-auth";
import { migrate } from "drizzle-orm/postgres-js/migrator";

const connectionPool = new postgres.Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(connectionPool, { schema });

await migrate(db, { migrationsFolder: "drizzle" });

const lucia = Lucia({
  adapter: pg(connectionPool),
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

const superUser = await db.query.user.findFirst({
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
