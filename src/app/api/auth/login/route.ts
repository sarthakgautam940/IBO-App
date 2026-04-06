import { createSessionToken, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { publicOriginFromRequest } from "@/lib/public-origin";
import { NextResponse } from "next/server";

export const maxDuration = 60;

export async function POST(req: Request) {
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
  const origin = publicOriginFromRequest(req);
  const res = NextResponse.redirect(new URL("/dashboard", origin));

  res.cookies.set("ibo_session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14
  });

  return res;
}
