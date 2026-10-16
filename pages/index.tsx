import { Form, action, useForm } from "@void/react";
import { useEffect, useState } from "react";
import { fetch } from "void/client";
import type { Props } from "./index.server";

type FilterType = "all" | "active" | "completed";
type PriorityType = "low" | "medium" | "high";

const PRIORITY_STYLES: Record<
  PriorityType,
  { label: string; bg: string; text: string; border: string }
> = {
  high: {
    label: "High",
    bg: "rgba(239, 68, 68, 0.14)",
    text: "#fca5a5",
    border: "rgba(239, 68, 68, 0.35)",
  },
  medium: {
    label: "Medium",
    bg: "rgba(245, 158, 11, 0.14)",
    text: "#fcd34d",
    border: "rgba(245, 158, 11, 0.35)",
  },
  low: {
    label: "Low",
    bg: "rgba(59, 130, 246, 0.14)",
    text: "#93c5fd",
    border: "rgba(59, 130, 246, 0.35)",
  },
};

export default function TodoPage({ todos, stats }: Props) {
  const [filter, setFilter] = useState<FilterType>("all");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [apiPreview, setApiPreview] = useState<string | null>(null);
  const [apiLoading, setApiLoading] = useState(false);

  const form = useForm("/?create", {
    title: "",
    priority: "medium",
  });

  useEffect(() => {
    if (form.wasSuccessful) {
      form.reset("title");
    }
  }, [form.wasSuccessful]);

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  async function handleToggle(id: number, currentCompleted: boolean) {
    setBusyId(id);
    try {
      await action("/?toggle", {
        data: { id, completed: !currentCompleted },
      });
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id: number) {
    setBusyId(id);
    try {
      await action("/?delete", {
        data: { id },
      });
    } finally {
      setBusyId(null);
    }
  }

  async function handleClearCompleted() {
    await action("/?clearCompleted");
  }

  async function handleInspectApi() {
    setApiLoading(true);
    try {
      // Demonstrates Void's end-to-end typed fetch client (`void/client`)
      const data = await fetch("/api/todos");
      setApiPreview(JSON.stringify(data, null, 2));
    } finally {
      setApiLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #1e1b4b 0%, #09090b 55%, #050507 100%)",
        color: "#f4f4f5",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        padding: "48px 20px",
      }}
    >
      <main style={{ maxWidth: "680px", margin: "0 auto" }}>
        {/* Header */}
        <header style={{ marginBottom: "32px", textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              borderRadius: "9999px",
              background: "rgba(139, 92, 246, 0.15)",
              border: "1px solid rgba(139, 92, 246, 0.35)",
              color: "#c4b5fd",
              fontSize: "13px",
              fontWeight: 600,
              marginBottom: "16px",
            }}
          >
            <span>⚡ Powered by Void (Vite + Cloudflare Workers + D1)</span>
          </div>
          <h1
            style={{
              fontSize: "36px",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              margin: "0 0 8px",
              background: "linear-gradient(135deg, #ffffff 0%, #a78bfa 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Void Full-Stack Todo
          </h1>
          <p style={{ color: "#a1a1aa", fontSize: "15px", margin: 0 }}>
            End-to-End Type Safety from Drizzle D1 Schema → Server Loader &
            Actions → React UI
          </p>
        </header>

        {/* Stats Cards */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          {[
            { label: "Total Tasks", value: stats.total, color: "#e4e4e7" },
            { label: "Active", value: stats.active, color: "#a78bfa" },
            { label: "Completed", value: stats.completed, color: "#34d399" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: "rgba(24, 24, 27, 0.75)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "14px",
                padding: "16px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "26px",
                  fontWeight: 700,
                  color: stat.color,
                  lineHeight: 1.1,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#71717a",
                  marginTop: "4px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </section>

        {/* Add Todo Form (Void `<Form>` + `useForm`) */}
        <section
          style={{
            background: "rgba(24, 24, 27, 0.85)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            padding: "20px",
            marginBottom: "24px",
            boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
          }}
        >
          <Form form={form}>
            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              <input
                type="text"
                name="title"
                placeholder="新しいタスクを入力..."
                value={form.data.title}
                onChange={(e) => form.setData("title", e.target.value)}
                style={{
                  flex: "1 1 260px",
                  padding: "12px 14px",
                  borderRadius: "10px",
                  border: "1px solid rgba(255, 255, 255, 0.14)",
                  background: "rgba(9, 9, 11, 0.8)",
                  color: "#f4f4f5",
                  fontSize: "15px",
                  outline: "none",
                }}
              />
              <select
                name="priority"
                value={form.data.priority ?? "medium"}
                onChange={(e) =>
                  form.setData("priority", e.target.value as PriorityType)
                }
                style={{
                  padding: "12px 14px",
                  borderRadius: "10px",
                  border: "1px solid rgba(255, 255, 255, 0.14)",
                  background: "rgba(9, 9, 11, 0.8)",
                  color: "#e4e4e7",
                  fontSize: "14px",
                }}
              >
                <option value="high">🔥 High</option>
                <option value="medium">⚡ Medium</option>
                <option value="low">🌱 Low</option>
              </select>
              <button
                type="submit"
                disabled={form.pending}
                style={{
                  padding: "12px 22px",
                  borderRadius: "10px",
                  border: "none",
                  background: form.pending
                    ? "#4c1d95"
                    : "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
                  color: "#ffffff",
                  fontWeight: 600,
                  fontSize: "15px",
                  cursor: form.pending ? "not-allowed" : "pointer",
                }}
              >
                {form.pending ? "追加中..." : "追加"}
              </button>
            </div>
            {form.errors.title && (
              <p
                style={{
                  color: "#f87171",
                  fontSize: "13px",
                  margin: "8px 0 0",
                }}
              >
                {form.errors.title}
              </p>
            )}
          </Form>
        </section>

        {/* Filter Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "14px",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <div style={{ display: "flex", gap: "6px" }}>
            {(["all", "active", "completed"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "8px",
                  border:
                    filter === tab
                      ? "1px solid rgba(139, 92, 246, 0.5)"
                      : "1px solid rgba(255, 255, 255, 0.08)",
                  background:
                    filter === tab
                      ? "rgba(139, 92, 246, 0.2)"
                      : "rgba(24, 24, 27, 0.6)",
                  color: filter === tab ? "#ddd6fe" : "#a1a1aa",
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: "pointer",
                  textTransform: "capitalize",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {stats.completed > 0 && (
            <button
              type="button"
              onClick={handleClearCompleted}
              style={{
                padding: "6px 12px",
                borderRadius: "8px",
                border: "1px solid rgba(239, 68, 68, 0.25)",
                background: "rgba(239, 68, 68, 0.1)",
                color: "#fca5a5",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              完了済みを一括削除 ({stats.completed})
            </button>
          )}
        </div>

        {/* Todo List */}
        <section
          style={{
            background: "rgba(24, 24, 27, 0.75)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "16px",
            overflow: "hidden",
            marginBottom: "28px",
          }}
        >
          {filteredTodos.length === 0 ? (
            <div
              style={{
                padding: "40px 20px",
                textAlign: "center",
                color: "#71717a",
              }}
            >
              <p style={{ margin: "0 0 8px", fontSize: "15px" }}>
                タスクがありません。
              </p>
              <small>
                初期データを投入するには{" "}
                <code style={{ color: "#a78bfa" }}>pnpm db:seed</code>{" "}
                を実行してください。
              </small>
            </div>
          ) : (
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {filteredTodos.map((todo, idx) => {
                const priorityStyle =
                  PRIORITY_STYLES[todo.priority as PriorityType] ??
                  PRIORITY_STYLES.medium;
                const isBusy = busyId === todo.id;

                return (
                  <li
                    key={todo.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px",
                      padding: "16px 20px",
                      borderBottom:
                        idx < filteredTodos.length - 1
                          ? "1px solid rgba(255, 255, 255, 0.06)"
                          : "none",
                      opacity: isBusy ? 0.5 : 1,
                      transition: "opacity 0.15s ease",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        disabled={isBusy}
                        onChange={() => handleToggle(todo.id, todo.completed)}
                        style={{
                          width: "18px",
                          height: "18px",
                          accentColor: "#8b5cf6",
                          cursor: "pointer",
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div
                          style={{
                            fontSize: "15px",
                            fontWeight: 500,
                            color: todo.completed ? "#71717a" : "#f4f4f5",
                            textDecoration: todo.completed
                              ? "line-through"
                              : "none",
                            wordBreak: "break-word",
                          }}
                        >
                          {todo.title}
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#52525b",
                            marginTop: "3px",
                          }}
                        >
                          {todo.createdAt}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        flexShrink: 0,
                      }}
                    >
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          padding: "3px 9px",
                          borderRadius: "9999px",
                          background: priorityStyle.bg,
                          color: priorityStyle.text,
                          border: `1px solid ${priorityStyle.border}`,
                        }}
                      >
                        {priorityStyle.label}
                      </span>
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleDelete(todo.id)}
                        aria-label="Delete todo"
                        style={{
                          background: "transparent",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          color: "#a1a1aa",
                          borderRadius: "8px",
                          padding: "5px 10px",
                          fontSize: "12px",
                          cursor: "pointer",
                        }}
                      >
                        削除
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Typed Fetch Inspector (`void/client` -> `/api/todos`) */}
        <section
          style={{
            background: "rgba(24, 24, 27, 0.6)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "14px",
            padding: "16px 20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <div style={{ fontSize: "14px", fontWeight: 600 }}>
                Typed Fetch API (`void/client`)
              </div>
              <div style={{ fontSize: "12px", color: "#71717a" }}>
                <code>fetch(&quot;/api/todos&quot;)</code> のレスポンス型は{" "}
                <code>routes/api/todos/index.ts</code> から自動推論されます
              </div>
            </div>
            <button
              type="button"
              onClick={handleInspectApi}
              disabled={apiLoading}
              style={{
                padding: "7px 14px",
                borderRadius: "8px",
                border: "1px solid rgba(139, 92, 246, 0.4)",
                background: "rgba(139, 92, 246, 0.15)",
                color: "#c4b5fd",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              {apiLoading ? "取得中..." : "GET /api/todos をテスト"}
            </button>
          </div>
          {apiPreview && (
            <pre
              style={{
                marginTop: "12px",
                padding: "12px",
                borderRadius: "10px",
                background: "#09090b",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                color: "#a78bfa",
                fontSize: "12px",
                overflowX: "auto",
                maxHeight: "240px",
              }}
            >
              {apiPreview}
            </pre>
          )}
        </section>
      </main>
    </div>
  );
}
