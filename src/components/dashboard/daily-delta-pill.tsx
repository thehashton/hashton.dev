import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function DailyDeltaPill({ delta }: { delta: number }) {
  const signed = delta > 0 ? `+${delta.toLocaleString()}` : delta.toLocaleString();

  return (
    <Badge
      variant="secondary"
      className={cn(
        "shrink-0 gap-1 font-semibold tabular-nums",
        delta > 0 && "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
        delta < 0 && "bg-danger/15 text-danger",
        delta === 0 && "text-ink-700 dark:text-ink-800",
      )}
      title="New followers/subscribers today"
      aria-label={`${delta > 0 ? "Up" : delta < 0 ? "Down" : "No change"} ${Math.abs(delta).toLocaleString()} today`}
    >
      <span>{signed}</span>
      <span className="font-medium opacity-70">today</span>
    </Badge>
  );
}
