import { hashPassword } from "@/lib/auth";
import { createUserWithMastery, findUserBySlug } from "@/lib/db-auth";
import { authDbFailureRedirect } from "@/lib/db-error-redirect";
import { getNeonSql } from "@/lib/neon-sql";
import { redirectAfterForm } from "@/lib/redirect-after-form";
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
  const slug = String(data.get("slug") ?? "") as "adhrit" | "sar";
  const password = String(data.get("password") ?? "");
  const confirmPassword = String(data.get("confirmPassword") ?? "");

  if (!(slug === "adhrit" || slug === "sar")) {
    return redirectAfterForm(new URL("/select", origin));
  }
  if (password !== confirmPassword || password.length < 10) {
    return redirectAfterForm(new URL(`/profile/${slug}?error=validation`, origin));
  }

  if (!getNeonSql()) {
    return redirectAfterForm(new URL(`/profile/${slug}?error=database`, origin));
  }

  let existing;
  try {
    existing = await findUserBySlug(slug);
  } catch (e) {
    return authDbFailureRedirect(slug, origin, e);
  }

  if (existing) {
    return redirectAfterForm(new URL(`/profile/${slug}?error=already`, origin));
  }

  let passwordHash: string;
  try {
    passwordHash = await hashPassword(password);
  } catch {
    return redirectAfterForm(new URL(`/profile/${slug}?error=server`, origin));
  }

  try {
    await createUserWithMastery({
      slug,
      displayName: slug === "adhrit" ? "Adhrit" : "Sar",
      passwordHash
    });
  } catch (e) {
    return authDbFailureRedirect(slug, origin, e);
  }

  return redirectAfterForm(new URL(`/profile/${slug}`, origin));
}
