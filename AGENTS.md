# Working on Kalender

- For UI overhaul, demo or release work, read `docs/ui-overhaul/README.md` first.
  It contains current state, verified checks, constraints and next steps.
- Read only the relevant code and documentation sections for the task. Do not
  load the archive or full audit report for routine startup, or repeat the
  completed architecture audit unless new evidence or the user requests it.
- Preserve unrelated working-tree changes. Use Node 22 (`.nvmrc`). The release
  gate is `npm run check`; run it after application or dependency changes.
- Keep the handoff short and current: replace stale facts; archive detailed
  session history. Root README is for setup, not a second session log.
- Product terms: Storefront = public surfaces; App Shell = signed-in workspace;
  Booking Page = owner's public profile; Accent = owner's public-page color.
