# UI Overhaul Working Agreement

This document records the agreed direction for the `ui-overhaul` branch. It is
meant to make the redesign continuable in small chunks across sessions.

## Current Status

Phases 1-8 have been implemented in the production codebase.

Current foundation state:

- Midnight/Daylight Lime production tokens are defined in `app/globals.css`.
- Production theme application uses `data-kalender-theme`, not lab-only
  `.theme-*` classes.
- `/theme-lab` and `/theme-lab/layouts` remain as frozen visual references, not
  production implementation.
- Storefront and App Shell layout primitives live in
  `components/layout/product-surfaces.tsx`.
- The main route group now splits signed-in pages onto the Daylight App Shell
  surface and public pages onto the Midnight Storefront surface.
- Public booking pages use readable `/book/{handle}` and
  `/book/{handle}/{eventSlug}` routes.
- The private App Shell IA now includes Overview, Events, Availability,
  Bookings, Booking Page, Integrations, and Settings.
- Signed-in entry points land on `/overview`; `/events`, `/schedule`, and
  `/booking-page` remain functional.
- Confirmed public bookings are persisted in Kalender after Google Calendar
  event creation succeeds. `/bookings` now reads the local bookings table for
  upcoming and past booking history.
- Phase 7 added a repeatable demo seed script at `scripts/seed-demo.mjs`, exposed
  as `npm run db:seed:demo`. It requires an explicit demo Clerk user id and
  confirmation environment flag before replacing any owner-scoped data.
- Phase 8 replaced the legacy embedded-sign-in homepage with a portfolio-ready
  public landing page built on the Midnight/Daylight/Lime product identity.
  The first viewport now presents Kalender as a scheduling product with
  booking-page, event-link, availability, and booking-history signals.
- The Phase 8 landing page uses static product previews that mirror the current
  public Booking Page and private Workspace surfaces instead of decorative
  marketing filler.
- Landing page CTAs connect to `/register`, `/login`, and the seeded public demo
  profile at `/book/demo-strategy-studio`.
- Public nested booking routes now avoid server-side Clerk identity checks for
  visitor rendering. Owner-only public-page conveniences use client-side Clerk
  state, while private routes remain protected by middleware.
- Integrations is scoped to Google Calendar.
- Event Types now use the agreed core editor fields: Title, Link Name,
  Description, Duration, Location, Visibility, and Buffer Time.
- Event creation/editing includes a live Event Link preview and clearer
  visibility/booking availability states.
- Buffer Time is explained inline and is used by scheduling conflict checks to
  protect time around bookings.
- Overview now gives the first incomplete setup item stronger visual weight so
  the next workspace action is obvious.
- A private `/onboarding` route now guides first-run setup inside the Daylight
  App Shell. It covers Booking Page identity, explicit saved availability, first
  public event, Google Calendar connection, and launch/share actions.
- Overview and Onboarding now share setup readiness rules for profile identity,
  saved availability, a public active event, and Google Calendar connection.
- Onboarding reuses the existing Booking Page, Availability, and Event editor
  behavior. Event and schedule forms have small onboarding-specific options for
  return routing and blocking empty availability saves.
- Onboarding does not silently create default availability. The Availability
  step requires the user to add and save at least one weekly window before the
  Launch step can become shareable.
- Private App Shell navigation and content use the same Daylight surface.
- Overview degrades gracefully when one workspace data query fails instead of
  showing the full Next.js application error screen.
- Public booking blocks when the owner has no saved availability. The profile
  page shows booking as paused, and direct event links show an availability-not-
  set state instead of the booking form.
- Obvious legacy blue/gray hardcoded styling and large hover scaling were
  removed from touched nav, event, availability, booking, card, and form
  surfaces.
- `npm run build` passes.
- `npx tsc --noEmit` passes.

Committed checkpoint:

