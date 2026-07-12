import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import {
  ArrowLeft,
  ExternalLink,
  Goal,
  RefreshCw,
  Save,
  Users,
} from "lucide-react";

import {
  deleteSocialChannel,
  refreshYouTubeChannel,
  updateSocialChannel,
} from "@/app/dashboard/actions";
import { ActionForm } from "@/components/dashboard/action-form";
import { ConfirmDeleteButton } from "@/components/dashboard/confirm-delete-button";
import { DailyDeltaPill } from "@/components/dashboard/daily-delta-pill";
import { DashboardChannelIcon } from "@/components/dashboard/dashboard-channel-icon";
import { MetricStudioChart } from "@/components/dashboard/metric-studio-chart";
import { ExternalProfileLink, MetricCard } from "@/components/dashboard/social-metric-card";
import { YouTubeUploads } from "@/components/dashboard/youtube-uploads";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { db } from "@/db";
import { goals, socialChannels, socialMetricSnapshots } from "@/db/schema";
import { requireAppSession } from "@/lib/auth/session";
import { buildYouTubeMetricSeries } from "@/lib/metric-chart";
import { asDayString, dailyFollowerDelta, londonToday } from "@/lib/social-stats";
import {
  fetchYouTubeChannelDetails,
  isYouTubeChannel,
  isYouTubeConfigured,
} from "@/lib/youtube";

