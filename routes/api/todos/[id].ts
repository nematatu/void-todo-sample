import { todos, updateTodoSchema } from "@schema";
import { defineHandler } from "void";
import { db, eq } from "void/db";

// PATCH /api/todos/:id — Update todo title, priority, or completion status
export const PATCH = defineHandler.withValidator({
  body: updateTodoSchema,
})(async (c, { body }) => {
  const id = Number(c.req.param("id"));
  const [updated] = await db
    .update(todos)
    .set(body)
    .where(eq(todos.id, id))
    .returning();

  if (!updated) {
    return c.json({ error: "Todo not found" }, 404);
  }
  return updated;
});

// DELETE /api/todos/:id — Delete a todo by ID
export const DELETE = defineHandler(async (c) => {
  const id = Number(c.req.param("id"));
  const [deleted] = await db
    .delete(todos)
    .where(eq(todos.id, id))
    .returning();

  if (!deleted) {
    return c.json({ error: "Todo not found" }, 404);
  }
  return { deleted: true, id: deleted.id };
});
