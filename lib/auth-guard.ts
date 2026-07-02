import { auth } from "@/lib/auth";

/**
 * Server-side guard for admin-only server actions and API routes.
 * Middleware already gates /admin pages; this protects the actions
 * themselves (defense in depth — actions are callable endpoints).
 */
export async function requireAdmin(): Promise<void> {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (role !== "admin") {
    throw new Error("Unauthorized: admin session required.");
  }
}
