import { NextResponse } from "next/server";

/**
 * After an HTML form POST to an API route, use 303 See Other so the browser
 * follows with GET. Default NextResponse.redirect uses 307, which preserves
 * POST and causes 405 on App Router pages.
 */
export function redirectAfterForm(url: string | URL): NextResponse {
  return NextResponse.redirect(url, 303);
}
