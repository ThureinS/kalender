"use server"

import { db } from "@/drizzle/db"
import { UserProfileTable } from "@/drizzle/schema"
import { slugify } from "@/lib/slugs"
import { profileFormSchema } from "@/schema/profiles"
import { auth } from "@clerk/nextjs/server"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { z } from "zod"

import { getProfileByClerkUserId } from "@/server/queries/profiles"

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
  revalidatePath("/onboarding")
  revalidatePath("/overview")
  revalidatePath("/events")
  revalidatePath(`/book/${currentProfile.handle}`)
  revalidatePath(`/book/${profile.handle}`)
  revalidatePath("/book/[handle]/[eventSlug]", "page")

  return profile
}
