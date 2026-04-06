/**
 * Vercel Postgres / Neon often inject connection strings as POSTGRES_PRISMA_URL
 * or POSTGRES_URL; Prisma's schema only declares DATABASE_URL.
 */
export function resolveDatabaseUrl(): string | undefined {
  const u =
    process.env.DATABASE_URL?.trim() ||
    process.env.POSTGRES_PRISMA_URL?.trim() ||
    process.env.POSTGRES_URL?.trim();
  return u || undefined;
}
