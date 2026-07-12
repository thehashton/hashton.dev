import { NextResponse, type NextRequest } from "next/server";

import { auth } from "@/lib/auth/server";

const dashboardAuth = auth.middleware({
  loginUrl: "/login",
});

export default function middleware(request: NextRequest) {
  // Auth middleware redirects unauthenticated dashboard requests to /login.
  // For Server Actions that break the action protocol and surface as
  // "An unexpected response was received from the server."
  // Actions already enforce auth via requireAppSession().
  if (request.headers.has("next-action")) {
    return NextResponse.next();
  }

  return dashboardAuth(request);
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
