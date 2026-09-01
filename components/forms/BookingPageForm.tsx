"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  CheckCircle2,
  Copy,
  ExternalLink,
  Globe2,
  LinkIcon,
  MapPin,
  Palette,
  Save,
  UserRound,
} from "lucide-react"
import { useForm, useWatch } from "react-hook-form"
import type { Resolver } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { formatTimezoneOffset } from "@/lib/formatters"
import { getProfileAccentStyle, PROFILE_ACCENTS } from "@/lib/profileAccent"
import { slugify } from "@/lib/slugs"
import { profileFormSchema } from "@/schema/profiles"
import { updateCurrentUserProfile } from "@/server/actions/profiles"

type FormValues = z.infer<typeof profileFormSchema>

type BookingPageFormProps = {
  profile: FormValues & {
    avatarUrl?: string | null
  }
}

const resolver = zodResolver(profileFormSchema) as Resolver<FormValues, any>

function getInitials(displayName: string) {
  return (
    displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part[0]?.toUpperCase())
      .join("") || "K"
  )
}

export default function BookingPageForm({ profile }: BookingPageFormProps) {
  const [origin, setOrigin] = useState("")

  const form = useForm<FormValues>({
    resolver,
    defaultValues: {
      displayName: profile.displayName,
      handle: profile.handle,
      headline: profile.headline ?? "",
      bio: profile.bio ?? "",
      timezone: profile.timezone,
      location: profile.location ?? "",
      accent: profile.accent,
    },
  })

  const values = useWatch({ control: form.control })
  const preview = {
    displayName: values.displayName || "Kalender host",
    handle: slugify(values.handle || profile.handle) || profile.handle,
    headline:
      values.headline ||
      "Book a focused session without the scheduling back-and-forth.",
    bio:
      values.bio ||
      "Choose an event, pick a time that works, and Kalender will handle the confirmation details.",
    timezone: values.timezone || profile.timezone,
    location: values.location || "Online meetings",
    accent: values.accent || profile.accent,
  }

  const publicPath = `/book/${preview.handle}`
  const publicUrl = `${origin}${publicPath}`
  const initials = getInitials(preview.displayName)
  const accentOptions = useMemo(() => Object.values(PROFILE_ACCENTS), [])

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  async function copyPublicUrl() {
    await navigator.clipboard.writeText(publicUrl)
    toast("Public URL copied.")
  }

  async function onSubmit(data: FormValues) {
    try {
      const updatedProfile = await updateCurrentUserProfile(data)
      form.reset({
        displayName: updatedProfile.displayName,
        handle: updatedProfile.handle,
        headline: updatedProfile.headline ?? "",
        bio: updatedProfile.bio ?? "",
        timezone: updatedProfile.timezone,
        location: updatedProfile.location ?? "",
        accent: updatedProfile.accent as FormValues["accent"],
      })
      toast("Booking Page saved.")
    } catch (error: any) {
      const message =
        error?.message ||
        "There was an error saving your Booking Page. Try again."
      form.setError("root", { message })

      if (message.includes("Link Name")) {
        form.setError("handle", { message })
      }
    }
  }

  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <Card>
        <CardHeader>
          <CardTitle>Public Identity</CardTitle>
          <CardDescription>
            These details appear on your public Booking Link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="flex flex-col gap-6" onSubmit={form.handleSubmit(onSubmit)}>
              {form.formState.errors.root && (
                <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                  {form.formState.errors.root.message}
                </div>
              )}

              <div className="rounded-lg border border-border/80 bg-surface-subtle p-4">
                <FormLabel>Avatar Preview</FormLabel>
                <div className="mt-3 flex items-center gap-4">
                  <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary font-display text-lg font-semibold text-primary-foreground">
                    {profile.avatarUrl ? (
                      <img
                        src={profile.avatarUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">
                    Kalender uses your account avatar for the public preview.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Khana U Thone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="handle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="khana-u-thone"
                          {...field}
                          onBlur={event => {
                            field.onChange(slugify(event.target.value))
                            field.onBlur()
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Sets your Public URL at {origin || "this site"}/book/link-name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="headline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Headline</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Strategy calls for founders and operators"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea className="min-h-28 resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="timezone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Timezone</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Intl.supportedValuesOf("timeZone").map(timezone => (
                            <SelectItem key={timezone} value={timezone}>
                              {timezone} ({formatTimezoneOffset(timezone)})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Online meetings" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="accent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Accent</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {accentOptions.map(accent => {
                          const selected = field.value === accent.value

                          return (
                            <button
                              key={accent.value}
                              type="button"
                              aria-pressed={selected}
                              onClick={() => field.onChange(accent.value)}
                              className="flex h-10 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm transition-colors hover:bg-accent aria-pressed:border-ring aria-pressed:ring-2 aria-pressed:ring-ring/30"
                            >
                              <span
                                className="size-3 rounded-full"
                                style={{ background: accent.primary }}
                              />
                              {accent.label}
                            </button>
                          )
                        })}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Accent applies to your public Booking Page only.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-3 border-t border-border/80 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">Public URL</p>
                  <p className="truncate font-mono text-xs text-muted-foreground">
                    {publicUrl || publicPath}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button type="button" variant="outline" onClick={copyPublicUrl}>
                    <Copy className="size-4" />
                    Copy
                  </Button>
                  <Button type="button" variant="outline" asChild>
                    <Link href={publicPath} target="_blank">
                      <ExternalLink className="size-4" />
                      Open
                    </Link>
                  </Button>
                  <Button disabled={form.formState.isSubmitting} type="submit">
                    <Save className="size-4" />
                    Save
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Preview
            </p>
            <h2 className="mt-1 font-display text-xl font-semibold tracking-normal">
              Booking Page
            </h2>
          </div>
          <LinkIcon className="size-5 text-muted-foreground" />
        </div>

        <div
          data-kalender-theme="midnight"
          style={getProfileAccentStyle(preview.accent)}
          className="overflow-hidden rounded-lg border border-border/80 bg-storefront-background text-foreground shadow-xs"
        >
          <div className="relative bg-storefront-rail p-5">
            <div className="pointer-events-none absolute inset-x-8 top-5 h-20 rounded-full bg-primary/20 blur-3xl" />
            <div className="relative">
              <div className="flex size-16 items-center justify-center overflow-hidden rounded-full bg-primary font-display text-xl font-semibold text-primary-foreground shadow-[0_0_36px_-10px_var(--primary)]">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>
              <p className="mt-5 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Booking Page
              </p>
              <h3 className="mt-1 break-words font-display text-3xl font-semibold tracking-normal">
                {preview.displayName}
              </h3>
              <p className="mt-4 text-base font-medium leading-7">
                {preview.headline}
              </p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {preview.bio}
              </p>

              <div className="mt-6 space-y-3 border-t border-border/80 pt-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 text-primary" />
                  {preview.location}
                </div>
                <div className="flex items-center gap-2">
                  <Globe2 className="size-4 text-primary" />
                  {preview.timezone}
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-border/80 px-3 py-1.5 font-mono text-xs">
                  <span className="size-2 rounded-full bg-primary shadow-[0_0_8px_2px_var(--primary)]" />
                  Open for scheduling
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 p-4">
            <div className="rounded-lg border border-border/80 bg-card p-4 text-card-foreground">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    Available Events
                  </p>
                  <p className="mt-1 truncate text-lg font-semibold">
                    Choose a time to meet
                  </p>
                </div>
                <Palette className="size-4 shrink-0 text-primary" />
              </div>
            </div>
            <div className="rounded-lg border border-border/80 bg-card p-4 text-card-foreground">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-display text-lg font-semibold">
                    Discovery Call
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    A focused 30 minute session for next steps.
                  </p>
                </div>
                <UserRound className="size-5 shrink-0 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-2 px-1 pb-1 font-mono text-xs text-muted-foreground">
              <CheckCircle2 className="size-3.5 text-primary" />
              {publicPath}
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}
