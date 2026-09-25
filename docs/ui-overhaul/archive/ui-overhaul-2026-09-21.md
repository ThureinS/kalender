# Completed work and evidence — September 21, 2026

Historical reference only. Do not load this file during routine startup.
[Current handoff](../README.md) and [open backlog](../backlog.md) supersede all
status, blockers and next-step instructions in the snapshots below.

## Final outcomes at archival

- UI overhaul phases 1–8 and architecture audit implemented; no repeat audit.
- Guest Google login requests name/email only; user confirmed booking return.
- Three shared visitor logins work; README and landing instructions prepared.
- Visible loading copy removed; Lime progress, skeletons and accessible status kept.
- Auth contrast and return routing fixed; pre-submit booking form user-verified.
- Google transport avoids DEP0108; native fetch keeps timeout/no-store/no retries.
- Workspace now defaults dark, with a saved light/dark choice. Latest user
  screenshot confirms dark Integrations renders; toggle persistence QA is pending.
- Host temporarily returned identity-only scopes / Calendar 403 after sign-in.
  User reauthorized through Integrations. Latest screenshot shows Connected.
  Subsequent read-only check confirms original host and external-account IDs,
  both Calendar scopes, token retrieval, primary free/busy HTTP 200, valid busy
  array and no calendar errors. Recovery supersedes the blocker in the snapshot.
  Persistence across another ordinary sign-in remains unverified; cause unknown.
- Latest code gate: Node 22.21.1, npm run check passed (41 tests / six suites,
  lint, types, production build and compiled checks). Eight terminal theme
  bootstrap cases passed. Fresh dev restarted; homepage/login HTTP 200.
- No real booking/invitation, deployment, push, migration or reseed performed.

## Handoff snapshot before compaction

The following preserves detailed implementation and earlier validation evidence.
Its earlier "Needs access" state and next-session plan are historical.

# Kalender UI overhaul handoff

Read this file first for ongoing `ui-overhaul` work. It is the current source of
truth; load detailed evidence or history only when relevant to the task.
Updated September 21, 2026.

## Current handoff state

- Branch: `ui-overhaul`; latest commit `914bf0e` (compact handoff), following
  validated implementation `f810c64`. Demo-access/loading work is **uncommitted**;
  preserve the existing working tree, including untracked components/loading files.
- Communicate with the user in Burmese and proceed one step at a time. Before
  agent browser-app use, explain why and wait for explicit permission. Terminal
  and web search/documentation tools are allowed; the user clarified this.
- UI phases 1–8, onboarding/auth, seed tooling and booking history are implemented;
  Theme Lab is retired. Identity: Midnight Storefront / Lime. At the user's
  request, App Shell now defaults to dark with a persistent light/dark toggle
  beside the avatar (desktop/mobile). The previous forced Daylight shell is
  removed. `next-themes` applies the saved preference before paint, including
  portal surfaces; public/auth routes stay Midnight without overwriting it.
  New theme browser QA remains user-run/deferred.
- Public demo: `/book/demo-strategy-studio`; seed contents were not refreshed.
- New demo access implementation is in the working tree: writes default to
  disabled; `demo` mode permits any signed-in caller only for the configured
  `KALENDER_DEMO_HOST_CLERK_USER_ID`. Missing host IDs and retired `testers` mode
  fail closed. Event ownership is checked server-side, including forged requests.
- Reservations prevent owner-wide overlap; deterministic Google event IDs support
  retries; success requires a stored receipt.
- The architecture audit is implemented and validated. Do not repeat it.
- Site-wide loading feedback uses shared `NavigationLink` / `useNavigationRouter`,
  Next's pending link state and React transitions. Root/private loading skeletons
  and public-booking fallback share one top bar; reduced motion is respected.
  Visible “Loading page…” text has been removed from `components/RouteLoading.tsx`;
  the Lime bar, skeletons and screen-reader status in `NavigationProgress` remain.
- The user's `1 Issue` was Node `DEP0108` (`zlib.bytesRead`). A traced event-page
  request reproduced it inside Next's development `renderDebugModel`, inspecting
  the Google SDK's node-fetch response stream. Calendar requests now use Gaxios's
  supported native-fetch option with `cache: "no-store"`; the 15-second timeout
  and disabled automatic retries remain. No warning suppression or dependency
  upgrade was added.
