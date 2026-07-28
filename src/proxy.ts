import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import {
  NextResponse,
  type NextFetchEvent,
  type NextRequest,
} from "next/server";

import {
  buildContentSecurityPolicy,
  clerkContentSecurityPolicy,
} from "@/config/security";

const isProtectedRoute = createRouteMatcher(["/account(.*)"]);
const isClerkRoute = createRouteMatcher(["/__clerk(.*)"]);
const clerkProxy = clerkMiddleware(
  async (auth, request) => {
    if (isProtectedRoute(request)) {
      await auth.protect();
    }
  },
  {
    contentSecurityPolicy: clerkContentSecurityPolicy,
  },
);

export const config = {
  matcher: [
    "/((?!api|_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/__clerk/(.*)",
  ],
};

export default function proxy(request: NextRequest, event: NextFetchEvent) {
  if (isProtectedRoute(request) || isClerkRoute(request)) {
    return clerkProxy(request, event);
  }

  const nonce = crypto.randomUUID();
  const contentSecurityPolicy = buildContentSecurityPolicy(nonce);
  const requestHeaders = new Headers(request.headers);

  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", contentSecurityPolicy);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set("Content-Security-Policy", contentSecurityPolicy);

  return response;
}
