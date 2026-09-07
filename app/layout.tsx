import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { PendingAppToast } from "@/components/ui/pending-app-toast";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
    title: "Kalender",
    description: "Kalender helps solo professionals publish booking pages, event links, availability, and meeting history.",
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
