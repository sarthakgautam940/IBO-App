import { getNeonSql } from "@/lib/neon-sql";

export type UserSlug = "adhrit" | "sar";

export async function completeMeetingCheckpoint(input: {
  checkpointId: string;
  completedBySlug: UserSlug;
}): Promise<Record<string, unknown> | undefined> {
  const sql = getNeonSql();
  if (!sql) return undefined;
  const rows = (await sql`
    UPDATE "MeetingCheckpoint"
    SET "completedAt" = NOW(), "completedBySlug" = ${input.completedBySlug}::"UserSlug"
    WHERE id = ${input.checkpointId}
    RETURNING *
  `) as Record<string, unknown>[];
  return rows[0];
}
