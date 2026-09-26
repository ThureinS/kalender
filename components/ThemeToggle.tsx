"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const isDark = theme !== "light"
  const label = mounted ? `Switch to ${isDark ? "light" : "dark"} mode` : "Change theme"

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      disabled={!mounted}
      aria-label={label}
      title={label}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {mounted && !isDark ? <Moon className="size-4" aria-hidden="true" /> : <Sun className="size-4" aria-hidden="true" />}
    </Button>
  )
}
