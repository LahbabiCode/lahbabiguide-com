import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: any;
};

const createMockPrisma = () => {
  const mockHandler = {
    get(target: any, prop: string) {
      if (prop === '$connect' || prop === '$disconnect') return async () => {};
      return new Proxy({}, {
        get(target: any, action: string) {
          return async (args?: any) => {
            if (action.startsWith('findMany')) return [];
            if (action.startsWith('findUnique')) return null;
            if (action.startsWith('findFirst')) return null;
            if (action.startsWith('aggregate')) return { _avg: { score: null }, _count: { score: 0 } };
            if (action.startsWith('count')) return 0;
            return null;
          }
        }
      });
    }
  };
  return new Proxy({}, mockHandler);
};

export const prisma =
  globalForPrisma.prisma ??
  (process.env.NEXT_BUILD === "1" || 
   !process.env.DATABASE_URL || 
   process.env.DATABASE_URL.includes("localhost") ||
   (!process.env.DATABASE_URL.startsWith("postgresql://") && !process.env.DATABASE_URL.startsWith("postgres://"))
    ? createMockPrisma() 
    : new PrismaClient({ log: ["error"] }));

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
