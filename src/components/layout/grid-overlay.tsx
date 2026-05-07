import { shellClass } from "@/lib/layout-shell";
import { cn } from "@/lib/utils";

export function GridOverlay() {
  if (process.env.NODE_ENV !== "development") return null;
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[250] hidden lg:block"
    >
      <div className={cn(shellClass, "flex h-full border-x border-ink/[0.08]")}>
        {Array.from({ length: 11 }).map((_, i) => (
          <div key={i} className="flex-1 border-r border-ink/[0.06]" />
        ))}
      </div>
    </div>
  );
}
