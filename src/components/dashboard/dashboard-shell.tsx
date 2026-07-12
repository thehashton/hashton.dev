"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Goal,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Settings,
  Share2,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { PushPrompt } from "@/components/dashboard/push-prompt";
import { ServiceWorkerRegister } from "@/components/dashboard/sw-register";
import { ThemeToggle } from "@/components/theme/theme-controls";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { signOutAction } from "@/app/login/actions";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/db/schema";

const nav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/goals", label: "Goals", icon: Goal },
  { href: "/dashboard/email-list", label: "Email list", icon: Mail },
  { href: "/dashboard/social", label: "Social", icon: Share2 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

export function DashboardShell({
  children,
  displayName,
  role,
  email,
}: {
  children: React.ReactNode;
  displayName: string;
  role: UserRole;
  email: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const navId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeButtonRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <div className="dashboard-aaa min-h-screen bg-paper text-ink">
      <ServiceWorkerRegister />
      <a
        href="#dashboard-main"
        className={cn(
          "sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-strong focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-on-strong",
          focusRing,
        )}
      >
        Skip to main content
      </a>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,_rgb(192_87_58_/_0.12),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgb(20_18_15_/_0.06),_transparent_45%)] dark:bg-[radial-gradient(circle_at_top_left,_rgb(192_87_58_/_0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgb(255_255_255_/_0.04),_transparent_40%)]"
      />

      <div className="relative flex min-h-screen w-full">
        <aside
          id={navId}
          aria-label="Dashboard"
          className={cn(
            "fixed inset-y-0 left-0 z-40 flex w-72 shrink-0 flex-col border-r border-ink/25 bg-surface p-4 backdrop-blur-xl transition-transform md:sticky md:top-0 md:h-svh md:translate-x-0",
            open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          )}
        >
          <div className="mb-6 flex items-start justify-between gap-2 px-1 pt-1">
            <Link
              href="/dashboard"
              className={cn(
                "flex min-w-0 items-center gap-3 rounded-xl p-1 transition-opacity hover:opacity-90",
                focusRing,
              )}
              aria-label={`${site.name} dashboard home`}
            >
              <Image
                src="/images/logos/hashton-logo.png"
                alt=""
                width={841}
                height={267}
                priority
                className="h-9 w-auto shrink-0 object-contain dark:invert sm:h-10"
              />
              <span className="min-w-0">
                <span className="caption-mono block text-ink-800">Hashton HQ</span>
                <span className="mt-0.5 block truncate font-semibold tracking-tight text-ink">
                  {displayName}
                </span>
              </span>
            </Link>
            <Button
              ref={closeButtonRef}
              variant="ghost"
              size="icon"
              className={cn("md:hidden", focusRing)}
              onClick={() => setOpen(false)}
              aria-label="Close navigation menu"
            >
              <X className="size-5" aria-hidden />
            </Button>
          </div>

          <nav aria-label="Primary" className="flex flex-col gap-1">
            {nav.map((item) => {
              const active =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    focusRing,
                    active
                      ? "bg-strong text-on-strong"
                      : "text-ink-800 hover:bg-ink/10 hover:text-ink",
                  )}
                >
                  <Icon className="size-4 shrink-0" aria-hidden />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <Separator className="my-6" />

          <div className="mt-auto space-y-3 px-2 pb-2">
            <div className="flex min-w-0 items-center gap-2">
              <Badge variant="outline" className="border-ink/40 text-ink">
                <span className="sr-only">Role: </span>
                {role}
              </Badge>
              <span className="truncate text-sm text-ink-800" title={email}>
                {email}
              </span>
            </div>
            <form action={signOutAction}>
              <Button type="submit" variant="outline" size="sm" className={cn("w-full", focusRing)}>
                <LogOut aria-hidden />
                Sign out
              </Button>
            </form>
          </div>
        </aside>

        {open ? (
          <button
            type="button"
            aria-label="Close navigation overlay"
            className="fixed inset-0 z-30 bg-ink/50 md:hidden"
            onClick={() => setOpen(false)}
          />
        ) : null}

        <div className="relative flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-ink/25 bg-paper/95 px-4 py-3 backdrop-blur-xl md:px-8">
            <Button
              variant="ghost"
              size="icon"
              className={cn("md:hidden", focusRing)}
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls={navId}
              aria-label="Open navigation menu"
            >
              <Menu className="size-5" aria-hidden />
            </Button>
            <p className="hidden text-sm font-medium text-ink-800 md:block">Private dashboard</p>
            <div className="ml-auto flex items-center gap-2">
              <ThemeToggle />
              <PushPrompt />
            </div>
          </header>

          <motion.main
            id="dashboard-main"
            key={pathname}
            tabIndex={-1}
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reduceMotion ? { duration: 0 } : { duration: 0.35, ease: [0.22, 1, 0.36, 1] }
            }
            className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 outline-none md:px-8 md:py-8"
          >
            {children}
          </motion.main>
        </div>
      </div>
    </div>
  );
}
