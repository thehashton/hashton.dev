"use client";

import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { createGoal } from "@/app/dashboard/actions";
import { ActionForm } from "@/components/dashboard/action-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  formatMetricValue,
  metricsForPlatform,
  platformFromChannelKey,
  resolveMetricValue,
  type GoalMetricKey,
} from "@/lib/goal-metrics";
import { cn } from "@/lib/utils";

export type GoalFormChannel = {
  id: string;
  key: string;
  label: string;
  channelTitle: string | null;
  followerCount: number;
  dayStartCount: number;
  dayStartDate: string;
  viewCount: number;
  dayStartViewCount: number;
  videoCount: number;
};

type GoalCreateFormProps = {
  channels: GoalFormChannel[];
};

export function GoalCreateForm({ channels }: GoalCreateFormProps) {
  const youtubeFirst =
    channels.find((channel) => channel.key.toLowerCase() === "youtube") ?? channels[0];
  const [channelId, setChannelId] = useState(youtubeFirst?.id ?? "");
  const channel = channels.find((item) => item.id === channelId) ?? youtubeFirst;
  const platform = channel ? platformFromChannelKey(channel.key) : "other";
  const metrics = useMemo(() => metricsForPlatform(platform), [platform]);

  const [metricKey, setMetricKey] = useState<GoalMetricKey>(
    () => metrics[0]?.key ?? "subscribers",
  );
  const metric = metrics.find((item) => item.key === metricKey) ?? metrics[0];
  const [title, setTitle] = useState(metric?.defaultTitle ?? "");
  const [targetValue, setTargetValue] = useState(String(metric?.suggestedTargets[0] ?? 1000));
  const [titleTouched, setTitleTouched] = useState(false);

  const liveValue =
    channel && metric ? resolveMetricValue(channel, metric.key) : 0;

  function selectChannel(nextId: string) {
    setChannelId(nextId);
    const nextChannel = channels.find((item) => item.id === nextId);
    if (!nextChannel) return;
    const nextPlatform = platformFromChannelKey(nextChannel.key);
    const nextMetrics = metricsForPlatform(nextPlatform);
    const nextMetric = nextMetrics[0];
    if (!nextMetric) return;
    setMetricKey(nextMetric.key);
    setTargetValue(String(nextMetric.suggestedTargets[0] ?? 1000));
    if (!titleTouched) setTitle(nextMetric.defaultTitle);
  }

  function selectMetric(nextKey: GoalMetricKey) {
    setMetricKey(nextKey);
    const nextMetric = metrics.find((item) => item.key === nextKey);
    if (!nextMetric) return;
    setTargetValue(String(nextMetric.suggestedTargets[0] ?? 1000));
    if (!titleTouched) setTitle(nextMetric.defaultTitle);
  }

  if (channels.length === 0) {
    return (
      <p className="text-sm text-ink-700 dark:text-ink-800">
        Add a social channel first, then create goals against its live metrics.
      </p>
    );
  }

  return (
    <ActionForm action={createGoal} success="Goal created." className="grid gap-4 sm:grid-cols-2">
      <input type="hidden" name="channelId" value={channelId} />
      <input type="hidden" name="metricKey" value={metric?.key ?? ""} />

      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="channelId">Channel</Label>
        <Select
          id="channelId"
          value={channelId}
          onChange={(event) => selectChannel(event.target.value)}
        >
          {channels.map((item) => (
            <option key={item.id} value={item.id}>
              {item.channelTitle || item.label} ({item.key})
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label>Metric</Label>
        <div className="grid gap-2 sm:grid-cols-2">
          {metrics.map((item) => {
            const selected = item.key === metric?.key;
            const value = channel ? resolveMetricValue(channel, item.key) : 0;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => selectMetric(item.key)}
                className={cn(
                  "cursor-pointer rounded-xl border px-3.5 py-3 text-left transition-colors",
                  selected
                    ? "border-accent bg-accent/10"
                    : "border-ink/15 bg-surface hover:border-ink/30 hover:bg-ink/[0.03]",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-ink">{item.label}</p>
                  <span className="tabular-nums text-xs text-ink-600">
                    {formatMetricValue(value)}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-ink-600">{item.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          required
          value={title}
          onChange={(event) => {
            setTitleTouched(true);
            setTitle(event.target.value);
          }}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="targetValue">Target</Label>
        <Input
          id="targetValue"
          name="targetValue"
          type="number"
          min={0}
          value={targetValue}
          onChange={(event) => setTargetValue(event.target.value)}
        />
        {metric ? (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {metric.suggestedTargets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setTargetValue(String(preset))}
                className={cn(
                  "cursor-pointer rounded-full border px-2.5 py-1 text-xs transition-colors",
                  String(preset) === targetValue
                    ? "border-accent bg-accent/10 text-accent-600"
                    : "border-ink/15 text-ink-700 hover:border-ink/30",
                )}
              >
                {formatMetricValue(preset)}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label>Current (live)</Label>
        <div className="flex h-12 items-center rounded-lg border border-ink/15 bg-muted/60 px-4 tabular-nums text-ink">
          {formatMetricValue(liveValue)}
        </div>
        <p className="text-xs text-ink-600">
          Filled from synced channel data — updates when you refresh social stats.
        </p>
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" placeholder="Optional context" />
      </div>

      <div className="sm:col-span-2">
        <Button type="submit" variant="accent" size="sm">
          <Plus aria-hidden />
          Create goal
        </Button>
      </div>
    </ActionForm>
  );
}
