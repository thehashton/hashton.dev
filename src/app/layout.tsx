import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { Footer } from "@/components/layout/footer";
import { GridOverlay } from "@/components/layout/grid-overlay";
import { Header } from "@/components/layout/header";
import { JsonLd } from "@/components/json-ld";
import { Providers } from "@/components/providers";
import { site } from "@/lib/site";

import "@/styles/globals.css";

export const viewport: Viewport = {
  themeColor: "#f4f1ea",
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Senior Frontend Engineer`,
    template: `%s — ${site.name}`,
  },
  description: site.tagline,
  openGraph: {
    title: `${site.name}`,
    description: site.tagline,
    url: site.url,
    siteName: site.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name}`,
    description: site.tagline,
    creator: "@TheHashton",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-paper font-sans text-ink antialiased">
        <JsonLd />
        <Providers>
          <GridOverlay />
          <Header />
          <main className="w-full min-w-0">{children}</main>
          <Footer />
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
