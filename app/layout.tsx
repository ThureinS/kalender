import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { PendingAppToast } from "@/components/ui/pending-app-toast";
import { Toaster } from "@/components/ui/sonner";
import { NavigationProgressProvider } from "@/components/NavigationProgress";
import AppThemeProvider from "@/components/AppThemeProvider";
import CalendarConnectionRecovery from "@/components/integrations/CalendarConnectionRecovery";

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
        <html lang="en" suppressHydrationWarning>
            <body className="antialiased animate-fade-in">
                <AppThemeProvider>
                    <ClerkProvider appearance={{ variables: {
                        colorPrimary: "var(--primary)",
                        colorPrimaryForeground: "var(--primary-foreground)",
                        colorBackground: "var(--card)",
                        colorForeground: "var(--foreground)",
                        colorMutedForeground: "var(--muted-foreground)",
                        colorInput: "var(--background)",
                        colorInputForeground: "var(--foreground)",
                        colorNeutral: "var(--foreground)",
                    } }}>
                        <NavigationProgressProvider>
                            <CalendarConnectionRecovery />
                            {children}
                            <PendingAppToast />
                            <Toaster />
                        </NavigationProgressProvider>
                    </ClerkProvider>
                </AppThemeProvider>
            </body>
        </html>
    );
}
