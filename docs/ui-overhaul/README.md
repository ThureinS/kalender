# Kalender: current handoff

Updated September 25, 2026. Operating rules: `AGENTS.md`.

## Current state

- `ui-overhaul`, HEAD `914bf0e`; extensive uncommitted/untracked work. Preserve
  it. No Git push or production promotion. Local dev runs on port 3000.
- UI overhaul, theme toggle, loading feedback and visitor demo are implemented.
  The architecture audit is complete; do not repeat it.
- Local demo is enabled for the designated host only. Three shared visitor
  logins, booking-page return and the pre-submit form were user-confirmed.
  Instructions: `/#demo-access` and root README. Visitors need no Calendar
  permission.
- Host `accutility778@gmail.com` grants Calendar access through Integrations.
  September 24 agent browser sign-out/sign-in returned to **Connected** on the
  unchanged account; Calendar scopes and primary free/busy HTTP 200 were
  verified. No booking or invitation was submitted.

## Preview and validation

- Protected browse-only [Vercel Preview](https://kalender-foeqgfps5-thureinss-projects.vercel.app/)
  is **Ready**. It was deployed directly from this working tree to the existing
  `kalender` project, with one-off development Clerk/database overrides,
  `KALENDER_BOOKING_MODE=disabled`, and no demo host ID. The variables were
  attached to this deployment only; project-level branch variables were not
  saved. Vercel Authentication redirects unauthenticated visitors.
- Responsive fixes cover landing Workspace, public profile/event form,
  App Shell navigation, and Booking Page editor. Local QA covered
  320, 375, 768, 1024 and 1280 px. The Preview was checked at phone/tablet/
  desktop widths, including demo account sign-in, Overview and Booking Page.
  Paused copy is visible and confirmation disabled. No page overflow was found.
- September 25 Node 22.21.1 `npm run check` passed once after the fixes: 56
  tests, lint, types, build and compiled action checks. Dev was restarted with
  fresh `.next` output. Production `main` revision `687cb35` still serves the
  older UI at `kalender-tau.vercel.app`.
- No real booking, invitation or inbox-delivery test. Preview shares the Neon
  database with existing production, while using a different development Clerk
  instance. No migration or reseed. See [preview review sheet](preview.md).
- Burmese responses. Explain before Brave use. Preserve working-tree data and
  keep secrets out of Git.

## Next session plan

1. Before any Git push, create safe branch-specific Preview variables or an
   equivalent isolated Git deployment path. Existing Clerk/database project
   variables apply to all environments; a raw `ui-overhaul` push could inherit
   production values. See [preview review sheet](preview.md).
2. Decide separately whether to enable live demo bookings or promote the UI to
   production. Real booking/invitation tests need a chosen recipient and cleanup.

## Read only when relevant

- [Open backlog](backlog.md): pending checks and release decisions.
- [Demo runbook](demo-visitors.md): instance/host IDs, visitor credentials, recovery.
- [Preview review sheet](preview.md): deployment details and Git push guard.
- [Audit/runbook](pre-deployment-audit.md): data/retry/security evidence.
- [September 25 evidence](archive/ui-overhaul-2026-09-25.md): completed QA.
- [Older design history](archive/ui-overhaul-2026-09-17.md): phases and decisions.

Keep this file under 450 words. Root README owns setup and visitor instructions.
