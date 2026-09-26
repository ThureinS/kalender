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
- Preview uses the matching development instance. Production uses live Clerk
  and shares Neon; its separate host/profile and release settings are in the
  [release checklist](release.md). No migration/reseeding for Preview.

## One-click visitor access

Set optional `KALENDER_DEMO_VISITOR_USER_IDS` to three distinct provisioned IDs,
in visitor-number order. Never include the host. Server configuration checks
both Clerk instance domain and matching host. This registry selects sign-in
targets; it does not limit who may book the demo host.

Each target needs private metadata `kalenderDemoVisitor: true` and
`kalenderDemoVisitorIndex: 0`, `1` or `2`. Live accounts must have external ID
`kalender-public-demo-visitor-N`, no email addresses and no linked external
accounts. Development targets may contain only their numbered test addresses.
Linked real identities, banned/locked accounts and changed markers fail closed.
The app's shared-visitor Calendar button shows guidance instead of connecting.

Landing buttons use a server-created, one-time ticket expiring after 60 seconds.
No ticket is logged/persisted; no host credentials or service keys go to the UI.
Existing signed-in identities are preserved. The panel is available in `demo`
or `disabled` mode, only with valid explicit configuration. Disabled mode keeps
all booking writes off. Provider reference:
[Clerk sign-in tokens](https://clerk.com/docs/reference/backend/sign-in-tokens/create-sign-in-token).

Production targets/settings are in the [release checklist](release.md). Ignored
live registry: `.clerk/production-demo-visitors.json` (mode 600). Existing local
visitors were marked for ticket access; Brave verified all three buttons returned
to Portfolio Review without password, OTP or Google authorization.

## Development password fallback

Three accounts already exist; do not recreate them:
`demo-tester-1+clerk_test@example.com` through
`demo-tester-3+clerk_test@example.com`. With the optional registry unset, matching
development demo mode shows email/password instructions. Use code `424242` if
prompted; Device Trust remains enabled. Original plain emails remain secondary.
See [Clerk test emails](https://clerk.com/docs/guides/development/testing/test-emails-and-phones).

The intentionally public fallback password lives in the
[root README](../../README.md#development-password-fallback) and
`server/demoVisitorAccess.ts`. Ignored credentials record:
`.clerk/demo-visitor-credentials.json` (mode 600). Rotate those three places
together. Never publish host credentials or service keys.

## Maintenance and recovery

- Provisioning is not routine testing. The development password-account helper
  `npm run demo:create-testers -- --help` rejects live keys and does not set ticket
  markers. Existing users are reused without changing/verifying passwords.
- If host shows Needs access, inspect scopes and perform read-only free/busy
  checks. Grant host scopes through Integrations, without disconnecting or
  adding Calendar scopes to global Google defaults.
- Demo submissions create real events/invitations. Use an owned guest inbox
  only for explicitly authorized invitation testing. September 26 local
  Calendar/booking/receipt test and cleanup passed; inbox delivery is unverified.
- New reservations have no account cap and a 500/host rolling 24-hour cap.
  Uncertain reservations count. Retry the original attempt and reconcile actual
  Calendar state before removing any uncertain reservation.
