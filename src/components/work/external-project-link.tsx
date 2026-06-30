"use client";

import { ArrowUpRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { siNpm } from "simple-icons";

import { cn } from "@/lib/utils";

function NpmIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path fill="currentColor" d={siNpm.path} />
    </svg>
  );
}

type ExternalProjectLinkProps = {
  href: string;
  label: string;
  className?: string;
};

export function ExternalProjectLink({ href, label, className }: ExternalProjectLinkProps) {
  const isNpm = href.includes("npmjs.com");

  if (isNpm) {
    return (
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "font-mono inline-flex min-h-10 items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-[#a8242f] bg-[#CB3837] px-3.5 py-2 text-[11px] font-bold uppercase leading-none tracking-[0.1em] text-white shadow-[0_8px_24px_-12px_rgba(203,56,55,0.75)] transition-[transform,background-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-[#b83231] hover:shadow-[0_12px_28px_-10px_rgba(203,56,55,0.85)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#CB3837] sm:text-xs",
          className,
        )}
      >
        <NpmIcon className="size-3.5 shrink-0" />
        {label}
        <ArrowUpRight className="size-3 shrink-0 opacity-90" aria-hidden />
      </Link>
    );
  }

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "font-mono inline-flex min-h-10 items-center justify-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-2 text-[11px] font-semibold uppercase leading-none tracking-[0.1em] transition-colors sm:text-xs",
        "border-ink/15 bg-surface text-ink shadow-sm hover:border-ink/25 hover:bg-muted",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        className,
      )}
    >
      <ExternalLink className="size-3.5 shrink-0 opacity-80" aria-hidden />
      {label}
    </Link>
  );
}
