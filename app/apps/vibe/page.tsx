import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { VibeApp } from "./vibe-app";

export default async function VibePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav user={session.user} />
      <VibeApp />
    </div>
  );
}