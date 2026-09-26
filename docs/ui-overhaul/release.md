# Production release checklist

Updated September 26, 2026. User approved commit, merge and Production deployment
after resume review. Release execution is in progress.

## Next-session starting point

September 26 resume review complete; commit/merge/deploy approval received.
Source is uncommitted/unpushed on `ui-overhaul`; reviewed
release diff needs no further app changes. GitHub heads match `3f70d04` for
`ui-overhaul` and `687cb35` for `main`; no open PR. Local dev is running.
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
| `KALENDER_BOOKING_MODE` | `disabled` |
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
- Production host has events scope, lacks `calendar.events.freebusy`; read-only
  free/busy returned 403. Once updated app is live, authorize additional host
  scopes in Integrations, then verify free/busy before enabling `demo` mode.
- Three live shared visitors are provisioned without emails, passwords or linked
  Google accounts. IDs in visitor order:
  `user_3JrOv8IuTbIEE73Al9Ftsjqelwn`,
  `user_3JrPFDqfJyU6oxGOk4fOrBx1Bs7`,
  `user_3JrPFKRPBnudmWaArOYyfN4vlRL`.
  Each has the private demo marker/index and numbered external ID described in
  the [visitor runbook](demo-visitors.md). Self-delete and organization creation
  are disabled for these dedicated accounts.
- Public buttons mint 60-second tickets for those server-selected IDs only.
  Live backend creation/revocation passed for all three; local Brave button flow
  passed for all three development visitors. Live browser flow awaits deployment.
  No new auth method, Device Trust change or host-login exposure was needed.
- Selected option 10: no per-account cap, 500 new reservations per host per
  rolling 24 hours. Atomic admission and original retry ownership are retained.

## Gate, deployment and rollback

1. Gate complete for the current app changes. If further app edits are needed,
   stop dev before `npm run check`, then restart with fresh `.next`.
2. Approval received for commit, reviewed merge and Production deployment.
3. Commit the reviewed changes, merge to `main` and verify Git-backed Production
   build with booking mode still `disabled`.
4. Check stable URL anonymously/signed in. This branch removes the old live
   layout's unsupported Clerk `SignedIn` component.
5. Verify host Calendar access, enable designated demo host and deploy setting.
   Cap: 500/host per rolling 24 hours; no account cap. Uncertain attempts count;
   original retries remain possible. Guest email ownership is not verified.
6. Rollback: disable demo mode and redeploy; use Vercel's prior deployment if
   needed. Do not reseed or delete unrelated shared data.

Public Preview is optional. CV should use stable Production URL after live QA.
Actual guest inbox delivery remains unverified. Any additional invitation test
needs an explicitly authorized recipient and cleanup; the prior test is complete.
