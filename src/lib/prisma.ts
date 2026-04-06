import type { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __iboPrisma: PrismaClient | undefined;
}

export async function getPrismaClient(): Promise<PrismaClient> {
  if (global.__iboPrisma) return global.__iboPrisma;

  const { PrismaClient } = await import("@prisma/client");
  const client = new PrismaClient({
    log: ["error", "warn"]
  });

  if (process.env.NODE_ENV !== "production") {
    global.__iboPrisma = client;
  }

  return client;
}
