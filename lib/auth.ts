import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

/**
 * Admin authentication.
 *
 * - Credentials come from environment variables (ADMIN_USERNAME / ADMIN_PASSWORD)
 *   set in the deployment platform — never hardcoded.
 * - JWT session strategy: required for the Credentials provider (database
 *   sessions are not created for credentials sign-ins) and keeps this module
 *   free of Prisma so it can run in middleware (edge runtime).
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      name: "Admin Login",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const adminUser = process.env.ADMIN_USERNAME;
        const adminPass = process.env.ADMIN_PASSWORD;

        // Refuse to authenticate if the admin credentials are not configured —
        // this must never fall back to a default.
        if (!adminUser || !adminPass) return null;

        if (
          credentials?.username === adminUser &&
          credentials?.password === adminPass
        ) {
          return {
            id: "admin",
            name: "Administrator",
            email: "admin@lahbabiguide.com",
            role: "admin",
          } as { id: string; name: string; email: string; role: string };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.sub as string) ?? "admin";
        // @ts-expect-error - role is a custom claim
        session.user.role = token.role ?? "user";
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
});
