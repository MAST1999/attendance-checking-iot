import { relations } from "drizzle-orm";
import { sqliteTable, text, integer, blob } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("auth_user", {
  id: text("id", {
    // change this when using custom user ids
    length: 15,
  }).primaryKey(),
  // other user attributes
  personnelId: text("personnel_id", { length: 10 }).notNull(),
  role: text("role", { enum: ["admin", "user"] }).notNull(),
});

export const userInfo = sqliteTable("user_info", {
  id: text("id", {
    // change this when using custom user ids
    length: 10,
  }).primaryKey(),
  userId: text("user_id", {
    // change this when using custom user ids
    length: 15,
  }).notNull(),
  firstname: text("firstname", { length: 50 }).notNull(),
  lastname: text("lastname", { length: 50 }).notNull(),
  isProfessor: integer("is_professor", { mode: "boolean" }).default(false),
});

export const userRelations = relations(user, ({ one }) => ({
  userInfo: one(userInfo, {
    fields: [user.id],
    references: [userInfo.userId],
  }),
}));

export const session = sqliteTable("auth_session", {
  id: text("id", {
    length: 128,
  }).primaryKey(),
  userId: text("user_id", {
    length: 15,
  }).notNull(),
  activeExpires: blob("active_expires", {
    mode: "bigint",
  }).notNull(),
  idleExpires: blob("idle_expires", {
    mode: "bigint",
  }).notNull(),
});

export const key = sqliteTable("auth_key", {
  id: text("id", {
    length: 255,
  }).primaryKey(),
  userId: text("user_id", {
    length: 15,
  }).notNull(),
  primaryKey: integer("primary_key", { mode: "boolean" }).notNull(),
  hashedPassword: text("hashed_password", {
    length: 255,
  }),
  expires: blob("expires", {
    mode: "bigint",
  }),
});
