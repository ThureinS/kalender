"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Copy, ExternalLink, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { appToast } from "@/lib/app-toast"

type LaunchActionsProps = {
  bookingPath: string
  disabled?: boolean
}

export function LaunchActions({ bookingPath, disabled = false }: LaunchActionsProps) {
  const [copied, setCopied] = useState(false)
  const publicUrl = useMemo(() => {
    if (typeof window === "undefined") return bookingPath
    return `${window.location.origin}${bookingPath}`
  }, [bookingPath])

  async function copyUrl() {
    await navigator.clipboard.writeText(publicUrl)
    setCopied(true)
    appToast.success("Booking URL copied.")
    window.setTimeout(() => setCopied(false), 1800)
  }

  async function shareUrl() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Book a time",
          url: publicUrl,
        })
        return
      }

      await copyUrl()
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return
      appToast.error("Sharing failed.", {
        description: "Copy the Booking URL instead.",
      })
    }
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <Button asChild variant="outline" disabled={!bookingPath}>
        <Link href={bookingPath || "/booking-page"} target="_blank">
          <ExternalLink className="size-4" />
          Preview
        </Link>
      </Button>
      <Button type="button" variant="outline" onClick={copyUrl} disabled={disabled}>
        <Copy className="size-4" />
        {copied ? "Copied" : "Copy"}
      </Button>
      <Button type="button" onClick={shareUrl} disabled={disabled}>
        <Share2 className="size-4" />
        Share
      </Button>
    </div>
  )
}
