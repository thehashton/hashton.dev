"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useId, useMemo, useState } from "react";

import type { MetricKey, MetricSeries } from "@/lib/metric-chart";
import { cn } from "@/lib/utils";

type MetricStudioChartProps = {
  series: MetricSeries[];
  className?: string;
};

function formatCount(value: number) {
  return new Intl.NumberFormat("en-US").format(Math.round(value));
}

function formatDelta(value: number | null) {
  if (value == null) return null;
  if (value === 0) return "0 today";
  const sign = value > 0 ? "+" : "";
  return `${sign}${formatCount(value)} today`;
}

function buildPath(points: { x: number; y: number }[]) {
  if (points.length === 0) return "";
  if (points.length === 1) {
    const p = points[0];
    return `M ${p.x} ${p.y}`;
  }

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const current = points[i];
    const next = points[i + 1];
    const cx = (current.x + next.x) / 2;
    d += ` C ${cx} ${current.y}, ${cx} ${next.y}, ${next.x} ${next.y}`;
  }
  return d;
}

export function MetricStudioChart({ series, className }: MetricStudioChartProps) {
  const reduceMotion = useReducedMotion();
  const gradientId = useId().replace(/:/g, "");
  const [activeKey, setActiveKey] = useState<MetricKey>(series[0]?.key ?? "subscribers");
  const active = series.find((item) => item.key === activeKey) ?? series[0];

  const chart = useMemo(() => {
    const width = 1000;
    const height = 320;
    const padX = 28;
    const padY = 32;

    if (!active?.points.length) {
      return {
        line: "",
        area: "",
        dots: [] as { x: number; y: number; label: string; value: number }[],
        width,
        height,
        singlePoint: true,
      };
    }

    const values = active.points.map((p) => p.value);
    const minRaw = Math.min(...values);
    const maxRaw = Math.max(...values);
    const spread = Math.max(maxRaw - minRaw, Math.max(1, maxRaw * 0.02));
    const min = Math.max(0, minRaw - spread * 0.15);
    const max = maxRaw + spread * 0.2;
    const range = Math.max(max - min, 1);

    const yFor = (value: number) =>
      padY + (1 - (value - min) / range) * (height - padY * 2);

    // One snapshot → flat span so the area chart still feels intentional.
    const coords =
      active.points.length === 1
        ? [
            {
              x: padX,
              y: yFor(active.points[0].value),
              label: active.points[0].label,
              value: active.points[0].value,
            },
            {
              x: width - padX,
              y: yFor(active.points[0].value),
              label: active.points[0].label,
              value: active.points[0].value,
            },
          ]
        : active.points.map((point, index) => {
            const x = padX + (index / (active.points.length - 1)) * (width - padX * 2);
            return {
              x,
              y: yFor(point.value),
              label: point.label,
              value: point.value,
            };
          });

    const line = buildPath(coords);
    const area = `${line} L ${coords[coords.length - 1].x} ${height} L ${coords[0].x} ${height} Z`;

    return { line, area, dots: coords, width, height, singlePoint: active.points.length === 1 };
  }, [active]);

  if (!active) return null;

  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-ink/15 bg-surface/90 shadow-card",
        className,
      )}
    >
      <div className="grid grid-cols-2 border-b border-ink/10 lg:grid-cols-4">
        {series.map((item) => {
          const selected = item.key === active.key;
          const itemDelta = formatDelta(item.deltaToday);
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setActiveKey(item.key)}
              className={cn(
                "relative cursor-pointer px-4 py-4 text-left transition-colors sm:px-5 sm:py-5",
                selected ? "bg-ink/[0.04]" : "hover:bg-ink/[0.03]",
              )}
            >
              {selected ? (
                <motion.span
                  layoutId="metric-tab-underline"
                  className="absolute inset-x-0 bottom-0 h-0.5 bg-accent"
                  transition={{ type: "spring", stiffness: 420, damping: 36 }}
                />
              ) : null}
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-600">
                {item.label}
              </p>
              <div className="mt-2 flex flex-wrap items-end gap-2">
                <p className="text-2xl font-semibold tracking-tight tabular-nums text-ink sm:text-[1.75rem]">
                  {formatCount(item.current)}
                </p>
                {itemDelta ? (
                  <span
                    className={cn(
                      "mb-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
                      item.deltaToday && item.deltaToday > 0
                        ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                        : item.deltaToday && item.deltaToday < 0
                          ? "bg-rose-500/15 text-rose-700 dark:text-rose-300"
                          : "bg-ink/5 text-ink-600",
                    )}
                  >
                    {itemDelta}
                  </span>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>

      <div className="relative px-3 pb-3 pt-2 sm:px-5 sm:pb-5">
        <div className="mb-1 flex items-end justify-between gap-3 px-1 pt-3">
          <div>
            <AnimatePresence mode="wait">
              <motion.p
                key={active.key}
                initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
                transition={{ duration: 0.22 }}
                className="text-sm font-medium text-ink"
              >
                {active.label} over time
              </motion.p>
            </AnimatePresence>
            <p className="mt-1 text-xs text-ink-600">
              Daily snapshots from YouTube sync — the curve fills in as you refresh over days
            </p>
          </div>
        </div>

        <div className="relative mt-3 overflow-hidden rounded-xl border border-ink/10 bg-gradient-to-b from-muted/80 to-transparent">
          <svg
            viewBox={`0 0 ${chart.width} ${chart.height}`}
            className="h-[220px] w-full sm:h-[280px]"
            role="img"
            aria-label={`${active.label} chart`}
          >
            <defs>
              <linearGradient id={`${gradientId}-fill`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--palette-accent)" stopOpacity="0.32" />
                <stop offset="55%" stopColor="var(--palette-accent)" stopOpacity="0.08" />
                <stop offset="100%" stopColor="var(--palette-accent)" stopOpacity="0" />
              </linearGradient>
              <linearGradient id={`${gradientId}-stroke`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--palette-accent-600)" />
                <stop offset="100%" stopColor="var(--palette-accent)" />
              </linearGradient>
            </defs>

            {[0.2, 0.4, 0.6, 0.8].map((ratio) => (
              <line
                key={ratio}
                x1="28"
                x2="972"
                y1={32 + ratio * 256}
                y2={32 + ratio * 256}
                stroke="currentColor"
                className="text-ink/10"
                strokeDasharray="5 10"
              />
            ))}

            <motion.path
              d={chart.area}
              fill={`url(#${gradientId}-fill)`}
              initial={false}
              animate={{ d: chart.area, opacity: 1 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.55, ease }}
            />
            <motion.path
              d={chart.line}
              fill="none"
              stroke={`url(#${gradientId}-stroke)`}
              strokeWidth="3.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={reduceMotion ? false : { pathLength: 0 }}
              animate={{ d: chart.line, pathLength: 1 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.7, ease }}
            />
            <AnimatePresence mode="popLayout">
              {(chart.singlePoint ? chart.dots.slice(-1) : chart.dots).map((dot, index) => (
                <motion.circle
                  key={`${active.key}-${dot.label}-${index}`}
                  cx={dot.x}
                  cy={dot.y}
                  r="5.5"
                  fill="var(--palette-surface)"
                  stroke="var(--palette-accent)"
                  strokeWidth="2.5"
                  initial={reduceMotion ? false : { scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1, cx: dot.x, cy: dot.y }}
                  exit={reduceMotion ? undefined : { scale: 0.4, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 380, damping: 24, delay: index * 0.04 }}
                >
                  <title>
                    {dot.label}: {formatCount(dot.value)}
                  </title>
                </motion.circle>
              ))}
            </AnimatePresence>
          </svg>

          <div className="flex justify-between gap-2 px-4 pb-3 text-[11px] text-ink-600">
            {active.points.map((point) => (
              <span key={`${active.key}-${point.date}`} className="truncate tabular-nums">
                {point.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
