export type YouTubeChannelStats = {
  channelId: string;
  title: string;
  customUrl: string | null;
  description: string;
  thumbnailUrl: string | null;
  publishedAt: string | null;
  subscriberCount: number;
  hiddenSubscriberCount: boolean;
  viewCount: number;
  videoCount: number;
};

export type YouTubeUpload = {
  videoId: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnailUrl: string | null;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  duration: string | null;
};

export type YouTubeChannelDetails = YouTubeChannelStats & {
  uploads: YouTubeUpload[];
};

function getApiKey() {
  const key = process.env.YOUTUBE_DATA_API_KEY?.trim();
  if (!key) {
    throw new Error("YOUTUBE_DATA_API_KEY is not set in .env.local");
  }
  return key;
}

export function isYouTubeConfigured() {
  return Boolean(process.env.YOUTUBE_DATA_API_KEY?.trim());
}

export function isYouTubeChannel(channel: { key: string; url: string | null }) {
  return (
    channel.key.toLowerCase() === "youtube" ||
    /youtube\.com|youtu\.be/i.test(channel.url ?? "")
  );
}

/** Extract a channel ID, handle, or legacy username from a YouTube URL or raw handle. */
export function parseYouTubeChannelRef(input: string): {
  kind: "id" | "handle" | "username";
  value: string;
} | null {
  const raw = input.trim();
  if (!raw) return null;

  if (/^UC[\w-]{20,}$/.test(raw)) {
    return { kind: "id", value: raw };
  }

  if (raw.startsWith("@")) {
    return { kind: "handle", value: raw.slice(1) };
  }

  try {
    const url = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
    if (!/(^|\.)youtube\.com$/.test(url.hostname) && url.hostname !== "youtu.be") {
      return null;
    }

    const parts = url.pathname.split("/").filter(Boolean);
    if (parts[0]?.startsWith("@")) {
      return { kind: "handle", value: parts[0].slice(1) };
    }
    if (parts[0] === "channel" && parts[1]) {
      return { kind: "id", value: parts[1] };
    }
    if ((parts[0] === "c" || parts[0] === "user") && parts[1]) {
      return { kind: "username", value: parts[1] };
    }
  } catch {
    if (/^[\w.-]{2,}$/.test(raw)) {
      return { kind: "handle", value: raw.replace(/^@/, "") };
    }
    return null;
  }

  if (/^[\w.-]{2,}$/.test(raw)) {
    return { kind: "handle", value: raw.replace(/^@/, "") };
  }

  return null;
}

type YoutubeChannelsResponse = {
  items?: Array<{
    id: string;
    snippet?: {
      title?: string;
      description?: string;
      customUrl?: string;
      publishedAt?: string;
      thumbnails?: { medium?: { url?: string }; high?: { url?: string } };
    };
    contentDetails?: {
      relatedPlaylists?: { uploads?: string };
    };
    statistics?: {
      subscriberCount?: string;
      hiddenSubscriberCount?: boolean;
      viewCount?: string;
      videoCount?: string;
    };
  }>;
  error?: { message?: string };
};

type YoutubePlaylistItemsResponse = {
  items?: Array<{
    contentDetails?: { videoId?: string };
    snippet?: {
      title?: string;
      description?: string;
      publishedAt?: string;
      thumbnails?: { medium?: { url?: string }; high?: { url?: string } };
      resourceId?: { videoId?: string };
    };
  }>;
  error?: { message?: string };
};

type YoutubeVideosResponse = {
  items?: Array<{
    id: string;
    snippet?: {
      title?: string;
      description?: string;
      publishedAt?: string;
      thumbnails?: { medium?: { url?: string }; high?: { url?: string } };
    };
    contentDetails?: { duration?: string };
    statistics?: {
      viewCount?: string;
      likeCount?: string;
      commentCount?: string;
    };
  }>;
  error?: { message?: string };
};

async function youtubeGet<T>(path: string, params: Record<string, string>): Promise<T> {
  const apiKey = getApiKey();
  const search = new URLSearchParams({ key: apiKey, ...params });
  const res = await fetch(`https://www.googleapis.com/youtube/v3/${path}?${search}`, {
    next: { revalidate: 0 },
  });
  const data = (await res.json()) as T & { error?: { message?: string } };
  if (!res.ok) {
    throw new Error(data.error?.message || `YouTube API error (${res.status})`);
  }
  return data;
}

