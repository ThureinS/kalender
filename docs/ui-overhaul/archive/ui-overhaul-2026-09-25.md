# September 25, 2026 targeted QA

- Local browser: workspace light/dark toggle, light preference after reload and
  navigation, account menus in both themes, dark timezone dropdown and copy
  confirmation toast rendered legibly. The host session stayed signed in.
- Landing demo instructions were inspected at 1280, 375 and 320 px widths.
  At 375 px the password had a one-character final line. Reduced mobile code
  size in `components/DemoVisitorAccess.tsx`; password now fits one line at
  375 and 320 px. Emails remain readable when wrapped at 320 px. Page width
  was 320 px with no horizontal document overflow.
- On the anonymous Portfolio Review event at 375 px, the in-form Sign in button
  opened a legible Clerk modal. A later authorized sign-in with Demo Tester 1
  completed password and development email-code checks. The browser returned to
  the same Portfolio Review URL; the signed-in visitor avatar and booking form
  appeared, and the sign-in prompt disappeared. No booking was submitted.
- Local `.env.local` has the required database and Clerk keys; Clerk keys are
  development keys, booking mode is `demo`, and the configured host ID matches
  the demo runbook. The Vercel CLI was authenticated and linked to the existing
  `thureinss-projects/kalender` project after the user clicked Allow Access.
- Node 22.21.1 `npm run check` passed: 56 tests across seven suites, lint,
  types, build and compiled action checks. The dev server was stopped before
  the build and restarted with a fresh `.next` directory afterward.
- Brave production smoke test: `kalender-tau.vercel.app` loaded the old Clerk
  sign-in page. Vercel marked `main` revision `687cb35` Ready. Opening
  `/book/demo-strategy-studio` returned 500, digest `403125698`. Vercel logs
  showed Clerk user lookup 404: this old route expects a Clerk user ID, while
  `demo-strategy-studio` is the new handle. The invalid URL produces a server
  error in the old code; it does not establish a general production outage.
- The user authorized sending the development database and Clerk credentials
  to this Vercel project for Preview. The Brave environment-import chooser
  failed after authorization. A Vercel CLI attempt to save branch-specific
  variables returned `branch_not_found`: no remote `ui-overhaul` branch exists.
  No project-level environment variables were saved.
- Direct CLI deployment from the uncommitted working tree used one-off build
  and runtime overrides for development Clerk, the shared Neon database,
  Clerk redirects and `KALENDER_BOOKING_MODE=disabled`; no demo host ID. A dry
  run confirmed `.env.local` was excluded from upload. No Git push, migration,
  reseed, booking or invitation occurred.
- Initial protected Preview was Ready. Brave showed the new landing, seeded
  profile, paused booking notice, and Clerk Development mode sign-in. The
  landing line "ready locally" was inaccurate on Preview; changed it to
  "Explore the portfolio demo." Node 22.21.1 `npm run check` passed again:
  56 tests, lint, types, build and compiled action checks. Dev restarted with
  a fresh `.next` output directory.
- Final [Preview](https://kalender-b4xlrert1-thureinss-projects.vercel.app/)
  is Ready with target `preview`. An anonymous request redirects to Vercel
  SSO. Brave confirmed the corrected landing line, seeded profile, paused
  booking notice and Development mode sign-in. Signed-in workspace and mobile
  Preview QA remain. Production was not changed.
- Follow-up responsive QA: the landing Workspace steps were cramped at desktop
  intermediate widths, the hero at 1024 px, booking time slots at 320 px,
  visitor details at 768 px, mobile App Shell navigation, and the Booking Page
  editor at 320–1024 px. Adjusted breakpoints, labels, and wrapping. Local
  Brave checks covered 320, 375, 768, 1024 and 1280 px across landing, public
  profile/event, login, onboarding and workspace routes; no document overflow
  remained in tested routes. Booking-disabled local QA found misleading demo
  copy; profile, event page and form now clearly say preview/paused and the
  submit button stays disabled.
- After all application edits, Node 22.21.1 `npm run check` passed once: lint,
  56 tests, typecheck, build and compiled action checks. Dev restarted with
  fresh `.next` output. The new direct [protected Preview](https://kalender-foeqgfps5-thureinss-projects.vercel.app/)
  is Ready/preview with one-off development Clerk/database overrides and booking
  disabled. Anonymous curl returned 302 to Vercel SSO. Brave confirmed paused
  copy, mobile profile/event layout and disabled confirmation. Demo Tester 1
  signed in on Preview; Overview and Booking Page fit phone/tablet/desktop,
  with Settings visible in tablet navigation. No booking or invitation was sent.
