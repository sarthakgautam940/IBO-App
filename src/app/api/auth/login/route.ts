import { createSessionToken, verifyPassword } from "@/lib/auth";
import { prismaAuthFailureResponse } from "@/lib/prisma-auth-redirect";
import { prisma } from "@/lib/prisma";
import { safePublicOrigin } from "@/lib/public-origin";
import { NextResponse } from "next/server";

export const maxDuration = 60;

export function GET(req: Request) {
  const origin = safePublicOrigin(req);
  return NextResponse.redirect(new URL("/select", origin));
}

export async function POST(req: Request) {
  const origin = safePublicOrigin(req);
  const data = await req.formData();
  const slug = String(data.get("slug") ?? "");
  const password = String(data.get("password") ?? "");

  if (!(slug === "adhrit" || slug === "sar")) {
    return NextResponse.redirect(new URL("/select", origin));
  }

  let user;
  try {
    user = await prisma.user.findUnique({ where: { slug } });
  } catch (e) {
    return prismaAuthFailureResponse(slug, origin, e);
  }

  if (!user) {
    return NextResponse.redirect(new URL(`/profile/${slug}?error=not_initialized`, origin));
  }

  let ok: boolean;
  try {
    ok = await verifyPassword(password, user.passwordHash);
  } catch {
    return NextResponse.redirect(new URL(`/profile/${slug}?error=server`, origin));
  }
  if (!ok) {
    return NextResponse.redirect(new URL(`/profile/${slug}?error=invalid`, origin));
  }

  let token: string;
  try {
    token = await createSessionToken(user.id, user.slug);
  } catch {
    return NextResponse.redirect(new URL(`/profile/${slug}?error=server`, origin));
  }

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
