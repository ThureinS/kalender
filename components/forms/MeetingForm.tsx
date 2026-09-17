// This React component, `MeetingForm`, is a client-side form built with `react-hook-form` and `zod` validation, allowing users to schedule a meeting by selecting a timezone, date, and time, and providing their name, email, and optional notes. It uses various custom UI components (like `Select`, `Calendar`, and `Popover`) for a smooth user experience. The form filters available meeting times (`validTimes`) based on the user's selected timezone and date, ensuring only valid options are shown. Upon submission, it sends the form data along with the `eventId` and `clerkUserId` to a backend function (`createMeeting`) to create the meeting, and handles any server-side errors by displaying them in the UI.

"use client"
import { meetingFormSchema } from "@/schema/meetings"
import { createMeeting } from "@/server/actions/meetings"
import { zodResolver } from "@hookform/resolvers/zod"
import { formatInTimeZone, toZonedTime } from "date-fns-tz"
import { useRouter } from "next/navigation"
import type { ReactNode } from "react"
import { useEffect, useMemo, useRef } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { formatDate, formatTimeString, formatTimezoneOffset } from "@/lib/formatters"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"
import { CalendarCheck2, Check, Clock, Globe2, Mail, UserRound } from "lucide-react"
import { Calendar } from "../ui/calendar"
import { isSameDay } from "date-fns"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import Link from "next/link"
import Booking from "../Booking"

 // Enables client-side rendering for this component

function BookingStep({
  icon,
  title,
  description,
  children,
}: {
  icon: ReactNode
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <section className="rounded-lg border border-border/80 bg-card p-4 shadow-[0_0_28px_-24px_var(--primary)] sm:p-5">
      <div className="mb-4 flex gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border/80 bg-background text-primary">
          {icon}
        </div>
        <div>
          <h3 className="font-display text-base font-semibold tracking-normal text-foreground">
            {title}
          </h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
      {children}
    </section>
  )
}

