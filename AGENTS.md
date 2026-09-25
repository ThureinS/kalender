# Working on Kalender

- For UI overhaul, demo or release work, read `docs/ui-overhaul/README.md` first.
  It contains current state, verified checks, constraints and next steps.
- Read that handoff once per task; reread only sections changed since the last
  read. Do not recursively open its links. Open `backlog.md` only for planning
  pending work and a runbook only for the relevant operation.
- Read only the relevant code and documentation sections for the task. Do not
  load the archive or full audit report for routine startup, or repeat the
  completed architecture audit unless new evidence or the user requests it.
- Preserve unrelated working-tree changes. Use Node 22 (`.nvmrc`). The release
  gate is `npm run check`; run it after application or dependency changes.
- Next 15 dev/build share `.next`: stop the local dev server before full build
  checks, then restart it with a fresh dev output directory if it was running.
- Keep the handoff short and current: replace stale facts; archive detailed
  session history. Root README is for setup, not a second session log.
- Keep the handoff under 450 words. Backlog contains unfinished items only;
  move completed evidence into a dated archive without duplicating it across
  active docs. Docs-only edits need link/diff checks, not an application build.
- Product terms: Storefront = public surfaces; App Shell = signed-in workspace;
  Booking Page = owner's public profile; Accent = owner's public-page color.
