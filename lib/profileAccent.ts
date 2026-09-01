import type { CSSProperties } from "react"

import { PROFILE_ACCENT_OPTIONS } from "@/schema/profiles"

type Accent = (typeof PROFILE_ACCENT_OPTIONS)[number]

export const PROFILE_ACCENTS: Record<
  Accent,
  {
    label: string
    value: Accent
    primary: string
    foreground: string
  }
> = {
  lime: {
    label: "Lime",
    value: "lime",
    primary: "oklch(0.876 0.222 128.6)",
    foreground: "oklch(0.141 0.005 285.82)",
  },
  mint: {
    label: "Mint",
    value: "mint",
    primary: "oklch(0.78 0.15 168)",
    foreground: "oklch(0.141 0.005 285.82)",
  },
  sky: {
    label: "Sky",
    value: "sky",
    primary: "oklch(0.72 0.16 235)",
    foreground: "oklch(0.985 0 0)",
  },
  violet: {
    label: "Violet",
    value: "violet",
    primary: "oklch(0.7 0.18 302)",
    foreground: "oklch(0.985 0 0)",
  },
  rose: {
    label: "Rose",
    value: "rose",
    primary: "oklch(0.72 0.18 18)",
    foreground: "oklch(0.985 0 0)",
  },
  amber: {
    label: "Amber",
    value: "amber",
    primary: "oklch(0.8 0.17 76)",
    foreground: "oklch(0.141 0.005 285.82)",
  },
}

export function isProfileAccent(value: string): value is Accent {
  return PROFILE_ACCENT_OPTIONS.includes(value as Accent)
}

export function getProfileAccentStyle(accent: string): CSSProperties {
  const accentConfig = isProfileAccent(accent)
    ? PROFILE_ACCENTS[accent]
    : PROFILE_ACCENTS.lime

  return {
    "--primary": accentConfig.primary,
    "--ring": accentConfig.primary,
    "--owner-accent": accentConfig.primary,
    "--primary-foreground": accentConfig.foreground,
    "--owner-accent-foreground": accentConfig.foreground,
  } as CSSProperties
}
