import { neon } from "@neondatabase/serverless";
import { resolveDatabaseUrl } from "@/lib/database-url";

type NeonSql = ReturnType<typeof neon>;

const globalForNeon = globalThis as unknown as { neonSql?: NeonSql };

export function getNeonSql(): NeonSql | null {
  const url = resolveDatabaseUrl();
  if (!url) return null;
  if (!globalForNeon.neonSql) {
    globalForNeon.neonSql = neon(url);
  }
  return globalForNeon.neonSql;
}
