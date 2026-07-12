import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";

import { createSocialChannel } from "@/app/dashboard/actions";
import { ActionForm } from "@/components/dashboard/action-form";
import { DailyDeltaPill } from "@/components/dashboard/daily-delta-pill";
import { DashboardChannelIcon } from "@/components/dashboard/dashboard-channel-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db } from "@/db";
import { socialChannels } from "@/db/schema";
import { requireAppSession } from "@/lib/auth/session";
import { asDayString, dailyFollowerDelta, londonToday } from "@/lib/social-stats";
import { isYouTubeChannel, isYouTubeConfigured } from "@/lib/youtube";

export default async function SocialPage() {
  const session = await requireAppSession();
  const canEdit = session.profile.role !== "viewer";
  const youtubeReady = isYouTubeConfigured();
  const channels = await db.select().from(socialChannels).orderBy(socialChannels.label);
  const today = londonToday();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Social media</h1>
        <p className="mt-2 text-ink-700 dark:text-ink-800">
          Open a channel for full detail
          {youtubeReady ? " — YouTube pulls live Data API stats." : "."}
        </p>
      </div>

      {canEdit ? (
        <Card>
          <CardHeader>
            <CardTitle>Add channel</CardTitle>
            <CardDescription>e.g. youtube, instagram, tiktok.</CardDescription>
          </CardHeader>
          <CardContent>
            <ActionForm
              action={createSocialChannel}
              success="Channel added."
              className="grid gap-5 sm:grid-cols-2"
            >
              <div className="flex flex-col gap-2.5">
                <Label htmlFor="key">Key</Label>
                <Input id="key" name="key" required placeholder="youtube" />
              </div>
              <div className="flex flex-col gap-2.5">
                <Label htmlFor="label">Label</Label>
                <Input id="label" name="label" required placeholder="YouTube" />
              </div>
              <div className="flex flex-col gap-2.5 sm:col-span-2">
                <Label htmlFor="url">URL</Label>
                <Input id="url" name="url" type="url" required placeholder="https://…" />
              </div>
              <div className="pt-1 sm:col-span-2">
                <Button type="submit" variant="accent" size="sm">
                  <Plus aria-hidden />
                  Add channel
                </Button>
              </div>
            </ActionForm>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        {channels.length === 0 ? (
          <Card className="sm:col-span-2">
            <CardContent className="py-10 text-center text-ink-700 dark:text-ink-800">No channels yet.</CardContent>
          </Card>
        ) : (
          channels.map((channel) => {
            const dayStart =
              asDayString(channel.dayStartDate) === today
                ? channel.dayStartCount
                : channel.followerCount;
            const dailyDelta = dailyFollowerDelta(channel.followerCount, dayStart);
            const youtube = isYouTubeChannel(channel);

            return (
              <Link
                key={channel.id}
                href={`/dashboard/social/${channel.id}`}
                className="group rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                <Card className="h-full overflow-hidden transition-[transform,border-color] group-hover:-translate-y-0.5 group-hover:border-ink/35 motion-reduce:transform-none">
                  <CardHeader className="gap-3 pb-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <CardTitle className="flex items-center gap-2.5">
                        <DashboardChannelIcon channelKey={channel.key} label={channel.label} />
                        {channel.label}
                      </CardTitle>
                      <ArrowRight
                        className="size-4 shrink-0 text-ink-700 transition-transform group-hover:translate-x-0.5 dark:text-ink-800"
                        aria-hidden
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="text-3xl font-semibold tabular-nums">
                        {channel.followerCount.toLocaleString()}
                      </span>
                      <DailyDeltaPill delta={dailyDelta} />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="w-fit font-normal tabular-nums">
                        Updated {channel.updatedAt.toLocaleString("en-GB")}
                      </Badge>
                      {youtube ? (
                        <Badge variant="accent" className="w-fit font-normal">
                          Live API
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="w-fit font-normal">
                          Manual
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-ink-700 dark:text-ink-800">
                      {youtube
                        ? `${channel.viewCount.toLocaleString()} views · ${channel.videoCount.toLocaleString()} videos`
                        : "Open for channel detail and editing"}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