- Auth-page contrast fixes use Clerk's current `colorForeground`,
  `colorMutedForeground` and `colorInputForeground` variables, with scoped OTP
  text/caret and badge CSS. The user reported invisible typed codes and a dim
  Google "Last used" badge; the user confirmed the fix works.
- Booking return routing now sets explicit destinations on both public-header
  auth buttons and the booking modal, including sign-in/sign-up switches.
  `AuthPageShell` no longer mounts the unconditional `/overview` redirect that
  competed with Clerk. Normal login/signup fallbacks remain Overview/onboarding.
  The user confirmed return to Portfolio Review after the header Login retry.
  The in-form modal worked earlier; it has not been separately rerun after this fix.
- Local demo mode is enabled in ignored `.env.local` after live read-only Calendar
  verification. Three visitor accounts were created with explicit user permission
  on September 20. No bookings, push or deployment were performed.
  The user is testing sign-in manually; agent browser QA remains deferred.
  Git commits are local.
- Visitor instructions and the intentionally shared demo-only credentials are
  now in the root README and landing page (`/#demo-access`) after user approval.
  The panel is limited to demo mode with the verified host and development Clerk
  instance. It directs visitors through the event page's Login action. No host
  credential or service key was published; nothing was pushed or deployed.

## Verified checks

September 21, Node 22.21.1 / npm 10.9.4:

- `npm run check`: zero-warning lint, 41 tests in six suites, typecheck,
  production build and compiled action/retired-route checks all pass.
- Host/caller enforcement and invitation regressions pass. Full checks were rerun
  after adding persistent workspace dark/light mode; real-SDK transport tests cover request
  auth/body, no-store and failure without retries. Helper syntax/`--help`,
  production-key rejection before network access, and `git diff --check` pass.
  Dev was stopped before this build and restarted afterward with fresh output.
- Eight server-rendered theme bootstrap checks passed: dark default, stored
  light preference on workspace/nested routes and forced dark on public/auth
  routes. Theme visual/toggle QA remains deferred; no agent browser was used.
- Demo panel configuration checks passed: matching development instance/host
  displays access; disabled mode, another host, live keys and another instance
  hide it. Fresh-dev homepage HTTP 200 includes all three visitor emails, the
  intended demo password/code and event link. Visual/browser QA of the new panel
  remains pending. No new account or Calendar changes were made.
- Restarted dev on port 3000 with fresh `.next` output after preserving the
  validated production build outside the repo. With `--trace-deprecation`, the
  same Portfolio Review request now returns HTTP 200, booking form and live
  availability, with no `DEP0108` in server output or streamed HTML. The separate
  Clerk `createRouteMatcher` deprecation remains in terminal logs. Earlier
  homepage/demo-profile HTTP checks passed. The user confirmed the red issue
  badge is gone after refresh; no inbox-delivery QA was performed.
- September 17 clean install and zero-vulnerability audit remain the latest
  dependency checks; package manifests/lockfile are unchanged since that run.
- Tests mock Clerk/Google and use disposable PGlite. They do not prove real
  sign-in, OAuth, invitations or browser behavior. Revalidate after code or
  dependency changes; documentation-only edits do not require another full build.

## Deployment facts and boundaries

- Production: https://kalender-tau.vercel.app/, last checked September 16 at
  `687cb35`. Overhaul is neither deployed nor pushed.
- Next target: separate Vercel preview with development Clerk and existing Neon.
  Preview isolates code, **not data**; production shares Neon but uses another
  Clerk instance. Scope keys/owner IDs. Keep Google OAuth in Testing mode.
- Migrations 0000–0004 and reservation constraints were verified September 17.
  Do not migrate/reseed for deployment. Google OAuth test users are separate
  from Clerk visitor accounts.

## Demo access policy and configuration

- Dedicated host `accutility778@gmail.com` was verified via development Clerk on
  September 19 as `user_3Im9W7uEWVIJYnoULDo0EIvCM23`; its email is verified and
  Google account reports both Calendar scopes. That ID is now set locally as
  `KALENDER_DEMO_HOST_CLERK_USER_ID`; `KALENDER_BOOKING_MODE=demo` is now set locally.
