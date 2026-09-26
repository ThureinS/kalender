# Kalender: current handoff

Updated September 26, 2026. Operating rules: `AGENTS.md`.

## Current state

- Branch `ui-overhaul`; September 26 release preparation is uncommitted.
  UI/responsive overhaul and architecture audit are complete. Do not repeat
  the audit. Burmese responses; announce Brave use.
- User selected option 10: **no account cap, 500 new reservations per host per
  rolling 24 hours**. Atomic admission, uncertain-attempt counting and original
  retry ownership remain. Calendar failures show controlled unavailable state.
- Three local shared visitor buttons now use short-lived Clerk tickets. Brave
  verified each returned to Portfolio Review without password, OTP or Calendar
  grant. Shared visitor Calendar controls show guidance. Maintainer setup:
  [demo runbook](demo-visitors.md); public instructions in root README.
- Authorized local Calendar/booking/timezone/receipt test and cleanup passed.
  Event deleted, booking canceled, reservation removed, slot verified free.
  Inbox delivery is unverified: recipient equals organizer; Gmail had no match.

## Hosting and Production preparation

- [Protected Preview](https://kalender-git-ui-overhaul-thureinss-projects.vercel.app/)
  stays browse-only on `3f70d04`, development Clerk/shared Neon. No public access
  exception. Optional internal QA; CV destination will be stable Production.
- [Production](https://kalender-tau.vercel.app/) still runs old `main` `687cb35`;
  its workspace fails on obsolete Clerk `SignedIn`. This branch fixes it.
- Live keys/shared Neon retained. Production-only redirects, host/profile and
  three visitor IDs are saved for the next deployment; booking mode disabled.
  Separate live profile added without replacing development data. Three live
  visitors have no emails/passwords/Google links; backend ticket creation and
  revocation passed. Live browser flow awaits deployment.
- Google defaults are identity-only, saved in Clerk dashboard. Host grant still
  lacks free/busy; additional host access needs updated Integrations after
  deployment. Details: [release checklist](release.md).
- No merge, Production deployment, migration, replacement seed or Preview exposure.

## Validation and next steps

- Final September 26 Node 22.21.1 `npm run check` passed: 85 tests/8 suites,
  lint, types, production build and compiled action boundaries. Mobile 375px
  and desktop 1024px visitor layouts had no horizontal overflow. Docs links and
  diff checks passed. Dev restarted with fresh `.next`; secret pull removed.
- Resume review complete: changes remain uncommitted/unpushed; GitHub branch
  heads match the handoff, no open PR, dev running. Release diff and 22 local
  documentation links checked. User approved commit/merge/Production deployment.
- Follow the [release checklist](release.md). Reuse the passed gate unless app
  changes require another check. Do not reprovision accounts or repeat the
  completed booking test. Announce Brave before using it.
- After approval, commit/merge/deploy with booking disabled. Verify live visitor
  flow, grant/check host Calendar access, enable demo mode and run stable-URL QA.
  CV later. Distinct guest inbox delivery remains optional/unverified.
- [Backlog](backlog.md) lists unfinished work only;
  [September 26 evidence](archive/ui-overhaul-2026-09-26.md) holds session detail;
  [Preview sheet](preview.md) covers protected branch QA.

Keep this file under 450 words. Preserve unrelated data and keep secrets out of Git.
