import { createSessionToken, verifyPassword } from "@/lib/auth";
import { findUserBySlug } from "@/lib/db-auth";
import { authDbFailureRedirect } from "@/lib/db-error-redirect";
import { getNeonSql } from "@/lib/neon-sql";
import { redirectAfterForm } from "@/lib/redirect-after-form";
import { safePublicOrigin } from "@/lib/public-origin";
import { NextResponse } from "next/server";

export const maxDuration = 60;

export function GET(req: Request) {
  const origin = safePublicOrigin(req);
  return redirectAfterForm(new URL("/select", origin));
}

export async function POST(req: Request) {
  const origin = safePublicOrigin(req);
  const data = await req.formData();
  const slug = String(data.get("slug") ?? "") as "adhrit" | "sar";
  const password = String(data.get("password") ?? "");

  if (!(slug === "adhrit" || slug === "sar")) {
    return redirectAfterForm(new URL("/select", origin));
  }

  if (!getNeonSql()) {
    return redirectAfterForm(new URL(`/profile/${slug}?error=database`, origin));
  }

  let user;
  try {
    user = await findUserBySlug(slug);
  } catch (e) {
    return authDbFailureRedirect(slug, origin, e);
  }

  if (!user) {
    return redirectAfterForm(new URL(`/profile/${slug}?error=not_initialized`, origin));
  }

  let ok: boolean;
  try {
    ok = await verifyPassword(password, user.passwordHash);
  } catch {
    return redirectAfterForm(new URL(`/profile/${slug}?error=server`, origin));
  }
  if (!ok) {
    return redirectAfterForm(new URL(`/profile/${slug}?error=invalid`, origin));
  }

  let token: string;
  try {
    token = await createSessionToken(user.id, user.slug);
  } catch {
    return redirectAfterForm(new URL(`/profile/${slug}?error=server`, origin));
  }

  const res = redirectAfterForm(new URL("/dashboard", origin));

  res.cookies.set("ibo_session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14
  });

  return res;
}
