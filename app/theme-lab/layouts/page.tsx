import type { Metadata } from "next";
import { ArrowRight, ChevronRight, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Layout Lab — Booking Page Directions",
};

const person = {
  name: "Maya Lindström",
  role: "Product Photographer & Design Mentor",
  bio: "I help teams ship sharper product visuals. Book a call and bring your messiest problem.",
  location: "Copenhagen · CET",
  initials: "ML",
};

const events = [
  { name: "Intro Call", minutes: 15, desc: "Quick fit-check to see if we click." },
  { name: "Portfolio Review", minutes: 30, desc: "Line-by-line teardown of three shots." },
  { name: "Deep Dive", minutes: 60, desc: "Full working session on your shoot plan." },
];

function Avatar({ size, glow }: { size: string; glow?: boolean }) {
  return (
    <div
      className={`${size} ${glow ? "shadow-[0_0_48px_-8px_var(--primary)]" : ""} bg-primary text-primary-foreground font-display grid place-items-center rounded-full text-xl font-bold`}
    >
      {person.initials}
    </div>
  );
}

function MonoMins({ minutes }: { minutes: number }) {
  return (
    <span className="font-mono text-xs text-muted-foreground">
      {minutes} min
    </span>
  );
}

function Editorial() {
  return (
    <div className="min-h-[720px] bg-background text-foreground px-8 py-16">
      <div className="mx-auto max-w-2xl">
        <div className="flex flex-col items-center text-center">
          <Avatar size="size-20" glow />
          <h1 className="font-display mt-6 text-5xl tracking-tight">
            {person.name}
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">{person.role}</p>
          <p className="text-muted-foreground mt-4 max-w-md text-sm leading-relaxed">
            {person.bio}
          </p>
          <p className="mt-3 flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
            <MapPin className="size-3.5" /> {person.location}
          </p>
        </div>

        <div className="mt-12 border-t">
          {events.map((e) => (
            <button
              key={e.name}
              className="group flex w-full items-center justify-between border-b py-5 text-left transition-colors hover:bg-accent/50"
            >
              <span>
                <span className="font-display text-lg">{e.name}</span>
                <span className="mt-0.5 block text-sm text-muted-foreground">
                  {e.desc}
                </span>
              </span>
              <span className="flex items-center gap-3">
                <MonoMins minutes={e.minutes} />
                <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Gallery() {
  return (
    <div className="min-h-[720px] bg-background text-foreground px-8 py-16">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col items-center text-center">
          <Avatar size="size-16" glow />
          <h1 className="font-display mt-4 text-4xl tracking-tight">
            {person.name}
          </h1>
          <p className="text-muted-foreground mt-2">{person.role}</p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((e) => (
            <Card
              key={e.name}
              className="transition-all hover:-translate-y-1 hover:shadow-[0_0_36px_-10px_var(--primary)]"
            >
              <CardHeader>
                <CardTitle className="text-base">{e.name}</CardTitle>
                <CardDescription className="flex items-center gap-1.5">
                  <Clock className="size-3.5" />
                  <span className="font-mono">{e.minutes} min</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {e.desc}
              </CardContent>
              <CardFooter>
                <Button size="sm" className="w-full">
                  Book this
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function SplitScreen() {
  return (
    <div className="min-h-[720px] bg-background text-foreground px-8 py-16">
      <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-[300px_1fr]">
        <aside className="flex flex-col items-start md:sticky md:top-16 md:self-start">
          <Avatar size="size-24" glow />
          <h1 className="font-display mt-6 text-3xl tracking-tight">
            {person.name}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">{person.role}</p>
          <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
            {person.bio}
          </p>
          <p className="mt-4 flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
            <MapPin className="size-3.5" /> {person.location}
          </p>
          <span className="mt-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-xs text-muted-foreground">
            <span className="size-2 rounded-full bg-primary shadow-[0_0_8px_2px_var(--primary)]" />
            Usually responds in a day
          </span>
        </aside>

        <div className="space-y-4">
          <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            Book a time
          </p>
          {events.map((e) => (
            <div
              key={e.name}
              className="group flex items-center justify-between rounded-xl border p-5 transition-all hover:border-primary/50 hover:shadow-[0_0_28px_-12px_var(--primary)]"
            >
              <div>
                <p className="font-display text-lg">{e.name}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{e.desc}</p>
                <div className="mt-2">
                  <MonoMins minutes={e.minutes} />
                </div>
              </div>
              <Button size="sm" variant="outline" className="shrink-0">
                Book
                <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const layouts = [
  { name: "1 · Editorial Hero + Rows", tagline: "Centered identity · events as full-width rows · quietest option", node: <Editorial /> },
  { name: "2 · Card Gallery", tagline: "Today's grid, tokenized · accent glow on hover · most familiar", node: <Gallery /> },
  { name: "3 · Split-Screen", tagline: "Identity rail + event column · glow lives in the rail · most distinctive", node: <SplitScreen /> },
];

export default function LayoutLabPage() {
  return (
    <div>
      <div className="bg-zinc-100 px-8 py-6 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
        <h1 className="text-sm font-semibold uppercase tracking-widest">
          Layout Lab — Booking Page
        </h1>
        <p className="mt-1 text-sm opacity-70">
          Three Booking Page directions in Midnight Lime with the Accent glow.
          Throwaway page for the ui-overhaul branch.
        </p>
      </div>

      {layouts.map((l) => (
        <section key={l.name}>
          <div className="border-b bg-white px-8 py-4 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
            <h2 className="font-semibold">{l.name}</h2>
            <p className="text-sm opacity-60">{l.tagline}</p>
          </div>
          <div className="theme-midnight">{l.node}</div>
        </section>
      ))}
    </div>
  );
}
