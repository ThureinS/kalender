#!/usr/bin/env node

import nextEnv from "@next/env"
import { neon } from "@neondatabase/serverless"
import { randomUUID } from "node:crypto"

const { loadEnvConfig } = nextEnv

loadEnvConfig(process.cwd())

const args = new Set(process.argv.slice(2))

function printHelp() {
  console.log(`
Seed a curated Kalender demo workspace.

Required environment:
  KALENDER_DEMO_CLERK_USER_ID       Clerk user id for the demo/test account.
  KALENDER_DEMO_SEED_CONFIRM        Must be "replace-demo-owner".

Optional environment:
  KALENDER_DEMO_HANDLE              Defaults to "demo-strategy-studio".
  KALENDER_DEMO_BASE_DATE           YYYY-MM-DD anchor date. Defaults to today.

This script replaces profile, schedule, events, and bookings only for the
configured demo Clerk user id. Use a dedicated Clerk test user, not a real
personal account.
`)
}

if (args.has("--help") || args.has("-h")) {
  printHelp()
  process.exit(0)
}

const databaseUrl = process.env.DATABASE_URL
const clerkUserId = process.env.KALENDER_DEMO_CLERK_USER_ID
const confirm = process.env.KALENDER_DEMO_SEED_CONFIRM
const handle = process.env.KALENDER_DEMO_HANDLE || "demo-strategy-studio"
const baseDateInput = process.env.KALENDER_DEMO_BASE_DATE

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required.")
}

if (!clerkUserId) {
  throw new Error("KALENDER_DEMO_CLERK_USER_ID is required.")
}

if (confirm !== "replace-demo-owner") {
  throw new Error(
    'Refusing to seed without KALENDER_DEMO_SEED_CONFIRM="replace-demo-owner".'
  )
}

if (!handle.startsWith("demo-")) {
  throw new Error('KALENDER_DEMO_HANDLE must start with "demo-".')
}

const sql = neon(databaseUrl)
const baseDate = baseDateInput ? new Date(`${baseDateInput}T12:00:00Z`) : new Date()

if (Number.isNaN(baseDate.getTime())) {
  throw new Error("KALENDER_DEMO_BASE_DATE must be a valid YYYY-MM-DD date.")
}

function addDays(date, days) {
  const next = new Date(date)
  next.setUTCDate(next.getUTCDate() + days)
  return next
}

function utcAt(daysFromBase, hour, minute = 0) {
  const date = addDays(baseDate, daysFromBase)
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), hour, minute)
  )
}

function minutesAfter(date, minutes) {
  return new Date(date.getTime() + minutes * 60 * 1000)
}

function eventSeed({
  name,
  slug,
  description,
  durationInMinutes,
  location,
  bufferMinutes,
}) {
  return {
    id: randomUUID(),
    name,
    slug,
    description,
    durationInMinutes,
    location,
    visibility: "public",
    bufferMinutes,
    clerkUserId,
    isActive: true,
  }
}

function bookingSeed({
  event,
  guestName,
  guestEmail,
  guestNotes,
  startTime,
  status = "confirmed",
}) {
  return {
    id: randomUUID(),
    clerkUserId,
    eventId: event.id,
    eventName: event.name,
    eventSlug: event.slug,
    eventDurationInMinutes: event.durationInMinutes,
    eventLocation: event.location,
    guestName,
    guestEmail,
    guestNotes,
    timezone: "America/New_York",
    startTime,
    endTime: minutesAfter(startTime, event.durationInMinutes),
    googleCalendarEventId: `demo-${randomUUID()}`,
    googleCalendarHtmlLink: null,
    status,
  }
}

const events = [
  eventSeed({
    name: "Strategy Sprint",
    slug: "strategy-sprint",
    description:
      "A focused working session for sharpening an offer, launch plan, or client acquisition path.",
    durationInMinutes: 45,
    location: "Google Meet",
    bufferMinutes: 15,
  }),
  eventSeed({
    name: "Portfolio Review",
    slug: "portfolio-review",
    description:
      "A practical critique session for positioning, case studies, and presentation flow.",
    durationInMinutes: 30,
    location: "Google Meet",
    bufferMinutes: 10,
  }),
  eventSeed({
    name: "Deep Work Planning",
    slug: "deep-work-planning",
    description:
      "Plan the next operating cadence, weekly blocks, and accountability checkpoints.",
    durationInMinutes: 60,
    location: "Google Meet",
    bufferMinutes: 15,
  }),
]

