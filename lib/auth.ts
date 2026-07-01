import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db/prisma";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "Admin Login",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // This is a simple authorize function. 
        // In a real app, you would verify the password with bcrypt.
        if (credentials?.username === "admin" && credentials?.password === "admin") {
          const user = await prisma.user.findUnique({
            where: { email: "admin@lahbabiguide.com" },
          });
          
          if (!user) {
            return await prisma.user.create({
              data: {
                email: "admin@lahbabiguide.com",
                name: "Administrator",
                role: "admin",
              },
            });
          }
          return user;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
        });
        session.user.id = user.id;
        // @ts-ignore
        session.user.role = dbUser?.role || "user";
      }
      return session;
    },
  },
  session: {
    strategy: "database", // Use database sessions for persistence as requested
  },
});
