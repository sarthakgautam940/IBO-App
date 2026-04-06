import { neon } from "@neondatabase/serverless";
import { resolveDatabaseUrl } from "@/lib/database-url";

type NeonSql = ReturnType<typeof neon>;

const globalForNeon = globalThis as unknown as { neonSql?: NeonSql; neonUrl?: string };

export function getNeonSql(): NeonSql | null {
  const url = resolveDatabaseUrl();
  if (!url) return null;

  if (globalForNeon.neonUrl !== url) {
    globalForNeon.neonSql = neon(url);
    globalForNeon.neonUrl = url;
  }
  return globalForNeon.neonSql ?? null;
}
