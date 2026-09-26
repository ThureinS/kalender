import "server-only"

// Production and development have different host identities in the shared DB.
// Keep their demo profiles separate and point the landing page at the right one.
export function getDemoProfilePath() {
  const handle = process.env.KALENDER_DEMO_PROFILE_HANDLE?.trim() || "demo-strategy-studio"
  return `/book/${encodeURIComponent(handle)}`
}
