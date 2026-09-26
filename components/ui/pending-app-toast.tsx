"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

import { appToast } from "@/lib/app-toast"

const toastMessages = {
  "event-created": "Event created.",
  "event-saved": "Event saved.",
} as const

type ToastKey = keyof typeof toastMessages

export function withAppToast(href: string, toast: ToastKey) {
  const hashIndex = href.indexOf("#")
  const beforeHash = hashIndex >= 0 ? href.slice(0, hashIndex) : href
  const hash = hashIndex >= 0 ? href.slice(hashIndex) : ""
  const separator = beforeHash.includes("?") ? "&" : "?"

  return `${beforeHash}${separator}toast=${toast}${hash}`
}


export function PendingAppToast() {
  const pathname = usePathname()

  useEffect(() => {
    const url = new URL(window.location.href)
    const toastKey = url.searchParams.get("toast")
    if (!toastKey || !(toastKey in toastMessages)) return

    appToast.success(toastMessages[toastKey as ToastKey])

    url.searchParams.delete("toast")
    const cleanUrl = `${url.pathname}${url.search}${url.hash}`
    window.history.replaceState(null, "", cleanUrl || pathname)
  }, [pathname])

  return null
}
