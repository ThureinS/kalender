# Portfolio-demo pre-deployment audit — September 16, 2026

The audit continues the existing `ui-overhaul` working tree. Theme Lab removal
and earlier documentation changes are preserved. During the September 16 audit,
nothing was deployed, pushed, seeded, or migrated against Neon. No real invitation
has been sent. Hosting, Clerk and Google Cloud configuration are unchanged.

An existing deployment was confirmed after the audit: the portfolio links to
https://kalender-tau.vercel.app/, which returned HTTP 200 on September 16.
GitHub records a successful Vercel Production deployment on August 26 for
commit `687cb35` (`upgrade clerk for proxy support, fix v7 theme api`). Its
immutable deployment URL is
https://kalender-jwmrslzor-thureinss-projects.vercel.app.
The earlier handoff's “deployment has not started” wording referred too broadly
to the project. The current audit changes remain uncommitted and undeployed;
a subsequent September 16 Vercel inspection confirmed that production revision.
Hosting state was not rechecked in the September 17 browser-free catch-up.

The initial September 17 verification found two remaining release issues: a
lockfile/manifest mismatch and a plan to publish allowlisted tester credentials
that would give the public real-booking access. The follow-up repaired the
lockfile and cleared the dependency audit; the access decision remains pending.
Migration 0004 is now
independently confirmed present; schema readiness does not prove live booking works.

## Findings by severity

| Severity | Finding and impact | Resolution |
| --- | --- | --- |
| P1 — blocker | Database reads, profile helpers, booking persistence and Google API functions were exported from `use server` modules without caller authorization. A module-level directive defines an action boundary, not merely server-only execution. | Moved helpers into `server/queries` or server-only provider modules. Only six intended application mutations remain actions. Owner mutations derive identity from Clerk. The build-manifest check guards the public action allowlist. |
| P1 — blocker | Two requests could pass the same Calendar conflict check; a lost Google response or failed local insert could produce duplicate invitations or untracked meetings. | Forward-only migration `0004_booking_reservations.sql` adds durable owner-wide interval reservations with a PostgreSQL exclusion constraint. Reservation precedes Calendar mutation; UUID-derived Google IDs make retries idempotent. A booking is reported confirmed only after local persistence. Uncertain reservations stay blocked for reconciliation. |
| P1 — blocker | Booking submission accepted active private events. Client-shifted wall times were converted again on the server, stale schema initialization determined “future,” and single-slot busy checks had equal start/end bounds. | Require public active events, validate UTC instants against the current clock and a 60-day horizon, recheck saved windows and slot alignment, and query the entire duration plus buffers. Weekly availability uses the owner's timezone, including UTC date boundaries and DST. |
| P1 — blocker | Public submissions could send arbitrary real Calendar invitations with no demo access policy. | Default `KALENDER_BOOKING_MODE=disabled` permits browsing only. `testers` requires a signed-in Clerk ID listed in `KALENDER_DEMO_BOOKER_IDS`. The server enforces this independently of the disabled UI. Unrestricted anonymous booking is outside this demo release. **Configuration decision pending:** publishing credentials for allowlisted accounts gives everyone this real-booking capability; the recorded credential-publication plan needs reconciliation with the restricted-access intent. |
| P1 — blocker | The pinned Next.js release and several installed dependencies had published security fixes available. | Updated Next.js to 15.5.25, React/React DOM to 19.2.8, Drizzle ORM to 0.45.2, and compatible dependencies. Narrow PostCSS and esbuild overrides address remaining transitive advisories. **Lockfile repaired (September 17 follow-up):** all 10 root mismatches/missing entries are resolved. Compatible transitive updates clear four newly reported vulnerable packages; final clean installation and audit pass. See follow-up validation below. |
| P2 — correctness | Schedule timezone upsert committed before availability replacement, allowing partial updates on failure. | All schedule operations now use one Neon transaction batch, with the owner row upsert serializing edits. A forced insert failure regression verifies rollback of timezone and windows. |
| P2 — data safety | Demo replacement used separate delete/insert requests, so an error could leave partially replaced data. | Seed writes now commit as one transaction and refuse to replace an owner with booking reservations. Run seeding while demo writes are disabled. |
| P2 — correctness | A success URL containing only a date displayed “confirmed” without a booking, and rendered in the server's timezone. | Confirmation now requires an unguessable persisted booking ID scoped to its owner/event. It displays saved event details in the saved guest timezone. Receipt reads omit guest contact details and notes. Booking history uses the saved timezone too. |
| P2 — failure handling | Calendar HTTP-200 per-calendar errors and development OAuth failures could be treated as no conflicts. Raw provider messages could leak into logs or error text. | Busy lookup fails closed in every environment, including malformed responses. Provider calls have bounded timeouts. Booking errors return controlled messages and log only a request ID. Private routes now have a retry boundary. |
| P2 — boundary/configuration | `/book(.*)` also matched `/bookings` and `/booking-page` as public, although those pages separately checked identity. Environment examples had stale redirects and unused Google credentials. UTC failed profile validation. | Public matching is limited to `/book` and descendants. Clerk middleware establishes context for tester actions while public pages remain accessible. Corrected environment examples, ignored all secret environment files, loaded local environment for migration CLI, and centralized timezone validation including UTC. |
| P3 — quality/performance | Lint prompted interactively, no automated critical-flow suite existed, and booking pages generated a year of slots. | ESLint now fails non-interactively on warnings. Vitest uses disposable PostgreSQL/PGlite and mocked external APIs. Fixed actionable lint/type issues and unused imports. Slot generation is limited to 60 days; DST repeated slots carry timezone abbreviations. |