- Phase 4 desktop/mobile browser QA passed for `/overview`, `/events`,
  `/schedule`, `/booking-page`, `/bookings`, `/integrations`, `/settings`,
  `/book/khana-u-thone`, and `/book/khana-u-thone/discovery-call`.
- Phase 5 build/typecheck passed for the Event Type Editor changes.
- Phase 6 build/typecheck passed for the private Onboarding route.
- The UI overhaul checkpoint was committed on September 1, 2026 as
  `f83976d Overhaul scheduling product UI`.
- The latest handoff checkpoint before Phase 6 was committed on September 1,
  2026 as `8a9e28a Document onboarding phase handoff`.
- Manual browser QA on September 1, 2026 confirmed that the earlier localhost
  route-response issue was a local port collision: port 3000 was serving a
  different Next app. Kalender was verified on port 3002.
- Phase 6 browser QA on September 1, 2026 used port 3003 because port 3002 was
  already occupied. `/onboarding` rendered under the private App Shell, mobile
  QA at 390px showed no horizontal overflow, Launch copy/share stayed disabled
  until all readiness checks passed, and Overview checklist links resolved to
  `/onboarding` step anchors.
- On September 2, 2026, Overview was updated to show a primary "Continue
  Onboarding" action until all readiness checks pass. Once setup is complete, it
  switches back to "Open Public URL."
- On September 3, 2026, onboarding QA found inconsistent oversized success
  toasts, no event-created toast, and no direct Google Calendar connection
  action. Toasts now use a shared app helper with icons and compact styling, the
  event editor reports create/update/delete status, and Integrations/Onboarding
  expose a direct Clerk Google OAuth connection action.
- On September 3, 2026, public Booking Page QA showed that available events were
  pushed below the fold in narrower desktop panes. The public split layout now
  starts at the medium breakpoint so the identity rail and event list sit side
  by side earlier.
- On September 3, 2026, follow-up manual QA confirmed public event visibility
  on `/book/utility-acc` at desktop and mobile widths. The event detail page
  exposes selectable slots, and the confirm action now remains disabled until a
  slot, guest name, and valid guest email are present.
- On September 3, 2026, Google Calendar readiness was tightened to require an
  approved Google Calendar OAuth scope, not merely a Google sign-in account.
  Overview, Onboarding, and Integrations now share that stricter rule.
- On September 3, 2026, Google Calendar OAuth QA reached Google's "This app is
  blocked" screen before returning to Clerk. The connection is blocked by Google
  OAuth app configuration, not by the onboarding route. Kalender now requests
  the narrower `calendar.events.freebusy` scope for conflict checks instead of
  `calendar.readonly`, while keeping `calendar.events` for confirmed meeting
  creation.
- On September 5, 2026, follow-up Google Cloud QA showed a concrete OAuth
  configuration mismatch. Google's blocked OAuth URL used client id
  `787459168867-0v2orf3qo56uocsi84iroseoahhuovdm.apps.googleusercontent.com`,
  while the visible Google Cloud client being edited was
  `564227907042-ojcqbuimvlb360o2dvju5vlr11obn79q.apps.googleusercontent.com`.
  The active Clerk domain in this local app is
  `included-garfish-63.clerk.accounts.dev`, but the visible Google client only
  showed a `skilled-wombat-27.clerk.accounts.dev` callback. The next session
  should either find/edit the `787459168867-...` OAuth client, or update Clerk's
  Google social connection to use the currently edited Google client id/secret.
- On September 6, 2026, Integrations QA found a local Clerk provider-shape bug:
  Clerk returns connected Google external accounts as `oauth_google`, while the
  UI was checking for `google`. Overview, Onboarding, Integrations, and the
  direct connect button now share a provider helper that accepts both values.
  Google Calendar readiness now also requires both Calendar scopes exactly:
  `calendar.events` and `calendar.events.freebusy`.
