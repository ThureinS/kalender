import type { Metadata } from "next";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = {
  title: "Theme Lab — Kalender UI Overhaul",
};

type Theme = {
  id: string;
  name: string;
  tagline: string;
  displayVar?: string;
  cardClass?: string;
  primaryClass?: string;
  heroClass?: string;
};

const themes: Theme[] = [
  {
    id: "midnight",
    name: "Midnight Lime",
    tagline: "DARK · zinc base · lime accent · Space Grotesk · hairlines + glow",
    displayVar: "var(--font-space-grotesk)",
    cardClass: "shadow-[0_0_40px_-12px_var(--primary)]",
    primaryClass: "shadow-[0_0_24px_-4px_var(--primary)]",
    heroClass: "",
  },
  {
    id: "daylight",
    name: "Daylight Lime",
    tagline:
      "LIGHT twin of Midnight · lime-600 accent for contrast · same glow language",
    displayVar: "var(--font-space-grotesk)",
    cardClass: "shadow-[0_0_36px_-14px_var(--primary)]",
    primaryClass: "",
    heroClass: "",
  },
  {
    id: "blackout",
    name: "Blackout Brutal",
    tagline:
      "DARK twin of Brutalist · black on black · white hairlines · lime CTA · hard offsets",
    displayVar: "var(--font-geist-mono)",
    cardClass:
      "border-2! rounded-none! shadow-[6px_6px_0_0_var(--primary)]!",
    primaryClass: "rounded-none! shadow-[3px_3px_0_0_#fff]!",
    heroClass: "uppercase tracking-tight font-mono",
  },
  {
    id: "nebula",
    name: "Nebula Violet",
    tagline: "Dark violet-tinted base · violet accent · big radii · soft glow",
    displayVar: "var(--font-space-grotesk)",
    cardClass: "shadow-[0_0_48px_-16px_var(--primary)]",
    primaryClass: "shadow-[0_0_20px_-2px_var(--primary)]",
    heroClass: "",
  },
  {
    id: "editorial",
    name: "Editorial Paper",
    tagline: "Warm paper light mode · ink primary · serif display · sharp radii",
    displayVar: "var(--font-instrument-serif)",
    cardClass: "shadow-none border-foreground/15",
    primaryClass: "",
    heroClass: "",
  },
  {
    id: "brutalist",
    name: "Brutalist Mono",
    tagline: "LIGHT · pure black on white · zero radius · hard offsets · mono",
    displayVar: "var(--font-geist-mono)",
    cardClass:
      "border-2! rounded-none! shadow-[5px_5px_0_0_var(--primary)]!",
    primaryClass: "rounded-none! shadow-[3px_3px_0_0_#a3e635]!",
    heroClass: "uppercase tracking-tight font-mono",
  },
  {
    id: "coral",
    name: "Coral Dusk",
    tagline:
      "DARK wildcard · warm charcoal base · coral accent · softer, friendlier glow",
    displayVar: "var(--font-space-grotesk)",
    cardClass: "shadow-[0_0_44px_-14px_var(--primary)]",
    primaryClass: "shadow-[0_0_24px_-4px_var(--primary)]",
    heroClass: "",
  },
];

function SlotChip({ time }: { time: string }) {
  return (
    <Button variant="outline" size="sm" className="font-mono">
      {time}
    </Button>
  );
}

function SampleUI({ theme }: { theme: Theme }) {
  return (
    <div
      className={`theme-${theme.id} min-h-[640px] bg-background text-foreground px-8 py-10 transition-colors`}
    >
      <header className="mx-auto flex max-w-2xl items-center justify-between">
        <span className="font-display text-xl font-bold">kalender</span>
        <nav className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            Log in
          </Button>
          <Button size="sm" className={theme.primaryClass}>
            Book a time
          </Button>
        </nav>
      </header>

      <main className="mx-auto mt-14 max-w-2xl">
        <p
          className={`font-display text-5xl leading-[1.05] tracking-tight md:text-6xl ${theme.heroClass}`}
        >
          Pick a slot.
          <br />
          Own your week.
        </p>
        <p className="text-muted-foreground mt-4 max-w-md text-lg">
          Share your link. Let people grab the time that works — no back-and-forth emails.
        </p>

        <Card className={`mt-10 max-w-md ${theme.cardClass}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Quick Chat</CardTitle>
              <span className="text-muted-foreground flex items-center gap-1 text-xs">
                <Clock className="size-3.5" />
                15 min
              </span>
            </div>
            <CardDescription>
              Intro call to see how we can work together.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-2">
            <SlotChip time="9:00" />
            <SlotChip time="9:30" />
            <SlotChip time="10:00" />
          </CardContent>
          <CardFooter>
            <Input placeholder="you@example.com" />
          </CardFooter>
        </Card>

        <div className="mt-8 flex gap-3">
          <Button className={theme.primaryClass}>Confirm booking</Button>
          <Button variant="secondary">Reschedule</Button>
          <Button variant="ghost">Cancel</Button>
        </div>
      </main>
    </div>
  );
}

export default function ThemeLabPage() {
  return (
    <div>
      <div className="bg-zinc-100 px-8 py-6 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
        <h1 className="text-sm font-semibold uppercase tracking-widest">
          Theme Lab
        </h1>
        <p className="mt-1 text-sm opacity-70">
          Art directions over identical markup + real shadcn primitives.
          Throwaway page for the ui-overhaul branch.
        </p>
      </div>

      {themes.map((theme) => (
        <section key={theme.id}>
          <div className="border-b bg-white px-8 py-4 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
            <h2 className="font-semibold">{theme.name}</h2>
            <p className="text-sm opacity-60">{theme.tagline}</p>
          </div>
          <SampleUI theme={theme} />
        </section>
      ))}
    </div>
  );
}