The action-boundary fix follows [Next.js data-security guidance](https://nextjs.org/docs/app/guides/data-security).
Framework patching follows the [August security release](https://nextjs.org/blog/august-2026-security-release).

## Architecture after the audit

- App Router Server Components own reads. Client forms import only authenticated
  mutations or the explicit tester-gated booking action. Client imports from
  query modules are type-only; `server-only` guards runtime imports.
- Events, availability and Booking Page mutations scope writes to the Clerk
  session. Public profile resolution only reads existing profiles; legacy
  `user_...` URLs no longer provision profiles from a visitor request.
- Kalender stores confirmed history as snapshots. Google remains the external
  calendar provider. Reservations cover all event types for one owner and
  survive process restarts and serverless concurrency.
- PostgreSQL and Google cannot share one transaction. The reservation plus
  deterministic provider ID makes uncertainty recoverable; it does not claim
  distributed atomicity. An external calendar edit between lookup and insert
  can still conflict; Google does not provide an atomic free/busy-and-insert API.
- Existing seeded history remains illustrative data. This change does not add
  cancellation, rescheduling, synchronization from Google, or automatic Google
  Meet conference creation. The location field remains descriptive text.
- Service secrets and private account credentials must stay out of Git. The
  recorded plan to publish disposable demo credentials is pending an access
  decision; do not publish real-booking tester credentials by assumption.
  Use Node 22.12+ within the Node 22 line and a synchronized npm lockfile.

## Database and retry runbook

Ensure the chosen database has migrations 0000–0004 before starting this
version. The selected preview target reuses the existing Neon database, already
shared by local development and the old production deployment; it is not isolated. Do not run `db:generate` as part of deployment.
Migration 0004 requires `btree_gist` and adds a GiST exclusion constraint;
its SQL is deliberately included in the migration because Drizzle does not
model exclusion constraints. Keep it when evolving the schema. Old databases
must have migrations 0000–0003 recorded before applying 0004.

Update (September 17, 2026): read-only metadata queries independently confirmed
all five recorded migration hashes match local SQL files, `bookingReservations`
has its positive-range check and owner-wide overlap exclusion constraint, and
`btree_gist` is installed. No migration needs repeating for this target. Booking
records and seed contents were not inspected in this catch-up. OAuth and real
booking behavior remain unverified.
The new table does not rewrite legacy bookings or pretend seeded history was
created in Google. Real pre-audit Calendar events are still included by the
primary-calendar free/busy check.

For a booking error, retry with the original details in the same form session.
The request ID stays stable. Do not change the details or create a new attempt
while the old outcome is uncertain. A browser reload does not retain that form's
request ID; contact the operator if an invitation may already have been created.

For operator reconciliation, inspect `bookingReservations` by the request ID
logged by the action. The Google event ID is that UUID with hyphens removed.
A reservation without a matching `bookings.id` is pending reconciliation, not
proof of a failed Google insertion. Reconnect the owner if needed and verify the
provider event. Complete local persistence from the saved reservation snapshot
when Google succeeded, or clear the reservation only after verifying that no
provider event exists and deciding the booking should be abandoned. Never expire
uncertain reservations automatically. Reservation payloads contain guest data;
apply the same access/retention controls as bookings.

The seed replacement script intentionally replaces owner data in one transaction
and refuses to proceed when that owner has reservations. Run it while booking
writes are disabled. Do not
use it to clean up real test bookings or pending reservations. Clean up controlled
QA bookings and their reservations together, after approval and Calendar checks.

## Validation

The release gate is `npm run check`: zero-warning lint, critical-flow tests,
typecheck, production build, and compiled action/retired-route checks.

Critical checks cover fresh migration replay; reservation overlap rejection;
private/past/off-grid/out-of-horizon submissions; exact UTC persistence; receipt
privacy; cross-owner and anonymous mutations; approved-tester enforcement;
Calendar outage and malformed response handling; deterministic provider retries;
local persistence failure; schedule transaction rollback; timezone/DST cases;
onboarding readiness; and destructive seed refusal.

The database tests run against disposable PGlite with `btree_gist`. Clerk and
Google calls are mocked. They do not prove live Neon permissions, Google OAuth,
email delivery, or browser behavior. Those checks remain in the deployment plan.

Historical September 16 audit results on Node 22.21.1 (not rerun during the
September 17 catch-up):

- `npm ci` — clean installation from the then-current working-tree lockfile succeeded.
- `npm audit` — zero known vulnerabilities, including development dependencies.
- `npm run lint` — passed with zero warnings.
- `npm test` — 26 checks passed across five suites.
- `npm run typecheck` — passed.
- `npm run build` — passed with all expected routes; Theme Lab absent.
- `npm run check:build` — intended action boundary and retired routes passed.
- `npm run db:generate` — no schema drift after the reservation migration.
- `node --check scripts/seed-demo.mjs` and `git diff --check` — passed.

The local npm 10 resolver initially failed when resolving newly added tooling.
A clean npm 11 resolution produced a matching lockfile; a subsequent ordinary
npm 10 `npm ci` succeeded at that time without a legacy-peer-dependency flag.
Some upstream tooling packages emit deprecation notices during installation;
these are distinct from ESLint warnings and the zero-vulnerability audit.

## September 17 catch-up verification

These are the initial catch-up findings; the dependency results are superseded
by the follow-up below.

- Current manifest comparison found 10 root dependency mismatches/missing entries:
  Drizzle, Next.js, React, React DOM, `server-only`, PGlite, ESLint,
  `eslint-config-next`, Vitest and esbuild. For example, Next.js is declared as
  `15.5.25` while the lockfile root still declares `15.4.10`. The earlier clean
  install and zero-vulnerability result cannot be applied to this checkout.
- `server/bookingAccess.ts` defaults to disabled and permits only signed-in IDs
  on the allowlist in `testers` mode. `server/google/googleCalendar.ts` sends
  invitations with `sendUpdates: "all"` to the submitted guest email. Publicly
  sharing an allowlisted login therefore shares real Calendar write capability.
- The tester helper reuses matching emails without changing or checking their
  passwords. The handoff reports it has not run; account inventory and sign-in
  were not checked here. Avoid claiming that accounts do not exist or that the
  supplied password works for a reused account.
- Live database metadata was verified as described above. No browser checks,
  account creation, data writes or full release checks were performed here.

## September 17 dependency repair and follow-up validation

Continued on `ui-overhaul` in the existing working tree, preserving previous
uncommitted changes. `package.json` was not changed by this follow-up. The
lockfile root now matches every dependency, development dependency and the Node
engine declaration; the Next.js and React pins remain 15.5.25 and 19.2.8.

Node 22.21.1 / npm 10.9.4 were used for clean installation and validation.
The sandbox initially could not resolve the npm registry; a network-enabled
retry reached it. npm 10 then failed lock resolution with
`Cannot read properties of null (reading 'edgesOut')`. npm 11.19.1 successfully
repaired the lock with `npm install --package-lock-only --ignore-scripts`.
No global npm upgrade or legacy peer-dependency flags were used.

The first successful `npm ci` exposed four vulnerable transitive packages in
`npm audit` (one critical, two high, one moderate). A compatible, lockfile-only
`npm audit fix` with npm 11, without `--force`, updated:

| Package | Initially installed | Final locked version |
| --- | --- | --- |
| `jws` | 4.0.0 | 4.0.1 |
| `qs` | 6.14.0 | 6.16.0 |
| `sharp` | 0.34.3 | 0.35.4 |
| `tar` | 7.4.3 | 7.5.22 |

- Final `npm ci --no-audit --no-fund` on npm 10.9.4: passed, 502 packages added.
- Separate final `npm audit --json`: passed, zero known vulnerabilities across
  all severities, including development dependencies.
- `npm run check`: passed zero-warning ESLint, all 26 tests across five suites,
  TypeScript, the Next.js production build and compiled action/retired-route
  checks. The build emitted non-failing Webpack cache serialization performance
  warnings. No application code needed changing for these checks.
- Native `sharp` smoke check: generated a 1×1 PNG in memory successfully.
- `git diff --check`: passed after documentation updates.

Installation still reports upstream deprecation notices for ESLint 9.39.5,
`node-domexception` and the two `@esbuild-kit` packages. Zero audit findings do
not mean these packages remain supported. `npm ls --depth=0` exits successfully
but labels two locked optional WASM dependencies (`@img/sharp-wasm32` and
`@emnapi/runtime`) extraneous on this macOS installation; native Sharp works.
Linux/Windows optional binary entries remain in the lockfile, but installation
on those platforms has not been exercised here.

These checks use disposable PGlite and mocked Clerk/Google APIs; they do not
verify real sign-in, Calendar authorization, invitations or deployed behavior.
No browser work, account creation, live database queries/writes, migrations,
seeding, external configuration changes, push or deployment occurred in this
follow-up. Earlier live schema verification remains historical evidence.

## Recorded decisions and remaining deployment work

### Public credentials versus real booking: code review, September 17

The follow-up reviewed the existing access path only; it did not repeat the
architecture audit or change the access policy.

- `server/bookingAccess.ts` permits booking only when the mode is exactly
  `testers` and the signed-in Clerk ID is allowlisted. Missing/other modes,
  an empty allowlist, anonymous visitors and unlisted users are denied.
- `server/actions/meetings.ts` checks that gate before processing the request.
  The allowlist authorizes the caller, not a particular host or guest email.
  An approved caller can submit for a public active event belonging to another
  owner if availability and Calendar requirements pass. There is no dedicated
  demo-host or guest-recipient restriction in this path.
- `server/google/googleCalendar.ts` creates events on the selected owner's
  primary calendar with `sendUpdates: "all"` and the submitted guest email.
  Publishing an allowlisted login therefore exposes real invitation sending;
  Google OAuth test-user membership is not a guest-recipient allowlist.
- A public account left **off** the booking allowlist cannot create meetings,
  but it is not a read-only workspace account. Authenticated event, profile and
  schedule actions still permit changes to that account's own data. A shared
  exploration account must be disposable and separate from the Calendar host
  and any private workspace. A truly read-only workspace demo would require
  additional implementation.
- `scripts/create-demo-testers.mjs` prints booking-allowlist configuration for
  every resulting account and suggests sharing credentials. It does not
  distinguish public explorers from private testers or verify reused passwords.
  Its output is not evidence of successful sign-in and should not be copied as
  a public exploration setup. Account creation remains assigned to the user.

Recommendation remains pending: keep real-booking testers and their passwords
private; use separate, disposable, non-allowlisted accounts if public workspace
exploration is wanted. Anonymous public-page exploration already needs no login.
Do not use the connected demo host as a shared public login. If public reviewers
must actually submit bookings, decide whether to implement simulated bookings or
explicit host/recipient restrictions before publishing credentials. Neither
feature currently exists. No credentials, accounts, environment values or landing
page links were changed by this review; the earlier publication plan is still
unresolved, not silently replaced by this recommendation.

Accepted choices from the September 17 handoff: a separate Vercel preview first,
reuse development Clerk and existing Neon, and a few dedicated tester accounts.
The preview isolates deployed code, not data. Production and development already
shared Neon at the earlier configuration inspection, but used different Clerk
instances; preview keys and owner IDs must match development Clerk.

The handoff also records publishing demo credentials and linking them from the
landing page. Keep that recorded choice visible, but resolve its interaction
with real booking before implementation. Recommended: public exploration
accounts plus separately allowlisted private booking testers. This recommendation
has not yet been approved as a change to the recorded plan.

Before deployment:

1. **Completed September 17 follow-up:** lockfile repair, clean installation,
   zero-vulnerability audit and full `npm run check`. Repeat validation if code
   or dependencies change before deployment.
2. Resolve public credentials versus real-booking access, then prepare accounts
   and verify sign-in. The user is assigned the account-creation step in the
   handoff; the catch-up does not run it.
3. Confirm the Calendar host account and Google test users, preview-scoped
   environment, Clerk callbacks and reconnection arrangements. Keep Google in
   Testing mode as agreed. Its Calendar-scope refresh tokens normally expire
   after seven days, per [Google's OAuth documentation](https://developers.google.com/identity/protocols/oauth2#expiration).
4. Obtain explicit deployment approval. After deployment and when browser work
   resumes, test the public URL in desktop/mobile browsers. Approve a specific
   booking recipient/time at action time and separately approve cleanup.

No deployment action is included in this audit or catch-up. See the
[current handoff](README.md#next-session-plan) for the ordered next steps.
