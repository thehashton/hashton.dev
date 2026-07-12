import { desc } from "drizzle-orm";
import { Plus, Save } from "lucide-react";

import {
  addMilestone,
  deleteGoal,
  updateGoalProgress,
  updateGoalTarget,
} from "@/app/dashboard/actions";
import { ActionForm } from "@/components/dashboard/action-form";
import { ConfirmDeleteButton } from "@/components/dashboard/confirm-delete-button";
import { GoalCreateForm } from "@/components/dashboard/goal-create-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { db } from "@/db";
import { goals, milestones, socialChannels } from "@/db/schema";
import { requireAppSession } from "@/lib/auth/session";
import { asDayString, londonToday } from "@/lib/social-stats";
import { getGoalMetric, resolveMetricValue } from "@/lib/goal-metrics";

export default async function GoalsPage() {
  const session = await requireAppSession();
  const canEdit = session.profile.role !== "viewer";
  const [goalRows, milestoneRows, channelRows] = await Promise.all([
    db.select().from(goals).orderBy(desc(goals.updatedAt)),
    db.select().from(milestones),
    db.select().from(socialChannels).orderBy(socialChannels.label),
  ]);

  const today = londonToday();
  const channelById = new Map(channelRows.map((channel) => [channel.id, channel]));

  const formChannels = channelRows.map((channel) => ({
    id: channel.id,
    key: channel.key,
    label: channel.label,
    channelTitle: channel.channelTitle,
    followerCount: channel.followerCount,
    dayStartCount: channel.dayStartCount,
    dayStartDate: asDayString(channel.dayStartDate) ?? today,
    viewCount: channel.viewCount,
    dayStartViewCount: channel.dayStartViewCount,
    videoCount: channel.videoCount,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Goals & milestones</h1>
        <p className="mt-2 text-ink-700 dark:text-ink-800">
          Tie targets to live social metrics — YouTube syncs from the Data API; other channels use
          stored follower counts until their APIs are wired.
        </p>
      </div>

      {canEdit ? (
        <Card>
          <CardHeader>
            <CardTitle>New goal</CardTitle>
            <CardDescription>
              Pick a channel and metric. Current progress is filled from synced social data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GoalCreateForm channels={formChannels} />
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4">
        {goalRows.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-ink-700 dark:text-ink-800">
              No goals yet.
            </CardContent>
          </Card>
        ) : (
          goalRows.map((goal) => {
            const channel = goal.channelId ? channelById.get(goal.channelId) : undefined;
            const metric = getGoalMetric(goal.metricKey);
            const liveCurrent =
              channel && metric
                ? resolveMetricValue(channel, metric.key, today)
                : goal.currentValue;
            const current = channel && metric ? liveCurrent : goal.currentValue;
            const pct =
              goal.targetValue > 0
                ? Math.min(100, Math.round((current / goal.targetValue) * 100))
                : 0;
            const goalMilestones = milestoneRows.filter((m) => m.goalId === goal.id);
            const synced = Boolean(goal.channelId && goal.metricKey);

            return (
              <Card key={goal.id}>
                <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <CardTitle>{goal.title}</CardTitle>
                      <Badge variant="secondary">{goal.platform}</Badge>
                      {metric ? <Badge variant="accent">{metric.label}</Badge> : null}
                      {synced ? (
                        <Badge variant="secondary" className="font-normal">
                          Live sync
                        </Badge>
                      ) : null}
                    </div>
                    <CardDescription>
                      {current.toLocaleString()} / {goal.targetValue.toLocaleString()} ({pct}%)
                      {channel ? (
                        <span className="text-ink-600">
                          {" "}
                          · {channel.channelTitle || channel.label}
                        </span>
                      ) : null}
                    </CardDescription>
                  </div>
                  {canEdit ? (
                    <ConfirmDeleteButton
                      title={`Delete “${goal.title}”?`}
                      description="This permanently removes the goal and its milestones. This cannot be undone."
                      confirmLabel="Delete goal"
                      success="Goal deleted."
                      formData={{ id: goal.id }}
                      onConfirm={deleteGoal}
                    />
                  ) : null}
                </CardHeader>
                <CardContent className="space-y-5">
                  <Progress value={pct} />
                  {goal.notes ? (
                    <p className="text-sm text-ink-700 dark:text-ink-800">{goal.notes}</p>
                  ) : null}
                  {metric ? (
                    <p className="text-sm text-ink-600">{metric.description}</p>
                  ) : null}

                  {canEdit ? (
                    synced ? (
                      <ActionForm
                        action={updateGoalTarget}
                        success="Target updated."
                        className="flex flex-wrap items-end gap-3"
                      >
                        <input type="hidden" name="id" value={goal.id} />
                        <div className="space-y-2">
                          <Label htmlFor={`target-${goal.id}`}>Target</Label>
                          <Input
                            id={`target-${goal.id}`}
                            name="targetValue"
                            type="number"
                            min={0}
                            defaultValue={goal.targetValue}
                            className="w-40"
                          />
                        </div>
                        <Button type="submit" variant="accent" size="sm">
                          <Save aria-hidden />
                          Save target
                        </Button>
                        <p className="w-full text-xs text-ink-600 sm:w-auto sm:pb-2">
                          Current value syncs from social data on refresh.
                        </p>
                      </ActionForm>
                    ) : (
                      <ActionForm
                        action={updateGoalProgress}
                        success="Progress saved."
                        className="flex flex-wrap items-end gap-3"
                      >
                        <input type="hidden" name="id" value={goal.id} />
                        <div className="space-y-2">
                          <Label htmlFor={`current-${goal.id}`}>Update current</Label>
                          <Input
                            id={`current-${goal.id}`}
                            name="currentValue"
                            type="number"
                            min={0}
                            defaultValue={goal.currentValue}
                            className="w-40"
                          />
                        </div>
                        <Button type="submit" variant="accent" size="sm">
                          <Save aria-hidden />
                          Save
                        </Button>
                      </ActionForm>
                    )
                  ) : null}

                  <div className="space-y-3 rounded-xl border border-ink/10 p-4">
                    <p className="text-sm font-medium">Milestones</p>
                    {goalMilestones.length === 0 ? (
                      <p className="text-sm text-ink-700 dark:text-ink-800">None yet.</p>
                    ) : (
                      <ul className="space-y-2">
                        {goalMilestones.map((m) => (
                          <li
                            key={m.id}
                            className="flex items-center justify-between gap-3 text-sm text-ink-800 dark:text-ink-900"
                          >
                            <span className="flex items-center gap-2">
                              {m.label}
                              {m.reachedAt ? (
                                <Badge variant="accent" className="font-normal">
                                  Reached
                                </Badge>
                              ) : null}
                            </span>
                            <span className="tabular-nums">{m.targetValue.toLocaleString()}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {canEdit ? (
                      <ActionForm
                        action={addMilestone}
                        success="Milestone added."
                        className="grid gap-3 sm:grid-cols-[1fr_120px_auto]"
                      >
                        <input type="hidden" name="goalId" value={goal.id} />
                        <Input name="label" placeholder="Milestone label" required />
                        <Input
                          name="targetValue"
                          type="number"
                          min={0}
                          placeholder="Target"
                          required
                        />
                        <Button type="submit" variant="outline" size="sm">
                          <Plus aria-hidden />
                          Add
                        </Button>
                      </ActionForm>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
