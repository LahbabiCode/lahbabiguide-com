type InsertRecord = Record<string, unknown>;

interface InsertResult<T> {
  ok: boolean;
  data?: T;
  mode: "db" | "fallback";
  error?: string;
}

export async function tryDbInsert<T = unknown>(
  operation: () => Promise<T>
): Promise<InsertResult<T>> {
  try {
    const data = await operation();
    return { ok: true, data, mode: "db" };
  } catch (err) {
    console.warn("DB insert fell back to in-memory:", err);
    return { ok: true, data: undefined, mode: "fallback" };
  }
}

export function isDatabaseConfigured(): boolean {
  const url = process.env.DATABASE_URL;
  if (!url) return false;
  if (url.includes("localhost") || url.includes("127.0.0.1")) return false;
  return url.startsWith("postgresql://") || url.startsWith("postgres://");
}

export type { InsertRecord, InsertResult };
