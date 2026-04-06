import { publicOriginFromRequest } from "@/lib/public-origin";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPrefixes = ["/dashboard", "/roadmap", "/team", "/practice", "/cases", "/analytics"];

export function middleware(req: NextRequest) {
  const isProtected = protectedPrefixes.some((p) => req.nextUrl.pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const session = req.cookies.get("ibo_session")?.value;
  if (!session) {
    return NextResponse.redirect(new URL("/select", publicOriginFromRequest(req)));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/roadmap/:path*", "/team/:path*", "/practice/:path*", "/cases/:path*", "/analytics/:path*"]
};