- On September 6, 2026, Google Calendar reauthorization was retested from
  `/integrations` after the provider fix. Kalender correctly showed the active
  account as connected but needing Calendar access, then reached Google's
  blocked-app screen again. The blocked URL still used client id
  `787459168867-0v2orf3qo56uocsi84iroseoahhuovdm.apps.googleusercontent.com`,
  confirming the remaining blocker is external OAuth configuration.
- A follow-up Chrome retest on September 6, 2026 showed the local Kalender
  sign-in flow also using client id
  `787459168867-0v2orf3qo56uocsi84iroseoahhuovdm.apps.googleusercontent.com`
  with redirect URI `https://clerk.shared.lcl.dev/v1/oauth_callback`. That is
  consistent with Clerk's shared development Google OAuth credentials still
  being active for this instance, not the visible Google Cloud client
  `564227907042-ojcqbuimvlb360o2dvju5vlr11obn79q.apps.googleusercontent.com`.
- After updating and saving Clerk's Google custom credentials on September 6,
  2026, the live Chrome OAuth URL correctly used client id
  `564227907042-ojcqbuimvlb360o2dvju5vlr11obn79q.apps.googleusercontent.com`,
  redirect URI `https://included-garfish-63.clerk.accounts.dev/v1/oauth_callback`,
  and both Calendar scopes. Google then returned
  `Error 403: access_denied` because the app is still in Testing and
  `accutility778@gmail.com` is not an approved tester.
- After adding `accutility778@gmail.com` as a Google OAuth test user on
  September 6, 2026, the Google Calendar OAuth flow completed successfully.
  `/integrations` now shows Google Calendar connected as
  `accutility778@gmail.com` with approved `calendar.events` and
  `calendar.events.freebusy` scopes.
- Final supervised QA on September 6, 2026 confirmed `/overview` now reports
  setup `4/4`, `/onboarding` reports progress `5/5`, `/book/utility-acc`
  renders the public profile with the active `Testing` event, and
  `/book/utility-acc/testing` renders live availability, enabled slots, and a
  disabled confirmation action until booking details are present. No real
  booking was submitted.
- Final validation on September 6, 2026 passed with `npx tsc --noEmit` and
  `npm run build`.
- The four private manual QA events named `Manual QA Event...` were deleted
  after explicit user approval on September 6, 2026.
- On September 7, 2026, first-run QA was retested with a newly signed-up
  account at `/book/aaddition966`. The initial state correctly showed
  `/overview` setup `1/4`, `/onboarding` progress `1/5`, no saved
  availability, no public active events, no Google Calendar connection, Launch
  copy/share disabled, and the public Booking Page showing `0 active events`,
  `Availability not set`, and `No bookable events yet`.
- Continuing the same September 7 first-run QA, adding one Monday availability
  window advanced `/onboarding` to `2/5`. Creating a public `First Run QA Call`
  event advanced `/onboarding` to `3/5` and `/overview` to `3/4`, with Google
  Calendar correctly remaining the next incomplete setup item. The public page
  then showed `1 active event` and `/book/aaddition966/first-run-qa-call`
  rendered live availability and a disabled confirmation action until booking
  details are present. No real booking was submitted.
- Completing the same September 7 first-run QA, Google Calendar was connected
  for `aaddition966@gmail.com`. `/integrations` showed approved
  `calendar.events` and `calendar.events.freebusy` scopes, `/overview`
  advanced to setup `4/4`, `/onboarding` advanced to progress `5/5`, and Launch
  copy/share became enabled. Public booking and event detail pages still
  rendered correctly after the Calendar connection. No real booking was
  submitted.
- On September 7, 2026, Google OAuth verification was explicitly deferred. For
  the portfolio/demo milestone, Kalender will stay in Google Testing mode with
  explicit demo/test users. Arbitrary external Google users remain out of scope
  until a later production verification phase with public policy docs, verified
  domain ownership, and Google review materials.
- On September 7, 2026, production deployment setup was deferred until a later
  session. The production domain and Clerk production instance still need to be
  chosen before final production Google OAuth redirect URIs are configured.
