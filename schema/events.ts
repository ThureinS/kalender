import { z } from "zod";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

// Define a validation schema for the event form using Zod
export const eventFormSchema = z.object({
    // 'name' must be a string and is required (at least 1 character)
    name: z
      .string()
      .trim()
      .min(2, "Use at least 2 characters")
      .max(80, "Keep the title under 80 characters"),

    // Readable public URL segment for this event
    slug: z
      .string()
      .trim()
      .max(80, "Keep the Link Name under 80 characters")
      .refine(
        value => value === "" || slugPattern.test(value),
        "Use lowercase letters, numbers, and hyphens only"
      )
      .optional(),
  
    // 'description' is an optional string field
    description: z
      .string()
      .trim()
      .max(500, "Keep the description under 500 characters")
      .optional(),

    // Where the meeting happens
    location: z
      .string()
      .trim()
      .min(2, "Add a location")
      .max(120, "Keep the location under 120 characters"),
  
    // 'isActive' is a boolean value that defaults to true if not provided
    isActive: z.boolean(),

    visibility: z.enum(["public", "private"]),

    bufferMinutes: z.coerce
      .number()
      .int()
      .min(0, "Buffer time cannot be negative")
      .max(240, "Buffer time must be 4 hours or less"),
  
    // 'durationInMinutes' will be coerced (converted) to a number
    // It must be an integer, greater than 0, and less than or equal to 720 (12 hours)
    durationInMinutes: z.coerce
      .number()
      .int()
      .positive("Duration must be greater than 0")
      .max(60 * 12, `Duration must be less than 12 hours (${60 * 12} minutes)`),
})
