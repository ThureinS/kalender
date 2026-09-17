# Kalender UI overhaul handoff

Read this file first for ongoing `ui-overhaul` work. It is the current source of
truth; load detailed evidence or history only when relevant to the task.
Updated September 17, 2026.

## Current handoff state

- Branch: `ui-overhaul`. Implementation and dependency validation checkpoint:
  `f810c64` (`Harden portfolio demo booking flow and validate dependencies`).
- UI phases 1–8, onboarding, polished auth, demo seed tooling and local booking
  history are implemented. Theme Lab routes are retired.
- Product identity: Midnight Storefront, Daylight App Shell, Lime accent.
  Owner accents apply to public Booking Pages, not the private workspace.
- Public demo: `/book/demo-strategy-studio`. Seed contents were not refreshed
  or inspected in the latest session.
- Booking writes default to disabled. `testers` mode requires a signed-in Clerk
  ID in `KALENDER_DEMO_BOOKER_IDS`. Reservations prevent owner-wide overlap;
  deterministic Google event IDs support retries; success requires a stored receipt.
- The architecture audit is implemented and validated. Do not repeat it.
- Latest session scope: no browser work or deployment. No accounts, live data,
  external configuration or credentials were changed. Git commits are local.

## Verified checks

September 17, Node 22.21.1 / npm 10.9.4:

- Lockfile matches `package.json`; clean `npm ci` passes.
- `npm audit`: zero known vulnerabilities, including development dependencies.
- `npm run check`: zero-warning lint, 26 tests in five suites, typecheck,
  production build and compiled action/retired-route checks all pass.
- `git diff --check` and native Sharp image processing pass.
- npm 11.19.1 was needed for lockfile repair after an npm 10 resolver failure.
  Existing dependency deprecations and Webpack cache warnings are non-failing.
- Tests mock Clerk/Google and use disposable PGlite. They do not prove real
  sign-in, OAuth, invitations or browser behavior. Revalidate after code or
  dependency changes; documentation-only edits do not require another full build.

## Deployment facts and boundaries

- Existing production: https://kalender-tau.vercel.app/; last verified September
  16 at revision `687cb35`. The overhaul has not been deployed or pushed.
- Agreed next target: a separate Vercel preview using development Clerk and the
  existing Neon database. Preview isolates code, **not data**: old production
  already shares Neon but uses another Clerk instance. Scope keys and owner IDs.
- Migration 0004 is already applied. September 17 read-only metadata checks
  confirmed migrations 0000–0004, reservations, the overlap constraint and
  `btree_gist`. Do not repeat migration or reseed merely for deployment.
- Keep Google OAuth in Testing mode. Confirm the Calendar host, Google test users
  and reconnection plan before live QA. Clerk booking testers and Google OAuth
  test users are separate lists.

## Unresolved access decision

The earlier plan called for publishing demo logins in the root README and linking
from the landing page. Neither is implemented. Publishing an **allowlisted**
login lets anyone send real Calendar invitations. The current gate has no
specific host or guest-recipient restriction.

Recommended, not yet accepted: separate disposable public exploration accounts
that are **not** allowlisted, plus private allowlisted booking testers. Exploration
accounts can still edit their own workspace; never share the connected Calendar
host's login. Anonymous public-page browsing already needs no credentials.
There is no read-only workspace role or simulated booking mode.

`npm run demo:create-testers` is assigned to the user and has not been run by the
agent. It reuses existing emails without changing or verifying their passwords,
and prints booking-allowlist configuration for every account. Do not treat its
output as proof of sign-in or as public exploration setup. Account inventory is
unverified; do not assume accounts are absent.

## Next session plan

1. Decide public exploration versus real-booking access using the boundary above.
   Then prepare the agreed accounts and verify sign-in when browser work resumes.
2. Confirm the Calendar host/test users and prepare preview-scoped Vercel/Clerk
   environment and callbacks. Keep shared-database implications explicit.
3. Obtain deployment approval and deploy the reviewed preview. Browser QA remains
   deferred until requested: cover landing, auth, onboarding, workspace, public
   profile/event, OAuth, confirmation and history on desktop and mobile.
4. For a real booking test, obtain action-time approval for recipient/time and
   separate cleanup approval. Record preview URL, configuration and QA evidence.
5. Decide promotion to production and the merge/push checkpoint after review.

## Read only when needed

- [Audit evidence, access review and booking reconciliation runbook](pre-deployment-audit.md).
- [Archived design decisions, phase plans and session history](archive/ui-overhaul-2026-09-17.md).
- [Owner accent theming ADR](../adr/0001-owner-scoped-accent-theming.md).

Maintain this handoff by replacing stale status, not appending session transcripts.
Keep detailed historical evidence in the archive or audit report.
