import { timezoneSchema } from "./timezone"
import { z } from "zod"

export const PROFILE_ACCENT_OPTIONS = [
  "lime",
  "mint",
  "sky",
  "violet",
  "rose",
  "amber",
] as const

export const profileFormSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(1, "Display name is required")
    .max(80, "Display name must be 80 characters or less"),
  handle: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "Link Name must be at least 3 characters")
    .max(48, "Link Name must be 48 characters or less")
    .regex(
      /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
      "Use lowercase letters, numbers, and single hyphens"
    ),
  headline: z
    .string()
    .trim()
    .max(140, "Headline must be 140 characters or less")
    .optional(),
  bio: z
    .string()
    .trim()
    .max(500, "Bio must be 500 characters or less")
    .optional(),
  timezone: timezoneSchema,
  location: z
    .string()
    .trim()
    .max(80, "Location must be 80 characters or less")
    .optional(),
  accent: z.enum(PROFILE_ACCENT_OPTIONS),
})
