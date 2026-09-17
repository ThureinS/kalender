import { z } from "zod"
import { timezoneSchema } from "./timezone"

const meetingSchemaBase = z.object({
  // This is the selected slot's actual UTC instant, never a shifted wall time.
  startTime: z.date(),
  guestEmail: z.string().trim().toLowerCase().email().max(254),
  guestName: z.string().trim().min(1, "Required").max(100),
  guestNotes: z.string().trim().max(2000).optional(),
  timezone: timezoneSchema,
})
export const meetingFormSchema = meetingSchemaBase.extend({ date: z.date() })
export const meetingActionSchema = meetingSchemaBase.extend({
  eventId: z.uuid(),
  clerkUserId: z.string().min(1).max(100),
  requestId: z.uuid(),
})
