# Separate Vercel preview: review sheet

Updated September 26, 2026. The user approved sending the development database
and Clerk credentials to the existing Vercel project for Preview. The
[Git-backed Preview](https://kalender-git-ui-overhaul-thureinss-projects.vercel.app/)
is Ready on `ui-overhaul`, using branch-specific overrides. Production remains
on `main`. The earlier direct CLI Preview is historical.

## Existing Vercel project, verified September 25

- [kalender](https://vercel.com/thureinss-projects/kalender) is linked to
  `ThureinS/kalender`. Its current production deployment is **Ready**, from
  `main` revision `687cb35` (August 26). The
  [live URL](https://kalender-tau.vercel.app) loaded the older Clerk sign-in
  page on September 25.
- The project has a default Preview environment for nonproduction branches.
  `DATABASE_URL`, both Clerk keys and default sign-in/up URLs are scoped to
  **All Environments**. Production force redirects were split on September 26
  to preserve Preview/Development values. Branch-specific overrides still
  supply `ui-overhaul`; other branches inherit their default Preview settings.
- Vercel Authentication is enabled for preproduction deployments. A visitor
  outside the Vercel team needs an approved sharing/access route before testing.
  No public access exception has been saved. Public Preview is optional internal
  QA; the portfolio/CV target is Production after final live verification.
- Git pushes to `ui-overhaul` now trigger Preview deployments with the saved
  [branch-specific variables](https://vercel.com/docs/environment-variables).

## Target and runtime configuration

- Use a separate Vercel preview with **development Clerk** and the existing
  shared Neon database. Code is separate; database records are shared with the
  earlier production deployment. Do not migrate or reseed for this preview.
- The first Preview was a direct CLI deployment from the working tree with
  one-off overrides; `.env.local` was excluded. For Git, a temporary
  `git.deploymentEnabled` guard prevented auto-deploy on the branch-creation
  push. After the branch existed remotely, eight variables were added for
  `Preview (ui-overhaul)`. The guard was removed in the code push; Vercel built
  that commit automatically. Never rely on the old one-off overrides for Git.
- `DATABASE_URL`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (`pk_test_…`) and
  `CLERK_SECRET_KEY` (`sk_test_…`) are scoped to `Preview (ui-overhaul)` along
  with the Clerk routes from [.env.example](../../.env.example).
  `DATABASE_URL` and `CLERK_SECRET_KEY` are sensitive Vercel variables. Keep
  values out of Git and logs.
- For browse-only, set `KALENDER_BOOKING_MODE=disabled` and leave the host ID
  unset. The form disables confirmation, and the server action rejects booking
  requests before writing a reservation or sending an invitation. Both settings
  were applied to the Git Preview.
- If live demo bookings are chosen, set `KALENDER_BOOKING_MODE=demo` and use
  the development Clerk host ID in the [demo runbook](demo-visitors.md). The
  visitor IDs do not belong in this setting. Omit seed and tester-creation
  variables from the hosting runtime.
- Sign-in and return to Overview work on the branch URL with the matching
  development Clerk instance. Keep Google OAuth in Testing mode and the
  designated host in its test users. Ordinary Google sign-in needs identity scopes only;
  Calendar scopes are requested from Integrations by the host.

## Exposure decision

| Mode | Visitor experience | External effect |
| --- | --- | --- |
| `disabled` | Public pages and form can be explored; confirmation is disabled; the optional ticket panel needs an explicitly configured visitor registry. | No booking writes or invitations. |
| `demo` | Matching-instance visitor login and booking submission are available. | Any signed-in visitor can invite the entered guest address on the configured host. New source caps reservations at 500/host per rolling 24 hours with no account cap; guest-email ownership is not verified. |

The protected Preview uses `disabled`. The existing local demo stays in `demo`
mode. New controls are local and uncommitted, not deployed to this Preview.

## Before and after publishing

CLI authentication and the `.vercel` project link work. The Git deployment was
inspected as Preview/Ready, and an anonymous request redirects to Vercel SSO.
Brave showed the landing, seeded profile, paused event form, disabled
confirmation and demo-account sign-in to Overview. No real booking or
invitation was submitted on Preview. September 26 authorized **local** booking
creation/receipt and cleanup passed; inbox delivery remains unverified. See the
[release checklist](release.md) for Production preparation and remaining gates.
Production promotion is a separate approval.
