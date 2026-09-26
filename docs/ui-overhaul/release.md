# Production release checklist

Updated September 26, 2026. User approved commit, merge and Production deployment
after resume review. Release execution is in progress.

## Next-session starting point

September 26 resume review complete; commit/merge/deploy approval received.
Reviewed source committed as `f418e9a`; [PR #2](https://github.com/ThureinS/kalender/pull/2)
passed its protected Preview build and merged as `71fc39d` to `main`.
Git-backed Production deployment `8JqWVpNZevgqXgqzGm3KriGCo14M` is Ready at the
stable URL with booking mode `disabled`. The old workspace error is fixed.
All three live visitor buttons returned to Portfolio Review without passwords,
OTP or Google grants after the username fix below. Visitor Integrations shows
guidance. Storefront/App Shell/Booking Page at 375px and 1024px had no overflow.
Local checkout is on `main`; dev remains running. Host Calendar grant refresh and read-only free/busy passed. Production-only
`KALENDER_BOOKING_MODE=demo` is saved; its deployment and final QA remain.
Preparation and the final gate passed: Node 22.21.1, 85 tests/8 suites, lint,
types, build and action-boundary checks. Reuse that gate while app code stays
unchanged. Resume docs passed 22 local link checks and diff checks.
Announce Brave use before browser QA.

Existing live visitors/profile/env settings are already prepared. Do not create
them again, migrate/reseed the shared database, or repeat the completed real
booking test. Live browser verification still needs the updated deployment.

## Prepared target and settings

- Stable URL: `https://kalender-tau.vercel.app/`, Vercel project `kalender`.
- Live Clerk keys retained. Current SDK proxies through `/__clerk` on
  `.vercel.app`; existing environment endpoint returned HTTP 200.
- Neon is shared with development/Preview. Migration 0004 constraints exist.
  Do not migrate or replace demo data for this release.
- Production-only variables saved for the **next deployment**:

| Variable | Prepared value |
| --- | --- |
| `NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL` | `/overview` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL` | `/onboarding` |
| `KALENDER_BOOKING_MODE` | `demo` (awaiting next deployment) |
| `KALENDER_DEMO_HOST_CLERK_USER_ID` | `user_3JrIeUQShpAMZwP80zXs22uXBi7` |
| `KALENDER_DEMO_PROFILE_HANDLE` | `demo-portfolio-studio` |
| `KALENDER_DEMO_VISITOR_USER_IDS` | Three live visitor IDs below, comma separated |

Other environment scopes, keys, database URL and protected Preview overrides
were preserved. Env edits do not change an existing deployment. Scope API:
[Vercel documentation](https://vercel.com/docs/rest-api/projects/edit-an-environment-variable).

## Clerk and visitor prerequisites

- Production host is `accutility778@gmail.com`; sign-in succeeded using the
  Google client's existing grant. Live user IDs differ from development.
- New `demo-portfolio-studio` profile copies three demo events and five weekly
  windows under that live host. No bookings copied; development records intact.
- Production Google defaults now contain only `openid`, `userinfo.email`,
  `userinfo.profile`. The global `calendar.events` scope was removed and saved
  in the live Clerk dashboard. Host Calendar grants remain separate.
- Host grant refreshed through live Integrations. Google showed both Calendar
  permissions already granted. Clerk now reports events and free/busy; read-only
  free/busy returned HTTP 200 with no per-calendar errors. Workspace setup is 4/4.
- Three live shared visitors are provisioned without emails, passwords or linked
  Google accounts. Backend-assigned usernames `kalender_demo_visitor_1` through
  `kalender_demo_visitor_3` supply the identifier required by frontend ticket
  sign-in; global username sign-in stays disabled. IDs in visitor order:
  `user_3JrOv8IuTbIEE73Al9Ftsjqelwn`,
  `user_3JrPFDqfJyU6oxGOk4fOrBx1Bs7`,
  `user_3JrPFKRPBnudmWaArOYyfN4vlRL`.
  Each has the private demo marker/index and numbered external ID described in
  the [visitor runbook](demo-visitors.md). Self-delete and organization creation
  are disabled for these dedicated accounts.
- Public buttons mint 60-second tickets for those server-selected IDs only.
  Live backend creation/revocation passed for all three; Brave button flows
  passed for all three development and live visitors.
  No new auth method, Device Trust change or host-login exposure was needed.
- Selected option 10: no per-account cap, 500 new reservations per host per
  rolling 24 hours. Atomic admission and original retry ownership are retained.

## Gate, deployment and rollback

1. Gate complete for the current app changes. If further app edits are needed,
   stop dev before `npm run check`, then restart with fresh `.next`.
2. Approval received for commit, reviewed merge and Production deployment.
3. Complete: reviewed changes committed, PR #2 merged to `main`, Git-backed
   Production build passed with booking mode still `disabled`.
4. Complete: stable URL anonymous/host/visitor checks passed. The obsolete
   Clerk `SignedIn` workspace error is fixed.
5. Host Calendar access verified; demo setting saved. Deploy and finish QA.
   Cap: 500/host per rolling 24 hours; no account cap. Uncertain attempts count;
   original retries remain possible. Guest email ownership is not verified.
6. Rollback: disable demo mode and redeploy; use Vercel's prior deployment if
   needed. Do not reseed or delete unrelated shared data.

Public Preview is optional. CV should use stable Production URL after live QA.
Actual guest inbox delivery remains unverified. Any additional invitation test
needs an explicitly authorized recipient and cleanup; the prior test is complete.
