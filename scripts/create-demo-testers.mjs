#!/usr/bin/env node

import nextEnv from "@next/env"
import { createClerkClient } from "@clerk/backend"

const { loadEnvConfig } = nextEnv

loadEnvConfig(process.cwd())

const args = new Set(process.argv.slice(2))

function printHelp() {
  console.log(`
Create dedicated demo tester accounts in Clerk for portfolio-demo bookings.

Required environment:
  CLERK_SECRET_KEY                 Secret key for the target Clerk instance.
  KALENDER_DEMO_TESTER_PASSWORD     Shared password for the created demo accounts (min 8 characters).
  KALENDER_DEMO_TESTER_CONFIRM      Must be "create-demo-testers".

Optional environment:
  KALENDER_DEMO_TESTER_COUNT        Number of accounts to create. Defaults to 3.
  KALENDER_DEMO_TESTER_EMAIL_DOMAIN Email domain for created accounts. Defaults to "kalender.test".

An account with a matching email is reused, not recreated, so this is safe to
re-run. Prints the resulting Clerk user ids as a ready-to-paste
KALENDER_DEMO_BOOKER_IDS value for the deployment environment.
`)
}

if (args.has("--help") || args.has("-h")) {
  printHelp()
  process.exit(0)
}

const secretKey = process.env.CLERK_SECRET_KEY
const password = process.env.KALENDER_DEMO_TESTER_PASSWORD
const confirm = process.env.KALENDER_DEMO_TESTER_CONFIRM
const count = Number(process.env.KALENDER_DEMO_TESTER_COUNT || "3")
const domain = process.env.KALENDER_DEMO_TESTER_EMAIL_DOMAIN || "kalender.test"

if (!secretKey) {
  throw new Error("CLERK_SECRET_KEY is required.")
}

if (!password || password.length < 8) {
  throw new Error("KALENDER_DEMO_TESTER_PASSWORD is required and must be at least 8 characters.")
}

if (confirm !== "create-demo-testers") {
  throw new Error(
    'Refusing to run without KALENDER_DEMO_TESTER_CONFIRM="create-demo-testers".'
  )
}

if (!Number.isInteger(count) || count < 1 || count > 10) {
  throw new Error("KALENDER_DEMO_TESTER_COUNT must be an integer between 1 and 10.")
}

const clerkClient = createClerkClient({ secretKey })

async function ensureTester(index) {
  const email = `demo-tester-${index}@${domain}`
  const existing = await clerkClient.users.getUserList({ emailAddress: [email] })
  if (existing.data.length) {
    console.log(`Reusing existing ${email} -> ${existing.data[0].id}`)
    return existing.data[0].id
  }
  const user = await clerkClient.users.createUser({
    emailAddress: [email],
    password,
    firstName: "Demo",
    lastName: `Tester ${index}`,
  })
  console.log(`Created ${email} -> ${user.id}`)
  return user.id
}

async function main() {
  const ids = []
  for (let index = 1; index <= count; index += 1) {
    ids.push(await ensureTester(index))
  }
  console.log("\nSet these in the deployment environment:")
  console.log("KALENDER_BOOKING_MODE=testers")
  console.log(`KALENDER_DEMO_BOOKER_IDS=${ids.join(",")}`)
  console.log(
    `\nShare each demo-tester-N@${domain} address with the shared password you set in KALENDER_DEMO_TESTER_PASSWORD.`
  )
}

main().catch(error => {
  console.error(error.message || error)
  process.exit(1)
})
