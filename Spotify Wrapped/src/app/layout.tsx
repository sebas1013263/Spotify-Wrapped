// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import CursorProvider from "@/app/components/CursorProvider";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spotify Wrapped - Retro Edition",
  description: "A retro 90s inspired recreation of Spotify Wrapped",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=700px" />
        <style dangerouslySetInnerHTML={{
          __html: `
            html, body {
              min-width: 700px;
              overflow-x: auto;
            }
          `
        }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-hidden min-w-[700px]`}
      >
        <CursorProvider>
          {children}
        </CursorProvider>
        <Analytics />
      </body>
    </html>
  );
}