function mapChannelItem(
  item: NonNullable<YoutubeChannelsResponse["items"]>[number],
): YouTubeChannelStats {
  if (!item.statistics) {
    throw new Error("No YouTube channel statistics available.");
  }

  return {
    channelId: item.id,
    title: item.snippet?.title ?? "YouTube",
    customUrl: item.snippet?.customUrl ?? null,
    description: item.snippet?.description ?? "",
    thumbnailUrl:
      item.snippet?.thumbnails?.high?.url ?? item.snippet?.thumbnails?.medium?.url ?? null,
    publishedAt: item.snippet?.publishedAt ?? null,
    subscriberCount: Number(item.statistics.subscriberCount ?? 0),
    hiddenSubscriberCount: Boolean(item.statistics.hiddenSubscriberCount),
    viewCount: Number(item.statistics.viewCount ?? 0),
    videoCount: Number(item.statistics.videoCount ?? 0),
  };
}

async function youtubeChannelsQuery(params: Record<string, string>) {
  const data = await youtubeGet<YoutubeChannelsResponse>("channels", {
    part: "snippet,statistics,contentDetails",
    ...params,
  });
  const item = data.items?.[0];
  if (!item) {
    throw new Error("No YouTube channel found for that URL or handle.");
  }
  return { stats: mapChannelItem(item), uploadsPlaylistId: item.contentDetails?.relatedPlaylists?.uploads };
}

async function resolveChannel(urlOrHandle: string) {
  const ref = parseYouTubeChannelRef(urlOrHandle);
  if (!ref) {
    throw new Error("Could not parse a YouTube channel from that URL.");
  }

  if (ref.kind === "id") {
    return youtubeChannelsQuery({ id: ref.value });
  }
  if (ref.kind === "handle") {
    return youtubeChannelsQuery({ forHandle: ref.value });
  }

  try {
    return await youtubeChannelsQuery({ forUsername: ref.value });
  } catch {
    return youtubeChannelsQuery({ forHandle: ref.value });
  }
}

export async function fetchYouTubeChannelStats(urlOrHandle: string): Promise<YouTubeChannelStats> {
  const { stats } = await resolveChannel(urlOrHandle);
  return stats;
}

function formatIsoDuration(iso: string | undefined): string | null {
  if (!iso) return null;
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return iso;
  const hours = Number(match[1] ?? 0);
  const minutes = Number(match[2] ?? 0);
  const seconds = Number(match[3] ?? 0);
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export async function fetchYouTubeChannelDetails(
  urlOrHandle: string,
  opts?: { uploadLimit?: number },
): Promise<YouTubeChannelDetails> {
  const limit = opts?.uploadLimit ?? 8;
  const { stats, uploadsPlaylistId } = await resolveChannel(urlOrHandle);

  if (!uploadsPlaylistId) {
    return { ...stats, uploads: [] };
  }

  const playlist = await youtubeGet<YoutubePlaylistItemsResponse>("playlistItems", {
    part: "snippet,contentDetails",
    playlistId: uploadsPlaylistId,
    maxResults: String(limit),
  });

  const videoIds = (playlist.items ?? [])
    .map((item) => item.contentDetails?.videoId ?? item.snippet?.resourceId?.videoId)
    .filter((id): id is string => Boolean(id));

  if (videoIds.length === 0) {
    return { ...stats, uploads: [] };
  }

  const videos = await youtubeGet<YoutubeVideosResponse>("videos", {
    part: "snippet,statistics,contentDetails",
    id: videoIds.join(","),
  });

  const uploads: YouTubeUpload[] = (videos.items ?? []).map((item) => ({
    videoId: item.id,
    title: item.snippet?.title ?? "Untitled",
    description: item.snippet?.description ?? "",
    publishedAt: item.snippet?.publishedAt ?? "",
    thumbnailUrl:
      item.snippet?.thumbnails?.high?.url ?? item.snippet?.thumbnails?.medium?.url ?? null,
    viewCount: Number(item.statistics?.viewCount ?? 0),
    likeCount: Number(item.statistics?.likeCount ?? 0),
    commentCount: Number(item.statistics?.commentCount ?? 0),
    duration: formatIsoDuration(item.contentDetails?.duration),
  }));

  return { ...stats, uploads };
}
