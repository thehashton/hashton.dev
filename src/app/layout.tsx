import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { JsonLd } from "@/components/json-ld";
import { Providers } from "@/components/providers";
import { site } from "@/lib/site";

import "@/styles/globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { color: "#faf7f1", media: "(prefers-color-scheme: light)" },
    { color: "#0e0d0b", media: "(prefers-color-scheme: dark)" },
  ],
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
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "/images/og-home.png",
        width: 1024,
        height: 581,
        alt: `${site.name} — portfolio preview`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name}`,
    description: site.tagline,
    creator: "@TheHashton",
    images: ["/images/og-home.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen w-full bg-paper font-sans text-ink antialiased">
        <JsonLd />
        <Providers>
          <div className="relative min-h-screen w-full max-w-none">
            <div className="relative z-10 flex min-h-screen w-full flex-col items-stretch">
              <Header />
              <main className="w-full min-w-0 flex-1">{children}</main>
              <Footer />
            </div>
          </div>
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
