'use client'

import { createEvent, deleteEvent, updateEvent } from "@/server/actions/events"
import { eventFormSchema } from "@/schema/events"
import { formatEventDescription } from "@/lib/formatters"
import { slugify } from "@/lib/slugs"
import { appToast } from "@/lib/app-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    CalendarClock,
    CheckCircle2,
    Clock3,
    Eye,
    EyeOff,
    Link2,
    MapPin,
    ShieldCheck,
    Trash2,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMemo, useTransition } from "react"
import { useForm, type Resolver } from "react-hook-form"
import { z } from "zod"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../ui/alert-dialog"
import { Button } from "../ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Switch } from "../ui/switch"
import { Textarea } from "../ui/textarea"
import { withAppToast } from "../ui/pending-app-toast"

type FormValues = z.infer<typeof eventFormSchema>

type EventFormProps = {
    profileHandle?: string
    cancelHref?: string
    returnHref?: string
    submitLabel?: string
    event?: {
        id: string
        name: string
        description?: string
        slug?: string | null
        durationInMinutes: number
        location?: string
        visibility?: "public" | "private"
        bufferMinutes?: number
        isActive: boolean
    }
}

const resolver = zodResolver(eventFormSchema) as Resolver<FormValues, any>

const durationOptions = [15, 30, 45, 60, 90, 120]
const bufferOptions = [0, 5, 10, 15, 30, 45, 60]

function formatBuffer(minutes?: number) {
    if (!minutes) return "No buffer"
    return `${formatEventDescription(minutes)} buffer`
}

function formErrorMessage(error: unknown, fallback: string) {
    return error instanceof Error ? error.message : fallback
}

