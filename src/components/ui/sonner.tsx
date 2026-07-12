"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Toaster as Sonner } from "sonner";

export function Toaster() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const theme = !mounted ? "light" : resolvedTheme === "dark" ? "dark" : "light";

  return (
    <Sonner
      theme={theme}
      position="bottom-right"
      closeButton
      richColors
      toastOptions={{
        classNames: {
          toast:
            "rounded-xl border border-ink/15 bg-surface font-sans text-base text-ink shadow-card",
          title: "font-semibold tracking-tight",
          description: "text-ink-700 dark:text-ink-800",
          success: "border-emerald-500/30",
          error: "border-danger/40",
          actionButton: "bg-accent text-accent-foreground",
          cancelButton: "bg-ink/10 text-ink",
          closeButton: "border-ink/15 bg-surface text-ink hover:bg-ink/10",
        },
      }}
    />
  );
}
