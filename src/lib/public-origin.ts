/**
 * Origin for redirects from API routes / middleware behind reverse proxies (e.g. Vercel).
 * `req.url` in serverless often reflects an internal host; browsers need the public URL.
 */
export function publicOriginFromRequest(req: Request): string {
  const explicit = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (explicit) {
    return new URL(explicit).origin;
  }
  const forwardedHost = req.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost || req.headers.get("host");
  if (host) {
    const proto =
      req.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() || "https";
    return `${proto}://${host}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return new URL(req.url).origin;
}

/** Same as publicOriginFromRequest but never throws (e.g. bad NEXT_PUBLIC_APP_URL). */
export function safePublicOrigin(req: Request): string {
  try {
    return publicOriginFromRequest(req);
  } catch {
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`;
    }
    try {
      return new URL(req.url).origin;
    } catch {
      return "http://localhost:3000";
    }
  }
}
