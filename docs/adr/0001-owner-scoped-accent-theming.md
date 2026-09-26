# Owner-scoped accent theming with derived contrast

Kalender ships two fixed product themes — Midnight Lime (dark, default) and Daylight Lime (light). On top of these, each owner picks one **Accent** (guarded picker: curated swatches + hue slider, never free RGB) that rethemes the primary/ring tokens and glow of their public Booking Page. The App Shell deliberately stays Midnight/Daylight Lime: the workspace is quiet and consistent; the storefront is where owners express brand.

## Considered Options

- **Visitor-side accent preference** — rejected: turns the owner's brand into the visitor's plaything; revisit later as a playful experiment.
- **Accent applied to the App Shell too** — rejected for v1: breaks the "quiet workspace" story; owner branding belongs on the public surface.
- **Free RGB/color-scheme picker** — rejected: users can pick near-background colors, killing button contrast and glow; instead `--primary-foreground` is **derived** from the accent's oklch lightness so contrast cannot break.

## Consequences

- Owners need an `accent` field on their profile (data model change).
- Accent propagation must reach the public Booking Page route (server-provided CSS vars on the page container).
- The picker UI must clamp/derive: swatches + hue slider, auto `--primary-foreground`.
