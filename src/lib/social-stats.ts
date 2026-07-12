/** Calendar date (YYYY-MM-DD) in Europe/London for daily follower deltas. */
export function londonToday(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/London",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function asDayString(value: string | Date) {
  if (value instanceof Date) {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/London",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(value);
  }
  return String(value).slice(0, 10);
}

export function dailyFollowerDelta(followerCount: number, dayStartCount: number) {
  return followerCount - dayStartCount;
}

/**
 * When the follower count changes, roll the day baseline forward if needed.
 * First write of a new calendar day uses the previous stored count as today's start.
 */
export function nextFollowerFields(
  channel: {
    followerCount: number;
    dayStartCount: number;
    dayStartDate: string | Date;
    viewCount?: number;
    dayStartViewCount?: number;
  },
  nextCount: number,
  today = londonToday(),
  nextViewCount?: number,
) {
  const sameDay = asDayString(channel.dayStartDate) === today;
  const dayStartCount = sameDay ? channel.dayStartCount : channel.followerCount;
  const currentViews = channel.viewCount ?? 0;
  const views = nextViewCount ?? currentViews;
  const dayStartViewCount = sameDay
    ? (channel.dayStartViewCount ?? currentViews)
    : currentViews;

  return {
    followerCount: nextCount,
    dayStartCount,
    dayStartDate: today,
    viewCount: views,
    dayStartViewCount,
    updatedAt: new Date(),
    dailyDelta: nextCount - dayStartCount,
    dailyViewDelta: views - dayStartViewCount,
  };
}
