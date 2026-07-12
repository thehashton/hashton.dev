import { SettingsForms } from "@/components/dashboard/settings-forms";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { canManageUsers, requireAppSession } from "@/lib/auth/session";

export default async function SettingsPage() {
  const session = await requireAppSession();
  const users = await db.select().from(profiles).orderBy(profiles.createdAt);

  return (
    <SettingsForms canManage={canManageUsers(session.profile.role)} users={users} />
  );
}
