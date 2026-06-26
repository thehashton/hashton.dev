"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const toggleClassName =
  "inline-flex size-11 shrink-0 items-center justify-center rounded-md border border-ink/10 bg-paper/80 text-ink shadow-sm transition-colors hover:bg-ink/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink/30";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      suppressHydrationWarning
      className={cn(toggleClassName, className)}
      aria-pressed={mounted ? isDark : undefined}
      aria-label={mounted ? (isDark ? "Switch to light mode" : "Switch to dark mode") : "Toggle appearance"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {mounted ? (
        isDark ? (
          <Sun className="size-[1.35rem] shrink-0" aria-hidden />
        ) : (
          <Moon className="size-[1.35rem] shrink-0" aria-hidden />
        )
      ) : (
        <Moon className="size-[1.35rem] shrink-0 opacity-0" aria-hidden />
      )}
    </button>
  );
}

export function MatchSystemThemeButton({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  const { setTheme } = useTheme();

  return (
    <button
      type="button"
      suppressHydrationWarning
      className={cn(
        "caption-mono inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-ink/10 py-3 text-ink-600 transition-colors hover:bg-ink/5 hover:text-ink",
        className,
      )}
      onClick={() => {
        setTheme("system");
        onNavigate?.();
      }}
    >
      <Monitor className="size-4 shrink-0" aria-hidden />
      Match system
    </button>
  );
}