export default function EventForm({
    event,
    profileHandle,
    cancelHref = "/events",
    returnHref = "/events",
    submitLabel = "Save Event",
}: EventFormProps) {
    const [isDeletePending, startDeleteTransition] = useTransition()
    const router = useRouter()

    const form = useForm<FormValues>({
        resolver,
        mode: "onBlur",
        defaultValues: event
            ? {
                name: event.name,
                slug: event.slug ?? "",
                description: event.description ?? "",
                durationInMinutes: event.durationInMinutes,
                location: event.location ?? "Google Meet",
                visibility: event.visibility ?? "public",
                bufferMinutes: event.bufferMinutes ?? 0,
                isActive: event.isActive,
              }
            : {
                name: "",
                slug: "",
                description: "",
                durationInMinutes: 30,
                location: "Google Meet",
                visibility: "public",
                bufferMinutes: 0,
                isActive: true,
              },
    })

    const title = form.watch("name")
    const linkName = form.watch("slug")
    const description = form.watch("description")
    const durationInMinutes = form.watch("durationInMinutes")
    const location = form.watch("location")
    const visibility = form.watch("visibility")
    const bufferMinutes = form.watch("bufferMinutes")
    const isActive = form.watch("isActive")

    const previewSlug = useMemo(
        () => slugify(linkName || title || "") || "event-link",
        [linkName, title]
    )
    const publicPath = `/book/${profileHandle || "your-booking-link"}/${previewSlug}`
    const canShare = isActive && visibility === "public"

    async function onSubmit(values: FormValues) {
        const action = event == null ? createEvent : updateEvent.bind(null, event.id)
        const toastId = appToast.loading(
            event == null ? "Creating event..." : "Saving event..."
        )

        try {
            await action(values)
            appToast.dismiss(toastId)
            router.push(
                withAppToast(returnHref, event == null ? "event-created" : "event-saved")
            )
            router.refresh()
        } catch (error: unknown) {
            appToast.error("Event was not saved.", { id: toastId })
            form.setError("root", {
                message: `There was an error saving your event. ${formErrorMessage(error, "Try again.")}`,
            })
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div className="min-w-0 space-y-6">
                    {form.formState.errors.root && (
                        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                            {form.formState.errors.root.message}
                        </div>
                    )}

                    <section className="space-y-5 rounded-lg border border-border/80 bg-card p-4 sm:p-5">
                        <div>
                            <h2 className="font-display text-lg font-semibold tracking-normal">Basics</h2>
                            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                Set the public details guests see before they choose a time.
                            </p>
                        </div>

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Discovery Call" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        The title shown on your Booking Page and confirmation details.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Link Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="discovery-call" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Optional. Use lowercase letters, numbers, and hyphens, or leave blank to use the title.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            className="min-h-32 resize-y"
                                            placeholder="A focused call to understand goals, fit, and next steps."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Keep it short and useful for someone deciding whether to book.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </section>

                    <section className="space-y-5 rounded-lg border border-border/80 bg-card p-4 sm:p-5">
                        <div>
                            <h2 className="font-display text-lg font-semibold tracking-normal">Scheduling Rules</h2>
                            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                Keep this event simple while protecting the time around bookings.
                            </p>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="durationInMinutes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Duration</FormLabel>
                                        <Select
                                            onValueChange={value => field.onChange(Number(value))}
                                            value={String(field.value)}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {durationOptions.map(minutes => (
                                                    <SelectItem key={minutes} value={String(minutes)}>
                                                        {formatEventDescription(minutes)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            How long each booking lasts.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="bufferMinutes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Buffer Time</FormLabel>
                                        <Select
                                            onValueChange={value => field.onChange(Number(value))}
                                            value={String(field.value)}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {bufferOptions.map(minutes => (
                                                    <SelectItem key={minutes} value={String(minutes)}>
                                                        {formatBuffer(minutes)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            Protects time before or after a booking.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Location</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Google Meet" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Where guests should expect to meet.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </section>

                    <section className="space-y-5 rounded-lg border border-border/80 bg-card p-4 sm:p-5">
                        <div>
                            <h2 className="font-display text-lg font-semibold tracking-normal">Visibility</h2>
                            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                Control whether guests can discover and book this event.
                            </p>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="visibility"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Visibility</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="public">Public</SelectItem>
                                                <SelectItem value="private">Private</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            Private events stay off your Booking Page and public Event Link.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="isActive"
                                render={({ field }) => (
                                    <FormItem className="rounded-lg border border-border/80 p-4">
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="min-w-0">
                                                <FormLabel>Accept Bookings</FormLabel>
                                                <FormDescription className="mt-1">
                                                    Turn this off to pause new bookings.
                                                </FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </section>

                    <div className="flex flex-col-reverse gap-3 border-t border-border/80 pt-6 sm:flex-row sm:justify-end">
                        {event && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        className="sm:mr-auto"
                                        type="button"
                                        variant="destructive"
                                        disabled={isDeletePending || form.formState.isSubmitting}
                                    >
                                        <Trash2 />
                                        Delete
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Delete this event?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This permanently removes the event from your workspace and Booking Page.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            disabled={isDeletePending || form.formState.isSubmitting}
                                            onClick={() => {
                                                startDeleteTransition(async () => {
                                                    try {
                                                        await deleteEvent(event.id)
                                                        appToast.success("Event deleted.")
                                                        router.push("/events")
                                                    } catch (error: unknown) {
                                                        appToast.error("Event was not deleted.")
                                                        form.setError("root", {
                                                            message: `There was an error deleting your event. ${formErrorMessage(error, "Try again.")}`,
                                                        })
                                                    }
                                                })
                                            }}
                                        >
                                            Delete Event
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}

                        <Button
                            disabled={isDeletePending || form.formState.isSubmitting}
                            type="button"
                            asChild
                            variant="outline"
                        >
                            <Link href={cancelHref}>Cancel</Link>
                        </Button>

                        <Button
                            disabled={isDeletePending || form.formState.isSubmitting}
                            type="submit"
                        >
                            {form.formState.isSubmitting ? "Saving..." : submitLabel}
                        </Button>
                    </div>
                </div>

                <aside className="min-w-0 lg:sticky lg:top-6 lg:self-start">
                    <div className="overflow-hidden rounded-lg border border-border/80 bg-surface-raised text-card-foreground shadow-sm">
                        <div className="border-b border-border/80 p-4">
                            <p className="font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground">
                                Live Preview
                            </p>
                            <h3 className="mt-2 font-display text-xl font-semibold tracking-normal">
                                {title || "Discovery Call"}
                            </h3>
                            {description && (
                                <p className="mt-2 line-clamp-4 text-sm leading-6 text-muted-foreground">
                                    {description}
                                </p>
                            )}
                        </div>

                        <div className="space-y-3 p-4 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Clock3 className="size-4 text-primary" />
                                {formatEventDescription(Number(durationInMinutes) || 30)}
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="size-4 text-primary" />
                                <span className="break-words">{location || "Google Meet"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <CalendarClock className="size-4 text-primary" />
                                {formatBuffer(Number(bufferMinutes) || 0)}
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                {canShare ? (
                                    <Eye className="size-4 text-primary" />
                                ) : (
                                    <EyeOff className="size-4 text-muted-foreground" />
                                )}
                                {canShare ? "Bookable publicly" : "Hidden from public booking"}
                            </div>
                        </div>

                        <div className="border-t border-border/80 bg-background/70 p-4">
                            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                <Link2 className="size-3.5" />
                                Public URL
                            </div>
                            <div className="mt-2 break-all rounded-md border border-border/80 bg-card px-3 py-2 font-mono text-xs text-foreground">
                                {publicPath}
                            </div>
                            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                                {canShare ? (
                                    <CheckCircle2 className="size-3.5 text-primary" />
                                ) : (
                                    <ShieldCheck className="size-3.5" />
                                )}
                                {canShare
                                    ? "This Event Link can be shared after saving."
                                    : "Turn on public visibility and bookings to share this Event Link."}
                            </div>
                        </div>
                    </div>
                </aside>
            </form>
        </Form>
    )
}
