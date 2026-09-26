# Kalender: current handoff

Updated September 26, 2026. Operating rules: `AGENTS.md`.

## Current state

- Branch `main`. UI/responsive overhaul and architecture audit are complete;
  do not repeat the audit. Burmese responses; announce Brave use.
- User approved release execution. Reviewed changes committed as `f418e9a`;
  [PR #2](https://github.com/ThureinS/kalender/pull/2) passed Preview and merged
  as `71fc39d`. First Production deploy passed with booking disabled; demo
  deploy `9MuVtVjNkP2y8uMpDdDFeGTDYmsz` on `5733a3f` is Ready at the
  [stable URL](https://kalender-tau.vercel.app/).
  The obsolete Clerk `SignedIn` workspace error is fixed.
- All three live visitor buttons returned to Portfolio Review without password,
  OTP or Google grant. Clerk needs an identifier despite successful backend
  ticket creation: existing live visitors now have backend-assigned usernames
  `kalender_demo_visitor_1` through `kalender_demo_visitor_3`. Global username
  sign-in remains disabled; no emails/passwords/Google links were added.
  Visitor Integrations shows guidance. [Visitor runbook](demo-visitors.md).
- Host Calendar grant refreshed through Integrations. Google showed both
  Calendar permissions already granted; Clerk now reports events and free/busy.
  Read-only free/busy returned 200 without per-calendar errors; workspace
  shows setup 4/4 and Ready to share. Identity-only host re-login restored both
  scopes automatically without another consent screen.

## Production and validation

- Production-only `KALENDER_BOOKING_MODE=demo` is deployed; required release
  tasks and stable-URL QA are complete. Separate live host/profile
  and three visitor IDs are retained. Live keys/shared Neon unchanged; no
  migration, replacement seed, account reprovisioning or Preview exposure.
- [Protected Preview](https://kalender-git-ui-overhaul-thureinss-projects.vercel.app/)
  passed on `f418e9a`, development Clerk/shared Neon; internal QA only.
- Selected cap: no per-account limit, 500 new reservations per host per rolling
  24 hours. Atomic admission, uncertain-attempt counting and original retries
  remain. Missing Calendar access shows controlled unavailable state.
- Node 22.21.1 release gate passed: 85 tests/8 suites, lint, types, production
  build and action boundaries. Reuse unless application changes. Release
  execution changed only external config and docs. Live 375px/1024px Storefront,
  App Shell and active Booking Page had no horizontal overflow. Local dev runs.
- Anonymous booking confirmation stayed blocked with filled details; signed-in
  visitor reached confirmation readiness. Bangkok 8 PM converted to GMT 1 PM;
  no booking submitted. Brave was left signed out at the visitor panel.
- Prior authorized Calendar/booking/timezone/receipt test and cleanup passed.
  Do not repeat it. A newly authorized distinct-guest Production invitation test
  confirmed the booking and Calendar attendee; event, booking and reservation
  cleanup passed. The user's inbox screenshot confirms both invitation and
  cancellation delivery; this test is complete. Do not repeat it.

## Next steps

- Optional follow-up: add the stable Production link to the CV when supplied.
  Any further invitation test needs an exact owned recipient and explicit
  test/cleanup approval.
- [Release checklist](release.md); [unfinished work](backlog.md);
  [September 26 evidence](archive/ui-overhaul-2026-09-26.md).
- CV later; stable Production is its destination. Rollback: disable demo mode
  and redeploy. Keep secrets out of Git and preserve unrelated shared data.
