import { NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Optimistic guard: if there is no session cookie at all, send the visitor to /login.
// Users who ARE logged in keep their cookie, so reloading a private route never logs them out.
// (PrivateRoute.jsx performs the real session check on the client.)
export function middleware(request) {
  const sessionCookie = getSessionCookie(request);
  if (!sessionCookie) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/events/create", "/events/manage", "/events/joined", "/events/:id/edit", "/profile"],
};
