import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { PendingAppToast } from "@/components/ui/pending-app-toast";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
    title: "Kalender",
    description: "Kalender is a simple and efficient calendar app that helps you manage your events, meetings, and schedules with ease. Stay organized and never miss an important date again!",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang="en">
            <body
                className="antialiased animate-fade-in"
            >
            {children}
            <PendingAppToast />
            <Toaster />
            </body>
            </html>
        </ClerkProvider>
    );
}
