import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {ClerkProvider} from "@clerk/nextjs";
import {Toaster} from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kalender",
  description: "A calendar and appointment making website",
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
            cz-shortcut-listen="true"
            className={`${geistSans.variable} ${geistMono.variable} antialiased animate-fade-in`}
        >
        {children}
        <Toaster/>
        </body>
        </html>
    </ClerkProvider>
  );
}
