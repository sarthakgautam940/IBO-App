import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

/**
 * Map Prisma failures to profile-page error codes (avoid generic "database" for missing tables).
 */
export function prismaAuthFailureResponse(
  slug: string,
  origin: string,
  err: unknown
): NextResponse {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2021" || err.code === "P2022") {
      return NextResponse.redirect(new URL(`/profile/${slug}?error=migrations`, origin));
    }
    if (err.code === "P1001" || err.code === "P1002" || err.code === "P1017") {
      return NextResponse.redirect(new URL(`/profile/${slug}?error=database`, origin));
    }
  }
  return NextResponse.redirect(new URL(`/profile/${slug}?error=database`, origin));
}
