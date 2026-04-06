import { createSessionToken, verifyPassword } from "@/lib/auth";
import { getPrismaClient } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const prisma = await getPrismaClient();
  const data = await req.formData();
  const slug = String(data.get("slug") ?? "");
  const password = String(data.get("password") ?? "");

  if (!(slug === "adhrit" || slug === "sar")) {
    return NextResponse.json({ error: "Invalid profile." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { slug } });
  if (!user) {
    return NextResponse.json({ error: "Profile not initialized." }, { status: 404 });
  }

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const token = await createSessionToken(user.id, user.slug);
  const res = NextResponse.redirect(new URL("/dashboard", req.url));

  res.cookies.set("ibo_session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14
  });

  return res;
}
