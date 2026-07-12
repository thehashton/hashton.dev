import type { Metadata, Viewport } from "next";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requireAppSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s — Hashton HQ",
  },
  description: "Hashton private dashboard",
  robots: { index: false, follow: false },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Hashton HQ",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { color: "#faf7f1", media: "(prefers-color-scheme: light)" },
    { color: "#0e0d0b", media: "(prefers-color-scheme: dark)" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAppSession();

  return (
    <DashboardShell
      displayName={session.profile.displayName}
      role={session.profile.role}
      email={session.user.email}
    >
      {children}
    </DashboardShell>
  );
}
