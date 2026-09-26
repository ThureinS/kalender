# September 26: release preparation and authorized booking test

User approved preparation steps 1–4; merge/deploy reserved for later. Test
recipient `accutility778@gmail.com` and exact cleanup were authorized.

## Real local test and cleanup

- Brave Demo Tester 1 submitted Portfolio Review for September 28, 20:00
  Asia/Bangkok, guest `Kalender Release QA 2026-09-26`.
- Booking `26155f5e-a35f-47c0-966f-4811e77080b6` confirmed; receipt displayed
  selected timezone. UTC timestamps `2026-09-28 13:00:00`–`13:30:00` verified as
  SQL text, avoiding raw Neon timestamp-without-time-zone parsing in local TZ.
- Google event `26155f5ea35f47c0966f4811e77080b6` returned HTTP 200/confirmed,
  `[Demo] Kalender Release QA 2026-09-26: Portfolio Review`, no-meeting test
  description and authorized attendee. One reservation existed.
- Creation requested `sendUpdates=all`; attendee equals organizer. Authorized
  Gmail search `in:anywhere "Kalender Release QA 2026-09-26"` returned no matches.
  Actual delivery is **unverified**; do not infer a transport defect.
- Guarded Google DELETE `sendUpdates=all` returned 204; GET showed cancelled.
  Only that booking became canceled and its reservation was deleted. Bookings
  8 before/9 after (audit row retained), reservations 0. Tested-slot free/busy
  returned 200, no errors, zero busy intervals. No unrelated event modified.

## Production inspection and preparation

- Live remains old `main` `687cb35`. Host sign-in reached `/events`, then old
  layout raised `SignedIn is not available in @clerk/nextjs Core 3`. Current
  branch no longer contains that component.
- Matching live Clerk keys/shared Neon retained. App's `/__clerk/v1/environment`
  proxy works. Host Google sign-in created `user_3JrIeUQShpAMZwP80zXs22uXBi7`
  using an already-approved events/identity grant; no new Google scope accepted.
- Host free/busy returned 403. After user completed admin login, selected the
  existing live `My Application` instance (`ins_3IRLdBWx66E4iSJaKpQZbyzUQ6Y`).
  Removed `calendar.events` from Google defaults and saved. The scope grid
  retained only identity scopes, and the unsaved-changes/Save bar disappeared.
  No credential, other provider toggle or host Google grant was changed.
- Production-only redirects, disabled mode and host ID saved. Prior global
  redirect records split to preserve Preview/Development values. Landing handle
  `demo-portfolio-studio` saved as Production config.
- Non-destructive copy added one live profile, three events, one schedule, five
  windows. No bookings copied. Development still has three events/nine bookings.
  No migration, replacement seed, merge or deployment.
- Protected Preview remains `3f70d04`, browse-only; no public exception applied.

## Changes and verification

- Atomic Neon batch takes per-host advisory lock, then conditionally reserves
  under rolling 24-hour caps: 3/caller, 10/host. Caller is server-derived JSON
  metadata; no migration. Original retries survive caps; different callers
  cannot retry a new owned attempt.
- Disposable PostgreSQL tests cover concurrent caller cap, global cap, expired
  reservations, uncertain attempts and retries without extra Google writes.
- Real Neon read-only batch verified advisory locking and READ COMMITTED.
- Configurable landing links select per-instance demo profile. Provider errors
  retain event details and show unavailable status, without unverified slots.
  Brave verified that failure screen for live-host data through local dev.
- Final Node 22.21.1 `npm run check` passed once after all application edits:
  lint, 59 tests/7 suites, types, production build and compiled action/retired
  route checks. Dev stopped before build; fresh `.next` dev output restarted.
  Local docs links/diff checks passed. Task-created Production env pull removed;
  secrets stayed out of Git. Application changes remain uncommitted/unpushed.
- Before the option-10 follow-up below, user questioned shared-account quotas
  and requested ten options. At that point the caps remained 3/account, 10/host;
  the OAuth-default/docs-only follow-up did not require another build.

## Selected option 10 and ticket visitor access

- User selected option 10: account cap removed, host cap 500 new reservations
  per rolling 24 hours. Admission keeps the host transaction lock, uncertain
  attempts count, original owned retries do not allocate another reservation.
- Production live visitors created without identifier/password/Google accounts:
  `user_3JrOv8IuTbIEE73Al9Ftsjqelwn`,
  `user_3JrPFDqfJyU6oxGOk4fOrBx1Bs7`,
  `user_3JrPFKRPBnudmWaArOYyfN4vlRL`.
  External IDs are `kalender-public-demo-visitor-1` through `-3`, private metadata
  carries marker/index. Self-delete and organization creation disabled. No auth
  method or Device Trust settings changed; no provisioning email/invitation sent.
- Production visitor registry saved for the next deployment. Booking mode stays
  disabled. Guarded backend ticket creation and revocation passed for all three;
  no ticket printed/persisted. Live browser consumer test awaits deployment.
- Existing development visitor records received private markers, preserving
  unrelated metadata. Ignored local env selects their IDs. Brave verified each
  button signs in without password/OTP and returns to Portfolio Review. Shared
  visitors' in-app Calendar connect controls show guidance instead of offering
  personal Google authorization. No new booking submitted during button QA.
- New tests cover invalid selectors/config, host exclusion, account markers,
  real-identity/link rejection, locked/banned users, preserved signed-in identity,
  ticket lifetime and generic provider errors.