const bookings = [
  bookingSeed({
    event: events[0],
    guestName: "Maya Chen",
    guestEmail: "maya.chen@example.test",
    guestNotes: "Review launch priorities before the Q4 campaign starts.",
    startTime: utcAt(3, 15, 0),
  }),
  bookingSeed({
    event: events[1],
    guestName: "Jon Bell",
    guestEmail: "jon.bell@example.test",
    guestNotes: "Looking for feedback on two case-study drafts.",
    startTime: utcAt(10, 18, 30),
  }),
  bookingSeed({
    event: events[2],
    guestName: "Priya Shah",
    guestEmail: "priya.shah@example.test",
    guestNotes: "Wants to turn a loose weekly plan into protected blocks.",
    startTime: utcAt(24, 16, 0),
  }),
  bookingSeed({
    event: events[0],
    guestName: "Andre Lewis",
    guestEmail: "andre.lewis@example.test",
    guestNotes: "Completed offer review and next-step prioritization.",
    startTime: utcAt(-8, 17, 0),
  }),
  bookingSeed({
    event: events[1],
    guestName: "Nora Patel",
    guestEmail: "nora.patel@example.test",
    guestNotes: "Walked through portfolio structure and homepage messaging.",
    startTime: utcAt(-31, 14, 30),
  }),
  bookingSeed({
    event: events[2],
    guestName: "Sam Rivera",
    guestEmail: "sam.rivera@example.test",
    guestNotes: "Canceled after moving the planning work in-house.",
    startTime: utcAt(-47, 19, 0),
    status: "canceled",
  }),
  bookingSeed({
    event: events[0],
    guestName: "Elena Brooks",
    guestEmail: "elena.brooks@example.test",
    guestNotes: "Original session moved to a later week after priorities changed.",
    startTime: utcAt(-72, 16, 30),
    status: "rescheduled",
  }),
  bookingSeed({
    event: events[1],
    guestName: "Theo Morgan",
    guestEmail: "theo.morgan@example.test",
    guestNotes: "Reviewed proof points and portfolio narrative.",
    startTime: utcAt(-118, 15, 30),
  }),
]

async function main() {
  console.log(`Seeding demo workspace for ${clerkUserId} with handle ${handle}.`)

  await sql.query('delete from "bookings" where "clerkUserId" = $1', [clerkUserId])
  await sql.query('delete from "events" where "clerkUserId" = $1', [clerkUserId])
  await sql.query('delete from "schedules" where "clerkUserId" = $1', [clerkUserId])
  await sql.query('delete from "userProfiles" where "clerkUserId" = $1', [clerkUserId])

  await sql.query(
    `insert into "userProfiles" (
      "clerkUserId", "handle", "displayName", "avatarUrl", "headline", "bio",
      "timezone", "location", "accent"
    ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      clerkUserId,
      handle,
      "Avery Stone",
      null,
      "Independent product strategist for sharper launches and calmer client pipelines.",
      "I help solo operators turn scattered priorities into focused execution plans, from positioning and portfolio story to weekly operating cadence.",
      "America/New_York",
      "Brooklyn, NY",
      "lime",
    ]
  )

  const scheduleId = randomUUID()
  await sql.query(
    'insert into "schedules" ("id", "timezone", "clerkUserId") values ($1, $2, $3)',
    [scheduleId, "America/New_York", clerkUserId]
  )

  const availabilityRows = [
    ["monday", "09:00", "12:00"],
    ["monday", "13:00", "16:30"],
    ["tuesday", "10:00", "14:00"],
    ["wednesday", "09:30", "12:30"],
    ["thursday", "13:00", "17:00"],
  ]

  for (const [dayOfWeek, startTime, endTime] of availabilityRows) {
    await sql.query(
      `insert into "scheduleAvailabilities" (
        "id", "scheduleId", "dayOfWeek", "startTime", "endTime"
      ) values ($1, $2, $3, $4, $5)`,
      [randomUUID(), scheduleId, dayOfWeek, startTime, endTime]
    )
  }

  for (const event of events) {
    await sql.query(
      `insert into "events" (
        "id", "name", "slug", "description", "durationInMinutes", "location",
        "visibility", "bufferMinutes", "clerkUserId", "isActive"
      ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        event.id,
        event.name,
        event.slug,
        event.description,
        event.durationInMinutes,
        event.location,
        event.visibility,
        event.bufferMinutes,
        event.clerkUserId,
        event.isActive,
      ]
    )
  }

  for (const booking of bookings) {
    await sql.query(
      `insert into "bookings" (
        "id", "clerkUserId", "eventId", "eventName", "eventSlug",
        "eventDurationInMinutes", "eventLocation", "guestName", "guestEmail",
        "guestNotes", "timezone", "startTime", "endTime",
        "googleCalendarEventId", "googleCalendarHtmlLink", "status"
      ) values (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
      )`,
      [
        booking.id,
        booking.clerkUserId,
        booking.eventId,
        booking.eventName,
        booking.eventSlug,
        booking.eventDurationInMinutes,
        booking.eventLocation,
        booking.guestName,
        booking.guestEmail,
        booking.guestNotes,
        booking.timezone,
        booking.startTime,
        booking.endTime,
        booking.googleCalendarEventId,
        booking.googleCalendarHtmlLink,
        booking.status,
      ]
    )
  }

  console.log(
    `Seeded ${events.length} events, ${availabilityRows.length} availability windows, and ${bookings.length} bookings.`
  )
}

main().catch(error => {
  console.error(error.message || error)
  process.exit(1)
})
