/**
 * Vercel Postgres / Neon inject full URLs and sometimes only split POSTGRES_* parts.
 */

function firstTrimmed(...values: (string | undefined)[]): string | undefined {
  for (const v of values) {
    const t = v?.trim();
    if (t) return t;
  }
  return undefined;
}

/**
 * Build postgresql:// URL when Vercel only sets POSTGRES_HOST, POSTGRES_USER, etc.
 */
export function composePostgresUrlFromParts(): string | undefined {
  const host = process.env.POSTGRES_HOST?.trim();
  const user = process.env.POSTGRES_USER?.trim();
  const password = process.env.POSTGRES_PASSWORD;
  const database = process.env.POSTGRES_DATABASE?.trim();
  if (!host || !user || password === undefined || !database) return undefined;

  const port = process.env.POSTGRES_PORT?.trim() || "5432";
  const enc = encodeURIComponent;
  return `postgresql://${enc(user)}:${enc(password)}@${host}:${port}/${enc(database)}`;
}

export function resolveDatabaseUrl(): string | undefined {
  const fromUrl = firstTrimmed(
    process.env.DATABASE_URL,
    process.env.POSTGRES_PRISMA_URL,
    process.env.PRISMA_DATABASE_URL,
    process.env.POSTGRES_URL,
    process.env.POSTGRES_URL_NON_POOLING,
    process.env.NEON_DATABASE_URL
  );
  if (fromUrl) return fromUrl;

  return composePostgresUrlFromParts();
}

/** Migrations need a direct (non-pgbouncer) connection when available. */
export function resolveMigrateDatabaseUrl(): string | undefined {
  const direct = firstTrimmed(
    process.env.POSTGRES_URL_NON_POOLING,
    process.env.DATABASE_URL_UNPOOLED,
    process.env.DIRECT_URL
  );
  if (direct) return direct;

  const pooled = resolveDatabaseUrl();
  if (pooled) return pooled;

  return composePostgresUrlFromParts();
}
