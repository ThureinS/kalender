import "server-only"

// Intentionally shared visitor credentials, authorized for the portfolio demo.
// Never substitute host credentials or service keys here.
const demoVisitorAccess = {
  "emails": [
    "demo-tester-1+clerk_test@example.com",
    "demo-tester-2+clerk_test@example.com",
    "demo-tester-3+clerk_test@example.com"
  ],
  "password": "Aa9!Tv__ZajQ_8U4xfxuDWMYcqbU",
  "verificationCode": "424242"
}

export function getDemoVisitorAccess() {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? ""
  if (process.env.KALENDER_BOOKING_MODE !== "demo" ||
      process.env.KALENDER_DEMO_HOST_CLERK_USER_ID !== "user_3Im9W7uEWVIJYnoULDo0EIvCM23" ||
      !key.startsWith("pk_test_")) return null

  const domain = Buffer.from(key.slice("pk_test_".length), "base64").toString("utf8")
  if (domain !== "included-garfish-63.clerk.accounts.dev$") return null
  return demoVisitorAccess
}
