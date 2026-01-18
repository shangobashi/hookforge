import type { Metadata } from "next";
import { Manrope, Outfit } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HookForge — Viral Hooks & Content Calendars for Creators",
  description:
    "Generate high-converting hooks, threads, and weekly content plans in seconds.",
  metadataBase: new URL("https://hookforge.shangobashi.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} ${outfit.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
