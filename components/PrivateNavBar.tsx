'use client'

import { PrivateNavLinks } from "@/constants";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import {
    CalendarClock,
    CalendarDays,
    CalendarRange,
    LinkIcon,
    PanelLeft,
    Settings,
    SlidersHorizontal,
    Unplug,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";

type NavIcon = ComponentType<{ className?: string }>

const privateNavIcons: Record<(typeof PrivateNavLinks)[number]["route"], NavIcon> = {
    "/overview": PanelLeft,
    "/events": CalendarDays,
    "/schedule": CalendarClock,
    "/bookings": CalendarRange,
    "/booking-page": LinkIcon,
    "/integrations": Unplug,
    "/settings": SlidersHorizontal,
}

export default function PrivateNavBar() {
    const pathname = usePathname();

    return (
        <>
            <aside
                data-kalender-theme="daylight"
                className="hidden min-h-dvh w-64 shrink-0 border-r border-sidebar-border bg-app-shell-background px-4 py-5 text-sidebar-foreground lg:flex lg:flex-col"
            >
                <div className="flex items-center justify-between gap-3">
                    <Link
                        href="/overview"
                        className="font-display text-xl font-semibold tracking-normal text-sidebar-foreground"
                    >
                        Kalender
                    </Link>
                    <UserButton />
                </div>

                <div className="mt-8">
                    <p className="px-3 font-mono text-xs font-medium uppercase tracking-widest text-sidebar-foreground/45">
                        Workspace
                    </p>
                    <nav className="mt-3 flex flex-col gap-1" aria-label="Workspace">
                        {PrivateNavLinks.map((item) => {
                            const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);
                            const Icon = privateNavIcons[item.route] ?? Settings

                            return (
                                <Link
                                    href={item.route}
                                    key={item.label}
                                    className={cn(
                                        "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring/40",
                                        isActive && "bg-sidebar-accent text-sidebar-foreground shadow-xs"
                                    )}
                                >
                                    <Icon className="size-4 shrink-0" />
                                    <span className="truncate">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </aside>

            <header
                data-kalender-theme="daylight"
                className="sticky top-0 z-40 border-b border-sidebar-border bg-app-shell-background/95 px-4 py-3 text-sidebar-foreground backdrop-blur sm:px-6 lg:hidden"
            >
                <div className="flex items-center justify-between gap-4">
                    <Link
                        href="/overview"
                        className="font-display text-xl font-semibold tracking-normal text-sidebar-foreground"
                    >
                        Kalender
                    </Link>
                    <UserButton />
                </div>
                <nav
                    aria-label="Workspace"
                    className="-mx-4 mt-3 flex gap-1 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6"
                >
                    {PrivateNavLinks.map((item) => {
                        const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);
                        const Icon = privateNavIcons[item.route] ?? Settings

                        return (
                            <Link
                                href={item.route}
                                key={item.label}
                                className={cn(
                                    "flex h-9 shrink-0 items-center gap-2 rounded-md px-3 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring/40",
                                    isActive && "bg-sidebar-accent text-sidebar-foreground shadow-xs"
                                )}
                            >
                                <Icon className="size-4 shrink-0" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </header>
        </>
    )
}