- Earlier on September 7, 2026, local bookings/history was deferred from the
  onboarding/OAuth QA checkpoint and selected as the next feature phase.
- On September 7, 2026, the local bookings/history feature phase added a
  forward-only `bookings` table with confirmed/canceled status, event snapshots,
  guest details, timezone, UTC start/end timestamps, and Google Calendar event
  metadata. Successful public booking submissions still create the Google
  Calendar event first, then persist the confirmed booking locally for Kalender
  history.
- The same September 7 local bookings/history phase updated `/bookings` to show
  real stored booking counts, upcoming bookings, past bookings, guest contact
  details, event snapshots, duration, timezone, and a Google event link when one
  is available. Accounts with no local bookings now show a truthful empty state
  for the new persisted model.
- Local bookings/history validation on September 7, 2026 passed with
  `npx tsc --noEmit` and `npm run build`. No real booking was submitted during
  this implementation pass; action-time approval is still required before a
  manual test booking is created.
- After explicit action-time approval on September 7, 2026, browser QA
  submitted one real public test booking for `/book/aaddition966/first-run-qa-call`
  using `Kalender QA <qa-local-booking@example.com>` and the note
  `Local booking history QA`. The booking confirmation page rendered for
  September 7, 2026 at 1:45 PM Asia/Bangkok, and `/bookings` showed Stored
  Bookings `1`, Upcoming `1`, the event snapshot, guest contact details, note,
  duration, timezone, and Google event link from the local bookings table.
- After explicit cleanup approval on September 7, 2026, the same real QA
  booking was deleted from Google Calendar and from the local `bookings` table.
  A follow-up database check confirmed zero remaining
  `qa-local-booking@example.com` booking rows.
- On September 7, 2026, Phase 7 demo/seed implementation added
  `npm run db:seed:demo`. The script seeds one realistic solo-professional
  profile, three public event types, five weekly availability windows, and eight
  dynamic booking history rows spanning upcoming, past, canceled, and
  rescheduled examples. It refuses to run unless `KALENDER_DEMO_CLERK_USER_ID`
  is provided, `KALENDER_DEMO_SEED_CONFIRM` is exactly `replace-demo-owner`, and
  the demo handle starts with `demo-`. The seed should be run only against a
  dedicated Clerk test user because it replaces profile, schedule, events, and
  bookings for that owner id.
- Phase 7 validation on September 7, 2026 confirmed `node scripts/seed-demo.mjs
  --help`, default safety refusal, missing-confirmation safety refusal,
  `node --check scripts/seed-demo.mjs`, `npx tsc --noEmit`, and
  `npm run build`. The `rescheduled` booking status migration was applied to the
  Neon development database. The seed script was not run against a live account
  during implementation because that would intentionally replace owner-scoped
  demo data.
- After explicit approval on September 7, 2026, Phase 7 seed QA ran against the
  dedicated test user `accutility778@gmail.com`
  (`user_3Im9W7uEWVIJYnoULDo0EIvCM23`). The seed completed with handle
  `demo-strategy-studio`, profile `Avery Stone`, three events, five availability
  windows, and eight bookings. Database verification showed six confirmed, one
  canceled, and one rescheduled booking. Browser QA confirmed
  `/book/demo-strategy-studio` rendered the demo profile with three active
  events, and `/book/demo-strategy-studio/strategy-sprint` rendered live
  availability with the confirmation action disabled until visitor details are
  present. No additional real booking was submitted during Phase 7 seed QA.
- On September 7, 2026, Phase 8 landing page implementation replaced the legacy
  root page with a responsive public storefront. Browser QA on port 3004
  confirmed the desktop first viewport shows Kalender as a scheduling product,
  primary CTAs, and a public booking-page preview; mobile QA at 390px confirmed
  no horizontal page overflow, visible primary/demo CTAs, readable text, and a
  stacked product preview. The demo profile CTA route
  `/book/demo-strategy-studio` rendered the seeded Avery Stone profile and three
  events. No booking was submitted.
