"use server"

import { db } from "@/drizzle/db"
import { UserProfileTable } from "@/drizzle/schema"
import { slugify } from "@/lib/slugs"
import { profileFormSchema } from "@/schema/profiles"
import { auth } from "@clerk/nextjs/server"
import { and, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { z } from "zod"

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

export async function updateProfileHandle(clerkUserId: string, handle: string) {
  const [profile] = await db
    .update(UserProfileTable)
    .set({ handle })
    .where(eq(UserProfileTable.clerkUserId, clerkUserId))
    .returning()

  return profile
}

function normalizeProfileData(data: z.infer<typeof profileFormSchema>) {
  return {
    ...data,
    handle: slugify(data.handle),
    headline: data.headline || null,
    bio: data.bio || null,
    location: data.location || null,
  }
}

export async function updateCurrentUserProfile(
  unsafeData: z.infer<typeof profileFormSchema>
) {
  const { userId } = await auth()
  if (!userId) {
    throw new Error("You need to sign in before updating your Booking Page.")
  }

  const parsed = profileFormSchema.safeParse({
    ...unsafeData,
    handle: slugify(unsafeData.handle),
  })

  if (!parsed.success) {
    throw new Error("Check the Booking Page details and try again.")
  }

  const currentProfile = await getProfileByClerkUserId(userId)
  if (!currentProfile) {
    throw new Error("Create a profile before updating your Booking Page.")
  }

  const data = normalizeProfileData(parsed.data)
  const existingHandle = await db.query.UserProfileTable.findFirst({
    where: ({ handle, clerkUserId }, { and, eq, ne }) =>
      and(eq(handle, data.handle), ne(clerkUserId, userId)),
  })

  if (existingHandle) {
    throw new Error(
      "That Link Name is already taken. Choose a different Public URL."
    )
  }

  const [profile] = await db
    .update(UserProfileTable)
    .set(data)
    .where(eq(UserProfileTable.clerkUserId, userId))
    .returning()

  revalidatePath("/booking-page")
  revalidatePath("/events")
  revalidatePath(`/book/${currentProfile.handle}`)
  revalidatePath(`/book/${profile.handle}`)
  revalidatePath("/book/[handle]/[eventSlug]", "page")

  return profile
}
