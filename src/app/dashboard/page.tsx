import Link from "next/link";
import { Goal, Mail, Share2, Users } from "lucide-react";

import { getDashboardStats } from "@/app/dashboard/actions";
import { DailyDeltaPill } from "@/components/dashboard/daily-delta-pill";
import { DashboardChannelIcon } from "@/components/dashboard/dashboard-channel-icon";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default async function DashboardOverviewPage() {
  const { goals, activeSubscribers, channels, users } = await getDashboardStats();

  const cards = [
    {
      label: "Active goals",
      value: goals.length,
      href: "/dashboard/goals",
      icon: Goal,
    },
    {
      label: "Email subscribers",
      value: activeSubscribers,
      href: "/dashboard/email-list",
      icon: Mail,
    },
    {
      label: "Social channels",
      value: channels.length,
      href: "/dashboard/social",
      icon: Share2,
    },
    {
      label: "Users",
      value: users.length,
      href: "/dashboard/settings",
      icon: Users,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="mt-2 text-ink-700 dark:text-ink-800">Goals, audience, and social at a glance.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              aria-label={`${card.label}: ${card.value}`}
              className="group rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              <Card className="h-full border-ink/25 p-4 transition-[transform,background-color,border-color] hover:-translate-y-0.5 hover:border-ink/40 hover:bg-surface motion-reduce:transform-none motion-reduce:transition-none sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl">
                      {card.value}
                    </p>
                    <p className="mt-1.5 text-sm font-medium text-ink-700 dark:text-ink-800">
                      {card.label}
                    </p>
                  </div>
                  <span
                    aria-hidden
                    className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-ink/25 bg-muted text-ink transition-colors group-hover:border-ink/40 group-hover:bg-ink/10"
                  >
                    <Icon className="size-5" />
                  </span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Goal progress</CardTitle>
            <CardDescription>Latest milestones toward your targets.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {goals.length === 0 ? (
              <p className="text-sm text-ink-700 dark:text-ink-800">No goals yet. Create one to get started.</p>
            ) : (
              goals.slice(0, 5).map((goal) => {
                const pct =
                  goal.targetValue > 0
                    ? Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100))
                    : 0;
                return (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="font-medium">{goal.title}</span>
                      <span className="text-ink-700 dark:text-ink-800">
                        {goal.currentValue.toLocaleString()} / {goal.targetValue.toLocaleString()}
                      </span>
                    </div>
                    <Progress value={pct} />
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social snapshot</CardTitle>
            <CardDescription>Live counts with today’s gain or loss.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {channels.length === 0 ? (
              <p className="text-sm text-ink-700 dark:text-ink-800">No channels yet.</p>
            ) : (
              channels.map((channel) => (
                <Link
                  key={channel.id}
                  href={`/dashboard/social/${channel.id}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-ink/25 px-3 py-2.5 transition-colors hover:border-ink/40 hover:bg-ink/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                >
                  <span className="flex min-w-0 items-center gap-2.5 font-medium">
                    <DashboardChannelIcon channelKey={channel.key} label={channel.label} />
                    <span className="truncate">{channel.label}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2.5">
                    <span
                      className="text-base font-semibold tabular-nums text-ink"
                      title="Total followers"
                    >
                      {channel.followerCount.toLocaleString()}
                    </span>
                    <DailyDeltaPill delta={channel.dailyDelta} />
                  </span>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
