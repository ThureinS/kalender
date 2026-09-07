import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/login(.*)",
  "/register(.*)",
  "/sso-callback(.*)",
  "/book(.*)",
  "/theme-lab(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return;

  await auth.protect();
});

export const config = {
  matcher: [
    // Skip public routes, Next.js internals, and static files.
    "/((?!$|login(?:/.*)?|register(?:/.*)?|sso-callback(?:/.*)?|book/.+|theme-lab(?:/.*)?|_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    // Clerk proxy
    "/__clerk/:path*",
  ],
};
