"use client";

import MuxPlayer from "@mux/mux-player-react";
import Image from "next/image";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "framer-motion";
import { Maximize2, Pause, Play, Volume2, VolumeX, X } from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import { Magnetic } from "@/components/motion/magnetic";
import { cn } from "@/lib/utils";

export type HeroVideoFileProps = {
  kind: "file";
  src: { mp4: string; webm: string };
  poster: string;
  durationLabel: string;
  caption: string;
};

export type HeroVideoMuxProps = {
  kind: "mux";
  playbackId: string;
  caption: string;
  /** Seconds into the asset for teaser poster and Mux Player poster (default 5). */
  thumbnailTime?: number;
  durationLabel?: string;
  /** Override Mux thumbnail URL; defaults to image.mux.com thumbnail at `thumbnailTime`. */
  poster?: string;
};

export type HeroVideoProps = HeroVideoFileProps | HeroVideoMuxProps;

function muxPosterUrl(playbackId: string, timeSeconds: number) {
  const q = new URLSearchParams({ time: String(timeSeconds) });
  return `https://image.mux.com/${playbackId}/thumbnail.jpg?${q.toString()}`;
}

function useInViewOnce(ref: { current: HTMLElement | null }, rootMargin = "120px") {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setSeen(true);
          obs.disconnect();
        }
      },
      { rootMargin },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, rootMargin, seen]);
  return seen;
}

