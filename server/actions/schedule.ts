"use server"

import { db } from "@/drizzle/db"
import { ScheduleAvailabilityTable, ScheduleTable } from "@/drizzle/schema"
import { scheduleFormSchema } from "@/schema/schedule"
import { auth } from "@clerk/nextjs/server"
import { eq, sql } from "drizzle-orm"
import { BatchItem } from "drizzle-orm/batch"
import { revalidatePath } from "next/cache"
import { z } from "zod"

export async function saveSchedule(unsafeData: z.infer<typeof scheduleFormSchema>) {
  const { userId } = await auth()
  const parsed = scheduleFormSchema.safeParse(unsafeData)
  if (!userId || !parsed.success) throw new Error("Invalid schedule or authentication.")
  const { availabilities, timezone } = parsed.data
  const scheduleId = sql`(select "id" from "schedules" where "clerkUserId" = ${userId})`
  // The upsert locks the owner's schedule before replacing its windows. All
  // statements, including the timezone update, commit or roll back together.
  const statements: [BatchItem<"pg">, ...BatchItem<"pg">[]] = [
    db.insert(ScheduleTable).values({ clerkUserId: userId, timezone })
      .onConflictDoUpdate({ target: ScheduleTable.clerkUserId, set: { timezone } }),
    db.delete(ScheduleAvailabilityTable).where(eq(ScheduleAvailabilityTable.scheduleId, scheduleId)),
  ]
  if (availabilities.length) {
    statements.push(db.insert(ScheduleAvailabilityTable).values(
      availabilities.map(availability => ({ ...availability, scheduleId }))
    ))
  }
  await db.batch(statements)
  for (const path of ["/schedule", "/onboarding", "/overview"]) revalidatePath(path)
  revalidatePath("/book", "layout")
}
