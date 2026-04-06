import { NeonDbError } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

function messageOf(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}

/**
 * Map DB driver failures to profile-page error codes.
 * Neon/pg use text errors instead of Prisma codes.
 */
export function authDbFailureRedirect(slug: string, origin: string, err: unknown): NextResponse {
  if (err instanceof NeonDbError && err.code === "42P01") {
    return NextResponse.redirect(new URL(`/profile/${slug}?error=migrations`, origin));
  }
  const msg = messageOf(err);
  if (/relation .+ does not exist|does not exist/i.test(msg)) {
    return NextResponse.redirect(new URL(`/profile/${slug}?error=migrations`, origin));
  }
  return NextResponse.redirect(new URL(`/profile/${slug}?error=database`, origin));
}