- Phase 8 validation on September 7, 2026 passed with `npx tsc --noEmit` and
  `npm run build`.
- On September 3, 2026, event creation feedback was retested. Event saves now
  use a loading toast and route with a short-lived `toast` query marker so the
  destination page can show the success toast after App Router navigation.
- Intermittent Neon connection timeouts can still slow or fail individual local
  route loads. Overview now degrades when a workspace query fails, but public
  booking routes still depend on database reads and should be retried when Neon
  connectivity is unstable.
- A development-only Google OAuth warning can appear on public event routes when
  no valid local Google token is available; the route still renders and the app
  skips busy-time lookup in development.

Next checkpoint:

- Phase 8 landing page is implemented and ready for local portfolio demo use.
- The seeded demo public profile is available at `/book/demo-strategy-studio`
  while the development database keeps the Phase 7 seed data.
- When deployment resumes, choose the production domain and Clerk production
  instance before finalizing production Google OAuth redirect URIs.
- Production deployment, custom domain, Clerk production setup, and Google OAuth
  verification remain deferred.

## Product Goal

Kalender should become a production-grade portfolio product: credible as a real
scheduling app for solo professionals, and polished enough to demonstrate strong
product design and frontend execution.

The app should not look like a tutorial clone or a default component-library
demo. The redesign can change layouts, navigation, flows, data shape, and add
features, but every addition should strengthen the scheduling product.

## Agreed Decisions

### D1. Redesign Scope

**Decision**: Level 3 redesign.

**Meaning**: We can redesign the visual language, navigation, information
architecture, interaction patterns, user flows, and selected product features.

**Boundary**: This is not a full product rewrite. Clerk, Drizzle, routes, core
scheduling behavior, and Radix/shadcn primitives can remain where they are still
useful.

### D2. Product Audience

**Decision**: Portfolio-grade product first; solo professionals as the practical
target user.

**Meaning**: Kalender should be useful for consultants, coaches, freelancers,
creators, and independent operators, but the execution bar is higher than a
basic utility app.

**Avoid**: Small-team or enterprise scheduling complexity for v1.

### D3. Two-Surface Split

**Decision**: Use a two-surface product model.

**Storefront**: Public-facing surfaces, including the landing page and public
booking pages. These should be expressive, memorable, brand-forward, and highly
polished.

**App Shell**: Signed-in workspace where users manage events, availability,
bookings, integrations, and settings. This should be quiet, efficient,
scannable, and practical.

**Reason**: Public pages need trust and personality. Private pages need speed
and clarity.

### D4. Theme Model

**Decision**: Fixed Kalender identity plus owner-scoped accent color.

**Meaning**:

- Kalender owns the base visual system.
- Midnight is the default dark identity.
- Daylight is the light counterpart.
- Lime is the default accent.
- Owners can later choose one controlled Accent for their public booking page.

**Accent usage**: Public booking page CTA, focus ring, selected state, avatar
glow, and small brand details.

**Boundary**: The App Shell does not inherit each owner's accent. It stays
visually stable.

See also: `docs/adr/0001-owner-scoped-accent-theming.md`.

### D5. Booking Page Layout

**Decision**: Split-screen identity rail plus event rows.

**Desktop shape**:

- Left rail: owner identity, avatar, headline, bio, timezone/location, accent
  glow, trust/status note.
- Right column: bookable event rows.

**Mobile shape**:

- Identity stacks first.
- Event rows follow below.

**Avoid**:

- Generic event card gallery as the main direction.
- Large hover scaling.
- Hardcoded blue styling.
- Public page layouts that feel like a Calendly clone.

### D6. Booking Flow

**Decision**: Single focused booking flow.

**Flow**:

1. Pick event.
2. Pick date.
3. Pick time.
4. Enter details.
5. Confirm.
6. See success page.

