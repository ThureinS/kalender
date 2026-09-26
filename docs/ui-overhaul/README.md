# Kalender: current handoff

Updated September 26, 2026. Operating rules: `AGENTS.md`.

## Current state

- Branch `main`. UI/responsive overhaul and architecture audit are complete;
  do not repeat the audit. Burmese responses; announce Brave use.
- User approved release execution. Reviewed changes committed as `f418e9a`;
  [PR #2](https://github.com/ThureinS/kalender/pull/2) passed Preview and merged
  as `71fc39d`. Production deployment `8JqWVpNZevgqXgqzGm3KriGCo14M` is Ready
  at [stable URL](https://kalender-tau.vercel.app/) with booking disabled.
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
  shows setup 4/4 and Ready to share.

## Production and validation

- Production-only `KALENDER_BOOKING_MODE=demo` is saved for the next deployment.
  Final demo deployment and stable-URL QA are pending. Separate live host/profile
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
  App Shell and paused Booking Page had no horizontal overflow. Local dev runs.
- Prior authorized Calendar/booking/timezone/receipt test and cleanup passed.
  Do not repeat it. Distinct guest inbox delivery is optional/unverified.

## Next steps

- Deploy the demo setting and verify anonymous/signed-in booking flow without
  submitting another real booking. Update this handoff and archive evidence.
- [Release checklist](release.md); [unfinished work](backlog.md);
  [September 26 evidence](archive/ui-overhaul-2026-09-26.md).
- CV later; stable Production is its destination. Rollback: disable demo mode
  and redeploy. Keep secrets out of Git and preserve unrelated shared data.
