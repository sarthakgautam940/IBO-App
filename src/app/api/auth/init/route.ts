import { hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { safePublicOrigin } from "@/lib/public-origin";
import { NextResponse } from "next/server";

export const maxDuration = 60;

/** Browsers that land on the API URL (refresh, bad redirect) go back to the app. */
export function GET(req: Request) {
  const origin = safePublicOrigin(req);
  return NextResponse.redirect(new URL("/select", origin));
}

export async function POST(req: Request) {
  const origin = safePublicOrigin(req);
  const data = await req.formData();
  const slug = String(data.get("slug") ?? "");
  const password = String(data.get("password") ?? "");
  const confirmPassword = String(data.get("confirmPassword") ?? "");

  if (!(slug === "adhrit" || slug === "sar")) {
    return NextResponse.redirect(new URL("/select", origin));
  }
  if (password !== confirmPassword || password.length < 10) {
    return NextResponse.redirect(new URL(`/profile/${slug}?error=validation`, origin));
  }

  let existing;
  try {
    existing = await prisma.user.findUnique({ where: { slug } });
  } catch {
    return NextResponse.redirect(new URL(`/profile/${slug}?error=database`, origin));
  }

  if (existing) {
    return NextResponse.redirect(new URL(`/profile/${slug}?error=already`, origin));
  }

  let passwordHash: string;
  try {
    passwordHash = await hashPassword(password);
  } catch {
    return NextResponse.redirect(new URL(`/profile/${slug}?error=server`, origin));
  }

  try {
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
  } catch {
    return NextResponse.redirect(new URL(`/profile/${slug}?error=database`, origin));
  }

  return NextResponse.redirect(new URL(`/profile/${slug}`, origin));
}