**Experience**: Calm, linear, obvious. Avoid modal stacks, clever detours, and
multi-column clutter on mobile.

### D7. App Shell Information Architecture

**Decision**: Build a comprehensive but portfolio-appropriate workspace.

Recommended sections:

- Overview
- Events
- Availability
- Bookings
- Booking Page
- Integrations
- Settings

**Boundary**: Comprehensive does not mean enterprise-heavy. The workspace should
feel complete without adding fake depth.

### D8. Onboarding

**Decision**: Add onboarding/setup flow.

**Purpose**: Make the product feel consistent from first login to public booking
page.

Recommended steps:

1. Profile identity.
2. Accent.
3. Calendar connection.
4. Availability.
5. First event.
6. Launch/share booking link.

**Connection to App Shell**: Overview can show setup progress until onboarding
is complete.

### D9. Public Profile Model

**Decision**: Add a real owner profile concept.

Recommended fields:

- `handle`
- `displayName`
- `avatarUrl`
- `headline`
- `bio`
- `timezone`
- `location`
- `accent`

**Product wording**: Do not expose "handle" as the main UI term. Use "Booking
Link", "Link Name", or "Public URL" depending on context.

### D10. Public URL Model

**Decision**: Use readable public URLs.

**Routes**:

- Booking page: `/book/{handle}`
- Event page: `/book/{handle}/{eventSlug}`

**Internal terms**:

- `handle` for the owner profile URL segment.
- `eventSlug` for the event URL segment.

**UI terms**:

- "Booking Link" for the public user URL.
- "Link Name" for the editable owner segment.
- "Event Link" for event URLs.

### D11. Event Type Scope

**Decision**: Event Types should be polished but not over-engineered.

Core fields:

- Title
- Link Name
- Description
- Duration
- Location
- Visibility
- Buffer Time

**Buffer Time wording**: Explain inline where the setting appears. Example:
"Protects time before or after a booking."

**Avoid for v1**:

- Custom invitee questions
- Max bookings per day
- Custom per-event schedules
- Complex routing
- Team logic
- Payment gates
- Workflow automation

### D12. Integration Scope

**Decision**: Google Calendar stays as the only integration for now.

**Reason**: One polished real integration is stronger than several shallow or
mocked integrations.

### D13. Schema Change Boundary

**Decision**: Minimal schema/data model changes are welcome.

**Meaning**: The redesign may add the fields needed to make the agreed product
real, especially public profile identity, readable booking URLs, event links,
buffer time, visibility, and onboarding state.

Expected additions:

- Public profile fields such as `handle`, `displayName`, `headline`, `bio`,
  `timezone`, `location`, and `accent`.
- Event type fields such as `slug`, `visibility`, and `bufferMinutes`.
- Setup state such as `onboardingCompletedAt`.

**Boundary**: Keep migrations forward-only and narrow. Do not perform a broad
database redesign unless a later decision explicitly calls for it.

### D14. Portfolio/Demo Data

**Decision**: Add realistic seeded/demo content for portfolio review.

**Meaning**: The project should have a repeatable way to populate a polished
demo state so the app is not empty when reviewed locally, shown in screenshots,
or used as a portfolio artifact.

**Important distinction**:

- Seed/demo data is for local development, review, and optional demo mode.
- Real user accounts should not be filled with fake bookings.
- New real users should get onboarding, strong empty states, and setup guidance
  instead of artificial history.

Recommended seed scope:

- One complete solo-professional profile.
- Several realistic event types.
- Weekly availability.
- A mix of upcoming bookings, past bookings, cancellations, and reschedules.
- Enough historical data to make lists, filters, and states feel real.
- Dynamic dates relative to the seed run date, so demo data stays current when
  reviewed later.

**Boundary**: Do not seed years of dense fake bookings by default. That creates
noise, slows review, and can look dishonest. Prefer a curated dataset with
representative depth: recent history, near-future bookings, and sparse older
examples only where useful.

Recommended time horizon:

- Past bookings: roughly the last 90-180 days.
- Upcoming bookings: roughly the next 30-60 days.
- Older examples: sparse only if history filters need something to show.

## Deferred Decisions

These should be decided visually in the browser, not abstractly.

### Q15. Landing Page Direction

Deferred options:

1. Bold product showcase.
2. Solo-professional focused.
3. Minimal SaaS utility.

Current recommendation: combine 1 and 2. Build a bold product showcase aimed at
solo professionals.

### Q16. App Shell Visual Density

Deferred options:

1. Compact/professional.
2. Spacious/friendly.
3. Adaptive.

Current recommendation: adaptive. Overview/onboarding can be spacious;
management screens should be compact and scannable.

## Implementation Order

### Phase 1. Foundation

Goal: create enough shared design structure that pages do not invent separate
styles.

Work chunks:

1. Define production theme tokens for Midnight/Daylight.
2. Convert throwaway theme lab decisions into stable CSS variables.
3. Create layout primitives for Storefront and App Shell.
4. Tighten shared UI primitives: buttons, cards, inputs, labels, helper text,
   focus rings, empty states.
5. Remove hardcoded legacy colors where touched.

Done when:

- The app has a clear token foundation.
- New screens can be built without one-off theme decisions.
- Existing shadcn/Radix primitives still work.

Status: implemented and browser-QA verified through Phase 4.

Implementation notes:

- Keep production theme selectors decoupled from `.theme-midnight` and
  `.theme-daylight`; those classes are preserved for lab references only.
- Use `StorefrontSurface` for expressive public surfaces and `AppShellSurface`
  for the stable signed-in workspace.
- Continue removing hardcoded legacy colors only in files touched by each
  phase, unless a broader cleanup is explicitly requested.
- Browser QA should happen after every phase, and after any chunk that changes
  global tokens or shared primitives.

### Phase 2. Public Booking Page

Goal: implement the agreed Storefront booking page.

Work chunks:

1. Add minimal public profile schema fields.
2. Add owner `handle` lookup.
3. Add event `slug`, `visibility`, and `bufferMinutes` schema fields.
4. Add event slug lookup.
5. Redesign `/book/{handle}` as split-screen identity rail plus event rows.
6. Apply owner Accent to the booking page.
7. Improve public empty/error states.
8. Verify responsive layout.

Done when:

- Public booking page no longer depends on Clerk IDs in the URL.
- The page has clear owner identity.
- Event rows are scannable and polished.

Status: implemented and browser-QA verified through Phase 4.

### Phase 3. Focused Booking Flow

Goal: make selecting a time feel calm and production-grade.

Work chunks:

1. Redesign event detail page around the linear flow.
2. Improve date/time selection.
3. Improve details form.
4. Improve confirmation and success state.
5. Add clear timezone and buffer behavior.
6. Verify mobile flow.

Done when:

- A visitor can understand and complete a booking without friction.
- The success page feels intentional, not default.

Status: implemented and browser-QA verified through Phase 4.

### Phase 4. App Shell IA

Goal: replace the minimal private nav with a real workspace structure.

Work chunks:

1. Create App Shell layout with sidebar/topbar.
2. Add Overview route.
3. Rename/reframe Schedule as Availability.
4. Add Bookings route.
5. Add Booking Page settings route.
6. Add Integrations route focused on Google Calendar.
7. Reserve Settings for account/preferences.

Done when:

- The private product feels like a complete workspace.
- Existing Events and Schedule behavior is preserved or intentionally migrated.

Status: implemented and browser-QA verified.

Implementation notes:

- `/overview` is the signed-in landing route.
- `/schedule` remains the functional Availability route.
- `/booking-page` remains the private Booking Page settings route.
- `/bookings` does not invent booking history before a local bookings model
  exists.
- `/integrations` focuses on Google Calendar only.

### Phase 5. Event Type Editor

Goal: make event creation/editing feel premium without adding heavy complexity.