- After user reauthorization on September 19, Clerk token retrieval succeeded and
  Google free/busy returned HTTP 200 with valid primary-calendar data. The prior
  token-retrieval blocker is resolved. No event/invitation was created to verify
  writes or inbox delivery. Verify IDs separately if the Clerk instance changes.
- September 21 supersedes that host-readiness result: after host sign-in, the
  user's Integrations screenshot shows "Needs access". Read-only Backend API
  checks confirm the same host/external-account IDs but identity-only scopes on
  both account and token; primary-calendar free/busy now returns HTTP 403
  `PERMISSION_DENIED`. No connection was removed or authorization changed by the
  agent. The host needs explicit Calendar authorization through Integrations;
  preserve identity-only guest defaults and the existing `additionalScopes` flow.
- September 20: auth-code inspection found Calendar scopes only in the explicit
  connect/reauthorize flow. The user's Clerk screenshot confirmed both Calendar
  scopes were also configured globally. The user removed them and saved; the
  follow-up screenshot shows only `openid`, `userinfo.email` and `userinfo.profile`.
  Development Clerk domain: `included-garfish-63.clerk.accounts.dev`.
- After that change, read-only API checks confirmed the same host/external account
  still has both Calendar scopes; token retrieval and primary-calendar free/busy
  succeeded (HTTP 200, no calendar errors). `additionalScopes` and
  `lib/setup-readiness.ts` are unchanged. September 21 user screenshots show a
  separate Google guest signed in and returned to Portfolio Review, with
  Integrations showing "Needs access" / "Grant Calendar Access". This confirms
  login works without full host Calendar access. The user then confirmed Google
  requested only name/email, with no Calendar permission. Guest consent and
  booking return pass this manual check; first-time grant history is unknown.
- User screenshot also confirms the signed-in visitor selected a date/time and
  reached the guest-details form and confirmation section without submitting.
- Publish separate visitor logins, never the connected host's login. Public pages
  remain anonymously browsable; submitting a booking requires sign-in.
- Demo notices cover the host profile, event list/flow, empty availability and
  receipt. New Calendar events have `[Demo]` titles and a no-meeting disclaimer.
- Enter one's own real email in the form to test a Google Calendar invitation,
  even with a shared demo login. Guest email is independent of login email.
  Google receives `sendUpdates: "all"`; no mailing service or synthetic-address
  suppression was added. Receipts do not claim inbox delivery was verified.
- This policy does not verify guest-email ownership or rate-limit each visitor.
  Public trial access can consume host slots and send real invitations; account
  sign-in and the designated-host boundary are not an anti-abuse limit.
- September 20: three visitors were created after explicit user authorization.
  Plain `@example.com` login reached Device Trust but had no inbox. The same
  accounts now have verified primary emails `demo-tester-1+clerk_test@example.com`
  through `demo-tester-3+clerk_test@example.com`; original emails remain secondary.
  IDs/passwords are unchanged and all three passed Backend API `verifyPassword`
  again. No Google connections. Use the test addresses with development email
  code `424242` per Clerk docs; Device Trust was not disabled. The user's retry
  screenshot shows authenticated return to `/book/demo-strategy-studio/portfolio-review`
  (avatar visible, sign-in prompt gone); the account email is not visible in that
  screenshot. The user confirmed testers 2 and 3 can also sign in. Following the
  return-routing fix and header Login retry instructions, the user confirmed
  arrival at `/book/demo-strategy-studio/portfolio-review`.
  Credentials and IDs are in
  Git-ignored `.clerk/demo-visitor-credentials.json` (mode `600`). Helper defaults
  now use `+clerk_test@example.com` and reject non-development keys. Visitor
  credentials were added to local README/landing source on September 21 with user
  approval; do not recreate accounts. Follow
  [demo visitor setup](../demo-visitors.md).

## Next session plan

1. Visitor login instructions are prepared in README and `/#demo-access`. All
   three visitor logins and corrected header return to Portfolio Review are
   user-confirmed. The new panel's visual QA and the in-form modal's post-fix
   recheck remain deferred to the user or explicit browser permission. Follow
   [the visitor workflow](../demo-visitors.md).
