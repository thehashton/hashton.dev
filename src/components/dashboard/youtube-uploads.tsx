import Link from "next/link";
import { Eye, ThumbsUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { YouTubeUpload } from "@/lib/youtube";

export function YouTubeUploads({ uploads }: { uploads: YouTubeUpload[] }) {
  if (uploads.length === 0) {
    return <p className="text-sm text-ink-700 dark:text-ink-800">No recent uploads found.</p>;
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {uploads.map((video) => (
        <li key={video.videoId}>
          <Link
            href={`https://www.youtube.com/watch?v=${video.videoId}`}
            target="_blank"
            rel="noreferrer"
            className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-ink/20 bg-surface transition-[border-color,transform] hover:-translate-y-0.5 hover:border-ink/40 motion-reduce:transform-none"
          >
            <div className="relative aspect-video overflow-hidden bg-muted">
              {video.thumbnailUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- YouTube CDN hosts vary
                <img
                  src={video.thumbnailUrl}
                  alt=""
                  className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transform-none"
                />
              ) : null}
              {video.publishedAt ? (
                <Badge
                  variant="secondary"
                  className="absolute top-2 right-2 border-0 bg-black/75 font-normal text-white tabular-nums backdrop-blur-sm"
                >
                  {new Date(video.publishedAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </Badge>
              ) : null}
              {video.duration ? (
                <span className="absolute right-2 bottom-2 rounded-md bg-black/80 px-1.5 py-0.5 font-mono text-xs text-white tabular-nums">
                  {video.duration}
                </span>
              ) : null}
            </div>
            <div className="flex flex-1 flex-col gap-3 p-4">
              <p className="line-clamp-2 font-semibold tracking-tight text-ink">{video.title}</p>
              <div className="mt-auto flex flex-wrap gap-2">
                <Badge variant="secondary" className="gap-1.5 font-normal tabular-nums">
                  <Eye className="size-3.5" aria-hidden />
                  <span>{video.viewCount.toLocaleString()} views</span>
                </Badge>
                <Badge variant="secondary" className="gap-1.5 font-normal tabular-nums">
                  <ThumbsUp className="size-3.5" aria-hidden />
                  <span>{video.likeCount.toLocaleString()} likes</span>
                </Badge>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