export default async function SocialChannelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireAppSession();
  const canEdit = session.profile.role !== "viewer";
  const { id } = await params;

  const [channel] = await db
    .select()
    .from(socialChannels)
    .where(eq(socialChannels.id, id))
    .limit(1);

  if (!channel) notFound();

  const today = londonToday();
  const dayStart =
    asDayString(channel.dayStartDate) === today ? channel.dayStartCount : channel.followerCount;
  const dailyDelta = dailyFollowerDelta(channel.followerCount, dayStart);

  const youtube = isYouTubeChannel(channel);
  const youtubeReady = isYouTubeConfigured();

  let youtubeDetails: Awaited<ReturnType<typeof fetchYouTubeChannelDetails>> | null = null;
  let youtubeError: string | null = null;

  if (youtube && youtubeReady && channel.url) {
    try {
      youtubeDetails = await fetchYouTubeChannelDetails(channel.url, { uploadLimit: 8 });
    } catch (error) {
      youtubeError = error instanceof Error ? error.message : "Could not load YouTube details.";
    }
  }

  const platform =
    channel.key.toLowerCase() === "twitter" ? "twitter" : channel.key.toLowerCase();
  const relatedGoals = await db.select().from(goals);
  const channelGoals = relatedGoals
    .filter(
      (goal) =>
        goal.channelId === channel.id ||
        (!goal.channelId && goal.platform === platform),
    )
    .slice(0, 5);

  const snapshots = youtube
    ? await db
        .select()
        .from(socialMetricSnapshots)
        .where(eq(socialMetricSnapshots.channelId, channel.id))
        .orderBy(asc(socialMetricSnapshots.capturedOn))
        .limit(90)
    : [];

  const subscribers = youtubeDetails?.subscriberCount ?? channel.followerCount;
  const views = youtubeDetails?.viewCount ?? channel.viewCount;
  const videos = youtubeDetails?.videoCount ?? channel.videoCount;
  const title = youtubeDetails?.title ?? channel.channelTitle ?? channel.label;
  const thumbnail = youtubeDetails?.thumbnailUrl ?? channel.thumbnailUrl;
  const description = youtubeDetails?.description?.trim() || null;

  const metricSeries = youtube
    ? buildYouTubeMetricSeries(
        {
          followerCount: subscribers,
          dayStartCount: channel.dayStartCount,
          dayStartDate: channel.dayStartDate,
          viewCount: views,
          dayStartViewCount: channel.dayStartViewCount,
          videoCount: videos,
        },
        snapshots,
      )
    : null;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/social">
            <ArrowLeft aria-hidden />
            All channels
          </Link>
        </Button>
        <Badge variant="secondary" className="font-normal tabular-nums">
          Updated {channel.updatedAt.toLocaleString("en-GB")}
        </Badge>
      </div>

      <section className="flex flex-col gap-6 rounded-2xl border border-ink/15 bg-surface/80 p-5 shadow-card sm:flex-row sm:items-start sm:p-7">
        <div className="flex items-start gap-4">
          {thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element -- YouTube CDN hosts vary; plain img avoids next/image host config churn
            <img
              src={thumbnail}
              alt=""
              width={88}
              height={88}
              className="size-20 rounded-2xl border border-ink/15 object-cover sm:size-[5.5rem]"
            />
          ) : (
            <span className="inline-flex size-20 items-center justify-center rounded-2xl border border-ink/20 bg-muted sm:size-[5.5rem]">
              <DashboardChannelIcon
                channelKey={channel.key}
                label={channel.label}
                className="size-8"
              />
            </span>
          )}
          <div className="min-w-0 space-y-2">
            <p className="caption-mono text-ink-700 dark:text-ink-800">{channel.label}</p>
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            {youtubeDetails?.customUrl ? (
              <p className="text-ink-700 dark:text-ink-800">{youtubeDetails.customUrl}</p>
            ) : null}
            {description ? (
              <p className="max-w-2xl text-sm leading-relaxed text-ink-700 dark:text-ink-800 line-clamp-3">
                {description}
              </p>
            ) : (
              <p className="text-sm text-ink-700 dark:text-ink-800">
                {youtube
                  ? "Live stats from the YouTube Data API (subscriber counts are rounded by Google)."
                  : "Manual tracking — update followers here when your numbers change."}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-3 sm:ml-auto sm:justify-end">
          {channel.url ? <ExternalProfileLink href={channel.url} /> : null}
          {youtube && canEdit && youtubeReady ? (
            <ActionForm action={refreshYouTubeChannel} success="YouTube stats refreshed.">
              <input type="hidden" name="id" value={channel.id} />
              <Button type="submit" variant="accent" size="sm">
                <RefreshCw aria-hidden />
                Refresh from YouTube
              </Button>
            </ActionForm>
          ) : null}
        </div>
      </section>

      {youtubeError ? (
        <Card className="border-danger/30">
          <CardContent className="py-4 text-sm text-danger">{youtubeError}</CardContent>
        </Card>
      ) : null}

      {metricSeries ? (
        <MetricStudioChart series={metricSeries} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Followers"
            value={subscribers.toLocaleString()}
            delta={dailyDelta}
            icon={Users}
            hint="Today’s change vs start of day"
          />
          <MetricCard
            label="Tracked since"
            value={channel.createdAt.toLocaleDateString("en-GB")}
            icon={Goal}
            hint="When this channel was added"
          />
          <MetricCard
            label="Last update"
            value={channel.updatedAt.toLocaleDateString("en-GB")}
            icon={RefreshCw}
            hint={channel.updatedAt.toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          />
          <MetricCard
            label="Today’s change"
            value={dailyDelta > 0 ? `+${dailyDelta}` : String(dailyDelta)}
            icon={Users}
            hint="Compared with this morning’s baseline"
          />
        </div>
      )}

      {youtube && youtubeDetails ? (
        <Card>
          <CardHeader>
            <CardTitle>Recent uploads</CardTitle>
            <CardDescription>Latest public videos with views and engagement.</CardDescription>
          </CardHeader>
          <CardContent>
            <YouTubeUploads uploads={youtubeDetails.uploads} />
          </CardContent>
        </Card>
      ) : null}

      {channelGoals.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Related goals</CardTitle>
            <CardDescription>Growth targets tied to this platform.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {channelGoals.map((goal) => {
              const pct =
                goal.targetValue > 0
                  ? Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100))
                  : 0;
              return (
                <div key={goal.id} className="space-y-2">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <Link href="/dashboard/goals" className="font-medium hover:underline">
                      {goal.title}
                    </Link>
                    <span className="tabular-nums text-ink-700 dark:text-ink-800">
                      {goal.currentValue.toLocaleString()} / {goal.targetValue.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={pct} />
                </div>
              );
            })}
          </CardContent>
        </Card>
      ) : null}

      {canEdit ? (
        <Card>
          <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-4 space-y-0">
            <div className="min-w-0 space-y-1.5">
              <CardTitle>Edit channel</CardTitle>
              <CardDescription>
                {youtube
                  ? "Keep the profile URL current — save syncs live YouTube Data API stats."
                  : "Follower counts can’t be set by hand yet — only YouTube is wired for live sync. You can still update the profile URL."}
              </CardDescription>
            </div>
            <ConfirmDeleteButton
              title={`Delete ${channel.label}?`}
              description={`This permanently removes the ${channel.label} channel and its stats.`}
              confirmLabel="Delete channel"
              success={`${channel.label} deleted.`}
              formData={{ id: channel.id }}
              onConfirm={deleteSocialChannel}
            />
          </CardHeader>
          <CardContent className="space-y-4">
            <ActionForm
              action={updateSocialChannel}
              success={youtube ? "Channel saved and synced." : "Channel saved."}
              className="space-y-4"
            >
              <input type="hidden" name="id" value={channel.id} />
              <div className="flex flex-col gap-2.5">
                <Label htmlFor="url">Profile URL</Label>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Input
                    id="url"
                    name="url"
                    type="url"
                    required
                    defaultValue={channel.url ?? ""}
                    className="min-w-0 flex-1"
                  />
                  <Button type="submit" variant="accent" size="sm" className="shrink-0 sm:min-w-[9.5rem]">
                    <Save aria-hidden />
                    {youtube ? "Save & sync" : "Save URL"}
                  </Button>
                </div>
              </div>
            </ActionForm>

            <div className="flex flex-wrap items-center gap-3 border-t border-ink/10 pt-4">
              {youtube && youtubeReady ? (
                <ActionForm action={refreshYouTubeChannel} success="YouTube stats refreshed.">
                  <input type="hidden" name="id" value={channel.id} />
                  <Button type="submit" variant="outline" size="sm">
                    <RefreshCw aria-hidden />
                    Refresh from YouTube
                  </Button>
                </ActionForm>
              ) : null}
              {channel.url ? (
                <Button variant="outline" size="sm" asChild>
                  <Link href={channel.url} target="_blank" rel="noreferrer">
                    <ExternalLink aria-hidden />
                    Visit channel
                  </Link>
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-3xl font-semibold tabular-nums">{subscribers.toLocaleString()}</span>
          <DailyDeltaPill delta={dailyDelta} />
        </div>
      )}
    </div>
  );
}
