import { z } from "zod"

export const timezoneSchema = z.string().trim().min(1).max(100).refine(value => {
  try {
    new Intl.DateTimeFormat("en", { timeZone: value }).format()
    return true
  } catch {
    return false
  }
}, "Choose a supported timezone")
