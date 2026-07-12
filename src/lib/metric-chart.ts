import { asDayString, londonToday } from "@/lib/social-stats";

export type MetricKey = "subscribers" | "views" | "videos" | "avgViews";

export type MetricPoint = {
  date: string;
  label: string;
  value: number;
};

export type MetricSeries = {
  key: MetricKey;
  label: string;
  unit?: string;
  current: number;
  deltaToday: number | null;
  points: MetricPoint[];
};

type SnapshotRow = {
  capturedOn: string | Date;
  followerCount: number;
  viewCount: number;
  videoCount: number;
};

type ChannelMetrics = {
  followerCount: number;
  dayStartCount: number | null;
  dayStartDate: string | Date | null;
  viewCount: number;
  dayStartViewCount: number | null;
  videoCount: number;
};

function formatShortDate(isoDay: string) {
  const date = new Date(`${isoDay}T12:00:00`);
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function toDay(value: string | Date) {
  return asDayString(value) ?? String(value).slice(0, 10);
}

function avgViews(viewCount: number, videoCount: number) {
  if (videoCount <= 0) return 0;
  return Math.round(viewCount / videoCount);
}

export function buildYouTubeMetricSeries(
  channel: ChannelMetrics,
  snapshots: SnapshotRow[],
): MetricSeries[] {
  const today = londonToday();
  const ordered = [...snapshots].sort(
    (a, b) => toDay(a.capturedOn).localeCompare(toDay(b.capturedOn)),
  );

  const daily = ordered.map((row) => ({
    date: toDay(row.capturedOn),
    followers: row.followerCount,
    views: row.viewCount,
    videos: row.videoCount,
  }));

  // Ensure today's live totals are present even before the next refresh lands.
  const last = daily[daily.length - 1];
  if (!last || last.date !== today) {
    daily.push({
      date: today,
      followers: channel.followerCount,
      views: channel.viewCount,
      videos: channel.videoCount,
    });
  } else {
    last.followers = channel.followerCount;
    last.views = channel.viewCount;
    last.videos = channel.videoCount;
  }

  // Soft open for same-day growth so the chart isn't a single flat dot.
  const dayStart = channel.dayStartDate ? asDayString(channel.dayStartDate) : null;
  if (
    daily.length === 1 &&
    dayStart === today &&
    channel.dayStartCount != null &&
    (channel.dayStartCount !== channel.followerCount ||
      (channel.dayStartViewCount != null &&
        channel.dayStartViewCount !== channel.viewCount))
  ) {
    daily.unshift({
      date: `${today}-start`,
      followers: channel.dayStartCount,
      views: channel.dayStartViewCount ?? channel.viewCount,
      videos: channel.videoCount,
    });
  }

  const followerDelta =
    dayStart === today && channel.dayStartCount != null
      ? channel.followerCount - channel.dayStartCount
      : null;
  const viewDelta =
    dayStart === today && channel.dayStartViewCount != null
      ? channel.viewCount - channel.dayStartViewCount
      : null;

  const toPoints = (
    pick: (row: (typeof daily)[number]) => number,
  ): MetricPoint[] =>
    daily.map((row) => ({
      date: row.date,
      label: row.date.endsWith("-start") ? "Start of day" : formatShortDate(row.date.slice(0, 10)),
      value: pick(row),
    }));

  const avgPoints = toPoints((row) => avgViews(row.views, row.videos));
  const startAvg =
    channel.dayStartViewCount != null
      ? avgViews(channel.dayStartViewCount, channel.videoCount)
      : null;
  const currentAvg = avgViews(channel.viewCount, channel.videoCount);

  return [
    {
      key: "subscribers",
      label: "Subscribers",
      current: channel.followerCount,
      deltaToday: followerDelta,
      points: toPoints((row) => row.followers),
    },
    {
      key: "views",
      label: "Total views",
      current: channel.viewCount,
      deltaToday: viewDelta,
      points: toPoints((row) => row.views),
    },
    {
      key: "videos",
      label: "Videos",
      current: channel.videoCount,
      deltaToday: null,
      points: toPoints((row) => row.videos),
    },
    {
      key: "avgViews",
      label: "Avg views / video",
      current: currentAvg,
      deltaToday:
        startAvg != null && dayStart === today ? currentAvg - startAvg : null,
      points: avgPoints,
    },
  ];
}
