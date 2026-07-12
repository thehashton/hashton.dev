import Link from "next/link";
import { ArrowUpRight, Eye, Film, Users } from "lucide-react";

import { DailyDeltaPill } from "@/components/dashboard/daily-delta-pill";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function MetricCard({
  label,
  value,
  delta,
  icon: Icon,
  hint,
}: {
  label: string;
  value: string;
  delta?: number;
  icon: typeof Users;
  hint?: string;
}) {
  return (
    <Card className="border-ink/20">
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-ink-700 dark:text-ink-800">{label}</CardTitle>
        <span className="inline-flex size-9 items-center justify-center rounded-lg border border-ink/20 bg-muted text-ink">
          <Icon className="size-4" aria-hidden />
        </span>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex flex-wrap items-center gap-2.5">
          <p className="text-3xl font-semibold tracking-tight tabular-nums">{value}</p>
          {typeof delta === "number" ? <DailyDeltaPill delta={delta} /> : null}
        </div>
        {hint ? <p className="text-sm text-ink-700 dark:text-ink-800">{hint}</p> : null}
      </CardContent>
    </Card>
  );
}

export function metricIcons() {
  return { Users, Eye, Film, ArrowUpRight };
}

export function ExternalProfileLink({
  href,
  className,
}: {
  href: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-ink/30 px-4 text-base font-semibold text-ink transition-colors hover:border-ink/45 hover:bg-ink/8",
        className,
      )}
    >
      Open profile
      <ArrowUpRight className="size-4" aria-hidden />
    </Link>
  );
}
