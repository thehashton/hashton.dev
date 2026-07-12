"use client";

import { KeyRound, UserPlus } from "lucide-react";
import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";

import { changePasswordAction, createUserAction } from "@/app/dashboard/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import type { Profile, UserRole } from "@/db/schema";

function useActionToast(state: { ok?: true; error?: string } | null, success: string) {
  const last = useRef(state);
  useEffect(() => {
    if (!state || state === last.current) return;
    last.current = state;
    if ("error" in state && state.error) {
      toast.error(state.error);
      return;
    }
    if ("ok" in state && state.ok) {
      toast.success(success);
    }
  }, [state, success]);
}

export function SettingsForms({
  canManage,
  users,
}: {
  canManage: boolean;
  users: Profile[];
}) {
  const [passwordState, passwordAction, passwordPending] = useActionState(
    changePasswordAction,
    null,
  );
  const [createState, createAction, createPending] = useActionState(createUserAction, null);

  useActionToast(passwordState, "Password updated.");
  useActionToast(createState, "User created.");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-2 text-ink-700 dark:text-ink-800">Password and user management.</p>
      </div>

      <div className={`grid gap-6 ${canManage ? "lg:grid-cols-2" : ""}`}>
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Change password</CardTitle>
            <CardDescription>Update the password for your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={passwordAction} className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current password</Label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New password</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                />
              </div>
              <Button type="submit" variant="accent" size="sm" disabled={passwordPending}>
                <KeyRound aria-hidden />
                {passwordPending ? "Saving…" : "Update password"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {canManage ? (
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Create user</CardTitle>
              <CardDescription>Invite collaborators with a role.</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={createAction} className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" required placeholder="hashton" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" required minLength={8} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select id="role" name="role" defaultValue="viewer">
                    {(["viewer", "admin", "owner"] as UserRole[]).map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="sm:col-span-2">
                  <Button type="submit" variant="accent" size="sm" disabled={createPending}>
                    <UserPlus aria-hidden />
                    {createPending ? "Creating…" : "Create user"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : null}
      </div>

      {canManage ? (
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>Everyone with dashboard access.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-ink/25 px-4 py-3"
              >
                <div>
                  <p className="font-medium">{user.displayName}</p>
                  <p className="text-base text-ink-700 dark:text-ink-800">{user.email}</p>
                </div>
                <Badge variant="secondary">{user.role}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
