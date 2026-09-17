import { execFileSync, spawnSync } from "node:child_process"
import { expect, it } from "vitest"

it("documents the seed without touching a database", () => {
  expect(execFileSync(process.execPath, ["scripts/seed-demo.mjs", "--help"], { encoding: "utf8" })).toContain("replace-demo-owner")
})
it("refuses destructive seeding without explicit owner confirmation", () => {
  const result = spawnSync(process.execPath, ["scripts/seed-demo.mjs"], {
    encoding: "utf8", env: { ...process.env, DATABASE_URL: "postgresql://invalid:invalid@localhost/unused",
      KALENDER_DEMO_CLERK_USER_ID: "user_test", KALENDER_DEMO_SEED_CONFIRM: "" },
  })
  expect(result.status).not.toBe(0)
  expect(result.stderr).toContain("Refusing to seed")
})