export function HeroVideo(props: HeroVideoProps) {
  const reduceMotion = useReducedMotion();
  const shellId = useId();
  const titleId = `${shellId}-title`;
  const videoRef = useRef<HTMLVideoElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);

  const isMux = props.kind === "mux";
  const isFile = props.kind === "file";
  const caption = props.caption;
  const thumbnailTime = isMux ? (props.thumbnailTime ?? 5) : 0;
  const durationLabel = isMux ? (props.durationLabel ?? "Mux") : props.durationLabel;
  const posterResolved = isMux
    ? props.poster ?? muxPosterUrl(props.playbackId, thumbnailTime)
    : props.poster;

  const [open, setOpen] = useState(false);
  const [mountedPlayer, setMountedPlayer] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const inView = useInViewOnce(shellRef);

  useEffect(() => {
    if (open || inView) setMountedPlayer(true);
  }, [open, inView]);

  useEffect(() => {
    if (!open || !isFile) return;
    closeRef.current?.focus();
    const v = videoRef.current;
    const onTime = () => {
      if (!v) return;
      setProgress(v.currentTime);
      setDuration(v.duration || 0);
    };
    v?.addEventListener("timeupdate", onTime);
    v?.addEventListener("loadedmetadata", onTime);
    return () => {
      v?.removeEventListener("timeupdate", onTime);
      v?.removeEventListener("loadedmetadata", onTime);
    };
  }, [open, isFile]);

  useEffect(() => {
    if (!open || !isFile) return;
    const v = videoRef.current;
    if (!v) return;
    void v.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }, [open, mountedPlayer, isFile]);

  useEffect(() => {
    if (!open || !isFile) return;
    const onKey = (e: KeyboardEvent) => {
      const v = videoRef.current;
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key === " " || e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (!v) return;
        if (v.paused) {
          void v.play();
          setPlaying(true);
        } else {
          v.pause();
          setPlaying(false);
        }
        return;
      }
      if (e.key.toLowerCase() === "m") {
        e.preventDefault();
        setMuted((m) => {
          const next = !m;
          if (v) v.muted = next;
          return next;
        });
        return;
      }
      if (e.key.toLowerCase() === "f") {
        e.preventDefault();
        void v?.requestFullscreen?.();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, muted, isFile]);

  useEffect(() => {
    if (!isFile) return;
    const v = videoRef.current;
    if (v) v.muted = muted;
  }, [muted, isFile]);

  useEffect(() => {
    if (!open || !isMux) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, isMux]);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      void v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  }, []);

  const onScrub = useCallback(
    (pct: number) => {
      const v = videoRef.current;
      if (!v || !duration) return;
      v.currentTime = pct * duration;
      setProgress(v.currentTime);
    },
    [duration],
  );

  const pct = duration ? progress / duration : 0;

  const layoutTransition = reduceMotion
    ? { duration: 0.01 }
    : { type: "spring" as const, stiffness: 380, damping: 38, mass: 0.85 };

  const teaserImageSizes = "(max-width: 1024px) 100vw, 50vw";

  return (
    <LayoutGroup id={`hero-video-${shellId}`}>
      <div ref={shellRef} className="relative w-full">
        <p className="caption-mono mb-3 text-ink-600">{caption}</p>

        <AnimatePresence initial={false} mode="popLayout">
          {!open ? (
            <motion.article
              key="hv-closed"
              layoutId="hero-video-shell"
              transition={{ layout: layoutTransition }}
              className={cn(
                "relative w-full min-w-0 overflow-hidden rounded-xl border border-ink/10 bg-ink shadow-xl",
              )}
            >
              <div className="relative aspect-video w-full">
                <Image
                  src={posterResolved}
                  alt=""
                  fill
                  priority
                  sizes={teaserImageSizes}
                  className="object-cover"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-t from-ink/55 via-ink/25 to-transparent">
                  <Magnetic strength={0.22} className="cursor-pointer">
                    <motion.button
                      type="button"
                      layout={false}
                      whileHover={reduceMotion ? undefined : { scale: 1.04 }}
                      whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                      className="flex size-24 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-accent text-accent-foreground shadow-lg transition-colors hover:bg-accent-600"
                      aria-label={
                        isMux ? "Play introduction video (Mux)" : "Play introduction video"
                      }
                      onClick={() => setOpen(true)}
                    >
                      <Play className="size-9 translate-x-0.5 fill-current" aria-hidden />
                    </motion.button>
                  </Magnetic>
                  <p className="caption-mono text-paper">
                    {durationLabel}
                    <span className="text-paper/70"> — </span>
                    Play intro
                  </p>
                </div>
              </div>
            </motion.article>
          ) : (
            <motion.div
              key="hv-open"
              layoutId="hero-video-shell"
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              transition={{ layout: layoutTransition }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/88 p-4 md:p-10"
            >
              <motion.div
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative flex w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-paper/15 bg-ink shadow-2xl"
              >
                <div className="flex items-start justify-between gap-4 border-b border-paper/15 p-4 md:p-5">
                  <div>
                    <h2 id={titleId} className="font-sans text-xl font-bold tracking-tight text-paper md:text-2xl">
                      Intro — Harry Ashton
                    </h2>
                    <p className="caption-mono mt-2 text-paper/70">{caption}</p>
                  </div>
                  <button
                    ref={closeRef}
                    type="button"
                    className="shrink-0 rounded-lg border border-paper/20 bg-paper p-2 text-ink transition-colors hover:bg-paper/90"
                    aria-label="Close video"
                    onClick={() => {
                      setOpen(false);
                      const v = videoRef.current;
                      if (v) {
                        v.pause();
                        setPlaying(false);
                      }
                    }}
                  >
                    <X className="size-5" aria-hidden />
                  </button>
                </div>

                <div className="relative aspect-video w-full bg-ink">
                  {mountedPlayer && isMux ? (
                    <MuxPlayer
                      playbackId={props.playbackId}
                      thumbnailTime={thumbnailTime}
                      streamType="on-demand"
                      autoPlay
                      muted={false}
                      className="size-full"
                      proudlyDisplayMuxBadge={false}
                    />
                  ) : null}
                  {mountedPlayer && isFile ? (
                    <video
                      ref={videoRef}
                      className="size-full object-contain"
                      poster={props.poster}
                      preload="metadata"
                      playsInline
                      muted={muted}
                      controls={false}
                      onPlay={() => setPlaying(true)}
                      onPause={() => setPlaying(false)}
                    >
                      <source src={props.src.webm} type="video/webm" />
                      <source src={props.src.mp4} type="video/mp4" />
                      <track kind="captions" srcLang="en" label="English" />
                    </video>
                  ) : null}
                </div>

                {isFile ? (
                  <>
                    <div className="flex flex-col gap-4 border-t border-paper/15 p-4 md:flex-row md:items-center md:justify-between md:px-5 md:py-4">
                      <div className="flex flex-1 flex-col gap-2">
                        <label htmlFor={`${shellId}-scrub`} className="caption-mono text-paper/70">
                          Progress
                        </label>
                        <input
                          id={`${shellId}-scrub`}
                          type="range"
                          min={0}
                          max={1}
                          step={0.001}
                          value={Number.isFinite(pct) ? pct : 0}
                          onChange={(e) => onScrub(Number(e.target.value))}
                          className="h-2 w-full cursor-pointer accent-accent"
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          className="rounded-lg border border-paper/20 bg-paper/95 px-3 py-2 font-mono text-[10px] tracking-[0.16em] text-ink uppercase transition-colors hover:bg-paper"
                          onClick={togglePlay}
                          aria-label={playing ? "Pause" : "Play"}
                        >
                          {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
                        </button>
                        <button
                          type="button"
                          className="rounded-lg border border-paper/20 bg-paper/95 px-3 py-2 font-mono text-[10px] tracking-[0.16em] text-ink uppercase transition-colors hover:bg-paper"
                          onClick={() => setMuted((m) => !m)}
                          aria-label={muted ? "Unmute" : "Mute"}
                        >
                          {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
                        </button>
                        <button
                          type="button"
                          className="rounded-lg border border-paper/20 bg-paper/95 px-3 py-2 font-mono text-[10px] tracking-[0.16em] text-ink uppercase transition-colors hover:bg-paper"
                          onClick={() => void videoRef.current?.requestFullscreen?.()}
                          aria-label="Fullscreen"
                        >
                          <Maximize2 className="size-4" />
                        </button>
                      </div>
                    </div>

                    <p className="caption-mono border-t border-paper/15 px-4 py-3 text-paper/60 md:px-5">
                      Keys: Space or K (play), M (mute), F (fullscreen), Esc (close)
                    </p>
                  </>
                ) : (
                  <p className="caption-mono border-t border-paper/15 px-4 py-3 text-paper/60 md:px-5">
                    Keys: Esc (close). Use the player for playback controls.
                  </p>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  );
}
