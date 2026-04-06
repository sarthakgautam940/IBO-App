import { hashPassword } from "@/lib/auth";
import { getPrismaClient } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const prisma = await getPrismaClient();
  const data = await req.formData();
  const slug = String(data.get("slug") ?? "");
  const password = String(data.get("password") ?? "");
  const confirmPassword = String(data.get("confirmPassword") ?? "");

  if (!(slug === "adhrit" || slug === "sar")) {
    return NextResponse.json({ error: "Invalid profile." }, { status: 400 });
  }
  if (password !== confirmPassword || password.length < 10) {
    return NextResponse.json({ error: "Password validation failed." }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "Profile already initialized." }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);

  await prisma.user.create({
    data: {
      slug,
      displayName: slug === "adhrit" ? "Adhrit" : "Sar",
      passwordHash,
      mastery: {
        create: {
          overall: 0,
          prelimReadiness: 0,
          objectiveCaseReadiness: 0,
          openCaseReadiness: 0,
          presentationReadiness: 0,
          competitionReadiness: 0
        }
      }
    }
  });

  return NextResponse.redirect(new URL(`/profile/${slug}`, req.url));
}
