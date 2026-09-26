#!/usr/bin/env node

import nextEnv from "@next/env"
import { createClerkClient } from "@clerk/backend"

const { loadEnvConfig } = nextEnv

loadEnvConfig(process.cwd())

const args = new Set(process.argv.slice(2))

function printHelp() {
  console.log(`
Create shared visitor test accounts in development Clerk for the portfolio demo.
Never share the connected Calendar host's login.

Required environment:
  CLERK_SECRET_KEY                 Development secret key (sk_test_) for the target Clerk instance.
  KALENDER_DEMO_TESTER_PASSWORD     Shared password for the created demo accounts (min 8 characters).
  KALENDER_DEMO_TESTER_CONFIRM      Must be "create-demo-testers".

Optional environment:
  KALENDER_DEMO_TESTER_COUNT        Number of accounts to create. Defaults to 3.
  KALENDER_DEMO_TESTER_EMAIL_DOMAIN Email domain for created accounts. Defaults to "example.com".

An account with a matching email is reused without changing or verifying its
password. Verify sign-in before publishing any credentials. Addresses use
demo-tester-N+clerk_test@DOMAIN so development email-code verification can use
424242 without an inbox. Keep Clerk test mode enabled in development only.
Enter your own real email in the booking form for separately authorized Google
Calendar invitation testing, even with a shared demo login.

These visitor IDs are not host configuration. Any signed-in visitor may book
when KALENDER_BOOKING_MODE=demo, but only for KALENDER_DEMO_HOST_CLERK_USER_ID.
Verify accutility778@gmail.com's host ID separately in the target Clerk instance.
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
const domain = process.env.KALENDER_DEMO_TESTER_EMAIL_DOMAIN || "example.com"

if (!secretKey) {
  throw new Error("CLERK_SECRET_KEY is required.")
}

if (!secretKey.startsWith("sk_test_")) {
  throw new Error("Demo test-email accounts require a development Clerk secret key (sk_test_).")
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
  const email = `demo-tester-${index}+clerk_test@${domain}`
  const existing = await clerkClient.users.getUserList({ emailAddress: [email] })
  if (existing.data.length) {
    console.log(`Reusing existing ${email} -> ${existing.data[0].id} (password unchanged; verify sign-in)`)
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
  console.log(`\nDemo visitor IDs (not Calendar host configuration): ${ids.join(",")}`)
  console.log("Verify the dedicated host separately before setting KALENDER_BOOKING_MODE=demo and KALENDER_DEMO_HOST_CLERK_USER_ID.")
  console.log(
    `\nVerify sign-in for each demo-tester-N+clerk_test@${domain} before sharing its credentials. Reused accounts may have a different password.`
  )
  console.log("For development email-code verification, including new-device checks, use 424242.")
  console.log("To test invitations, enter your own real email in the booking form. The login email can stay a demo address.")
}

main().catch(error => {
  console.error(error.message || error)
  process.exit(1)
})
