import type { GoalPlatform, SocialChannel } from "@/db/schema";
import { asDayString, londonToday } from "@/lib/social-stats";

export type GoalMetricKey =
  | "subscribers"
  | "followers"
  | "views"
  | "videos"
  | "avg_views"
  | "subscribers_today"
  | "views_today"
  | "followers_today"
  | "views_per_sub"
  | "subs_per_video";

export type GoalMetricOption = {
  key: GoalMetricKey;
  label: string;
  description: string;
  defaultTitle: string;
  suggestedTargets: number[];
  /** True when the metric can be filled from synced channel fields today. */
  liveSource: "youtube" | "followers" | "derived";
  platforms: GoalPlatform[];
};

export const GOAL_METRICS: GoalMetricOption[] = [
  {
    key: "subscribers",
    label: "Subscribers",
    description: "Lifetime subscriber count from YouTube Data API",
    defaultTitle: "YouTube subscribers",
    suggestedTargets: [5_000, 10_000, 25_000, 50_000, 100_000],
    liveSource: "youtube",
    platforms: ["youtube"],
  },
  {
    key: "views",
    label: "Total views",
    description: "Lifetime channel view count",
    defaultTitle: "YouTube total views",
    suggestedTargets: [500_000, 1_000_000, 2_500_000, 5_000_000, 10_000_000],
    liveSource: "youtube",
    platforms: ["youtube"],
  },
  {
    key: "videos",
    label: "Public videos",
    description: "Number of public uploads on the channel",
    defaultTitle: "YouTube video library",
    suggestedTargets: [100, 250, 500, 750, 1_000],
    liveSource: "youtube",
    platforms: ["youtube"],
  },
  {
    key: "avg_views",
    label: "Avg views / video",
    description: "Total views ÷ video count",
    defaultTitle: "Average views per video",
    suggestedTargets: [1_000, 2_500, 5_000, 10_000, 25_000],
    liveSource: "derived",
    platforms: ["youtube"],
  },
  {
    key: "subscribers_today",
    label: "Subscribers today",
    description: "Net subscribers gained since start of day (London)",
    defaultTitle: "Daily subscriber growth",
    suggestedTargets: [5, 10, 25, 50, 100],
    liveSource: "youtube",
    platforms: ["youtube"],
  },
  {
    key: "views_today",
    label: "Views today",
    description: "Net views gained since start of day (London)",
    defaultTitle: "Daily view growth",
    suggestedTargets: [500, 1_000, 2_500, 5_000, 10_000],
    liveSource: "youtube",
    platforms: ["youtube"],
  },
  {
    key: "views_per_sub",
    label: "Views per subscriber",
    description: "Total views ÷ subscribers (reach depth)",
    defaultTitle: "Views per subscriber",
    suggestedTargets: [50, 100, 150, 200, 300],
    liveSource: "derived",
    platforms: ["youtube"],
  },
  {
    key: "subs_per_video",
    label: "Subscribers per video",
    description: "Subscribers ÷ video count (conversion density)",
    defaultTitle: "Subscribers per video",
    suggestedTargets: [5, 10, 25, 50, 100],
    liveSource: "derived",
    platforms: ["youtube"],
  },
  {
    key: "followers",
    label: "Followers",
    description: "Follower / connection count for the linked profile",
    defaultTitle: "Follower milestone",
    suggestedTargets: [1_000, 5_000, 10_000, 25_000, 50_000],
    liveSource: "followers",
    platforms: ["instagram", "tiktok", "twitter", "linkedin", "other"],
  },
  {
    key: "followers_today",
    label: "Followers today",
    description: "Net followers gained since start of day (London)",
    defaultTitle: "Daily follower growth",
    suggestedTargets: [5, 10, 25, 50, 100],
    liveSource: "followers",
    platforms: ["instagram", "tiktok", "twitter", "linkedin", "other"],
  },
];

export function platformFromChannelKey(key: string): GoalPlatform {
  const normalized = key.toLowerCase() === "x" ? "twitter" : key.toLowerCase();
  if (
    normalized === "youtube" ||
    normalized === "instagram" ||
    normalized === "tiktok" ||
    normalized === "twitter" ||
    normalized === "linkedin"
  ) {
    return normalized;
  }
  return "other";
}

export function metricsForPlatform(platform: GoalPlatform): GoalMetricOption[] {
  return GOAL_METRICS.filter((metric) => metric.platforms.includes(platform));
}

export function getGoalMetric(key: string | null | undefined): GoalMetricOption | undefined {
  if (!key) return undefined;
  return GOAL_METRICS.find((metric) => metric.key === key);
}

export function isGoalMetricKey(value: string): value is GoalMetricKey {
  return GOAL_METRICS.some((metric) => metric.key === value);
}

type ChannelMetrics = Pick<
  SocialChannel,
  | "followerCount"
  | "dayStartCount"
  | "dayStartDate"
  | "viewCount"
  | "dayStartViewCount"
  | "videoCount"
>;

function avgViews(viewCount: number, videoCount: number) {
  if (videoCount <= 0) return 0;
  return Math.round(viewCount / videoCount);
}

export function resolveMetricValue(
  channel: ChannelMetrics,
  metricKey: GoalMetricKey,
  today = londonToday(),
): number {
  const sameDay = asDayString(channel.dayStartDate) === today;
  const dayStartFollowers = sameDay ? channel.dayStartCount : channel.followerCount;
  const dayStartViews = sameDay
    ? (channel.dayStartViewCount ?? channel.viewCount)
    : channel.viewCount;

  switch (metricKey) {
    case "subscribers":
    case "followers":
      return channel.followerCount;
    case "views":
      return channel.viewCount;
    case "videos":
      return channel.videoCount;
    case "avg_views":
      return avgViews(channel.viewCount, channel.videoCount);
    case "subscribers_today":
    case "followers_today":
      return Math.max(0, channel.followerCount - dayStartFollowers);
    case "views_today":
      return Math.max(0, channel.viewCount - dayStartViews);
    case "views_per_sub":
      return channel.followerCount > 0
        ? Math.round(channel.viewCount / channel.followerCount)
        : 0;
    case "subs_per_video":
      return channel.videoCount > 0
        ? Math.round(channel.followerCount / channel.videoCount)
        : 0;
    default:
      return 0;
  }
}

export function formatMetricValue(value: number) {
  return new Intl.NumberFormat("en-US").format(Math.round(value));
}