- Final `npm run check` after all quota/ticket/UI edits passed on Node 22.21.1:
  85 tests/8 suites, lint, types, optimized build and compiled action boundaries.
  Dev stopped before build and restarted with fresh `.next`. Visitor buttons
  stack at 375px (301px wide), align in one row at 1024px (290px each), with
  document scroll width equal to viewport width at both sizes. Viewport reset.
- Production pull verified the exact three-ID registry and disabled mode, then
  removed. Ignored credentials/registry stay outside Git. Local doc file links
  and diff checks passed. Source remains uncommitted/unpushed; no deploy.

## Session handoff

- User requested related-doc updates and continuation in a new session.
  Commit/merge/deploy approval has not been received. No commit, push, merge or
  deployment was performed for this documentation handoff.
- Handoff, unfinished backlog and release checklist now identify the exact
  restart point, completed 85-test gate, prepared live accounts/settings and
  remaining live verification. Root README remains setup/visitor instructions.
- Resume from existing changes; do not repeat provisioning, completed audit or
  the cleaned-up real booking test. Production deployment starts with booking
  disabled; host free/busy grant and live demo activation follow verification.

## Approved Production release execution

- User approved commit/merge/deploy after resume review. Commit `f418e9a`,
  PR #2 Preview build passed, merged as `71fc39d`. Git-backed Production
  deployment `8JqWVpNZevgqXgqzGm3KriGCo14M` Ready at stable URL with booking
  disabled; old Clerk `SignedIn` workspace exception resolved.
- Live buttons initially failed although backend tickets minted. A read-only
  account inspection confirmed the dedicated visitor boundaries. Frontend
  token probe returned `sign_in_no_identification_for_user`; probe ticket revoked
  and no session created. Reused the same three accounts and assigned usernames
  `kalender_demo_visitor_1` through `kalender_demo_visitor_3`. Global username
  attribute/sign-in remains disabled; no passwords, emails or Google links added.
  Ignored mode-600 visitor registry updated. All three Brave buttons then
  returned to Portfolio Review without passwords, OTP or Google authorization.
- Visitor Integrations showed shared-account guidance. Storefront/App Shell/
  paused Booking Page passed 375px and 1024px overflow checks.
- Host signed in with identity-only Google defaults and refreshed the existing
  Calendar grant through Integrations. Google listed availability and event
  permissions as already granted. Clerk now reports both Calendar scopes;
  read-only primary free/busy returned HTTP 200 without per-calendar errors.
  Workspace shows Ready to share, setup 4/4. No real booking repeated.
- Production-only booking mode changed from disabled to demo for next deployment.
  No other environment scope, keys, database data or Preview protection changed.

- Host sign-out/identity-only sign-in restored Calendar scopes automatically
  without another consent screen. Backend confirmed both scopes and the saved
  connection preference.
- Demo mode deployed on `5733a3f`, deployment
  `9MuVtVjNkP2y8uMpDdDFeGTDYmsz` Ready with stable alias. Anonymous root,
  profile and event routes returned HTTP 200. Live mode notice and three visitor
  buttons present; no Calendar unavailable or application-error state.
- Final Brave QA: anonymous filled draft kept confirmation disabled with sign-in
  guidance; shared visitor 1 opened the active form without a password/OTP/grant
  and reached enabled confirmation with synthetic QA details. Changed timezone
  from Bangkok to GMT: 8 PM became 1 PM, with slot reselection required. Active
  Booking Page passed 375px/1024px overflow and visual checks. No confirmation
  clicked, reservation/event/invitation created or cleanup required. QA session
  signed out; browser viewport restored; stable visitor panel left open.
- Required release work complete. Application gate reused because execution
  changed only external configuration and documentation. CV and distinct inbox
  delivery remain optional follow-ups.

## Distinct guest Production invitation follow-up

- The user supplied a distinct owned Gmail recipient in response to the explicit
  invitation-test offer. Used Brave and the stable Production URL, with existing
  Demo Visitor 1; no new account, auth setting or application changes.
- Submitted one Portfolio Review booking for September 28, 2026 at 8 PM
  Asia/Bangkok, under the synthetic name `Invitation Delivery Test`. Notes and
  Calendar description explicitly said that no meeting would take place.
- Persisted receipt `ef149020-95ad-4529-a396-1fdc1b88a838` passed. Read-only checks
  confirmed one booking and reservation for the live demo host, the exact
  supplied recipient, and the deterministic Google event with `confirmed`
  status and one matching attendee (`needsAction`). The application requested
  Google invitation delivery through its existing `sendUpdates=all` path.
- Actual Inbox/Spam arrival requires the user's confirmation. Asked once and
  did not send another booking. Email field values were omitted by text
  inspection; screenshot verification confirmed the exact recipient before
  submission. Automated input retries happened only before submission.
- Cleanup cancelled only this verified test event (`sendUpdates=all`, HTTP 204),
  then verified cancellation and removed exactly its booking and reservation in
  one database transaction. Final counts for this request were zero/zero;
  unrelated data was preserved. A guest cancellation notice was also requested.
- No application/dependency changes: the existing release gate remains valid.

### Guest delivery confirmation

The user supplied an inbox screenshot showing the matching `[Demo] Invitation
Delivery Test: Portfolio Review` invitation at 21:02 and its cancellation at
21:04, both from Utility Acc. This confirms receipt of both messages by the
specified guest inbox. Invitation delivery and cleanup are complete; no further
booking or resend is needed.
