import { redirect } from "next/navigation";

import { getAppSession } from "@/lib/auth/session";
import LoginForm from "./login-form";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const session = await getAppSession();
  if (session) redirect("/dashboard");
  return <LoginForm />;
}
