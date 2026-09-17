import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"

const manifest = JSON.parse(await readFile(".next/server/server-reference-manifest.json", "utf8"))
const allowed = new Set([
  "createMeeting", "createEvent", "updateEvent", "deleteEvent", "saveSchedule", "updateCurrentUserProfile",
  // Actions supplied by the installed Clerk SDK.
  "deleteKeylessAction", "invalidateCacheAction",
])
for (const action of Object.values(manifest.node)) {
  assert(allowed.has(action.exportedName), `Unexpected public Server Action: ${action.exportedName}`)
}
assert(Object.values(manifest.node).some(action => action.exportedName === "createMeeting"))
const paths = JSON.parse(await readFile(".next/server/app-paths-manifest.json", "utf8"))
assert(!Object.keys(paths).some(path => path.includes("theme-lab")), "Theme Lab must remain retired")
console.log("Compiled action boundary and retired-route checks passed.")
