"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Minus, Plus, RotateCcw, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const MAX_SCALE = 4;
const STEP = 0.25;
const VIEWPORT_WIDTH = 0.96;
const VIEWPORT_HEIGHT = 0.86;
const TOOLBAR_RESERVE_PX = 56;

type ImageLightboxProps = {
  src: string;
  alt: string;
  caption?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function LightboxControl({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex size-10 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function computeFitScale(naturalWidth: number, naturalHeight: number) {
  const maxW = window.innerWidth * VIEWPORT_WIDTH;
  const maxH = window.innerHeight * VIEWPORT_HEIGHT - TOOLBAR_RESERVE_PX;
  const scaleW = maxW / naturalWidth;
  const scaleH = maxH / naturalHeight;
  return Math.min(scaleW, scaleH, MAX_SCALE);
}

export function ImageLightbox({ src, alt, caption, open, onOpenChange }: ImageLightboxProps) {
  const [scale, setScale] = useState(1);
  const [fitScale, setFitScale] = useState(1);
  const [ready, setReady] = useState(false);
  const dimensionsRef = useRef({ width: 0, height: 0 });

  const applyFit = useCallback((width: number, height: number) => {
    dimensionsRef.current = { width, height };
    const nextFit = computeFitScale(width, height);
    setFitScale(nextFit);
    setScale(nextFit);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!open) {
      setScale(1);
      setFitScale(1);
      setReady(false);
      dimensionsRef.current = { width: 0, height: 0 };
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onResize = () => {
      const { width, height } = dimensionsRef.current;
      if (!width || !height) return;
      const nextFit = computeFitScale(width, height);
      setFitScale(nextFit);
      setScale(nextFit);
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [open]);

  const handleImageLoad = useCallback(
    (event: React.SyntheticEvent<HTMLImageElement>) => {
      const { naturalWidth, naturalHeight } = event.currentTarget;
      if (!naturalWidth || !naturalHeight) return;
      applyFit(naturalWidth, naturalHeight);
    },
    [applyFit],
  );

  const minScale = Math.min(0.5, fitScale * 0.5);
  const displayZoom = fitScale > 0 ? Math.round((scale / fitScale) * 100) : 100;

  const zoomIn = useCallback(() => setScale((s) => Math.min(MAX_SCALE, +(s + STEP * fitScale).toFixed(3))), [fitScale]);
  const zoomOut = useCallback(() => setScale((s) => Math.max(minScale, +(s - STEP * fitScale).toFixed(3))), [fitScale, minScale]);
  const resetZoom = useCallback(() => setScale(fitScale), [fitScale]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        zoomIn();
      }
      if (event.key === "-") {
        event.preventDefault();
        zoomOut();
      }
      if (event.key === "0") {
        event.preventDefault();
        resetZoom();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, zoomIn, zoomOut, resetZoom]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-sm transition-opacity duration-200 data-[state=closed]:opacity-0 data-[state=open]:opacity-100" />
        <Dialog.Content
          className="fixed inset-0 z-[201] flex flex-col outline-none transition-opacity duration-200 data-[state=closed]:opacity-0 data-[state=open]:opacity-100"
          aria-describedby={caption ? "lightbox-caption" : undefined}
        >
          <Dialog.Title className="sr-only">{alt}</Dialog.Title>

          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-6">
            <div className="min-w-0 flex-1">
              {caption ? (
                <p id="lightbox-caption" className="truncate font-mono text-xs uppercase tracking-[0.12em] text-white/70">
                  {caption}
                </p>
              ) : (
                <p className="truncate font-mono text-xs uppercase tracking-[0.12em] text-white/70">{alt}</p>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <LightboxControl label="Zoom out" onClick={zoomOut} disabled={scale <= minScale + 0.001}>
                <Minus className="size-4" aria-hidden />
              </LightboxControl>
              <span className="min-w-[3.25rem] text-center font-mono text-xs tabular-nums text-white/80">
                {displayZoom}%
              </span>
              <LightboxControl label="Zoom in" onClick={zoomIn} disabled={scale >= MAX_SCALE - 0.001}>
                <Plus className="size-4" aria-hidden />
              </LightboxControl>
              <LightboxControl label="Reset zoom" onClick={resetZoom} disabled={Math.abs(scale - fitScale) < 0.001}>
                <RotateCcw className="size-4" aria-hidden />
              </LightboxControl>
              <Dialog.Close asChild>
                <button
                  type="button"
                  aria-label="Close image"
                  className="ml-1 inline-flex size-10 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20"
                >
                  <X className="size-5" aria-hidden />
                </button>
              </Dialog.Close>
            </div>
          </div>

          <div
            className="flex min-h-0 flex-1 items-center justify-center overflow-auto p-2 sm:p-4"
            onClick={(event) => {
              if (event.target === event.currentTarget) onOpenChange(false);
            }}
          >
            <div
              className="inline-block origin-center transition-[transform,opacity] duration-200 ease-out"
              style={{
                transform: `scale(${scale})`,
                opacity: ready ? 1 : 0,
              }}
              onClick={(event) => event.stopPropagation()}
              onKeyDown={(event) => event.stopPropagation()}
            >
              {/* Native img — full source resolution; sizing via transform only */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={src}
                src={src}
                alt={alt}
                onLoad={handleImageLoad}
                className="block h-auto w-auto max-w-none rounded-xl border border-white/15 bg-black/20 shadow-2xl"
                decoding="async"
              />
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
