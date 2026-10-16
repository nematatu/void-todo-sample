import { defineSeed } from "void/seed";

const INITIAL_TODOS = [
  {
    title: "Void SDKのファイルベースルーティング (pages/ & routes/) を試す",
    priority: "high" as const,
    completed: true,
  },
  {
    title: "Drizzle ORM + Cloudflare D1 (void/db) でEnd-to-Endの型安全性を確認する",
    priority: "high" as const,
    completed: false,
  },
  {
    title: "void/client の Typed Fetch で /api/todos を呼び出す",
    priority: "medium" as const,
    completed: false,
  },
  {
    title: "npx void deploy で Cloudflare Workers にワンコマンドデプロイする",
    priority: "low" as const,
    completed: false,
  },
];

export default defineSeed<typeof import("./schema")>(async ({ db, schema }) => {
  await db.insert(schema.todos).values(INITIAL_TODOS);
});
