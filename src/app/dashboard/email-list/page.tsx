import { desc } from "drizzle-orm";
import { Download, Filter, UserMinus } from "lucide-react";

import { unsubscribeEmail } from "@/app/dashboard/actions";
import { ActionForm } from "@/components/dashboard/action-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { db } from "@/db";
import { emailSubscribers } from "@/db/schema";
import { canManageUsers, requireAppSession } from "@/lib/auth/session";

export default async function EmailListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const session = await requireAppSession();
  const { q } = await searchParams;
  const query = q?.trim().toLowerCase();

  const rows = await db.select().from(emailSubscribers).orderBy(desc(emailSubscribers.subscribedAt));
  const filtered = query
    ? rows.filter(
        (row) =>
          row.email.toLowerCase().includes(query) ||
          (row.name?.toLowerCase().includes(query) ?? false),
      )
    : rows;

  const canManage = canManageUsers(session.profile.role);
  const csv = [
    "email,name,source,status,subscribed_at",
    ...filtered.map(
      (r) =>
        `${r.email},${r.name ?? ""},${r.source},${r.status},${r.subscribedAt.toISOString()}`,
    ),
  ].join("\n");

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Email list</h1>
          <p className="mt-2 text-ink-700 dark:text-ink-800">
            {filtered.length} subscriber{filtered.length === 1 ? "" : "s"}
            {query ? ` matching “${query}”` : ""}.
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <a href={`data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`} download="email-list.csv">
            <Download aria-hidden />
            Export CSV
          </a>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search</CardTitle>
          <CardDescription>Filter by email or name.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-wrap gap-3">
            <Input
              name="q"
              defaultValue={q ?? ""}
              placeholder="Search…"
              className="min-w-[16rem] flex-1"
            />
            <Button type="submit" variant="outline" size="sm">
              <Filter aria-hidden />
              Filter
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-ink/10 text-ink-700 dark:text-ink-800">
                <tr>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Source</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Joined</th>
                  {canManage ? <th className="px-5 py-3 font-medium">Actions</th> : null}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={canManage ? 6 : 5} className="px-5 py-10 text-center text-ink-700 dark:text-ink-800">
                      No subscribers yet.
                    </td>
                  </tr>
                ) : (
                  filtered.map((row) => (
                    <tr key={row.id} className="border-b border-ink/5">
                      <td className="px-5 py-3 font-medium">{row.email}</td>
                      <td className="px-5 py-3 text-ink-800 dark:text-ink-900">{row.name ?? "—"}</td>
                      <td className="px-5 py-3 text-ink-800 dark:text-ink-900">{row.source}</td>
                      <td className="px-5 py-3">
                        <Badge variant={row.status === "active" ? "accent" : "secondary"}>
                          {row.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 text-ink-800 dark:text-ink-900">
                        {row.subscribedAt.toLocaleDateString("en-GB")}
                      </td>
                      {canManage ? (
                        <td className="px-5 py-3">
                          {row.status === "active" ? (
                            <ActionForm action={unsubscribeEmail} success="Subscriber unsubscribed.">
                              <input type="hidden" name="id" value={row.id} />
                              <Button type="submit" variant="destructive" size="sm">
                                <UserMinus aria-hidden />
                                Unsubscribe
                              </Button>
                            </ActionForm>
                          ) : (
                            "—"
                          )}
                        </td>
                      ) : null}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
