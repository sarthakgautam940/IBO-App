import { getNeonSql } from "@/lib/neon-sql";

export type UserSlug = "adhrit" | "sar";

export type AuthUserRow = {
  id: string;
  slug: UserSlug;
  passwordHash: string;
};

export async function findUserBySlug(slug: UserSlug): Promise<AuthUserRow | undefined> {
  const sql = getNeonSql();
  if (!sql) return undefined;
  const rows = (await sql`
    SELECT id, slug::text AS slug, "passwordHash"
    FROM "User"
    WHERE slug = ${slug}::"UserSlug"
    LIMIT 1
  `) as AuthUserRow[];
  const row = rows[0];
  return row;
}

export async function createUserWithMastery(input: {
  slug: UserSlug;
  displayName: string;
  passwordHash: string;
}): Promise<void> {
  const sql = getNeonSql();
  if (!sql) throw new Error("NO_DATABASE_URL");
  const userId = crypto.randomUUID();
  const masteryId = crypto.randomUUID();

  await sql.transaction([
    sql`
      INSERT INTO "User" (id, slug, "displayName", "passwordHash", "updatedAt")
      VALUES (${userId}, ${input.slug}::"UserSlug", ${input.displayName}, ${input.passwordHash}, NOW())
    `,
    sql`
      INSERT INTO "MasteryMetric" (
        id, "userId", overall, "prelimReadiness", "objectiveCaseReadiness",
        "openCaseReadiness", "presentationReadiness", "competitionReadiness",
        "topicBreakdownJson", "updatedAt"
      )
      VALUES (
        ${masteryId}, ${userId}, 0, 0, 0, 0, 0, 0,
        NULL, NOW()
      )
    `
  ]);
}
