import { completeMeetingCheckpoint } from "@/lib/db-checkpoints";
import { getNeonSql } from "@/lib/neon-sql";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = (await req.json()) as { checkpointId?: string; completedBySlug?: "adhrit" | "sar" };
  if (!body.checkpointId || !body.completedBySlug) {
    return NextResponse.json({ error: "Missing fields." }, { status: 400 });
  }

  if (!getNeonSql()) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  try {
    const checkpoint = await completeMeetingCheckpoint({
      checkpointId: body.checkpointId,
      completedBySlug: body.completedBySlug
    });
    if (!checkpoint) {
      return NextResponse.json({ error: "Checkpoint not found." }, { status: 404 });
    }
    return NextResponse.json({ checkpoint });
  } catch {
    return NextResponse.json({ error: "Database error." }, { status: 503 });
  }
}
