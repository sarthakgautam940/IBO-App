import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = (await req.json()) as { checkpointId?: string; completedBySlug?: "adhrit" | "sar" };
  if (!body.checkpointId || !body.completedBySlug) {
    return NextResponse.json({ error: "Missing fields." }, { status: 400 });
  }

  const checkpoint = await prisma.meetingCheckpoint.update({
    where: { id: body.checkpointId },
    data: {
      completedAt: new Date(),
      completedBySlug: body.completedBySlug
    }
  });

  return NextResponse.json({ checkpoint });
}
