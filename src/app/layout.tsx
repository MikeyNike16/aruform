import type { Metadata } from "next";

import "./globals.css";
import { FloatingQuotes } from "@/components/FloatingQuotes";
import { Analytics } from "@/components/Analytics";

const SITE_NAME = "aruform";
const SITE_URL = "https://aruform.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — existential journaling`,
    template: `%s — ${SITE_NAME}`,
  },
  description: "Reflect deeply, track emotional patterns, and understand who you're becoming.",
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — existential journaling`,
    description: "Reflect deeply, track emotional patterns, and understand who you're becoming.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — existential journaling`,
    description: "Reflect deeply, track emotional patterns, and understand who you're becoming.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Analytics />
        <FloatingQuotes />
        <div style={{ position: "relative", zIndex: 10 }}>{children}</div>
      </body>
    </html>
  );
}