Work chunks:

1. Redesign event form around core fields.
2. Add Link Name/Event Link behavior.
3. Add Visibility.
4. Add Buffer Time with contextual helper text.
5. Add live preview where useful.
6. Improve validation and empty/error states.

Done when:

- Event setup is easy to understand.
- The form is not a giant advanced settings panel.

### Phase 6. Onboarding

Goal: make first-run setup coherent.

Work chunks:

1. Add onboarding route/layout.
2. Add profile step.
3. Add Accent step.
4. Add Google Calendar step.
5. Add Availability step.
6. Add First Event step.
7. Add Launch/share step.
8. Connect completion state to Overview.

Done when:

- A new user can reach a complete public booking page through guided setup.
- The setup state is visible from the workspace.

Implementation notes:

- Add a private onboarding route, recommended path: `/onboarding`.
- Use the existing Daylight App Shell visual language and layout primitives.
- Prefer a guided setup shell with steps and clear progress over a marketing
  page. This is a product workflow, not a landing page.
- Recommended steps:
  1. Booking Page identity: display name, Link Name, headline, bio, timezone,
     location, and accent.
  2. Availability: at least one saved weekly availability window is required.
  3. First Event: title, Link Name, duration, location, visibility, and buffer.
  4. Google Calendar: show connection state and route to the existing
     integration action.
  5. Launch: show the public booking URL and next action to preview/copy/share.
- Reuse existing server actions and validation schemas:
  `updateCurrentUserProfile`, `saveSchedule`, `createEvent`, `getOrCreateProfile`,
  `getSchedule`, and `getEvents`.
- Connect completion state to Overview by using the same readiness rules already
  visible there: profile identity, saved availability, public active event, and
  Google account connection.
- Do not auto-create availability silently. If no availability is saved, booking
  stays blocked until the user explicitly saves at least one window.
- Consider adding `onboardingCompletedAt` only when it adds real value beyond
  derived readiness. Derived readiness is enough for the first implementation if
  it avoids unnecessary schema churn.
- Browser QA should cover a new or reset user state, a partially complete setup,
  and a fully complete setup that can open `/book/{handle}`.

### Phase 7. Demo/Seed Data

Goal: make local review and portfolio capture feel complete without fake
product claims.

Work chunks:

1. Create a repeatable seed script.
2. Add one realistic solo-professional profile.
3. Add representative event types.
4. Add realistic availability.
5. Add a balanced booking history with dates generated relative to seed time:
   upcoming, past, cancelled, and rescheduled.
6. Keep seeded data clearly separated from real user data.

Done when:

- A reviewer can run the project and see a complete product state.
- Empty states still exist and are intentionally designed.
- Seed data does not imply unsupported features.

### Phase 8. Landing Page

Goal: implement a portfolio-ready public surface that makes the scheduling
product immediately understandable.

Work chunks:

1. Build a Midnight storefront homepage using the existing identity.
2. Make the first viewport show Kalender as a scheduling product.
3. Show product previews from the current public Booking Page and private
   Workspace direction.
4. Connect CTAs to sign-up, login, and the seeded demo profile.
5. Keep deployment, custom domain, Clerk production setup, and Google
   verification deferred.

Done when:

- The landing page makes the product immediately understandable.
- It supports the portfolio goal without becoming a decorative-only page.
- Desktop and mobile browser QA, typecheck, and production build pass.

## Quality Bar

Every production chunk should include:

- Responsive behavior for mobile and desktop.
- Loading, empty, and error states where applicable.
- Accessible labels, focus states, and keyboard-friendly controls.
- No hardcoded colors where tokens should be used.
- No layout shifts from hover states.
- No unexplained unfamiliar terms.
- Build verification before handoff.

## Current Prototype References

- `/theme-lab`: visual identity explorations.
- `/theme-lab/layouts`: booking page layout explorations.

These routes are allowed to remain during exploration, but production work
should eventually replace or remove them.
