import { NeonDbError } from "@neondatabase/serverless";
import { redirectAfterForm } from "@/lib/redirect-after-form";

function messageOf(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}

/**
 * Map DB driver failures to profile-page error codes.
 * Neon/pg use text errors instead of Prisma codes.
 */
export function authDbFailureRedirect(slug: string, origin: string, err: unknown) {
  if (err instanceof NeonDbError && err.code === "42P01") {
    return redirectAfterForm(new URL(`/profile/${slug}?error=migrations`, origin));
  }
  const msg = messageOf(err);
  if (/relation .+ does not exist|does not exist/i.test(msg)) {
    return redirectAfterForm(new URL(`/profile/${slug}?error=migrations`, origin));
  }
  return redirectAfterForm(new URL(`/profile/${slug}?error=database`, origin));
}