2. Guest Google login/booking return and name/email-only consent are confirmed.
   Host Calendar access is now a blocker (403, identity-only token). User should
   use **Grant Calendar Access** in host Integrations, then run a read-only
   recheck. Do not disconnect the account or restore global Calendar scopes.
   Verify it remains authorized across ordinary host sign-in afterward; the
   cause of the reduced scopes is not established. No booking/invitation test.
3. Run `npm run check` after code changes. Verify dev-server state, stop it before
   builds and restart with fresh dev output (Next 15 shares `.next`). Keep local
   host/mode settings out of Git.
4. Agent browser QA is deferred until requested. Do not submit real bookings, send
   invitations or clean up live data without action-time approval. No deployment
   or push yet. Later: preview configuration, deployment approval, desktop/mobile
   QA, then a promotion/merge decision. Do not repeat the architecture audit,
   migrations or demo seed. The user changed Clerk's default Google scopes;
   the agent created only the three explicitly authorized visitor accounts.

## Read only when needed

- [Audit evidence, access review and booking reconciliation runbook](../pre-deployment-audit.md).
- [Archived design decisions, phase plans and session history](ui-overhaul-2026-09-17.md).
- [Owner accent theming ADR](../../adr/0001-owner-scoped-accent-theming.md).

Maintain this handoff by replacing stale status, not appending session transcripts.
Keep detailed historical evidence in the archive or audit report.

## Visitor setup snapshot before compaction

Historical setup and account-creation evidence; use the current runbook for work.

# Demo visitor login setup

The user authorized terminal account creation on September 20; the three visitor
accounts below now exist. Do not share the Calendar host's credentials.
The user is running browser sign-in QA manually. Agent browser use requires
advance permission; terminal and web documentation tools are allowed. Real
bookings/invitations still require separate authorization.

## Prerequisites

1. Select **Kalender → Development** in Clerk. Local keys currently target
   `included-garfish-63.clerk.accounts.dev`; verify the instance again for a preview.
2. In **Configure → SSO connections → Google**, keep only `openid`,
   `https://www.googleapis.com/auth/userinfo.email` and
   `https://www.googleapis.com/auth/userinfo.profile` as default scopes.
   The user saved this configuration on September 20. Keep custom OAuth credentials
   unchanged; hosts request Calendar access explicitly through Integrations.
3. September 20 read-only Frontend API inspection confirmed email and password
   are enabled. No further authentication-setting change is indicated now.
   The user's browser attempt with the original plain email reached Device Trust
   new-device verification and could not finish without an inbox.
