import { sql } from "void/db";
import { createInsertSchema, createUpdateSchema } from "void/drizzle-zod";
import { integer, sqliteTable, text } from "void/schema-d1";

export const todos = sqliteTable("todos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  priority: text("priority", { enum: ["low", "medium", "high"] })
    .notNull()
    .default("medium"),
  completed: integer("completed", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

export const insertTodoSchema = createInsertSchema(todos, {
  title: (schema) => schema.trim().min(1, "タイトルを入力してください").max(200),
}).pick({
  title: true,
  priority: true,
});

export const updateTodoSchema = createUpdateSchema(todos, {
  title: (schema) => schema.trim().min(1, "タイトルを入力してください").max(200),
}).pick({
  title: true,
  priority: true,
  completed: true,
});
