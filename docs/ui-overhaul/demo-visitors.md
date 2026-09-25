# Demo configuration and visitor runbook

Read only for auth/demo configuration work. Current results: [handoff](README.md).

## Configuration

- Development Clerk: `included-garfish-63.clerk.accounts.dev`.
- Host: `accutility778@gmail.com`, `user_3Im9W7uEWVIJYnoULDo0EIvCM23`.
- Existing Google connection: `idn_3Im9WB1WM5Uocqw52qWLZ74GG9s`.
- Ignored `.env.local`: `KALENDER_BOOKING_MODE=demo` and
  `KALENDER_DEMO_HOST_CLERK_USER_ID` equal to the host ID above. Visitor IDs are
  not an allowlist. Missing/wrong host configuration blocks booking writes.
- Clerk Google defaults: `openid`, `userinfo.email`, `userinfo.profile` only.
  Host Integrations explicitly requests `calendar.events` and
  `calendar.events.freebusy` via `additionalScopes`. Do not add these globally.
- Preview must use the matching development instance. Production has another
  Clerk instance but shares Neon; no migrations/reseeding for preview.

## Existing visitor logins

Three accounts already exist; do not recreate them:
`demo-tester-1+clerk_test@example.com` through
`demo-tester-3+clerk_test@example.com`. Email/password sign-in is enabled.
Use email code `424242` if prompted; Device Trust remains enabled.
Original plain emails remain secondary and do not provide test-code behavior.
See [Clerk test emails](https://clerk.com/docs/guides/development/testing/test-emails-and-phones).

Visitor steps and the intentionally shared demo password live in the
[root README](../../README.md#try-the-local-demo) and landing `/#demo-access`.
Use event-page Login to return to the same event; generic Login falls back to
Overview. Visitors need neither onboarding nor their own Calendar connection.

Local IDs/password record: `.clerk/demo-visitor-credentials.json` (ignored, mode
600). If rotating, update that record, `server/demoVisitorAccess.ts` and root
README together. Never publish host credentials or service keys.

## Maintenance and recovery

- Account creation is not part of routine testing. For separately authorized
  provisioning, inspect `npm run demo:create-testers -- --help`; helper defaults
  to three test addresses and rejects non-development keys. Existing users are
  reused without changing/verifying passwords. Historical command/evidence:
  [archive](archive/ui-overhaul-2026-09-21.md#visitor-setup-snapshot-before-compaction).
- If host shows Needs access, inspect approved scopes and perform read-only token/
  free-busy checks. User can grant Calendar access through Integrations without
  disconnecting. Latest recovery passed; sign-in durability is still in backlog.
- Demo submissions create real Calendar events/invitations. No meeting occurs.
  Guest form email is independent of login email; use an owned inbox only when
  invitation testing is explicitly authorized. No actual submission is approved.
