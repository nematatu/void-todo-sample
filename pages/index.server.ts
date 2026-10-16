import { insertTodoSchema, todos } from "@schema";
import { defineHandler, type InferProps } from "void";
import { asc, db, desc, eq } from "void/db";
import { z } from "zod";

export type Props = InferProps<typeof loader>;

export const loader = defineHandler(async () => {
  const items = await db
    .select()
    .from(todos)
    .orderBy(asc(todos.completed), desc(todos.id));

  const completedCount = items.filter((item) => item.completed).length;

  return {
    todos: items,
    stats: {
      total: items.length,
      active: items.length - completedCount,
      completed: completedCount,
    },
  };
});

export const actions = {
  // Named action (?create): Create a new Todo
  create: defineHandler.withValidator({
    body: insertTodoSchema,
  })(async (_c, { body }) => {
    await db.insert(todos).values({
      title: body.title,
      priority: body.priority ?? "medium",
    });
  }),

  // Named action (?toggle): Toggle completion state
  toggle: defineHandler.withValidator({
    body: z.object({
      id: z.number(),
      completed: z.boolean(),
    }),
  })(async (_c, { body }) => {
    await db
      .update(todos)
      .set({ completed: body.completed })
      .where(eq(todos.id, body.id));
  }),

  // Named action (?delete): Delete a single Todo
  delete: defineHandler.withValidator({
    body: z.object({
      id: z.number(),
    }),
  })(async (_c, { body }) => {
    await db.delete(todos).where(eq(todos.id, body.id));
  }),

  // Named action (?clearCompleted): Delete all completed Todos
  clearCompleted: defineHandler(async () => {
    await db.delete(todos).where(eq(todos.completed, true));
  }),
};
