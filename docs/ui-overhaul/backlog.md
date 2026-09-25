# Open work

Updated September 25, 2026. Read only for planning the relevant task.
Completed work belongs in the archive, not this list. Current state: [handoff](README.md).

## Before public preview / release

- [ ] Before a Git push, configure branch-specific Preview overrides or an
  isolated Git deployment path. The current direct Preview has one-off dev
  Clerk/database overrides and booking disabled; project Clerk/DB variables
  still apply to all environments. Git push could trigger an unsafe automatic
  deployment. Retain Vercel Authentication and Google OAuth Testing mode.
- [ ] Decide whether to enable live demo bookings. `demo` mode lets any signed-in
  visitor create a real host Calendar event and invite an arbitrary email,
  without a per-visitor rate limit or guest-email ownership verification.
- [ ] Real booking/invitation/receipt/inbox test only after separate authorization;
  use an owned inbox and agree cleanup scope first. Nothing has been sent so far.
- [ ] Make a separate merge/promotion decision after Preview review.

Move finished entries out rather than accumulating checked boxes here. Record
verification once in the handoff; retain detailed evidence in the archive.
