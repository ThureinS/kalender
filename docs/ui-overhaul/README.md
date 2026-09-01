# UI Overhaul Working Agreement

This document records the agreed direction for the `ui-overhaul` branch. It is
meant to make the redesign continuable in small chunks across sessions.

## Current Status

Phases 1-5 have been implemented in the production codebase.

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
- Bookings currently uses an honest empty state because confirmed meetings are
  created in Google Calendar and are not persisted in a local bookings table.
- Integrations is scoped to Google Calendar.
- Event Types now use the agreed core editor fields: Title, Link Name,
  Description, Duration, Location, Visibility, and Buffer Time.
- Event creation/editing includes a live Event Link preview and clearer
  visibility/booking availability states.
- Buffer Time is explained inline and is used by scheduling conflict checks to
  protect time around bookings.
- Overview now gives the first incomplete setup item stronger visual weight so
  the next workspace action is obvious.
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

Open checkpoint:

- Phase 4 desktop/mobile browser QA passed for `/overview`, `/events`,
  `/schedule`, `/booking-page`, `/bookings`, `/integrations`, `/settings`,
  `/book/khana-u-thone`, and `/book/khana-u-thone/discovery-call`.
- Phase 5 build/typecheck passed for the Event Type Editor changes. Browser QA
  should cover `/events`, `/events/new`, an existing event edit route,
  `/booking-page`, `/book/khana-u-thone`, and
  `/book/khana-u-thone/discovery-call`.
- Manual browser QA was attempted on September 1, 2026, but the local dev
  server accepted localhost connections without returning route responses after
  middleware compilation. `npm run build` and `npx tsc --noEmit` still pass.
- A development-only Google OAuth warning can appear on public event routes when
  no valid local Google token is available; the route still renders and the app
  skips busy-time lookup in development.

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

Goal: decide and implement the public marketing surface after visual comparison.

Work chunks:

1. Build visual demos for deferred Q15.
2. Choose direction.
3. Implement the landing page.
4. Show product screenshots/previews from the actual UI direction.
5. Connect CTAs to sign-up/login.

Done when:

- The landing page makes the product immediately understandable.
- It supports the portfolio goal without becoming a decorative-only page.

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