4. The helper now defaults to `demo-tester-N+clerk_test@example.com` and refuses
   non-development secret keys. Clerk's documented test-email pattern accepts
   `424242` for email-code verification in development test mode, including
   new-device verification. Device Trust settings remain unchanged. See
   [Clerk test emails](https://clerk.com/docs/guides/development/testing/test-emails-and-phones)
   and [Clerk's development test-user recipe](https://github.com/clerk/skills/blob/main/skills/core/clerk-cli/references/recipes.md#test-users-development-only).

## Created accounts and manual helper usage

Created September 20 in development Clerk after explicit user authorization:

- `demo-tester-1+clerk_test@example.com`
- `demo-tester-2+clerk_test@example.com`
- `demo-tester-3+clerk_test@example.com`

These verified primary emails were added to the same three accounts; user IDs
and passwords are unchanged. Original plain `@example.com` addresses remain as
secondary emails; use the test addresses above for login. All three passed Clerk
Backend API `verifyPassword` again and have no Google external account. Following
the tester-1 retry instructions, the user's screenshot shows an authenticated
return to Portfolio Review (avatar visible, sign-in prompt gone). The screenshot
does not display the account email. The user confirmed testers 2 and 3 also
sign in. The auth shell's competing Overview redirect was removed and booking
header/modal return URLs are now explicit. The user confirmed the subsequent
header Login retry returned to Portfolio Review. The
Next.js `1 Issue` was traced to `DEP0108` in development debug serialization;
the Calendar transport fix is tracked in the current handoff. The shared random
demo-only password, test code and user IDs are in
`.clerk/demo-visitor-credentials.json` (Git-ignored, file mode `600`). On September
21, after user-confirmed sign-in and explicit authorization, the visitor emails,
shared demo-only password and test code were added to the root README and landing
page. Host credentials and service keys remain private.

There is no need to recreate these accounts. For a deliberate manual helper run
from the repo in zsh, use the existing password from the local credential file.
The prompt hides input and avoids putting it in shell history:

```zsh
nvm use
npm run demo:create-testers -- --help
read -rs 'KALENDER_DEMO_TESTER_PASSWORD?Demo visitor password: '
echo
export KALENDER_DEMO_TESTER_PASSWORD
KALENDER_DEMO_TESTER_EMAIL_DOMAIN=example.com KALENDER_DEMO_TESTER_CONFIRM=create-demo-testers npm run demo:create-testers
unset KALENDER_DEMO_TESTER_PASSWORD
```

The helper loads `.env.local`. Its default count is three; optional
`KALENDER_DEMO_TESTER_COUNT` and `KALENDER_DEMO_TESTER_EMAIL_DOMAIN` override that.
Matching accounts are reused without changing or verifying their passwords.
Use a unique demo-only password that satisfies Clerk's password checks.

## Verification and visitor instructions

For the user's manual retry, close the old sign-in modal, reopen **Sign in**, and
enter the full `+clerk_test` email above. Use the existing password. If an email
code is requested, enter `424242`; the old plain-email attempt does not gain this
test-code behavior. Do not submit a booking.

All three visitor logins and the corrected header **Login** return flow have now
been confirmed by the user. The booking form **Sign in** modal worked earlier;
it has not been separately retested after the redirect fix.
Open `/book/demo-strategy-studio`, choose an event and use its **Sign in** action;
that action returns to the same event after authentication. Check the return
route without submitting a booking. Visitors do not connect Google Calendar or
complete host onboarding. The user's September 21 screenshots confirm a selected
date/time and visible guest-details form without submission. A separate Google
guest also reached Portfolio Review while Integrations showed "Needs access".
The user then confirmed Google requested only name/email and no Calendar
permission. This guest login/return check passed; first-time grant history is
unknown. No host Calendar connection was changed.

Visitor instructions are available at `/#demo-access` while signed out and in
the root README. The landing panel appears only for `demo` booking mode, the
verified host ID and the matching development Clerk instance. Its button opens
Portfolio Review; visitors should use that event page's **Login** action to
preserve the return destination. Generic `/login` still falls back to Overview.
The shared credentials are intentionally public in local source; no push or
deployment has occurred. If credentials are rotated later, update
`server/demoVisitorAccess.ts`, the root README and the ignored local record.

Local `KALENDER_BOOKING_MODE=demo` and the dedicated host ID are already set.
Visitor IDs are not an allowlist and must not replace the host ID. The booking
form's guest email is independent of the login email. If real invitation testing
is later authorized, use the tester's own real inbox; this workflow does not
authorize booking, invitation, migration, reseed, push or deployment actions.

## September 24: host Calendar sign-in durability

Development Clerk Google defaults were changed to identity scopes only. Guest Google
login requested name/email, while the host Integrations button retained explicit
`calendar.events` and `calendar.events.freebusy` scopes. Sign-out/sign-in initially
replaced the existing host's token with identity-only scopes and yielded free/busy
HTTP 403, consistent with Clerk's documented per-user OAuth behavior. No external
account was disconnected or replaced.

After a host manually regranted the same Calendar scopes, Kalender recorded the
verified Google external-account ID in Clerk public metadata. Browser-side Clerk
metadata stayed stale across a later sign-in, so recovery now checks the authenticated
server record once before deciding whether to reauthorize. The agent then repeated
host sign-out/sign-in in the local in-app browser. Integrations showed Connected for
the original account, both required scopes were present, and a read-only primary
free/busy request returned HTTP 200. No booking/invitation was submitted.

`npm run check` passed with Node 22.21.1: 56 tests in seven suites, lint,
types, build and compiled-action gate. Dev was stopped for the build and restarted
with a fresh `.next` output. No deployment, push, migration or reseed occurred.
