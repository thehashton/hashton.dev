"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useState } from "react";

import { IconGithub, IconLinkedIn } from "@/components/icons/brands";
import { shellClass } from "@/lib/layout-shell";
import { sectionNav } from "@/lib/nav";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";

function NavLinks({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  return (
    <nav
      className={cn(
        "flex flex-col gap-1 font-mono text-[10px] font-semibold tracking-[0.12em] uppercase sm:text-caption sm:tracking-[0.14em] lg:flex-row lg:flex-nowrap lg:items-center lg:justify-center lg:gap-x-2 lg:gap-y-0 xl:gap-x-3 2xl:gap-x-4",
        className,
      )}
    >
      {sectionNav.map((item) => (
        <Link
          key={item.id}
          href={`#${item.id}`}
          className="shrink-0 whitespace-nowrap border border-transparent px-1 py-2 text-ink hover:border-ink hover:bg-ink hover:text-paper lg:py-1 lg:pl-1 lg:pr-1 xl:px-1.5"
          onClick={onNavigate}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b-2 border-ink bg-paper/95 backdrop-blur-sm">
      <Sheet open={open} onOpenChange={setOpen}>
        <div
          className={cn(
            shellClass,
            "flex items-center justify-between gap-3 py-3 md:gap-4 md:py-4 lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:gap-x-4 xl:gap-x-6",
          )}
        >
          <Link
            href="#hero"
            className="group relative z-[1] flex min-w-0 shrink-0 items-center gap-2.5 whitespace-nowrap bg-paper md:gap-3"
          >
            <span className="flex size-10 shrink-0 items-center justify-center border-2 border-ink bg-ink font-mono text-xs font-bold text-paper shadow-[4px_4px_0_0_#0a0a0a] transition-colors group-hover:bg-accent md:size-11 md:text-sm">
              HA
            </span>
            <span className="flex min-w-0 items-baseline gap-1.5 leading-none md:gap-2">
              <span className="font-sans text-base font-bold tracking-tight whitespace-nowrap text-ink md:text-lg">
                Harry Ashton
              </span>
              <span className="caption-mono hidden text-ink-500 md:inline">{site.nickname}</span>
            </span>
          </Link>

          <div className="hidden min-h-11 min-w-0 lg:block">
            <NavLinks className="flex max-h-11 max-w-full justify-start overflow-x-auto overscroll-x-contain py-1 [-ms-overflow-style:none] [scrollbar-width:none] lg:justify-center [&::-webkit-scrollbar]:hidden" />
          </div>

          <div className="flex shrink-0 items-center gap-2 md:gap-3">
            <Link
              href={site.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="invert-hover hidden size-11 items-center justify-center border-2 border-ink lg:flex"
              aria-label="GitHub"
            >
              <IconGithub className="size-7" />
            </Link>
            <Link
              href={site.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="invert-hover hidden size-11 items-center justify-center border-2 border-ink lg:flex"
              aria-label="LinkedIn"
            >
              <IconLinkedIn className="size-7" />
            </Link>
            <Button variant="accent" className="hidden shrink-0 lg:inline-flex" asChild>
              <Link href="#contact">Hire me</Link>
            </Button>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="border-2 border-ink px-3 shadow-[4px_4px_0_0_#0a0a0a] lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
          </div>
        </div>

        <SheetContent className="gap-8">
          <div className="flex flex-col gap-2 border-b-2 border-ink pb-6">
            <p className="font-sans text-2xl font-bold tracking-tight">Harry Ashton</p>
            <p className="caption-mono text-ink-600">Navigation</p>
          </div>
          <NavLinks onNavigate={() => setOpen(false)} />
          <div className="mt-auto flex flex-wrap gap-3 border-t-2 border-ink pt-6">
            <SheetClose asChild>
              <Button asChild variant="accent">
                <Link href="#contact">Contact</Link>
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button asChild>
                <Link href={site.links.github} className="inline-flex items-center gap-2">
                  <IconGithub className="size-4 shrink-0" />
                  GitHub
                </Link>
              </Button>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
