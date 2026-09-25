# Separate Vercel preview: review sheet

Updated September 25, 2026. The user approved sending the development database
and Clerk credentials to the existing Vercel project for Preview. A direct CLI
deployment succeeded using one-off overrides; the project settings were not
changed. Its latest [protected Preview](https://kalender-foeqgfps5-thureinss-projects.vercel.app/)
is Ready. No Git push occurred.

## Existing Vercel project, verified September 25

- [kalender](https://vercel.com/thureinss-projects/kalender) is linked to
  `ThureinS/kalender`. Its current production deployment is **Ready**, from
  `main` revision `687cb35` (August 26). The
  [live URL](https://kalender-tau.vercel.app) loaded the older Clerk sign-in
  page on September 25. The dashboard showed no active preview branch.
- The project has a default Preview environment for nonproduction branches.
  `DATABASE_URL`, both Clerk keys and the Clerk route variables are currently
  scoped to **All Environments**. Their values were not revealed. Do not push
  `ui-overhaul` to this project before preview-specific values are in place;
  otherwise its preview can inherit the existing runtime configuration.
- Vercel Authentication is enabled for preproduction deployments. A visitor
  outside the Vercel team needs an approved sharing/access route before testing
  that project's preview. The dashboard did not offer permission to change
  this protection.
- Because this project is Git-connected, pushing `ui-overhaul` would also
  [trigger its own Preview deployment](https://vercel.com/docs/deployments/environments).
  Creating another Vercel project alone would not prevent that deployment;
  configure safe [branch-specific variables](https://vercel.com/docs/environment-variables)
  or an approved build skip here before pushing.

## Target and runtime configuration

- Use a separate Vercel preview with **development Clerk** and the existing
  shared Neon database. Code is separate; database records are shared with the
  earlier production deployment. Do not migrate or reseed for this preview.
- The current Preview was deployed from the uncommitted working tree using
  `vercel deploy --target preview` with one-off build and runtime overrides.
  `.env.local` was excluded from the upload. Development Clerk/database values
  were attached to this deployment only. This does not make a future Git push
  safe: the branch does not exist remotely, and Vercel CLI rejected
  `--git-branch ui-overhaul` variables with `branch_not_found`.
- Scope `DATABASE_URL`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (`pk_test_…`) and
  `CLERK_SECRET_KEY` (`sk_test_…`) to the intended preview target, so another
  branch's preview does not silently inherit this database and Clerk instance.
  Copy the Clerk route/redirect variables from
  [.env.example](../../.env.example). Keep secret values out of Git and preview
  build logs.
- For browse-only, set `KALENDER_BOOKING_MODE=disabled` and leave the host ID
  unset. The form disables confirmation, and the server action rejects booking
  requests before writing a reservation or sending an invitation. Both settings
  were applied to the current Preview.
- If live demo bookings are chosen, set `KALENDER_BOOKING_MODE=demo` and use
  the development Clerk host ID in the [demo runbook](demo-visitors.md). The
  visitor IDs do not belong in this setting. Omit seed and tester-creation
  variables from the hosting runtime.
- Verify sign-in and return navigation on the eventual preview URL with the
  matching development Clerk instance; update any required callback settings
  after the URL is known. Keep Google OAuth in Testing mode and the designated
  host in its test users. Ordinary Google sign-in needs identity scopes only;
  Calendar scopes are requested from Integrations by the host.

## Exposure decision

| Mode | Visitor experience | External effect |
| --- | --- | --- |
| `disabled` | Public pages and form can be explored; the shared-login panel is hidden and confirmation is disabled. | No booking writes or invitations. |
| `demo` | Shared visitor login and booking submission are available. | Any signed-in visitor can create a real event on the configured host calendar and invite an arbitrary address. There is no per-visitor rate limit or guest-email ownership check. |

The protected Preview uses `disabled`. The existing local demo stays in `demo`
mode. Keep `disabled` for broader review until controls for live submissions
are chosen and implemented.

## Before and after publishing

CLI authentication and the `.vercel` project link now work. The final deployment
was inspected as Preview/Ready, and an unauthenticated request redirects to
Vercel SSO. Brave showed the landing page, seeded profile, paused booking
notice and disabled confirmation. A demo account signed in on Preview;
Overview and Booking Page were checked at mobile/tablet/desktop widths. No
real booking or invitation was submitted.

Before pushing `ui-overhaul`, configure branch-specific development keys and
booking mode, or use another isolated Git deployment path. This may require
creating the remote branch without triggering an unsafe automatic deployment.
Do not treat one-off deployment overrides as saved project settings. A real
booking, invitation and inbox test requires a separately agreed recipient and
cleanup scope. Production promotion is a separate decision.
