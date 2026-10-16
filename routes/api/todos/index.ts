import { insertTodoSchema, todos } from "@schema";
import { defineHandler } from "void";
import { asc, db, desc } from "void/db";

// GET /api/todos — List all todos ordered by completion and newest first
export const GET = defineHandler(async () => {
  const items = await db
    .select()
    .from(todos)
    .orderBy(asc(todos.completed), desc(todos.id));

  return {
    todos: items,
    meta: {
      total: items.length,
      completed: items.filter((item) => item.completed).length,
      active: items.filter((item) => !item.completed).length,
    },
  };
});

// POST /api/todos — Create a new todo with schema-derived validation
export const POST = defineHandler.withValidator({
  body: insertTodoSchema,
})(async (_c, { body }) => {
  const [created] = await db.insert(todos).values(body).returning();
  return created;
});
