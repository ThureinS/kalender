import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/login(.*)",
  "/register(.*)",
  "/sso-callback(.*)",
  "/book",
  "/book/(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return;

  await auth.protect();
});

export const config = {
  matcher: [
    // Establish Clerk context on booking routes for approved tester actions.
    // Public pages still do not require sign-in.
    "/((?!$|login(?:/.*)?|register(?:/.*)?|sso-callback(?:/.*)?|_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    // Clerk proxy
    "/__clerk/:path*",
  ],
};
