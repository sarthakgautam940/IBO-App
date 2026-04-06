import { PrismaClient } from "@prisma/client";
import { resolveDatabaseUrl } from "@/lib/database-url";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const resolved = resolveDatabaseUrl();
if (resolved) {
  process.env.DATABASE_URL = resolved;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error", "warn"]
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
