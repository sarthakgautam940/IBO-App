/**
 * Vercel Postgres injects several env vars. Prefer pooled Prisma URL for queries;
 * use non-pooling only when nothing else is set (direct connections).
 */
export function resolveDatabaseUrl(): string | undefined {
  const candidates = [
    process.env.DATABASE_URL,
    process.env.POSTGRES_PRISMA_URL,
    process.env.PRISMA_DATABASE_URL,
    process.env.POSTGRES_URL,
    process.env.POSTGRES_URL_NON_POOLING
  ];
  for (const c of candidates) {
    const t = c?.trim();
    if (t) return t;
  }
  return undefined;
}

/** Migrations need a direct (non-pgbouncer) connection when available. */
export function resolveMigrateDatabaseUrl(): string | undefined {
  const direct = [
    process.env.POSTGRES_URL_NON_POOLING,
    process.env.DATABASE_URL_UNPOOLED,
    process.env.DIRECT_URL
  ];
  for (const c of direct) {
    const t = c?.trim();
    if (t) return t;
  }
  return resolveDatabaseUrl();
}
