import "server-only"
import { db } from "@/drizzle/db"
import { UserProfileTable } from "@/drizzle/schema"
import { slugify } from "@/lib/slugs"

export type UserProfile = typeof UserProfileTable.$inferSelect

type ClerkProfileSeed = {
  clerkUserId: string
  displayName?: string | null
  avatarUrl?: string | null
  email?: string | null
}

function fallbackHandle(clerkUserId: string) {
  return `user-${clerkUserId.replace(/^user_/, "").slice(0, 10).toLowerCase()}`
}

function baseHandle(seed: ClerkProfileSeed) {
  const emailName = seed.email?.split("@")[0]
  return (
    slugify(seed.displayName || "") ||
    slugify(emailName || "") ||
    fallbackHandle(seed.clerkUserId)
  )
}

async function getUniqueHandle(seed: ClerkProfileSeed) {
  const base = baseHandle(seed)

  for (let index = 0; index < 20; index++) {
    const handle = index === 0 ? base : `${base}-${index + 1}`
    const existing = await db.query.UserProfileTable.findFirst({
      where: ({ handle: handleColumn }, { eq }) => eq(handleColumn, handle),
    })

    if (!existing || existing.clerkUserId === seed.clerkUserId) {
      return handle
    }
  }

  return fallbackHandle(seed.clerkUserId)
}

export async function getProfileByHandle(handle: string) {
  return db.query.UserProfileTable.findFirst({
    where: ({ handle: handleColumn }, { eq }) => eq(handleColumn, handle),
  })
}

export async function getProfileByClerkUserId(clerkUserId: string) {
  return db.query.UserProfileTable.findFirst({
    where: ({ clerkUserId: clerkUserIdColumn }, { eq }) =>
      eq(clerkUserIdColumn, clerkUserId),
  })
}

export async function getOrCreateProfile(seed: ClerkProfileSeed) {
  const existing = await getProfileByClerkUserId(seed.clerkUserId)
  if (existing) return existing

  const [profile] = await db
    .insert(UserProfileTable)
    .values({
      clerkUserId: seed.clerkUserId,
      handle: await getUniqueHandle(seed),
      displayName: seed.displayName || "Kalender host",
      avatarUrl: seed.avatarUrl || null,
      headline: "Book a focused session without the scheduling back-and-forth.",
      bio: "Choose an event, pick a time that works, and Kalender will handle the confirmation details.",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
      location: "Online meetings",
      accent: "lime",
    })
    .onConflictDoUpdate({
      target: UserProfileTable.clerkUserId,
      set: {
        displayName: seed.displayName || "Kalender host",
        avatarUrl: seed.avatarUrl || null,
      },
    })
    .returning()

  return profile
}