export default function MeetingForm({
    validTimes,
    bookingEnabled,
    eventId,
    clerkUserId,
    profileHandle,
    eventSlug,
  }: {
    bookingEnabled: boolean
    validTimes: Date[] // Predefined list of available times
    eventId: string     // ID of the event to associate with the meeting
    clerkUserId: string // User ID from authentication system
    profileHandle: string
    eventSlug: string
  }) {

    const router = useRouter()
    const requestId = useRef<string | null>(null)
    const defaultTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const defaultDate = validTimes[0]
      ? toZonedTime(validTimes[0], defaultTimezone)
      : undefined

        // Initialize form using React Hook Form and Zod schema
   // Create a form using React Hook Form with Zod for validation
    const form = useForm<z.infer<typeof meetingFormSchema>>({
        // Use zodResolver to connect Zod schema to React Hook Form
        resolver: zodResolver(meetingFormSchema),
    
        // Set initial default values for the form fields
        defaultValues: {
        // Automatically detect the user's local timezone
        timezone: defaultTimezone,
        date: defaultDate,
    
        // Start with empty fields for guest info
        guestName: "",
        guestEmail: "",
        guestNotes: "",
        },
    })

    // Watch timezone and selected date fields for updates
    const timezone = form.watch("timezone")
    const date = form.watch("date")
    const startTime = form.watch("startTime")
    const guestName = form.watch("guestName")
    const guestEmail = form.watch("guestEmail")
    const canSubmit =
      bookingEnabled &&
      Boolean(startTime) &&
      guestName.trim().length > 0 &&
      z.string().email().safeParse(guestEmail).success

        // Convert valid times to the selected timezone
    const validTimesInTimezone = useMemo(() => {
        return validTimes.map(date => toZonedTime(date, timezone))
    }, [validTimes, timezone])

    const selectedDateTimes = useMemo(() => {
      if (!date) return []

      return validTimes.filter(time => isSameDay(toZonedTime(time, timezone), date))
    }, [date, validTimes, timezone])

    useEffect(() => {
      const firstAvailableDate = validTimesInTimezone[0]
      if (!firstAvailableDate) return

      const selectedDateHasSlots =
        date && validTimesInTimezone.some(time => isSameDay(time, date))

      if (!selectedDateHasSlots) {
        form.setValue("date", firstAvailableDate, { shouldValidate: true })
        form.resetField("startTime")
      }
    }, [date, form, validTimesInTimezone])

    // Handle form submission
    async function onSubmit(values: z.infer<typeof meetingFormSchema>) {
        try {
        // Call the createMeeting action (assuming it handles success/failure internally)
        const meetingData =  await createMeeting({
            ...values,
            requestId: requestId.current ?? (requestId.current = crypto.randomUUID()),
            eventId,
            clerkUserId,
        })

            if ("error" in meetingData) {
              form.setError("root", { message: meetingData.error })
              return
            }

            // The receipt is backed by a persisted booking.
            const path = `/book/${profileHandle}/${eventSlug}/success?bookingId=${meetingData.bookingId}`;
            router.push(path)
    
        } catch {
        // Handle any error that occurs during the meeting creation
        form.setError("root", {
            message: "We could not confirm your booking. Retry with the same details.",
        })
        }
    }

        if (form.formState.isSubmitting) return <Booking/>



        return (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-5"
              >
                {!bookingEnabled && (
                  <p className="rounded-md border border-border bg-muted p-3 text-sm text-muted-foreground">
                    Portfolio preview. Live bookings are limited to approved demo testers.
                  </p>
                )}
                {/* Show root error message if form submission fails */}
                {form.formState.errors.root && (
                  <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {form.formState.errors.root.message}
                  </div>
                )}
        
                <div className="grid gap-3 rounded-lg border border-border/80 bg-surface-subtle/30 p-3 text-sm text-muted-foreground sm:grid-cols-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <Globe2 className="size-4 text-primary" />
                    <span className="truncate">{timezone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarCheck2 className="size-4 text-primary" />
                    <span>{date ? formatDate(date) : "Choose a date"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-primary" />
                    <span>{startTime ? formatTimeString(toZonedTime(startTime, timezone)) : "Choose a time"}</span>
                  </div>
                </div>

                <BookingStep
                  icon={<Globe2 className="size-4" />}
                  title="Confirm your timezone"
                  description="Available slots are adjusted to your local time before you book."
                >
                  <FormField
                    control={form.control}
                    name="timezone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Timezone</FormLabel>
                        <Select
                          onValueChange={value => {
                            field.onChange(value)
                            form.resetField("startTime")
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-11 w-full">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-80">
                            {/* Show time options only for the selected day */}
                            {Intl.supportedValuesOf("timeZone").map(timezone => (
                              <SelectItem key={timezone} value={timezone}>
                                {timezone}
                                {` (${formatTimezoneOffset(timezone)})`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </BookingStep>
        
                <BookingStep
                  icon={<Clock className="size-4" />}
                  title="Choose a slot"
                  description="Dates without availability are disabled. Pick any visible start time."
                >
                  <div className="grid gap-5 lg:grid-cols-[minmax(17rem,0.9fr)_minmax(0,1fr)]">
                    {/* Date picker field */}
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <div className="overflow-hidden rounded-lg border border-border/80 bg-background">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={selectedDate => {
                                field.onChange(selectedDate)
                                form.resetField("startTime")
                              }}
                              disabled={date =>
                                // Only allow selecting dates that have available time slots
                                !validTimesInTimezone.some(time =>
                                  isSameDay(date, time)
                                )
                              }
                              initialFocus
                              className="mx-auto"
                            />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Time selection field */}
                    <FormField
                      control={form.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time</FormLabel>
                          <div className="max-h-96 min-h-72 overflow-y-auto rounded-lg border border-border/80 bg-background p-3">
                            {date == null ? (
                              <div className="flex h-full min-h-48 items-center justify-center rounded-md border border-dashed border-border/80 px-4 text-center text-sm text-muted-foreground">
                                Select a date to see available times.
                              </div>
                            ) : selectedDateTimes.length === 0 ? (
                              <div className="flex h-full min-h-48 items-center justify-center rounded-md border border-dashed border-border/80 px-4 text-center text-sm text-muted-foreground">
                                No slots are available on {formatDate(date)}.
                              </div>
                            ) : (
                              <FormControl>
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                                  {selectedDateTimes.map(time => {
                                    const selected =
                                      field.value?.toISOString() === time.toISOString()

                                    return (
                                      <Button
                                        key={time.toISOString()}
                                        type="button"
                                        variant={selected ? "default" : "outline"}
                                        className={cn(
                                          "h-11 justify-between font-mono",
                                          selected &&
                                            "shadow-[0_0_20px_-8px_var(--primary)]"
                                        )}
                                        onClick={() => field.onChange(time)}
                                      >
                                        {formatInTimeZone(time, timezone, "h:mm a zzz")}
                                        {selected && <Check className="size-4" />}
                                      </Button>
                                    )
                                  })}
                                </div>
                              </FormControl>
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </BookingStep>

                <BookingStep
                  icon={<UserRound className="size-4" />}
                  title="Add your details"
                  description="The host will receive your contact information and notes."
                >
                <div className="flex flex-col gap-4 md:flex-row">
                  {/* Guest name input */}
                  <FormField
                    control={form.control}
                    name="guestName"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Your Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Jane Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
        
                  {/* Guest email input */}
                  <FormField
                    control={form.control}
                    name="guestEmail"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Your Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="jane@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
        
                {/* Optional notes textarea */}
                <FormField
                  control={form.control}
                  name="guestNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          className="min-h-24 resize-none"
                          placeholder="Anything the host should know before the call?"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                    )}
                  />
                </BookingStep>

                {/* Cancel and Submit buttons */}
                <div className="flex flex-col gap-4 rounded-lg border border-border/80 bg-surface-subtle/30 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-start gap-3 text-sm">
                    <Mail className="mt-0.5 size-4 shrink-0 text-primary" />
                    <div className="min-w-0">
                      <p className="font-medium text-foreground">
                        {startTime
                          ? `${formatDate(toZonedTime(startTime, timezone))} at ${formatTimeString(toZonedTime(startTime, timezone))}`
                          : "Select a time to finish booking"}
                      </p>
                      <p className="mt-1 text-muted-foreground">
                        A confirmation email will be sent after booking.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <Button
                    disabled={form.formState.isSubmitting}
                    type="button"
                    asChild
                    variant="outline"
                  >
                    <Link href={`/book/${profileHandle}`}>Cancel</Link>
                  </Button>
                  <Button
                    disabled={form.formState.isSubmitting || !canSubmit}
                    type="submit"
                  >
                    Confirm booking
                  </Button>
                  </div>
                </div>
              </form>
            </Form>
          )



  }
