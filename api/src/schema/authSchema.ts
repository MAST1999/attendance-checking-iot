import { relations } from "drizzle-orm";
import { bigint, boolean, pgTable, varchar } from "drizzle-orm/pg-core";

export const user = pgTable("auth_user", {
  id: varchar("id", {
    // change this when using custom user ids
    length: 15,
  }).primaryKey(),
  // other user attributes
  personnelId: varchar("personnel_id", { length: 10 }).notNull(),
  role: varchar("role", { enum: ["admin", "user"] }),
});

export const userInfo = pgTable("user_info", {
  id: varchar("id", {
    // change this when using custom user ids
    length: 10,
  }).primaryKey(),
  userId: varchar("user_id", {
    // change this when using custom user ids
    length: 15,
  })
    .notNull()
    .references(() => user.id),
  firstname: varchar("firstname", { length: 50 }).notNull(),
  lastname: varchar("lastname", { length: 50 }).notNull(),
  isProfessor: boolean("is_professor").default(false),
});

export const userRelations = relations(user, ({ one }) => ({
  userInfo: one(userInfo, {
    fields: [user.id],
    references: [userInfo.userId],
  }),
}));

export const session = pgTable("auth_session", {
  id: varchar("id", {
    length: 128,
  }).primaryKey(),
  userId: varchar("user_id", {
    length: 15,
  })
    .notNull()
    .references(() => user.id),
  activeExpires: bigint("active_expires", {
    mode: "number",
  }).notNull(),
  idleExpires: bigint("idle_expires", {
    mode: "number",
  }).notNull(),
});

export const key = pgTable("auth_key", {
  id: varchar("id", {
    length: 255,
  }).primaryKey(),
  userId: varchar("user_id", {
    length: 15,
  })
    .notNull()
    .references(() => user.id),
  primaryKey: boolean("primary_key").notNull(),
  hashedPassword: varchar("hashed_password", {
    length: 255,
  }),
  expires: bigint("expires", {
    mode: "number",
  }),
});
